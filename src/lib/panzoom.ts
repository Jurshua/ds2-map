"use client";
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref, type RefObject } from "react";

/**
 * Pan / zoom / inertia / fly-to engine shared by the world canvas and the per-area floor plans.
 * The hook owns the viewport and all pointer, wheel and keyboard handling; the caller supplies a
 * draw function (which returns the clickable targets it drew) and click / hover callbacks.
 */

export interface Viewport { x: number; y: number; zoom: number }
export interface Bounds { minX: number; minY: number; maxX: number; maxY: number }

/** A clickable thing the draw function placed, in world coordinates. */
export interface HitTarget<T> { x: number; y: number; r: number; data: T }

export interface DrawArgs {
  ctx: CanvasRenderingContext2D;
  /** Canvas size in CSS pixels. */
  w: number;
  h: number;
  vp: Viewport;
  /** World-space rectangle currently on screen. */
  left: number;
  top: number;
  right: number;
  bottom: number;
  visible(x: number, y: number, pad?: number): boolean;
}

export interface PanZoomHandle {
  flyTo(x: number, y: number, zoom?: number): void;
  fit(): void;
  getViewport(): Viewport;
  requestRender(): void;
}

export interface PanZoomOptions<T> {
  bounds: Bounds;
  maxZoom: number;
  /** Smallest allowed zoom, given the zoom that would fit the bounds exactly. */
  minZoom(fitZoom: number): number;
  /** Zoom used by flyTo when none is given (never zooms out below the current zoom). */
  flyZoom: number;
  draw(a: DrawArgs): HitTarget<T>[];
  onClick(hit: T | null, wx: number, wy: number, vp: Viewport): void;
  hoverText(hit: T): string;
  onEscape?(): void;
}

export interface Hover { x: number; y: number; text: string }

const FIT_PAD = 0.98;

export function usePanZoom<T>(
  ref: Ref<PanZoomHandle>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  wrapRef: RefObject<HTMLDivElement | null>,
  opts: PanZoomOptions<T>,
): { hover: Hover | null; requestRender(): void } {
  const optsRef = useRef(opts);
  useEffect(() => { optsRef.current = opts; });
  const vp = useRef<Viewport>({ x: 0, y: 0, zoom: 1 });
  const size = useRef({ w: 1, h: 1, dpr: 1 });
  const dirty = useRef(true);
  const fly = useRef<{ tx: number; ty: number; tz: number; t: number; sx: number; sy: number; sz: number; start: number } | null>(null);
  const [hover, setHover] = useState<Hover | null>(null);
  const requestRender = useCallback(() => { dirty.current = true; }, []);

  const fitZoomRaw = () => {
    const { w, h } = size.current;
    const b = optsRef.current.bounds;
    return Math.min(w / (b.maxX - b.minX), h / (b.maxY - b.minY));
  };
  const startFly = (tx: number, ty: number, tz: number) => {
    fly.current = { tx, ty, tz, t: 0, sx: vp.current.x, sy: vp.current.y, sz: vp.current.zoom, start: performance.now() };
  };
  const fit = () => {
    const b = optsRef.current.bounds;
    startFly((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2, fitZoomRaw() * FIT_PAD);
  };

  useImperativeHandle(ref, () => ({
    flyTo(x, y, zoom) { startFly(x, y, zoom ?? Math.max(vp.current.zoom, optsRef.current.flyZoom)); },
    fit,
    getViewport: () => ({ ...vp.current }),
    requestRender,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    let drawn: HitTarget<T>[] = [];
    let needsFit = true;

    const snapFit = () => {
      const b = optsRef.current.bounds;
      vp.current = { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2, zoom: fitZoomRaw() * FIT_PAD };
    };
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { w: r.width, h: r.height, dpr };
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      canvas.style.width = r.width + "px";
      canvas.style.height = r.height + "px";
      if (needsFit && r.width > 0 && r.height > 0) { needsFit = false; snapFit(); }
      requestRender();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const minZoom = () => Math.max(1e-4, optsRef.current.minZoom(fitZoomRaw()));
    const clamp = () => {
      const v = vp.current;
      const b = optsRef.current.bounds;
      v.zoom = Math.min(optsRef.current.maxZoom, Math.max(minZoom(), v.zoom));
      v.x = Math.min(b.maxX, Math.max(b.minX, v.x));
      v.y = Math.min(b.maxY, Math.max(b.minY, v.y));
    };

    const draw = () => {
      const { w, h, dpr } = size.current;
      if (w <= 0 || h <= 0) return;
      const v = vp.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const z = v.zoom;
      const left = v.x - w / 2 / z, top = v.y - h / 2 / z, right = v.x + w / 2 / z, bottom = v.y + h / 2 / z;
      const visible = (x: number, y: number, pad = 60) => x > left - pad && x < right + pad && y > top - pad && y < bottom + pad;
      drawn = optsRef.current.draw({ ctx, w, h, vp: { ...v }, left, top, right, bottom, visible });
    };

    // ---- animation loop: keyboard pan, inertia, fly-to
    const keys = new Set<string>();
    const velocity = { x: 0, y: 0 };
    const dragging = { current: false };
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let moving = false;
      const v = vp.current;
      if (keys.size) {
        const sp = 700 / v.zoom * dt;
        if (keys.has("ArrowLeft") || keys.has("a")) { v.x -= sp; moving = true; }
        if (keys.has("ArrowRight") || keys.has("d")) { v.x += sp; moving = true; }
        if (keys.has("ArrowUp") || keys.has("w")) { v.y -= sp; moving = true; }
        if (keys.has("ArrowDown") || keys.has("s")) { v.y += sp; moving = true; }
        if (keys.has("=") || keys.has("+")) { v.zoom = Math.min(optsRef.current.maxZoom, v.zoom * (1 + 1.5 * dt)); moving = true; }
        if (keys.has("-") || keys.has("_")) { v.zoom = Math.max(minZoom(), v.zoom / (1 + 1.5 * dt)); moving = true; }
      }
      if (!dragging.current && (Math.abs(velocity.x) > 2 || Math.abs(velocity.y) > 2)) {
        v.x -= velocity.x * dt / v.zoom;
        v.y -= velocity.y * dt / v.zoom;
        const decay = Math.pow(0.004, dt);
        velocity.x *= decay; velocity.y *= decay;
        moving = true;
      } else if (!dragging.current) { velocity.x = 0; velocity.y = 0; }
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
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // ---- pointer interaction
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
      let best: HitTarget<T> | null = null;
      let bestD = Infinity;
      for (const d of drawn) {
        const dist = Math.hypot(d.x - wx, d.y - wy);
        if (dist <= d.r * 1.25 && dist < bestD) { bestD = dist; best = d; }
      }
      return best;
    };
    const rel = (e: PointerEvent | WheelEvent | MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const zoomAt = (sx: number, sy: number, factor: number) => {
      const v = vp.current;
      const [wx, wy] = screenToWorld(sx, sy);
      v.zoom = Math.min(optsRef.current.maxZoom, Math.max(minZoom(), v.zoom * factor));
      const { w, h } = size.current;
      v.x = wx - (sx - w / 2) / v.zoom;
      v.y = wy - (sy - h / 2) / v.zoom;
      clamp(); requestRender();
    };

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      const p = rel(e);
      pointers.set(e.pointerId, p);
      if (pointers.size === 1) {
        dragging.current = true; moved = false;
        lastPt = { ...p, t: performance.now() }; downPt = p;
        velocity.x = 0; velocity.y = 0;
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
        if (pinchDist > 0) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, d / pinchDist);
        pinchDist = d;
        moved = true;
        return;
      }
      if (dragging.current) {
        const now = performance.now();
        const dx = p.x - lastPt.x, dy = p.y - lastPt.y;
        const v = vp.current;
        v.x -= dx / v.zoom; v.y -= dy / v.zoom;
        const dt = Math.max(16, now - lastPt.t) / 1000;
        const vx = dx / dt * 0.45, vy = dy / dt * 0.45;
        const mag = Math.hypot(vx, vy), cap = 1400;
        if (mag > cap) { velocity.x = vx / mag * cap; velocity.y = vy / mag * cap; } else { velocity.x = vx; velocity.y = vy; }
        lastPt = { ...p, t: now };
        if (Math.hypot(p.x - downPt.x, p.y - downPt.y) > 4) moved = true;
        clamp(); requestRender();
      } else {
        const hit = hitTest(p.x, p.y);
        if (hit) {
          setHover({ x: p.x, y: p.y, text: optsRef.current.hoverText(hit.data) });
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
          const [wx, wy] = screenToWorld(p.x, p.y);
          optsRef.current.onClick(hit ? hit.data : null, wx, wy, { ...vp.current });
        }
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = rel(e);
      zoomAt(p.x, p.y, Math.pow(1.0018, -e.deltaY * (e.deltaMode === 1 ? 20 : 1)));
    };
    const onDbl = (e: MouseEvent) => { const p = rel(e); zoomAt(p.x, p.y, 1.8); };
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "a", "s", "d", "w", "=", "+", "-", "_"].includes(e.key)) {
        e.preventDefault();
        if (!keys.has(e.key)) {
          // immediate nudge so a single tap always moves a noticeable amount
          const v = vp.current; const step = 60 / v.zoom;
          if (e.key === "ArrowLeft" || e.key === "a") v.x -= step;
          if (e.key === "ArrowRight" || e.key === "d") v.x += step;
          if (e.key === "ArrowUp" || e.key === "w") v.y -= step;
          if (e.key === "ArrowDown" || e.key === "s") v.y += step;
          if (e.key === "=" || e.key === "+") v.zoom *= 1.15;
          if (e.key === "-" || e.key === "_") v.zoom /= 1.15;
          clamp(); requestRender();
        }
        keys.add(e.key);
      } else if (e.key === "Escape") optsRef.current.onEscape?.();
      else if (e.key === "f" || e.key === "F") fit();
    };
    const onKeyUp = (e: KeyboardEvent) => { keys.delete(e.key); };
    const onBlur = () => keys.clear();
    const onLeave = () => { setHover(null); };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);
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
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("dblclick", onDbl);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("blur", onBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { hover, requestRender };
}

/** Apply the world transform for drawing in world units (call inside ctx.save/restore). */
export function enterWorld(ctx: CanvasRenderingContext2D, a: DrawArgs) {
  ctx.translate(a.w / 2, a.h / 2);
  ctx.scale(a.vp.zoom, a.vp.zoom);
  ctx.translate(-a.vp.x, -a.vp.y);
}
