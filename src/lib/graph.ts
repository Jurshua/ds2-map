import { edges, nodes, nodeById, bonfires } from "@/data";
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
}

export interface RouteResult {
  source: MapNode;
  target: MapNode;
  steps: RouteStep[];
  total: number;
  requirements: Requirement[];
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

function buildAdjacency(opts: RouteOptions): Map<string, Adj[]> {
  const adj = new Map<string, Adj[]>();
  const push = (from: string, a: Adj) => {
    let list = adj.get(from);
    if (!list) adj.set(from, (list = []));
    list.push(a);
  };
  for (const e of edges) {
    const gated = !!(e.requires && e.requires.length);
    if (gated && !opts.allowGated) continue;
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
function adjacency(opts: RouteOptions) {
  const key = `${opts.allowGated ? 1 : 0}${opts.useWarps ? 1 : 0}`;
  let a = adjCache.get(key);
  if (!a) adjCache.set(key, (a = buildAdjacency(opts)));
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

export function dijkstra(sourceId: string, opts: RouteOptions): Dijkstra {
  const adj = adjacency(opts);
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

function unwind(d: Dijkstra, sourceId: string, targetId: string): RouteResult | null {
  if (!d.dist.has(targetId)) return null;
  const steps: RouteStep[] = [];
  let cur = targetId;
  while (cur !== sourceId) {
    const p = d.prev.get(cur);
    if (!p) return null;
    steps.push({ from: nodeById.get(p.from)!, to: nodeById.get(cur)!, edge: p.edge, cost: p.cost, warp: p.warp });
    cur = p.from;
  }
  steps.reverse();
  const requirements: Requirement[] = [];
  const seen = new Set<string>();
  for (const s of steps) {
    for (const r of s.edge?.requires ?? []) {
      const k = r.type + ":" + r.name;
      if (!seen.has(k)) { seen.add(k); requirements.push(r); }
    }
  }
  return { source: nodeById.get(sourceId)!, target: nodeById.get(targetId)!, steps, total: d.dist.get(targetId)!, requirements };
}

export function route(sourceId: string, targetId: string, opts: RouteOptions): RouteResult | null {
  if (sourceId === targetId) {
    const n = nodeById.get(sourceId)!;
    return { source: n, target: n, steps: [], total: 0, requirements: [] };
  }
  return unwind(dijkstra(sourceId, opts), sourceId, targetId);
}

/** Route from source to the nearest of the candidate nodes. */
export function nearest(sourceId: string, candidates: string[], opts: RouteOptions): RouteResult | null {
  const d = dijkstra(sourceId, opts);
  let best: string | null = null;
  let bestD = Infinity;
  for (const c of candidates) {
    if (c === sourceId) continue;
    const dd = d.dist.get(c);
    if (dd !== undefined && dd < bestD) { bestD = dd; best = c; }
  }
  return best ? unwind(d, sourceId, best) : null;
}

export function isBonfireNode(id: string) { return bonfireSet.has(id); }
export const graphNodeCount = nodes.length;
export const graphEdgeCount = edges.length;
