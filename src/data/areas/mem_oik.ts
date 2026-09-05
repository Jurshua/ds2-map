import { finalize, it, node, edge, FEX } from "../helpers";

const A = "mem_oik";
const SRC = FEX + "Memory+of+the+Old+Iron+King";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([7900, 5500], {
  area: {
    id: A,
    name: "Memory of the Old Iron King",
    dlc: "iron",
    shape: [[-180, -110], [120, -130], [220, 0], [150, 120], [-150, 130], [-240, 20]],
    label: [0, -80],
    description: "Sir Alonne's memory inside Brume Tower, entered from the glowing statue by the Smelter Throne bonfire (Tower Key, Ashen Mist Heart, Fume Knight slain). Halls of Alonne Knights and Flame Salamanders lead to the Iron King's greatest knight.",
    connections: ["brume"],
    recommendedLevel: "DLC (130+)",
    source: SRC,
  },
  nodes: [
    node(A, "mem_oik.entrance", "Memory entrance hall", "entrance", -180, 20, "Hub room for summons; signs for Steel-willed Lorrie and Drifter Swordsman Aidel."),
    node(A, "mem_oik.great_hall", "Great hall of Alonne Knights", "landmark", -20, -40, "Many Alonne Knights and Flame Salamanders; loot corpses in the middle."),
    node(A, "mem_oik.lower", "Lower halls", "landmark", 100, 40, "Drop through the hole: more knights, Salamander below, Twinblade +7 side stairs."),
    node(A, "mem_oik.alonne", "Sir Alonne arena", "boss", 190, -40, "Corridor and fog at the end of the lower halls."),
  ],
  bonfires: [],
  bosses: [
    { id: "boss.sir_alonne", name: "Sir Alonne", areaId: A, node: "mem_oik.alonne", required: false, dlc: "iron", description: "The Old Iron King's honourable knight; fast katana combos and a grab. Commits seppuku if beaten flawlessly. Steel-willed Lorrie and Drifter Swordsman Aidel can be summoned.", drops: ["Soul of Sir Alonne"], note: "Optional DLC boss; needs the Tower Key, Ashen Mist Heart and the Fume Knight defeated.", source: FEX + "Sir+Alonne" },
  ],
  items: [
    i("Rusted Coin", "consumable", "mem_oik.great_hall", "First doorway on the left of the great hall.", { qty: 3 }),
    i("Smooth & Silky Stone", "unique", "mem_oik.great_hall", "Three bodies in the middle of the great hall.", { qty: 5 }),
    i("Human Effigy", "effigy", "mem_oik.great_hall", "Three bodies in the middle of the great hall.", { qty: 3 }),
    i("Skeptic's Spice", "consumable", "mem_oik.great_hall", "Bodies in the middle of the great hall."),
    i("Radiant Lifegem", "lifegem", "mem_oik.lower", "Two corpses in the room after the hole drop.", { qty: 5 }),
    i("Repair Powder", "consumable", "mem_oik.lower", "Two corpses in the room after the hole drop.", { qty: 3 }),
    i("Twinblade +7", "weapon", "mem_oik.lower", "Side stairs down to the Salamander and three knights; explore the lower area."),
    i("Smelter Wedge", "unique", "mem_oik.alonne", "Examine the chair in the room on the far right after Sir Alonne (also exits the memory).", { prerequisites: ["Sir Alonne defeated"] }),
  ],
  npcs: [
    { id: "npc.lorrie", name: "Steel-willed Lorrie (summon)", areaId: A, node: "mem_oik.entrance", role: "summon", description: "Summon sign in the starting room.", source: SRC },
    { id: "npc.aidel_oik", name: "Drifter Swordsman Aidel (summon)", areaId: A, node: "mem_oik.entrance", role: "summon", description: "Summon sign in the starting room.", source: SRC },
  ],
  features: [],
  edges: [
    edge("mem_oik.entrance", "mem_oik.great_hall", 1, "Through the doorway."),
    edge("mem_oik.great_hall", "mem_oik.lower", 1, "Drop down the hole at the end of the hall.", { kind: "drop", oneWay: true }),
    edge("mem_oik.lower", "mem_oik.alonne", 1, "Doorway at the end, down the corridor to the fog."),
  ],
}, SRC);
