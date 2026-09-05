import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "iron_passage";
const SRC = FEX + "Iron+Passage";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([5700, 4650], {
  area: {
    id: A,
    name: "Iron Passage",
    dlc: "iron",
    shape: [[-260, -140], [40, -200], [280, -120], [300, 60], [160, 170], [-140, 170], [-300, 40]],
    label: [0, -110],
    description: "Optional gauntlet below Brume Tower (Tower Key). Levers open cell blocks and a fireball-spitting grate; drop through rooms of Ashen Warriors, Fume Sorcerers and Possessed Armors to the Blue Smelter Demon.",
    connections: ["brume"],
    recommendedLevel: "110 to 120",
    source: SRC,
  },
  nodes: [
    node(A, "ip.entrance", "Iron Hallway Entrance", "bonfire", -260, 0, "Bonfire just inside from the elevator; drop to the summon-sign floor."),
    node(A, "ip.lever_room", "Lever room & cells", "landmark", -100, -80, "Lever opens the cell block (Large Titanite Shards) and the fireball grate to the upper path."),
    node(A, "ip.low_path", "Low path rooms", "landmark", 40, 20, "Three drop-through rooms of Ashen Warriors, Fume Sorcerers and Possessed Armors."),
    node(A, "ip.high_path", "High path (past the grates)", "landmark", 120, -120, "Astrologists, second lever cells (Simpleton's Spice, Torches), Wilted Dusk Herb and Titanite Chunk ledges."),
    node(A, "ip.blue_smelter", "Blue Smelter Demon arena", "boss", 240, 40, "Mist at the bottom room past the Iron Warrior."),
  ],
  bonfires: [
    { id: "ip.entrance", name: "Iron Hallway Entrance", areaId: A, note: "Right after the elevator down from the Tower Key door in Brume Tower's Foyer.", source: SRC },
  ],
  bosses: [
    { id: "boss.blue_smelter", name: "Blue Smelter Demon", areaId: A, node: "ip.blue_smelter", required: false, dlc: "iron", description: "Magic-infused twin of the Smelter Demon; his blue flame deals magic damage. Steel-willed Lorrie and Drifter Swordsman Aidel can be summoned at the start.", drops: ["Smelter Demon Soul"], note: "Optional DLC boss (Fextralife lists him as 'Smelter Demon (Iron Passage)').", source: FEX + "Smelter+Demon+(Iron+Passage)" },
  ],
  items: [
    i("Large Titanite Shard", "titanite", "ip.lever_room", "Pull the lever; last cell on the right after the four Ashen Warriors.", { qty: 7 }),
    i("Dried Root", "consumable", "ip.low_path", "Body in the final room before the boss mist."),
    i("Pharros Mask", "armor", "ip.blue_smelter", "Corpse in the room after the Blue Smelter Demon.", { prerequisites: ["Blue Smelter Demon defeated"] }),
    i("Crimson Water", "consumable", "ip.high_path", "Run past the closing grate after the lever; left past the Astrologist and Fume Sorcerer, body at the end.", { qty: 2 }),
    i("Simpleton's Spice", "consumable", "ip.high_path", "Second lever's cell block on the high path (three Ashen Warriors)."),
    i("Torch", "consumable", "ip.high_path", "Second lever's cell block on the high path.", { qty: 5 }),
    i("Wilted Dusk Herb", "consumable", "ip.high_path", "Past the second grate, left exit: drop to the Possessed Armor's ledge.", { qty: 2 }),
    i("Titanite Chunk", "titanite", "ip.high_path", "Past the second grate, right exit: Possessed Armor guarding two bodies (with 3x Cracked Eye Orb, 3x Old Growth Balm)."),
    i("Cracked Red Eye Orb", "consumable", "ip.high_path", "Right exit bodies near the boss gate.", { qty: 3 }),
    i("Old Growth Balm", "consumable", "ip.high_path", "Right exit bodies near the boss gate.", { qty: 3 }),
  ],
  npcs: [
    { id: "npc.lorrie_ip", name: "Steel-willed Lorrie (summon)", areaId: A, node: "ip.entrance", role: "summon", description: "Summon sign on the floor below the bonfire.", source: SRC },
    { id: "npc.aidel_ip", name: "Drifter Swordsman Aidel (summon)", areaId: A, node: "ip.entrance", role: "summon", description: "Summon sign on the floor below the bonfire.", source: SRC },
  ],
  features: [
    { id: "ft.ip.lever", name: "Cell & grate lever", kind: "lever", areaId: A, node: "ip.lever_room", description: "Opens the cells (Ashen Warriors) and briefly the fireball grate to the upper path.", source: SRC },
    { id: "ft.ip.lever2", name: "Second lever (high path)", kind: "lever", areaId: A, node: "ip.high_path", description: "Opens the second cell block and grate; only way onto the Possessed Armor platform of the last room.", source: SRC },
    { id: "ft.ip.elevator", name: "Post-boss elevator", kind: "shortcut", areaId: A, node: "ip.blue_smelter", description: "Elevator after the Pharros Mask returns you to the passage entrance.", source: SRC },
  ],
  edges: [
    edge("ip.entrance", "ip.lever_room", 1, "Drop to the next floor and continue to the lever.", { kind: "drop" }),
    edge("ip.lever_room", "ip.low_path", 1, "Left path, drop down the hole, then room by room.", { kind: "drop", oneWay: true }),
    edge("ip.lever_room", "ip.high_path", 1, "Pull the lever and run the fireball corridor past the grate before it closes.", { requires: [req.event("Run past the closing grate")], oneWay: true }),
    edge("ip.high_path", "ip.low_path", 1, "Drops from the high path ledges to the lower rooms.", { kind: "drop", oneWay: true }),
    edge("ip.low_path", "ip.blue_smelter", 1, "Final room with the Iron Warrior; enter the mist."),
    edge("ip.blue_smelter", "ip.entrance", 1, "Elevator after the boss back to the entrance walkway.", { kind: "elevator", requires: [req.boss("Blue Smelter Demon")] }),
  ],
}, SRC);
