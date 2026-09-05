import { edges, nodes, nodeById, bonfires, bosses } from "@/data";
import type { Edge, MapNode, Requirement } from "@/data/types";

export interface RouteOptions {
  /** Include edges that need keys/branches/lockstones/bosses (they are listed as requirements). */
  allowGated: boolean;
  /** Allow warping between lit bonfires (any bonfire → any non-primal bonfire). */
  useWarps: boolean;
}

export interface RouteStep {
  from: MapNode;
  to: MapNode;
  /** null for a bonfire warp */
  edge: Edge | null;
  cost: number;
  warp: boolean;
  /** For warp steps: gating you must already have cleared to have lit the destination bonfire (shortest ungated-walk from Majula). */
  warpRequirements?: Requirement[];
}

export interface RouteResult {
  source: MapNode;
  target: MapNode;
  steps: RouteStep[];
  total: number;
  /** Gating on walked edges of this route. */
  requirements: Requirement[];
  /** Gating implied by warping to bonfires that must already be lit. */
  warpRequirements: Requirement[];
}

interface Adj {
  to: string;
  edge: Edge | null;
  cost: number;
  warp: boolean;
}

const WARP_COST = 2;
const bonfireIds = bonfires.filter((b) => !b.primal).map((b) => b.id);
const allBonfireIds = bonfires.map((b) => b.id);
const bonfireSet = new Set(allBonfireIds);

function buildAdjacency(opts: RouteOptions, excludeBoss: string[] = []): Map<string, Adj[]> {
  const adj = new Map<string, Adj[]>();
  const push = (from: string, a: Adj) => {
    let list = adj.get(from);
    if (!list) adj.set(from, (list = []));
    list.push(a);
  };
  for (const e of edges) {
    const gated = !!(e.requires && e.requires.length);
    if (gated && !opts.allowGated) continue;
    // Never route to a boss through edges that require that very boss to be dead (i.e. entering its arena from behind).
    if (excludeBoss.length && e.requires?.some((r) => r.type === "boss" && excludeBoss.includes(r.name))) continue;
    // Primal Bonfire "warp back to Majula" edges are bonfire travel, not walking.
    if (!opts.useWarps && e.kind === "warp" && e.to === "maj.far_fire") continue;
    push(e.from, { to: e.to, edge: e, cost: e.cost, warp: false });
    if (!e.oneWay) push(e.to, { to: e.from, edge: e, cost: e.cost, warp: false });
  }
  if (opts.useWarps) {
    for (const from of allBonfireIds) {
      for (const to of bonfireIds) {
        if (from !== to) push(from, { to, edge: null, cost: WARP_COST, warp: true });
      }
    }
  }
  return adj;
}

const adjCache = new Map<string, Map<string, Adj[]>>();
function adjacency(opts: RouteOptions, excludeBoss: string[] = []) {
  const key = `${opts.allowGated ? 1 : 0}${opts.useWarps ? 1 : 0}|${excludeBoss.join(",")}`;
  let a = adjCache.get(key);
  if (!a) adjCache.set(key, (a = buildAdjacency(opts, excludeBoss)));
  return a;
}

/** Simple binary heap keyed by distance. */
class Heap {
  private a: { id: string; d: number }[] = [];
  push(id: string, d: number) {
    const a = this.a;
    a.push({ id, d });
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p].d <= a[i].d) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    if (!a.length) return undefined;
    const top = a[0];
    const last = a.pop()!;
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l].d < a[m].d) m = l;
        if (r < a.length && a[r].d < a[m].d) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}

export interface Dijkstra {
  dist: Map<string, number>;
  prev: Map<string, Adj & { from: string }>;
}

export function dijkstra(sourceId: string, opts: RouteOptions, excludeBoss: string[] = []): Dijkstra {
  const adj = adjacency(opts, excludeBoss);
  const dist = new Map<string, number>();
  const prev = new Map<string, Adj & { from: string }>();
  const heap = new Heap();
  dist.set(sourceId, 0);
  heap.push(sourceId, 0);
  const done = new Set<string>();
  while (heap.size) {
    const cur = heap.pop()!;
    if (done.has(cur.id)) continue;
    done.add(cur.id);
    for (const a of adj.get(cur.id) ?? []) {
      const nd = cur.d + a.cost;
      if (nd < (dist.get(a.to) ?? Infinity)) {
        dist.set(a.to, nd);
        prev.set(a.to, { ...a, from: cur.id });
        heap.push(a.to, nd);
      }
    }
  }
  return { dist, prev };
}

/**
 * Gating needed to have reached (and lit) a bonfire at least once: the requirements along the
 * cheapest walking route from The Far Fire in Majula with gated edges allowed and no warping.
 */
const unlockCache = new Map<string, Requirement[]>();
let unlockDijkstra: Dijkstra | null = null;
export function bonfireUnlockRequirements(bonfireId: string): Requirement[] {
  const cached = unlockCache.get(bonfireId);
  if (cached) return cached;
  if (!unlockDijkstra) unlockDijkstra = dijkstra("maj.far_fire", { allowGated: true, useWarps: false });
  const reqs: Requirement[] = [];
  const seen = new Set<string>();
  let cur = bonfireId;
  let guard = 0;
  while (cur !== "maj.far_fire" && guard++ < 500) {
    const p = unlockDijkstra.prev.get(cur);
    if (!p) break;
    for (const r of p.edge?.requires ?? []) {
      const k = r.type + ":" + r.name;
      if (!seen.has(k)) { seen.add(k); reqs.push(r); }
    }
    cur = p.from;
  }
  reqs.reverse();
  unlockCache.set(bonfireId, reqs);
  return reqs;
}

function unwind(d: Dijkstra, sourceId: string, targetId: string): RouteResult | null {
  if (!d.dist.has(targetId)) return null;
  const steps: RouteStep[] = [];
  let cur = targetId;
  while (cur !== sourceId) {
    const p = d.prev.get(cur);
    if (!p) return null;
    const step: RouteStep = { from: nodeById.get(p.from)!, to: nodeById.get(cur)!, edge: p.edge, cost: p.cost, warp: p.warp };
    if (p.warp) step.warpRequirements = bonfireUnlockRequirements(cur);
    steps.push(step);
    cur = p.from;
  }
  steps.reverse();
  const requirements: Requirement[] = [];
  const warpRequirements: Requirement[] = [];
  const seen = new Set<string>();
  const seenWarp = new Set<string>();
  for (const s of steps) {
    for (const r of s.edge?.requires ?? []) {
      const k = r.type + ":" + r.name;
      if (!seen.has(k)) { seen.add(k); requirements.push(r); }
    }
    for (const r of s.warpRequirements ?? []) {
      const k = r.type + ":" + r.name;
      if (!seenWarp.has(k) && !seen.has(k)) { seenWarp.add(k); warpRequirements.push(r); }
    }
  }
  return { source: nodeById.get(sourceId)!, target: nodeById.get(targetId)!, steps, total: d.dist.get(targetId)!, requirements, warpRequirements };
}

/** Names of bosses fought at a node (used to avoid entering an arena through its exit). */
function bossesAtNode(nodeId: string): string[] {
  return bosses.filter((b) => b.node === nodeId).map((b) => b.name);
}

export function route(sourceId: string, targetId: string, opts: RouteOptions): RouteResult | null {
  if (sourceId === targetId) {
    const n = nodeById.get(sourceId)!;
    return { source: n, target: n, steps: [], total: 0, requirements: [], warpRequirements: [] };
  }
  return unwind(dijkstra(sourceId, opts, bossesAtNode(targetId)), sourceId, targetId);
}

/** Route from source to the nearest of the candidate nodes. */
export function nearest(sourceId: string, candidates: string[], opts: RouteOptions): RouteResult | null {
  const plain = dijkstra(sourceId, opts);
  let best: RouteResult | null = null;
  for (const c of candidates) {
    if (c === sourceId) continue;
    const excl = bossesAtNode(c);
    const r = excl.length ? unwind(dijkstra(sourceId, opts, excl), sourceId, c) : unwind(plain, sourceId, c);
    if (r && (!best || r.total < best.total)) best = r;
  }
  return best;
}

export function isBonfireNode(id: string) { return bonfireSet.has(id); }
export const graphNodeCount = nodes.length;
export const graphEdgeCount = edges.length;
