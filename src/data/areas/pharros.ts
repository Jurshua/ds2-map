import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "pharros";
const SRC = FEX + "Doors+of+Pharros";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([2250, 1400], {
  area: {
    id: A,
    name: "Doors of Pharros",
    shape: [[-260, -160], [60, -220], [300, -120], [320, 80], [160, 200], [-160, 200], [-320, 40]],
    label: [0, -130],
    description: "A flooded hall of stone faces below the Shaded Woods, riddled with Pharros' contraptions that open doors or spring traps. Gyrm Warriors and Primal Knights guard Santier's Spear; the Rat King's covenant and the Royal Rat Authority wait above; Gavlan's spiral stair leads to Brightstone Cove.",
    connections: ["shaded", "tseldora"],
    recommendedLevel: "80 to 90",
    source: SRC,
  },
  nodes: [
    node(A, "pharros.entrance", "Flooded entrance", "entrance", -260, 0, "Gate from Najka's arena; Primal Knight in the water, Gyrm Warrior up the stone ramp."),
    node(A, "pharros.gyrms_respite", "Gyrm's Respite", "bonfire", -180, 100, "Small cave entrance on the right below the Gyrm Warrior's platform; Prism Stones outside."),
    node(A, "pharros.gavlan", "Gavlan's room & spiral stair", "landmark", -100, -120, "Dwarf with the Dragon Charm chest; Gavlan up the right-hand stairs; spiral stairway to Tseldora."),
    node(A, "pharros.main_hall", "Main flooded hall (1st floor)", "landmark", 20, 20, "Pharros' walls, Mongrel Rats, Bowman Guthry; big stone door with Santier's Spear."),
    node(A, "pharros.upper", "Upper level (2nd floor)", "landmark", 140, -80, "Ladder up: Twisted Barricade, Gyrm Warriors, spiked wall, trapped chest, Pharros' trap contraptions."),
    node(A, "pharros.ordeals_end", "Ordeal's End", "bonfire", 220, 40, "Room on the left halfway around the upper level; fog door beside it."),
    node(A, "pharros.rat_authority", "Royal Rat Authority arena", "boss", 280, -40, "Fog door next to Ordeal's End."),
    node(A, "pharros.rat_king", "Rat King's hole", "landmark", 200, 140, "Path right after the boss: the Rat King in a hole on the left; drops back near the first bonfire."),
    node(A, "pharros.tseldora_stair", "Long hall to Tseldora", "landmark", -20, -200, "Up the spiral stair: axe-throwing Gyrm, Crystal Lizard, narrow walkway, winding stairs to the fountain room."),
  ],
  bonfires: [
    { id: "pharros.gyrms_respite", name: "Gyrm's Respite", areaId: A, note: "Drop off the Gyrm Warrior's platform at the start and enter the small cave on the right.", source: SRC },
    { id: "pharros.ordeals_end", name: "Ordeal's End", areaId: A, note: "Room on the left halfway along the second-level walkway; the Royal Rat Authority fog is beside it.", source: SRC },
  ],
  bosses: [
    { id: "boss.royal_rat_authority", name: "Royal Rat Authority", areaId: A, node: "pharros.rat_authority", required: false, description: "Giant rat that leaps in after its four toxic rat minions. Kill the small rats first.", drops: ["Royal Rat Authority Soul"], note: "Optional; needed only for the Rat King covenant's second rank rewards.", source: FEX + "Royal+Rat+Authority" },
  ],
  items: [
    i("Prism Stone", "consumable", "pharros.gyrms_respite", "Right of the cave entrance to Gyrm's Respite.", { qty: 10 }),
    i("Dragon Charm", "consumable", "pharros.gavlan", "Chest guarded by a Dwarf to the left of the first Gyrm Warrior's platform."),
    i("Lifegem", "lifegem", "pharros.gavlan", "Corpse in Gavlan's room up the right-hand stairs."),
    i("Amber Herb", "consumable", "pharros.main_hall", "Corpse on the far side of the main flooded hall.", { qty: 2 }),
    i("Gyrm Axe", "weapon", "pharros.main_hall", "Doorway on the left up to the platform overlooking the hall (with Torch)."),
    i("Torch", "consumable", "pharros.main_hall", "Overlook platform corpse with the Gyrm Axe."),
    i("Santier's Spear", "weapon", "pharros.main_hall", "Use a Pharros' Lockstone in the water in front of the big stone door to raise its lower middle; chest behind the Primal Knight.", { prerequisites: ["Pharros' Lockstone"] }),
    i("Twisted Barricade", "consumable", "pharros.upper", "Corpse at the top of the ladder (with Soul of a Proud Knight)."),
    i("Soul of a Proud Knight", "soul", "pharros.upper", "Corpse at the top of the ladder."),
    i("Faintstone", "titanite", "pharros.upper", "Lockstone between the two Gyrm Warriors after the ladder opens a door below by the Mongrel Rats; chest (with Twinkling Titanite).", { prerequisites: ["Pharros' Lockstone"] }),
    i("Twinkling Titanite", "twinkling", "pharros.upper", "Lockstone-opened chest by the Mongrel Rats.", { prerequisites: ["Pharros' Lockstone"] }),
    i("Titanite Chunk", "titanite", "pharros.upper", "Trapped chest past the spiked wall, guarded by the third Gyrm Warrior (with Petrified Dragon Bone)."),
    i("Petrified Dragon Bone", "dragon-bone", "pharros.upper", "Trapped chest past the spiked wall."),
    i("Large Soul of a Nameless Soldier", "soul", "pharros.upper", "Left of the small stairs after the narrow path (with Pharros' Lockstone)."),
    i("Pharros' Lockstone", "lockstone", "pharros.upper", "Left of the small stairs after the narrow path."),
    i("Soul of a Brave Warrior", "soul", "pharros.upper", "Far side of the second level past two Gyrm Warriors; the middle lock of the upper big stone door opens it."),
    i("Magic Arrow", "ammo", "pharros.upper", "Lockstone on the floor after the last lock: path with a Gyrm Warrior and a trapped chest.", { qty: 15, prerequisites: ["Pharros' Lockstone"] }),
    i("Rat Tail", "unique", "pharros.rat_king", "Dropped by Mongrel Rats; offered to the Rat King.", { note: "Covenant item / enemy drop." }),
    i("Large Soul of a Brave Warrior", "soul", "pharros.tseldora_stair", "Listed by Fextralife for the area (long hall toward Tseldora).", { note: "Exact spot not given by the wiki." }),
    i("Radiant Lifegem", "lifegem", "pharros.tseldora_stair", "Corpse in the urns on the left of the broken-fountain room at the top of the winding stairs."),
    i("Gyrm Great Hammer", "weapon", "pharros.upper", "Dropped by Gyrm Warriors wielding it.", { note: "Enemy drop." }),
  ],
  npcs: [
    { id: "npc.gavlan_pharros", name: "Lonesome Gavlan", areaId: A, node: "pharros.gavlan", role: "merchant", description: "Room up the right-hand stairs from the first Gyrm platform (second location; first is the Wharf). Buys items.", wares: ["Ring of Giants", "Poison items"], source: SRC },
    { id: "npc.rat_king", name: "Rat King", areaId: A, node: "pharros.rat_king", role: "covenant", description: "In a hole on the path right after the Royal Rat Authority. Rat King covenant: offer Rat Tails; makes the area's rats passive.", source: SRC },
    { id: "npc.guthry", name: "Bowman Guthry (invader)", areaId: A, node: "pharros.main_hall", role: "npc", description: "Scripted invader in the main flooded hall (offline).", source: SRC },
  ],
  features: [
    { id: "ft.pharros.covenant", name: "Rat King covenant", kind: "covenant", areaId: A, node: "pharros.rat_king", description: "Join to be summoned as a rat defender; Slumbering Dragoncrest Ring at rank 1, Crest of the Rat at rank 2.", source: SRC },
    { id: "ft.pharros.big_door", name: "Big stone door (Santier's Spear)", kind: "pharros", areaId: A, node: "pharros.main_hall", requires: "Pharros' Lockstone (in the water)", description: "Three locks each open a third of the door; only the underwater one is needed for the chest.", source: SRC },
    { id: "ft.pharros.faintstone", name: "Lockstone (Faintstone door)", kind: "pharros", areaId: A, node: "pharros.upper", requires: "Pharros' Lockstone", description: "Between the two Gyrm Warriors after the ladder; opens the chest door below by the rats.", source: SRC },
    { id: "ft.pharros.traps", name: "Trap contraptions (2nd floor)", kind: "pharros", areaId: A, node: "pharros.upper", requires: "Pharros' Lockstone", description: "Most second-floor contraptions spring blade or stone-Gyrm traps; one opens the Magic Arrow path, one bypasses the third bridge.", source: SRC },
    { id: "ft.pharros.spikes", name: "Spiked wall trap", kind: "lever", areaId: A, node: "pharros.upper", description: "Third Gyrm Warrior's button behind the trapped chest spikes the wall along the narrow path.", source: SRC },
  ],
  edges: [
    edge("pharros.entrance", "pharros.gyrms_respite", 1, "Up the ramp, drop off the platform, small cave on the right."),
    edge("pharros.entrance", "pharros.gavlan", 1, "Left past the Dwarf, stairs up to Gavlan's room."),
    edge("pharros.gyrms_respite", "pharros.main_hall", 1, "Through the passage past the bonfire into the flooded hall."),
    edge("pharros.main_hall", "pharros.upper", 1, "Door on the left near the herbs, past two Mongrel Rats, ladder up.", { kind: "ladder" }),
    edge("pharros.upper", "pharros.ordeals_end", 1, "Halfway along the second-level walkway, room on the left."),
    edge("pharros.ordeals_end", "pharros.rat_authority", 1, "Fog door beside the bonfire."),
    edge("pharros.rat_authority", "pharros.rat_king", 1, "Path to the right after the arena.", { requires: [req.boss("Royal Rat Authority")] }),
    edge("pharros.rat_king", "pharros.gyrms_respite", 1, "Drop down near the first bonfire.", { kind: "drop", oneWay: true }),
    edge("pharros.gavlan", "pharros.tseldora_stair", 1, "Spiral stairway in Gavlan's room, long hall, narrow walkway, winding stairs."),
    edge("pharros.tseldora_stair", "tseld.entrance", 1, "Door out of the fountain room into Brightstone Cove Tseldora."),
  ],
}, SRC);
