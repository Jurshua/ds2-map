# Detailed area maps — research, sources and references

**Researched 2026-09-07. Every URL in this document and in `area-map-sources.json` returned HTTP 200 when checked (88/88).**

This file exists so another agent can add per-area detailed maps to the guide without redoing the
source hunt. It is a research dossier, not an implementation plan — read the
[Licence position](#licence-position-read-this-first) section before you download anything.

Machine-readable companion: **`docs/area-map-sources.json`** — every source URL keyed by the
project's own area ids, with pixel dimensions. Parse that; don't retype URLs from this file.

---

## What "detailed maps" means here

The guide today renders a **schematic node-link graph**, not geography. `src/data/types.ts` gives
each `Area` a hand-authored `shape` polygon and a `label` anchor in an abstract world coordinate
space, and each `MapNode` an `x`/`y` in that same space. `MapCanvas.tsx` draws those polygons and
the `Edge` list between nodes. Nothing in the app is derived from real level geometry, and there is
no raster layer of any kind — `public/` holds only the four stock Next.js SVGs.

So "detailed maps of each area" means adding a **second, per-area representation**: a floor-plan
view of one location showing rooms, levels, stairs, ladders, elevators, fog gates, shortcuts and
item positions, that the user drills into from the world graph. That is a new layer, not an edit to
the existing one. The existing schematic remains the right thing for routing; the detailed map is
for "where in Iron Keep is that chest".

---

## Bottom line

Three usable classes of source exist, and they trade off almost perfectly against each other:

| | Coverage | Quality | Licence |
| --- | --- | --- | --- |
| **Kouryakubo (JP)** | 45/45 areas | Best available | Explicitly restricted |
| **Fextralife** | 33/45 areas | Low-res (565×565) | Restricted (Valnet, all rights reserved) |
| **Derive from game geometry** | 45/45 areas | As good as you build | Clean — your own work |

There is **no free-to-reuse set of DS2 area maps on the internet.** The one source that is openly
licensed (wiki.gg, CC BY-SA 4.0) turns out to have no maps at all — verified, see
[Dead ends](#dead-ends-verified-so-you-dont-repeat-them).

**Recommendation:** use Kouryakubo and Fextralife as *reference material to draw from*, and produce
original maps. For a personal-use local guide, embedding the wiki images is a low-risk shortcut and
gets you a working feature in an afternoon; for anything published, it is not defensible. Decide
which of those two you are building before writing code — the answer changes the whole approach.

---

## Licence position (read this first)

**Kouryakubo — restricted, and says so on the image.** Every map sheet carries a footer stamp:
`© DARK SOULS 2 攻略簿 マップ付 Wiki  www.kouryakubo.com/darksouls2/  Don't copy all kouryakubo's maps.`
That is an explicit no-redistribution notice baked into the artwork. Do not mirror these files into
`public/`, do not hotlink them, do not crop the notice off. They are excellent to *look at* while
drawing your own.

**Fextralife — restricted by default.** The wiki is owned by Valnet Inc. and publishes no Creative
Commons licence for wiki images; its terms reserve reuse rights and specifically prohibit automated
collection and redistribution of site content. `fextralife.com/wiki-license/` exists but states no
actual licence terms. Copyright contact is `legal@valnetinc.com` if you want to ask.

**wiki.gg — CC BY-SA 4.0**, and the only openly licensed source found. It has no maps, but its
1920×1080 in-engine area screenshots are reusable with attribution and share-alike, which makes it
the right source for area header/hero imagery.

**Derived from game geometry — your own work.** A top-down render you produce from the game's own
map files is a derivative of FromSoftware's assets, which is the same footing every Souls wiki map
in existence stands on. This is the only route that is simultaneously complete, accurate, and not
someone else's drawing.

Nothing here is legal advice; it is a summary of what each source actually states.

---

## Source A — Kouryakubo (JP): the best maps that exist

<http://www.kouryakubo.com/darksouls2/> — "ダークソウル2 攻略簿 マップ付 Wiki" (map-included strategy wiki).

**Complete coverage: all 45 project areas across 49 sheets**, including all three DLCs — the only
source found that covers Brume Tower, Iron Passage, Memory of the Old Iron King, Frozen Eleum Loyce,
Grand Cathedral, Old Chaos, Cave of the Dead, Dragon's Rest, Belfry Sol, Shrine of Winter, Throne of
Want and Lord's Private Chamber at all.

Quality is genuinely high and well above the English wikis. Sheets are clean vector-style plans that
separate each floor into its own outline and connect them with dashed traversal lines. They mark:

- numbered item pickups keyed to a side list
- bonfires, ladders, elevators (lettered A–K where an elevator has multiple stops)
- fog doors vs. normal doors vs. hidden doors, colour-coded
- **drop directions** (red arrows) — the thing English maps consistently omit
- switch-and-door pairs, illusory walls, and destructible objects
- enemy icons distinguishing respawning from non-respawning

Resolutions run 356×170 to 2040×1151; the median is around 640×500. Filenames follow
`map<NN>_<name>.png` — `map01`–`map36` base game, `map1xx` Sunken King, `map2xx` Old Iron King,
`map3xx` Ivory King. Two filenames are misspelled at source: `map22_loadsprivatechamber.png`
("loads" for "lords") and `map304_frgidoutskirts.png` ("frgid" for "frigid").

Page names are EUC-JP hex-encoded, e.g. Brume Tower is `B9F5CCB8A4CEC5E3.html`. The site is a
PukiWiki; fetch pages with a browser UA and decode as EUC-JP, not UTF-8.

Largest and most detailed sheets: `map304_frgidoutskirts` 2040×1151, `map301_frozeneleumloyce`
1192×994, `map19_shadedwoods` 1003×737, `map201_brumetower` 977×820, `map03_forestoffallengiant`
915×745.

## Source B — Fextralife: English, complete legend, low resolution

<https://darksouls2.wiki.fextralife.com/Maps> — 26 area sheets covering 33 of 45 areas.

Style is a dark plate with the level plan on the right and a numbered item legend down the left,
plus icons for ladder / jump / bonfire / boss / fog door / locked door / no-return door. Sheets are
labelled "MAP 1" but no area has a second sheet — that numbering goes nowhere.

**The real limitation is resolution.** Every area sheet is 565×565, and the legend eats roughly 40%
of the width, so the actual plan is about 350×450 px. There is no higher-resolution original: the
`565px` in the filename *is* the upload, `/thumb/` variants only go smaller, and the file description
pages 404. At that size the plans do not survive zooming, which is most of the point of a detail map.

Four areas have no sheet of their own and reuse a neighbour's, which is worth knowing before you wire
up per-area assets: **Black Gulch** → The Gutter map, **Belfry Luna** → Lost Bastille map,
**Cathedral of Blue** → Heide's map, **Undead Purgatory** → Huntsman's Copse map.

Twelve areas have nothing at all — Belfry Sol, Lord's Private Chamber, Shrine of Winter, Throne of
Want, and every area of the Old Iron King and Ivory King DLCs except Frigid Outskirts.

Genuinely useful at full size, unlike the area sheets, are the overview maps: the bonfire map at
2722×1282 and the Drangleic world map at 2100×1600. The eight legend icons (`Icon_00`–`Icon_07`,
~35×33) are also catalogued in the JSON — useful as a reference for what symbol vocabulary a DS2
map is expected to have, even if you draw your own.

## Source C — derive from game geometry (the clean route)

This is the only path to maps that are original, accurate, complete, and coordinate-true — and
coordinate-true matters, because it is what lets markers be placed by data instead of by hand.

Tooling, all MIT-licensed:

- **Smithbox** — <https://github.com/vawser/Smithbox> — actively maintained, best DS2 support.
- **DSMapStudio** — <https://github.com/soulsmods/DSMapStudio> — the original; stable for DS2.
- **UXM** — <https://www.nexusmods.com/sekiro/mods/26> — required to unpack the game first.

Note: **only Scholar of the First Sin is supported**; vanilla DS2 is not. Params must be decrypted
before use.

Two assets in the Smithbox repo are immediately useful even without running the tool, because they
are plain JSON you can fetch right now:

- **`Assets/Aliases/DS2S/MapNames.json`** — the map-id ↔ area-name table. 30 shipped maps plus
  several tagged `unused` (a "Shrine of Amana (alt)", a "Drangleic Castle (alt)", a "Mausoleum", a
  "Firelink Throne"). Note that FromSoftware packs several of the guide's separate areas into one
  map file: `m10_16_00_00` is "The Lost Bastille & Belfry Luna", `m10_17_00_00` is "Harvest Valley &
  Earthen Peak", `m10_19_00_00` is "Iron Keep & Belfry Sol", `m10_23_00_00` is "Huntsman's Copse &
  Undead Purgatory", `m10_25_00_00` is "The Gutter & Black Gulch". **The engine's area boundaries do
  not match the wiki's**, which is exactly why the English wikis share sheets between those pairs.
  Plan for one render per map file, cropped into per-area views.
- **`Assets/PARAM/DS2S/Param Row Names/English/`** — per-map param row names, including
  `treasureboxparam_m*.json` (chests), `hitgroupparam_m*.json` and `maptargetdirparam_m*.json`.
  Named, machine-readable, per-map.

The workflow is: UXM-unpack SotFS → open the map in Smithbox → set an orthographic top-down camera →
render per floor → trace or use directly as an underlay → read exact world positions for chests,
bonfires and enemies out of the MSB and the params. That last step is the prize: it turns marker
placement from manual pixel-pushing into a data join.

Cost is honest: this needs a SotFS install, ~30 GB unpacked, and a day of tool wrangling before the
first usable render. It is the right investment only if the detailed maps are meant to be a real
feature rather than a nice-to-have.

---

## Coverage matrix

All 45 areas in `src/data/areas/`, checked against both wikis. Kouryakubo dimensions are as served.

| Area | id | DLC | Kouryakubo sheet (px) | Fextralife |
| --- | --- | --- | --- | --- |
| Dragon Aerie | `aerie` | — | `map30_dragonaerie` 741x448 | 565x565 |
| Aldia's Keep | `aldias` | — | `map29_aldiaskeep` 665x716 | 565x565 |
| Shrine of Amana | `amana` | — | `map27_shrineofamana` 804x887 | 565x565 |
| The Lost Bastille | `bastille` | — | `map07_lostbastille` 749x496 | 565x565 |
| Belfry Luna | `belfry_luna` | — | `map08_belfryluna` 414x292 | shared sheet |
| Belfry Sol | `belfry_sol` | — | `map15_belfrysol` 392x283 | — none — |
| Cathedral of Blue | `cathedral_blue` | — | `map05_cathedralofblue` 465x272 | shared sheet |
| Dark Chasm of Old | `chasm` | — | `map25_darkchasmofoldest` 826x353 | 565x565 |
| Huntsman's Copse | `copse` | — | `map10_huntsmanscopse` 806x686 | 565x565 |
| Undead Crypt | `crypt` | — | `map28_undeadcrypt` 609x506 | 565x565 |
| Drangleic Castle | `drangleic` | — | `map24_drangleiccastle` 643x636<br>`map26_kingspassage` 370x395<br>`map405_memoryoftheking` 369x211 | 565x565 |
| Dragon Shrine | `dshrine` | — | `map31_dragonshrine` 476x895 | 565x565 |
| Earthen Peak | `earthen` | — | `map13_earthenpeak` 605x603 | 565x565 |
| Forest of Fallen Giants | `fofg` | — | `map03_forestoffallengiant` 915x745 | 565x565 |
| Grave of Saints | `grave_saints` | — | `map16_graveofsaints` 702x421 | 565x565 |
| Black Gulch | `gulch` | — | `map18_blackgulch` 417x453 | shared sheet |
| The Gutter | `gutter` | — | `map17_thegutter` 662x587 | 565x565 |
| Harvest Valley | `harvest` | — | `map12_harvestvalley` 626x390 | 565x565 |
| Heide's Tower of Flame | `heides` | — | `map04_heide'stowerofflame` 643x757 | 565x565 |
| Iron Keep | `iron_keep` | — | `map14_ironkeep` 776x493 | 565x565 |
| Lord's Private Chamber | `lords_chamber` | — | `map22_loadsprivatechamber` 356x170 | — none — |
| Majula | `majula` | — | `map02_madura` 732x695<br>`map02_madura_holl` 725x378 | 565x565 |
| Memory of Jeigh | `mem_jeigh` | — | `map35_memoryofjeigh` 505x215<br>`map32_dragonmemories` 355x253 | 565x565 |
| Memory of Orro | `mem_orro` | — | `map33_memoryoforro` 656x303<br>`map32_dragonmemories` 355x253 | 565x565 |
| Memory of Vammar | `mem_vammar` | — | `map34_memoryofvammar` 360x515<br>`map32_dragonmemories` 355x253 | 565x565 |
| Doors of Pharros | `pharros` | — | `map20_doorsofpharos` 637x510 | 565x565 |
| Undead Purgatory | `purgatory` | — | `map11_undeadpurgatory` 509x272 | shared sheet |
| Shaded Woods | `shaded` | — | `map19_shadedwoods` 1003x737 | 565x565 |
| Sinners' Rise | `sinners_rise` | — | `map09_sinnersrise` 384x605 | 565x565 |
| Things Betwixt | `things_betwixt` | — | `map01_betwixt` 689x463 | 565x565 |
| Throne of Want | `throne` | — | `map36_throneofwant` 387x660 | — none — |
| Brightstone Cove Tseldora | `tseldora` | — | `map21_brightstonecovetseldora` 678x752 | 565x565 |
| No-man's Wharf | `wharf` | — | `map06_nomanswharf` 604x537 | 565x565 |
| Shrine of Winter | `winter` | — | `map23_shrineofwinter` 478x301 | — none — |
| Brume Tower | `brume` | iron | `map201_brumetower` 977x820 | — none — |
| Iron Passage | `iron_passage` | iron | `map202_ironpassage` 370x402 | — none — |
| Memory of the Old Iron King | `mem_oik` | iron | `map203_memoryoftheoldironking` 487x353 | — none — |
| Frozen Eleum Loyce | `eleum` | ivory | `map301_frozeneleumloyce` 1192x994 | — none — |
| Frigid Outskirts | `frigid` | ivory | `map304_frgidoutskirts` 2040x1151 | 565x565 |
| Grand Cathedral | `grand_cath` | ivory | `map302_grandcathedral` 357x358 | — none — |
| Old Chaos | `old_chaos` | ivory | `map303_theoldchaos` 356x269 | — none — |
| Cave of the Dead | `cave_dead` | sunken | `map104_caveofthedead` 490x338 | — none — |
| Dragon's Rest | `drest` | sunken | `map103_dragonsrest` 394x556 | — none — |
| Dragon's Sanctum | `sanctum` | sunken | `map102_dragonssanctrum` 867x679 | 565x565 |
| Shulva, Sanctum City | `shulva` | sunken | `map101_shulvasanctumcity` 464x662 | 565x565 |

Totals: Kouryakubo 45/45 areas (49 sheets). Fextralife 29 dedicated sheets, 4 areas on a shared
sheet, 12 areas absent.

---

## Dead ends (verified, so you don't repeat them)

- **Map Genie** — `mapgenie.io/dark-souls-2` returns **404**. Map Genie covers Elden Ring and DS3
  but has never made a DS2 map. Search results claiming otherwise are wrong.
- **wiki.gg (`darksouls2.wiki.gg`)** — **no maps.** This one looks promising because it is CC BY-SA
  4.0 and its area pages carry a big 1920×1080 image, but that image is an in-engine *screenshot*,
  not a map (confirmed by opening `Forest_of_Fallen_Giants.png`). A File-namespace search for "map"
  returns exactly one hit, an achievement icon. Excellent source for area photography; useless for
  cartography.
- **Steam guide "SotFS Map and Progress Guide"** (id 1920468189) — one world map, no area maps, and
  the guide has been removed from Steam for a guidelines violation.
- **`darksouls2.wikidot.com`** — area pages exist (`/forest-of-fallen-giants`) but `/maps` 404s;
  it is the old pre-Fextralife wiki and its images are the same low-res set or worse.
- **Fandom `Special:AllMaps`** — the interactive-map feature is enabled but no DS2 maps have been
  authored in it.
- **noclip.website** — could not confirm DS2 support. Its Dark Souls viewer is DS1; secondary
  sources claiming DS2 are unreliable and the site's game list would not load for scraping. Worth
  five minutes of manual checking, not more.
- **gamerguides.com/dark-souls-2/maps** — returns 200 in a browser but 403s to fetchers; it is a
  paywalled commercial guide either way.
- **Future Press *Dark Souls II Collector's Edition Guide*** (ISBN 9783869930671) — by reputation
  the best DS2 maps ever drawn, 450+ pages. Out of print, print-only, fully copyrighted. Listed
  because it is genuinely the best visual reference if you own a copy; not a source you can pull from.

## Data sources that are not maps but help

- **`quacksouls/ds2-walkthrough`** — <https://github.com/quacksouls/ds2-walkthrough> — a beginner
  SotFS walkthrough in Markdown with images, **CC BY-NC-SA 4.0**. Reusable non-commercially with
  attribution and share-alike. Ordered route prose, not maps.
- **`xenevel/dark-souls-2-sotfs-cheat-sheet`** — <https://github.com/xenevel/dark-souls-2-sotfs-cheat-sheet>
  — a SotFS location checklist as a static site. **No licence declared**, so treat as all-rights-reserved.
- **`darksouls2.wiki.gg` MediaWiki API** — `https://darksouls2.wiki.gg/api.php` is open; use
  `action=query&list=allimages&aiprop=url|size` to enumerate. CC BY-SA 4.0.

---

## Implementation notes

Sketched from reading the code, not built — the next agent owns the design.

**Aligning a map image to existing data.** The guide already knows where things are in its own
abstract coordinate space, and a floor plan knows where things are in pixels. Rather than
re-authoring positions, treat this as georeferencing: pick 3+ control points visible in both (the
area's bonfires are ideal, since every one is already a `MapNode` with an id and an `x`/`y`), solve
an affine transform, and derive the rest. Where the two disagree, the existing node coordinates are
schematic and the image is real — so the transform should map *image → new per-area space*, and the
existing world coordinates should stay untouched for routing.

**Do not reuse the world coordinate space for detail maps.** `MapNode.x/y` are positions in a
single hand-laid-out world diagram; they carry no intra-area geometry. A detail map needs its own
local space per area, plus a floor/level index, because most DS2 areas are vertical and a single
plane cannot represent Iron Keep or Brume Tower honestly. Kouryakubo's solution — one outline per
floor, dashed lines for the connections between them — is worth copying as a model.

**Suggested shape of the addition**, consistent with how `types.ts` is written today:

- a new `AreaMap` record per area: image or vector ref, pixel dimensions, floor list, and the
  affine transform to local coordinates
- `MapNode` gains an optional `{ mapX, mapY, floor }` — optional so nothing breaks while coverage
  is partial, which matters because this will land area-by-area
- keep the existing `source` URL discipline: every map record should carry where its geometry came
  from, exactly as every item record already does

**Scale of the job.** 45 areas, most multi-floor. Coverage will be partial for a long time, so build
the UI to degrade gracefully to the current schematic view rather than assuming every area has a map.

**Verify with the existing scripts.** `npx tsx scripts/validate.ts` and `scripts/routetest.ts` must
still pass after any data-model change; `scripts/coverage.ts` regenerates `COVERAGE.md`.

---

## Reproducing this research

```bash
# every catalogued URL, re-checked
node -e 'const d=require("./docs/area-map-sources.json");const u=new Set();for(const a of d.areas){a.kouryakubo.forEach(k=>u.add(k.url));if(a.fextralife)u.add(a.fextralife.url)}console.log([...u].join("\n"))' \
  | while read -r x; do echo "$(curl -s -o /dev/null -w '%{http_code}' -L -A 'Mozilla/5.0' "$x") $x"; done
```

Kouryakubo pages are EUC-JP and hex-encoded; to re-enumerate its sheets, fetch
`http://www.kouryakubo.com/darksouls2/`, decode EUC-JP, follow every `/darksouls2/[A-F0-9]+\.html`
link, and grep each page for `image/maps/[^"]+\.png`.

Fextralife image URLs are content-addressed (`/file/darksouls2/<a>/<ab>/<Name>.png`) and stable;
`/thumb/.../NNNpx-Name.png` variants are downscales of the same file.
