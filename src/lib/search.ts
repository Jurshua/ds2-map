import { markers, type Marker, areaById } from "./markers";
import { areas, nodes } from "@/data";
import type { Area, MapNode } from "@/data/types";

export type SearchHit =
  | { type: "marker"; score: number; marker: Marker; label: string; sub: string }
  | { type: "area"; score: number; area: Area; label: string; sub: string }
  | { type: "node"; score: number; node: MapNode; label: string; sub: string };

function norm(s: string) {
  return s.toLowerCase().replace(/['’`]/g, "").replace(/[^a-z0-9+ ]+/g, " ").replace(/\s+/g, " ").trim();
}

/** Fuzzy score: substring > token-prefix > ordered subsequence with gap penalties. */
export function fuzzyScore(query: string, text: string): number {
  const q = norm(query);
  const t = norm(text);
  if (!q) return 0;
  if (t === q) return 200;
  const idx = t.indexOf(q);
  if (idx >= 0) return 150 - Math.min(idx, 40) - Math.min(t.length - q.length, 30) * 0.3;
  const qTokens = q.split(" ");
  const tTokens = t.split(" ");
  let tokenHits = 0;
  for (const qt of qTokens) if (tTokens.some((tt) => tt.startsWith(qt))) tokenHits++;
  if (tokenHits === qTokens.length) return 110 - Math.min(t.length - q.length, 30) * 0.3;
  // ordered subsequence
  let ti = 0, gaps = 0, matched = 0, lastMatch = -2;
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    if (ch === " ") continue;
    const found = t.indexOf(ch, ti);
    if (found < 0) return 0;
    if (found !== lastMatch + 1 && matched > 0) gaps += found - ti;
    lastMatch = found;
    ti = found + 1;
    matched++;
  }
  const score = 70 - gaps * 1.5 - Math.min(t.length - q.length, 40) * 0.4 + (tokenHits * 5);
  return score > 5 ? score : 0;
}

const nodeArea = (n: MapNode) => areaById.get(n.areaId)?.name ?? n.areaId;

export function search(query: string, limit = 40): SearchHit[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const a of areas) {
    const s = fuzzyScore(q, a.name);
    if (s > 0) hits.push({ type: "area", score: s + 5, area: a, label: a.name, sub: "Area" });
  }
  for (const n of nodes) {
    const s = fuzzyScore(q, n.name);
    if (s > 0 && n.kind !== "bonfire" && n.kind !== "primal") hits.push({ type: "node", score: s - 2, node: n, label: n.name, sub: `Landmark · ${nodeArea(n)}` });
  }
  for (const m of markers) {
    let s = fuzzyScore(q, m.name);
    if (m.kind === "enemy") {
      // also match on drops so "petrified dragon bone" finds farming spots
      const rec = m.record as { drops: { item: string }[] };
      for (const d of rec.drops) s = Math.max(s, fuzzyScore(q, d.item) - 8);
    }
    if (s > 0) {
      const area = areaById.get(m.areaId)?.name ?? m.areaId;
      hits.push({ type: "marker", score: s + (m.kind === "bonfire" || m.kind === "boss" ? 3 : 0), marker: m, label: m.name, sub: `${labelForMarker(m)} · ${area}` });
    }
  }
  hits.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  return hits.slice(0, limit);
}

export function labelForMarker(m: Marker): string {
  switch (m.kind) {
    case "bonfire": return m.category === "primal" ? "Primal Bonfire" : "Bonfire";
    case "boss": return m.category === "boss" ? "Boss (required)" : "Boss (optional)";
    case "npc": return m.category === "merchant" ? "Merchant" : m.category === "covenant" ? "Covenant NPC" : m.category === "summon" ? "Summon" : "NPC";
    case "feature": return m.category.replace("-", " ");
    case "enemy": return "Farmable enemy";
    case "item": return (m.record as { category: string }).category.replace("-", " ");
  }
}
