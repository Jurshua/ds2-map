import { finalize, it, node, edge, req, FEX } from "../helpers";
import type { AreaBundle } from "../helpers";

const AMH = req.item("Ashen Mist Heart", "From the Ancient Dragon in the Dragon Shrine");

// ---------- Memory of Jeigh ----------
const J = "mem_jeigh";
const JSRC = FEX + "Memory+of+Jeigh";
const ij = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(J, name, cat, n, how, extra);

export const memJeigh: AreaBundle = finalize([1350, 3350], {
  area: {
    id: J,
    name: "Memory of Jeigh",
    shape: [[-160, -100], [120, -120], [200, 10], [130, 120], [-130, 120], [-200, 10]],
    label: [0, -70],
    description: "The Giant Lord's assault on the fort, entered through the giant's remains behind The Place Unbeknownst. Five minutes to cross the bombarded wall and slay the Giant Lord for the Giant's Kinship. The only memory required to finish the game.",
    connections: ["fofg"],
    recommendedLevel: "110+",
    source: JSRC,
  },
  nodes: [
    node(J, "mem_jeigh.entrance", "Memory entrance", "entrance", -150, 20, "Summon signs for Benhart and Captain Drummond by the wall."),
    node(J, "mem_jeigh.wall", "Bombarded battlement", "landmark", -20, -40, "Fireballs rain on the wall; the statue head rolls and crushes the two Warrior Giants."),
    node(J, "mem_jeigh.giant_lord", "Giant Lord arena", "boss", 120, 20, "Far end of the wall; battlement on the left for ranged fighters."),
  ],
  bonfires: [],
  bosses: [
    { id: "boss.giant_lord", name: "Giant Lord", areaId: J, node: "mem_jeigh.giant_lord", required: true, description: "The leader of the Giants' invasion. Huge sword sweeps and a shockwave slam; the Giant's Kinship he drops is needed to sit on the Throne of Want. Best soul farm in the game with Bonfire Ascetics.", drops: ["Giant Lord Soul", "Giant's Kinship"], note: "Required for the ending.", source: FEX + "Giant+Lord" },
  ],
  items: [
    ij("Bonfire Ascetic", "ascetic", "mem_jeigh.wall", "Run left along the battlement after the fog door; corpse on the wall."),
    ij("Old Radiant Lifegem", "lifegem", "mem_jeigh.giant_lord", "Behind a pillar on the right near the Giant Lord (Divine Blessing in NG+)."),
    ij("Fire Seed", "consumable", "mem_jeigh.giant_lord", "Battlement to the left of the Giant Lord."),
    ij("Soul of a Giant", "unique", "mem_jeigh.giant_lord", "Giant lying on bricks down the stairs behind the Giant Lord; examine it (also exits the memory).", { prerequisites: ["Giant Lord defeated"] }),
    ij("Giant's Kinship", "key", "mem_jeigh.giant_lord", "Dropped by the Giant Lord; lets you sit on the Throne of Want.", { prerequisites: ["Giant Lord defeated"] }),
    ij("Twinkling Titanite", "twinkling", "mem_jeigh.entrance", "Ledge to the left of the giant statue where you enter the memory."),
  ],
  npcs: [
    { id: "npc.benhart_jeigh", name: "Benhart of Jugo (summon)", areaId: J, node: "mem_jeigh.entrance", role: "summon", description: "Summon sign by the wall (only after speaking to him in the Memory of Orro). Needed for his questline (Bluemoon Greatsword).", source: JSRC },
    { id: "npc.drummond_jeigh", name: "Captain Drummond (summon)", areaId: J, node: "mem_jeigh.entrance", role: "summon", description: "Summon sign by the wall at the entrance.", source: JSRC },
  ],
  features: [
    { id: "ft.jeigh.timer", name: "Five-minute memory timer", kind: "lever", areaId: J, node: "mem_jeigh.entrance", description: "You are ejected from the memory after five minutes.", source: JSRC },
  ],
  edges: [
    edge("mem_jeigh.entrance", "mem_jeigh.wall", 1, "Straight ahead and left onto the battlement."),
    edge("mem_jeigh.wall", "mem_jeigh.giant_lord", 1, "Across the wall between bombardments; the statue head clears the giants."),
  ],
}, JSRC);

// ---------- Memory of Orro ----------
const O = "mem_orro";
const OSRC = FEX + "Memory+of+Orro";
const io = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(O, name, cat, n, how, extra);

export const memOrro: AreaBundle = finalize([1750, 3600], {
  area: {
    id: O,
    name: "Memory of Orro",
    shape: [[-160, -100], [120, -120], [200, 10], [130, 120], [-130, 120], [-200, 10]],
    label: [0, -70],
    description: "The fort under siege, entered from the giant's remains behind the Pursuer's arena. Benhart of Jugo waits inside; Royal Soldiers and Giants tear each other apart in the courtyard while you collect a Soul of a Giant.",
    connections: ["fofg"],
    recommendedLevel: "110+",
    source: OSRC,
  },
  nodes: [
    node(O, "mem_orro.entrance", "Benhart's room", "entrance", -150, 20, "Benhart of Jugo across the room; stairs left, passage right."),
    node(O, "mem_orro.upper", "Upper floors & Pharros' rooms", "landmark", -20, -60, "Four soldiers, Pharros' secret walls (Steel Set, Soul of a Hero chest), rooftop giants, crane platform."),
    node(O, "mem_orro.courtyard", "Courtyard", "landmark", 120, 40, "Giants vs. ballista soldiers; Soul of a Giant on the staircase."),
  ],
  bonfires: [],
  bosses: [],
  items: [
    io("Fading Soul", "soul", "mem_orro.upper", "Behind the four soldiers up the left staircase."),
    io("Soul of a Hero", "soul", "mem_orro.upper", "First Pharros' contraption right of the entrance reveals a wall; trapped wooden chest behind it.", { qty: 3, prerequisites: ["Pharros' Lockstone"] }),
    io("Steel Set", "armor", "mem_orro.upper", "Illusory wall right of the first Pharros' contraption: iron chest.", { prerequisites: ["Pharros' Lockstone"] }),
    io("Fire Seed", "consumable", "mem_orro.upper", "Second iron chest in the illusory-wall room.", { prerequisites: ["Pharros' Lockstone"] }),
    io("Soul of a Brave Warrior", "soul", "mem_orro.upper", "Drop between the fireball and club giants onto a small bridge."),
    io("Wilted Dusk Herb", "consumable", "mem_orro.courtyard", "Drop from the far end of the scaffold to a roof.", { qty: 3 }),
    io("Soul of a Proud Knight", "soul", "mem_orro.courtyard", "Ladder up to the scaffold across the courtyard."),
    io("Soul of a Great Hero", "soul", "mem_orro.courtyard", "Corpse right of the passage entrance into the courtyard (with Soul Vessel)."),
    io("Soul Vessel", "soul-vessel", "mem_orro.courtyard", "Corpse near the passage entrance into the courtyard."),
    io("Soul of a Giant", "unique", "mem_orro.courtyard", "Examine the giant's body on the small staircase at the far end of the courtyard."),
    io("Simpleton's Spice", "consumable", "mem_orro.upper", "Attack the crane on the top floor, drop onto its platform and jump into the hole: iron chest (with Skeptic's Spice)."),
    io("Skeptic's Spice", "consumable", "mem_orro.upper", "Crane-platform room chest."),
    io("Bonfire Ascetic", "ascetic", "mem_orro.upper", "Second iron chest in the crane-platform room.", { qty: 3 }),
  ],
  npcs: [
    { id: "npc.benhart_orro", name: "Benhart of Jugo", areaId: O, node: "mem_orro.entrance", role: "npc", description: "Waits at the memory entrance; talking to him here enables his sign in the Memory of Jeigh.", source: OSRC },
  ],
  features: [
    { id: "ft.orro.pharros", name: "Pharros' contraptions & illusory wall", kind: "pharros", areaId: O, node: "mem_orro.upper", requires: "Pharros' Lockstone", description: "First contraption opens the secret wall; the second only arms a blade trap. Illusory wall to its right hides the Steel Set.", source: OSRC },
    { id: "ft.orro.crane", name: "Crane platform jump", kind: "shortcut", areaId: O, node: "mem_orro.upper", description: "Hit the crane, drop to its platform and sprint-jump into the hole for the Ascetic chests.", source: OSRC },
  ],
  edges: [
    edge("mem_orro.entrance", "mem_orro.upper", 1, "Staircase on the left."),
    edge("mem_orro.entrance", "mem_orro.courtyard", 1, "Small passage on the right."),
    edge("mem_orro.upper", "mem_orro.courtyard", 1, "Drop from the bridge between the giants down to the courtyard.", { kind: "drop", oneWay: true }),
  ],
}, OSRC);

// ---------- Memory of Vammar ----------
const V = "mem_vammar";
const VSRC = FEX + "Memory+of+Vammar";
const iv = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(V, name, cat, n, how, extra);

export const memVammar: AreaBundle = finalize([1350, 3750], {
  area: {
    id: V,
    name: "Memory of Vammar",
    shape: [[-160, -100], [120, -120], [200, 10], [130, 120], [-130, 120], [-200, 10]],
    label: [0, -70],
    description: "A giant's memory of the battle, entered from the remains near Pate's trap courtyard. Captain Drummond holds the line; Giants, Sorcerer Giants and Royal Soldiers clash across the rooftops.",
    connections: ["fofg"],
    recommendedLevel: "110 to 120",
    source: VSRC,
  },
  nodes: [
    node(V, "mem_vammar.entrance", "Drummond's hall", "entrance", -150, 20, "Long hallway to Captain Drummond and the dead soldiers."),
    node(V, "mem_vammar.battle", "Giant battle yard", "landmark", 0, -40, "Club Giant and Sorcerer Giant, then the big giant/soldier melee; ladder to the rooftops."),
    node(V, "mem_vammar.tower", "Tower & exit", "landmark", 130, 40, "Giant Warrior Club corpse, Petrified Something chest, rooftop Ascetic, the exit giant."),
  ],
  bonfires: [],
  bosses: [],
  items: [
    iv("Smooth & Silky Stone", "unique", "mem_vammar.entrance", "Chest in the door opposite Captain Drummond.", { qty: 5 }),
    iv("Drangleic Helm", "armor", "mem_vammar.entrance", "Given by Captain Drummond after you have killed the Giant Lord."),
    iv("Fire Seed", "consumable", "mem_vammar.battle", "End of the hallway where the first giant breaks the door."),
    iv("Large Soul of a Brave Warrior", "soul", "mem_vammar.battle", "Wooden planks up the far-left wall of the Club/Sorcerer Giant yard."),
    iv("Giant Warrior Club", "weapon", "mem_vammar.tower", "Corpse on the right before entering the tower (with Soul of a Great Hero)."),
    iv("Soul of a Great Hero", "soul", "mem_vammar.tower", "Corpse before the tower."),
    iv("Petrified Something", "unique", "mem_vammar.tower", "Iron chest left of the tower."),
    iv("Bonfire Ascetic", "ascetic", "mem_vammar.tower", "Ladder in the tower to the rooftop with two Sorcerer Giants; corpse in the corner behind them."),
    iv("Crimson Water", "consumable", "mem_vammar.tower", "Alcove left out of the tower's back room."),
    iv("Soul of a Great Hero", "soul", "mem_vammar.tower", "Corpse draped over the edge of the top platform (with Torch), by the dual-club giant."),
    iv("Torch", "consumable", "mem_vammar.tower", "Corpse on the top platform."),
    iv("Soul of a Giant", "unique", "mem_vammar.tower", "Dead giant slumped against the door on the top platform; examining it exits the memory."),
    iv("Rouge Water", "consumable", "mem_vammar.tower", "Listed by Fextralife for the memory.", { note: "Exact spot not given by the wiki." }),
    iv("Petrified Something", "unique", "mem_vammar.tower", "Second Petrified Something appears from NG+ onward.", { ngPlusOnly: true }),
  ],
  npcs: [
    { id: "npc.drummond", name: "Captain Drummond", areaId: V, node: "mem_vammar.entrance", role: "npc", description: "Teaches 'Hurrah!'; gives the Drangleic Helm after the Giant Lord dies. Summonable in the Memory of Jeigh.", source: VSRC },
  ],
  features: [],
  edges: [
    edge("mem_vammar.entrance", "mem_vammar.battle", 1, "Door behind Drummond (a giant smashes it), hole in the wall."),
    edge("mem_vammar.battle", "mem_vammar.tower", 1, "Doorway on the right, through the melee, ladder up to the roofs and the tower."),
  ],
}, VSRC);

// Entrance edges from the Forest (defined in fofg.ts) reference mem_*.entrance nodes.
export const memoryEntryRequirement = AMH;
