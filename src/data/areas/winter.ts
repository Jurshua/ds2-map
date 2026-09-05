import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "winter";
const SRC = FEX + "Shrine+of+Winter";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([3650, 1250], {
  area: {
    id: A,
    name: "Shrine of Winter",
    shape: [[-220, -130], [120, -160], [280, -20], [200, 150], [-140, 160], [-300, 30]],
    label: [0, -100],
    description: "A rain-soaked mountain shrine beyond the Shaded Woods. Its door opens only to the bearer of the four Great Souls (or enough Soul Memory). The obelisk inside leads to Frozen Eleum Loyce; the bridge beyond leads to Drangleic Castle.",
    connections: ["shaded", "drangleic", "eleum"],
    recommendedLevel: "95 to 105",
    source: SRC,
  },
  nodes: [
    node(A, "winter.entrance", "Shrine door", "entrance", -260, 40, "Great door from the Shaded Woods; the shrine interior with the Ivory King obelisk."),
    node(A, "winter.slope", "Rainy slope", "landmark", -60, -40, "Roaming Souls, Divine Blessing and Human Effigy corpses; tunnel."),
    node(A, "winter.soldiers", "Royal Soldier path", "landmark", 120, 40, "Lightning-bolt Royal Soldiers, Holy Water Urns behind the boulder, Crystal Lizard before the bridge."),
    node(A, "winter.bridge", "Bridge to Drangleic Castle", "landmark", 240, 100, "Long bridge to the castle gates."),
  ],
  bonfires: [],
  bosses: [],
  items: [
    i("Soul of a Hero", "soul", "winter.entrance", "Down the slope, turn right."),
    i("Divine Blessing", "consumable", "winter.slope", "Corpse near the two Roaming Souls."),
    i("Large Soul of a Nameless Soldier", "soul", "winter.slope", "Corpse further along before the tunnel (with Human Effigy)."),
    i("Human Effigy", "effigy", "winter.slope", "Corpse before the tunnel."),
    i("Holy Water Urn", "consumable", "winter.soldiers", "Behind the boulder past the Royal Soldiers.", { qty: 2 }),
    i("Titanite Chunk", "titanite", "winter.soldiers", "Crystal Lizard just before the bridge.", { qty: 3 }),
    i("Titanite Slab", "titanite", "winter.soldiers", "Crystal Lizard just before the bridge."),
  ],
  npcs: [],
  features: [
    { id: "ft.winter.door", name: "Shrine of Winter door", kind: "locked-door", areaId: A, node: "winter.entrance", requires: "Four Great Souls (Primal Bonfires) or 1,000,000 Soul Memory in NG (+1M per cycle, cap 8M)", description: "Opens once the Rotten, Lost Sinner, Old Iron King and Duke's Dear Freja have been slain, or by Soul Memory earned this playthrough.", source: SRC },
    { id: "ft.winter.obelisk", name: "Obelisk to Frozen Eleum Loyce", kind: "shortcut", areaId: A, node: "winter.entrance", requires: "Crown of the Ivory King DLC", description: "Inside the shrine; teleports to the Outer Wall of Eleum Loyce.", source: SRC },
  ],
  edges: [
    edge("winter.entrance", "eleum.entrance", 1, "Obelisk inside the shrine.", { kind: "warp", requires: [req.dlc("Crown of the Ivory King")] }),
    edge("winter.entrance", "winter.slope", 1, "Down the slope."),
    edge("winter.slope", "winter.soldiers", 1, "Through the tunnel and up the path."),
    edge("winter.soldiers", "winter.bridge", 1, "Past the Crystal Lizard onto the bridge."),
    edge("winter.bridge", "dc.entrance", 1, "Across the bridge to the castle gate."),
  ],
}, SRC);
