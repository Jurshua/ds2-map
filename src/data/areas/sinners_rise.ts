import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "sinners_rise";
const SRC = FEX + "Sinners'+Rise";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([600, 1650], {
  area: {
    id: A,
    name: "Sinners' Rise",
    shape: [[-200, -160], [120, -180], [240, -40], [200, 140], [-100, 170], [-260, 40]],
    label: [0, -120],
    description: "A flooded tower prison across the bridge from the Lost Bastille. A respawning Flexile Sentry and Undead Aberrations guard the cells before the Lost Sinner, one of the four Great Ones. Her Primal Bonfire opens the Shrine of Winter.",
    connections: ["bastille"],
    recommendedLevel: "95 to 105 (wiki), 40-60 typical",
    source: SRC,
  },
  nodes: [
    node(A, "sinners.entrance", "Fog gate from the Bastille bridge", "entrance", -200, 0, "Archer above the entrance; ladder up to the bonfire."),
    node(A, "sinners.saltfort", "The Saltfort", "bonfire", -120, -100, "Up the ladder right after the entrance."),
    node(A, "sinners.lift", "Descending lift", "landmark", -20, -20, "Room with three Royal Swordsmen; lift to the flooded dungeon (Lacerating Knife platform)."),
    node(A, "sinners.dungeon", "Flooded dungeon & cells", "landmark", 80, 60, "Respawning Flexile Sentry, Undead Aberrations, four cells, gate mechanism."),
    node(A, "sinners.lost_sinner", "Lost Sinner arena", "boss", 180, 20, "Straight path past the lifted gate; oil rooms on either side light the arena."),
    node(A, "sinners.primal", "Primal Bonfire (Lost Sinner)", "primal", 220, -100, "Down the stairs beyond the boss room."),
  ],
  bonfires: [
    { id: "sinners.saltfort", name: "The Saltfort", areaId: A, note: "Up the ladder immediately after the fog gate from the Bastille bridge.", source: SRC },
    { id: "sinners.primal", name: "Primal Bonfire (Lost Sinner)", areaId: A, primal: true, note: "Beyond the Lost Sinner; warps back to Majula. One of four needed for the Shrine of Winter.", source: SRC },
  ],
  bosses: [
    { id: "boss.lost_sinner", name: "Lost Sinner", areaId: A, node: "sinners.lost_sinner", required: false, description: "Great One who tried to relight the First Flame. Fought in darkness unless the oil in the side rooms is lit (Bastille Key). In NG+ two pyromancer phantoms join her.", drops: ["Soul of the Lost Sinner"], note: "One of the four Old Ones. Not strictly required (Shrine of Winter opens at 1,000,000 soul memory) but part of the normal route.", source: FEX + "Lost+Sinner" },
  ],
  items: [
    i("Large Soul of a Lost Undead", "soul", "sinners.saltfort", "Doorway to the right after the ladder: corpse on a very small ledge."),
    i("Human Effigy", "effigy", "sinners.lift", "Outside the lift building, around the edge to the broken stairs where an archer stands."),
    i("Lacerating Knife", "ammo", "sinners.lift", "Platform just before the bottom of the lift; drop onto it while riding down.", { qty: 5 }),
    i("Blossom Kite Shield", "shield", "sinners.dungeon", "Left alcove after the Flexile Sentry room."),
    i("Northern Ritual Band", "ring", "sinners.dungeon", "Hidden door in the left corner of the right alcove's back wall; hug the left wall outside to the corpse (with Bleed Stone)."),
    i("Bleed Stone", "titanite", "sinners.dungeon", "Hidden door in the right alcove; corpse outside on the ledge."),
    i("Large Soul of a Nameless Soldier", "soul", "sinners.dungeon", "Alcove on the right after the hidden-door alcove."),
    i("Pharros' Lockstone", "lockstone", "sinners.dungeon", "Second left cell on the water level (with Soul of a Proud Knight)."),
    i("Soul of a Proud Knight", "soul", "sinners.dungeon", "Second left cell on the water level."),
    i("Smooth & Silky Stone", "unique", "sinners.dungeon", "Upper-left balcony, first cell: attack the left corner to reveal a hidden corpse."),
    i("Fire Seed", "consumable", "sinners.dungeon", "Upper-left balcony, second cell (Bastille Key) with the resting Heide Knight.", { prerequisites: ["Bastille Key"] }),
    i("Heide Spear", "weapon", "sinners.dungeon", "Kill the resting Heide Knight in the Bastille Key cell."),
    i("Radiant Lifegem", "lifegem", "sinners.lost_sinner", "Narrow path between the stairs to the left of the boss mist."),
    i("Smooth & Silky Stone", "unique", "sinners.lost_sinner", "Right-hand oil room at the top of the stairs before the boss mist.", { prerequisites: ["Bastille Key"] }),
    i("Fragrant Branch of Yore", "branch", "sinners.primal", "Chest on the left before the Primal Bonfire room (with Elizabeth Mushroom).", { prerequisites: ["Lost Sinner defeated"] }),
    i("Elizabeth Mushroom", "consumable", "sinners.primal", "Chest before the Primal Bonfire.", { prerequisites: ["Lost Sinner defeated"] }),
  ],
  npcs: [
    { id: "npc.lucatiel_sinners", name: "Lucatiel of Mirrah (summon)", areaId: A, node: "sinners.dungeon", role: "summon", description: "Summon sign behind the lift at the bottom; save her for the Lost Sinner.", source: SRC },
    { id: "npc.luet", name: "Sellsword Luet (summon)", areaId: A, node: "sinners.dungeon", role: "summon", description: "Summon sign in the upper-right balcony cell.", source: SRC },
  ],
  features: [
    { id: "ft.sinners.gate", name: "Cell gate mechanism", kind: "lever", areaId: A, node: "sinners.dungeon", description: "Mechanism right of the middle water-level door lifts the gate to the boss path.", source: SRC },
    { id: "ft.sinners.oil", name: "Oil rooms (Bastille Key)", kind: "locked-door", areaId: A, node: "sinners.lost_sinner", requires: "Bastille Key", description: "Gates at the top of both stairways before the mist; light the oil with a torch to illuminate the Lost Sinner's arena.", source: SRC },
    { id: "ft.sinners.hidden", name: "Hidden door (Northern Ritual Band)", kind: "illusory-wall", areaId: A, node: "sinners.dungeon", description: "Left corner of the right alcove's back wall.", source: SRC },
  ],
  edges: [
    edge("sinners.entrance", "sinners.saltfort", 1, "Out the door and up the ladder.", { kind: "ladder" }),
    edge("sinners.entrance", "sinners.lift", 1, "Down the stairs into the Royal Swordsman building."),
    edge("sinners.lift", "sinners.dungeon", 1, "Ride the lift down into the flooded dungeon.", { kind: "elevator" }),
    edge("sinners.dungeon", "sinners.lost_sinner", 1, "Lift the cell gate with the mechanism, straight on to the mist."),
    edge("sinners.lost_sinner", "sinners.primal", 1, "Door on the far side of the arena and down the stairs.", { requires: [req.boss("Lost Sinner")] }),
    edge("sinners.primal", "maj.far_fire", 1, "Primal Bonfire warps you back to Majula.", { oneWay: true, kind: "warp" }),
  ],
}, SRC);
