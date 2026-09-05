"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { edges } from "@/data";
import { areas, nodes, nodeById, GLYPHS, categoryById, worldBounds, type Marker } from "@/lib/markers";
import type { RouteResult } from "@/lib/graph";
import type { Dlc } from "@/data/types";

export interface Viewport { x: number; y: number; zoom: number }

export interface MapCanvasHandle {
  flyTo(x: number, y: number, zoom?: number): void;
  fitWorld(): void;
  getViewport(): Viewport;
}

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

function pointInPolygon(x: number, y: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
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
function glyphPath(name: string) {
  let p = path2d.get(name);
  if (!p) path2d.set(name, (p = new Path2D(GLYPHS[name] ?? GLYPHS.circle)));
  return p;
}

const MIN_ZOOM_ABS = 0.03;

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
const MAX_ZOOM = 6;

export const MapCanvas = forwardRef<MapCanvasHandle, Props>(function MapCanvas(
  { markers, selected, route, collected, onSelect, onSelectNode, onSelectArea, className }, ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const vp = useRef<Viewport>({ x: 3500, y: 2600, zoom: 0.35 });
  const velocity = useRef({ x: 0, y: 0 });
  const dirty = useRef(true);
  const animating = useRef(false);
  const keys = useRef(new Set<string>());
  const fly = useRef<{ tx: number; ty: number; tz: number; t: number; sx: number; sy: number; sz: number; start: number } | null>(null);
  const drawn = useRef<{ m: Marker | null; nodeId: string | null; x: number; y: number; r: number }[]>([]);
  const [hover, setHover] = useState<{ x: number; y: number; text: string } | null>(null);
  const propsRef = useRef({ markers, selected, route, collected });
  propsRef.current = { markers, selected, route, collected };
  const size = useRef({ w: 1, h: 1, dpr: 1 });

  const requestRender = () => { dirty.current = true; };

  useImperativeHandle(ref, () => ({
    flyTo(x, y, zoom) {
      fly.current = { tx: x, ty: y, tz: zoom ?? Math.max(vp.current.zoom, 1.6), t: 0, sx: vp.current.x, sy: vp.current.y, sz: vp.current.zoom, start: performance.now() };
      animating.current = true;
    },
    fitWorld() {
      const { w, h } = size.current;
      const zw = w / (worldBounds.maxX - worldBounds.minX);
      const zh = h / (worldBounds.maxY - worldBounds.minY);
      fly.current = { tx: (worldBounds.minX + worldBounds.maxX) / 2, ty: (worldBounds.minY + worldBounds.maxY) / 2, tz: Math.min(zw, zh), t: 0, sx: vp.current.x, sy: vp.current.y, sz: vp.current.zoom, start: performance.now() };
      animating.current = true;
    },
    getViewport: () => ({ ...vp.current }),
  }));

  useEffect(() => { requestRender(); }, [markers, selected, route, collected]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { w: r.width, h: r.height, dpr };
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      canvas.style.width = r.width + "px";
      canvas.style.height = r.height + "px";
      requestRender();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // initial fit
    {
      const { w, h } = size.current;
      const zw = w / (worldBounds.maxX - worldBounds.minX);
      const zh = h / (worldBounds.maxY - worldBounds.minY);
      vp.current = { x: (worldBounds.minX + worldBounds.maxX) / 2, y: (worldBounds.minY + worldBounds.maxY) / 2, zoom: Math.min(zw, zh) * 0.98 };
    }

    const toScreen = (wx: number, wy: number) => {
      const { w, h } = size.current;
      const v = vp.current;
      return [(wx - v.x) * v.zoom + w / 2, (wy - v.y) * v.zoom + h / 2] as const;
    };

    const draw = () => {
      const { w, h, dpr } = size.current;
      const v = vp.current;
      const { markers, selected, route, collected } = propsRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // background
      const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.8);
      g.addColorStop(0, "#15120f");
      g.addColorStop(1, "#060505");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const z = v.zoom;
      const left = v.x - w / 2 / z, top = v.y - h / 2 / z, right = v.x + w / 2 / z, bottom = v.y + h / 2 / z;
      const visible = (x: number, y: number, pad = 60) => x > left - pad && x < right + pad && y > top - pad && y < bottom + pad;

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(z, z);
      ctx.translate(-v.x, -v.y);

      // grid (subtle)
      ctx.lineWidth = 1 / z;
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      const step = 500;
      for (let gx = Math.floor(left / step) * step; gx < right; gx += step) { ctx.beginPath(); ctx.moveTo(gx, top); ctx.lineTo(gx, bottom); ctx.stroke(); }
      for (let gy = Math.floor(top / step) * step; gy < bottom; gy += step) { ctx.beginPath(); ctx.moveTo(left, gy); ctx.lineTo(right, gy); ctx.stroke(); }

      // areas
      for (const a of areas) {
        const kind = a.dlc ?? "base";
        ctx.beginPath();
        a.shape.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();
        ctx.fillStyle = AREA_FILL[kind];
        ctx.fill();
        ctx.lineWidth = 2.5 / z;
        ctx.strokeStyle = AREA_STROKE[kind];
        ctx.stroke();
      }

      // edges between nodes
      const routeEdgeKey = new Set<string>();
      if (route) for (const s of route.steps) routeEdgeKey.add(s.from.id + ">" + s.to.id);
      for (const e of edges) {
        const a = nodeById.get(e.from)!, b = nodeById.get(e.to)!;
        if (!visible(a.x, a.y, 400) && !visible(b.x, b.y, 400)) continue;
        const inter = a.areaId !== b.areaId;
        const gated = !!e.requires?.length;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
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
          ctx.setLineDash(pass ? [] : []);
          ctx.stroke();
        }
        // warp steps dashed overlay
        ctx.setLineDash([10 / z, 8 / z]);
        ctx.strokeStyle = "#7fd6ff";
        ctx.lineWidth = 4 / z;
        for (const s of route.steps) if (s.warp) { ctx.beginPath(); ctx.moveTo(s.from.x, s.from.y); ctx.lineTo(s.to.x, s.to.y); ctx.stroke(); }
        ctx.setLineDash([]);
      }

      // nodes (landmarks) + clusters
      drawn.current = [];
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
        drawn.current.push({ m: null, nodeId: n.id, x: n.x, y: n.y, r: 8 / z });
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
          drawn.current.push({ m: null, nodeId: nid, x: cx, y: cy, r });
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
        if (m.kind === "bonfire") {
          ctx.shadowColor = meta?.color ?? "#fa0"; ctx.shadowBlur = 14 / z;
        }
        ctx.scale(s, s);
        ctx.fillStyle = isCollected ? "rgba(120,120,120,0.55)" : meta?.color ?? "#ddd";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 0.18;
        const p = glyphPath(meta?.glyph ?? "circle");
        ctx.fill(p, "evenodd");
        ctx.stroke(p);
        ctx.restore();
        if (selectedId === m.id) {
          ctx.beginPath(); ctx.arc(m.x, m.y, s * 1.9, 0, Math.PI * 2);
          ctx.lineWidth = 3 / z; ctx.strokeStyle = "#ffd766"; ctx.stroke();
        }
        drawn.current.push({ m, nodeId: m.nodeId, x: m.x, y: m.y, r: Math.max(s * 1.4, 9 / z) });
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
      for (const a of areas) {
        const [lx, ly] = a.label;
        if (!visible(lx, ly, 300)) continue;
        const fs = Math.max(11 / z, 26 / Math.max(z, 0.35));
        ctx.font = `600 ${fs}px Cinzel, 'Trajan Pro', Georgia, serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.lineWidth = 4 / z; ctx.strokeStyle = "rgba(0,0,0,0.85)";
        ctx.fillStyle = a.dlc ? "rgba(200,230,255,0.9)" : "rgba(232,207,143,0.92)";
        const lines = areaLabelLines(a.name, z < 0.4);
        lines.forEach((txt, i) => {
          const yy = ly + (i - (lines.length - 1) / 2) * fs * 1.1;
          ctx.strokeText(txt, lx, yy);
          ctx.fillText(txt, lx, yy);
        });
      }
      ctx.restore();
      void toScreen;
    };

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let moving = false;
      const v = vp.current;
      // keyboard pan
      const k = keys.current;
      if (k.size) {
        const sp = 700 / v.zoom * dt;
        if (k.has("ArrowLeft") || k.has("a")) { v.x -= sp; moving = true; }
        if (k.has("ArrowRight") || k.has("d")) { v.x += sp; moving = true; }
        if (k.has("ArrowUp") || k.has("w")) { v.y -= sp; moving = true; }
        if (k.has("ArrowDown") || k.has("s")) { v.y += sp; moving = true; }
        if (k.has("=") || k.has("+")) { v.zoom = Math.min(MAX_ZOOM, v.zoom * (1 + 1.5 * dt)); moving = true; }
        if (k.has("-") || k.has("_")) { v.zoom = Math.max(Math.max(MIN_ZOOM_ABS, Math.min(0.12, fitZoom())), v.zoom / (1 + 1.5 * dt)); moving = true; }
      }
      // inertia
      const vel = velocity.current;
      if (!dragging.current && (Math.abs(vel.x) > 2 || Math.abs(vel.y) > 2)) {
        v.x -= vel.x * dt / v.zoom;
        v.y -= vel.y * dt / v.zoom;
        const decay = Math.pow(0.02, dt);
        vel.x *= decay; vel.y *= decay;
        moving = true;
      } else if (!dragging.current) { vel.x = 0; vel.y = 0; }
      // fly
      if (fly.current) {
        const f = fly.current;
        f.t = Math.min(1, (now - f.start) / 550);
        const e = 1 - Math.pow(1 - f.t, 3);
        v.x = f.sx + (f.tx - f.sx) * e;
        v.y = f.sy + (f.ty - f.sy) * e;
        v.zoom = f.sz * Math.pow(f.tz / f.sz, e);
        if (f.t >= 1) { v.x = f.tx; v.y = f.ty; v.zoom = f.tz; fly.current = null; }
        moving = true;
      }
      clamp();
      if (moving || dirty.current) { draw(); dirty.current = false; }
      animating.current = moving;
      raf = requestAnimationFrame(loop);
    };
    const fitZoom = () => {
      const { w, h } = size.current;
      return Math.min(w / (worldBounds.maxX - worldBounds.minX), h / (worldBounds.maxY - worldBounds.minY)) * 0.9;
    };
    const clamp = () => {
      const v = vp.current;
      v.zoom = Math.min(MAX_ZOOM, Math.max(Math.max(MIN_ZOOM_ABS, Math.min(0.12, fitZoom())), v.zoom));
      v.x = Math.min(worldBounds.maxX, Math.max(worldBounds.minX, v.x));
      v.y = Math.min(worldBounds.maxY, Math.max(worldBounds.minY, v.y));
    };
    raf = requestAnimationFrame(loop);

    // ---- pointer interaction
    const dragging = { current: false };
    const pointers = new Map<number, { x: number; y: number }>();
    let lastPt = { x: 0, y: 0, t: 0 };
    let downPt = { x: 0, y: 0 };
    let pinchDist = 0;
    let moved = false;

    const screenToWorld = (sx: number, sy: number) => {
      const { w, h } = size.current; const v = vp.current;
      return [(sx - w / 2) / v.zoom + v.x, (sy - h / 2) / v.zoom + v.y] as const;
    };
    const hitTest = (sx: number, sy: number) => {
      const [wx, wy] = screenToWorld(sx, sy);
      let best: (typeof drawn.current)[number] | null = null;
      let bestD = Infinity;
      for (const d of drawn.current) {
        const dx = d.x - wx, dy = d.y - wy;
        const dist = Math.hypot(dx, dy);
        if (dist <= d.r * 1.25 && dist < bestD) { bestD = dist; best = d; }
      }
      return best;
    };
    const rel = (e: PointerEvent | WheelEvent | MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      const p = rel(e);
      pointers.set(e.pointerId, p);
      if (pointers.size === 1) {
        dragging.current = true; moved = false;
        lastPt = { ...p, t: performance.now() }; downPt = p;
        velocity.current = { x: 0, y: 0 };
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      }
      canvas.focus();
    };
    const onMove = (e: PointerEvent) => {
      const p = rel(e);
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, p);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist > 0) {
          const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
          zoomAt(cx, cy, d / pinchDist);
        }
        pinchDist = d;
        moved = true;
        return;
      }
      if (dragging.current) {
        const now = performance.now();
        const dx = p.x - lastPt.x, dy = p.y - lastPt.y;
        const v = vp.current;
        v.x -= dx / v.zoom; v.y -= dy / v.zoom;
        const dt = Math.max(1, now - lastPt.t) / 1000;
        velocity.current = { x: dx / dt * 0.9, y: dy / dt * 0.9 };
        lastPt = { ...p, t: now };
        if (Math.hypot(p.x - downPt.x, p.y - downPt.y) > 4) moved = true;
        clamp(); requestRender();
      } else {
        const hit = hitTest(p.x, p.y);
        if (hit) {
          const text = hit.m ? hit.m.name : nodeById.get(hit.nodeId!)?.name ?? "";
          setHover({ x: p.x, y: p.y, text });
          canvas.style.cursor = "pointer";
        } else { setHover(null); canvas.style.cursor = "grab"; }
      }
    };
    const onUp = (e: PointerEvent) => {
      const p = rel(e);
      pointers.delete(e.pointerId);
      if (pointers.size === 0) {
        dragging.current = false;
        if (!moved) {
          const hit = hitTest(p.x, p.y);
          if (hit?.m) onSelect(hit.m);
          else if (hit?.nodeId) onSelectNode?.(hit.nodeId);
          else {
            const [wx, wy] = screenToWorld(p.x, p.y);
            const area = vp.current.zoom < 0.85 ? areas.find((a) => pointInPolygon(wx, wy, a.shape)) : undefined;
            if (area) onSelectArea?.(area.id); else onSelect(null);
          }
        }
      }
    };
    const zoomAt = (sx: number, sy: number, factor: number) => {
      const v = vp.current;
      const [wx, wy] = screenToWorld(sx, sy);
      v.zoom = Math.min(MAX_ZOOM, Math.max(Math.max(MIN_ZOOM_ABS, Math.min(0.12, fitZoom())), v.zoom * factor));
      const { w, h } = size.current;
      v.x = wx - (sx - w / 2) / v.zoom;
      v.y = wy - (sy - h / 2) / v.zoom;
      clamp(); requestRender();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = rel(e);
      const factor = Math.pow(1.0018, -e.deltaY * (e.deltaMode === 1 ? 20 : 1));
      zoomAt(p.x, p.y, factor);
    };
    const onDbl = (e: MouseEvent) => { const p = rel(e); zoomAt(p.x, p.y, 1.8); };
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "a", "s", "d", "w", "=", "+", "-", "_"].includes(e.key)) {
        keys.current.add(e.key); e.preventDefault();
      } else if (e.key === "Escape") onSelect(null);
      else if (e.key === "f" || e.key === "F") {
        const { w, h } = size.current;
        const zw = w / (worldBounds.maxX - worldBounds.minX), zh = h / (worldBounds.maxY - worldBounds.minY);
        fly.current = { tx: (worldBounds.minX + worldBounds.maxX) / 2, ty: (worldBounds.minY + worldBounds.maxY) / 2, tz: Math.min(zw, zh) * 0.98, t: 0, sx: vp.current.x, sy: vp.current.y, sz: vp.current.zoom, start: performance.now() };
      }
    };
    const onKeyUp = (e: KeyboardEvent) => { keys.current.delete(e.key); };
    const onBlur = () => keys.current.clear();

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("dblclick", onDbl);
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("blur", onBlur);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("dblclick", onDbl);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("blur", onBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
