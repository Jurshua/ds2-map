import type { Pt } from "../types";

export function pointInPolygon(x: number, y: number, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Area-weighted centroid; falls back to the vertex mean for degenerate polygons. */
export function centroid(poly: Pt[]): Pt {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const f = poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1];
    a += f; cx += (poly[j][0] + poly[i][0]) * f; cy += (poly[j][1] + poly[i][1]) * f;
  }
  if (Math.abs(a) < 1e-6) {
    const n = poly.length;
    return [poly.reduce((s, p) => s + p[0], 0) / n, poly.reduce((s, p) => s + p[1], 0) / n];
  }
  return [cx / (3 * a), cy / (3 * a)];
}

export function bbox(poly: Pt[]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of poly) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  return { minX, minY, maxX, maxY };
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export function rect(x: number, y: number, w: number, h: number): Pt[] {
  return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
}

export function circle(cx: number, cy: number, r: number, n = 24): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    out.push([r1(cx + Math.cos(a) * r), r1(cy + Math.sin(a) * r)]);
  }
  return out;
}

/** Polygon of width `w` around a polyline (a corridor, path, bridge or stream). */
export function strip(pts: Pt[], w: number): Pt[] {
  const h = w / 2;
  const n = pts.length;
  if (n < 2) throw new Error("strip needs at least two points");
  const dir = (a: Pt, b: Pt): Pt => {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  };
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const d0 = i > 0 ? dir(pts[i - 1], p) : dir(p, pts[i + 1]);
    const d1 = i < n - 1 ? dir(p, pts[i + 1]) : d0;
    const n0: Pt = [-d0[1], d0[0]], n1: Pt = [-d1[1], d1[0]];
    let nx = n0[0] + n1[0], ny = n0[1] + n1[1];
    const len = Math.hypot(nx, ny) || 1;
    nx /= len; ny /= len;
    const cos = nx * n0[0] + ny * n0[1];
    const m = h / Math.max(0.5, cos); // mitre, limited so sharp corners do not spike
    left.push([r1(p[0] + nx * m), r1(p[1] + ny * m)]);
    right.push([r1(p[0] - nx * m), r1(p[1] - ny * m)]);
  }
  return [...left, ...right.reverse()];
}
