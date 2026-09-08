"use client";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { categoryById, type Marker } from "@/lib/markers";
import { nodeById } from "@/data";
import { usePanZoom, enterWorld, type DrawArgs, type HitTarget, type PanZoomHandle } from "@/lib/panzoom";
import { areaLayout, type Placed } from "@/lib/areamaps";
import { centroid } from "@/data/areamaps/geom";
import { glyphPath } from "./MapCanvas";
import type { AreaMap, Floor, FloorFeature, Pt, Room, RoomKind } from "@/data/types";
import type { RouteResult } from "@/lib/graph";

export type AreaMapCanvasHandle = PanZoomHandle;

interface Props {
  map: AreaMap;
  floorId: string;
  markers: Marker[];            // already filtered; other areas are ignored
  selected: Marker | null;
  route: RouteResult | null;
  collected: Set<string>;
  onSelect(m: Marker | null): void;
  onSelectNode?(id: string): void;
  onFloor(id: string): void;
}

interface Hit { m?: Marker; nodeId?: string; feature?: FloorFeature }

const PAD = 30;

const ROOM_FILL: Record<RoomKind, string> = {
  interior: "rgba(96, 84, 66, 0.94)",
  open: "rgba(72, 80, 58, 0.9)",
  ruin: "rgba(84, 78, 70, 0.8)",
  water: "rgba(38, 74, 110, 0.85)",
  lava: "rgba(178, 62, 20, 0.88)",
  void: "rgba(8, 6, 4, 0.96)",
};
const ROOM_STROKE: Record<RoomKind, string> = {
  interior: "rgba(222, 190, 120, 0.85)",
  open: "rgba(186, 196, 146, 0.7)",
  ruin: "rgba(180, 170, 150, 0.6)",
  water: "rgba(120, 180, 230, 0.7)",
  lava: "rgba(255, 150, 70, 0.85)",
  void: "rgba(150, 130, 100, 0.6)",
};

function tracePoly(ctx: CanvasRenderingContext2D, poly: Pt[]) {
  ctx.beginPath();
  poly.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
}

function drawRoom(ctx: CanvasRenderingContext2D, r: Room, z: number, ghost: "none" | "below" | "above") {
  tracePoly(ctx, r.outline);
  if (ghost === "none") {
    ctx.fillStyle = ROOM_FILL[r.kind];
    ctx.fill();
    if (r.kind === "lava") { ctx.save(); ctx.shadowColor = "rgba(255,120,40,0.7)"; ctx.shadowBlur = 12 / z; ctx.strokeStyle = ROOM_STROKE[r.kind]; ctx.lineWidth = 1.5 / z; ctx.stroke(); ctx.restore(); return; }
    ctx.lineWidth = (r.kind === "open" ? 1.2 : 1.6) / z;
    ctx.strokeStyle = ROOM_STROKE[r.kind];
    ctx.setLineDash(r.kind === "ruin" ? [3 / z, 3 / z] : []);
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    ctx.lineWidth = 1 / z;
    ctx.strokeStyle = ghost === "below" ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.06)";
    ctx.setLineDash(ghost === "above" ? [4 / z, 4 / z] : []);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function arrowHead(ctx: CanvasRenderingContext2D, from: Pt, to: Pt, size: number) {
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const l = Math.hypot(dx, dy) || 1;
  const ux = dx / l, uy = dy / l;
  ctx.beginPath();
  ctx.moveTo(to[0], to[1]);
  ctx.lineTo(to[0] - ux * size - uy * size * 0.6, to[1] - uy * size + ux * size * 0.6);
  ctx.lineTo(to[0] - ux * size + uy * size * 0.6, to[1] - uy * size - ux * size * 0.6);
  ctx.closePath();
  ctx.fill();
}

function drawFeature(ctx: CanvasRenderingContext2D, f: FloorFeature, z: number, showLabels: boolean): { x: number; y: number } | null {
  const [a, b] = [f.pts[0], f.pts[f.pts.length - 1]];
  const labelAt = { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 };
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  switch (f.kind) {
    case "stairs": {
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1;
      const ux = dx / l, uy = dy / l, nx = -uy, ny = ux;
      const half = 2.2;
      ctx.strokeStyle = "#d8c9a3"; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(a[0] + nx * half, a[1] + ny * half); ctx.lineTo(b[0] + nx * half, b[1] + ny * half); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(a[0] - nx * half, a[1] - ny * half); ctx.lineTo(b[0] - nx * half, b[1] - ny * half); ctx.stroke();
      for (let t = 1.4; t < l - 0.4; t += 1.4) {
        const px = a[0] + ux * t, py = a[1] + uy * t;
        ctx.beginPath(); ctx.moveTo(px + nx * half, py + ny * half); ctx.lineTo(px - nx * half, py - ny * half); ctx.stroke();
      }
      ctx.fillStyle = "#f2e2b8";
      arrowHead(ctx, a, [b[0] + ux * 1.6, b[1] + uy * 1.6], 2.2);
      break;
    }
    case "ladder": {
      ctx.save();
      ctx.translate(a[0], a[1]);
      ctx.strokeStyle = "#e6c26e"; ctx.lineWidth = 0.55;
      ctx.beginPath(); ctx.moveTo(-1.3, -3); ctx.lineTo(-1.3, 3); ctx.moveTo(1.3, -3); ctx.lineTo(1.3, 3); ctx.stroke();
      for (let y = -2.2; y <= 2.2; y += 1.1) { ctx.beginPath(); ctx.moveTo(-1.3, y); ctx.lineTo(1.3, y); ctx.stroke(); }
      ctx.restore();
      break;
    }
    case "elevator": {
      ctx.fillStyle = "rgba(20,16,12,0.95)"; ctx.strokeStyle = "#f0c860"; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.rect(a[0] - 3, a[1] - 3, 6, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#f0c860";
      ctx.font = `bold 4px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("⇅", a[0], a[1] + 0.3);
      break;
    }
    case "fog": {
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.8)"; ctx.shadowBlur = 6 / z;
      ctx.strokeStyle = "rgba(245,245,255,0.95)"; ctx.lineWidth = 1.6;
      ctx.setLineDash([1.4, 1.2]);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.restore();
      ctx.setLineDash([]);
      break;
    }
    case "door":
    case "locked-door":
    case "illusory-wall": {
      const locked = f.kind === "locked-door";
      ctx.strokeStyle = locked ? "#f2d060" : f.kind === "door" ? "#c9b58a" : "#a0a0a0";
      ctx.lineWidth = f.kind === "illusory-wall" ? 0.9 : 1.4;
      ctx.setLineDash(f.kind === "illusory-wall" ? [0.6, 1] : []);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.setLineDash([]);
      if (locked) {
        ctx.save(); ctx.translate(labelAt.x, labelAt.y); ctx.scale(1.6, 1.6);
        ctx.fillStyle = "#f2d060"; ctx.strokeStyle = "#000"; ctx.lineWidth = 0.15;
        const lock = glyphPath("lock"); ctx.fill(lock, "evenodd"); ctx.stroke(lock);
        ctx.restore();
      }
      break;
    }
    case "drop": {
      ctx.strokeStyle = "#ff7a66"; ctx.fillStyle = "#ff7a66"; ctx.lineWidth = 1.1;
      ctx.setLineDash([1.6, 1]);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.setLineDash([]);
      arrowHead(ctx, a, b, 2.4);
      break;
    }
    case "lever": {
      ctx.save(); ctx.translate(a[0], a[1]); ctx.scale(2, 2);
      ctx.fillStyle = "#cfcfcf"; ctx.strokeStyle = "#000"; ctx.lineWidth = 0.15;
      const lev = glyphPath("lever"); ctx.fill(lev, "evenodd"); ctx.stroke(lev);
      ctx.restore();
      break;
    }
    case "bridge": {
      ctx.strokeStyle = "#b9a887"; ctx.lineWidth = 0.7;
      for (const off of [-1.6, 1.6]) {
        ctx.beginPath();
        for (let i = 0; i < f.pts.length; i++) {
          const p = f.pts[i], q = f.pts[Math.min(i + 1, f.pts.length - 1)], o = f.pts[Math.max(i - 1, 0)];
          const dx = q[0] - o[0], dy = q[1] - o[1]; const l = Math.hypot(dx, dy) || 1;
          const x = p[0] + (-dy / l) * off, y = p[1] + (dx / l) * off;
          if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      break;
    }
    case "note": {
      ctx.font = `italic ${Math.max(9 / z, 2.2)}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.lineWidth = 2.5 / z; ctx.strokeStyle = "rgba(0,0,0,0.85)";
      ctx.fillStyle = "rgba(225,215,190,0.9)";
      ctx.strokeText(f.label ?? "", a[0], a[1]);
      ctx.fillText(f.label ?? "", a[0], a[1]);
      return null;
    }
  }
  if (showLabels && f.label) {
    ctx.font = `${8.5 / z}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.lineWidth = 2.5 / z; ctx.strokeStyle = "rgba(0,0,0,0.85)";
    ctx.fillStyle = "rgba(232,224,204,0.92)";
    const y = labelAt.y + (f.kind === "ladder" || f.kind === "elevator" ? 3.6 : 1.6);
    ctx.strokeText(f.label, labelAt.x, y);
    ctx.fillText(f.label, labelAt.x, y);
  }
  return labelAt;
}

function drawPlan(a: DrawArgs, p: Props, layout: Map<Marker, Placed>): HitTarget<Hit>[] {
  const { ctx, w, h, vp: v, visible } = a;
  const { map, floorId, markers, selected, route, collected } = p;
  const hits: HitTarget<Hit>[] = [];
  const z = v.zoom;

  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.8);
  g.addColorStop(0, "#14110e");
  g.addColorStop(1, "#050404");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  enterWorld(ctx, a);

  // parchment-ish grid every 10 units
  ctx.lineWidth = 1 / z;
  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  for (let gx = 0; gx <= map.width; gx += 10) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, map.height); ctx.stroke(); }
  for (let gy = 0; gy <= map.height; gy += 10) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(map.width, gy); ctx.stroke(); }
  ctx.strokeStyle = "rgba(201,162,39,0.25)"; ctx.lineWidth = 1.5 / z;
  ctx.strokeRect(0, 0, map.width, map.height);

  const current = map.floors.find((f) => f.id === floorId) ?? map.floors[0];
  // other floors as ghosts
  for (const fl of map.floors) {
    if (fl === current) continue;
    for (const r of fl.rooms) drawRoom(ctx, r, z, fl.level < current.level ? "below" : "above");
  }
  for (const r of current.rooms) drawRoom(ctx, r, z, "none");

  const showRoomLabels = z >= 2;
  if (showRoomLabels) {
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const r of current.rooms) {
      if (!r.name) continue;
      const [cx, cy] = centroid(r.outline);
      if (!visible(cx, cy)) continue;
      ctx.font = `600 ${Math.max(10 / z, 2.4)}px Cinzel, 'Trajan Pro', Georgia, serif`;
      ctx.lineWidth = 3 / z; ctx.strokeStyle = "rgba(0,0,0,0.8)";
      ctx.fillStyle = r.kind === "water" ? "rgba(190,220,250,0.85)" : r.kind === "lava" ? "rgba(255,225,190,0.9)" : "rgba(232,214,170,0.85)";
      ctx.strokeText(r.name.toUpperCase(), cx, cy);
      ctx.fillText(r.name.toUpperCase(), cx, cy);
    }
  }

  const showFeatureLabels = z >= 4.5;
  for (const f of current.features) {
    drawFeature(ctx, f, z, showFeatureLabels);
    if (f.toFloor) {
      const pt = f.pts[f.pts.length - 1];
      hits.push({ x: pt[0], y: pt[1], r: Math.max(3.5, 9 / z), data: { feature: f } });
    } else if (f.label && f.kind !== "note") {
      const pt = f.pts.length > 1 ? [(f.pts[0][0] + f.pts[f.pts.length - 1][0]) / 2, (f.pts[0][1] + f.pts[f.pts.length - 1][1]) / 2] : f.pts[0];
      hits.push({ x: pt[0], y: pt[1], r: Math.max(2.5, 7 / z), data: { feature: f } });
    }
  }

  // route: steps whose ends are both placed in this plan
  if (route && route.steps.length) {
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    for (const s of route.steps) {
      const pa = map.positions[s.from.id], pb = map.positions[s.to.id];
      if (!pa || !pb) continue;
      const onFloor = pa.floor === floorId || pb.floor === floorId;
      for (const pass of [0, 1]) {
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
        ctx.lineWidth = (pass ? 3.5 : 9) / z;
        ctx.setLineDash(pass && s.warp ? [8 / z, 6 / z] : []);
        ctx.strokeStyle = pass
          ? (s.warp ? (onFloor ? "#7fd6ff" : "rgba(127,214,255,0.35)") : (onFloor ? "#ffd766" : "rgba(255,215,102,0.35)"))
          : (onFloor ? "rgba(255,190,60,0.3)" : "rgba(255,190,60,0.1)");
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
  }

  // landmarks on this floor
  const showMarkers = z >= 2.2;
  const countByNode = new Map<string, number>();
  if (!showMarkers) for (const m of markers) {
    const pl = layout.get(m);
    if (!pl || pl.floor !== floorId || m.kind === "bonfire" || m.kind === "boss") continue;
    if (m.kind === "item" && collected.has(m.id)) continue;
    countByNode.set(m.nodeId, (countByNode.get(m.nodeId) ?? 0) + 1);
  }
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const [id, pos] of Object.entries(map.positions)) {
    if (pos.floor !== floorId) continue;
    const n = nodeById.get(id);
    if (!n || n.kind === "bonfire" || n.kind === "primal" || n.kind === "boss") continue;
    const r = 4 / z;
    ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    ctx.fillStyle = n.kind === "entrance" ? "#d9c28a" : "#a8a090"; ctx.fill();
    ctx.lineWidth = 1.2 / z; ctx.strokeStyle = "#000"; ctx.stroke();
    hits.push({ x: pos.x, y: pos.y, r: 7 / z, data: { nodeId: id } });
    if (z >= 1.6) {
      ctx.font = `${10 / z}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(235,225,200,0.9)"; ctx.strokeStyle = "rgba(0,0,0,0.9)"; ctx.lineWidth = 3 / z;
      ctx.strokeText(n.name, pos.x, pos.y - 9 / z);
      ctx.fillText(n.name, pos.x, pos.y - 9 / z);
    }
  }
  if (!showMarkers) for (const [nid, c] of countByNode) {
    const pos = map.positions[nid];
    if (!pos) continue;
    const r = 10 / z, cx = pos.x + 13 / z, cy = pos.y + 12 / z;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(60,50,40,0.95)"; ctx.fill();
    ctx.lineWidth = 1.5 / z; ctx.strokeStyle = "#d9c28a"; ctx.stroke();
    ctx.font = `bold ${10 / z}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillStyle = "#f4e6c0"; ctx.fillText(String(c), cx, cy + 0.5 / z);
    hits.push({ x: cx, y: cy, r, data: { nodeId: nid } });
  }

  // markers
  const selectedId = selected?.id;
  for (const m of markers) {
    const pl = layout.get(m);
    if (!pl || pl.floor !== floorId) continue;
    const big = m.kind === "bonfire" || m.kind === "boss";
    if (!showMarkers && !big) continue;
    if (!visible(pl.x, pl.y)) continue;
    const meta = categoryById.get(m.category);
    const s = (big ? 12 : 7.5) / z;
    const isCollected = m.kind === "item" && collected.has(m.id);
    ctx.save();
    ctx.translate(pl.x, pl.y);
    if (m.kind === "bonfire") { ctx.shadowColor = meta?.color ?? "#fa0"; ctx.shadowBlur = 14 / z; }
    ctx.scale(s, s);
    ctx.fillStyle = isCollected ? "rgba(120,120,120,0.55)" : meta?.color ?? "#ddd";
    ctx.strokeStyle = "#000"; ctx.lineWidth = 0.18;
    const path = glyphPath(meta?.glyph ?? "circle");
    ctx.fill(path, "evenodd"); ctx.stroke(path);
    ctx.restore();
    if (selectedId === m.id) {
      ctx.beginPath(); ctx.arc(pl.x, pl.y, s * 1.9, 0, Math.PI * 2);
      ctx.lineWidth = 3 / z; ctx.strokeStyle = "#ffd766"; ctx.stroke();
    }
    hits.push({ x: pl.x, y: pl.y, r: Math.max(s * 1.4, 9 / z), data: { m, nodeId: m.nodeId } });
    if (big) {
      ctx.font = `${(m.kind === "boss" ? 12 : 11) / z}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = m.kind === "boss" ? "#ffb3b3" : "#ffd9a0";
      ctx.strokeStyle = "rgba(0,0,0,0.9)"; ctx.lineWidth = 3 / z;
      ctx.strokeText(m.name, pl.x, pl.y + s + 10 / z);
      ctx.fillText(m.name, pl.x, pl.y + s + 10 / z);
    } else if (z >= 7) {
      ctx.font = `${9 / z}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(230,222,200,0.9)";
      ctx.strokeStyle = "rgba(0,0,0,0.9)"; ctx.lineWidth = 2.5 / z;
      ctx.strokeText(m.name, pl.x, pl.y + s + 8 / z);
      ctx.fillText(m.name, pl.x, pl.y + s + 8 / z);
    }
  }

  ctx.restore();
  return hits;
}

function hoverFor(h: Hit): string {
  if (h.m) return h.m.name;
  if (h.nodeId) return nodeById.get(h.nodeId)?.name ?? "";
  if (h.feature) {
    const f = h.feature;
    return (f.label ?? f.kind) + (f.toFloor ? " (click to change floor)" : "");
  }
  return "";
}

export const AreaMapCanvas = forwardRef<AreaMapCanvasHandle, Props>(function AreaMapCanvas(props, ref) {
  const { map, floorId, markers, selected, route, collected } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  useEffect(() => { propsRef.current = props; });
  const layout = useMemo(() => areaLayout(map), [map]);
  const bounds = useMemo(() => ({ minX: -PAD, minY: -PAD, maxX: map.width + PAD, maxY: map.height + PAD }), [map]);

  const { hover, requestRender } = usePanZoom<Hit>(ref, canvasRef, wrapRef, {
    bounds,
    maxZoom: 40,
    minZoom: (fit) => fit * 0.6,
    flyZoom: 6,
    draw: (a) => drawPlan(a, propsRef.current, layout),
    onClick: (hit) => {
      const p = propsRef.current;
      if (hit?.m) p.onSelect(hit.m);
      else if (hit?.feature?.toFloor) p.onFloor(hit.feature.toFloor);
      else if (hit?.nodeId) p.onSelectNode?.(hit.nodeId);
      else if (!hit) p.onSelect(null);
    },
    hoverText: hoverFor,
    onEscape: () => propsRef.current.onSelect(null),
  });

  useEffect(() => { requestRender(); }, [map, floorId, markers, selected, route, collected, requestRender]);

  const floor: Floor | undefined = map.floors.find((f) => f.id === floorId);
  return (
    <div ref={wrapRef} className="relative h-full w-full overflow-hidden touch-none">
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="application"
        aria-label={`Floor plan of ${floor?.name ?? map.areaId}. Drag or use WASD / arrow keys to pan, scroll or +/- to zoom, F to fit, Escape to deselect. Stairs, ladders and drops can be clicked to change floor.`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-grab"
      />
      {hover && (
        <div className="pointer-events-none absolute z-10 max-w-xs rounded border border-amber-200/30 bg-black/85 px-2 py-1 text-xs text-amber-50 shadow" style={{ left: hover.x + 12, top: hover.y + 12 }}>
          {hover.text}
        </div>
      )}
    </div>
  );
});
