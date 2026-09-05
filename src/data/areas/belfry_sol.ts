import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "belfry_sol";
const SRC = FEX + "Belfry+Sol";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([6550, 3050], {
  area: {
    id: A,
    name: "Belfry Sol",
    shape: [[-160, -130], [120, -150], [220, -10], [150, 130], [-130, 140], [-220, 20]],
    label: [0, -90],
    description: "The sun-side bell tower above Iron Keep, reached through a Pharros' door. Bell Keeper puppets and constant invasions guard the bell lever; the exit ledge drops back into Iron Keep beside an illusory treasure room.",
    connections: ["iron_keep"],
    recommendedLevel: "80 to 90",
    source: SRC,
  },
  nodes: [
    node(A, "sol.approach", "Belfry Sol Approach", "bonfire", -170, 60, "Up the ladder behind the Pharros' door in Iron Keep's lever hall; Thunder Quartz Ring +1 chest."),
    node(A, "sol.leader", "Head Bell Keeper", "landmark", -60, -20, "Top of the ladder: the Bell Keeper leader beside the fog gate (gravestone if he is dead)."),
    node(A, "sol.courtyard", "Belfry courtyard", "landmark", 60, -80, "Puppet phantoms, ballista, bell-lever tower on the right, ladder tower on the left."),
    node(A, "sol.roof", "Rooftops", "landmark", 150, 0, "Simpleton's Spice corpses, Dual Avelyn keeper, doorway down to the Immolation chest."),
    node(A, "sol.exit", "Exit ledge to Iron Keep", "landmark", 60, 100, "Immolation chest, Human Effigy corpse, ledge with the illusory wall room back above Iron Keep's lever hall."),
  ],
  bonfires: [
    { id: "sol.approach", name: "Belfry Sol Approach", areaId: A, note: "Ladder behind the Pharros' Lockstone door in Iron Keep's lever-platform hall. The only ways out are up the ladder (Belfry Sol) or warping.", source: SRC },
  ],
  bosses: [],
  items: [
    i("Thunder Quartz Ring +1", "ring", "sol.approach", "Chest beside the Belfry Sol Approach bonfire.", { prerequisites: ["Pharros' Lockstone (Iron Keep lever hall)"], note: "In vanilla DS2 this chest held the Dull Ember; in SotFS the Dull Ember moved to the Lost Bastille." }),
    i("Simpleton's Spice", "consumable", "sol.courtyard", "Corpse behind the left tower (Dual Avelyn Bell Keeper)."),
    i("Simpleton's Spice", "consumable", "sol.roof", "Corpse along the roof after the Dual Avelyn keeper."),
    i("Simpleton's Spice", "consumable", "sol.roof", "Right of the door at the bottom after the Greatsword Bell Keeper."),
    i("Immolation", "spell", "sol.exit", "Chest through the door after the rooftops."),
    i("Human Effigy", "effigy", "sol.exit", "Turn around at the bottom of the stairs after the Immolation chest (with Triclops Snake Troches)."),
    i("Triclops Snake Troches", "consumable", "sol.exit", "Corpse at the bottom of the stairs after the Immolation chest."),
    i("Fire Whip", "spell", "sol.courtyard", "Rare drop from the fire-staff Bell Keeper puppets.", { note: "Enemy drop." }),
    i("Black Witch Domino Mask", "armor", "sol.roof", "Chance drop from the non-respawning Dual Avelyn Bell Keeper phantoms (reset with a Bonfire Ascetic).", { note: "Enemy drop." }),
    i("Mad Warrior Set", "armor", "sol.courtyard", "Rare drop from the rare Mad Warrior black phantom near the ladder tower (Bell Keeper covenant member required).", { note: "Enemy drop." }),
    i("Berserker Blade", "weapon", "sol.courtyard", "Rare drop from the Mad Warrior.", { note: "Enemy drop." }),
  ],
  npcs: [
    { id: "npc.bellkeeper_sol", name: "Head Bell Keeper (Belfry Sol)", areaId: A, node: "sol.leader", role: "covenant", description: "Beside the fog gate at the top of the ladder; join the Bell Keepers here. Gravestone asks 4,500 souls if he is dead.", source: SRC },
    { id: "npc.aidel", name: "Drifter Swordsman Aidel (summon)", areaId: A, node: "sol.courtyard", role: "summon", description: "Summon sign around the corner to the right after the first puppets.", source: SRC },
    { id: "npc.mad_warrior", name: "Mad Warrior (rare invader)", areaId: A, node: "sol.courtyard", role: "npc", description: "Rare black phantom in the corner by the ladder tower; only spawns for Bell Keeper members.", source: SRC },
  ],
  features: [
    { id: "ft.sol.bell", name: "Belfry Sol bell lever", kind: "lever", areaId: A, node: "sol.courtyard", description: "Lever in the small right-hand tower rings the bell.", source: SRC },
    { id: "ft.sol.illusory", name: "Illusory wall (return ledge)", kind: "illusory-wall", areaId: A, node: "sol.exit", description: "Right wall of the ledge back into Iron Keep: Black Knight Greatsword, Protective Chime, Grand Spirit Tree Shield.", source: SRC },
  ],
  edges: [
    edge("sol.approach", "sol.leader", 1, "Ladder up from the bonfire.", { kind: "ladder" }),
    edge("sol.leader", "sol.courtyard", 1, "Through the fog gate."),
    edge("sol.courtyard", "sol.roof", 1, "Ladder in the left tower to the rooftops.", { kind: "ladder" }),
    edge("sol.roof", "sol.exit", 1, "Doorway on the left of the roof, down past the Greatsword keeper, through the door and stairs."),
    edge("sol.exit", "ik.lava_hall", 1, "Ledge back into Iron Keep above the lever hall; drop down and descend the ladder.", { kind: "drop" }),
  ],
}, SRC);
