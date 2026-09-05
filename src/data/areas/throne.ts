import { finalize, node, edge, req, FEX } from "../helpers";

const A = "throne";
const SRC = FEX + "Throne+of+Want";

export default finalize([4500, 350], {
  area: {
    id: A,
    name: "Throne of Want",
    shape: [[-180, -110], [120, -130], [220, 0], [150, 120], [-150, 130], [-240, 20]],
    label: [0, -80],
    description: "The final chamber beneath Drangleic Castle, reached through the King's Ring door left of the King's Gate bonfire. The Throne Watcher and Defender, then Nashandra and (if Vendrick and Aldia have been met) Aldia himself await beyond the fog.",
    connections: ["drangleic"],
    recommendedLevel: "110 to 120",
    source: SRC,
  },
  nodes: [
    node(A, "throne.entrance", "King's Ring door & Emerald Herald", "entrance", -180, 20, "Door left of the King's Gate bonfire opened by the King's Ring; the Herald explains Nashandra."),
    node(A, "throne.path", "Torch-lit path", "landmark", -30, -30, "Stone path to the fog gate; summon signs for Vengarl, Benhart and Bradley."),
    node(A, "throne.watchers", "Throne Watcher & Defender arena", "boss", 100, 0, "First fight beyond the fog."),
    node(A, "throne.nashandra", "Nashandra / Aldia", "boss", 180, 60, "Nashandra follows immediately if you hold the Giant's Kinship; Aldia after her if Vendrick was slain and Aldia spoken to."),
  ],
  bonfires: [],
  bosses: [
    { id: "boss.throne_watcher_defender", name: "Throne Watcher and Throne Defender", areaId: A, node: "throne.watchers", required: true, description: "Two guardians of the throne who revive each other if one is left alive too long. Kill both within a short window.", drops: ["Throne Watcher Soul", "Throne Defender Soul"], note: "Required for either ending.", source: FEX + "Throne+Watcher+and+Throne+Defender" },
    { id: "boss.nashandra", name: "Nashandra", areaId: A, node: "throne.nashandra", required: true, description: "The Queen revealed as a fragment of Manus. Curse orbs surround her; her scythe sweeps wide. Fought right after the Watchers if you have the Giant's Kinship.", drops: ["Soul of Nashandra"], note: "Required final boss; needs the Giant's Kinship from the Giant Lord.", source: FEX + "Nashandra" },
    { id: "boss.aldia", name: "Aldia, Scholar of the First Sin", areaId: A, node: "throne.nashandra", required: false, description: "SotFS-only true final boss: a burning tree of eyes. Appears after Nashandra only if you defeated Vendrick and spoke to Aldia at the bonfires. Enables the 'leave the throne' ending.", drops: ["Soul of Aldia", "Ashen Warrior Set (Straid)"], note: "Optional; SotFS addition.", source: FEX + "Aldia,+Scholar+of+the+First+Sin" },
  ],
  items: [],
  npcs: [
    { id: "npc.emerald_throne", name: "Emerald Herald (Throne)", areaId: A, node: "throne.entrance", role: "npc", description: "Behind the King's Ring door; tells her origin and Nashandra's intent.", source: SRC },
    { id: "npc.vengarl_throne", name: "Vengarl (summon)", areaId: A, node: "throne.path", role: "summon", description: "Summon sign before the fog if his body was slain in the Shaded Woods.", source: SRC },
    { id: "npc.benhart_throne", name: "Benhart of Jugo (summon)", areaId: A, node: "throne.path", role: "summon", description: "Summon sign before the fog.", source: SRC },
    { id: "npc.bradley_throne", name: "Bradley of the Old Guard (summon)", areaId: A, node: "throne.path", role: "summon", description: "Summon sign before the fog, only when Aldia will be the final boss.", source: SRC },
  ],
  features: [
    { id: "ft.throne.door", name: "King's Ring door", kind: "locked-door", areaId: A, node: "throne.entrance", requires: "King's Ring", description: "Left of the King's Gate bonfire in Drangleic Castle; opens automatically with the ring equipped.", source: SRC },
  ],
  edges: [
    edge("throne.entrance", "throne.path", 1, "Follow the torch-lit stone path."),
    edge("throne.path", "throne.watchers", 1, "Through the fog gate."),
    edge("throne.watchers", "throne.nashandra", 1, "Continues immediately with the Giant's Kinship.", { requires: [req.boss("Throne Watcher and Throne Defender"), req.item("Giant's Kinship", "From the Giant Lord in the Memory of Jeigh")] }),
  ],
}, SRC);
