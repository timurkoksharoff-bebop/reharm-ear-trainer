extends Node
var failures := 0

func check(ok: bool, reason: String) -> void:
	if not ok:
		failures += 1
		push_error(reason)

func run(game: Control) -> void:
	await get_tree().process_frame
	check(game.prepared, "Audio fixture missing")
	game.toggle.pressed.emit()
	await get_tree().create_timer(4.8).timeout
	check(game.mission.cursor == 0, "Audio clock did not advance from the tonic to chord 1")
	check(game.mission.seconds > 0.3, "Active run clock did not advance")
	game.toggle.pressed.emit()
	var seconds: float = game.mission.seconds
	var oxygen: float = game.flight.oxygen
	await get_tree().create_timer(0.5).timeout
	check(is_equal_approx(seconds, game.mission.seconds), "Pause advanced time")
	check(is_equal_approx(oxygen, game.flight.oxygen), "Pause spent O2")
	game.toggle.pressed.emit()
	await get_tree().create_timer(0.2).timeout
	var target: Dictionary = game.mission.current()
	game.submit("degree", int(target.offset))
	game.submit("quality", target.quality)
	check(game.mission.progress[0].degree and game.mission.progress[0].quality, "UI answer submission failed")
	var before: Vector2 = game.flight.ship
	var key := InputEventKey.new()
	key.physical_keycode = KEY_RIGHT
	key.pressed = true
	Input.parse_input_event(key)
	await get_tree().create_timer(0.15).timeout
	key.pressed = false
	Input.parse_input_event(key)
	check(game.flight.ship.x > before.x, "Keyboard flight input failed")
	game.transport.seek_chord(game.mission.route.sequence.size() - 1)
	game.previous_audio = game.transport.last_position
	var before_loop: float = game.mission.seconds
	await get_tree().create_timer(4.4).timeout
	check(game.mission.cursor == 0, "Loop did not return to the first chord without the tonic")
	check(game.mission.seconds - before_loop > 4.0, "Loop lost active time")
	game.ignore_external_focus = false
	game.get_window().focus_exited.emit()
	game.ignore_external_focus = true
	check(not game.mission.running and game.transport.player.stream_paused, "Focus loss did not pause both audio and game")
	var out := OS.get_environment("EAR_YOGA_QA_DIR")
	if out.is_empty():
		out = "user://qa"
	DirAccess.make_dir_recursive_absolute(out)
	for viewport in [Vector2i(1200, 800), Vector2i(430, 932), Vector2i(390, 844), Vector2i(844, 390)]:
		get_window().size = viewport
		await get_tree().process_frame
		await get_tree().process_frame
		game.layout()
		await get_tree().process_frame
		await get_tree().process_frame
		check(game.root_panel.get_global_rect().end.y <= game.vitals.position.y + 2, "ROOT overlaps resources at " + str(viewport))
		check(game.quality_panel.get_global_rect().end.x <= game.size.x, "Quality panel overflows at " + str(viewport))
		check(game.panel.get_global_rect().end.y <= game.quality_panel.position.y + 2, "Header overlaps answers at " + str(viewport))
		RenderingServer.force_draw()
		var image := get_viewport().get_texture().get_image()
		check(image != null and not image.is_empty(), "Rendered image missing")
		image.save_png(out.path_join("godot-%dx%d.png" % [viewport.x, viewport.y]))
	game.mode_picker.select(1)
	game.select_route()
	check(not game.mission.teacher and not game.meters.oxygen.box.visible, "Student mode has Teacher-only O2")
	game.route_picker.select(3)
	game.mode_picker.select(0)
	game.select_route()
	check(game.bass_panel.visible, "Slash-bass route has no independent BASS panel")
	get_window().size = Vector2i(390, 844)
	await get_tree().process_frame
	await get_tree().process_frame
	game.layout()
	await get_tree().process_frame
	await get_tree().process_frame
	check(game.bass_panel.get_global_rect().end.x <= game.stage.position.x, "BASS overlaps flight area in portrait")
	check(game.quality_panel.get_global_rect().end.y < game.root_panel.position.y, "Chord answers overlap ROOT in portrait")
	RenderingServer.force_draw()
	get_viewport().get_texture().get_image().save_png(out.path_join("godot-slash-bass-portrait.png"))
	get_window().size = Vector2i(1200, 800)
	await get_tree().process_frame
	RenderingServer.force_draw()
	get_viewport().get_texture().get_image().save_png(out.path_join("godot-slash-bass.png"))
	game.route_picker.select(4)
	game.select_route()
	game.change_page(1)
	check(game.route_nodes[0].get_meta("index") == 8, "Long route paging lost positions")
	check(game.route_nodes.size() == mini(8, game.mission.route.sequence.size() - 8), "Long route page has wrong position count")
	print("Godot renderer/UI/audio smoke: %d failures. Screenshots: %s" % [failures, out])
	get_tree().quit(0 if failures == 0 else 1)
