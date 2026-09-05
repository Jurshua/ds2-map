import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "lords_chamber";
const SRC = FEX + "Lord's+Private+Chamber";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([1750, 780], {
  area: {
    id: A,
    name: "Lord's Private Chamber",
    shape: [[-140, -90], [110, -100], [170, 20], [100, 110], [-120, 110], [-180, 10]],
    label: [0, -60],
    description: "Duke Tseldora's study, entered right after The Duke's Dear Freja. The Duke sits at his table with the Brightstone Key; the Primal Bonfire is down the stairs.",
    connections: ["tseldora"],
    recommendedLevel: "90 to 100",
    source: SRC,
  },
  nodes: [
    node(A, "lpc.study", "Duke Tseldora's study", "entrance", -80, 0, "The Tseldoran Settler (Duke Tseldora) sits at a table."),
    node(A, "lpc.primal", "Primal Bonfire (Duke's Dear Freja)", "primal", 80, 40, "Down the stairs to the right of the study."),
  ],
  bonfires: [
    { id: "lpc.primal", name: "Primal Bonfire (The Duke's Dear Freja)", areaId: A, primal: true, note: "Down the stairs right of Duke Tseldora's table. In vanilla it was guarded by Vengarl's Body; in SotFS the body is in the Shaded Woods instead.", source: SRC },
  ],
  bosses: [],
  items: [
    i("Brightstone Key", "key", "lpc.study", "Kill the Tseldoran Settler (Duke Tseldora) at the table. Opens the locked house in Brightstone Cove (Fragrant Branch, Ring of Life Protection room)."),
    i("Fragrant Branch of Yore", "branch", "lpc.study", "Dropped by Duke Tseldora."),
    i("Dark Quartz Ring +1", "ring", "lpc.study", "Dropped by Duke Tseldora."),
  ],
  npcs: [
    { id: "npc.duke_tseldora", name: "Duke Tseldora (Tseldoran Settler)", areaId: A, node: "lpc.study", role: "npc", description: "Passive settler at the table; killing him yields the Brightstone Key, a Fragrant Branch of Yore and the Dark Quartz Ring +1.", source: SRC },
  ],
  features: [],
  edges: [
    edge("lpc.study", "lpc.primal", 1, "Stairs down on the right."),
    edge("lpc.primal", "maj.far_fire", 1, "Primal Bonfire warps back to Majula.", { oneWay: true, kind: "warp" }),
  ],
}, SRC);
