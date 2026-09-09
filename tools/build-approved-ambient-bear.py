from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/bears/rewards/source/common-neutral-bear.png"
OUTPUT = ROOT / "assets/bears/ambient/quest-bear-approved.webp"

image = Image.open(SOURCE).convert("RGBA")
# The approved source contains a one-pixel dark export seam on its left edge.
image = image.crop((1, 0, image.width, image.height))
pixels = image.load()
width, height = image.size


def is_background(x, y):
    red, green, blue, _ = pixels[x, y]
    return red > 195 and green > 185 and blue > 170


background = bytearray(width * height)
queue = deque()
for x in range(width):
    queue.append((x, 0))
    queue.append((x, height - 1))
for y in range(height):
    queue.append((0, y))
    queue.append((width - 1, y))

while queue:
    x, y = queue.popleft()
    offset = y * width + x
    if background[offset] or not is_background(x, y):
        continue
    background[offset] = 1
    if x > 0:
        queue.append((x - 1, y))
    if x + 1 < width:
        queue.append((x + 1, y))
    if y > 0:
        queue.append((x, y - 1))
    if y + 1 < height:
        queue.append((x, y + 1))

alpha = Image.new("L", image.size, 255)
alpha_pixels = alpha.load()
for y in range(height):
    for x in range(width):
        if background[y * width + x]:
            alpha_pixels[x, y] = 0

alpha = alpha.filter(ImageFilter.GaussianBlur(0.7))
image.putalpha(alpha)
left, top, right, bottom = alpha.getbbox()
margin = 8
image = image.crop((
    max(0, left - margin),
    max(0, top - margin),
    min(width, right + margin),
    min(height, bottom + margin),
))
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT, "WEBP", lossless=True, method=6)
print(OUTPUT.relative_to(ROOT))
