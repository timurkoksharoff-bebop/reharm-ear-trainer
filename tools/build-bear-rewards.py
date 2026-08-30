#!/usr/bin/env python3
"""Build animated chapter-reward bears from their approved 2x2 sheets."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "bears" / "rewards" / "source"
OUTPUT_DIR = SOURCE_DIR.parent
FRAME_SIZE = 512

REWARDS = [
    (1, "triangle", "Triangle", "level-01-triangle-sheet.png", [0, 1, 2, 2, 3, 0], [520, 180, 220, 360, 220, 620]),
    (2, "cymbals", "Orchestral cymbals", "level-02-cymbals-sheet.png", [0, 1, 2, 2, 3, 0], [420, 180, 220, 420, 200, 580]),
    (3, "tuba", "Tuba", "level-03-tuba-sheet.png", [0, 1, 2, 3, 2, 1], [420, 300, 320, 520, 300, 280]),
    (4, "harp", "Harp", "level-04-harp-sheet.png", [0, 1, 2, 3, 2, 1], [420, 260, 280, 460, 280, 260]),
    (5, "bass-guitar", "Bass guitar", "level-05-bass-guitar-sheet.png", [0, 1, 2, 3, 2, 1], [300, 230, 230, 350, 230, 230]),
    (6, "drum-kit", "Drum kit", "level-06-drum-kit-sheet.png", [0, 1, 2, 3, 2, 1], [320, 180, 190, 330, 190, 180]),
    (7, "keytar", "Keytar", "level-07-keytar-sheet.png", [0, 1, 2, 3, 2, 1], [320, 240, 260, 380, 250, 230]),
    (8, "upright-bass", "Upright bass", "level-08-upright-bass-sheet.png", [0, 1, 2, 3, 2, 1], [340, 260, 260, 390, 260, 260]),
    (9, "flute", "Flute", "level-09-flute-sheet.png", [0, 1, 2, 3, 2, 1], [420, 300, 300, 460, 280, 280]),
    (10, "violin", "Violin", "level-10-violin-sheet.png", [0, 1, 2, 3, 2, 1], [320, 230, 240, 340, 240, 230]),
    (11, "vibraphone", "Vibraphone", "level-11-vibraphone-sheet.png", [0, 1, 2, 3, 2, 1], [360, 220, 220, 380, 220, 220]),
    (12, "saxophone", "Saxophone", "level-12-saxophone-sheet.png", [0, 1, 2, 3, 2, 1], [300, 240, 240, 360, 240, 240]),
    (13, "trumpet", "Trumpet", "level-13-trumpet-sheet.png", [0, 1, 2, 3, 2, 1], [360, 240, 260, 420, 250, 230]),
    (14, "spoons", "Wooden spoons", "level-14-spoons-sheet.png", [0, 1, 2, 2, 3, 1], [300, 160, 180, 300, 190, 180]),
    (15, "balalaika", "Balalaika", "level-15-balalaika-sheet.png", [0, 1, 2, 3, 2, 1], [360, 180, 170, 330, 180, 190]),
    (16, "musical-saw", "Musical saw", "level-16-musical-saw-sheet.png", [0, 1, 2, 3, 2, 1], [420, 260, 280, 460, 280, 260]),
]

SPARE = ("electric-guitar", "Spare electric guitar", "spare-electric-guitar-sheet.png", [0, 1, 2, 3, 2, 1], [360, 180, 180, 360, 190, 190])


def sheet_frames(path: Path) -> list[Image.Image]:
    sheet = Image.open(path).convert("RGB")
    frames: list[Image.Image] = []
    for row in range(2):
        for column in range(2):
            x0 = round(column * sheet.width / 2)
            x1 = round((column + 1) * sheet.width / 2)
            y0 = round(row * sheet.height / 2)
            y1 = round((row + 1) * sheet.height / 2)
            frame = sheet.crop((x0, y0, x1, y1))
            frame.thumbnail((FRAME_SIZE, FRAME_SIZE), Image.Resampling.LANCZOS)
            canvas = Image.new("RGB", (FRAME_SIZE, FRAME_SIZE), "#f7f2e9")
            canvas.paste(frame, ((FRAME_SIZE - frame.width) // 2, (FRAME_SIZE - frame.height) // 2))
            frames.append(canvas)
    return frames


def save_animation(source: str, output: str, order: list[int], durations: list[int]) -> None:
    authored = sheet_frames(SOURCE_DIR / source)
    animation = [authored[index] for index in order]
    animation[0].save(
        OUTPUT_DIR / output,
        save_all=True,
        append_images=animation[1:],
        duration=durations,
        loop=0,
        quality=84,
        method=6,
        minimize_size=True,
    )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []
    for level, slug, name, source, order, durations in REWARDS:
        filename = f"level-{level:02d}-{slug}.webp"
        save_animation(source, filename, order, durations)
        manifest.append({"level": level, "slug": slug, "name": name, "src": filename})

    spare_slug, spare_name, spare_source, spare_order, spare_durations = SPARE
    spare_filename = f"spare-{spare_slug}.webp"
    save_animation(spare_source, spare_filename, spare_order, spare_durations)

    payload = {
        "rewards": manifest,
        "spares": [{"slug": spare_slug, "name": spare_name, "src": spare_filename}],
    }
    (OUTPUT_DIR / "manifest.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Built {len(manifest)} chapter rewards and {len(payload['spares'])} spare.")


if __name__ == "__main__":
    main()
