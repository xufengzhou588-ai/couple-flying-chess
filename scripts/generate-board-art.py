from math import cos, pi, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/romance-board-clean.webp"
OUTPUT = ROOT / "public/assets/romance-board-aligned.webp"
SIZE = 2048

BOARD_MAP = [
    "blank",
    "lucky",
    "trap",
    "blank",
    "lucky",
    "trap",
    "lucky",
    "blank",
    "trap",
    "lucky",
    "blank",
    "trap",
    "lucky",
    "trap",
    "blank",
    "lucky",
    "trap",
    "lucky",
    "blank",
    "trap",
    "lucky",
    "blank",
    "trap",
    "lucky",
    "trap",
    "blank",
    "lucky",
    "trap",
    "blank",
    "lucky",
    "trap",
    "lucky",
    "blank",
    "trap",
    "lucky",
    "trap",
    "blank",
    "lucky",
    "trap",
    "blank",
    "lucky",
    "trap",
    "lucky",
    "blank",
    "trap",
    "lucky",
    "trap",
    "blank",
    "blank",
]

SPIRAL = {
    "center_x": 50,
    "center_y": 50,
    "outer_radius": 38.6,
    "inner_radius": 8.2,
    "start_angle": 108,
    "total_rotation": 1024,
}


def point_for_step(step: int) -> tuple[float, float]:
    if step >= 48:
        return SIZE * 0.5, SIZE * 0.5

    t = step / 48
    radius = SPIRAL["outer_radius"] - t * (SPIRAL["outer_radius"] - SPIRAL["inner_radius"])
    angle = (SPIRAL["start_angle"] + t * SPIRAL["total_rotation"]) * pi / 180
    x = SPIRAL["center_x"] + cos(angle) * radius
    y = SPIRAL["center_y"] + sin(angle) * radius
    return SIZE * x / 100, SIZE * y / 100


def ellipse(draw: ImageDraw.ImageDraw, center: tuple[float, float], radius: float, fill, outline=None, width=1):
    x, y = center
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=fill, outline=outline, width=width)


def draw_heart(draw: ImageDraw.ImageDraw, center: tuple[float, float], scale: float, fill):
    x, y = center
    r = scale
    draw.ellipse((x - r * 0.95, y - r * 0.9, x - r * 0.05, y), fill=fill)
    draw.ellipse((x + r * 0.05, y - r * 0.9, x + r * 0.95, y), fill=fill)
    draw.polygon([(x - r, y - r * 0.35), (x + r, y - r * 0.35), (x, y + r * 1.05)], fill=fill)


def draw_flame(draw: ImageDraw.ImageDraw, center: tuple[float, float], scale: float, fill):
    x, y = center
    r = scale
    outer = [
        (x, y - r * 1.18),
        (x + r * 0.76, y - r * 0.24),
        (x + r * 0.46, y + r * 0.86),
        (x, y + r * 1.08),
        (x - r * 0.64, y + r * 0.66),
        (x - r * 0.78, y - r * 0.12),
    ]
    inner = [
        (x + r * 0.12, y - r * 0.56),
        (x + r * 0.38, y + r * 0.02),
        (x, y + r * 0.66),
        (x - r * 0.32, y + r * 0.08),
    ]
    draw.polygon(outer, fill=fill)
    draw.polygon(inner, fill=(255, 238, 180, 230))


def draw_flag(draw: ImageDraw.ImageDraw, center: tuple[float, float], scale: float, fill):
    x, y = center
    pole = scale * 1.35
    draw.rounded_rectangle((x - scale * 0.45, y - pole * 0.62, x - scale * 0.28, y + pole * 0.62), radius=3, fill=fill)
    draw.polygon(
        [
            (x - scale * 0.26, y - pole * 0.56),
            (x + scale * 0.8, y - pole * 0.34),
            (x - scale * 0.26, y - pole * 0.06),
        ],
        fill=fill,
    )


def draw_trophy(draw: ImageDraw.ImageDraw, center: tuple[float, float], scale: float, fill):
    x, y = center
    r = scale
    draw.rounded_rectangle((x - r * 0.66, y - r * 0.82, x + r * 0.66, y + r * 0.2), radius=int(r * 0.22), fill=fill)
    draw.rectangle((x - r * 0.16, y + r * 0.12, x + r * 0.16, y + r * 0.62), fill=fill)
    draw.rounded_rectangle((x - r * 0.58, y + r * 0.58, x + r * 0.58, y + r * 0.78), radius=int(r * 0.12), fill=fill)
    draw.arc((x - r * 1.15, y - r * 0.62, x - r * 0.36, y + r * 0.18), 270, 75, fill=fill, width=max(3, int(r * 0.12)))
    draw.arc((x + r * 0.36, y - r * 0.62, x + r * 1.15, y + r * 0.18), 105, 270, fill=fill, width=max(3, int(r * 0.12)))


def main():
    base = Image.open(SOURCE).convert("RGBA").resize((SIZE, SIZE), Image.Resampling.LANCZOS)

    tint = Image.new("RGBA", (SIZE, SIZE), (18, 6, 12, 86))
    board = Image.alpha_composite(base, tint)

    glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    cell_radius = SIZE * 0.027

    for step, tile in enumerate(BOARD_MAP):
        if step in (0, 48):
            continue
        center = point_for_step(step)
        color = (255, 233, 179, 150) if tile == "blank" else (255, 108, 143, 190) if tile == "lucky" else (255, 196, 83, 190)
        ellipse(glow_draw, center, cell_radius * 1.08, color)

    glow = glow.filter(ImageFilter.GaussianBlur(SIZE * 0.008))
    board = Image.alpha_composite(board, glow)

    layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    for step, tile in enumerate(BOARD_MAP):
        if step in (0, 48):
            continue

        center = point_for_step(step)
        if tile == "lucky":
            fill = (95, 18, 42, 222)
            outline = (255, 218, 196, 235)
            icon_fill = (255, 235, 238, 245)
        elif tile == "trap":
            fill = (210, 146, 48, 226)
            outline = (255, 238, 180, 238)
            icon_fill = (63, 18, 6, 240)
        else:
            fill = (236, 190, 113, 188)
            outline = (255, 236, 192, 210)
            icon_fill = None

        ellipse(draw, center, cell_radius, fill, outline, max(3, int(SIZE * 0.0024)))
        ellipse(draw, center, cell_radius * 0.72, (0, 0, 0, 18))

        if tile == "lucky":
            draw_heart(draw, center, cell_radius * 0.34, icon_fill)
        elif tile == "trap":
            draw_flame(draw, center, cell_radius * 0.34, icon_fill)

    start = point_for_step(0)
    finish = point_for_step(48)
    ellipse(draw, start, cell_radius * 1.38, (80, 190, 240, 236), (232, 250, 255, 246), max(4, int(SIZE * 0.003)))
    draw_flag(draw, start, cell_radius * 0.55, (8, 23, 37, 245))
    ellipse(draw, finish, cell_radius * 1.55, (255, 224, 142, 240), (255, 250, 218, 250), max(4, int(SIZE * 0.003)))
    draw_trophy(draw, finish, cell_radius * 0.58, (59, 20, 4, 246))

    board = Image.alpha_composite(board, layer)
    board = board.convert("RGB")
    board.save(OUTPUT, "WEBP", quality=94, method=6)
    print(OUTPUT)


if __name__ == "__main__":
    main()
