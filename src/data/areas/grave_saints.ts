import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "grave_saints";
const SRC = FEX + "Grave+of+Saints";
const WDS = "http://darksouls2.wikidot.com/scholar-of-the-first-sin";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([3300, 3200], {
  area: {
    id: A,
    name: "Grave of Saints",
    shape: [[-260, -150], [40, -200], [280, -110], [300, 80], [140, 200], [-160, 200], [-320, 40]],
    label: [0, -120],
    description: "Rat-infested catacombs part-way down Majula's pit. Pharros' contraptions here mostly help Rat King covenant members; Rhoy the Explorer invades on the way to the Royal Rat Vanguard. Coffin ledges below lead to the bridges above The Gutter.",
    connections: ["majula", "gutter"],
    recommendedLevel: "45 to 55",
    source: SRC,
  },
  nodes: [
    node(A, "grave.ledge", "Pit ledge entrance", "entrance", -280, -20, "Torch-lined ledge in Majula's pit; two Hollow Prisoners on the way in."),
    node(A, "grave.harval", "Harval's Resting Place", "bonfire", -200, 60, "First bonfire just inside from the pit ledge."),
    node(A, "grave.fountain", "Dry fountain chamber", "landmark", -80, 0, "Corpse Rats pour out of the walls; fountain with the skeleton (reached from above later)."),
    node(A, "grave.bridge_hall", "Pharros' bridge hall", "landmark", 40, -100, "Lockstone lowers the bridge to the petrified-rat room; Whisper of Despair stairs."),
    node(A, "grave.upper", "Upper level (Rhoy)", "landmark", 120, 20, "Ladder up: Rhoy the Explorer invades; tomb with Homeward Bones; acid-pool contraptions."),
    node(A, "grave.entrance_bf", "Grave Entrance", "bonfire", 220, -60, "Beside the mist door at the end of the upper level."),
    node(A, "grave.vanguard", "Royal Rat Vanguard arena", "boss", 260, 40, "Mist door next to the Grave Entrance bonfire."),
    node(A, "grave.rat_king", "Rat King's chamber", "landmark", 180, 130, "After the boss; hole in the floor drops to the fountain and the coffin pit."),
    node(A, "grave.bridges", "Bridges above The Gutter", "landmark", 20, 150, "Stone bridge (Crystal Lizard, Disc Chime ledge) and wooden bridge (Ash Knuckle Ring); Sublime Bone Dust tunnel; scaffolding ladders down."),
  ],
  bonfires: [
    { id: "grave.harval", name: "Harval's Resting Place", areaId: A, note: "Right after entering from the torch-lined ledge in Majula's pit.", source: SRC },
    { id: "grave.entrance_bf", name: "Grave Entrance", areaId: A, note: "Upper level after Rhoy's invasion, beside the Royal Rat Vanguard's mist door.", source: SRC },
  ],
  bosses: [
    { id: "boss.royal_rat_vanguard", name: "Royal Rat Vanguard", areaId: A, node: "grave.vanguard", required: false, description: "A swarm of rats; the Vanguard (mohawk, big ears) joins after enough die. Kill it to end the fight.", drops: ["Royal Rat Vanguard Soul"], note: "Optional; unlocks the Rat King covenant here.", source: FEX + "Royal+Rat+Vanguard" },
  ],
  items: [
    i("Large Soul of a Nameless Soldier", "soul", "grave.fountain", "Skeleton in the dry fountain chamber."),
    i("Small Smooth & Silky Stone", "unique", "grave.bridge_hall", "Left at the junction after the lit stairs, past a Hollow Prisoner.", { qty: 3 }),
    i("Poison Moss", "consumable", "grave.bridge_hall", "Across the Pharros' bridge, corpse in the petrified-rat room (three rats emerge).", { qty: 2, prerequisites: ["Pharros' Lockstone"] }),
    i("Whisper of Despair", "spell", "grave.bridge_hall", "Skeleton up the stairs past the Poison Moss (with Torch).", { prerequisites: ["Pharros' Lockstone"] }),
    i("Torch", "consumable", "grave.bridge_hall", "Skeleton with the Whisper of Despair.", { prerequisites: ["Pharros' Lockstone"] }),
    i("Homeward Bone", "consumable", "grave.upper", "Tomb to the left on the upper level with three rats.", { qty: 3 }),
    i("Repair Powder", "consumable", "grave.upper", "Listed by Fextralife for the area (upper level corpse).", { note: "Exact spot not given by the wiki." }),
    i("Armor of Aurous", "armor", "grave.upper", "Random drop from Rhoy the Explorer (also Shotel +5, Heavy Crossbow +5, Warmth).", { note: "Invader drop." }),
    i("Warmth", "spell", "grave.upper", "Random drop from Rhoy the Explorer.", { note: "Invader drop." }),
    i("Crest of the Rat", "ring", "grave.rat_king", "Given by the Rat King when joining the covenant after the Vanguard."),
    i("Pharros' Lockstone", "lockstone", "grave.rat_king", "Drop through the hole after the Rat King into the fountain; corpse below."),
    i("Bleed Stone", "titanite", "grave.bridges", "Skeleton on the stone bridge above the broken wooden bridge."),
    i("Disc Chime", "weapon", "grave.bridges", "Jump from the stone bridge to the small ledge with the corpse."),
    i("Ash Knuckle Ring", "ring", "grave.bridges", "Chest at the far end of the wooden bridge; running jump across the gap."),
    i("Sublime Bone Dust", "bone-dust", "grave.bridges", "Water pit below the bridges: the flooded tunnel, chest guarded by a Syan Soldier (SotFS: Royal Knight).", { source: WDS }),
    i("Great Heal", "spell", "grave.bridges", "Skeleton in the flooded tunnel near the Sublime Bone Dust (SotFS).", { source: WDS }),
    i("Human Effigy", "effigy", "grave.bridges", "Scaffolding tunnel: after the first one-way drop, ladder to the right then another ladder to the corpse."),
    i("Radiant Lifegem", "lifegem", "grave.bridges", "Scaffolding ladders down, corpse near the bottom before the last one-way ladder."),
    i("Token of Spite", "unique", "grave.bridges", "Chest at the base of the final scaffolding ladder before the tunnel to The Gutter."),
  ],
  npcs: [
    { id: "npc.rat_king_grave", name: "Rat King", areaId: A, node: "grave.rat_king", role: "covenant", description: "In the chamber after the Royal Rat Vanguard. Lets you join the Rat King covenant; gives the Crest of the Rat.", source: SRC },
    { id: "npc.rhoy", name: "Rhoy the Explorer (invader)", areaId: A, node: "grave.upper", role: "npc", description: "Scripted invasion at the top of the ladder; respawns with a Bonfire Ascetic (Awestone farming).", source: SRC },
  ],
  features: [
    { id: "ft.grave.bridge_lock", name: "Pharros' bridge contraption", kind: "pharros", areaId: A, node: "grave.bridge_hall", requires: "Pharros' Lockstone", description: "Floor face at the junction lowers the bridge to the petrified-rat room (Poison Moss, Whisper of Despair).", source: SRC },
    { id: "ft.grave.covenant_traps", name: "Rat covenant contraptions", kind: "pharros", areaId: A, node: "grave.upper", requires: "Pharros' Lockstone", description: "Waterfall, acid pools and bridges that mainly help Rat King covenant hosts.", source: SRC },
    { id: "ft.grave.pit_hole", name: "Hole to the fountain & coffin pit", kind: "shortcut", areaId: A, node: "grave.rat_king", description: "One-way drop from the Rat King's chamber into the fountain, then down the jutting coffins to the bridges.", source: SRC },
  ],
  edges: [
    edge("grave.ledge", "grave.harval", 1, "Straight in past two Hollow Prisoners."),
    edge("grave.harval", "grave.fountain", 1, "Into the large chamber."),
    edge("grave.fountain", "grave.bridge_hall", 1, "Lit area, up the small stairs; junction with the Pharros' floor face."),
    edge("grave.bridge_hall", "grave.upper", 1, "Right at the junction, down past the waterfall face, up the ladder (Rhoy invades).", { kind: "ladder" }),
    edge("grave.upper", "grave.entrance_bf", 1, "Right along the upper level."),
    edge("grave.entrance_bf", "grave.vanguard", 1, "Mist door beside the bonfire."),
    edge("grave.vanguard", "grave.rat_king", 1, "Door after the arena.", { requires: [req.boss("Royal Rat Vanguard")] }),
    edge("grave.rat_king", "grave.bridges", 2, "Hole in the floor to the fountain, then jump down the coffins to the stone bridge (one-way).", { oneWay: true, kind: "drop" }),
    edge("grave.bridges", "gutter.upper", 2, "Drop to the water pit, take the dry tunnel and the scaffolding ladders down (one-way) to the tunnel into The Gutter.", { oneWay: true, kind: "drop" }),
    edge("grave.bridges", "maj.pit", 1, "Stairway at the far end of the wooden bridge leads back to the ledge in Majula's pit.", { kind: "walk" }),
  ],
}, SRC);
