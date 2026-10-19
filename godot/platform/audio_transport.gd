extends Node
## Audio is the timeline authority; the scene observes its playback position.
var player: AudioStreamPlayer
var bar_seconds := 4.0
var chord_count := 0
var last_position := 0.0
var tone_players: Array = []

func _ready() -> void:
	player = AudioStreamPlayer.new()
	add_child(player)

func configure(route: Dictionary) -> bool:
	stop()
	var path := "res://data/audio/%s.wav" % route.id
	if not FileAccess.file_exists(path):
		return false
	var stream := AudioStreamWAV.load_from_file(path)
	if stream == null:
		return false
	chord_count = route.sequence.size()
	stream.loop_mode = AudioStreamWAV.LOOP_FORWARD
	stream.loop_begin = int((chord_count + 1) * bar_seconds * stream.mix_rate)
	stream.loop_end = int((chord_count * 2 + 1) * bar_seconds * stream.mix_rate)
	player.stream = stream
	last_position = 0.0
	return true

func start() -> void:
	if player.stream_paused:
		player.stream_paused = false
	elif not player.playing:
		player.play()

func pause() -> void:
	player.stream_paused = true
	for tone_player in tone_players:
		if is_instance_valid(tone_player):
			tone_player.stop()

func stop() -> void:
	if player:
		player.stop()
		player.stream_paused = false
	last_position = 0.0

func seek_chord(index: int) -> void:
	last_position = (index + 1) * bar_seconds
	player.play(last_position)

func position() -> float:
	if not player.playing or player.stream_paused:
		return last_position
	var raw := player.get_playback_position() + AudioServer.get_time_since_last_mix() - AudioServer.get_output_latency()
	var end := (chord_count + 1) * bar_seconds
	# The WAV loops after its one-time tonic reference. Compensate the
	# hardware clock, wrap the same segment and reject small backward jitter.
	if raw >= end:
		raw = bar_seconds + fmod(raw - bar_seconds, chord_count * bar_seconds)
	if last_position - raw > chord_count * bar_seconds * 0.5:
		last_position = maxf(bar_seconds, raw)
	else:
		last_position = maxf(last_position, raw)
	return last_position

func volume(value: float) -> void:
	player.volume_db = linear_to_db(maxf(0.0001, value))

func tone(midi: int) -> void:
	# Same quiet, non-looping three-partial vibraphone gesture as resonance.
	var stream := AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = 22050
	var frames := int(0.85 * stream.mix_rate)
	var data := PackedByteArray()
	data.resize(frames * 2)
	var hz := 440.0 * pow(2.0, (midi - 69) / 12.0)
	for i in frames:
		var t := float(i) / stream.mix_rate
		var env := minf(1, t / 0.008) * exp(-t * 8.0)
		var sample := (sin(TAU * hz * t) + 0.18 * sin(TAU * hz * 2.76 * t) + 0.055 * sin(TAU * hz * 5.4 * t)) * env * 0.075
		data.encode_s16(i * 2, int(clampf(sample, -1, 1) * 32767))
	stream.data = data
	var voice := AudioStreamPlayer.new()
	voice.stream = stream
	voice.volume_db = player.volume_db
	add_child(voice)
	tone_players.append(voice)
	voice.finished.connect(func(): tone_players.erase(voice); voice.queue_free())
	voice.play()
