import type { AreaMap, MapNode } from "../types";
import { pointInPolygon } from "./geom";
import majula from "./majula";
import fofg from "./fofg";
import heides from "./heides";
import ironKeep from "./iron_keep";

/** Hand-drawn floor plans. Coverage is partial; the UI falls back to the world schematic elsewhere. */
export const areaMaps: AreaMap[] = [majula, fofg, heides, ironKeep];
export const areaMapById = new Map(areaMaps.map((m) => [m.areaId, m]));

const LINE_KINDS = new Set(["stairs", "fog", "door", "locked-door", "illusory-wall", "drop", "bridge"]);

/** Integrity check: every node of a mapped area is placed inside a room of an existing floor. */
export function validateAreaMaps(nodes: MapNode[], areaIds: Set<string>, maps: AreaMap[] = areaMaps): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const m of maps) {
    const tag = `areamap ${m.areaId}`;
    if (seen.has(m.areaId)) problems.push(`${tag}: duplicate map`);
    seen.add(m.areaId);
    if (!areaIds.has(m.areaId)) problems.push(`${tag}: unknown area`);
    if (!(m.width > 0 && m.height > 0)) problems.push(`${tag}: width/height must be positive`);
    if (!m.references.length) problems.push(`${tag}: no references`);
    if (!m.floors.length) problems.push(`${tag}: no floors`);
    const floorIds = new Set<string>();
    for (const fl of m.floors) {
      if (floorIds.has(fl.id)) problems.push(`${tag}: duplicate floor ${fl.id}`);
      floorIds.add(fl.id);
      const roomIds = new Set<string>();
      for (const r of fl.rooms) {
        if (roomIds.has(r.id)) problems.push(`${tag}/${fl.id}: duplicate room ${r.id}`);
        roomIds.add(r.id);
        if (r.outline.length < 3) problems.push(`${tag}/${fl.id}: room ${r.id} needs 3+ points`);
        for (const [x, y] of r.outline) if (x < 0 || y < 0 || x > m.width || y > m.height) { problems.push(`${tag}/${fl.id}: room ${r.id} leaves the map bounds`); break; }
      }
      for (const ft of fl.features) {
        if (!ft.pts.length) problems.push(`${tag}/${fl.id}: ${ft.kind} feature without points`);
        if (LINE_KINDS.has(ft.kind) && ft.pts.length < 2) problems.push(`${tag}/${fl.id}: ${ft.kind} "${ft.label ?? ""}" needs 2+ points`);
        if (ft.toFloor && !m.floors.some((f) => f.id === ft.toFloor)) problems.push(`${tag}/${fl.id}: ${ft.kind} "${ft.label ?? ""}" leads to unknown floor ${ft.toFloor}`);
        if (ft.kind === "note" && !ft.label) problems.push(`${tag}/${fl.id}: note without a label`);
      }
    }
    const areaNodes = nodes.filter((n) => n.areaId === m.areaId);
    const nodeIds = new Set(areaNodes.map((n) => n.id));
    for (const n of areaNodes) if (!m.positions[n.id]) problems.push(`${tag}: node ${n.id} has no position`);
    for (const [id, p] of Object.entries(m.positions)) {
      if (!nodeIds.has(id)) { problems.push(`${tag}: position for ${id}, which is not a node of this area`); continue; }
      const fl = m.floors.find((f) => f.id === p.floor);
      if (!fl) { problems.push(`${tag}: node ${id} placed on unknown floor ${p.floor}`); continue; }
      if (!fl.rooms.some((r) => pointInPolygon(p.x, p.y, r.outline))) problems.push(`${tag}: node ${id} at (${p.x}, ${p.y}) is outside every room on floor ${p.floor}`);
    }
  }
  return problems;
}
