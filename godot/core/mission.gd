extends RefCounted
## Pure exercise state. No scenes, clocks, audio or platform storage.
signal changed

var route: Dictionary
var teacher := true
var cursor := -1
var running := false
var complete := false
var base_played := false
var round_number := 1
var progress: Array = []
var seconds := 0.0
var bonus := 0
var misses := 0
var tone_bonus := 0
var tone_keys: Dictionary = {}
var bar_seconds := 4.0

func configure(value: Dictionary, mode: String = "teacher") -> void:
	route = value
	teacher = mode == "teacher"
	restart()

func restart() -> void:
	cursor = -1
	running = false
	complete = false
	base_played = false
	round_number = 1
	seconds = 0.0
	bonus = 0
	misses = 0
	tone_bonus = 0
	tone_keys.clear()
	progress.clear()
	for _chord in route.sequence:
		var parts := {"degree": false, "quality": false}
		if teacher:
			parts.bass = false
		progress.append(parts)
	changed.emit()

func start() -> void:
	if running:
		return
	running = true
	if complete or (cursor < 0 and base_played):
		advance()
	base_played = true
	changed.emit()

func pause() -> void:
	running = false
	changed.emit()

func advance() -> void:
	if not running:
		return
	cursor += 1
	if cursor >= route.sequence.size():
		cursor = 0
		round_number += 1
	changed.emit()

func current() -> Dictionary:
	return route.reference if cursor < 0 else route.sequence[cursor]

func total_parts() -> int:
	return route.sequence.size() * (3 if teacher else 2)

func solved_parts() -> int:
	var count := 0
	for parts in progress:
		for kind in ["degree", "quality", "bass"] if teacher else ["degree", "quality"]:
			if parts.get(kind, false):
				count += 1
	return count

func solved_chords() -> int:
	var count := 0
	for parts in progress:
		if parts.degree and parts.quality and (not teacher or parts.bass):
			count += 1
	return count

func answer(kind: String, value: Variant) -> Dictionary:
	if not running or cursor < 0 or complete or kind not in (["degree", "quality", "bass"] if teacher else ["degree", "quality"]):
		return {"ignored": true}
	var parts: Dictionary = progress[cursor]
	if parts.get(kind, false):
		return {"ignored": true, "correct": true}
	var target := current()
	var bass := int(target.offset if target.get("bassOffset") == null else target.bassOffset)
	var expected: Variant = target.quality if kind == "quality" else bass if kind == "bass" else int(target.offset)
	var correct: bool = str(expected) == str(value) if kind == "quality" else int(expected) == int(value)
	var position := cursor
	if not correct:
		misses += 1
	else:
		parts[kind] = true
		# 1.36 also records an automatic bass in Student mode; it is not scored.
		if kind == "degree" and (not teacher or int(target.offset) == bass):
			parts.bass = true
		if solved_chords() == route.sequence.size():
			complete = true
			var lap: float = route.sequence.size() * bar_seconds
			bonus = int(floor(total_parts() * 300.0 / (1.0 + pow(seconds / maxf(1.0, lap), 2)) + 0.5))
			advance()
	changed.emit()
	return {"correct": correct, "position": position, "complete": complete}

func tick(dt: float) -> void:
	if running and not complete and cursor >= 0 and is_finite(dt):
		seconds += maxf(0.0, dt)

func tone(verdict: String, midi: int, position: int) -> void:
	if complete or verdict != "valid":
		return
	var key := "%s:%s" % [position, posmod(midi, 12)]
	if tone_keys.has(key):
		return
	tone_keys[key] = true
	tone_bonus = mini(tone_bonus + 10, mini(500, total_parts() * 10))

func score() -> int:
	return maxi(0, solved_parts() * 100 + tone_bonus - misses * 25) + bonus

func snapshot() -> Dictionary:
	return {"cursor": cursor, "running": running, "complete": complete, "progress": progress.duplicate(true), "score": score(), "seconds": seconds}
