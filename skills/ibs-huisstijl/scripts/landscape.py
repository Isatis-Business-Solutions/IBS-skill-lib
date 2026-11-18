#!/usr/bin/env python3
"""Draw an IBS point-cloud landscape: a faint wireframe of a rolling landscape, with a dot on every grid point.

Every run with a new seed gives a different landscape, so the backdrop is recognisably IBS but never the
same twice. Output is an SVG with a transparent background, to lay over the dark IBS background (#171717).

    python landscape.py OUT.svg [--seed N] [--width 1080] [--height 1080] [--horizon 0.55] [--height-scale 1.0]
                                [--line "#9A958C"] [--accent 0.0] [--opacity 0.5]

--horizon     where the far edge of the landscape sits, as a fraction of the height (0 = top, 1 = bottom).
--height-scale  how strongly the land rolls (0.5 calm, 1 normal, 2 dramatic).
--accent      fraction of the dots drawn in IBS yellow (0 = none; keep it small, e.g. 0.03).
--opacity     overall strength; keep it low so text on top stays readable.
Standard library only.
"""
from __future__ import annotations

import argparse
import math
import random
import sys
from dataclasses import dataclass
from pathlib import Path

ACCENT = "#F9C852"
COLS, ROWS = 96, 46          # grid resolution (left-right, near-far)
NEAR, FAR = 1.0, 12.0        # depth range of the grid
HALF_WIDTH = 9.0             # half width of the grid at world scale
CAMERA_HEIGHT = 2.4


@dataclass(frozen=True)
class Wave:
    kx: float
    kz: float
    phase: float
    amp: float


def make_waves(rng: random.Random, scale: float) -> list[Wave]:
    """A few long, soft waves in random directions: rolling land, no spikes."""
    waves = []
    for i in range(4):
        angle = rng.uniform(0, math.pi)
        freq = rng.uniform(0.18, 0.45) * (1 + i * 0.35)
        waves.append(Wave(freq * math.cos(angle), freq * math.sin(angle), rng.uniform(0, 2 * math.pi),
                          scale * rng.uniform(0.6, 1.2) / (1 + i * 0.5)))
    return waves


def height(waves: list[Wave], x: float, z: float) -> float:
    return sum(w.amp * math.sin(w.kx * x + w.kz * z + w.phase) for w in waves)


def project(x: float, y: float, z: float, width: int, height_px: int, horizon: float) -> tuple[float, float]:
    focal = width * 0.62
    sx = width / 2 + focal * x / z
    sy = height_px * horizon + focal * (CAMERA_HEIGHT - y) / z * 0.42
    return sx, sy


def depth_alpha(z: float) -> float:
    """Near lines are clear, far lines fade into the dark."""
    t = (z - NEAR) / (FAR - NEAR)
    return 0.25 + 0.75 * max(0.0, 1.0 - t) ** 0.9


def build_svg(seed: int, width: int, height_px: int, horizon: float, scale: float,
              line: str, accent: float, opacity: float) -> str:
    rng = random.Random(seed)
    waves = make_waves(rng, scale)
    grid = []
    for r in range(ROWS):
        z = NEAR + (FAR - NEAR) * (r / (ROWS - 1)) ** 1.6
        row = []
        for c in range(COLS):
            x = -HALF_WIDTH * 2.2 + 4.4 * HALF_WIDTH * c / (COLS - 1)
            row.append((project(x, height(waves, x, z), z, width, height_px, horizon), z))
        grid.append(row)

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height_px}" viewBox="0 0 {width} {height_px}">',
        '<defs><linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/>'
        '<stop offset="0.15" stop-color="#fff"/><stop offset="0.85" stop-color="#fff"/>'
        '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
        f'<mask id="edges"><rect width="{width}" height="{height_px}" fill="url(#fade)"/></mask></defs>',
        f'<g mask="url(#edges)" opacity="{opacity:.2f}" fill="none" stroke="{line}" stroke-width="0.6">',
    ]
    for row in grid:  # lines across, one opacity per row
        a = depth_alpha(row[0][1])
        if a < 0.02:
            continue
        pts = " ".join(f"{p[0]:.1f},{p[1]:.1f}" for p, _ in row)
        parts.append(f'<polyline points="{pts}" stroke-opacity="{a:.2f}"/>')
    for c in range(COLS):  # lines into the depth, segment by segment
        for r in range(ROWS - 1):
            (p1, z1), (p2, _) = grid[r][c], grid[r + 1][c]
            a = depth_alpha(z1) * 0.8
            if a < 0.02:
                continue
            parts.append(f'<line x1="{p1[0]:.1f}" y1="{p1[1]:.1f}" x2="{p2[0]:.1f}" y2="{p2[1]:.1f}" stroke-opacity="{a:.2f}"/>')
    parts.append('</g>')
    parts.append(f'<g mask="url(#edges)" opacity="{opacity:.2f}" stroke="none">')
    for row in grid:  # a dot on every grid point
        for (x, y), z in row:
            if not (-5 < x < width + 5 and -5 < y < height_px + 5):
                continue
            a = depth_alpha(z)
            if a < 0.03:
                continue
            is_accent = rng.random() < accent
            radius = (2.2 if is_accent else 1.1) * (0.6 + a * 0.6)
            colour = ACCENT if is_accent else line
            parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{radius:.2f}" fill="{colour}" fill-opacity="{min(1.0, a * 1.2):.2f}"/>')
    parts.append('</g></svg>')
    return "\n".join(parts)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("out", type=Path)
    parser.add_argument("--seed", type=int, default=None, help="random if left out; printed so you can redo it")
    parser.add_argument("--width", type=int, default=1080)
    parser.add_argument("--height", type=int, default=1080)
    parser.add_argument("--horizon", type=float, default=0.55)
    parser.add_argument("--height-scale", type=float, default=1.0)
    parser.add_argument("--line", default="#9A958C")
    parser.add_argument("--accent", type=float, default=0.0)
    parser.add_argument("--opacity", type=float, default=0.5)
    args = parser.parse_args()
    if not 0 <= args.horizon <= 1 or not 0 <= args.accent <= 1 or not 0 < args.opacity <= 1:
        print("landscape.py: --horizon and --accent must be 0..1, --opacity 0..1 (not 0)", file=sys.stderr)
        return 1
    seed = args.seed if args.seed is not None else random.SystemRandom().randrange(1_000_000)
    svg = build_svg(seed, args.width, args.height, args.horizon, args.height_scale, args.line, args.accent, args.opacity)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(svg, encoding="utf-8")
    print(f"wrote {args.out} (seed {seed})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
