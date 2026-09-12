"""Encode lightweight flight textures without changing dimensions or source art."""
from pathlib import Path
from PIL import Image

assets = Path(__file__).resolve().parents[1] / 'assets'
for source in sorted(assets.glob('*.png')):
    if source.stem in ('scout-art', 'cruiser-art'):
        continue
    target = source.with_suffix('.webp')
    if target.exists():
        continue
    with Image.open(source) as image:
        image.save(target, 'WEBP', quality=85, method=6)
