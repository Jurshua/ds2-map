"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapCanvas, type MapCanvasHandle } from "./MapCanvas";
import { SearchBox, LegendFilters, Details, RoutePanel, AreaList, type FilterState, type Destination } from "./Panels";
import { markers, markerById, markerGroup, areaById, nodeById, GROUPS, type Marker } from "@/lib/markers";
import { bonfires, bosses, npcs, enemies, counts } from "@/data";
import { route, nearest, type RouteOptions, type RouteResult } from "@/lib/graph";
import { useCollected, usePersistedState } from "@/lib/storage";
import type { SearchHit } from "@/lib/search";

type Tab = "explore" | "areas" | "route" | "details";

export default function MapApp() {
  const mapRef = useRef<MapCanvasHandle>(null);
  const { collected, toggle, clear, loaded } = useCollected();
  const [groupsArr, setGroupsArr] = usePersistedState<string[]>("ds2map.groups.v1", GROUPS.map((g) => g.id));
  const [hideCollected, setHideCollected] = usePersistedState<boolean>("ds2map.hideCollected", false);
  const [dlc, setDlc] = usePersistedState<boolean>("ds2map.dlc", true);
  const filters: FilterState = useMemo(() => ({ groups: new Set(groupsArr), hideCollected, dlc }), [groupsArr, hideCollected, dlc]);
  const setFilters = useCallback((f: FilterState) => { setGroupsArr([...f.groups]); setHideCollected(f.hideCollected); setDlc(f.dlc); }, [setGroupsArr, setHideCollected, setDlc]);

  const [selected, setSelected] = useState<Marker | null>(null);
  const [tab, setTab] = useState<Tab>("explore");
  const [start, setStart] = useState<Marker | null>(null);
  const [dest, setDest] = useState<Destination | null>(null);
  const [opts, setOpts] = useState<RouteOptions>({ allowGated: true, useWarps: true });

  const visible = useMemo(() => {
    const out: Marker[] = [];
    for (const m of markers) {
      if (!filters.groups.has(markerGroup(m))) continue;
      if (!filters.dlc && m.dlc) continue;
      if (filters.hideCollected && m.kind === "item" && collected.has(m.id)) continue;
      out.push(m);
    }
    // always keep the selected / route endpoints visible
    if (selected && !out.includes(selected)) out.push(selected);
    return out;
  }, [filters, collected, selected]);
  const visibleIds = useMemo(() => new Set(visible.map((m) => m.id)), [visible]);

  const groupCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const mk of markers) {
      if (!filters.dlc && mk.dlc) continue;
      if (filters.hideCollected && mk.kind === "item" && collected.has(mk.id)) continue;
      const g = markerGroup(mk);
      m.set(g, (m.get(g) ?? 0) + 1);
    }
    return m;
  }, [filters, collected]);

  const result: RouteResult | null | "none" = useMemo(() => {
    if (!start || !dest) return null;
    const from = start.nodeId;
    let r: RouteResult | null = null;
    switch (dest.type) {
      case "nearest-bonfire": r = nearest(from, bonfires.filter((b) => !b.primal).map((b) => b.id), opts); break;
      case "nearest-boss": r = nearest(from, bosses.map((b) => b.node), opts); break;
      case "nearest-merchant": r = nearest(from, npcs.filter((n) => n.role === "merchant" || n.role === "blacksmith").map((n) => n.node), opts); break;
      case "boss": { const b = bosses.find((x) => x.id === dest.id); r = b ? route(from, b.node, opts) : null; break; }
      case "farm": { const e = enemies.find((x) => x.id === dest.enemyId); r = e ? route(from, e.node, opts) : null; break; }
      case "marker": { const m = markerById.get(dest.id); r = m ? route(from, m.nodeId, opts) : null; break; }
    }
    return r ?? "none";
  }, [start, dest, opts]);

  const flyToMarker = useCallback((m: Marker) => {
    const vp = mapRef.current?.getViewport();
    mapRef.current?.flyTo(m.x, m.y, Math.max(vp?.zoom ?? 1, m.kind === "bonfire" || m.kind === "boss" ? 1.2 : 1.8));
  }, []);
  const select = useCallback((m: Marker | null, fly = false) => {
    setSelected(m);
    if (m) { setTab("details"); if (fly) flyToMarker(m); }
  }, [flyToMarker]);
  const onPick = useCallback((h: SearchHit) => {
    if (h.type === "marker") select(h.marker, true);
    else if (h.type === "area") { const a = h.area; mapRef.current?.flyTo(a.label[0], a.label[1] + 60, 0.9); }
    else mapRef.current?.flyTo(h.node.x, h.node.y, 1.6);
  }, [select]);
  const onSelectNode = useCallback((id: string) => {
    const n = nodeById.get(id);
    if (!n) return;
    const vp = mapRef.current?.getViewport();
    mapRef.current?.flyTo(n.x, n.y, Math.max((vp?.zoom ?? 0.5) * 1.8, 1.2));
  }, []);
  const routeFrom = useCallback((m: Marker) => { setStart(m); setTab("route"); }, []);
  const routeTo = useCallback((m: Marker) => {
    setDest({ type: "marker", id: m.id });
    setTab("route");
    if (!start) {
      // default start: nearest bonfire in the same area, else Majula
      const b = bonfires.find((x) => x.areaId === m.areaId) ?? bonfires.find((x) => x.id === "maj.far_fire")!;
      setStart(markerById.get("bonfire:" + b.id) ?? null);
    }
  }, [start]);

  // keyboard shortcut: "/" focuses search
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault(); document.getElementById("map-search")?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const totalItems = counts.items;
  const routeForMap = result && result !== "none" ? result : null;

  return (
    <div className="flex h-dvh w-full flex-col bg-[#0a0908] text-stone-100 md:flex-row">
      <aside className="order-2 flex h-[46dvh] w-full shrink-0 flex-col border-t border-amber-200/20 bg-[#0f0d0b] md:order-1 md:h-full md:w-[380px] md:border-r md:border-t-0 lg:w-[420px]" aria-label="Map controls">
        <header className="space-y-2 border-b border-amber-200/15 p-3">
          <h1 className="font-serif text-base tracking-wide text-amber-100"><span className="text-amber-300">Dark Souls II</span> · Scholar of the First Sin — World Map</h1>
          <SearchBox onPick={onPick} />
          <nav className="flex gap-1" aria-label="Panels">
            {(["explore", "areas", "route", "details"] as Tab[]).map((t) => (
              <button key={t} className={"tab " + (tab === t ? "tab-on" : "")} onClick={() => setTab(t)} aria-pressed={tab === t}>
                {t === "explore" ? "Filters" : t === "areas" ? "Areas" : t === "route" ? "Route" : "Details"}
              </button>
            ))}
          </nav>
        </header>
        <div className="min-h-0 flex-1 overflow-auto p-3">
          {tab === "explore" && (
            <LegendFilters filters={filters} onChange={setFilters} counts={groupCounts} collectedCount={loaded ? collected.size : 0} totalItems={totalItems} onClearCollected={clear} />
          )}
          {tab === "areas" && <AreaList onFlyArea={(id) => { const a = areaById.get(id); if (a) mapRef.current?.flyTo(a.label[0], a.label[1] + 60, 0.9); }} onSelect={(m) => select(m, true)} collected={collected} filtered={visibleIds} />}
          {tab === "route" && (
            <RoutePanel start={start} dest={dest} opts={opts} result={result} onSetDest={setDest} onSetOpts={setOpts} onClear={() => { setStart(null); setDest(null); }} onSelect={(m) => select(m, true)} onFly={(x, y) => mapRef.current?.flyTo(x, y, 1.6)} />
          )}
          {tab === "details" && (selected ? (
            <Details marker={selected} collected={collected} onToggleCollected={toggle} onRouteFrom={routeFrom} onRouteTo={routeTo} onSelect={(m) => select(m, true)} onFly={flyToMarker} />
          ) : <p className="text-sm text-stone-400">Select a marker on the map or from search to see its details.</p>)}
        </div>
        <footer className="border-t border-amber-200/15 px-3 py-1.5 text-[10px] text-stone-500">
          {counts.areas} areas · {counts.bonfires} bonfires · {counts.bosses} bosses · {counts.items} items · {counts.edges} edges. Data from darksouls2.wiki.fextralife.com and darksouls2.wikidot.com (SotFS placements). Original schematic layout; not a game map image.
        </footer>
      </aside>
      <main className="relative order-1 min-h-0 flex-1 md:order-2">
        <MapCanvas ref={mapRef} markers={visible} selected={selected} route={routeForMap} collected={collected} onSelect={(m) => select(m)} onSelectNode={onSelectNode} onSelectArea={(id) => { const ar = areaById.get(id); if (ar) mapRef.current?.flyTo(ar.label[0], ar.label[1] + 60, 1.0); }} />
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
          <button className="btn pointer-events-auto" onClick={() => mapRef.current?.fitWorld()} title="Fit the whole map (F)">Fit map</button>
          {start && <span className="rounded bg-black/70 px-2 py-0.5 text-[11px] text-amber-100">Route start: {start.name}</span>}
        </div>
        <p className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-[10px] text-stone-400">Drag / WASD to pan · wheel or +/- to zoom · click markers · / to search</p>
      </main>
    </div>
  );
}
