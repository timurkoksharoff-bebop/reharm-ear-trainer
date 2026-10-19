extends Control
## Composition root for one planet. Other planets need no ship/resources.
const Mission = preload("res://core/mission.gd")
const FlightState = preload("res://planets/ear_yoga/flight_state.gd")
const Transport = preload("res://platform/audio_transport.gd")
const Records = preload("res://platform/local_records.gd")
var mission := Mission.new()
var flight := FlightState.new()
var transport: Node
var records := Records.new()
var fixture: Dictionary
var route_picker: OptionButton
var mode_picker: OptionButton
var toggle: Button
var route_strip: HBoxContainer
var page_label: Label
var stats: Label
var message: Label
var heading: Label
var panel: PanelContainer
var root_grid: GridContainer
var bass_grid: GridContainer
var quality_grid: GridContainer
var bass_panel: VBoxContainer
var controls: HBoxContainer
var root_panel: VBoxContainer
var overlay: VBoxContainer
var quality_panel: VBoxContainer
var stage: Control
var background: TextureRect
var ship: TextureRect
var vitals: HBoxContainer
var meters: Dictionary = {}
var answer_buttons: Array = []
var route_nodes: Array = []
var elapsed := 0.0
var previous_audio := 0.0
var page := 0
var last_cursor := -2
var completion_saved := false
var clock := 0.0
var flash_timer := 0.0
var prepared := false
var dragging := false
var compact := false
var portrait := false
var short_view := false
var top_row: GridContainer
var pages_row: HBoxContainer
var smoke_mode := false
var ignore_external_focus := false
const INK = Color("e4f7f2")
const ACCENT = Color("93e3d2")

func _ready() -> void:
	smoke_mode = "--smoke" in OS.get_cmdline_user_args()
	ignore_external_focus = smoke_mode
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string("res://data/routes.json"))
	if not parsed is Dictionary or parsed.get("schema") != 1:
		show_error("Подготовьте проект: node godot/tools/prepare.mjs")
		return
	fixture = parsed
	transport = Transport.new()
	add_child(transport)
	build_theme()
	build_ui()
	resized.connect(layout)
	panel.resized.connect(func(): layout.call_deferred())
	get_window().focus_exited.connect(func():
		if not ignore_external_focus:
			pause_game()
	)
	get_tree().auto_accept_quit = false
	select_route()
	layout()
	if smoke_mode:
		transport.volume(0)
		run_smoke.call_deferred()

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED and is_instance_valid(transport):
		pause_game()
	if what == NOTIFICATION_WM_CLOSE_REQUEST:
		pause_game()
		get_tree().quit()

func show_error(text: String) -> void:
	var label := Label.new()
	label.text = text
	label.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	add_child(label)

func build_theme() -> void:
	theme = Theme.new()
	theme.default_font_size = 16
	theme.set_color("font_color", "Label", INK)
	for type in ["Button", "OptionButton"]:
		for state_name in ["normal", "hover", "pressed", "disabled", "focus"]:
			var style := StyleBoxFlat.new()
			style.bg_color = Color(0.04, 0.12, 0.15, 0.82) if state_name != "pressed" else Color(0.18, 0.36, 0.36, 0.96)
			style.border_color = Color(0.56, 0.83, 0.78, 0.36)
			style.set_border_width_all(1)
			style.set_corner_radius_all(9)
			style.content_margin_left = 4
			style.content_margin_right = 4
			style.content_margin_top = 6
			style.content_margin_bottom = 6
			theme.set_stylebox(state_name, type, style)
		theme.set_color("font_color", type, INK)
		theme.set_color("font_disabled_color", type, Color("94b4b0"))
	var panel_style := StyleBoxFlat.new()
	panel_style.bg_color = Color(0.025, 0.07, 0.10, 0.72)
	panel_style.set_corner_radius_all(16)
	panel_style.content_margin_left = 14
	panel_style.content_margin_right = 14
	panel_style.content_margin_top = 12
	panel_style.content_margin_bottom = 12
	theme.set_stylebox("panel", "PanelContainer", panel_style)

func label(text: String, font_size: int = 16) -> Label:
	var item := Label.new()
	item.text = text
	item.add_theme_font_size_override("font_size", font_size)
	return item

func button(text: String, callback: Callable) -> Button:
	var item := Button.new()
	item.text = text
	item.custom_minimum_size = Vector2(0, 38)
	item.pressed.connect(callback)
	return item

func build_ui() -> void:
	background = TextureRect.new()
	background.texture = load("res://assets/blue-gardens.webp")
	background.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	background.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	background.modulate = Color(0.72, 0.83, 0.85)
	background.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(background)
	stage = Control.new()
	stage.mouse_filter = Control.MOUSE_FILTER_STOP
	stage.gui_input.connect(stage_input)
	stage.draw.connect(draw_stage)
	add_child(stage)
	ship = TextureRect.new()
	ship.texture = load("res://assets/lotus.webp")
	ship.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	ship.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	ship.mouse_filter = Control.MOUSE_FILTER_IGNORE
	stage.add_child(ship)
	panel = PanelContainer.new()
	add_child(panel)
	overlay = VBoxContainer.new()
	overlay.add_theme_constant_override("separation", 8)
	panel.add_child(overlay)
	top_row = GridContainer.new()
	top_row.columns = 2
	top_row.add_theme_constant_override("h_separation", 16)
	overlay.add_child(top_row)
	var brand := VBoxContainer.new()
	brand.add_theme_constant_override("separation", 0)
	brand.add_child(label("EAR YOGA", 27))
	brand.add_child(label("Space Music College", 12))
	top_row.add_child(brand)
	controls = HBoxContainer.new()
	controls.add_theme_constant_override("separation", 8)
	controls.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top_row.add_child(controls)
	route_picker = OptionButton.new()
	route_picker.fit_to_longest_item = false
	route_picker.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	for route in fixture.routes:
		route_picker.add_item(route.name)
	route_picker.item_selected.connect(func(_index): select_route())
	controls.add_child(route_picker)
	mode_picker = OptionButton.new()
	mode_picker.fit_to_longest_item = false
	mode_picker.add_item("Преподаватель")
	mode_picker.add_item("Студент")
	mode_picker.item_selected.connect(func(_index): select_route())
	controls.add_child(mode_picker)
	toggle = button("▶ Старт", toggle_game)
	controls.add_child(toggle)
	controls.add_child(button("↻", select_route))
	var volume := HSlider.new()
	volume.min_value = 0
	volume.max_value = 1.2
	volume.step = 0.02
	volume.value = 1.0
	volume.custom_minimum_size = Vector2(76, 20)
	volume.tooltip_text = "Громкость"
	volume.value_changed.connect(func(value): transport.volume(value))
	controls.add_child(volume)
	var pages := HBoxContainer.new()
	pages_row = pages
	pages.add_child(button("‹", func(): change_page(-1)))
	page_label = label("Маршрут")
	page_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	page_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	pages.add_child(page_label)
	pages.add_child(button("›", func(): change_page(1)))
	overlay.add_child(pages)
	route_strip = HBoxContainer.new()
	route_strip.add_theme_constant_override("separation", 5)
	overlay.add_child(route_strip)
	heading = label("Тоника известна. Запусти последовательность.", 15)
	heading.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	overlay.add_child(heading)
	bass_panel = make_answer_panel("BASS", "bass", fixture.degrees, 3)
	bass_grid = bass_panel.get_child(1)
	quality_panel = make_answer_panel("АККОРД", "quality", [], 2)
	quality_grid = quality_panel.get_child(1)
	root_panel = make_answer_panel("ROOT", "degree", fixture.degrees, 6)
	root_grid = root_panel.get_child(1)
	message = label("", 17)
	message.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	message.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	add_child(message)
	vitals = HBoxContainer.new()
	vitals.add_theme_constant_override("separation", 10)
	add_child(vitals)
	for key in ["fuel", "water", "crew", "hull", "oxygen"]:
		var box := VBoxContainer.new()
		box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		var caption := label({"fuel": "FUEL", "water": "H₂O", "crew": "CREW", "hull": "HULL", "oxygen": "O₂"}[key], 12)
		box.add_child(caption)
		var meter := ProgressBar.new()
		meter.custom_minimum_size = Vector2(36, 20)
		meter.max_value = 100
		meter.show_percentage = false
		box.add_child(meter)
		meters[key] = {"box": box, "caption": caption, "meter": meter}
		vitals.add_child(box)
	stats = label("", 13)
	add_child(stats)

func make_answer_panel(title: String, kind: String, values: Array, columns: int) -> VBoxContainer:
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 6)
	box.add_child(label(title, 13))
	var grid := GridContainer.new()
	grid.columns = columns
	grid.add_theme_constant_override("h_separation", 5)
	grid.add_theme_constant_override("v_separation", 5)
	box.add_child(grid)
	add_child(box)
	for i in values.size():
		add_answer(grid, kind, i, values[i])
	return box

func add_answer(grid: GridContainer, kind: String, value: Variant, text: String) -> void:
	var item := button(text, func(): submit(kind, value))
	item.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	item.set_meta("kind", kind)
	item.set_meta("value", value)
	grid.add_child(item)
	answer_buttons.append(item)

func select_route() -> void:
	if not is_instance_valid(route_picker):
		return
	pause_game()
	var route: Dictionary = fixture.routes[route_picker.selected]
	mission.configure(route, "teacher" if mode_picker.selected == 0 else "student")
	flight = FlightState.new()
	prepared = transport.configure(route)
	elapsed = 0.0
	previous_audio = 0.0
	completion_saved = false
	last_cursor = -2
	page = 0
	for item in quality_grid.get_children():
		answer_buttons.erase(item)
		quality_grid.remove_child(item)
		item.queue_free()
	for choice in route.choices:
		add_answer(quality_grid, "quality", choice.value, choice.label)
	bass_panel.visible = mission.teacher and route.sequence.any(func(c): return c.get("bassOffset") != null and c.bassOffset != c.offset)
	meters.oxygen.box.visible = mission.teacher
	message.text = "Стрелки или WASD · на сенсорном экране веди Лотос пальцем"
	if not prepared:
		message.text = "Нет подготовленного аудио. Выполни node godot/tools/prepare.mjs и открой проект снова."
	toggle.disabled = not prepared
	rebuild_route_strip()
	refresh()
	layout()

func rebuild_route_strip() -> void:
	for item in route_strip.get_children():
		route_strip.remove_child(item)
		item.queue_free()
	route_nodes.clear()
	var count: int = mission.route.sequence.size()
	var paged := count > 12
	var start := page * 8 if paged else 0
	var end := mini(count, start + 8) if paged else count
	page_label.text = "%s · %s/%s" % [mission.route.id, page + 1, int(ceil(count / 8.0)) if paged else 1]
	for i in range(start, end):
		var item := label(str(i + 1) + "\n?", 14)
		item.custom_minimum_size = Vector2(0, 42)
		item.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		item.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		item.set_meta("index", i)
		route_strip.add_child(item)
		route_nodes.append(item)

func change_page(direction: int) -> void:
	var pages := int(ceil(mission.route.sequence.size() / 8.0)) if mission.route.sequence.size() > 12 else 1
	page = posmod(page + direction, pages)
	rebuild_route_strip()
	refresh()

func layout() -> void:
	if not is_instance_valid(panel):
		return
	portrait = size.x < 740
	compact = size.x < 500
	short_view = size.y < 550 and not portrait
	top_row.columns = 1 if portrait else 2
	pages_row.visible = not short_view
	heading.visible = not short_view
	var margin := 14.0
	background.position = Vector2.ZERO
	background.size = size
	panel.position = Vector2(margin, margin)
	panel.size = Vector2(size.x - margin * 2, 0)
	route_picker.custom_minimum_size.x = 80 if portrait else 180 if short_view else 260
	route_picker.clip_text = true
	mode_picker.clip_text = true
	mode_picker.custom_minimum_size.x = 100 if portrait or short_view else 150
	# Toolbar wraps into a second row on a narrow phone.
	if compact or short_view:
		mode_picker.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
		toggle.text = "Ⅱ" if mission.running else "▶"
	for child in controls.get_children():
		if child is HSlider:
			child.visible = not compact and not short_view
	root_grid.columns = 12 if short_view else 6
	bass_grid.columns = 6 if short_view else 3
	quality_grid.columns = 5 if short_view else 2
	var header_bottom := panel.position.y + panel.get_combined_minimum_size().y + 12
	var bottom := size.y - (150.0 if short_view else 210.0)
	var side_width := 116.0 if portrait else 250.0 if short_view else 150.0
	bass_panel.position = Vector2(margin, header_bottom)
	bass_panel.size = Vector2(side_width, 0)
	quality_panel.position = Vector2(size.x - side_width - margin, header_bottom)
	quality_panel.size = Vector2(side_width, 0)
	var center_left := margin + side_width + 10.0 if bass_panel.visible else margin
	stage.position = Vector2(center_left, header_bottom)
	stage.size = Vector2(maxf(80, size.x - side_width - margin - 10 - center_left), maxf(60, bottom - header_bottom))
	root_panel.position = Vector2(margin, bottom + 4)
	root_panel.size = Vector2(size.x - margin * 2, 0)
	message.position = Vector2(margin, bottom - (22 if short_view else 42))
	message.size = Vector2(size.x - margin * 2, 38)
	message.mouse_filter = Control.MOUSE_FILTER_IGNORE
	vitals.position = Vector2(margin, size.y - 68)
	vitals.size = Vector2(size.x - margin * 2, 40)
	stats.position = Vector2(margin, size.y - 24)
	stats.size = Vector2(size.x - margin * 2, 20)
	for item in answer_buttons:
		item.add_theme_font_size_override("font_size", 12 if portrait or short_view else 16)
		item.custom_minimum_size.y = 34 if portrait or short_view else 38
	ship.size = Vector2(86, 86) if portrait else Vector2(112, 112)

func toggle_game() -> void:
	if not prepared or flight.failed:
		return
	if mission.running:
		pause_game()
	else:
		var before := mission.cursor
		mission.start()
		transport.start()
		if mission.cursor != before:
			transport.seek_chord(mission.cursor)
		previous_audio = transport.last_position
		message.text = "Слушай и находи части звучащего аккорда"
	refresh()

func pause_game() -> void:
	if is_instance_valid(transport):
		mission.pause()
		transport.pause()
		refresh()

func submit(kind: String, value: Variant) -> void:
	var result := mission.answer(kind, value)
	if result.get("ignored", false):
		return
	flash_timer = 1.8
	if result.correct:
		message.text = "Найдено" if not mission.complete else "Маршрут собран — слушаем дальше"
		message.modulate = ACCENT
	else:
		flight.wrong_answer(kind, value, fixture.qualityOrder)
		message.text = "Попробуй ещё раз — найденные ответы сохранены"
		message.modulate = Color("ffaca6")
	if mission.complete and not completion_saved:
		completion_saved = true
		records.save_completed(mission)
		transport.seek_chord(mission.cursor)
		previous_audio = transport.last_position
	refresh()

func refresh() -> void:
	if not is_instance_valid(stats) or mission.route.is_empty():
		return
	toggle.text = ("Ⅱ" if mission.running else "▶") if compact or short_view else ("Ⅱ Пауза" if mission.running else "▶ Старт")
	var parts: Dictionary = mission.progress[mission.cursor] if mission.cursor >= 0 else {}
	for item in answer_buttons:
		var kind: String = item.get_meta("kind")
		item.disabled = not mission.running or mission.cursor < 0 or mission.complete or parts.get(kind, false)
		var correct: Variant = mission.current().quality if kind == "quality" else (mission.current().get("bassOffset") if kind == "bass" else mission.current().offset)
		if correct == null:
			correct = mission.current().offset
		item.modulate = ACCENT if parts.get(kind, false) and str(item.get_meta("value")) == str(correct) else Color.WHITE
	for item in route_nodes:
		var i: int = item.get_meta("index")
		var found: Dictionary = mission.progress[i]
		var chord: Dictionary = mission.route.sequence[i]
		var root_name: String = chord.label.substr(0, 2) if chord.label.begins_with("♭") else chord.label.substr(0, 1)
		var bass: String = ""
		if chord.get("bassOffset") != null and chord.bassOffset != chord.offset:
			bass = "/" + (chord.label.get_slice("/", 1) if found.get("bass", false) else "?")
		item.text = str(i + 1) + "\n" + (root_name if found.degree else "?") + (chord.qualityLabel if found.quality else "?") + bass
		item.modulate = ACCENT if i == mission.cursor else Color(0.70, 0.78, 0.78)
	heading.text = "Слушаем тонику · " + mission.route.reference.label if mission.cursor < 0 and mission.running else "Маршрут собран · продолжаем слушать" if mission.complete else "ROOT внизу · тип справа · BASS слева" if bass_panel.visible else "ROOT внизу · тип справа · бас автоматически"
	for key in meters:
		var value: float = flight.oxygen if key == "oxygen" else flight.resources[key]
		meters[key].meter.value = value
		meters[key].caption.text = {"fuel": "FUEL", "water": "H₂O", "crew": "CREW", "hull": "HULL", "oxygen": "O₂"}[key] + " %d" % value
	stats.text = "%02d:%02d · %d очков · рекорд %d · Godot 0.1" % [int(mission.seconds) / 60, int(mission.seconds) % 60, mission.score(), records.best(mission.route, mission.teacher)]

func _process(dt: float) -> void:
	if not prepared:
		return
	clock += dt
	if mission.running:
		var audio: float = transport.position()
		var delta := audio - previous_audio
		if delta < -mission.bar_seconds:
			delta += mission.route.sequence.size() * mission.bar_seconds
		delta = maxf(0.0, delta)
		previous_audio = audio
		var index := int(audio / mission.bar_seconds) - 1
		if index >= 0:
			index = posmod(index, mission.route.sequence.size())
		# Catch up skipped visual frames from the audio timeline, with no
		# independent Timer that could accumulate drift against playback.
		mission.cursor = index
		elapsed = fmod(audio, mission.bar_seconds)
		mission.tick(delta)
		if index != last_cursor:
			last_cursor = index
			if mission.route.sequence.size() > 12 and index >= 0:
				page = int(index / 8)
				rebuild_route_strip()
		move_ship(dt)
		var events := flight.update(delta, mission, elapsed, stage.size)
		for event in events:
			if event.has("midi"):
				transport.tone(event.midi)
		if flight.failed:
			pause_game()
			message.text = "Ресурс исчерпан · ↻ начинает новый полёт"
	ship.position = flight.ship * stage.size - ship.size * 0.5
	flash_timer = maxf(0, flash_timer - dt)
	if flash_timer == 0:
		message.modulate = Color.WHITE
	refresh()
	stage.queue_redraw()

func move_ship(dt: float) -> void:
	var direction := Vector2.ZERO
	if Input.is_physical_key_pressed(KEY_LEFT) or Input.is_physical_key_pressed(KEY_A):
		direction.x -= 1
	if Input.is_physical_key_pressed(KEY_RIGHT) or Input.is_physical_key_pressed(KEY_D):
		direction.x += 1
	if Input.is_physical_key_pressed(KEY_UP) or Input.is_physical_key_pressed(KEY_W):
		direction.y -= 1
	if Input.is_physical_key_pressed(KEY_DOWN) or Input.is_physical_key_pressed(KEY_S):
		direction.y += 1
	flight.ship += direction.normalized() * dt * 0.35
	flight.ship = flight.ship.clamp(Vector2(0.06, 0.08), Vector2(0.94, 0.92))

func stage_input(event: InputEvent) -> void:
	if not mission.running:
		return
	if event is InputEventMouseButton:
		dragging = event.pressed
	if event is InputEventScreenTouch:
		dragging = event.pressed
	if (event is InputEventMouseMotion and dragging) or event is InputEventScreenDrag:
		flight.ship = (event.position / stage.size).clamp(Vector2(0.06, 0.08), Vector2(0.94, 0.92))

func _unhandled_key_input(event: InputEvent) -> void:
	if event.is_pressed() and not event.is_echo() and event is InputEventKey and event.physical_keycode in [KEY_SPACE, KEY_ESCAPE]:
		toggle_game()
		get_viewport().set_input_as_handled()

func draw_stage() -> void:
	var font := ThemeDB.fallback_font
	for e in flight.entities:
		var point: Vector2 = e.pos * stage.size
		var color := Color("b8eaff") if e.kind == "tone" else Color("c8d7a0")
		stage.draw_circle(point, 18, Color(color, 0.14))
		stage.draw_arc(point, 18, 0, TAU, 40, color, 1.2, true)
		var text: String = e.label if e.kind == "tone" else {"fuel": "F", "water": "H₂O", "crew": "C", "hull": "+"}[e.kind]
		var text_size := font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, 15)
		stage.draw_string(font, point + Vector2(-text_size.x * 0.5, 5), text, HORIZONTAL_ALIGNMENT_LEFT, -1, 15, color)
	for flash in flight.flashes:
		var color := Color("ff8a80") if flash.verdict == "invalid" else Color("bbf3d5")
		color.a = clampf((1.8 - flash.age) * 1.2, 0, 1)
		var text := "%s %+.1f%s" % [flash.label, flash.delta, " O₂" if flash.has("midi") else ""]
		stage.draw_string(font, flash.pos * stage.size - Vector2(36, flash.age * 24), text, HORIZONTAL_ALIGNMENT_LEFT, -1, 17, color)

func run_smoke() -> void:
	# Run in the actual renderer: exercise UI signals, audio playback, pause,
	# answer submission, portrait/landscape geometry and screenshot output.
	var runner = load("res://checks/scene_smoke.gd").new()
	add_child(runner)
	await runner.run(self)
