import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "cathedral_blue";
const SRC = FEX + "Cathedral+of+Blue";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([5700, 2950], {
  area: {
    id: A,
    name: "Cathedral of Blue",
    shape: [[-180, -120], [140, -140], [220, 20], [140, 150], [-160, 150], [-240, 20]],
    label: [0, -80],
    description: "A small cathedral reached over the drawbridge from Heide's dragon platform. The Old Dragonslayer waits inside; Blue Sentinel Targray keeps the covenant on the balcony beyond.",
    connections: ["heides"],
    recommendedLevel: "30-40",
    source: SRC,
  },
  nodes: [
    node(A, "cob.entrance", "Cathedral doors", "entrance", -160, 20, "Across the drawbridge; corpse and iron chest right before the mist."),
    node(A, "cob.dragonslayer", "Old Dragonslayer arena", "boss", -20, 0, "Boss fight immediately inside the cathedral."),
    node(A, "cob.bonfire", "The Blue Cathedral", "bonfire", 60, 100, "Staircase down on the right before the balcony."),
    node(A, "cob.balcony", "Targray's balcony", "landmark", 140, 0, "Blue Sentinels covenant; chests with Cracked Blue Eye Orbs, Tower Shield and Cleric's Parma."),
  ],
  bonfires: [
    { id: "cob.bonfire", name: "The Blue Cathedral", areaId: A, note: "Down the staircase on the right just before the balcony, after the Old Dragonslayer.", source: SRC },
  ],
  bosses: [
    { id: "boss.old_dragonslayer", name: "Old Dragonslayer", areaId: A, node: "cob.dragonslayer", required: false, description: "A dark echo of Ornstein wielding a lightning spear. Fast lunges and a dark-infused grab.", drops: ["Old Dragonslayer Soul"], note: "Optional; only guards the Blue Sentinels covenant.", source: FEX + "Old+Dragonslayer" },
  ],
  items: [
    i("Old Radiant Lifegem", "lifegem", "cob.entrance", "Corpse right before the boss mist."),
    i("Human Effigy", "effigy", "cob.entrance", "Iron chest next to the corpse before the boss mist.", { qty: 5 }),
    i("Cracked Blue Eye Orb", "consumable", "cob.balcony", "Wooden chest on the left of the balcony after the boss.", { qty: 3, prerequisites: ["Old Dragonslayer defeated"] }),
    i("Tower Shield", "shield", "cob.balcony", "Iron chest on the right of the balcony (with Cleric's Parma).", { prerequisites: ["Old Dragonslayer defeated"] }),
    i("Cleric's Parma", "shield", "cob.balcony", "Iron chest on the right of the balcony.", { prerequisites: ["Old Dragonslayer defeated"] }),
    i("Blue Knight's Halberd", "weapon", "cob.balcony", "Dropped by Blue Sentinel Targray if killed.", { note: "Killing him removes the Blue Sentinels covenant." }),
  ],
  npcs: [
    { id: "npc.targray", name: "Blue Sentinel Targray", areaId: A, node: "cob.balcony", role: "covenant", description: "Offers the Blue Sentinels covenant (needs a Token of Fidelity). Sells Cracked Blue Eye Orbs and other items to covenant members.", wares: ["Cracked Blue Eye Orb", "Blue Seal", "Bell Keeper's Bellow (later)"], source: SRC },
  ],
  features: [
    { id: "ft.cob.sentinels", name: "Blue Sentinels covenant", kind: "covenant", areaId: A, node: "cob.balcony", requires: "Token of Fidelity", description: "Join through Targray to answer Way of Blue calls for help.", source: SRC },
  ],
  edges: [
    edge("cob.entrance", "cob.dragonslayer", 1, "Through the mist."),
    edge("cob.dragonslayer", "cob.balcony", 1, "Doorway onto the balcony after the boss.", { requires: [req.boss("Old Dragonslayer")] }),
    edge("cob.balcony", "cob.bonfire", 1, "Staircase down on the right before the balcony."),
  ],
}, SRC);
