#!/usr/bin/env python3
"""Install landing-page imagery.

Drop files in (any filename, any format):
    assets/incoming/hero/      -> one image, the hero background
    assets/incoming/cards/     -> five images, the frame-2 deck, in name order
    assets/incoming/benefits/  -> three images, the benefit cards, in name order

Then run:  python3 install-assets.py

Each image is resized and re-encoded for the slot it fills, so a 4000px
original does not ship to the browser at full weight.
"""
import sys, pathlib
try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  python3 -m pip install pillow")

OUT = pathlib.Path("assets")
SLOTS = {                       # folder: (prefix, count, target width, jpeg quality)
    "hero":     ("hero",    1, 2400, 82),
    "cards":    ("card",    5,  900, 84),
    "benefits": ("benefit", 3, 1000, 84),
}
EXT = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".tif", ".tiff", ".bmp"}

def main():
    total = 0
    for folder, (prefix, count, width, q) in SLOTS.items():
        src = OUT / "incoming" / folder
        if not src.is_dir():
            continue
        files = sorted([p for p in src.iterdir() if p.suffix.lower() in EXT])
        if not files:
            print(f"  {folder:9s} — empty, skipped")
            continue
        if len(files) != count:
            print(f"  {folder:9s} — note: found {len(files)}, slot expects {count}")
        for i, p in enumerate(files[:count], 1):
            name = f"{prefix}.jpg" if count == 1 else f"{prefix}-{i}.jpg"
            im = Image.open(p)
            if im.mode in ("RGBA", "P", "LA"):
                bg = Image.new("RGB", im.size, (255, 255, 255))
                bg.paste(im.convert("RGBA"), mask=im.convert("RGBA").split()[-1])
                im = bg
            else:
                im = im.convert("RGB")
            if im.width > width:
                im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
            dest = OUT / name
            im.save(dest, "JPEG", quality=q, optimize=True, progressive=True)
            kb = dest.stat().st_size / 1024
            print(f"  {p.name}  ->  {dest}  ({im.width}x{im.height}, {kb:.0f} KB)")
            total += 1
    print(f"\n{total} image(s) installed into assets/.")
    print("Reload auralis.html — the CSS already points at these paths.")

if __name__ == "__main__":
    main()
