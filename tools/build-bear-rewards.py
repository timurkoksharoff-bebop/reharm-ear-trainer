#!/usr/bin/env python3
"""Build chapter-reward performances, a shared arrival, and medal artwork."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "bears" / "rewards" / "source"
OUTPUT_DIR = SOURCE_DIR.parent
MEDAL_DIR = OUTPUT_DIR / "medals"
FRAME_SIZE = 512
MEDAL_SIZE = 320
INTRO_SOURCE = SOURCE_DIR / "common-neutral-bear.png"
INTRO_FILENAME = "intro-bear-arrival.webp"
INTRO_DURATIONS = [260, 190, 180, 170, 160, 150, 170, 360]

# The authored four-pose sheets remain untouched. Level 11 promotes the saved
# electric-guitar study; wooden spoons stay archived but are no longer active.
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
    (11, "electric-guitar", "Electric guitar", "level-11-electric-guitar-sheet.png", [0, 1, 2, 3, 2, 1], [360, 180, 180, 360, 190, 190]),
    (12, "vibraphone", "Vibraphone", "level-12-vibraphone-sheet.png", [0, 1, 2, 3, 2, 1], [360, 220, 220, 380, 220, 220]),
    (13, "saxophone", "Saxophone", "level-13-saxophone-sheet.png", [0, 1, 2, 3, 2, 1], [300, 240, 240, 360, 240, 240]),
    (14, "trumpet", "Trumpet", "level-14-trumpet-sheet.png", [0, 1, 2, 3, 2, 1], [360, 240, 260, 420, 250, 230]),
    (15, "balalaika", "Balalaika", "level-15-balalaika-sheet.png", [0, 1, 2, 3, 2, 1], [360, 180, 170, 330, 180, 190]),
    (16, "musical-saw", "Musical saw", "level-16-musical-saw-sheet.png", [0, 1, 2, 3, 2, 1], [420, 260, 280, 460, 280, 260]),
]


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


def save_performance(source: str, output: str, order: list[int], durations: list[int]) -> None:
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


def neutral_bear_sprite() -> Image.Image:
    source = Image.open(INTRO_SOURCE).convert("RGBA")
    crop = source.crop((185, 18, 691, 785))
    grayscale = ImageOps.grayscale(crop)
    mask = grayscale.point(lambda value: 255 if value < 112 else 0)
    mask = mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(3))

    # Flood only the outside; enclosed light areas such as the muzzle remain.
    flooded = mask.copy()
    ImageDraw.floodfill(flooded, (0, 0), 128, thresh=0)
    mask = flooded.point(lambda value: 0 if value == 128 else 255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.7))
    bounds = mask.getbbox()
    if bounds is None:
        raise RuntimeError("Could not isolate the shared neutral bear")
    crop = crop.crop(bounds)
    mask = mask.crop(bounds)
    crop.putalpha(mask)
    return crop


def intro_base() -> Image.Image:
    canvas = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), "#f7f2e9")
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((78, 424, 434, 478), fill="#a8ad8f")
    draw.ellipse((94, 429, 418, 472), outline="#969d7d", width=2)
    return canvas


def build_intro() -> None:
    bear = neutral_bear_sprite()
    scales = [0, 0.025, 0.075, 0.16, 0.31, 0.5, 0.73, 1.0]
    bounces = [0, 0, -4, 2, -5, 2, -3, 0]
    full_height = 418
    baseline = 459
    frames: list[Image.Image] = []
    for scale, bounce in zip(scales, bounces, strict=True):
        frame = intro_base()
        if scale:
            height = max(4, round(full_height * scale))
            width = max(3, round(bear.width * height / bear.height))
            stage = bear.resize((width, height), Image.Resampling.LANCZOS)
            x = (FRAME_SIZE - width) // 2
            y = baseline - height + bounce
            frame.alpha_composite(stage, (x, y))
        frames.append(frame.convert("RGB"))

    frames[0].save(
        OUTPUT_DIR / INTRO_FILENAME,
        save_all=True,
        append_images=frames[1:],
        duration=INTRO_DURATIONS,
        loop=0,
        quality=86,
        method=6,
        minimize_size=True,
    )


def build_medal(source: str, filename: str) -> None:
    first_frame = sheet_frames(SOURCE_DIR / source)[0].convert("RGBA")
    artwork = first_frame.resize((276, 276), Image.Resampling.LANCZOS)
    circle_mask = Image.new("L", artwork.size, 0)
    ImageDraw.Draw(circle_mask).ellipse((0, 0, 275, 275), fill=255)

    medal = Image.new("RGBA", (MEDAL_SIZE, MEDAL_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(medal)
    draw.ellipse((16, 20, 304, 308), fill=(36, 56, 66, 34))
    draw.ellipse((10, 10, 310, 310), fill="#91a185")
    draw.ellipse((19, 19, 301, 301), fill="#e8e5d9")
    medal.paste(artwork, (22, 22), circle_mask)
    draw.ellipse((18, 18, 302, 302), outline="#819477", width=7)
    medal.save(MEDAL_DIR / filename, optimize=True)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    MEDAL_DIR.mkdir(parents=True, exist_ok=True)
    build_intro()

    manifest = []
    for level, slug, name, source, order, durations in REWARDS:
        filename = f"level-{level:02d}-{slug}.webp"
        medal_filename = f"level-{level:02d}-{slug}.png"
        save_performance(source, filename, order, durations)
        build_medal(source, medal_filename)
        manifest.append(
            {
                "level": level,
                "slug": slug,
                "name": name,
                "src": filename,
                "medal": f"medals/{medal_filename}",
            }
        )

    payload = {
        "intro": {"src": INTRO_FILENAME, "durationMs": sum(INTRO_DURATIONS)},
        "rewards": manifest,
        "spares": [],
    }
    (OUTPUT_DIR / "manifest.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Built {len(manifest)} chapter rewards, a shared arrival, and {len(manifest)} medals.")


if __name__ == "__main__":
    main()
