import { finalize, it, node, edge, req, FEX, WD } from "../helpers";

const A = "cave_dead";
const SRC = FEX + "Cave+of+the+Dead";
const WSRC = WD + "cave-of-the-dead";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([1450, 4800], {
  area: {
    id: A,
    name: "Cave of the Dead",
    dlc: "sunken",
    shape: [[-200, -120], [100, -150], [240, -20], [180, 120], [-120, 130], [-260, 20]],
    label: [0, -90],
    description: "A small, pitch-dark cave of petrifying statues past the Priestess' Chamber. Three NPC invaders, Graverobber, Varg and Cerah, wait behind the fog; co-op players without the DLC can be summoned here from the Black Gulch gravestones.",
    connections: ["shulva"],
    recommendedLevel: "110 to 120",
    source: SRC,
  },
  nodes: [
    node(A, "cave_dead.entrance", "Cave entrance ledges", "entrance", -200, 0, "Fog gate from the Priestess' Chamber; Andrei and Alfis's signs on the first ledge."),
    node(A, "cave_dead.statue_room", "Petrifying statue rooms", "landmark", -20, -40, "Sanctum Soldiers, statue clusters, holes down; Ascetic and Petrified Something chest."),
    node(A, "cave_dead.trio", "Graverobber, Varg & Cerah arena", "boss", 160, 40, "Fog gate after the Cragslipper room."),
  ],
  bonfires: [],
  bosses: [
    { id: "boss.graverobbers", name: "Graverobber, Varg and Cerah", areaId: A, node: "cave_dead.trio", required: false, dlc: "sunken", description: "Three phantom hunters: a dual-wielder, a Havel-armored greatsword knight and an archer. Ruined Alfis and Rapacious Andrei can be summoned.", drops: ["Twinkling Titanite x3", "Petrified Dragon Bone x3", "Titanite Slab"], note: "Optional DLC boss.", source: FEX + "Graverobber,+Varg,+and+Cerah" },
  ],
  items: [
    i("Petrified Something", "unique", "cave_dead.statue_room", "Metal chest in the room full of petrifying statues.", { qty: 3 }),
    i("Brightbug", "consumable", "cave_dead.statue_room", "Corpse in the room full of petrifying statues.", { qty: 2 }),
    i("Bonfire Ascetic", "ascetic", "cave_dead.statue_room", "Corpse in the room full of petrifying statues.", { qty: 3 }),
    i("Alluring Skull", "consumable", "cave_dead.trio", "Next to a petrifying statue trap before the boss fog (wikidot).", { qty: 3, source: WSRC }),
    i("Twinkling Titanite", "twinkling", "cave_dead.trio", "Dropped by the three bosses.", { qty: 3, prerequisites: ["Graverobber, Varg and Cerah defeated"] }),
    i("Petrified Dragon Bone", "dragon-bone", "cave_dead.trio", "Dropped by the three bosses.", { qty: 3, prerequisites: ["Graverobber, Varg and Cerah defeated"] }),
    i("Titanite Slab", "titanite", "cave_dead.trio", "Dropped by the three bosses.", { prerequisites: ["Graverobber, Varg and Cerah defeated"] }),
    i("Flower Skirt", "armor", "cave_dead.trio", "Chest on the opposite side of the arena entrance after the fight.", { prerequisites: ["Graverobber, Varg and Cerah defeated"] }),
    i("Blackweed Balm", "consumable", "cave_dead.trio", "Corpse near the Flower Skirt chest.", { qty: 3, prerequisites: ["Graverobber, Varg and Cerah defeated"] }),
    i("Promised Walk of Peace", "spell", "cave_dead.statue_room", "Dropped by the last Petrifying Statue Cluster once they reach their spawn limit.", { note: "Enemy drop." }),
  ],
  npcs: [
    { id: "npc.andrei", name: "Rapacious Andrei (summon)", areaId: A, node: "cave_dead.entrance", role: "summon", description: "Summon sign on the first ledge (human form).", source: SRC },
    { id: "npc.alfis_cave", name: "Ruined Alfis (summon)", areaId: A, node: "cave_dead.entrance", role: "summon", description: "Summon sign on the first ledge (human form).", source: SRC },
  ],
  features: [
    { id: "ft.cave_dead.exit_hole", name: "Exit hole after the boss", kind: "shortcut", areaId: A, node: "cave_dead.trio", description: "Hole at the end drops into the Dark Greatsword level of the Priestess' Chamber elevator.", source: SRC },
  ],
  edges: [
    edge("cave_dead.entrance", "cave_dead.statue_room", 1, "Drop down two ledges; second hole on the right.", { kind: "drop", oneWay: true }),
    edge("cave_dead.statue_room", "cave_dead.trio", 1, "Find the exit, drop the ledge, past the Cragslipper and Soldiers to the fog.", { kind: "drop", oneWay: true }),
    edge("cave_dead.trio", "shulva.priestess_chamber", 1, "Hole after the boss drops to the Priestess' Chamber elevator level.", { kind: "drop", oneWay: true, requires: [req.boss("Graverobber, Varg and Cerah")] }),
  ],
}, SRC);
