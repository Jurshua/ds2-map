import { finalize, it, node, edge, req, FEX } from "../helpers";
import type { AreaBundle } from "../helpers";

// ---------- Grand Cathedral ----------
const G = "grand_cath";
const GSRC = FEX + "Grand+Cathedral";
const ig = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(G, name, cat, n, how, extra);

export const grandCathedral: AreaBundle = finalize([6550, 400], {
  area: {
    id: G,
    name: "Grand Cathedral",
    dlc: "ivory",
    shape: [[-180, -100], [120, -120], [220, 0], [150, 110], [-150, 120], [-240, 10]],
    label: [0, -70],
    description: "The Ivory King's cathedral built over the Old Chaos, opened with the Frozen Flower. Alsanna, Silent Oracle, waits at the end of the red carpet; agreeing to help her melts the ice across Eleum Loyce and opens the drop into the Old Chaos.",
    connections: ["eleum", "old_chaos"],
    recommendedLevel: "DLC (130+)",
    source: GSRC,
  },
  nodes: [
    node(G, "gc.bonfire", "Grand Cathedral", "bonfire", -140, 20, "Just inside the cathedral doors."),
    node(G, "gc.alsanna", "Alsanna's altar", "landmark", 40, -20, "End of the red carpet; talk and agree to help."),
    node(G, "gc.chaos_drop", "Drop to the Old Chaos", "landmark", 160, 40, "Path opened after Alsanna; Loyce Knights gather above the portal; Lucatiel and Twiggy Shei's signs."),
  ],
  bonfires: [
    { id: "gc.bonfire", name: "Grand Cathedral", areaId: G, note: "Open the Frozen Flower door at the top of Eleum Loyce and light it just inside.", source: GSRC },
  ],
  bosses: [],
  items: [
    ig("Loyce Set", "armor", "gc.alsanna", "Given by Alsanna after offering 35 Loyce Souls (from Charred Loyce Knights).", { note: "Covenant-style reward." }),
    ig("Soul of Alsanna", "boss-soul", "gc.alsanna", "Given by Alsanna after 50 Loyce Souls, or by killing her."),
    ig("Ivory King's Set", "armor", "gc.alsanna", "Purchasable from Maughlin the Armourer after talking to Alsanna with 50 Loyce Souls.", { note: "Purchase in Majula." }),
    ig("Vessel Shield", "shield", "gc.alsanna", "Available after clearing the ice (Alsanna's request); Fextralife lists it under the Cathedral.", { note: "Exact spot not given by the wiki." }),
  ],
  npcs: [
    { id: "npc.alsanna", name: "Alsanna, Silent Oracle", areaId: G, node: "gc.alsanna", role: "covenant", description: "Oracle holding back the Old Chaos. Agree to help to melt the ice; trade Loyce Souls for the Loyce Set and her soul.", source: GSRC },
    { id: "npc.loyce_knights", name: "Loyce Knights", areaId: G, node: "gc.chaos_drop", role: "summon", description: "Up to four knights (one plus three found across Eleum Loyce) jump into the Old Chaos with you and seal the portals.", source: GSRC },
    { id: "npc.lucatiel_ivory", name: "Lucatiel of Mirrah (summon)", areaId: G, node: "gc.chaos_drop", role: "summon", description: "Summon sign near the Old Chaos drop (after freeing at least one Loyce Knight).", source: GSRC },
    { id: "npc.twiggy_shei", name: "Twiggy Shei (summon)", areaId: G, node: "gc.chaos_drop", role: "summon", description: "Summon sign near the Old Chaos drop.", source: GSRC },
  ],
  features: [
    { id: "ft.gc.flower_door", name: "Frozen Flower door", kind: "locked-door", areaId: G, node: "gc.bonfire", requires: "Frozen Flower", description: "Cathedral doors at the top of Eleum Loyce; the flower is on a corpse in Drangleic Castle (SotFS).", source: GSRC },
    { id: "ft.gc.melt", name: "Alsanna melts the ice", kind: "lever", areaId: G, node: "gc.alsanna", description: "Agreeing to help clears the ice walls, chests and paths across Frozen Eleum Loyce and opens the way to the Old Chaos.", source: GSRC },
  ],
  edges: [
    edge("gc.bonfire", "gc.alsanna", 1, "Up the stairs along the red carpet."),
    edge("gc.alsanna", "gc.chaos_drop", 1, "New path after agreeing to help Alsanna.", { requires: [req.event("Agreed to help Alsanna")] }),
    edge("gc.chaos_drop", "oc.arena", 1, "Drop through the portal with the Loyce Knights.", { kind: "drop", oneWay: true }),
  ],
}, GSRC);

// ---------- Old Chaos ----------
const O = "old_chaos";
const OSRC = FEX + "Old+Chaos";
const io = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(O, name, cat, n, how, extra);

export const oldChaos: AreaBundle = finalize([6600, 950], {
  area: {
    id: O,
    name: "Old Chaos",
    dlc: "ivory",
    shape: [[-160, -90], [110, -110], [200, 0], [130, 100], [-130, 100], [-210, 10]],
    label: [0, -60],
    description: "A lava arena of brimstone below the Grand Cathedral. Three portals spawn Charred Loyce Knights until your Loyce Knights freeze them shut; then the Burnt Ivory King rises from a fourth.",
    connections: ["grand_cath"],
    recommendedLevel: "DLC (130+)",
    source: OSRC,
  },
  nodes: [
    node(O, "oc.arena", "Burnt Ivory King arena", "boss", 0, 0, "Portals in the lava; the white beam at the landing returns you above."),
  ],
  bonfires: [],
  bosses: [
    { id: "boss.burnt_ivory_king", name: "Burnt Ivory King", areaId: O, node: "oc.arena", required: false, dlc: "ivory", description: "The Ivory King, consumed by Chaos, with a flaming ultra greatsword. Waves of Charred Loyce Knights precede him unless your Loyce Knights seal the portals.", drops: ["Soul of the Ivory King", "Crown of the Ivory King (appears on the ground)"], note: "Optional DLC boss.", source: FEX + "Burnt+Ivory+King" },
  ],
  items: [
    io("Crown of the Ivory King", "armor", "oc.arena", "Appears on the ground where the King's portal was after the fight.", { prerequisites: ["Burnt Ivory King defeated"] }),
    io("Loyce Soul", "unique", "oc.arena", "Dropped by Charred Loyce Knights; offer to Alsanna.", { note: "Enemy drop (farm by re-entering the Old Chaos)." }),
    io("Charred Loyce Set", "armor", "oc.arena", "Dropped by Charred Loyce Knights.", { note: "Enemy drop." }),
  ],
  npcs: [],
  features: [
    { id: "ft.oc.beam", name: "White beam exit", kind: "shortcut", areaId: O, node: "oc.arena", description: "Activate the beam at the landing spot to return to the Grand Cathedral.", source: OSRC },
  ],
  edges: [
    edge("oc.arena", "gc.chaos_drop", 1, "White beam back up to the cathedral.", { kind: "warp", oneWay: true }),
  ],
}, OSRC);

// ---------- Frigid Outskirts ----------
const F = "frigid";
const FSRC = FEX + "Frigid+Outskirts";
const iF = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(F, name, cat, n, how, extra);

export const frigidOutskirts: AreaBundle = finalize([7400, 500], {
  area: {
    id: F,
    name: "Frigid Outskirts",
    dlc: "ivory",
    shape: [[-240, -130], [60, -180], [280, -100], [300, 60], [160, 160], [-140, 160], [-300, 30]],
    label: [0, -100],
    description: "A blizzard-swept wasteland beyond the Expulsion Chamber's coffin, where Frozen Reindeer spawn from every storm. Three ruins mark the way to the icy bridge, a lance-wielding invader and Lud and Zallen, the King's Pets.",
    connections: ["eleum"],
    recommendedLevel: "DLC (150+)",
    source: FSRC,
  },
  nodes: [
    node(F, "frigid.coffin", "Coffin landing & summon circle", "entrance", -260, 20, "Head south-west from the coffin to the summon circle (Vengarl, Feeva, O'Harrah)."),
    node(F, "frigid.ruins", "The three ruins", "landmark", 0, -40, "Ruin to ruin through the blizzard; Pharros' healing spring in the second; Ring of the Living by the boxes."),
    node(F, "frigid.bridge", "Icy bridge & invader", "landmark", 180, 40, "Thin ice bridge with the lance-wielding NPC invader (Maldron) halfway across."),
    node(F, "frigid.pets", "Lud and Zallen arena", "boss", 280, -40, "Fog gate across the bridge; beam of light beyond returns you to the coffin bonfire."),
  ],
  bonfires: [],
  bosses: [
    { id: "boss.lud_zallen", name: "Lud and Zallen, the King's Pets", areaId: F, node: "frigid.pets", required: false, dlc: "ivory", description: "Two ice tigers; Zallen joins when Lud is weakened and both buff with ice. Fought after the long blizzard trek.", drops: ["Soul of Lud, the King's Pet", "Soul of Zallen, the King's Pet"], note: "Optional DLC boss; widely considered the hardest run-back in the game.", source: FEX + "Lud+and+Zallen,+the+King's+Pets" },
  ],
  items: [
    iF("Ring of the Living", "ring", "frigid.ruins", "Corpse along the path of boxes and barrels at the right-hand cliff edge before the bridge."),
    iF("Mirrah Hat", "armor", "frigid.ruins", "Unmasked Lucatiel's hat; on a corpse in the ruins (Fextralife list).", { note: "Exact ruin not given by the wiki." }),
    iF("Human Effigy", "effigy", "frigid.ruins", "Corpse in one of the three ruins (Fextralife list).", { note: "Exact ruin not given by the wiki." }),
    iF("Wilted Dusk Herb", "consumable", "frigid.ruins", "Corpse in one of the three ruins (Fextralife list).", { note: "Exact ruin not given by the wiki." }),
    iF("Petrified Dragon Bone", "dragon-bone", "frigid.ruins", "Roughly 5% drop from Frozen Reindeer.", { note: "Enemy drop." }),
    iF("Bone Fist", "weapon", "frigid.ruins", "Rare drop from Frozen Reindeer.", { note: "Enemy drop." }),
  ],
  npcs: [
    { id: "npc.vengarl_frigid", name: "Head of Vengarl (summon)", areaId: F, node: "frigid.coffin", role: "summon", description: "Summon circle south-west of the coffin.", source: FSRC },
    { id: "npc.feeva_frigid", name: "Abbess Feeva (summon)", areaId: F, node: "frigid.coffin", role: "summon", description: "Summon circle south-west of the coffin.", source: FSRC },
    { id: "npc.oharrah_frigid", name: "Manhunter O'Harrah (summon)", areaId: F, node: "frigid.coffin", role: "summon", description: "SotFS: third sign at the summon circle.", source: FSRC },
    { id: "npc.maldron_frigid", name: "Maldron the Assassin (invader)", areaId: F, node: "frigid.bridge", role: "npc", description: "Lance-wielding invader halfway across the icy bridge.", source: FSRC },
  ],
  features: [
    { id: "ft.frigid.coffin", name: "Coffin from the Expulsion Chamber", kind: "shortcut", areaId: F, node: "frigid.coffin", requires: "Garrison Ward Key", description: "Coffin behind the Expulsion Chamber bonfire in Eleum Loyce slides you into the Outskirts.", source: FSRC },
    { id: "ft.frigid.spring", name: "Pharros' healing spring", kind: "pharros", areaId: F, node: "frigid.ruins", requires: "Pharros' Lockstone", description: "Second ruin before the boss; heals you and your phantoms.", source: FSRC },
  ],
  edges: [
    edge("frigid.coffin", "frigid.ruins", 2, "South-west to the summon circle, then ruin to ruin keeping the sun to your right."),
    edge("frigid.ruins", "frigid.bridge", 1, "Short valley from the third ruin to the thin icy bridge."),
    edge("frigid.bridge", "frigid.pets", 1, "Past the invader to the fog gate."),
    edge("frigid.pets", "eleum.expulsion", 1, "Beam of light after the boss returns to the coffin bonfire.", { kind: "warp", oneWay: true, requires: [req.boss("Lud and Zallen, the King's Pets")] }),
  ],
}, FSRC);
