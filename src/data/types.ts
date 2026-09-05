/**
 * Core data model for the Dark Souls II: Scholar of the First Sin world map.
 * All records are plain data (no rendering concerns) so they can be audited.
 * Every record carries at least one `source` URL pointing at the wiki page it was taken from.
 */

export type Dlc = "sunken" | "iron" | "ivory";

export interface Area {
  id: string;
  name: string;
  dlc?: Dlc;
  /** Polygon in world coordinates (x,y pairs). */
  shape: [number, number][];
  /** Label anchor in world coordinates. */
  label: [number, number];
  description: string;
  /** Ids of areas that physically connect to this one. */
  connections: string[];
  /** Recommended soul level from the wiki, if any. */
  recommendedLevel?: string;
  source: string;
}

export type NodeKind = "bonfire" | "primal" | "landmark" | "boss" | "entrance";

/** A routing node: bonfire, boss arena, landmark or item cluster. */
export interface MapNode {
  id: string;
  name: string;
  areaId: string;
  kind: NodeKind;
  x: number;
  y: number;
  /** Short description of the place (used in route step list). */
  note?: string;
}

export interface Bonfire {
  id: string; // === node id
  name: string;
  areaId: string;
  /** Primal bonfires appear after Old One bosses and only warp to Majula. */
  primal?: boolean;
  /** How to reach / unlock. */
  note: string;
  source: string;
}

export interface Boss {
  id: string;
  name: string;
  areaId: string;
  /** Node id of the boss arena. */
  node: string;
  required: boolean;
  /** Only available in NG+ / after burning a Bonfire Ascetic. */
  ngPlusOnly?: boolean;
  dlc?: Dlc;
  description: string;
  drops: string[];
  /** Why it is optional/required, or other notes (e.g. SotFS placement changes). */
  note?: string;
  source: string;
}

export type ItemCategory =
  | "weapon"
  | "shield"
  | "armor"
  | "ring"
  | "spell"
  | "key"
  | "consumable"
  | "estus-shard"
  | "bone-dust"
  | "branch"
  | "lockstone"
  | "soul-vessel"
  | "effigy"
  | "lifegem"
  | "titanite"
  | "twinkling"
  | "dragon-bone"
  | "ascetic"
  | "soul"
  | "ammo"
  | "tool"
  | "unique"
  | "boss-soul";

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  areaId: string;
  /** Nearest routing node (used for placement + routing). */
  node: string;
  qty?: number;
  howToReach: string;
  /** Gating requirements in plain text (key names, branches, lockstones, bosses). */
  prerequisites?: string[];
  /** Differences vs. vanilla DS2 or wiki disagreements. */
  note?: string;
  ngPlusOnly?: boolean;
  source: string;
}

export interface Drop {
  item: string;
  /** Drop rate as documented by the wiki (e.g. "5%", "rare", "guaranteed"). */
  rate?: string;
  note?: string;
}

export interface Enemy {
  id: string;
  name: string;
  /** Areas where this enemy spawns. */
  areaIds: string[];
  /** Node where the best farming spot is. */
  node: string;
  drops: Drop[];
  /** Whether the enemy despawns after ~12 kills (most do). */
  despawns: boolean;
  farmingNote: string;
  source: string;
}

export type NpcRole = "merchant" | "npc" | "covenant" | "blacksmith" | "trainer" | "summon";

export interface Npc {
  id: string;
  name: string;
  areaId: string;
  node: string;
  role: NpcRole;
  description: string;
  /** Notable wares for merchants. */
  wares?: string[];
  source: string;
}

export type FeatureKind = "pharros" | "shortcut" | "locked-door" | "illusory-wall" | "covenant" | "lever";

export interface Feature {
  id: string;
  name: string;
  kind: FeatureKind;
  areaId: string;
  node: string;
  /** Key / item required (e.g. "Soldier Key", "Pharros' Lockstone"). */
  requires?: string;
  description: string;
  source: string;
}

export type RequirementType =
  | "key"
  | "branch"
  | "lockstone"
  | "boss"
  | "item"
  | "event"
  | "ring"
  | "dlc"
  | "ascetic";

export interface Requirement {
  type: RequirementType;
  name: string;
  /** Extra detail (e.g. where the key is found). */
  note?: string;
}

export interface Edge {
  from: string;
  to: string;
  /** Approximate traversal cost (1 = a short walk, 10 = an entire level). */
  cost: number;
  /** One-way (drop, eagle, elevator that only descends, etc.) */
  oneWay?: boolean;
  requires?: Requirement[];
  /** Description of the connection, used in route step lists. */
  note: string;
  /** Kind of connection for styling. */
  kind?: "walk" | "drop" | "shortcut" | "warp" | "ship" | "elevator" | "ladder";
}
