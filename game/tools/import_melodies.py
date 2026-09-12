#!/usr/bin/env python3
"""Build the compact in-game melody bank from licensed symbolic lead sheets.

The source archives stay outside Git. The generated module contains only the
monophonic pitch/duration events used by Melody Memory.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import unicodedata
import zipfile
from pathlib import Path
from fractions import Fraction
from xml.etree import ElementTree as ET


TITLE_FIXES = {
    "April in Paris-mod": "April in Paris",
    "But beautyful": "But Beautiful",
    "Daahood": "Daahoud",
    "Day of wine and roses": "Days of Wine and Roses",
    "Early autumn-C": "Early Autumn",
    "Emily-G": "Emily",
    "Everythong happens to me": "Everything Happens to Me",
    "Georgia": "Georgia on My Mind",
    "Girl from Ipanema": "The Girl from Ipanema",
    "Good bye pork pie hat": "Goodbye Pork Pie Hat",
    "Green dolphin street": "On Green Dolphin Street",
    "Grooving_high": "Groovin' High",
    "Have you met Miss Jones": "Have You Met Miss Jones?",
    "I hear a rapsody": "I Hear a Rhapsody",
    "Jitterberg waltz": "Jitterbug Waltz",
}

OPEN_EWLD_PRIORITY = [
    "Summertime", "I Only Have Eyes for You", "September in the Rain", "Honeysuckle Rose",
    "Sweet and Lovely", "She's Funny That Way", "West End Blues",
    "Pick Yourself Up", "Limehouse Blues", "My Melancholy Baby",
    "Dream a Little Dream of Me", "Somebody Loves Me", "'S Wonderful",
    "A Foggy Day", "Fascinating Rhythm", "Love Walked In",
    "Nice Work if You Can Get It", "They Can't Take That Away from Me",
    "You're My Everything", "Minnie the Moocher", "Moten Swing",
    "Blueberry Hill", "Coquette", "Sometimes I'm Happy",
    "I Loves You, Porgy", "Moonlight Serenade", "You Stepped Out of a Dream",
    "My Baby Just Cares for Me", "The Sheik of Araby", "I'm Through with Love",
    "Black and Blue", "Tin Roof Blues", "Squeeze Me", "A Fine Romance",
    "The Jitterbug Waltz", "The Glory of Love", "Without a Song",
    "Ain't We Got Fun", "Chicago (That Toddling Town)", "The Carioca",
]


def tag(node):
    return node.tag.rsplit("}", 1)[-1]


def child(node, name):
    return next((item for item in node if tag(item) == name), None)


def text(node, path, default=""):
    current = node
    for name in path.split("/"):
        current = child(current, name) if current is not None else None
    return current.text.strip() if current is not None and current.text else default


def normalized(value):
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def display_title(value):
    value = value.replace("_", " ").strip()
    if value in TITLE_FIXES:
        return TITLE_FIXES[value]
    if value == value.lower():
        small = {"a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "of", "on", "or", "the", "to", "with"}
        words = value.split()
        value = " ".join(word.capitalize() if index == 0 or word not in small else word for index, word in enumerate(words))
    return value[:1].upper() + value[1:]


def alias_list(title):
    base = normalized(title)
    aliases = {base}
    aliases.add(base.replace(" the ", " "))
    aliases.add(base.replace(" and ", " n "))
    return sorted(item for item in aliases if item)


def open_xml(path):
    if path.suffix.lower() not in {".mxl", ".mscz"}:
        return ET.parse(path).getroot()
    with zipfile.ZipFile(path) as archive:
        if path.suffix.lower() == ".mscz":
            name = next(name for name in archive.namelist() if name.endswith(".mscx"))
        else:
            names = [name for name in archive.namelist() if name.lower().endswith((".xml", ".musicxml")) and not name.startswith("META-INF/")]
            name = names[0]
        return ET.fromstring(archive.read(name))


def add_event(events, pitch, beats, tied=False):
    if beats <= 0:
        return
    beats = round(beats, 5)
    if events and tied and events[-1][0] == pitch:
        events[-1][1] = round(events[-1][1] + beats, 5)
    else:
        events.append([pitch, beats])


def parse_musicxml(root):
    title = next((node.text for node in root.iter() if tag(node) in {"work-title", "movement-title"} and node.text), "Untitled")
    part = next(node for node in root.iter() if tag(node) == "part")
    measures = [node for node in part if tag(node) == "measure"]
    events, ends, divisions, meter, transposition = [], [], 1, 4, 0
    preferred_voice = None
    for measure in measures:
        attributes = child(measure, "attributes")
        if attributes is not None:
            divisions = float(text(attributes, "divisions", str(divisions))) or divisions
            time = child(attributes,"time")
            if time is not None:
                meter = sum(float(n) for n in text(time,"beats","4").split("+")) * 4 / float(text(time,"beat-type","4"))
            transpose = child(attributes,"transpose")
            if transpose is not None:
                transposition = int(text(transpose,"chromatic","0")) + 12 * int(text(transpose,"octave-change","0"))
        if preferred_voice is None:
            voices = [text(note, "voice") for note in measure if tag(note) == "note" and text(note, "voice")]
            if voices:
                preferred_voice = sorted(set(voices))[0]
        cursor, extent, line = 0, 0, []
        for note in measure:
            kind = tag(note)
            if kind in {"forward","backup"}:
                cursor += float(text(note,"duration","0")) / divisions * (1 if kind=="forward" else -1)
                extent = max(extent,cursor)
                continue
            if kind != "note" or child(note, "chord") is not None or child(note,"grace") is not None:
                continue
            duration = float(text(note, "duration", "0")) / divisions
            at = cursor
            cursor += duration
            extent = max(extent,cursor)
            voice = text(note, "voice")
            if preferred_voice and voice and voice != preferred_voice:
                continue
            pitch_node = child(note, "pitch")
            pitch = None
            if pitch_node is not None:
                step = text(pitch_node, "step")
                octave = int(text(pitch_node, "octave", "4"))
                alter = int(float(text(pitch_node, "alter", "0")))
                pitch = (octave + 1) * 12 + {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}[step] + alter + transposition
            tie_types = {item.attrib.get("type") for item in note if tag(item) == "tie"}
            line.append((at,pitch,duration,pitch is not None and "stop" in tie_types))
        position = 0
        for at,pitch,duration,tied in sorted(line,key=lambda n:n[0]):
            if at>position+1e-6:add_event(events,None,at-position)
            add_event(events,pitch,duration,tied)
            position = max(position,at+duration)
        length=extent or meter
        if length>position+1e-6:add_event(events,None,length-position)
        ends.append(len(events))
    return display_title(title.replace(".musicxml", "")), events, ends


def parse_mscx(root):
    score = next(node for node in root.iter() if tag(node) == "Score")
    title = next((node.text for node in score.iter() if tag(node) == "metaTag" and node.attrib.get("name") == "workTitle" and node.text), "Untitled")
    staff = next(node for node in score if tag(node) == "Staff")
    measures = [node for node in staff if tag(node) == "Measure"]
    lengths = {"long": 16, "breve": 8, "whole": 4, "half": 2, "quarter": 1, "eighth": .5, "16th": .25, "32nd": .125, "64th": .0625}
    events, ends, meter = [], [], 4
    for measure in measures:
        voice = child(measure, "voice")
        if voice is None:
            ends.append(len(events)); continue
        tuplet_left, tuplet_ratio = 0, 1.0
        for item in voice:
            kind = tag(item)
            if kind == "TimeSig":
                meter = int(text(item, "sigN", "4")) * 4 / int(text(item, "sigD", "4"))
                continue
            if kind == "endTuplet":
                tuplet_left, tuplet_ratio = 0, 1
                continue
            if kind == "Tuplet":
                actual = int(text(item, "actualNotes", "3")); normal = int(text(item, "normalNotes", "2"))
                tuplet_left, tuplet_ratio = actual, normal / actual
                continue
            if kind not in {"Chord", "Rest"}:
                continue
            duration_type = text(item, "durationType", "quarter")
            if kind == "Chord" and any(tag(n).startswith("grace") or tag(n) in {"acciaccatura","appoggiatura"} for n in item):
                continue
            duration = float(Fraction(text(item,"duration",measure.attrib.get("len",str(meter/4))))) * 4 if duration_type == "measure" else lengths[duration_type]
            dots = int(text(item, "dots", "0"))
            duration *= sum(.5 ** dot for dot in range(dots + 1))
            if tuplet_left:
                duration *= tuplet_ratio; tuplet_left -= 1
            pitch, tied = None, False
            if kind == "Chord":
                note = child(item, "Note")
                if note is not None and text(note, "pitch"):
                    pitch = int(text(note, "pitch"))
                    tied = any(tag(spanner)=="Spanner" and spanner.attrib.get("type")=="Tie" and child(spanner,"prev") is not None for spanner in note)
            add_event(events, pitch, duration, tied)
        ends.append(len(events))
    return display_title(title), events, ends


def parse_score(path, source, license_name):
    root = open_xml(path)
    if tag(root) == "museScore":
        title, events, measure_ends = parse_mscx(root)
    else:
        title, events, measure_ends = parse_musicxml(root)
    while events and events[-1][0] is None:
        events.pop()
    # Drop empty count-in bars; keep the last partial-bar rest as a pickup.
    leading = 0
    while leading < len(measure_ends) and all(p is None for p,_ in events[:measure_ends[leading]]):
        leading += 1
    if leading:
        removed = measure_ends[leading-1]
        events = events[removed:]
        measure_ends = [max(0,n-removed) for n in measure_ends[leading:]]
    pitched = [pitch for pitch, _ in events if pitch is not None]
    if len(pitched) < 12 or len(measure_ends) < 4:
        raise ValueError("too little melodic material")
    origin = pitched[0]
    relative = [[None if pitch is None else pitch - origin, beats] for pitch, beats in events]
    preview_measures = 8
    preview = measure_ends[min(preview_measures, len(measure_ends)) - 1]
    if sum(1 for pitch, _ in relative[:preview] if pitch is not None) < 12 and len(measure_ends) >= 16:
        preview_measures, preview = 16, measure_ends[15]
    return {
        "id": "melody-" + normalized(title).replace(" ", "-"),
        "name": title,
        "aliases": alias_list(title),
        "events": relative,
        "preview": min(preview, len(relative)),
        "measures": len(measure_ends),
        "source": source,
        "license": license_name,
        "sourceFile": path.name,
        "sourceSha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "firstMidi": origin,
        "form": "written-score",
    }


def select_unique(items, selected, limit=None):
    seen = {normalized(item["name"]) for item in selected}
    for item in items:
        key = normalized(item["name"])
        if key in seen:
            continue
        selected.append(item); seen.add(key)
        if limit and len(selected) >= limit:
            break


def load_many(paths, source, license_name):
    output, errors = [], []
    for path in paths:
        try:
            output.append(parse_score(path, source, license_name))
        except Exception as error:
            errors.append((path, str(error)))
    return output, errors


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--psjazz", type=Path, required=True)
    parser.add_argument("--freedjazz", type=Path, required=True)
    parser.add_argument("--openewld", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    ps_paths = sorted(args.psjazz.rglob("*.musicxml"))
    ps_by_title = {}
    for path in ps_paths:
        name = display_title(path.stem)
        ps_by_title.setdefault(normalized(name), path)
    ps, ps_errors = load_many(ps_by_title.values(), "PSjazzEval RealBook", "CC BY 4.0")
    freed, freed_errors = load_many(sorted(args.freedjazz.glob("*.mscz")), "Freed Jazz", "public-domain source; transcription attribution in archive")

    open_paths = list(args.openewld.rglob("*.mxl"))
    open_by_title = {normalized(path.stem.replace("_", " ")): path for path in open_paths}
    wanted = [open_by_title[normalized(title)] for title in OPEN_EWLD_PRIORITY if normalized(title) in open_by_title]
    opened, open_errors = load_many(wanted, "OpenEWLD", "public domain / repository metadata")

    selected = []
    select_unique(sorted(ps, key=lambda item: normalized(item["name"])), selected)
    select_unique(sorted(freed, key=lambda item: normalized(item["name"])), selected)
    select_unique(opened, selected, 200)
    if len(selected) < 200:
        raise SystemExit(f"Only {len(selected)} unique validated melodies; need 200")
    selected = selected[:200]
    payload = json.dumps(selected, ensure_ascii=False, separators=(",", ":"))
    banner = "// Generated by tools/import_melodies.py. Source score archives are intentionally not shipped.\n"
    args.output.write_text(f"{banner}export const IMPORTED_MELODIES={payload};\n", encoding="utf-8")
    print(f"Wrote {len(selected)} melodies, {sum(len(item['events']) for item in selected)} events, {len(payload) / 1024:.1f} KiB")
    print(f"Sources: PSjazzEval={sum(i['source'].startswith('PS') for i in selected)}, FreedJazz={sum(i['source'].startswith('Freed') for i in selected)}, OpenEWLD={sum(i['source'].startswith('Open') for i in selected)}")
    print(f"Skipped parse errors: PS={len(ps_errors)}, Freed={len(freed_errors)}, Open={len(open_errors)}")
    for path, error in (ps_errors + freed_errors + open_errors)[:12]:
        print(f"WARN {path.name}: {error}")


if __name__ == "__main__":
    main()
