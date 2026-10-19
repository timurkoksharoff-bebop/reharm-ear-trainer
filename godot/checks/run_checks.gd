extends SceneTree
const Mission = preload("res://core/mission.gd")
const Flight = preload("res://planets/ear_yoga/flight_state.gd")
const Records = preload("res://platform/local_records.gd")
var failures := 0
var checks := 0

func check(ok: bool, reason: String) -> void:
	checks += 1
	if not ok:
		failures += 1
		push_error(reason)

func _initialize() -> void:
	var input: Dictionary = JSON.parse_string(FileAccess.get_file_as_string("res://data/routes.json"))
	var traces: Array = JSON.parse_string(FileAccess.get_file_as_string("res://checks/legacy-traces.json"))
	var mission := Mission.new()
	for trace in traces:
		var action: Dictionary = trace.action
		match action.op:
			"configure":
				var route: Dictionary = input.routes.filter(func(r): return r.id == trace.route)[0]
				mission.configure(route, trace.mode)
			"start": mission.start()
			"pause": mission.pause()
			"advance": mission.advance()
			"restart": mission.restart()
			"tick": mission.tick(action.seconds)
			"answer":
				var result := mission.answer(action.kind, action.value)
				check(result.get("ignored", false) == trace.result.get("ignored", false), "Ignored input diverged: " + str(trace))
				if not result.get("ignored", false):
					check(result.correct == trace.result.correct, "Answer verdict diverged: " + str(trace))
		var actual := mission.snapshot()
		for field in trace.expected:
			check(actual[field] == trace.expected[field], "%s %s %s diverged on %s: %s != %s" % [trace.route, trace.mode, action.op, field, actual[field], trace.expected[field]])
	# Grading uses the collision chord, with neutral grace and exact deltas.
	var route: Dictionary = input.routes[0]
	mission.configure(route)
	mission.start()
	mission.advance()
	var flight := Flight.new()
	var valid_label: String = route.sequence[0].tensions.keys().filter(func(s): return route.sequence[0].tensions[s] == "valid")[0]
	var event := flight.collect(valid_label, mission, 0.1)
	check(event.verdict == "neutral" and is_zero_approx(event.delta), "Boundary must be neutral")
	flight.oxygen = 99
	event = flight.collect(valid_label, mission, 1.0)
	check(is_equal_approx(event.delta, 1.0), "Show the clamped actual reward")
	var score_before := mission.score()
	flight.collect(valid_label, mission, 1.0)
	check(mission.score() == score_before, "Repeated pitch class cannot farm score")
	var invalid_label: String = route.sequence[0].tensions.keys().filter(func(s): return route.sequence[0].tensions[s] == "invalid")[0]
	flight.oxygen = 80
	event = flight.collect(invalid_label, mission, 1.0)
	check(is_equal_approx(event.delta, -20), "Avoid tone must cost 20 O2")
	for length in [4, 32, 128]:
		var scale := Flight.drain_scale(length)
		check(scale > 0 and scale <= 1, "Invalid drain scale")
	var fps_energy: Array = []
	for fps in [2, 5, 15, 60]:
		flight = Flight.new()
		flight.supply_clock = 99999
		for _frame in fps * 20:
			flight.update(1.0 / fps, mission, 1.0, Vector2(800, 600))
		fps_energy.append(flight.oxygen)
	check(fps_energy.all(func(e): return absf(e - 71) < 0.001), "O2 expenditure must be FPS independent")
	mission.pause()
	var before := flight.resources.duplicate()
	flight.update(120, mission, 1.0, Vector2(800, 600))
	check(before == flight.resources, "Paused resources changed")
	mission.restart()
	mission.start()
	mission.advance()
	for i in route.sequence.size():
		mission.tick(2.0)
		var chord: Dictionary = mission.current()
		mission.answer("degree", chord.offset)
		mission.answer("quality", chord.quality)
		mission.answer("bass", chord.offset if chord.get("bassOffset") == null else chord.bassOffset)
		if not mission.complete:
			mission.advance()
	check(mission.complete, "Completion fixture failed")
	var frozen := mission.snapshot()
	mission.tick(100)
	mission.tone("valid", 80, 2)
	check(mission.snapshot() == frozen, "Completion must freeze score and time")
	before = flight.resources.duplicate()
	flight.update(100, mission, 1.0, Vector2(800, 600))
	check(before == flight.resources, "Completed listening spent resources")
	var record_path := "user://qa-records-%d.json" % Time.get_ticks_usec()
	var store := Records.new(record_path)
	check(store.save_completed(mission), "Could not persist completed score")
	var reloaded := Records.new(record_path)
	check(reloaded.best(route, true) == mission.score(), "Record did not survive reload")
	check(reloaded.best(route, false) == 0, "Student and Teacher records must be separate")
	check(not reloaded.save_completed(mission), "Equal record should not overwrite best")
	DirAccess.remove_absolute(ProjectSettings.globalize_path(record_path))
	print("Godot checks: %d assertions, %d golden states, %d failures" % [checks, traces.size(), failures])
	quit(0 if failures == 0 else 1)
