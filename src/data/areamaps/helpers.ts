import type { Pt, Room, RoomKind, FloorFeature, NodePlacement } from "../types";
export { rect, circle, strip } from "./geom";

export function room(id: string, kind: RoomKind, outline: Pt[], name?: string): Room {
  return { id, kind, outline, name };
}

export const pos = (x: number, y: number, floor: string): NodePlacement => ({ x, y, floor });

type Extra = { to?: string; label?: string };
const f = (kind: FloorFeature["kind"], pts: Pt[], extra: Extra = {}): FloorFeature => ({ kind, pts, label: extra.label, toFloor: extra.to });

/** Stairs from the bottom point to the top point. */
export const stairs = (from: Pt, to: Pt, extra?: Extra) => f("stairs", [from, to], extra);
/** Ladder icon at a point (optionally oriented toward a second point). */
export const ladder = (at: Pt, extra?: Extra) => f("ladder", [at], extra);
export const lift = (at: Pt, extra?: Extra) => f("elevator", [at], extra);
export const fog = (a: Pt, b: Pt, label?: string) => f("fog", [a, b], { label });
export const door = (a: Pt, b: Pt, label?: string) => f("door", [a, b], { label });
export const locked = (a: Pt, b: Pt, label: string) => f("locked-door", [a, b], { label });
export const illusory = (a: Pt, b: Pt, label?: string) => f("illusory-wall", [a, b], { label });
/** One-way drop from a ledge to a landing. */
export const drop = (from: Pt, to: Pt, extra?: Extra) => f("drop", [from, to], extra);
export const lever = (at: Pt, label: string) => f("lever", [at], { label });
export const bridge = (pts: Pt[], label?: string) => f("bridge", pts, { label });
/** Free text placed on the plan (exits, landmarks that have no node). */
export const note = (at: Pt, label: string) => f("note", [at], { label });
