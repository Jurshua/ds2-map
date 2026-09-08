# Dark Souls II: Scholar of the First Sin — Interactive World Map

An original, schematic top-down map of Drangleic (base game + the three Lost Crowns DLCs) built with Next.js (App Router, TypeScript, Tailwind) and a hand-written Canvas renderer.

```bash
npm install
npm run dev      # http://localhost:3000 (the .claude/launch.json entry uses port 3111)
npm run build    # production build
npm run lint
```

## What it does

- Every SotFS area drawn as a stylised region (no copyrighted map images), laid out to respect the game's real spatial relationships (Majula hub, Forest / Heide's / Copse / Shaded Woods radiating out, Drangleic Castle beyond the Shrine of Winter, Black Gulch below The Gutter, DLC clusters hanging off their obelisks).
- Markers with distinct icons and a legend for bonfires (incl. Primal), all 41 bosses (required vs optional, DLC), item pickups with a "how to reach" note, NPCs / merchants / summons, covenants, Pharros' contraptions, shortcuts, locked doors (with the key required), illusory walls and farmable enemies (drops, rates where documented, best spots, despawn / Bonfire Ascetic / Company of Champions notes).
- Graph-based routing (Dijkstra in `src/lib/graph.ts`): nodes are bonfires, landmarks and boss arenas; edges carry gating metadata (keys, Fragrant Branches, Pharros' Lockstones, boss kills, one-way drops, shortcuts) and optional bonfire warping. Pick a start (any marker or bonfire), then a destination class: nearest bonfire / boss / merchant, a specific boss, a farmable item's best spot, or any marker.
- Fuzzy search, category filters, DLC toggle, per-browser "collected" checklist (localStorage) with a "show only what I haven't collected" filter, details panel with prerequisites and source link, keyboard navigation (WASD / arrows / +/- / F / Escape, `/` focuses search), touch/pinch support, LOD clustering at low zoom.

## Data

All game data is typed TypeScript under `src/data/` — one file per area in `src/data/areas/`, farmable enemies in `src/data/enemies.ts`, types in `src/data/types.ts`. Every record has a `source` URL (Fextralife SotFS pages first, wikidot for cross-checks; disagreements are noted in `note` fields). `COVERAGE.md` lists per-area counts and is regenerated with `npx tsx scripts/coverage.ts`; `npx tsx scripts/validate.ts` checks that every node/area reference resolves.

Map coordinates are schematic: each area has an origin and a polygon; landmarks sit inside the polygon and item markers are scattered deterministically around the landmark they belong to.

## Floor plans

Some areas also have a per-area floor plan (`src/data/areamaps/`, one file per area, registered in `src/data/areamaps/index.ts`). A plan is an `AreaMap`: its own local coordinate space (x right, y down, roughly one unit per metre), a list of floors ordered by `level`, and a `positions` table that places every routing node of the area on a floor. Each floor holds `Room` outlines (interior / open / ruin / water / lava / void) and `FloorFeature`s (stairs, ladders, elevators, fog doors, doors, locked doors, illusory walls, one-way drops, levers, bridges, free-text notes). Features with a `toFloor` are clickable and switch floors.

Because items, bonfires, bosses, NPCs and features already key to a node, they inherit a plan position automatically; nothing has to be re-placed. Open a plan from the Areas tab (`plan`), from a marker's details (`Floor plan`), or from the chip that appears on the world map when the selected marker's area has one. `[` and `]` move between floors.

Plans are original schematics traced against reference sheets from the wikis (linked in each plan's `references`; nothing external is embedded or hotlinked; see `docs/AREA-MAPS-RESEARCH.md` for the licence position). Authoring helpers live in `src/data/areamaps/helpers.ts` (`rect`, `circle`, `strip` for corridors, and one constructor per feature kind). `npx tsx scripts/validate.ts` checks that every node of a mapped area has a position inside a room of an existing floor, that `toFloor` targets exist, and that outlines stay inside the map bounds.
