import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "dshrine";
const SRC = FEX + "Dragon+Shrine";
const WDS = "http://darksouls2.wikidot.com/scholar-of-the-first-sin";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([5800, 650], {
  area: {
    id: A,
    name: "Dragon Shrine",
    shape: [[-280, -160], [40, -220], [300, -140], [340, 40], [200, 180], [-120, 200], [-320, 60]],
    label: [0, -120],
    description: "The mountaintop shrine of the Ancient Dragon beyond the Aerie's bridge. Drakekeepers and rows of (initially passive) Dragon Knights guard the stairs; the Ancient Dragon grants the Ashen Mist Heart that opens the Memories of the Ancients.",
    connections: ["aerie"],
    recommendedLevel: "105 to 115",
    source: SRC,
  },
  nodes: [
    node(A, "dshrine.entrance", "Shrine Entrance", "bonfire", -280, 20, "Small building left of the first stairs; Aldia appears on the first attempt."),
    node(A, "dshrine.lower", "Lower shrine (Judgement Set)", "landmark", -140, -80, "First Drakekeeper, Pharros' wall with the Judgement Set, Bonfire Ascetic chest, mace Drakekeeper."),
    node(A, "dshrine.gazebo", "Gazebo & Drakekeeper chest", "landmark", 0, -160, "Twinkling Titanite chest, Faintstone gazebo, jump to the Drakekeeper's Greataxe chest."),
    node(A, "dshrine.slab_landing", "Titanite Slab landing", "landmark", 60, 0, "Drop left of the stairs; Bashful Ray's sign; greathammer Drakekeeper doorway."),
    node(A, "dshrine.egg_shrine", "Petrified Egg shrine", "landmark", 180, -120, "Third Dragon Ring chest (Dragonfang Villard invades), long stairs to the egg; ledges below with the Crystal Magic Weapon chest."),
    node(A, "dshrine.stairs", "Dragon Knight staircase", "landmark", 200, 80, "Massive stair lined with nine Dragon Knights; only the top middle one attacks."),
    node(A, "dshrine.ancient_dragon", "Ancient Dragon platform", "boss", 300, 0, "Open platform at the top; talk for the Ashen Mist Heart, or fight."),
  ],
  bonfires: [
    { id: "dshrine.entrance", name: "Shrine Entrance", areaId: A, note: "Small building to the left of the stairs after the bridge from the Aerie.", source: SRC },
  ],
  bosses: [
    { id: "boss.ancient_dragon", name: "Ancient Dragon", areaId: A, node: "dshrine.ancient_dragon", required: false, description: "Colossal dragon that grants the Ashen Mist Heart peacefully. Fighting it (fire breath from above, stomps) yields a Soul of a Giant.", drops: ["Soul of a Giant"], note: "Optional boss; talking to it is required for the Ashen Mist Heart.", source: FEX + "Ancient+Dragon" },
  ],
  items: [
    i("Judgement Set", "armor", "dshrine.lower", "Pharros' contraption in the arches under the stairs reveals an illusory wall on the left; metal chest inside (Mask, Robe, Manchettes, Tights).", { prerequisites: ["Pharros' Lockstone"] }),
    i("Bonfire Ascetic", "ascetic", "dshrine.lower", "Metal chest through the doorway to the right just before the stairs.", { qty: 3 }),
    i("Twinkling Titanite", "twinkling", "dshrine.gazebo", "Chest up the first flight of stairs past the two Dragon Knights."),
    i("Faintstone", "titanite", "dshrine.gazebo", "In the gazebo structure with two Dragon Knights."),
    i("Drakekeeper's Greataxe", "weapon", "dshrine.gazebo", "Jump through the railing gap from the gazebo to the next platform; metal chest on the right (with Greatshield)."),
    i("Drakekeeper's Greatshield", "shield", "dshrine.gazebo", "Metal chest after the gazebo jump."),
    i("Titanite Slab", "titanite", "dshrine.slab_landing", "Drop down to the lower level left of the stairs after the sword Drakekeeper; chest."),
    i("Skeptic's Spice", "consumable", "dshrine.slab_landing", "Corpse right of the Dragon Knight past the greathammer Drakekeeper (with Twilight Herb)."),
    i("Twilight Herb", "consumable", "dshrine.slab_landing", "Corpse past the greathammer Drakekeeper."),
    i("Third Dragon Ring", "ring", "dshrine.egg_shrine", "Metal chest through the door; opening it triggers Dragonfang Villard, who waits at the shrine upstairs."),
    i("Petrified Egg", "unique", "dshrine.egg_shrine", "On the shrine at the top of the long staircase (after Villard). Give to Magerold to join the Dragon Remnants."),
    i("Petrified Something", "unique", "dshrine.egg_shrine", "Metal chest at the right edge of the shrine platform."),
    i("Crystal Magic Weapon", "spell", "dshrine.egg_shrine", "Drop to the ledge below the Petrified Something chest: metal chest (SotFS: Fragrant Branch of Yore instead).", { note: "wikidot SotFS list: this chest now contains a Fragrant Branch of Yore.", source: WDS }),
    i("Fragrant Branch of Yore", "branch", "dshrine.egg_shrine", "Ledge chest below the shrine platform (with / replacing Crystal Magic Weapon in SotFS)."),
    i("Ashen Mist Heart", "key", "dshrine.ancient_dragon", "Talk to the Ancient Dragon on the top platform. Opens the Memories in the Forest, Tseldora, Undead Crypt (DLC) and Brume Tower (DLC)."),
    i("Soul of a Giant", "unique", "dshrine.ancient_dragon", "Dropped by the Ancient Dragon if you kill it."),
    i("Petrified Dragon Bone", "dragon-bone", "dshrine.stairs", "Listed by Fextralife for the Dragon Shrine.", { note: "Exact spot not given; Dragon Knights also drop them." }),
    i("Staff of Wisdom", "weapon", "dshrine.lower", "Listed by Fextralife for the Dragon Shrine (Mimic chest).", { note: "Mimic drop per the wiki item list." }),
    i("Black Dragon Greataxe", "weapon", "dshrine.stairs", "Rare drop from Dragon Knights.", { note: "Enemy drop." }),
    i("Watchdragon Parma", "shield", "dshrine.stairs", "Drop from Dragon Knights.", { note: "Enemy drop." }),
    i("Washing Pole", "weapon", "dshrine.lower", "Drop from Drakekeepers / listed for the area.", { note: "Enemy drop per the wiki item list." }),
  ],
  npcs: [
    { id: "npc.ancient_dragon", name: "Ancient Dragon", areaId: A, node: "dshrine.ancient_dragon", role: "npc", description: "Grants the Ashen Mist Heart when spoken to.", source: SRC },
    { id: "npc.aldia_shrine", name: "Aldia, Scholar of the First Sin", areaId: A, node: "dshrine.entrance", role: "npc", description: "Appears at the Shrine Entrance bonfire on your first attempt to light it.", source: SRC },
    { id: "npc.villard", name: "Dragonfang Villard (invader)", areaId: A, node: "dshrine.egg_shrine", role: "npc", description: "Invades when the Third Dragon Ring chest is opened; waits at the egg shrine.", source: SRC },
    { id: "npc.bashful_ray_shrine", name: "Bashful Ray (summon)", areaId: A, node: "dshrine.slab_landing", role: "summon", description: "Summon sign before the doorway under the stairs; summoning makes the Dragon Knights hostile.", source: SRC },
  ],
  features: [
    { id: "ft.dshrine.pharros", name: "Pharros' contraption (Judgement Set)", kind: "pharros", areaId: A, node: "dshrine.lower", requires: "Pharros' Lockstone", description: "In the arches under the first big stairs; reveals the illusory wall on the left.", source: SRC },
    { id: "ft.dshrine.knights", name: "Passive Dragon Knights", kind: "lever", areaId: A, node: "dshrine.stairs", description: "Knights stay passive unless you attack, flee a Drakekeeper, summon a phantom or join the Dragon Remnants. Only the top-middle knight on the stairs attacks.", source: SRC },
  ],
  edges: [
    edge("dshrine.entrance", "dshrine.lower", 1, "Up the first stairs to the sword Drakekeeper."),
    edge("dshrine.lower", "dshrine.gazebo", 1, "Through the arches and up the stairs past the mace Drakekeeper."),
    edge("dshrine.gazebo", "dshrine.slab_landing", 1, "Drop from the Greataxe platform to the stairs; sword Drakekeeper; drop left of the stairs.", { kind: "drop" }),
    edge("dshrine.slab_landing", "dshrine.egg_shrine", 1, "Doorway under the stairs, greathammer Drakekeeper, door with the Third Dragon Ring chest, long stairs up."),
    edge("dshrine.egg_shrine", "dshrine.slab_landing", 1, "Drop down the ledges (Petrified Something, Crystal Magic Weapon chests) back to the Slab landing.", { kind: "drop", oneWay: true }),
    edge("dshrine.slab_landing", "dshrine.stairs", 1, "Two wooden doors to the massive staircase."),
    edge("dshrine.stairs", "dshrine.ancient_dragon", 1, "Past the nine knights and the corridor of three to the open platform."),
  ],
}, SRC);
