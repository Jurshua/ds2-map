"use client";
import { useMemo, useState } from "react";
import { Glyph } from "./Glyph";
import { CATEGORIES, GROUPS, categoryById, markers, markersByNode, areaById, nodeById, type Marker } from "@/lib/markers";
import { search, labelForMarker, type SearchHit } from "@/lib/search";
import { bosses, enemies, DESPAWN_NOTE, npcs } from "@/data";
import type { Bonfire, Boss, Item, Npc, Feature, Enemy, Requirement } from "@/data/types";
import type { RouteResult, RouteOptions } from "@/lib/graph";

/* ---------------- Search ---------------- */
export function SearchBox({ onPick }: { onPick(hit: SearchHit): void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const hits = useMemo(() => search(q, 30), [q]);
  return (
    <div className="relative">
      <label htmlFor="map-search" className="sr-only">Search the map</label>
      <input
        id="map-search"
        type="search"
        autoComplete="off"
        placeholder="Search bonfires, bosses, items, NPCs…"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(hits.length - 1, a + 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
          else if (e.key === "Enter" && hits[active]) { onPick(hits[active]); setOpen(false); }
          else if (e.key === "Escape") setOpen(false);
        }}
        aria-expanded={open && hits.length > 0}
        aria-controls="search-results"
        aria-activedescendant={open && hits[active] ? `hit-${active}` : undefined}
        role="combobox"
        className="w-full rounded border border-amber-200/25 bg-black/50 px-3 py-2 text-sm text-amber-50 placeholder:text-stone-400 focus:border-amber-300 focus:outline-none"
      />
      {open && hits.length > 0 && (
        <ul id="search-results" role="listbox" className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded border border-amber-200/25 bg-stone-950/95 shadow-xl">
          {hits.map((h, i) => (
            <li
              key={h.type + ":" + (h.type === "marker" ? h.marker.id : h.type === "area" ? h.area.id : h.node.id)}
              id={`hit-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); onPick(h); setOpen(false); }}
              onMouseEnter={() => setActive(i)}
              className={"flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm " + (i === active ? "bg-amber-300/20" : "hover:bg-white/5")}
            >
              {h.type === "marker" ? <Glyph category={h.marker.category} size={14} /> : <span className="inline-block h-3.5 w-3.5 rounded-sm bg-amber-200/60" />}
              <span className="truncate text-amber-50">{h.label}</span>
              <span className="ml-auto shrink-0 text-[11px] text-stone-400">{h.sub}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Legend / filters ---------------- */
export interface FilterState {
  groups: Set<string>;
  hideCollected: boolean;
  dlc: boolean;
}

export function LegendFilters({ filters, onChange, counts, collectedCount, totalItems, onClearCollected }: {
  filters: FilterState;
  onChange(f: FilterState): void;
  counts: Map<string, number>;
  collectedCount: number;
  totalItems: number;
  onClearCollected(): void;
}) {
  const toggle = (id: string) => {
    const g = new Set(filters.groups);
    if (g.has(id)) g.delete(id); else g.add(id);
    onChange({ ...filters, groups: g });
  };
  const setAll = (v: boolean) => onChange({ ...filters, groups: new Set(v ? GROUPS.map((g) => g.id) : []) });
  const sections: { id: FilterState extends never ? never : "places" | "people" | "items"; label: string }[] = [
    { id: "places", label: "Places" }, { id: "people", label: "People & enemies" }, { id: "items", label: "Items" },
  ];
  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn" onClick={() => setAll(true)}>All</button>
        <button className="btn" onClick={() => setAll(false)}>None</button>
        <label className="ml-auto flex items-center gap-1.5 text-xs text-stone-300">
          <input type="checkbox" checked={filters.dlc} onChange={(e) => onChange({ ...filters, dlc: e.target.checked })} /> DLC areas
        </label>
      </div>
      <label className="flex items-center gap-2 rounded border border-amber-200/20 bg-black/30 px-2 py-1.5 text-xs text-stone-200">
        <input type="checkbox" checked={filters.hideCollected} onChange={(e) => onChange({ ...filters, hideCollected: e.target.checked })} />
        Show only what I haven&apos;t collected
        <span className="ml-auto text-stone-400">{collectedCount}/{totalItems} collected</span>
        {collectedCount > 0 && <button className="btn !py-0 !px-1.5" onClick={onClearCollected} title="Reset checklist">reset</button>}
      </label>
      {sections.map((s) => (
        <fieldset key={s.id} className="space-y-1">
          <legend className="mb-1 text-[11px] uppercase tracking-widest text-amber-200/70">{s.label}</legend>
          {GROUPS.filter((g) => g.section === s.id).map((g) => {
            const cats = CATEGORIES.filter((c) => c.group === g.id);
            const on = filters.groups.has(g.id);
            return (
              <label key={g.id} className={"flex items-center gap-2 rounded px-1.5 py-1 hover:bg-white/5 " + (on ? "" : "opacity-50")}>
                <input type="checkbox" checked={on} onChange={() => toggle(g.id)} aria-label={g.label} />
                <span className="flex items-center -space-x-1">
                  {cats.slice(0, 3).map((c) => <Glyph key={c.id} category={c.id} size={14} />)}
                </span>
                <span className="text-stone-100">{g.label}</span>
                <span className="ml-auto text-[11px] text-stone-400">{counts.get(g.id) ?? 0}</span>
              </label>
            );
          })}
        </fieldset>
      ))}
      <details className="text-xs text-stone-300">
        <summary className="cursor-pointer text-amber-200/80">Full legend (all icons)</summary>
        <ul className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5">
          {CATEGORIES.map((c) => (
            <li key={c.id} className="flex items-center gap-1.5"><Glyph category={c.id} size={13} /> {c.label}</li>
          ))}
        </ul>
        <p className="mt-2 text-stone-400">Lines: gold = between areas, faint = inside an area, dashed = needs a key / branch / lockstone / boss. Numbers at low zoom = uncollected markers at that landmark.</p>
      </details>
    </div>
  );
}

/* ---------------- Details ---------------- */
function Req({ r }: { r: Requirement }) {
  const color = r.type === "key" ? "bg-yellow-300/20 text-yellow-100" : r.type === "branch" ? "bg-green-300/20 text-green-100" : r.type === "lockstone" ? "bg-purple-300/20 text-purple-100" : r.type === "boss" ? "bg-red-300/20 text-red-100" : "bg-sky-300/20 text-sky-100";
  return <span className={"inline-block rounded px-1.5 py-0.5 text-[11px] " + color} title={r.note}>{r.type}: {r.name}{r.note ? ` — ${r.note}` : ""}</span>;
}

export function Details({ marker, collected, onToggleCollected, onRouteFrom, onRouteTo, onSelect, onFly }: {
  marker: Marker;
  collected: Set<string>;
  onToggleCollected(id: string): void;
  onRouteFrom(m: Marker): void;
  onRouteTo(m: Marker): void;
  onSelect(m: Marker): void;
  onFly(m: Marker): void;
}) {
  const area = areaById.get(marker.areaId);
  const node = nodeById.get(marker.nodeId);
  const meta = categoryById.get(marker.category);
  const rec = marker.record;
  const siblings = (markersByNode.get(marker.nodeId) ?? []).filter((m) => m.id !== marker.id);
  const src = (rec as { source: string }).source;
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-start gap-2">
        <Glyph category={marker.category} size={26} />
        <div>
          <h2 className="font-serif text-lg leading-tight text-amber-100">{marker.name}</h2>
          <p className="text-xs text-stone-400">{meta?.label ?? labelForMarker(marker)} · <button className="link" onClick={() => onFly(marker)}>{area?.name}</button>{node ? <> · {node.name}</> : null}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button className="btn" onClick={() => onRouteFrom(marker)}>Route from here</button>
        <button className="btn" onClick={() => onRouteTo(marker)}>Route to here</button>
        <button className="btn" onClick={() => onFly(marker)}>Fly to</button>
      </div>
      {marker.kind === "item" && <ItemDetails item={rec as Item} collected={collected} onToggle={onToggleCollected} />}
      {marker.kind === "bonfire" && <p className="text-stone-200">{(rec as Bonfire).note}{(rec as Bonfire).primal ? " Primal bonfires only warp you back to Majula." : ""}</p>}
      {marker.kind === "boss" && <BossDetails boss={rec as Boss} />}
      {marker.kind === "npc" && <NpcDetails npc={rec as Npc} />}
      {marker.kind === "feature" && <FeatureDetails f={rec as Feature} />}
      {marker.kind === "enemy" && <EnemyDetails e={rec as Enemy} />}
      {node?.note && <p className="text-xs text-stone-400"><span className="text-stone-300">Landmark:</span> {node.note}</p>}
      {src && <p className="text-xs"><a className="link" href={src} target="_blank" rel="noreferrer">Source: {src.replace(/^https?:\/\//, "").replace(/\+/g, " ")}</a></p>}
      {siblings.length > 0 && (
        <details>
          <summary className="cursor-pointer text-xs text-amber-200/80">Also at this landmark ({siblings.length})</summary>
          <ul className="mt-1 max-h-56 overflow-auto text-xs">
            {siblings.map((s) => (
              <li key={s.id}>
                <button className={"flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left hover:bg-white/5 " + (s.kind === "item" && collected.has(s.id) ? "line-through opacity-50" : "")} onClick={() => onSelect(s)}>
                  <Glyph category={s.category} size={12} /> <span className="truncate">{s.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function ItemDetails({ item, collected, onToggle }: { item: Item; collected: Set<string>; onToggle(id: string): void }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 rounded border border-amber-200/20 bg-black/30 px-2 py-1.5">
        <input type="checkbox" checked={collected.has(item.id)} onChange={() => onToggle(item.id)} />
        <span>Collected</span>
      </label>
      <p className="text-stone-100"><span className="text-stone-400">How to reach: </span>{item.howToReach}</p>
      {item.prerequisites?.length ? <p className="text-xs text-stone-300"><span className="text-stone-400">Requires: </span>{item.prerequisites.join("; ")}</p> : null}
      {item.note && <p className="text-xs text-stone-400">Note: {item.note}</p>}
      {item.ngPlusOnly && <p className="text-xs text-red-200">NG+ only</p>}
    </div>
  );
}

function BossDetails({ boss }: { boss: Boss }) {
  return (
    <div className="space-y-1">
      <p className={"text-xs " + (boss.required ? "text-red-200" : "text-stone-300")}>{boss.required ? "Required to finish the game" : "Optional"}{boss.dlc ? ` · ${dlcName(boss.dlc)} DLC` : ""}{boss.ngPlusOnly ? " · NG+ only" : ""}</p>
      <p className="text-stone-100">{boss.description}</p>
      <p className="text-xs text-stone-300"><span className="text-stone-400">Drops: </span>{boss.drops.join(", ")}</p>
      {boss.note && <p className="text-xs text-stone-400">{boss.note}</p>}
    </div>
  );
}

function NpcDetails({ npc }: { npc: Npc }) {
  return (
    <div className="space-y-1">
      <p className="text-xs capitalize text-stone-300">{npc.role}</p>
      <p className="text-stone-100">{npc.description}</p>
      {npc.wares?.length ? <p className="text-xs text-stone-300"><span className="text-stone-400">Notable wares: </span>{npc.wares.join(", ")}</p> : null}
    </div>
  );
}

function FeatureDetails({ f }: { f: Feature }) {
  return (
    <div className="space-y-1">
      <p className="text-xs capitalize text-stone-300">{f.kind.replace("-", " ")}{f.requires ? <> · <span className="text-yellow-100">requires {f.requires}</span></> : null}</p>
      <p className="text-stone-100">{f.description}</p>
    </div>
  );
}

function EnemyDetails({ e }: { e: Enemy }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-stone-300">Found in: {e.areaIds.map((a) => areaById.get(a)?.name ?? a).join(", ")} · {e.despawns ? "despawns after ~12 kills" : "does not despawn"}</p>
      <ul className="space-y-0.5 text-stone-100">
        {e.drops.map((d, i) => (
          <li key={i} className="flex gap-2"><span className="text-amber-200">•</span><span>{d.item}{d.rate ? <span className="text-stone-400"> ({d.rate})</span> : null}{d.note ? <span className="text-stone-400"> — {d.note}</span> : null}</span></li>
        ))}
      </ul>
      <p className="text-xs text-stone-200"><span className="text-stone-400">Farming: </span>{e.farmingNote}</p>
      <p className="text-[11px] text-stone-400">{DESPAWN_NOTE}</p>
    </div>
  );
}

export function dlcName(d: string) {
  return d === "sunken" ? "Crown of the Sunken King" : d === "iron" ? "Crown of the Old Iron King" : "Crown of the Ivory King";
}

/* ---------------- Route panel ---------------- */
export type Destination =
  | { type: "nearest-bonfire" }
  | { type: "nearest-boss" }
  | { type: "nearest-merchant" }
  | { type: "boss"; id: string }
  | { type: "farm"; enemyId: string }
  | { type: "marker"; id: string };

export function RoutePanel({ start, dest, opts, result, onSetDest, onSetOpts, onClear, onSelect, onFly }: {
  start: Marker | null;
  dest: Destination | null;
  opts: RouteOptions;
  result: RouteResult | null | "none";
  onSetDest(d: Destination): void;
  onSetOpts(o: RouteOptions): void;
  onClear(): void;
  onSelect(m: Marker): void;
  onFly(x: number, y: number): void;
}) {
  const farmOptions = useMemo(() => enemies.flatMap((e) => e.drops.map((d) => ({ enemyId: e.id, label: `${d.item} — ${e.name}` }))).sort((a, b) => a.label.localeCompare(b.label)), []);
  const bossOptions = useMemo(() => [...bosses].sort((a, b) => a.name.localeCompare(b.name)), []);
  return (
    <div className="space-y-3 text-sm">
      <div className="rounded border border-amber-200/20 bg-black/30 p-2">
        <p className="text-[11px] uppercase tracking-widest text-amber-200/70">Start</p>
        {start ? (
          <p className="flex items-center gap-2"><Glyph category={start.category} size={14} /><button className="link" onClick={() => onSelect(start)}>{start.name}</button><span className="text-xs text-stone-400">· {areaById.get(start.areaId)?.name}</span></p>
        ) : (
          <p className="text-xs text-stone-400">Click a bonfire or marker on the map, search for one, or press “Route from here” in its details.</p>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-widest text-amber-200/70">Destination</p>
        <div className="flex flex-wrap gap-1.5">
          <button className={"btn " + (dest?.type === "nearest-bonfire" ? "btn-on" : "")} onClick={() => onSetDest({ type: "nearest-bonfire" })}>Nearest bonfire</button>
          <button className={"btn " + (dest?.type === "nearest-boss" ? "btn-on" : "")} onClick={() => onSetDest({ type: "nearest-boss" })}>Nearest boss</button>
          <button className={"btn " + (dest?.type === "nearest-merchant" ? "btn-on" : "")} onClick={() => onSetDest({ type: "nearest-merchant" })}>Nearest merchant</button>
        </div>
        <label className="block text-xs text-stone-300">Specific boss
          <select className="sel" value={dest?.type === "boss" ? dest.id : ""} onChange={(e) => e.target.value && onSetDest({ type: "boss", id: e.target.value })}>
            <option value="">—</option>
            {bossOptions.map((b) => <option key={b.id} value={b.id}>{b.name} ({areaById.get(b.areaId)?.name})</option>)}
          </select>
        </label>
        <label className="block text-xs text-stone-300">Farmable item (best spot)
          <select className="sel" value={dest?.type === "farm" ? dest.enemyId : ""} onChange={(e) => e.target.value && onSetDest({ type: "farm", enemyId: e.target.value })}>
            <option value="">—</option>
            {farmOptions.map((o, i) => <option key={i} value={o.enemyId}>{o.label}</option>)}
          </select>
        </label>
        <p className="text-xs text-stone-400">Or open any marker and press “Route to here”.</p>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-stone-300">
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={opts.useWarps} onChange={(e) => onSetOpts({ ...opts, useWarps: e.target.checked })} /> Use bonfire warping</label>
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={opts.allowGated} onChange={(e) => onSetOpts({ ...opts, allowGated: e.target.checked })} /> Allow gated paths (keys, branches…)</label>
      </div>
      {result === "none" && <p className="rounded border border-red-300/30 bg-red-900/20 p-2 text-xs text-red-100">No route found with these options. Try allowing gated paths or bonfire warping.</p>}
      {result && result !== "none" && <RouteSteps r={result} onFly={onFly} />}
      {(start || dest) && <button className="btn" onClick={onClear}>Clear route</button>}
    </div>
  );
}

function RouteSteps({ r, onFly }: { r: RouteResult; onFly(x: number, y: number): void }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-stone-300"><span className="text-amber-100">{r.source.name}</span> → <span className="text-amber-100">{r.target.name}</span> · {r.steps.length} steps · cost {r.total}</p>
      {r.requirements.length > 0 && (
        <div className="flex flex-wrap gap-1"><span className="text-[11px] text-stone-400">Gating on this route:</span>{r.requirements.map((q, i) => <Req key={i} r={q} />)}</div>
      )}
      <ol className="space-y-1.5">
        {r.steps.map((s, i) => (
          <li key={i} className="rounded border border-white/10 bg-black/30 p-2">
            <button className="link text-left" onClick={() => onFly(s.to.x, s.to.y)}>
              <span className="mr-1 text-stone-400">{i + 1}.</span>
              {s.warp ? <span className="text-sky-200">Warp to {s.to.name}</span> : <span>{s.to.name}</span>}
              <span className="text-xs text-stone-400"> · {areaById.get(s.to.areaId)?.name}</span>
            </button>
            {s.edge && <p className="mt-0.5 text-xs text-stone-300">{s.edge.note}{s.edge.oneWay ? " (one-way)" : ""}</p>}
            {s.warp && <p className="mt-0.5 text-xs text-stone-400">Rest at {s.from.name} and travel.</p>}
            {s.edge?.requires?.length ? <div className="mt-1 flex flex-wrap gap-1">{s.edge.requires.map((q, j) => <Req key={j} r={q} />)}</div> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------- Area browser ---------------- */
export function AreaList({ onFlyArea, onSelect, collected, filtered }: { onFlyArea(id: string): void; onSelect(m: Marker): void; collected: Set<string>; filtered: Set<string> }) {
  const [openArea, setOpenArea] = useState<string | null>(null);
  const byArea = useMemo(() => {
    const m = new Map<string, Marker[]>();
    for (const mk of markers) { let l = m.get(mk.areaId); if (!l) m.set(mk.areaId, (l = [])); l.push(mk); }
    return m;
  }, []);
  const list = [...areaById.values()];
  return (
    <ul className="space-y-1 text-sm">
      {list.map((a) => {
        const ms = (byArea.get(a.id) ?? []).filter((m) => filtered.has(m.id));
        const open = openArea === a.id;
        return (
          <li key={a.id} className="rounded border border-white/10 bg-black/20">
            <div className="flex items-center gap-2 px-2 py-1">
              <button className="flex-1 text-left font-serif text-amber-100" onClick={() => setOpenArea(open ? null : a.id)} aria-expanded={open}>{a.name}{a.dlc ? <span className="ml-1 text-[10px] text-sky-200">DLC</span> : null}</button>
              <span className="text-[11px] text-stone-400">{ms.length}</span>
              <button className="btn !px-1.5 !py-0" onClick={() => onFlyArea(a.id)} aria-label={`Fly to ${a.name}`}>go</button>
            </div>
            {open && (
              <ul className="max-h-72 overflow-auto border-t border-white/10 px-1 py-1 text-xs">
                {ms.map((m) => (
                  <li key={m.id}>
                    <button className={"flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left hover:bg-white/5 " + (m.kind === "item" && collected.has(m.id) ? "line-through opacity-50" : "")} onClick={() => onSelect(m)}>
                      <Glyph category={m.category} size={12} /> <span className="truncate">{m.name}</span><span className="ml-auto shrink-0 text-[10px] text-stone-500">{nodeById.get(m.nodeId)?.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export const npcCount = npcs.length;
