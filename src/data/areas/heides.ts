import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "heides";
const SRC = FEX + "Heide's+Tower+of+Flame";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([4700, 2600], {
  area: {
    id: A,
    name: "Heide's Tower of Flame",
    shape: [[-300, -180], [0, -240], [300, -160], [360, 80], [180, 240], [-160, 240], [-340, 60]],
    label: [0, -140],
    description: "Flooded towers and walkways east of Majula, patrolled by Old Knights and resting Heide Knights. The Dragonrider guards the way to No-man's Wharf; the drawbridge past the dragon leads to the Cathedral of Blue.",
    connections: ["majula", "cathedral_blue", "wharf"],
    recommendedLevel: "30 to 40",
    source: SRC,
  },
  nodes: [
    node(A, "heide.entrance", "Waterway exit / Heide's Ruin", "entrance", -260, 40, "Exit of the flooded corridor from Majula; stairs down to the first bonfire on the right."),
    node(A, "heide.ruin", "Heide's Ruin", "bonfire", -220, 130, "Down the staircase to the right of the first Old Knight's platform."),
    node(A, "heide.lever_tower", "First lever platform", "landmark", -80, -40, "Platform with the contraption that raises the far tower ring; long walkway to the three-Old-Knight tower."),
    node(A, "heide.three_knights", "Three Old Knights tower", "landmark", 60, -120, "Tower with three Old Knights; paths split left (dragon) and right (Dragonrider)."),
    node(A, "heide.dragon", "Hellkite dragon platform", "landmark", 220, -160, "SotFS: a Guardian-style dragon guards the drawbridge lever to the Cathedral of Blue."),
    node(A, "heide.dragonrider", "Dragonrider arena", "boss", 200, 20, "Mist on the lower platform past the Heide Knight resting on the Ring of Binding chest."),
    node(A, "heide.tower_of_flame", "Tower of Flame", "bonfire", 250, 120, "Inside the tower after the Dragonrider; Licia of Lindelt waits here."),
    node(A, "heide.lower_halls", "Lower halls & elevator", "landmark", 120, 190, "Spiral stair, Old Knight hallway, Syan Soldier chest room and the pressure-plate elevator."),
    node(A, "heide.flooded", "Flooded corridor to the Wharf", "landmark", 0, 220, "Basilisk and Hollow Infantry in the water; petrified statue to the Knight Set corridor; hole in the wall to the Wharf bonfire."),
  ],
  bonfires: [
    { id: "heide.ruin", name: "Heide's Ruin", areaId: A, note: "Just after entering from Majula: take the staircase down on the right before the first Old Knight.", source: SRC },
    { id: "heide.tower_of_flame", name: "Tower of Flame", areaId: A, note: "Through the doorway and up the stairs after defeating the Dragonrider.", source: SRC },
  ],
  bosses: [
    { id: "boss.dragonrider", name: "Dragonrider", areaId: A, node: "heide.dragonrider", required: true, description: "Halberd-and-greatshield knight in a small arena over the water; raising the platform with the levers gives more room. Guards the path onward to No-man's Wharf.", drops: ["Dragonrider Soul"], note: "Optional overall (Heide's can be bypassed via the Forest→Bastille eagle), but required to reach No-man's Wharf from Heide's. Fextralife counts it as required: only the 1,000,000 Soul Memory Shrine of Winter skip makes it optional.", source: FEX + "Dragonrider" },
  ],
  items: [
    i("Soul of a Nameless Soldier", "soul", "heide.entrance", "Corpse draped over the railing behind the mace-wielding Old Knight up the first stairs (with Human Effigy)."),
    i("Human Effigy", "effigy", "heide.entrance", "Corpse on the railing behind the mace Old Knight up the first stairs."),
    i("Lloyd's Talisman", "consumable", "heide.lever_tower", "In front of one of the arch columns on the first lever platform."),
    i("Divine Blessing", "consumable", "heide.dragon", "Left path from the three-knight tower: broken dead-end staircase down near the water."),
    i("Petrified Dragon Bone", "dragon-bone", "heide.dragon", "Dropped by the dragon guarding the drawbridge to the Cathedral of Blue (SotFS)."),
    i("Watchdragon Parma", "shield", "heide.dragon", "Dropped by the dragon guarding the drawbridge to the Cathedral of Blue (SotFS)."),
    i("Ring of Binding", "ring", "heide.dragonrider", "Chest on the lower platform before the Dragonrider mist; a Heide Knight rests on it."),
    i("Monastery Charm", "consumable", "heide.tower_of_flame", "Hidden behind the spiral staircase in the tower after the bonfire."),
    i("Human Effigy", "effigy", "heide.lower_halls", "Corpse hanging over the railing at the end of the Old Knight hallway (with Dark Troche)."),
    i("Dark Troches", "consumable", "heide.lower_halls", "Corpse over the railing at the end of the Old Knight hallway."),
    i("Soul of a Proud Knight", "soul", "heide.lower_halls", "Corpses at the end of the Old Knight hallway."),
    i("Old Knight Halberd", "weapon", "heide.lower_halls", "Corpse at the end of the Old Knight hallway."),
    i("Sublime Bone Dust", "bone-dust", "heide.lower_halls", "Metal chest in the dead end to the left after the stairs down from the Old Knight hallway, guarded by a Syan Soldier."),
    i("Estus Flask Shard", "estus-shard", "heide.flooded", "Un-petrify the statue behind the Basilisk in the flooded corridor, go up the stairs past the Primal Knight; corpse hanging on the railing.", { prerequisites: ["Fragrant Branch of Yore"] }),
    i("Knight Set", "armor", "heide.flooded", "Iron chest in the alcove at the right end of the corridor past the un-petrified statue and Primal Knight.", { prerequisites: ["Fragrant Branch of Yore"] }),
    i("Old Radiant Lifegem", "lifegem", "heide.lower_halls", "Listed by Fextralife for Heide's Tower of Flame (SotFS corpse in the lower halls).", { note: "Exact spot not given by the wiki." }),
    i("Saint's Set", "armor", "heide.tower_of_flame", "Given by Licia of Lindelt at the Tower of Flame if your Faith is 30 (with the Idol's Charm).", { note: "Reward, not a ground pickup." }),
    i("Idol's Charm", "consumable", "heide.tower_of_flame", "Given by Licia of Lindelt when your Faith reaches 30."),
  ],
  npcs: [
    { id: "npc.licia", name: "Licia of Lindelt", areaId: A, node: "heide.tower_of_flame", role: "merchant", description: "Miracle merchant beside the Tower of Flame bonfire. Moves to the Majula rotunda after her dialogue; opens the path to Huntsman's Copse for 2,000 souls.", wares: ["Heal", "Force", "Caressing Prayer", "Ring of Prayer", "Cleric's Sacred Chime"], source: SRC },
    { id: "npc.scarlett_heide", name: "Devotee Scarlett (summon)", areaId: A, node: "heide.dragonrider", role: "summon", description: "SotFS summon sign for the Dragonrider (also before the drawbridge dragon if summoned earlier at Earthen Peak).", source: "http://darksouls2.wikidot.com/bosses" },
    { id: "npc.glencour", name: "Masterless Glencour (summon)", areaId: A, node: "heide.dragonrider", role: "summon", description: "NPC summon sign outside and to the right of the Dragonrider mist.", source: SRC },
  ],
  features: [
    { id: "ft.heide.lever1", name: "Platform contraption lever", kind: "lever", areaId: A, node: "heide.lever_tower", description: "Raises the outer ring of the Dragonrider's platform, enlarging the arena.", source: SRC },
    { id: "ft.heide.drawbridge", name: "Drawbridge to the Cathedral of Blue", kind: "lever", areaId: A, node: "heide.dragon", description: "Lever on the dragon's platform lowers the bridge to the Cathedral of Blue.", source: SRC },
    { id: "ft.heide.statue", name: "Petrified statue (Knight Set corridor)", kind: "locked-door", areaId: A, node: "heide.flooded", requires: "Fragrant Branch of Yore", description: "Blocks the stairs to the Primal Knight corridor with the Estus Flask Shard and Knight Set.", source: SRC },
  ],
  edges: [
    edge("heide.entrance", "heide.ruin", 1, "Staircase on the right before the first Old Knight platform."),
    edge("heide.entrance", "heide.lever_tower", 1, "Up the stairs past the mace Old Knight and through the archway."),
    edge("heide.lever_tower", "heide.three_knights", 1, "Left from the lever across the long walkway into the tower."),
    edge("heide.three_knights", "heide.dragon", 1, "Left exit: Old Knight, hostile Heide Knight, stairs up past the railing-less platform to the dragon."),
    edge("heide.dragon", "cob.entrance", 1, "Pull the lever on the dragon's platform to lower the drawbridge to the Cathedral of Blue."),
    edge("heide.three_knights", "heide.dragonrider", 1, "Right exit: walkway with the resting Heide Knight, stairs down to the Ring of Binding platform and the mist."),
    edge("heide.dragonrider", "heide.tower_of_flame", 1, "Doorway and stairs up after the boss.", { requires: [req.boss("Dragonrider")] }),
    edge("heide.tower_of_flame", "heide.lower_halls", 1, "Walkway to the spiral-stair tower, down the hall past the Old Knight and down the stairs."),
    edge("heide.lower_halls", "heide.flooded", 1, "Pressure-plate elevator down to the flooded corridors.", { kind: "elevator" }),
    edge("heide.flooded", "wharf.unseen_path", 1, "Knocked-out hole in the wall at the end of the corridor leads to the Wharf bonfire."),
  ],
}, SRC);
