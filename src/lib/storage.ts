"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";

/** Subscribe to a localStorage key (same-tab writes dispatch a custom event). */
function useLocalStorageRaw(key: string): { raw: string | null | undefined; write(v: string): void } {
  const subscribe = useCallback((cb: () => void) => {
    const ev = "ds2map:" + key;
    window.addEventListener("storage", cb);
    window.addEventListener(ev, cb);
    return () => { window.removeEventListener("storage", cb); window.removeEventListener(ev, cb); };
  }, [key]);
  const getSnapshot = useCallback(() => {
    try { return localStorage.getItem(key); } catch { return null; }
  }, [key]);
  const getServerSnapshot = useCallback(() => undefined, []);
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const write = useCallback((v: string) => {
    try { localStorage.setItem(key, v); } catch { /* storage unavailable */ }
    window.dispatchEvent(new Event("ds2map:" + key));
  }, [key]);
  return { raw, write };
}

const KEY = "ds2map.collected.v1";

/** Per-browser checklist of collected item ids, persisted in localStorage. */
export function useCollected() {
  const { raw, write } = useLocalStorageRaw(KEY);
  const collected = useMemo(() => {
    if (!raw) return new Set<string>();
    try {
      const arr = JSON.parse(raw);
      return new Set<string>(Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []);
    } catch { return new Set<string>(); }
  }, [raw]);
  const persist = useCallback((next: Set<string>) => write(JSON.stringify([...next])), [write]);
  const toggle = useCallback((id: string) => {
    const next = new Set(collected);
    if (next.has(id)) next.delete(id); else next.add(id);
    persist(next);
  }, [collected, persist]);
  const setMany = useCallback((ids: string[], value: boolean) => {
    const next = new Set(collected);
    for (const id of ids) { if (value) next.add(id); else next.delete(id); }
    persist(next);
  }, [collected, persist]);
  const clear = useCallback(() => persist(new Set()), [persist]);
  return { collected, toggle, setMany, clear, loaded: raw !== undefined };
}

export function usePersistedState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const { raw, write } = useLocalStorageRaw(key);
  const value = useMemo<T>(() => {
    if (raw == null) return initial;
    try { return JSON.parse(raw) as T; } catch { return initial; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);
  const set = useCallback((v: T | ((p: T) => T)) => {
    const next = typeof v === "function" ? (v as (p: T) => T)(value) : v;
    write(JSON.stringify(next));
  }, [value, write]);
  return [value, set];
}
