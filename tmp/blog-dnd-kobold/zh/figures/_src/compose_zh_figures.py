#!/usr/bin/env python3
"""Compose ZH kobold blog figures. Labels are drawn with Noto Sans SC, not generated."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent


def _noto_path() -> Path:
    for parent in [ROOT, *ROOT.parents]:
        candidate = parent / "public/fonts/editor/noto-sans-sc/NotoSansSC[wght].ttf"
        if candidate.exists():
            return candidate
    raise FileNotFoundError("missing Noto Sans SC under public/fonts/editor")


NOTO = _noto_path()

W, H = 1536, 1024
INK = "#1c140e"
CREAM = "#f6ecd8"
CREAM_DIM = "#efe2c9"
GOLD = "#c4a15a"
GOLD_DEEP = "#8a6a32"
BRONZE = "#6b3e22"
TEAL = "#1f4a45"
TEAL_INK = "#14332f"
RED = "#8a2a22"
RED_DEEP = "#5a1c18"
OK_GREEN = "#2c4a32"
MUTED = "#6a5b4a"
FOOTER = "#b7a48a"


def font(size: int, weight: int = 700) -> ImageFont.FreeTypeFont:
    loaded = ImageFont.truetype(str(NOTO), size)
    loaded.set_variation_by_axes([weight])
    return loaded


def cover_crop(src: Image.Image, width: int, height: int) -> Image.Image:
    source = src.convert("RGB")
    scale = max(width / source.width, height / source.height)
    resized = source.resize(
        (max(1, round(source.width * scale)), max(1, round(source.height * scale))),
        Image.Resampling.LANCZOS,
    )
    left = (resized.width - width) // 2
    top = (resized.height - height) // 2
    return resized.crop((left, top, left + width, top + height))


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius, fill=255)
    return mask


def paste_rounded(
    base: Image.Image,
    photo: Image.Image,
    box: tuple[int, int, int, int],
    radius: int,
) -> None:
    x0, y0, x1, y1 = box
    cropped = cover_crop(photo, x1 - x0, y1 - y0)
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    layer.paste(cropped.convert("RGBA"), (x0, y0))
    mask = Image.new("L", base.size, 0)
    mask.paste(rounded_mask((x1 - x0, y1 - y0), radius), (x0, y0))
    base.paste(Image.alpha_composite(base.convert("RGBA"), layer), mask=mask)


def text_size(draw: ImageDraw.ImageDraw, text: str, used: ImageFont.ImageFont) -> tuple[int, int]:
    bbox = draw.textbbox((0, 0), text, font=used)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def draw_centered(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    text: str,
    used: ImageFont.ImageFont,
    fill: str,
) -> None:
    x0, y0, x1, y1 = box
    tw, th = text_size(draw, text, used)
    bbox = draw.textbbox((0, 0), text, font=used)
    x = x0 + (x1 - x0 - tw) / 2 - bbox[0]
    y = y0 + (y1 - y0 - th) / 2 - bbox[1]
    draw.text((x, y), text, font=used, fill=fill)


def draw_badge(draw: ImageDraw.ImageDraw, cx: int, cy: int, ok: bool) -> None:
    r = 22
    fill = OK_GREEN if ok else RED
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill, outline=CREAM, width=3)
    if ok:
        draw.line((cx - 9, cy + 1, cx - 3, cy + 8), fill=CREAM, width=4)
        draw.line((cx - 3, cy + 8, cx + 10, cy - 8), fill=CREAM, width=4)
    else:
        draw.line((cx - 8, cy - 8, cx + 8, cy + 8), fill=CREAM, width=4)
        draw.line((cx - 8, cy + 8, cx + 8, cy - 8), fill=CREAM, width=4)


def mute_reject(photo: Image.Image) -> Image.Image:
    dimmed = ImageEnhance.Color(photo.convert("RGB")).enhance(0.45)
    dimmed = ImageEnhance.Brightness(dimmed).enhance(0.62)
    dimmed = ImageEnhance.Contrast(dimmed).enhance(1.08)
    return dimmed


def miner_silhouette(photo: Image.Image) -> Image.Image:
    rgb = photo.convert("RGB")
    shadow = ImageEnhance.Color(rgb).enhance(0.15)
    shadow = ImageEnhance.Brightness(shadow).enhance(0.38)
    shadow = ImageEnhance.Contrast(shadow).enhance(1.25)
    flame = ImageEnhance.Color(rgb).enhance(1.35)
    flame = ImageEnhance.Brightness(flame).enhance(1.1)
    gray = rgb.convert("L")
    r, g, b = rgb.split()
    flame_mask = ImageChops.subtract(r, b)
    flame_mask = flame_mask.point(lambda n: min(255, n * 2) if n > 70 else 0)
    flame_mask = flame_mask.filter(ImageFilter.GaussianBlur(2))
    blended = Image.composite(flame, shadow, flame_mask)
    return blended


def save_png(image: Image.Image, name: str) -> Path:
    path = OUT / name
    image.convert("RGB").save(path, "PNG", optimize=True)
    return path


def compose_cover() -> Path:
    src = Image.open(ROOT / "cover.jpg")
    cover = src.convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS)
    return save_png(cover, "cover-kobold-zh.png")


def compose_identify() -> Path:
    canvas = Image.new("RGB", (W, H), INK)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((22, 22, W - 23, H - 23), 28, fill="#241910")

    pad = 40
    gap = 22
    footer_h = 46
    label_h = 92
    grid_top = pad
    grid_bottom = H - pad - footer_h
    grid_left = pad
    grid_right = W - pad
    cell_w = (grid_right - grid_left - gap) // 2
    cell_h = (grid_bottom - grid_top - gap) // 2

    panels = [
        {
            "photo": Image.open(ROOT / "kobold-bust.jpg"),
            "ok": True,
            "title": "DND 狗头人",
            "sub": "Kobold",
            "treat": "keep",
        },
        {
            "photo": Image.open(ROOT / "candle-miner.jpg"),
            "ok": False,
            "title": "不是这只",
            "sub": "蜡烛矿工",
            "treat": "silhouette",
        },
        {
            "photo": Image.open(ROOT / "dragonborn.jpg"),
            "ok": False,
            "title": "龙裔",
            "sub": "",
            "treat": "mute",
        },
        {
            "photo": Image.open(ROOT / "goblin.jpg"),
            "ok": False,
            "title": "地精",
            "sub": "",
            "treat": "mute",
        },
    ]

    title_font = font(40, 800)
    sub_font = font(26, 600)
    footer_font = font(18, 500)

    for index, panel in enumerate(panels):
        col = index % 2
        row = index // 2
        x0 = grid_left + col * (cell_w + gap)
        y0 = grid_top + row * (cell_h + gap)
        x1 = x0 + cell_w
        y1 = y0 + cell_h
        border = GOLD if panel["ok"] else RED_DEEP
        draw.rounded_rectangle((x0 - 3, y0 - 3, x1 + 3, y1 + 3), 22, fill=border)
        draw.rounded_rectangle((x0, y0, x1, y1), 20, fill="#110c08")

        photo = panel["photo"]
        if panel["treat"] == "silhouette":
            photo = miner_silhouette(photo)
        elif panel["treat"] == "mute":
            photo = mute_reject(photo)
        paste_rounded(canvas, photo, (x0 + 4, y0 + 4, x1 - 4, y1 - 4), 18)
        draw = ImageDraw.Draw(canvas)

        bar_top = y1 - label_h
        overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        bar_fill = (44, 74, 50, 230) if panel["ok"] else (90, 28, 24, 230)
        overlay_draw.rounded_rectangle(
            (x0 + 4, bar_top, x1 - 4, y1 - 4),
            16,
            fill=bar_fill,
        )
        canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
        draw = ImageDraw.Draw(canvas)

        if panel["sub"]:
            draw_centered(draw, (x0, bar_top + 8, x1, bar_top + 52), panel["title"], title_font, CREAM)
            draw_centered(draw, (x0, bar_top + 48, x1, y1 - 10), panel["sub"], sub_font, GOLD)
        else:
            draw_centered(draw, (x0, bar_top, x1, y1 - 4), panel["title"], title_font, CREAM)

        draw_badge(draw, x1 - 36, y0 + 36, panel["ok"])

    draw_centered(
        draw,
        (pad, H - footer_h - 8, W - pad, H - 16),
        "示意图，不是官方书页，也不是某款游戏截图。",
        footer_font,
        FOOTER,
    )
    return save_png(canvas, "fig-zh-01-identify.png")


def pill(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    text: str,
    used: ImageFont.ImageFont,
    fill: str,
    ink: str,
) -> int:
    tw, th = text_size(draw, text, used)
    pad_x, pad_y = 18, 10
    w = tw + pad_x * 2
    h = th + pad_y * 2
    draw.rounded_rectangle((x, y, x + w, y + h), 18, fill=fill)
    bbox = draw.textbbox((0, 0), text, font=used)
    draw.text((x + pad_x - bbox[0], y + pad_y - bbox[1]), text, font=used, fill=ink)
    return w


def compose_lock() -> Path:
    canvas = Image.new("RGB", (W, H), INK)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((22, 22, W - 23, H - 23), 28, fill="#241910")

    banner = (48, 40, W - 48, 118)
    draw.rounded_rectangle(banner, 18, fill=CREAM)
    draw_centered(draw, banner, "先问 DM 锁哪一页", font(44, 850), INK)

    gap = 132
    card_top = 142
    card_bottom = H - 48
    card_left = 48
    card_right = W - 48
    card_w = (card_right - card_left - gap) // 2
    left_box = (card_left, card_top, card_left + card_w, card_bottom)
    right_box = (card_left + card_w + gap, card_top, card_left + card_w * 2 + gap, card_bottom)

    volo = Image.open(ROOT / "volo-grovel.jpg")
    motm = Image.open(ROOT / "motm-roar.jpg")
    _draw_player_card(
        canvas,
        left_box,
        title="瓦罗",
        header=BRONZE,
        photo=volo,
        traits=["摇尾乞怜", "集群战术", "日照敏感"],
        accent=GOLD,
    )
    _draw_player_card(
        canvas,
        right_box,
        title="魔邓肯",
        header=TEAL,
        photo=motm,
        traits=["龙吼", "狗头人遗产"],
        accent="#7db8b0",
    )

    draw = ImageDraw.Draw(canvas)
    mid_x = (left_box[2] + right_box[0]) // 2
    mid_y = (card_top + card_bottom) // 2
    stamp_w, stamp_h = 108, 220
    stamp = (
        mid_x - stamp_w // 2,
        mid_y - stamp_h // 2,
        mid_x + stamp_w // 2,
        mid_y + stamp_h // 2,
    )
    draw.rounded_rectangle(stamp, 24, fill=CREAM, outline=GOLD_DEEP, width=4)
    xor_font = font(28, 850)
    small = font(22, 700)
    draw_centered(draw, (stamp[0], stamp[1] + 18, stamp[2], stamp[1] + 70), "XOR", xor_font, RED)
    draw_centered(draw, (stamp[0], stamp[1] + 72, stamp[2], stamp[1] + 118), "二选一", small, INK)
    draw.line((mid_x - 28, stamp[1] + 128, mid_x + 28, stamp[1] + 128), fill=GOLD_DEEP, width=2)
    stacked = font(20, 700)
    for index, char in enumerate("不要混写"):
        y = stamp[1] + 140 + index * 18
        draw_centered(draw, (stamp[0], y, stamp[2], y + 18), char, stacked, MUTED)

    return save_png(canvas, "fig-zh-02-lock.png")


def _draw_player_card(
    canvas: Image.Image,
    box: tuple[int, int, int, int],
    title: str,
    header: str,
    photo: Image.Image,
    traits: list[str],
    accent: str,
) -> None:
    draw = ImageDraw.Draw(canvas)
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0, y0, x1, y1), 24, fill=CREAM)
    header_h = 70
    header_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    header_draw = ImageDraw.Draw(header_layer)
    header_draw.rounded_rectangle((x0, y0, x1, y0 + header_h + 24), 24, fill=header)
    header_draw.rectangle((x0, y0 + header_h, x1, y0 + header_h + 24), fill=header)
    canvas.paste(Image.alpha_composite(canvas.convert("RGBA"), header_layer).convert("RGB"))
    draw = ImageDraw.Draw(canvas)
    draw_centered(draw, (x0, y0, x1, y0 + header_h), title, font(42, 850), CREAM)

    trait_h = 118
    photo_box = (x0 + 16, y0 + header_h + 12, x1 - 16, y1 - trait_h)
    paste_rounded(canvas, photo, photo_box, 16)
    draw = ImageDraw.Draw(canvas)

    pill_font = font(26, 700)
    chips_top = y1 - trait_h + 28
    widths = []
    for trait in traits:
        tw, th = text_size(draw, trait, pill_font)
        widths.append(tw + 36)
    total = sum(widths) + 12 * (len(traits) - 1)
    start = x0 + (x1 - x0 - total) // 2
    x = start
    for trait, width in zip(traits, widths, strict=True):
        pill(draw, x, chips_top, trait, pill_font, header, CREAM)
        x += width + 12
    note_font = font(16, 500)
    draw_centered(draw, (x0, y1 - 28, x1, y1 - 8), "锁页示意，不是官方书页扫描", note_font, MUTED)


def compose_axes() -> Path:
    canvas = Image.new("RGB", (W, H), "#2b2118")
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((36, 28, W - 37, H - 29), 32, fill=CREAM)

    title_font = font(48, 900)
    sub_font = font(24, 500)
    axis_font = font(28, 800)
    box_font = font(34, 800)
    meta_font = font(22, 600)
    xor_font = font(26, 850)
    foot_font = font(18, 500)

    draw_centered(draw, (80, 48, W - 80, 108), "两条分叉，不要合成", title_font, INK)
    draw_centered(
        draw,
        (80, 108, W - 80, 148),
        "玩家抄一页，怪物另锁一页。中间没有通用狗头人。",
        sub_font,
        MUTED,
    )

    player_band = (72, 172, W - 72, 478)
    monster_band = (72, 612, W - 72, 918)
    _axis_band(
        draw,
        player_band,
        label="玩家页",
        left_title="瓦罗",
        left_meta=["锁这一页", "不要混进魔邓肯"],
        right_title="魔邓肯",
        right_meta=["锁这一页", "不要混进瓦罗"],
        accent=BRONZE,
        ink=CREAM,
    )
    _axis_band(
        draw,
        monster_band,
        label="怪物页",
        left_title="2014 Kobold",
        left_meta=["类人", "守序邪恶"],
        right_title="2024 狗头人武者",
        right_meta=["龙类", "中立"],
        accent=TEAL,
        ink=CREAM,
    )

    gap_top = player_band[3]
    gap_bottom = monster_band[1]
    mid_y = (gap_top + gap_bottom) // 2
    draw.line((120, gap_top + 18, 520, gap_top + 18), fill=RED, width=4)
    draw.line((1016, gap_top + 18, 1416, gap_top + 18), fill=RED, width=4)
    for x in range(120, 521, 28):
        draw.line((x, gap_top + 8, x + 10, gap_top + 28), fill=RED, width=3)
    for x in range(1016, 1417, 28):
        draw.line((x, gap_top + 8, x + 10, gap_top + 28), fill=RED, width=3)

    break_box = (560, mid_y - 48, 976, mid_y + 48)
    draw.rounded_rectangle(break_box, 18, fill=INK)
    draw_centered(draw, (560, mid_y - 48, 976, mid_y + 4), "两轴断开", axis_font, CREAM)
    draw_centered(draw, (560, mid_y - 4, 976, mid_y + 48), "不要抄进另一轴", meta_font, GOLD)

    draw_centered(
        draw,
        (80, 940, W - 80, 988),
        "示意图，不是统计块。不要把两轴合成一只标准狗头人。",
        foot_font,
        MUTED,
    )
    return save_png(canvas, "fig-zh-03-axes.png")


def _axis_band(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    label: str,
    left_title: str,
    left_meta: list[str],
    right_title: str,
    right_meta: list[str],
    accent: str,
    ink: str,
) -> None:
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0, y0, x1, y1), 24, outline=accent, width=4, fill=CREAM_DIM)
    label_box = (x0 + 24, y0 + 16, x0 + 180, y0 + 58)
    draw.rounded_rectangle(label_box, 12, fill=accent)
    draw_centered(draw, label_box, label, font(24, 800), ink)

    inner_top = y0 + 76
    inner_bottom = y1 - 24
    inner_left = x0 + 28
    inner_right = x1 - 28
    xor_w = 150
    mid = (inner_left + inner_right) // 2
    left_card = (inner_left, inner_top, mid - xor_w // 2 - 8, inner_bottom)
    right_card = (mid + xor_w // 2 + 8, inner_top, inner_right, inner_bottom)
    xor_box = (mid - xor_w // 2, inner_top + 36, mid + xor_w // 2, inner_bottom - 36)

    _choice_card(draw, left_card, left_title, left_meta, accent, ink)
    _choice_card(draw, right_card, right_title, right_meta, accent, ink)

    draw.ellipse(xor_box, fill=INK, outline=accent, width=4)
    draw_centered(
        draw,
        (xor_box[0], xor_box[1] + 18, xor_box[2], xor_box[1] + 70),
        "XOR",
        font(28, 900),
        GOLD,
    )
    draw_centered(
        draw,
        (xor_box[0], xor_box[1] + 68, xor_box[2], xor_box[3] - 18),
        "二选一",
        font(22, 700),
        CREAM,
    )


def _choice_card(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    title: str,
    meta: list[str],
    accent: str,
    ink: str,
) -> None:
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0, y0, x1, y1), 18, fill=accent)
    draw_centered(draw, (x0 + 12, y0 + 18, x1 - 12, y0 + 78), title, font(32, 850), ink)
    draw.line((x0 + 36, y0 + 86, x1 - 36, y0 + 86), fill=GOLD, width=2)
    line_h = (y1 - (y0 + 96)) // max(1, len(meta))
    for index, line in enumerate(meta):
        top = y0 + 96 + index * line_h
        draw_centered(draw, (x0 + 12, top, x1 - 12, top + line_h), line, font(24, 650), CREAM)


def main() -> None:
    if not NOTO.exists():
        raise FileNotFoundError(f"missing Chinese font: {NOTO}")
    cover = compose_cover()
    fig1 = compose_identify()
    fig2 = compose_lock()
    fig3 = compose_axes()
    for path in (cover, fig1, fig2, fig3):
        image = Image.open(path)
        print(f"{path.name}\t{image.size[0]}x{image.size[1]}\t{path.stat().st_size}")


if __name__ == "__main__":
    main()
