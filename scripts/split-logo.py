#!/usr/bin/env python3
"""
Find the LARGEST vertical transparent column run between x=0 and x=mid.
The center of that run is the split point.
"""
from PIL import Image
import os

SRC = r"D:\MavisProjects\findinchina\public\findinchina.png"
OUT_DIR = r"D:\MavisProjects\findinchina\public"

img = Image.open(SRC).convert("RGBA")
w, h = img.size

# Remove white background
pixels = img.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r > 240 and g > 240 and b > 240:
            pixels[x, y] = (r, g, b, 0)
        elif r > 230 and g > 230 and b > 230 and a > 0:
            pixels[x, y] = (r, g, b, max(0, a - 100))

# Build column density map: how many non-transparent pixels per column
col_density = []
for x in range(w):
    count = 0
    for y in range(h):
        if pixels[x, y][3] > 0:
            count += 1
    col_density.append(count)

# Find longest run of zero-density columns
best_start = None
best_len = 0
i = 0
while i < w:
    if col_density[i] == 0:
        j = i
        while j < w and col_density[j] == 0:
            j += 1
        run_len = j - i
        if run_len > best_len:
            best_len = run_len
            best_start = i
        i = j
    else:
        i += 1

print(f"Density map: max={max(col_density)} min={min(col_density)}")
print(f"Longest empty run: x={best_start} to x={best_start+best_len} (len={best_len})")

if best_start is None or best_len < 5:
    # No clean gap; fall back to fixed ratio
    split_x = int(w * 0.36)
    print(f"No gap, fallback to ratio split at x={split_x}")
else:
    split_x = best_start + best_len // 2
    print(f"Split at x={split_x} (center of gap)")

# Crop icon (0 to split_x)
icon = img.crop((0, 0, split_x, h))
bbox_icon = icon.getbbox()
if bbox_icon:
    icon = icon.crop(bbox_icon)
    pad = max(8, int(icon.size[0] * 0.05))
    new_size = (icon.size[0] + 2 * pad, icon.size[1] + 2 * pad)
    icon_padded = Image.new("RGBA", new_size, (0, 0, 0, 0))
    icon_padded.paste(icon, (pad, pad), icon)
    icon_path = os.path.join(OUT_DIR, "findinchina-icon.png")
    icon_padded.save(icon_path, "PNG")
    print(f"Icon: {icon_padded.size[0]}x{icon_padded.size[1]}")

# Crop wordmark (split_x to end)
word = img.crop((split_x, 0, w, h))
bbox_word = word.getbbox()
if bbox_word:
    word = word.crop(bbox_word)
    pad = max(4, int(word.size[0] * 0.05))
    new_size = (word.size[0] + 2 * pad, word.size[1] + 2 * pad)
    word_padded = Image.new("RGBA", new_size, (0, 0, 0, 0))
    word_padded.paste(word, (pad, pad), word)
    word_path = os.path.join(OUT_DIR, "findinchina-wordmark.png")
    word_padded.save(word_path, "PNG")
    print(f"Wordmark: {word_padded.size[0]}x{word_padded.size[1]}")

# Transparent full
img.save(os.path.join(OUT_DIR, "findinchina-transparent.png"), "PNG")
print("Done.")
