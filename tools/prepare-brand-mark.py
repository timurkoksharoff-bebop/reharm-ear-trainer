#!/usr/bin/env python3
"""Remove only the approved logo's outer paper while preserving the mark."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "brand" / "source" / "ear-bear-mark-approved-original.png"
OUTPUT = ROOT / "assets" / "brand" / "ear-bear-mark-approved.png"


def connected_components(mask: Image.Image) -> list[list[tuple[int, int]]]:
    pixels = mask.load()
    width, height = mask.size
    seen: set[tuple[int, int]] = set()
    components: list[list[tuple[int, int]]] = []
    for y in range(height):
        for x in range(width):
            if not pixels[x, y] or (x, y) in seen:
                continue
            component: list[tuple[int, int]] = []
            queue = deque([(x, y)])
            seen.add((x, y))
            while queue:
                px, py = queue.popleft()
                component.append((px, py))
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if (
                        0 <= nx < width
                        and 0 <= ny < height
                        and pixels[nx, ny]
                        and (nx, ny) not in seen
                    ):
                        seen.add((nx, ny))
                        queue.append((nx, ny))
            components.append(component)
    return components


def main() -> None:
    mark = Image.open(SOURCE).convert("RGBA")
    ImageDraw.floodfill(mark, (0, 0), (255, 255, 255, 0), thresh=6)
    components = connected_components(mark.getchannel("A"))
    if not components:
        raise RuntimeError("Approved logo mark could not be isolated")

    approved_shape = max(components, key=len)
    alpha = Image.new("L", mark.size, 0)
    alpha_pixels = alpha.load()
    original_alpha = mark.getchannel("A").load()
    for x, y in approved_shape:
        alpha_pixels[x, y] = original_alpha[x, y]
    # Contract the opaque paper fringe by one pixel, then restore a soft edge.
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.45))
    mark.putalpha(alpha)
    mark.save(OUTPUT, optimize=True)
    print(f"Prepared seamless approved mark: {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
