import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "drest";
const SRC = FEX + "Dragon's+Rest";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([900, 6100], {
  area: {
    id: A,
    name: "Dragon's Rest",
    dlc: "sunken",
    shape: [[-300, -160], [40, -220], [320, -140], [340, 60], [180, 190], [-140, 190], [-340, 40]],
    label: [0, -120],
    description: "The bottom of the Sanctum pyramid, reached by drops from the Dragon Stone elevator. Drakeblood Knights guard the Crystal Lizard vault and the Drakeblood Set; Elana, the Squalid Queen, and Sinh, the Slumbering Dragon, wait at the nadir with the Crown of the Sunken King.",
    connections: ["sanctum"],
    recommendedLevel: "110 to 120",
    source: SRC,
  },
  nodes: [
    node(A, "drest.entrance", "Broken stairs & switch room", "entrance", -300, -40, "Drops from the elevator building; Drakeblood Knight room with two floor switches and the Crystal Lizard vault."),
    node(A, "drest.sanctum_interior", "Sanctum Interior", "bonfire", -120, 40, "Illusory wall in the middle of the left corridor after the Hexing Urn ledge and the second Drakeblood Knight."),
    node(A, "drest.drakeblood_room", "Drakeblood Set room", "landmark", -40, 150, "Opened chests and the body with the Drakeblood Set past two Knights."),
    node(A, "drest.descent", "Descent to the nadir", "landmark", 80, -60, "Broken bridges and drops: Vine Balm, Twinkling Titanite, Small Smooth & Silky Stones."),
    node(A, "drest.elana", "Elana, the Squalid Queen arena", "boss", 200, 20, "Large fog gate at the bottom; Benhart and Steelheart Ellie's signs."),
    node(A, "drest.sanctum_nadir", "Sanctum Nadir", "bonfire", 260, 110, "Through the dragon-adorned wall after Elana; Abbess Feeva and Transcendent Edde's signs."),
    node(A, "drest.sinh", "Sinh, the Slumbering Dragon arena", "boss", 320, -80, "Small fog gate past the Sanctum Nadir bonfire."),
  ],
  bonfires: [
    { id: "drest.sanctum_interior", name: "Sanctum Interior", areaId: A, note: "Illusory wall in the middle of the left corridor after descending past the Hexing Urn body (Fextralife lists it under the Dragon's Sanctum).", source: SRC },
    { id: "drest.sanctum_nadir", name: "Sanctum Nadir", areaId: A, note: "Behind the dragon wall that opens after Elana.", source: SRC },
  ],
  bosses: [
    { id: "boss.elana", name: "Elana, the Squalid Queen", areaId: A, node: "drest.elana", required: false, dlc: "sunken", description: "Dark sorceress who summons skeletons, pigs or Velstadt. Fast dark spells and a lunging scythe.", drops: ["Soul of Elana, Squalid Queen"], note: "Optional DLC boss; required to reach Sinh.", source: FEX + "Elana,+Squalid+Queen" },
    { id: "boss.sinh", name: "Sinh, the Slumbering Dragon", areaId: A, node: "drest.sinh", required: false, dlc: "sunken", description: "Poison-breathing dragon in a vast arena; aerial dives and toxic fire. Drops the Crown of the Sunken King.", drops: ["Soul of Sinh, the Slumbering Dragon", "Crown of the Sunken King"], note: "Optional DLC boss.", source: FEX + "Sinh,+the+Slumbering+Dragon" },
  ],
  items: [
    i("Twinkling Titanite", "twinkling", "drest.entrance", "Right-hand switch in the Drakeblood room reveals four Crystal Lizards; their drops.", { qty: 4 }),
    i("Faintstone", "titanite", "drest.entrance", "Crystal Lizard vault drops.", { qty: 2 }),
    i("Firedrake Stone", "consumable", "drest.entrance", "Crystal Lizard vault drops.", { qty: 2 }),
    i("Old Mundane Stone", "titanite", "drest.entrance", "Crystal Lizard vault drops.", { qty: 2 }),
    i("Petrified Dragon Bone", "dragon-bone", "drest.entrance", "Crystal Lizard vault drops.", { qty: 3 }),
    i("Raw Stone", "titanite", "drest.entrance", "Crystal Lizard vault drops.", { qty: 2 }),
    i("Titanite Chunk", "titanite", "drest.entrance", "Crystal Lizard vault drops.", { qty: 3 }),
    i("Titanite Slab", "titanite", "drest.entrance", "Crystal Lizard vault drops."),
    i("Hexing Urn", "consumable", "drest.sanctum_interior", "Body straight ahead after the stairs from the broken-pillar drops.", { qty: 10 }),
    i("Drakeblood Set", "armor", "drest.drakeblood_room", "Body in the room of opened chests past two Drakeblood Knights, down the stairs from the bonfire."),
    i("Vine Balm", "consumable", "drest.descent", "Body after the run-jump platform (two Drakeblood Knights nearby).", { qty: 3 }),
    i("Twinkling Titanite", "twinkling", "drest.descent", "Body around the corner from the Vine Balm.", { qty: 3 }),
    i("Large Soul of a Brave Warrior", "soul", "drest.descent", "Body past the third Knight."),
    i("Twinkling Titanite", "twinkling", "drest.descent", "Body next to the Large Soul of a Brave Warrior.", { qty: 3 }),
    i("Small Smooth & Silky Stone", "unique", "drest.descent", "Body to the left of the last two.", { qty: 5 }),
    i("Crown of the Sunken King", "armor", "drest.sinh", "Glimmering orb on the floor after Sinh.", { prerequisites: ["Sinh defeated"] }),
    i("Yorgh's Ring", "ring", "drest.sinh", "Body on the left side of Sinh's arena after the fight.", { prerequisites: ["Sinh defeated"] }),
  ],
  npcs: [
    { id: "npc.benhart_drest", name: "Benhart of Jugo (summon)", areaId: A, node: "drest.elana", role: "summon", description: "Summon sign before Elana's fog.", source: SRC },
    { id: "npc.ellie", name: "Steelheart Ellie (summon)", areaId: A, node: "drest.elana", role: "summon", description: "Summon sign before Elana's fog.", source: SRC },
    { id: "npc.feeva", name: "Abbess Feeva (summon)", areaId: A, node: "drest.sanctum_nadir", role: "summon", description: "Summon sign beside the Sanctum Nadir bonfire.", source: SRC },
    { id: "npc.edde", name: "Transcendent Edde (summon)", areaId: A, node: "drest.sanctum_nadir", role: "summon", description: "Summon sign beside the Sanctum Nadir bonfire.", source: SRC },
  ],
  features: [
    { id: "ft.drest.switches", name: "Floor switches (Crystal Lizard vault)", kind: "lever", areaId: A, node: "drest.entrance", description: "Right switch rotates the wheel to release four Crystal Lizards; left one only opens an empty room.", source: SRC },
    { id: "ft.drest.illusory", name: "Illusory wall (Sanctum Interior)", kind: "illusory-wall", areaId: A, node: "drest.sanctum_interior", description: "Middle of the left corridor wall after the second Drakeblood Knight.", source: SRC },
  ],
  edges: [
    edge("drest.entrance", "drest.sanctum_interior", 1, "Broken bridge, pillar drops, stairs, Hexing Urn ledge, down the broken staircase, left twice.", { kind: "drop" }),
    edge("drest.sanctum_interior", "drest.drakeblood_room", 1, "Stairs down past two Knights, left and left."),
    edge("drest.sanctum_interior", "drest.descent", 1, "Right after the bonfire, broken bridge on the left, drops and a run-jump.", { kind: "drop", oneWay: true }),
    edge("drest.descent", "drest.elana", 1, "Dead end: drop right, keep dropping until the Dragon's Rest title.", { kind: "drop", oneWay: true }),
    edge("drest.elana", "drest.sanctum_nadir", 1, "The dragon wall opens after Elana.", { requires: [req.boss("Elana, the Squalid Queen")] }),
    edge("drest.sanctum_nadir", "drest.sinh", 1, "Small fog gate past the bonfire."),
  ],
}, SRC);
