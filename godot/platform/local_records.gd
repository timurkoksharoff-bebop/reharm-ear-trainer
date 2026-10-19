extends RefCounted
## An isolated, versioned store; never reads or rewrites web/PWA player data.
const PATH := "user://records-v1.json"
var records: Dictionary = {}
var storage_path := PATH

func _init(path: String = PATH) -> void:
	storage_path = path
	if FileAccess.file_exists(storage_path):
		var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(storage_path))
		if parsed is Dictionary and parsed.get("schema") == 1 and parsed.get("records") is Dictionary:
			records = parsed.records

func key(route: Dictionary, teacher: bool) -> String:
	return "%s:%s:%s" % [route.id, "teacher" if teacher else "student", route.baseTonic]

func best(route: Dictionary, teacher: bool) -> int:
	return int(records.get(key(route, teacher), {}).get("score", 0))

func save_completed(mission: RefCounted) -> bool:
	if not mission.complete or mission.score() <= best(mission.route, mission.teacher):
		return false
	var previous := records.duplicate(true)
	records[key(mission.route, mission.teacher)] = {"score": mission.score(), "seconds": mission.seconds}
	var file := FileAccess.open(storage_path + ".tmp", FileAccess.WRITE)
	if file == null:
		records = previous
		return false
	file.store_string(JSON.stringify({"schema": 1, "records": records}))
	file.close()
	var error := DirAccess.rename_absolute(ProjectSettings.globalize_path(storage_path + ".tmp"), ProjectSettings.globalize_path(storage_path))
	if error != OK:
		records = previous
	return error == OK
