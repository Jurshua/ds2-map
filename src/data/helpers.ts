import type {
  Area, MapNode, Bonfire, Boss, Item, Npc, Feature, Edge, Enemy, ItemCategory, NodeKind, Requirement,
} from "./types";

/** Everything one area contributes to the world. Node/shape coordinates are relative to `origin`. */
export interface AreaBundleInput {
  area: Area;
  nodes: MapNode[];
  bonfires: Bonfire[];
  bosses: Boss[];
  items: Omit<Item, "id">[];
  npcs: Npc[];
  features: Feature[];
  edges: Edge[];
  enemies?: Enemy[];
}

export interface AreaBundle {
  area: Area;
  nodes: MapNode[];
  bonfires: Bonfire[];
  bosses: Boss[];
  items: Item[];
  npcs: Npc[];
  features: Feature[];
  edges: Edge[];
  enemies?: Enemy[];
}

export const FEX = "https://darksouls2.wiki.fextralife.com/";
export const WD = "http://darksouls2.wikidot.com/";

/** Short item constructor. */
export function it(
  areaId: string,
  name: string,
  category: ItemCategory,
  node: string,
  howToReach: string,
  extra: Partial<Pick<Item, "qty" | "prerequisites" | "note" | "ngPlusOnly" | "source">> = {},
): Omit<Item, "id"> {
  return { name, category, areaId, node, howToReach, ...extra, source: extra.source ?? "" };
}

export function node(areaId: string, id: string, name: string, kind: NodeKind, x: number, y: number, note?: string): MapNode {
  return { id, name, areaId, kind, x, y, note };
}

export function edge(
  from: string,
  to: string,
  cost: number,
  note: string,
  extra: Partial<Pick<Edge, "oneWay" | "requires" | "kind">> = {},
): Edge {
  return { from, to, cost, note, ...extra };
}

export const req = {
  key: (name: string, note?: string): Requirement => ({ type: "key", name, note }),
  branch: (note?: string): Requirement => ({ type: "branch", name: "Fragrant Branch of Yore", note }),
  lockstone: (note?: string): Requirement => ({ type: "lockstone", name: "Pharros' Lockstone", note }),
  boss: (name: string, note?: string): Requirement => ({ type: "boss", name, note }),
  item: (name: string, note?: string): Requirement => ({ type: "item", name, note }),
  event: (name: string, note?: string): Requirement => ({ type: "event", name, note }),
  ring: (name: string, note?: string): Requirement => ({ type: "ring", name, note }),
  dlc: (name: string, note?: string): Requirement => ({ type: "dlc", name, note }),
  ascetic: (note?: string): Requirement => ({ type: "ascetic", name: "Bonfire Ascetic", note }),
};

/** Finalise a bundle: apply origin offsets, assign item ids, fill default sources. */
export function finalize(
  origin: [number, number],
  bundle: AreaBundleInput,
  defaultSource: string,
): AreaBundle {
  const [ox, oy] = origin;
  const area: Area = {
    ...bundle.area,
    shape: bundle.area.shape.map(([x, y]) => [x + ox, y + oy] as [number, number]),
    label: [bundle.area.label[0] + ox, bundle.area.label[1] + oy],
    source: bundle.area.source || defaultSource,
  };
  const nodes = bundle.nodes.map((n) => ({ ...n, x: n.x + ox, y: n.y + oy }));
  const items = bundle.items.map((i, idx) => ({
    ...i,
    id: `${area.id}.item.${idx + 1}`,
    source: i.source || defaultSource,
  }));
  const fill = <T extends { source: string }>(arr: T[]) => arr.map((r) => ({ ...r, source: r.source || defaultSource }));
  return {
    area,
    nodes,
    bonfires: fill(bundle.bonfires),
    bosses: fill(bundle.bosses),
    items,
    npcs: fill(bundle.npcs),
    features: fill(bundle.features),
    edges: bundle.edges,
    enemies: bundle.enemies ? fill(bundle.enemies) : [],
  };
}
