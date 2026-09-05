import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "chasm";
const SRC = FEX + "Dark+Chasm+of+Old";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([4000, 4300], {
  area: {
    id: A,
    name: "Dark Chasm of Old",
    shape: [[-260, -140], [40, -200], [280, -120], [300, 60], [160, 170], [-140, 170], [-300, 40]],
    label: [0, -110],
    description: "Three pockets of the Abyss reached through Darkdiver Grandahl's altars (Shaded Woods, Black Gulch, Drangleic Castle) for a Human Effigy each, Pilgrims of Dark only. Clear each chasm and light its sconce; once all three burn, leaving a chasm leads to the Darklurker.",
    connections: ["shaded", "gulch", "drangleic"],
    recommendedLevel: "95 to 105",
    source: SRC,
  },
  nodes: [
    node(A, "chasm.shaded_portal", "Shaded Ruins chasm", "entrance", -220, 0, "Easiest chasm: Tenebrous Rogue, Underworld Deadeye, Witchtree Spirit; lift to a second Rogue."),
    node(A, "chasm.gulch_portal", "Black Gulch chasm", "entrance", -40, -100, "Abyss Ironclads, Dark Xanthous, Witchtree Spirits across two areas; sconce down the left hall."),
    node(A, "chasm.castle_portal", "Drangleic Castle chasm", "entrance", 100, 40, "Hardest chasm: Abyss Havel, Dark Prince, Witchtree Spirit, Shadowveil Assassin before the pit."),
    node(A, "chasm.darklurker", "Darklurker arena", "boss", 220, -60, "Exit pit of any chasm once all three sconces are lit."),
  ],
  bonfires: [],
  bosses: [
    { id: "boss.darklurker", name: "Darklurker", areaId: A, node: "chasm.darklurker", required: false, description: "Angelic abyss creature that splits into two at half health. Reached by jumping into the exit pit of a cleared chasm after lighting all three sconces.", drops: ["Darklurker Soul"], note: "Optional; Pilgrims of Dark covenant reward path.", source: FEX + "Darklurker" },
  ],
  items: [
    i("Bonfire Ascetic", "ascetic", "chasm.gulch_portal", "Small chance drop from every Abyss phantom in the chasms; guaranteed for killing another player inside a chasm.", { note: "Drop, not a fixed pickup." }),
    i("Lingering Dragoncrest Ring +2", "ring", "chasm.darklurker", "Pilgrims of Dark rank rewards from Grandahl after clearing chasms (rank 1: Xanthous Set, rank 3: Lingering Dragoncrest +2).", { note: "Covenant reward, given by Grandahl.", source: FEX + "Pilgrims+of+Dark" }),
  ],
  npcs: [],
  features: [
    { id: "ft.chasm.sconces", name: "Chasm sconces (Flame Butterfly)", kind: "lever", areaId: A, node: "chasm.gulch_portal", requires: "Flame Butterfly / torch", description: "Light the cauldron in each of the three chasms; all three unlock the Darklurker.", source: SRC },
    { id: "ft.chasm.covenant", name: "Pilgrims of Dark covenant", kind: "covenant", areaId: A, node: "chasm.shaded_portal", requires: "Speak to all three Grandahls", description: "Join with the third Grandahl (Drangleic Castle); each entry costs a Human Effigy.", source: SRC },
  ],
  edges: [
    edge("chasm.shaded_portal", "chasm.darklurker", 2, "Clear the chasm, light the sconce, jump into the foggy pit (Darklurker once all three sconces are lit).", { requires: [req.event("All three chasm sconces lit")] }),
    edge("chasm.gulch_portal", "chasm.darklurker", 2, "Clear both areas, light the sconce, jump into the pit.", { requires: [req.event("All three chasm sconces lit")] }),
    edge("chasm.castle_portal", "chasm.darklurker", 2, "Clear the chasm, light the sconce, pass the Shadowveil Assassin's fog and drop into the pit.", { requires: [req.event("All three chasm sconces lit")] }),
    edge("shaded.grandahl", "chasm.shaded_portal", 1, "Grandahl's altar in the Shaded Woods cave (Human Effigy).", { kind: "warp", requires: [req.event("Pilgrims of Dark covenant"), req.item("Human Effigy")] }),
  ],
}, SRC);
