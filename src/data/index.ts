import type { Area, MapNode, Bonfire, Boss, Item, Npc, Feature, Edge, Enemy } from "./types";
import type { AreaBundle } from "./helpers";
import thingsBetwixt from "./areas/things_betwixt";
import majula from "./areas/majula";
import fofg from "./areas/fofg";
import heides from "./areas/heides";
import cathedralBlue from "./areas/cathedral_blue";
import wharf from "./areas/wharf";
import bastille from "./areas/bastille";
import belfryLuna from "./areas/belfry_luna";
import sinnersRise from "./areas/sinners_rise";
import copse from "./areas/copse";
import purgatory from "./areas/purgatory";
import harvest from "./areas/harvest";
import earthen from "./areas/earthen";
import ironKeep from "./areas/iron_keep";
import belfrySol from "./areas/belfry_sol";
import shaded from "./areas/shaded";
import winter from "./areas/winter";
import pharros from "./areas/pharros";
import tseldora from "./areas/tseldora";
import lordsChamber from "./areas/lords_chamber";
import graveSaints from "./areas/grave_saints";
import gutter from "./areas/gutter";
import gulch from "./areas/gulch";
import drangleic from "./areas/drangleic";
import amana from "./areas/amana";
import crypt from "./areas/crypt";
import aldias from "./areas/aldias";
import aerie from "./areas/aerie";
import dshrine from "./areas/dshrine";
import { memJeigh, memOrro, memVammar } from "./areas/memories";
import memOik from "./areas/mem_oik";
import throne from "./areas/throne";
import chasm from "./areas/chasm";
import shulva from "./areas/shulva";
import sanctum from "./areas/sanctum";
import drest from "./areas/drest";
import caveDead from "./areas/cave_dead";
import brume from "./areas/brume";
import ironPassage from "./areas/iron_passage";
import eleum from "./areas/eleum";
import { grandCathedral, oldChaos, frigidOutskirts } from "./areas/ivory_small";
import { enemies as enemyList, DESPAWN_NOTE } from "./enemies";

export const bundles: AreaBundle[] = [
  thingsBetwixt, majula, fofg, heides, cathedralBlue, wharf, bastille, belfryLuna, sinnersRise,
  copse, purgatory, harvest, earthen, ironKeep, belfrySol, shaded, winter, pharros, tseldora,
  lordsChamber, graveSaints, gutter, gulch, drangleic, amana, crypt, aldias, aerie, dshrine,
  memJeigh, memOrro, memVammar, memOik, throne, chasm, shulva, sanctum, drest, caveDead,
  brume, ironPassage, eleum, grandCathedral, oldChaos, frigidOutskirts,
];

export const areas: Area[] = bundles.map((b) => b.area);
export const nodes: MapNode[] = bundles.flatMap((b) => b.nodes);
export const bonfires: Bonfire[] = bundles.flatMap((b) => b.bonfires);
export const bosses: Boss[] = bundles.flatMap((b) => b.bosses);
export const items: Item[] = bundles.flatMap((b) => b.items);
export const npcs: Npc[] = bundles.flatMap((b) => b.npcs);
export const features: Feature[] = bundles.flatMap((b) => b.features);
export const edges: Edge[] = bundles.flatMap((b) => b.edges);
export const enemies: Enemy[] = enemyList;
export { DESPAWN_NOTE };

export const areaById = new Map(areas.map((a) => [a.id, a]));
export const nodeById = new Map(nodes.map((n) => [n.id, n]));

/** Data integrity check used by tests/scripts: every node reference must resolve. */
export function validate(): string[] {
  const problems: string[] = [];
  const nodeIds = new Set(nodes.map((n) => n.id));
  const areaIds = new Set(areas.map((a) => a.id));
  const seenNode = new Set<string>();
  for (const n of nodes) {
    if (seenNode.has(n.id)) problems.push(`duplicate node id ${n.id}`);
    seenNode.add(n.id);
    if (!areaIds.has(n.areaId)) problems.push(`node ${n.id} has unknown area ${n.areaId}`);
  }
  for (const b of bonfires) if (!nodeIds.has(b.id)) problems.push(`bonfire ${b.id} has no node`);
  for (const b of bosses) if (!nodeIds.has(b.node)) problems.push(`boss ${b.id} references missing node ${b.node}`);
  for (const i of items) if (!nodeIds.has(i.node)) problems.push(`item ${i.id} (${i.name}) references missing node ${i.node}`);
  for (const n of npcs) if (!nodeIds.has(n.node)) problems.push(`npc ${n.id} references missing node ${n.node}`);
  for (const f of features) if (!nodeIds.has(f.node)) problems.push(`feature ${f.id} references missing node ${f.node}`);
  for (const e of enemies) if (!nodeIds.has(e.node)) problems.push(`enemy ${e.id} references missing node ${e.node}`);
  for (const e of edges) {
    if (!nodeIds.has(e.from)) problems.push(`edge from missing node ${e.from}`);
    if (!nodeIds.has(e.to)) problems.push(`edge to missing node ${e.to}`);
  }
  for (const a of areas) for (const c of a.connections) if (!areaIds.has(c)) problems.push(`area ${a.id} connects to unknown area ${c}`);
  const recs = [...bonfires, ...bosses, ...items, ...npcs, ...features, ...enemies, ...areas];
  for (const r of recs) if (!r.source) problems.push(`record without source: ${JSON.stringify(r).slice(0, 80)}`);
  return problems;
}

export const counts = {
  areas: areas.length,
  nodes: nodes.length,
  bonfires: bonfires.length,
  bosses: bosses.length,
  items: items.length,
  npcs: npcs.length,
  features: features.length,
  edges: edges.length,
  enemies: enemies.length,
};
