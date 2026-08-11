#!/usr/bin/env python3
"""
Turn the generated vial photography into the web assets the site ships.

Source images were generated once with Higgsfield (GPT Image 2), deliberately
with a BLANK label, photographed straight-on and centred, in two lighting
variants — dark studio and high-key white. Each compound's label is drawn over
the photo at runtime by src/components/VialPhoto.tsx, which is why the label must
stay blank here and why the crop must not change without updating LABEL there.

    python3 design/process-vials.py

Writes public/img/vial-dark.webp and public/img/vial-light.webp, and prints the
label rectangle to paste into VialPhoto.tsx if the crop is ever changed.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design" / "source"
OUT = ROOT / "public" / "img"

# Label rectangle measured on the full-size source, in source pixels.
LABEL_PX = dict(x0=532, x1=1212, y0=1004, y1=1744)

# Crop as fractions of the source (left, top, right, bottom).
CROP = (0.26, 0.08, 0.74, 0.96)

TARGET_W = 760
QUALITY = 90

VARIANTS = [("vial-dark", "vial-dark-source.png"), ("vial-light", "vial-light-source.png")]

# Hero group shot — no label overlay, the text is photographed in.
HERO = [("hero-vials", 1500, 86), ("hero-vials-sm", 800, 84)]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    rect = None

    for name, src in VARIANTS:
        path = SRC / src
        if not path.exists():
            raise SystemExit(f"missing source image: {path}")

        im = Image.open(path).convert("RGB")
        W, H = im.size
        l, t, r, b = (
            int(CROP[0] * W), int(CROP[1] * H),
            int(CROP[2] * W), int(CROP[3] * H),
        )
        cropped = im.crop((l, t, r, b))
        cw, ch = cropped.size

        rect = (
            (LABEL_PX["x0"] - l) / cw * 100,
            (LABEL_PX["y0"] - t) / ch * 100,
            (LABEL_PX["x1"] - LABEL_PX["x0"]) / cw * 100,
            (LABEL_PX["y1"] - LABEL_PX["y0"]) / ch * 100,
        )

        out_h = round(ch * TARGET_W / cw)
        cropped = cropped.resize((TARGET_W, out_h), Image.LANCZOS)
        dest = OUT / f"{name}.webp"
        cropped.save(dest, "WEBP", quality=QUALITY, method=6)
        print(f"{dest.relative_to(ROOT)}  {TARGET_W}x{out_h}  {dest.stat().st_size // 1024} KB")

    hero_src = SRC / "hero-vials-source.png"
    if hero_src.exists():
        hero = Image.open(hero_src).convert("RGB")
        hw, hh = hero.size
        for name, tw, q in HERO:
            r = hero.resize((tw, round(hh * tw / hw)), Image.LANCZOS)
            dest = OUT / f"{name}.webp"
            r.save(dest, "WEBP", quality=q, method=6)
            print(f"{dest.relative_to(ROOT)}  {r.size[0]}x{r.size[1]}  {dest.stat().st_size // 1024} KB")

    if rect:
        print(
            "\nLABEL for src/components/VialPhoto.tsx:\n"
            f"  left: {rect[0]:.2f}, top: {rect[1]:.2f}, "
            f"width: {rect[2]:.2f}, height: {rect[3]:.2f}"
        )


if __name__ == "__main__":
    main()
