import { areaMaps, areaMapById } from "@/data";
import { markers, type Marker } from "./markers";
import { bbox } from "@/data/areamaps/geom";
import type { AreaMap, Floor } from "@/data/types";

export { areaMaps, areaMapById };

export interface Placed { x: number; y: number; floor: string }

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
/** Sunflower spread around a landmark, in plan units (roughly metres). */
function spiral(i: number): [number, number] {
  const r = 3.2 + 1.7 * Math.sqrt(i + 1);
  const a = (i + 1) * GOLDEN;
  return [Math.cos(a) * r, Math.sin(a) * r];
}

/**
 * Where every marker of a mapped area sits on its floor plan. Bonfires and bosses sit on the
 * landmark itself. Keyed by marker object, not id: NPCs that appear in several areas (Melentia,
 * Cale…) share one id across their markers.
 */
export function layoutAreaMarkers(map: AreaMap): Map<Marker, Placed> {
  const out = new Map<Marker, Placed>();
  const perNode = new Map<string, number>();
  const bossesAtNode = new Map<string, Marker[]>();
  for (const m of markers) if (m.areaId === map.areaId && m.kind === "boss") {
    let l = bossesAtNode.get(m.nodeId); if (!l) bossesAtNode.set(m.nodeId, (l = [])); l.push(m);
  }
  for (const m of markers) {
    if (m.areaId !== map.areaId) continue;
    const p = map.positions[m.nodeId];
    if (!p) continue;
    if (m.kind === "bonfire") { out.set(m, { x: p.x, y: p.y, floor: p.floor }); continue; }
    if (m.kind === "boss") {
      const shared = bossesAtNode.get(m.nodeId) ?? [m];
      const idx = shared.indexOf(m);
      out.set(m, { x: p.x + (shared.length > 1 ? (idx - (shared.length - 1) / 2) * 5 : 0), y: p.y, floor: p.floor });
      continue;
    }
    const i = perNode.get(m.nodeId) ?? 0;
    perNode.set(m.nodeId, i + 1);
    const [dx, dy] = spiral(i);
    out.set(m, { x: p.x + dx, y: p.y + dy, floor: p.floor });
  }
  return out;
}

const layoutCache = new Map<string, Map<Marker, Placed>>();
export function areaLayout(map: AreaMap): Map<Marker, Placed> {
  let l = layoutCache.get(map.areaId);
  if (!l) layoutCache.set(map.areaId, (l = layoutAreaMarkers(map)));
  return l;
}

/** Floors top to bottom. */
export function floorsTopDown(map: AreaMap): Floor[] {
  return [...map.floors].sort((a, b) => b.level - a.level);
}

/** The floor most of the area's bonfires sit on (the natural first view), else the lowest-index floor. */
export function defaultFloor(map: AreaMap): string {
  const count = new Map<string, number>();
  for (const m of markers) {
    if (m.areaId !== map.areaId || m.kind !== "bonfire") continue;
    const p = map.positions[m.nodeId];
    if (p) count.set(p.floor, (count.get(p.floor) ?? 0) + 1);
  }
  let best = map.floors[0].id, bestN = -1;
  for (const f of map.floors) { const n = count.get(f.id) ?? 0; if (n > bestN) { best = f.id; bestN = n; } }
  return best;
}

/** Bounding box of everything drawn on a floor (used to frame a floor when switching). */
export function floorBounds(fl: Floor) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const r of fl.rooms) {
    const b = bbox(r.outline);
    minX = Math.min(minX, b.minX); minY = Math.min(minY, b.minY); maxX = Math.max(maxX, b.maxX); maxY = Math.max(maxY, b.maxY);
  }
  for (const f of fl.features) for (const [x, y] of f.pts) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  if (!isFinite(minX)) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  return { minX, minY, maxX, maxY };
}
