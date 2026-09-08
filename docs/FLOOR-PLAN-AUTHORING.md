# Authoring a floor plan

One file per area in `src/data/areamaps/<areaId>.ts`, exporting a default `AreaMap` (types in `src/data/types.ts`). Read `majula.ts`, `heides.ts` and `iron_keep.ts` first: they are the reference for style and density.

## Rules that the checker enforces

`npx tsx scripts/plancheck.ts src/data/areamaps/<areaId>.ts` must print `✓ OK`.

- `areaId` matches the area's id in `src/data/areas/*.ts` (the `const A = "..."` at the top, or `J`/`O`/`V`/`G`/`O`/`F` in the multi-area files `memories.ts` and `ivory_small.ts`).
- **Every routing node of the area** (`node(A, "<id>", ...)` calls in the area file) has an entry in `positions`, and that position lies **inside a room outline on that floor**. Nodes of other areas must not appear.
- Every room outline has 3+ points and stays inside `[0, width] x [0, height]`.
- Line features (stairs, fog, door, locked-door, illusory-wall, drop, bridge) have 2+ points; `toFloor` targets exist; notes have a label.
- `references` is non-empty.

## Conventions

- Local space: x right, y down, roughly **one unit per metre**. Typical maps are 300 to 460 units wide. Pick `width`/`height` to fit with ~10 units of margin.
- **Floors**: one `Floor` per distinct level the player experiences as "up" or "down". `level` is higher for higher floors; the UI lists them top to bottom. Small areas are one floor. Vertical areas (towers, pits, keeps) get 2 to 4 floors. The floor with the most bonfires opens first. Give floors short names ("Ground", "Upper", "Cells", "Rooftops", "Lava field").
- **Rooms** (`room(id, kind, outline, name?)`): the walkable outlines. Kinds: `interior` (built rooms and halls), `open` (courtyards, platforms, paths outdoors), `ruin`, `water`, `lava`, `void` (pit shafts, chasms). Use `rect`, `circle` and `strip(points, width)` (a corridor / path / bridge / stream around a polyline) from `helpers.ts`, or a hand-written polygon. Rooms are drawn in array order, so put large lava/water areas first and the platforms on top of them later. Names show at zoom; keep them short and give every meaningful room one. Corridors can be unnamed.
- **Features** (constructors in `helpers.ts`): `stairs(bottom, top, {to?, label?})`, `ladder(at, {to?, label?})`, `lift(at, {to?, label?})` (elevator), `fog(a, b, label?)` (boss fog / mist), `door(a, b, label?)`, `locked(a, b, label)` (any key / Pharros / event-gated door), `illusory(a, b, label?)`, `drop(from, to, {to?, label?})` (one-way drop), `lever(at, label)` (levers, contraptions, Pharros faces, wheels), `bridge(points, label?)`, `note(at, label)` (free text: exits to neighbouring areas as `→ Area name`, landmarks without a node). `to` is the destination floor id for stairs / ladders / lifts / drops that change floor; clicking the feature then switches floors. Same-floor stairs get no `to`.
- Every exit to another area gets a `note("→ Area")` at the edge of the map. Every boss fog gate gets a `fog`. Every locked / key door in the area's `features` list gets a `locked`. Every shortcut worth knowing gets a `door` or `ladder` with a label.
- **Node placement**: read the area file's `node(...)` list (names and notes say what the landmark is) and its `edge(...)` list (which nodes connect, and how: ladder, drop, elevator, one-way). The plan must make connected nodes adjacent and reachable in the drawn geometry, with the edge's kind visible as a feature (a ladder edge → a ladder feature between them). Bonfire and boss nodes sit at the centre of their room. Put the position on the room's centreline, not at the edge; strips are only `width/2` wide on each side of the polyline.
- Style: this is a **schematic**, not a survey. Recognisable topology, right relative sizes, right floor assignment, every landmark placed. Do not chase pixel accuracy.

## References

`docs/area-map-sources.json` lists, per `areaId`, the Kouryakubo (JP) sheet URLs and the Fextralife sheet. Download them into a scratch folder **outside the repo** and look at them to draw your own outline:

```bash
curl -s -L -A "Mozilla/5.0" -o /path/to/scratch/<areaId>_k.png "<kouryakubo url>"
```

Then open the PNG with the Read tool. Kouryakubo draws one outline per floor with dashed links between floors, numbered items, red drop arrows, and colour-coded doors; the legend is in Japanese, but the shapes are what matter. Fextralife's plate is low-resolution but English-labelled.

**Licence: both sources are reference-only.** Never copy, download into the repo, hotlink or embed them. Draw your own simplified outlines. Put the URLs you used in `references`. Add a `note` on the map saying what you simplified.

Combine the sheets with the area file's own prose (node `note`s, edge `note`s, item `howToReach`) and your own knowledge of the level. Where sheets and prose disagree, follow the area file (its edges define the graph the router uses).

## Multi-area map files

`memories.ts` defines `mem_jeigh`, `mem_orro`, `mem_vammar`; `ivory_small.ts` defines `grand_cath`, `old_chaos`, `frigid`. Each gets its own plan file all the same.

## Registering

Add the import and the array entry in `src/data/areamaps/index.ts`, then run `npx tsx scripts/validate.ts` and `npx tsx scripts/coverage.ts`.
