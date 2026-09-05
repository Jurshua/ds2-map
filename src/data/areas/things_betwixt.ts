import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "things_betwixt";
const SRC = FEX + "Things+Betwixt";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([2500, 2300], {
  area: {
    id: A,
    name: "Things Betwixt",
    shape: [[-280, -160], [80, -220], [320, -120], [340, 120], [140, 240], [-200, 220], [-340, 40]],
    label: [0, -110],
    description: "A cold, dark cave and misty forest where the journey begins. Home of the Fire Keepers, the tutorial mists, the coffin that changes gender, and Dyna & Tillo's nest.",
    connections: ["majula"],
    recommendedLevel: "Any",
    source: SRC,
  },
  nodes: [
    node(A, "tb.gazebo", "Starting Gazebo", "entrance", -220, 40, "Where the game begins; Prowler Hounds roam the grass."),
    node(A, "tb.ogre_path", "Hidden Ogre Path", "landmark", -120, 140, "Bushy break before the wooden bridge; an Ogre guards a corpse."),
    node(A, "tb.dwelling", "Fire Keepers' Dwelling", "bonfire", 0, 0, "Bonfire outside the Fire Keepers' house."),
    node(A, "tb.tutorial", "Tutorial Mists", "landmark", 130, -60, "Path with tutorial mist doors on either side."),
    node(A, "tb.nest", "Dyna & Tillo's Nest", "landmark", 210, -150, "Crows' nest on the ledge above the first tutorial tunnel."),
    node(A, "tb.coffin", "Coffin Beach", "landmark", 260, 90, "Beach with two Ogres and the gender-changing coffin; behind the petrified statue."),
    node(A, "tb.exit", "Path to Majula", "entrance", 220, 190, "Narrow path leading down to Majula."),
  ],
  bonfires: [
    { id: "tb.dwelling", name: "Fire Keepers' Dwelling", areaId: A, note: "Right outside the Fire Keepers' house after character creation. Soul Vessel respec happens with the Fire Keepers here.", source: SRC },
  ],
  bosses: [],
  items: [
    i("Rusted Coin", "consumable", "tb.gazebo", "Hug the right-hand mountain wall from the starting grassland, through a stone arch, to a corpse on the cliff. (x5 in NG+)"),
    i("Gold Pine Resin", "consumable", "tb.ogre_path", "Take the bushy break on the left before the wooden bridge and follow the footprints; on the corpse the Ogre is guarding."),
    i("Stone Ring", "ring", "tb.ogre_path", "Dropped by the Ogre guarding the Gold Pine Resin corpse on the hidden path."),
    i("Small Smooth & Silky Stone", "unique", "tb.ogre_path", "Past the small wooden bridge, pass through the bushes between you and the larger bridge to a path under the waterfall. (x3 in NG+)"),
    i("Human Effigy", "effigy", "tb.dwelling", "Chest upstairs inside the Fire Keepers' house."),
    i("Soul of a Lost Undead", "soul", "tb.dwelling", "Break the cart to the right of the house door."),
    i("Torch", "consumable", "tb.dwelling", "Break the cart to the right of the house door (same corpse as the Soul of a Lost Undead)."),
    i("Dagger", "weapon", "tb.tutorial", "First mist door: after the first hollows, climb the small hill outside the tree tunnel."),
    i("Lifegem", "lifegem", "tb.tutorial", "First mist door: corpse in the ramp area after the back-step stone and the two hollows."),
    i("Soul of a Nameless Soldier", "soul", "tb.tutorial", "First mist door: after the camera stone, drop to the ledge below."),
    i("Amber Herb", "consumable", "tb.tutorial", "Second mist door: jump the small gap in front of the dash-jump stone to a corpse.", { qty: 2 }),
    i("Cracked Red Eye Orb", "consumable", "tb.tutorial", "Second mist door: up the ladder, through the wooden door to a small dead-end room."),
    i("Estus Flask Shard", "estus-shard", "tb.coffin", "Third mist door (blocked by a petrified statue; needs a Fragrant Branch of Yore). Drop down the hole past the Basilisks to the corpse.", { prerequisites: ["Fragrant Branch of Yore"] }),
    i("Twinkling Titanite", "twinkling", "tb.coffin", "Dropped by the Pursuer that appears on the coffin beach (SotFS). He leaves if you do not fight.", { prerequisites: ["Fragrant Branch of Yore"] }),
    i("Petrified Something", "unique", "tb.gazebo", "SotFS: light every sconce in Things Betwixt and a Dark Spirit spawns near the area entrance; it drops this."),
    i("Handmaid's Ladle", "weapon", "tb.dwelling", "Given by Milibeth in the Fire Keepers' house after killing the three Ogres in Things Betwixt."),
    i("Human Effigy", "effigy", "tb.dwelling", "Given by the Fire Keepers during the intro cutscene and used immediately."),
  ],
  npcs: [
    { id: "npc.firekeepers", name: "The Three Fire Keepers (Strowen, Morrel, Griant)", areaId: A, node: "tb.dwelling", role: "npc", description: "Inside the Fire Keepers' Dwelling. Strowen can respec your character in exchange for a Soul Vessel.", source: SRC },
    { id: "npc.milibeth", name: "Milibeth", areaId: A, node: "tb.dwelling", role: "npc", description: "Young handmaid inside the Fire Keepers' house. Gives the Handmaid's Ladle after you kill the three Ogres.", source: SRC },
    { id: "npc.dyna_tillo", name: "Dyna & Tillo", areaId: A, node: "tb.nest", role: "npc", description: "Crows' nest above the tutorial tunnel. Leave Smooth & Silky Stones, Petrified Something and other trade items for rewards.", source: SRC },
  ],
  features: [
    { id: "ft.tb.statue", name: "Petrified statue (third mist door)", kind: "locked-door", areaId: A, node: "tb.tutorial", requires: "Fragrant Branch of Yore", description: "Un-petrify to reach the Basilisk chamber, the Estus Flask Shard and the coffin beach.", source: SRC },
    { id: "ft.tb.coffin", name: "Gender-change coffin", kind: "lever", areaId: A, node: "tb.coffin", description: "Entering the coffin changes your character's gender (cosmetic, reversible).", source: SRC },
  ],
  edges: [
    edge("tb.gazebo", "tb.ogre_path", 1, "Bushy break on the left before the wooden bridge."),
    edge("tb.gazebo", "tb.dwelling", 1, "Straight ahead to the big doors and the Fire Keepers' house."),
    edge("tb.ogre_path", "tb.dwelling", 1, "Cross the small bridge and drop down to the house doors."),
    edge("tb.dwelling", "tb.tutorial", 1, "Through the wooded tunnel ahead of the house."),
    edge("tb.tutorial", "tb.nest", 1, "First mist door tunnel, then left at the top; kick the ladder down to return.", { kind: "ladder" }),
    edge("tb.tutorial", "tb.coffin", 2, "Third mist door, blocked by a petrified statue.", { requires: [req.branch("Statue blocks the third mist door")] }),
    edge("tb.tutorial", "tb.exit", 1, "Continue along the main path to the final gate."),
    edge("tb.exit", "maj.betwixt_path", 2, "Narrow cliff path down into Majula."),
  ],
}, SRC);
