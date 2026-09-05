import { areas, nodes, nodeById, bonfires, bosses, items, npcs, features, enemies, areaById } from "@/data";
import type { Bonfire, Boss, Item, Npc, Feature, Enemy, MapNode, Dlc } from "@/data/types";

export type MarkerKind = "bonfire" | "boss" | "item" | "npc" | "feature" | "enemy";

export interface Marker {
  id: string;
  kind: MarkerKind;
  /** Fine-grained category used for colour/glyph/filters. */
  category: string;
  name: string;
  areaId: string;
  nodeId: string;
  x: number;
  y: number;
  dlc?: Dlc;
  record: Bonfire | Boss | Item | Npc | Feature | Enemy;
}

/** Glyph shapes shared by the canvas renderer and the SVG legend (unit box -1..1). */
export const GLYPHS: Record<string, string> = {
  circle: "M0,-1 A1,1 0 1,0 0,1 A1,1 0 1,0 0,-1Z",
  diamond: "M0,-1 L1,0 L0,1 L-1,0Z",
  square: "M-0.8,-0.8 H0.8 V0.8 H-0.8Z",
  triangle: "M0,-1 L1,0.8 L-1,0.8Z",
  flame: "M0,-1 C0.55,-0.45 1,0 0.75,0.55 C0.55,1 -0.55,1 -0.75,0.55 C-1,0 -0.45,-0.3 -0.2,-0.55 C-0.1,-0.2 0.2,-0.2 0,-1Z",
  star: "M0,-1 L0.29,-0.4 L0.95,-0.31 L0.47,0.15 L0.59,0.81 L0,0.5 L-0.59,0.81 L-0.47,0.15 L-0.95,-0.31 L-0.29,-0.4Z",
  shield: "M-0.8,-0.8 H0.8 V0.2 C0.8,0.6 0.4,0.9 0,1 C-0.4,0.9 -0.8,0.6 -0.8,0.2Z",
  hexagon: "M0,-1 L0.87,-0.5 L0.87,0.5 L0,1 L-0.87,0.5 L-0.87,-0.5Z",
  drop: "M0,-1 C0.6,-0.2 0.8,0.2 0.8,0.4 A0.8,0.8 0 1,1 -0.8,0.4 C-0.8,0.2 -0.6,-0.2 0,-1Z",
  leaf: "M0,-1 C1,-0.6 1,0.6 0,1 C-1,0.6 -1,-0.6 0,-1Z",
  person: "M0,-1 A0.38,0.38 0 1,0 0.001,-1Z M-0.75,1 C-0.75,0.05 0.75,0.05 0.75,1Z",
  key: "M-0.35,-0.45 A0.45,0.45 0 1,0 -0.35,0.45 L0.3,0.45 L0.3,0.2 L0.55,0.2 L0.55,0.45 L0.95,0.45 L0.95,-0.1 L0,-0.1 A0.45,0.45 0 0,0 -0.35,-0.45Z",
  lock: "M-0.7,-0.05 H0.7 V1 H-0.7Z M-0.45,-0.05 V-0.45 A0.45,0.45 0 0,1 0.45,-0.45 V-0.05 H0.25 V-0.45 A0.25,0.25 0 0,0 -0.25,-0.45 V-0.05Z",
  arrow: "M-1,0.3 H0.15 V0.8 L1,0 L0.15,-0.8 V-0.3 H-1Z",
  face: "M-0.85,-0.85 H0.85 V0.85 H-0.85Z M-0.45,-0.35 A0.15,0.15 0 1,0 -0.449,-0.35Z M0.45,-0.35 A0.15,0.15 0 1,0 0.451,-0.35Z M-0.4,0.3 H0.4 V0.5 H-0.4Z",
  chalice: "M-0.8,-0.9 H0.8 C0.8,-0.2 0.3,0.2 0.15,0.35 V0.7 H0.5 V0.9 H-0.5 V0.7 H-0.15 V0.35 C-0.3,0.2 -0.8,-0.2 -0.8,-0.9Z",
  gem: "M-0.6,-0.6 H0.6 L1,-0.1 L0,1 L-1,-0.1Z",
  banner: "M-0.7,-1 H0.7 V0.6 L0,1 L-0.7,0.6Z",
  lever: "M-0.9,0.75 H0.9 V1 H-0.9Z M-0.1,0.75 L0.45,-1 L0.75,-0.9 L0.2,0.75Z",
  swords: "M-1,-0.8 L-0.75,-1 L0.55,0.3 L0.7,0.15 L1,0.45 L0.45,1 L0.15,0.7 L0.3,0.55Z M1,-0.8 L0.75,-1 L-0.55,0.3 L-0.7,0.15 L-1,0.45 L-0.45,1 L-0.15,0.7 L-0.3,0.55Z",
  skull: "M0,-1 C0.6,-1 1,-0.55 1,-0.05 C1,0.3 0.85,0.5 0.65,0.6 V0.95 H-0.65 V0.6 C-0.85,0.5 -1,0.3 -1,-0.05 C-1,-0.55 -0.6,-1 0,-1Z M-0.45,-0.25 A0.22,0.22 0 1,0 -0.449,-0.25Z M0.45,-0.25 A0.22,0.22 0 1,0 0.451,-0.25Z M-0.12,0.15 L0,0.4 L0.12,0.15Z",
  ring: "M0,-1 A1,1 0 1,0 0,1 A1,1 0 1,0 0,-1Z M0,-0.55 A0.55,0.55 0 1,1 -0.001,-0.55Z",
  bag: "M-0.35,-1 H0.35 V-0.6 H-0.35Z M-0.8,-0.6 H0.8 C0.95,0.2 0.95,0.6 0.7,1 H-0.7 C-0.95,0.6 -0.95,0.2 -0.8,-0.6Z",
  wall: "M-0.9,-0.9 H0.9 V-0.3 H-0.9Z M-0.9,-0.15 H0.9 V0.45 H-0.9Z M-0.9,0.6 H0.9 V0.9 H-0.9Z",
};

export interface CategoryMeta {
  id: string;
  label: string;
  color: string;
  glyph: keyof typeof GLYPHS;
  /** Filter group this category belongs to. */
  group: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "bonfire", label: "Bonfire", color: "#ffa23a", glyph: "flame", group: "bonfires" },
  { id: "primal", label: "Primal Bonfire", color: "#ff5d2e", glyph: "flame", group: "bonfires" },
  { id: "boss", label: "Boss", color: "#e0343d", glyph: "skull", group: "bosses" },
  { id: "boss-optional", label: "Boss (optional)", color: "#b8646a", glyph: "skull", group: "bosses" },
  { id: "weapon", label: "Weapon", color: "#cfd9e6", glyph: "diamond", group: "weapons" },
  { id: "shield", label: "Shield", color: "#9fb0c4", glyph: "shield", group: "weapons" },
  { id: "armor", label: "Armor", color: "#8d9fb8", glyph: "shield", group: "armor" },
  { id: "ring", label: "Ring", color: "#f2d16b", glyph: "ring", group: "rings" },
  { id: "spell", label: "Spell", color: "#8fb3ff", glyph: "star", group: "spells" },
  { id: "key", label: "Key", color: "#f0e68c", glyph: "key", group: "keys" },
  { id: "consumable", label: "Consumable", color: "#a9cf8f", glyph: "square", group: "consumables" },
  { id: "ammo", label: "Ammo", color: "#8fb98f", glyph: "triangle", group: "consumables" },
  { id: "tool", label: "Tool", color: "#c9c9c9", glyph: "square", group: "consumables" },
  { id: "titanite", label: "Titanite", color: "#7fd6d0", glyph: "hexagon", group: "upgrade" },
  { id: "twinkling", label: "Twinkling Titanite", color: "#a8f0ff", glyph: "hexagon", group: "upgrade" },
  { id: "dragon-bone", label: "Petrified Dragon Bone", color: "#e8d9b5", glyph: "hexagon", group: "upgrade" },
  { id: "estus-shard", label: "Estus Flask Shard", color: "#ffb347", glyph: "drop", group: "estus" },
  { id: "bone-dust", label: "Sublime Bone Dust", color: "#f5deb3", glyph: "drop", group: "estus" },
  { id: "branch", label: "Fragrant Branch of Yore", color: "#7ee08a", glyph: "leaf", group: "branch" },
  { id: "lockstone", label: "Pharros' Lockstone", color: "#cfa8ff", glyph: "face", group: "lockstone" },
  { id: "soul-vessel", label: "Soul Vessel", color: "#ffc6f0", glyph: "chalice", group: "vessel" },
  { id: "effigy", label: "Human Effigy", color: "#d9a066", glyph: "person", group: "effigy" },
  { id: "lifegem", label: "Lifegem", color: "#7cf59c", glyph: "gem", group: "lifegem" },
  { id: "ascetic", label: "Bonfire Ascetic", color: "#ff7676", glyph: "flame", group: "ascetic" },
  { id: "soul", label: "Soul item", color: "#a8ffe5", glyph: "circle", group: "souls" },
  { id: "boss-soul", label: "Boss soul / fragment", color: "#d0ffe5", glyph: "circle", group: "souls" },
  { id: "unique", label: "Unique / named pickup", color: "#ffffff", glyph: "star", group: "unique" },
  { id: "npc", label: "NPC", color: "#59d0ff", glyph: "person", group: "npcs" },
  { id: "merchant", label: "Merchant / blacksmith", color: "#4fc3f7", glyph: "bag", group: "npcs" },
  { id: "summon", label: "Summon sign", color: "#c0e8ff", glyph: "person", group: "npcs" },
  { id: "covenant", label: "Covenant", color: "#b388ff", glyph: "banner", group: "covenants" },
  { id: "pharros", label: "Pharros' contraption", color: "#d3b8ff", glyph: "face", group: "features" },
  { id: "shortcut", label: "Shortcut", color: "#bdbdbd", glyph: "arrow", group: "features" },
  { id: "locked-door", label: "Locked door / gate", color: "#e0c98f", glyph: "lock", group: "features" },
  { id: "illusory-wall", label: "Illusory wall", color: "#a7a7a7", glyph: "wall", group: "features" },
  { id: "lever", label: "Lever / mechanism", color: "#9e9e9e", glyph: "lever", group: "features" },
  { id: "enemy", label: "Farmable enemy", color: "#ff8f5a", glyph: "swords", group: "enemies" },
];

export const categoryById = new Map(CATEGORIES.map((c) => [c.id, c]));

export interface GroupMeta { id: string; label: string; section: "places" | "items" | "people" }
export const GROUPS: GroupMeta[] = [
  { id: "bonfires", label: "Bonfires", section: "places" },
  { id: "bosses", label: "Bosses", section: "places" },
  { id: "features", label: "Doors, shortcuts, Pharros", section: "places" },
  { id: "npcs", label: "NPCs & merchants", section: "people" },
  { id: "covenants", label: "Covenants", section: "people" },
  { id: "enemies", label: "Farmable enemies", section: "people" },
  { id: "weapons", label: "Weapons & shields", section: "items" },
  { id: "armor", label: "Armor", section: "items" },
  { id: "rings", label: "Rings", section: "items" },
  { id: "spells", label: "Spells", section: "items" },
  { id: "keys", label: "Keys", section: "items" },
  { id: "consumables", label: "Consumables, ammo, tools", section: "items" },
  { id: "upgrade", label: "Titanite & dragon bone", section: "items" },
  { id: "estus", label: "Estus Shards & Bone Dust", section: "items" },
  { id: "branch", label: "Fragrant Branches", section: "items" },
  { id: "lockstone", label: "Pharros' Lockstones", section: "items" },
  { id: "vessel", label: "Soul Vessels", section: "items" },
  { id: "effigy", label: "Human Effigies", section: "items" },
  { id: "lifegem", label: "Lifegems", section: "items" },
  { id: "ascetic", label: "Bonfire Ascetics", section: "items" },
  { id: "souls", label: "Soul items", section: "items" },
  { id: "unique", label: "Unique pickups", section: "items" },
];

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function spiral(i: number): [number, number] {
  // i = 0 is the node centre; markers spread outward in a sunflower pattern
  const r = 16 + 7.5 * Math.sqrt(i + 1);
  const a = (i + 1) * GOLDEN;
  return [Math.cos(a) * r, Math.sin(a) * r];
}

function build(): Marker[] {
  const out: Marker[] = [];
  const perNode = new Map<string, number>();
  const place = (nodeId: string, atCentre: boolean): [number, number] => {
    const n = nodeById.get(nodeId)!;
    if (atCentre) return [n.x, n.y];
    const i = perNode.get(nodeId) ?? 0;
    perNode.set(nodeId, i + 1);
    const [dx, dy] = spiral(i);
    return [n.x + dx, n.y + dy];
  };
  const dlcOf = (areaId: string) => areaById.get(areaId)?.dlc;
  for (const b of bonfires) {
    const [x, y] = place(b.id, true);
    out.push({ id: "bonfire:" + b.id, kind: "bonfire", category: b.primal ? "primal" : "bonfire", name: b.name, areaId: b.areaId, nodeId: b.id, x, y, dlc: dlcOf(b.areaId), record: b });
  }
  for (const b of bosses) {
    const n = nodeById.get(b.node)!;
    const shared = bosses.filter((o) => o.node === b.node);
    const idx = shared.indexOf(b);
    const x = n.x + (shared.length > 1 ? (idx - (shared.length - 1) / 2) * 22 : 0);
    out.push({ id: b.id, kind: "boss", category: b.required ? "boss" : "boss-optional", name: b.name, areaId: b.areaId, nodeId: b.node, x, y: n.y, dlc: b.dlc ?? dlcOf(b.areaId), record: b });
  }
  for (const n of npcs) {
    const cat = n.role === "merchant" || n.role === "blacksmith" ? "merchant" : n.role === "covenant" ? "covenant" : n.role === "summon" ? "summon" : "npc";
    const [x, y] = place(n.node, false);
    out.push({ id: n.id, kind: "npc", category: cat, name: n.name, areaId: n.areaId, nodeId: n.node, x, y, dlc: dlcOf(n.areaId), record: n });
  }
  for (const f of features) {
    const cat = f.kind === "covenant" ? "covenant" : f.kind;
    const [x, y] = place(f.node, false);
    out.push({ id: f.id, kind: "feature", category: cat, name: f.name, areaId: f.areaId, nodeId: f.node, x, y, dlc: dlcOf(f.areaId), record: f });
  }
  for (const e of enemies) {
    const [x, y] = place(e.node, false);
    out.push({ id: e.id, kind: "enemy", category: "enemy", name: e.name, areaId: e.areaIds[0], nodeId: e.node, x, y, dlc: dlcOf(e.areaIds[0]), record: e });
  }
  for (const it of items) {
    const [x, y] = place(it.node, false);
    out.push({ id: it.id, kind: "item", category: it.category, name: it.qty && it.qty > 1 ? `${it.name} ×${it.qty}` : it.name, areaId: it.areaId, nodeId: it.node, x, y, dlc: dlcOf(it.areaId), record: it });
  }
  return out;
}

export const markers: Marker[] = build();
export const markerById = new Map(markers.map((m) => [m.id, m]));
export const markersByNode = (() => {
  const m = new Map<string, Marker[]>();
  for (const mk of markers) {
    let l = m.get(mk.nodeId);
    if (!l) m.set(mk.nodeId, (l = []));
    l.push(mk);
  }
  return m;
})();

export function markerGroup(m: Marker): string {
  return categoryById.get(m.category)?.group ?? "unique";
}

export const worldBounds = (() => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const a of areas) for (const [x, y] of a.shape) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  const pad = 250;
  return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
})();

export { areas, nodes, nodeById, areaById };
export type { MapNode };
