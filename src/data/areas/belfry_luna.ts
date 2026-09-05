import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "belfry_luna";
const SRC = FEX + "Belfry+Luna";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([900, 2750], {
  area: {
    id: A,
    name: "Belfry Luna",
    shape: [[-160, -140], [120, -160], [220, -20], [160, 140], [-120, 150], [-220, 20]],
    label: [0, -100],
    description: "Optional bell tower off the Lost Bastille, guarded by the Bell Keepers covenant and their invading dwarves. The Belfry Gargoyles wait on the roof; the Bastille Key lies beyond the hound pit below.",
    connections: ["bastille"],
    recommendedLevel: "55 to 65",
    source: SRC,
  },
  nodes: [
    node(A, "luna.entrance", "Bell Keeper's door", "entrance", -160, 60, "Pharros' wall from the Servants' Quarters; the Bell Keeper dwarf sits inside."),
    node(A, "luna.tower", "Belfry interior", "landmark", -40, -20, "Stairs, the hole to the Blue Tearstone Ring room, the third-floor ladder and the bell."),
    node(A, "luna.gargoyles", "Belfry Gargoyles roof", "boss", 80, -110, "Fog door after ringing the bell."),
    node(A, "luna.upper_ramparts", "Upper Ramparts", "bonfire", 150, 20, "Bonfire at the end of the wall after the boss, beside the ladder down to the hound pit."),
    node(A, "luna.pit", "Hound pit", "landmark", 100, 120, "Stray Hounds, Vorgel the Sinner invasion, Dragon Tooth tunnel, Bastille Key."),
  ],
  bonfires: [
    { id: "luna.upper_ramparts", name: "Upper Ramparts", areaId: A, note: "After the Belfry Gargoyles: out the door and along the wall, next to the ladder down.", source: SRC },
  ],
  bosses: [
    { id: "boss.belfry_gargoyles", name: "Belfry Gargoyles", areaId: A, node: "luna.gargoyles", required: false, description: "Up to six gargoyles on the belfry roof, arriving in waves. Ring the bell to open the fog door.", drops: ["Belfry Gargoyle Soul"], note: "Optional. Rewards the Bastille Key, which makes the Lost Sinner fight easier by lighting her arena.", source: FEX + "Belfry+Gargoyles" },
  ],
  items: [
    i("Blue Tearstone Ring", "ring", "luna.tower", "Drop through the hole near the middle of the first upper room; chest in the room blocked by dead keepers."),
    i("Skeptic's Spice", "consumable", "luna.tower", "Corpse on the way back to the staircase from the Blue Tearstone Ring room."),
    i("Radiant Lifegem", "lifegem", "luna.tower", "Chest at the top of the ladder on the third floor, after the four Bell Keepers (with 2x Twilight Herb).", { qty: 2 }),
    i("Twilight Herb", "consumable", "luna.tower", "Chest at the top of the third-floor ladder.", { qty: 2 }),
    i("Skeptic's Spice", "consumable", "luna.tower", "Corpse leaning against a corner support at the top of the third-floor ladder."),
    i("Soul of a Proud Knight", "soul", "luna.gargoyles", "Along the roof's edge after the Gargoyles.", { prerequisites: ["Belfry Gargoyles defeated"] }),
    i("Southern Ritual Band", "ring", "luna.gargoyles", "Chest down the stairs inside the other tower after the boss.", { prerequisites: ["Belfry Gargoyles defeated"] }),
    i("Human Effigy", "effigy", "luna.pit", "Dropped by the invader Vorgel the Sinner in the hound pit."),
    i("Petrified Something", "unique", "luna.pit", "Short tunnel at the far end of the hound pit (with Brightbug and Dragon Tooth)."),
    i("Brightbug", "consumable", "luna.pit", "Short tunnel at the far end of the hound pit."),
    i("Dragon Tooth", "weapon", "luna.pit", "Short tunnel at the far end of the hound pit."),
    i("Enchanted Falchion", "weapon", "luna.pit", "Body at the top of the steps at the far end of the hound pit."),
    i("Skeptic's Spice", "consumable", "luna.pit", "Fextralife lists 3 Skeptic's Spice for the area; third one is in the lower area.", { note: "Count from the wiki item list." }),
  ],
  npcs: [
    { id: "npc.bellkeeper_luna", name: "Bell Keeper (Belfry Luna)", areaId: A, node: "luna.entrance", role: "covenant", description: "Dwarf just inside the entrance; exhaust his dialogue to join the Bell Keepers covenant.", source: SRC },
    { id: "npc.glencour_luna", name: "Masterless Glencour (shade)", areaId: A, node: "luna.tower", role: "summon", description: "Shade summon sign under the staircase to the third floor.", source: SRC },
    { id: "npc.vorgel", name: "Vorgel the Sinner (invader)", areaId: A, node: "luna.pit", role: "npc", description: "NPC black phantom that invades in the hound pit; drops a Human Effigy.", source: SRC },
  ],
  features: [
    { id: "ft.luna.covenant", name: "Bell Keepers covenant", kind: "covenant", areaId: A, node: "luna.entrance", description: "Join through the Bell Keeper dwarf to defend Belfry Luna and Belfry Sol from intruders.", source: SRC },
    { id: "ft.luna.bell", name: "Belfry bell", kind: "lever", areaId: A, node: "luna.tower", description: "Ring the bell at the top of the ladder to open the fog door to the Gargoyles.", source: SRC },
  ],
  edges: [
    edge("luna.entrance", "luna.tower", 1, "Up the stairs past the phantom keeper; hole in the floor for the ring room."),
    edge("luna.tower", "luna.gargoyles", 1, "Ladder on the third floor, ring the bell, through the fog door.", { requires: [req.event("Bell rung")] }),
    edge("luna.gargoyles", "luna.upper_ramparts", 1, "Out the door and along the wall.", { requires: [req.boss("Belfry Gargoyles")] }),
    edge("luna.upper_ramparts", "luna.pit", 1, "Ladder down beside the bonfire into the hound pit.", { kind: "ladder" }),
  ],
}, SRC);
