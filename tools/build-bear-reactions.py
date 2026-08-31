#!/usr/bin/env python3
"""Build the approved bear reaction studies as small animated web assets."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
REACTION_DIR = ROOT / "assets" / "bears" / "reactions"
SOURCE_DIR = REACTION_DIR / "source"
FRAME_SIZE = 512

# The first three studies reuse the previously approved sheets verbatim. The
# crying sheet is the only newly authored reaction. Failure 4 deliberately
# keeps the early "wrong" dance, including the rear paw the user asked to save.
REACTIONS = [
    {
        "id": "victory",
        "label": "Victory",
        "sheet": "victory-sheet.png",
        "output": "victory.webp",
        "order": [0, 1, 2, 2, 3, 1, 0],
        "durations": [520, 180, 260, 720, 220, 160, 440],
    },
    {
        "id": "failure-01-headslap",
        "label": "First consecutive Game Over",
        "sheet": "failure-01-headslap-sheet.png",
        "output": "failure-01-headslap.webp",
        "order": [0, 1, 2, 2, 3, 1, 0],
        "durations": [620, 190, 240, 760, 260, 180, 480],
    },
    {
        "id": "failure-02-head-grab",
        "label": "Second consecutive Game Over",
        "sheet": "failure-02-head-grab-sheet.png",
        "output": "failure-02-head-grab.webp",
        "order": [0, 1, 2, 2, 3, 3, 2, 1, 0],
        "durations": [620, 180, 220, 760, 260, 720, 220, 180, 480],
    },
    {
        "id": "failure-03-crying",
        "label": "Third consecutive Game Over",
        "sheet": "failure-03-crying-sheet.png",
        "output": "failure-03-crying.webp",
        "order": [0, 1, 2, 3, 3, 2, 1, 0],
        "durations": [620, 220, 280, 760, 420, 260, 210, 520],
    },
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
            frame = sheet.crop((x0, y0, x1, y1)).resize(
                (FRAME_SIZE, FRAME_SIZE),
                Image.Resampling.LANCZOS,
            )
            frames.append(frame)
    return frames


def build_animation(spec: dict[str, object]) -> None:
    authored = sheet_frames(SOURCE_DIR / str(spec["sheet"]))
    order = list(spec["order"])
    animation = [authored[index] for index in order]
    animation[0].save(
        REACTION_DIR / str(spec["output"]),
        save_all=True,
        append_images=animation[1:],
        duration=list(spec["durations"]),
        loop=0,
        quality=86,
        method=6,
        minimize_size=True,
    )


def main() -> None:
    REACTION_DIR.mkdir(parents=True, exist_ok=True)
    for reaction in REACTIONS:
        build_animation(reaction)

    manifest = {
        "integrationStatus": "approval-preview-only",
        "victory": {
            "streak": 0,
            "src": "victory.webp",
            "label": "Victory",
        },
        "gameOverStreak": [
            {
                "streak": index + 1,
                "src": str(reaction["output"]),
                "label": str(reaction["label"]),
            }
            for index, reaction in enumerate(REACTIONS[1:])
        ]
        + [
            {
                "streak": 4,
                "src": "failure-04-wrong-dance.gif",
                "label": "Fourth consecutive Game Over",
                "note": "Preserved early wrong dance with the rear paw visible.",
            }
        ],
    }
    (REACTION_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Built {len(REACTIONS)} authored reaction animations plus the preserved failure-4 dance.")


if __name__ == "__main__":
    main()
