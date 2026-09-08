"use client";
import { forwardRef, useEffect, useRef } from "react";
import { edges } from "@/data";
import { areas, nodes, nodeById, GLYPHS, categoryById, worldBounds, type Marker } from "@/lib/markers";
import { usePanZoom, enterWorld, type DrawArgs, type HitTarget, type PanZoomHandle } from "@/lib/panzoom";
import { pointInPolygon } from "@/data/areamaps/geom";
import type { RouteResult } from "@/lib/graph";
import type { Dlc } from "@/data/types";

export type { Viewport } from "@/lib/panzoom";
export type MapCanvasHandle = PanZoomHandle;

interface Props {
  markers: Marker[];            // already filtered
  selected: Marker | null;
  route: RouteResult | null;
  collected: Set<string>;
  onSelect(m: Marker | null): void;
  onSelectNode?(id: string): void;
  /** Clicking inside an area polygon with nothing else under the cursor (zoomed out). */
  onSelectArea?(id: string): void;
  className?: string;
}

const AREA_FILL: Record<Dlc | "base", string> = {
  base: "rgba(70, 62, 52, 0.55)",
  sunken: "rgba(40, 84, 84, 0.55)",
  iron: "rgba(96, 52, 40, 0.55)",
  ivory: "rgba(70, 88, 110, 0.55)",
};
const AREA_STROKE: Record<Dlc | "base", string> = {
  base: "rgba(201, 162, 39, 0.55)",
  sunken: "rgba(120, 220, 200, 0.6)",
  iron: "rgba(255, 140, 90, 0.6)",
  ivory: "rgba(170, 210, 255, 0.65)",
};

const path2d = new Map<string, Path2D>();
export function glyphPath(name: string) {
  let p = path2d.get(name);
  if (!p) path2d.set(name, (p = new Path2D(GLYPHS[name] ?? GLYPHS.circle)));
  return p;
}

/** Split long area names onto two lines when zoomed out so labels do not collide. */
function areaLabelLines(name: string, wrap: boolean): string[] {
  const up = name.toUpperCase();
  if (!wrap || up.length < 14) return [up];
  const words = up.split(" ");
  if (words.length < 2) return [up];
  let best = 1, bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length, b = words.slice(i).join(" ").length;
    const diff = Math.abs(a - b);
    if (diff < bestDiff) { bestDiff = diff; best = i; }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

interface Hit { m: Marker | null; nodeId: string | null }

function drawWorld(a: DrawArgs, p: Props): HitTarget<Hit>[] {
  const { ctx, w, h, vp: v, left, top, right, bottom, visible } = a;
  const { markers, selected, route, collected } = p;
  const hits: HitTarget<Hit>[] = [];
  // background
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.8);
  g.addColorStop(0, "#15120f");
  g.addColorStop(1, "#060505");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const z = v.zoom;
  ctx.save();
  enterWorld(ctx, a);

  // grid (subtle)
  ctx.lineWidth = 1 / z;
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  const step = 500;
  for (let gx = Math.floor(left / step) * step; gx < right; gx += step) { ctx.beginPath(); ctx.moveTo(gx, top); ctx.lineTo(gx, bottom); ctx.stroke(); }
  for (let gy = Math.floor(top / step) * step; gy < bottom; gy += step) { ctx.beginPath(); ctx.moveTo(left, gy); ctx.lineTo(right, gy); ctx.stroke(); }

  // areas
  for (const ar of areas) {
    const kind = ar.dlc ?? "base";
    ctx.beginPath();
    ar.shape.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = AREA_FILL[kind];
    ctx.fill();
    ctx.lineWidth = 2.5 / z;
    ctx.strokeStyle = AREA_STROKE[kind];
    ctx.stroke();
  }

  // edges between nodes
  for (const e of edges) {
    const na = nodeById.get(e.from)!, nb = nodeById.get(e.to)!;
    if (!visible(na.x, na.y, 400) && !visible(nb.x, nb.y, 400)) continue;
    const inter = na.areaId !== nb.areaId;
    const gated = !!e.requires?.length;
    ctx.beginPath();
    ctx.moveTo(na.x, na.y);
    ctx.lineTo(nb.x, nb.y);
    ctx.lineWidth = (inter ? 3 : 1.5) / z;
    ctx.setLineDash(gated ? [8 / z, 6 / z] : e.kind === "warp" ? [2 / z, 6 / z] : []);
    ctx.strokeStyle = inter ? "rgba(201,162,39,0.45)" : "rgba(220,200,160,0.22)";
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // route
  if (route && route.steps.length) {
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    for (const pass of [0, 1]) {
      ctx.beginPath();
      ctx.moveTo(route.source.x, route.source.y);
      for (const s of route.steps) ctx.lineTo(s.to.x, s.to.y);
      ctx.lineWidth = (pass ? 4 : 10) / z;
      ctx.strokeStyle = pass ? "#ffd766" : "rgba(255,190,60,0.35)";
      ctx.stroke();
    }
    ctx.setLineDash([10 / z, 8 / z]);
    ctx.strokeStyle = "#7fd6ff";
    ctx.lineWidth = 4 / z;
    for (const s of route.steps) if (s.warp) { ctx.beginPath(); ctx.moveTo(s.from.x, s.from.y); ctx.lineTo(s.to.x, s.to.y); ctx.stroke(); }
    ctx.setLineDash([]);
  }

  // nodes (landmarks) + clusters
  const showMarkers = z >= 0.85;
  const countByNode = new Map<string, { n: number; rem: number }>();
  if (!showMarkers) {
    for (const m of markers) {
      if (m.kind === "bonfire" || m.kind === "boss") continue;
      const c = countByNode.get(m.nodeId) ?? { n: 0, rem: 0 };
      c.n++;
      if (!(m.kind === "item" && collected.has(m.id))) c.rem++;
      countByNode.set(m.nodeId, c);
    }
  }
  const showNodeLabels = z >= 0.55;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const n of nodes) {
    if (!visible(n.x, n.y)) continue;
    if (n.kind === "bonfire" || n.kind === "primal" || n.kind === "boss") continue; // drawn as markers
    const r = 5 / z;
    ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fillStyle = n.kind === "entrance" ? "#d9c28a" : "#a8a090";
    ctx.fill();
    ctx.lineWidth = 1.5 / z; ctx.strokeStyle = "#000"; ctx.stroke();
    hits.push({ x: n.x, y: n.y, r: 8 / z, data: { m: null, nodeId: n.id } });
    if (showNodeLabels && z < 1.6) {
      ctx.font = `${11 / z}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(235,225,200,0.85)";
      ctx.strokeStyle = "rgba(0,0,0,0.9)"; ctx.lineWidth = 3 / z;
      ctx.strokeText(n.name, n.x, n.y + 14 / z);
      ctx.fillText(n.name, n.x, n.y + 14 / z);
    }
  }
  if (!showMarkers && z >= 0.3) {
    for (const [nid, c] of countByNode) {
      const n = nodeById.get(nid)!;
      if (!visible(n.x, n.y)) continue;
      const r = 11 / z;
      const cx = n.x + 16 / z, cy = n.y - 14 / z;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(60,50,40,0.95)"; ctx.fill();
      ctx.lineWidth = 1.5 / z; ctx.strokeStyle = "#d9c28a"; ctx.stroke();
      ctx.font = `bold ${11 / z}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = "#f4e6c0";
      ctx.fillText(String(c.rem), cx, cy + 0.5 / z);
      hits.push({ x: cx, y: cy, r, data: { m: null, nodeId: nid } });
    }
  }

  // markers
  const selectedId = selected?.id;
  for (const m of markers) {
    const big = m.kind === "bonfire" || m.kind === "boss";
    if (!showMarkers && !big) continue;
    if (!visible(m.x, m.y)) continue;
    const meta = categoryById.get(m.category);
    const base = big ? 12 : 7;
    const s = (base / z) * Math.min(1, Math.max(0.55, z));
    const isCollected = m.kind === "item" && collected.has(m.id);
    ctx.save();
    ctx.translate(m.x, m.y);
    if (m.kind === "bonfire") { ctx.shadowColor = meta?.color ?? "#fa0"; ctx.shadowBlur = 14 / z; }
    ctx.scale(s, s);
    ctx.fillStyle = isCollected ? "rgba(120,120,120,0.55)" : meta?.color ?? "#ddd";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 0.18;
    const path = glyphPath(meta?.glyph ?? "circle");
    ctx.fill(path, "evenodd");
    ctx.stroke(path);
    ctx.restore();
    if (selectedId === m.id) {
      ctx.beginPath(); ctx.arc(m.x, m.y, s * 1.9, 0, Math.PI * 2);
      ctx.lineWidth = 3 / z; ctx.strokeStyle = "#ffd766"; ctx.stroke();
    }
    hits.push({ x: m.x, y: m.y, r: Math.max(s * 1.4, 9 / z), data: { m, nodeId: m.nodeId } });
    if (big && z >= 0.45) {
      ctx.font = `${(m.kind === "boss" ? 12 : 11) / z}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = m.kind === "boss" ? "#ffb3b3" : "#ffd9a0";
      ctx.strokeStyle = "rgba(0,0,0,0.9)"; ctx.lineWidth = 3 / z;
      ctx.strokeText(m.name, m.x, m.y + s + 11 / z);
      ctx.fillText(m.name, m.x, m.y + s + 11 / z);
    } else if (showMarkers && z >= 2.2) {
      ctx.font = `${9 / z}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(230,222,200,0.9)";
      ctx.strokeStyle = "rgba(0,0,0,0.9)"; ctx.lineWidth = 2.5 / z;
      ctx.strokeText(m.name, m.x, m.y + s + 8 / z);
      ctx.fillText(m.name, m.x, m.y + s + 8 / z);
    }
  }

  // area labels (on top)
  for (const ar of areas) {
    const [lx, ly] = ar.label;
    if (!visible(lx, ly, 300)) continue;
    const fs = Math.max(11 / z, 26 / Math.max(z, 0.35));
    ctx.font = `600 ${fs}px Cinzel, 'Trajan Pro', Georgia, serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.lineWidth = 4 / z; ctx.strokeStyle = "rgba(0,0,0,0.85)";
    ctx.fillStyle = ar.dlc ? "rgba(200,230,255,0.9)" : "rgba(232,207,143,0.92)";
    const lines = areaLabelLines(ar.name, z < 0.4);
    lines.forEach((txt, i) => {
      const yy = ly + (i - (lines.length - 1) / 2) * fs * 1.1;
      ctx.strokeText(txt, lx, yy);
      ctx.fillText(txt, lx, yy);
    });
  }
  ctx.restore();
  return hits;
}

export const MapCanvas = forwardRef<MapCanvasHandle, Props>(function MapCanvas(props, ref) {
  const { markers, selected, route, collected, className } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  useEffect(() => { propsRef.current = props; });

  const { hover, requestRender } = usePanZoom<Hit>(ref, canvasRef, wrapRef, {
    bounds: worldBounds,
    maxZoom: 6,
    minZoom: (fit) => Math.max(0.03, Math.min(0.12, fit * 0.9)),
    flyZoom: 1.6,
    draw: (a) => drawWorld(a, propsRef.current),
    onClick: (hit, wx, wy, vp) => {
      const p = propsRef.current;
      if (hit?.m) p.onSelect(hit.m);
      else if (hit?.nodeId) p.onSelectNode?.(hit.nodeId);
      else {
        const area = vp.zoom < 0.85 ? areas.find((ar) => pointInPolygon(wx, wy, ar.shape)) : undefined;
        if (area) p.onSelectArea?.(area.id); else p.onSelect(null);
      }
    },
    hoverText: (h) => (h.m ? h.m.name : nodeById.get(h.nodeId!)?.name ?? ""),
    onEscape: () => propsRef.current.onSelect(null),
  });

  useEffect(() => { requestRender(); }, [markers, selected, route, collected, requestRender]);

  return (
    <div ref={wrapRef} className={"relative w-full h-full overflow-hidden touch-none " + (className ?? "")}>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="application"
        aria-label="Interactive map of Drangleic. Drag or use WASD / arrow keys to pan, scroll or +/- to zoom, F to fit, Escape to deselect. Use the search box and lists in the side panel to reach every marker with the keyboard."
        className="block outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-grab"
      />
      {hover && (
        <div className="pointer-events-none absolute z-10 rounded border border-amber-200/30 bg-black/85 px-2 py-1 text-xs text-amber-50 shadow" style={{ left: hover.x + 12, top: hover.y + 12 }}>
          {hover.text}
        </div>
      )}
    </div>
  );
});
