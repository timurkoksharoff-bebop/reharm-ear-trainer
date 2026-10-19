extends RefCounted
## EAR YOGA resources belong to this planet, not to the shared mission model.
var resources := {"fuel": 86.0, "water": 78.0, "crew": 92.0, "hull": 84.0}
var oxygen := 80.0
var critical := 0.0
var failed := false
var ship := Vector2(0.5, 0.62)
var entities: Array = []
var flashes: Array = []
var spawn_clock := 3.0
var supply_clock := 6.0
var rng := RandomNumberGenerator.new()
const LABELS = ["1", "♭9", "9", "♭3", "3", "11", "♯11", "5", "♭13", "13", "♭7", "7"]
const SUPPLIES = ["fuel", "water", "crew", "hull"]

func _init() -> void:
	rng.randomize()

static func drain_scale(length: int, bar: float = 4.0) -> float:
	return minf(1.0, 100.0 / ((length + 1) * bar)) if length > 0 and bar > 0 else 1.0

func wrong_answer(kind: String, value: Variant, quality_order: Array) -> void:
	var resource: String
	if kind in ["degree", "bass"]:
		resource = "fuel" if int(value) < 6 else "water"
	else:
		resource = "crew" if quality_order.find(value) % 2 == 0 else "hull"
	resources[resource] = maxf(0.0, resources[resource] - 3.0)

func update(dt: float, mission: RefCounted, chord_elapsed: float, viewport: Vector2) -> Array:
	var events: Array = []
	if failed or not mission.running or mission.complete:
		if mission.complete:
			entities.clear()
		return events
	var scale := drain_scale(mission.route.sequence.size(), mission.bar_seconds)
	for key in SUPPLIES:
		resources[key] = maxf(0.0, resources[key] - dt * scale * {"fuel": 0.32, "water": 0.22, "crew": 0.14, "hull": 0.10}[key])
	resources.fuel = maxf(0.0, resources.fuel - dt * scale * 0.14)
	resources.water = maxf(0.0, resources.water - dt * scale * 0.05)
	resources.crew = maxf(0.0, resources.crew - dt * scale * (0.008 + maxf(0.0, 18.0 - resources.water) * 0.002))
	if resources.fuel < 6.0:
		resources.hull = maxf(0.0, resources.hull - dt * scale * (6.0 - resources.fuel) * 0.01)
	var ready: bool = mission.cursor >= 0
	if ready and mission.teacher:
		oxygen = maxf(0.0, oxygen - dt * 0.45 * scale * mission.current().oxygen.drain)
		if mission.solved_chords() >= 2:
			spawn_clock -= dt
			if spawn_clock <= 0.0 and entities.filter(func(e): return e.kind == "tone").size() < 4:
				spawn_tone(LABELS[rng.randi_range(0, 11)])
				var solved: float = maxf(0, mission.solved_chords() - 2)
				var progress: float = clampf(solved / maxf(1, mission.route.sequence.size() - 2), 0, 1)
				spawn_clock = rng.randf_range(4.2, 5.4) * (2.0 - progress)
	supply_clock -= dt
	if ready and supply_clock <= 0:
		# A small slice of the existing supply system. Artifact inventory,
		# hazards and arrangement flowers are separate follow-up work.
		entities.append({"kind": SUPPLIES[rng.randi_range(0, 3)], "label": "", "pos": Vector2(rng.randf_range(0.2, 0.8), -0.08), "vy": 0.10})
		supply_clock = rng.randf_range(9, 13)
	for e in entities.duplicate():
		e.pos.y += dt * e.vy
		if e.pos.y > 1.12:
			entities.erase(e)
		elif ready and ((e.pos - ship) * viewport).length() < 32.2:
			var event: Dictionary
			if e.kind == "tone":
				event = collect(e.label, mission, chord_elapsed)
			else:
				var amount: float = {"fuel": 10.0, "water": 9.0, "crew": 8.0, "hull": 7.0}[e.kind]
				var before: float = resources[e.kind]
				resources[e.kind] = minf(100.0, before + amount)
				event = {"label": e.kind.to_upper(), "delta": resources[e.kind] - before, "verdict": "valid"}
			event.pos = e.pos
			event.age = 0.0
			flashes.append(event)
			events.append(event)
			entities.erase(e)
	for flash in flashes:
		flash.age += dt
	flashes = flashes.filter(func(f): return f.age < 1.8)
	var empty: bool = resources.values().any(func(v): return v <= 0.0) or (mission.teacher and oxygen <= 0.0)
	critical = critical + dt if empty else 0.0
	failed = critical >= 3.5
	return events

func spawn_tone(label: String) -> void:
	entities.append({"kind": "tone", "label": label, "pos": Vector2((0.22 if rng.randf() < 0.5 else 0.70) + rng.randf() * 0.08, -0.08), "vy": rng.randf_range(0.10, 0.118)})

func collect(label: String, mission: RefCounted, elapsed: float) -> Dictionary:
	var chord: Dictionary = mission.current()
	var verdict: String = chord.tensions.get(label, "neutral")
	if elapsed < 0.18 or mission.bar_seconds - elapsed < 0.18:
		verdict = "neutral"
	var scale := drain_scale(mission.route.sequence.size(), mission.bar_seconds)
	var delta: float = chord.oxygen.reward * scale if verdict == "valid" else -20.0 if verdict == "invalid" else 0.0
	var before := oxygen
	oxygen = clampf(oxygen + delta, 0, 100)
	var midi := 60 + posmod(int(mission.route.baseTonic) + int(chord.offset), 12) + LABELS.find(label) + 12
	mission.tone(verdict, midi, mission.cursor)
	return {"label": label, "delta": oxygen - before, "verdict": verdict, "midi": midi}
