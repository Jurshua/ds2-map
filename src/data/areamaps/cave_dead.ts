import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, fog, drop, note } from "./helpers";

/**
 * Cave of the Dead. Entered on the east from the Priestess' Chamber: the entrance ledges drop to
 * the pitch-dark statue rooms, whose exit ledge drops again to the Cragslipper room and the fog of
 * Graverobber, Varg and Cerah; the hole after the fight falls back into Shulva.
 */
const caveDead: AreaMap = {
  areaId: "cave_dead",
  width: 340,
  height: 240,
  floors: [
    {
      id: "entry",
      name: "Entrance ledges",
      level: 2,
      rooms: [
        room("entry_corridor", "interior", strip([[296, 200], [256, 200], [224, 196]], 12), "Passage from the Priestess' Chamber"),
        room("first_ledge", "open", rect(172, 180, 52, 36), "First ledge"),
        room("second_ledge", "open", rect(140, 196, 32, 30), "Second ledge"),
      ],
      features: [
        note([300, 186], "← Shulva (Priestess' Chamber)"),
        fog([240, 190], [240, 204], "Fog gate from the Priestess' Chamber"),
        note([198, 170], "Rapacious Andrei & Ruined Alfis's signs"),
        drop([172, 206], [160, 212], { label: "Drop to the second ledge" }),
        drop([150, 226], [150, 236], { to: "statues", label: "Second hole on the right, down to the statue rooms" }),
      ],
    },
    {
      id: "statues",
      name: "Statue rooms",
      level: 1,
      rooms: [
        room("statue_cave", "open", [[30, 90], [80, 60], [140, 70], [176, 110], [178, 180], [160, 236], [120, 238], [80, 220], [40, 190], [20, 140]], "Petrifying statue rooms"),
      ],
      features: [
        note([150, 224], "Hole from the ledges above"),
        note([80, 96], "Metal chest: Petrified Something; Brightbugs; Bonfire Ascetics"),
        note([110, 200], "Petrifying Statue Clusters & Sanctum Soldiers; holes down"),
        drop([166, 84], [182, 70], { to: "arena", label: "Exit ledge: drop down to the Cragslipper" }),
      ],
    },
    {
      id: "arena",
      name: "Arena",
      level: 0,
      rooms: [
        room("cragslipper", "interior", rect(172, 44, 40, 30), "Cragslipper room"),
        room("soldier_path", "interior", strip([[212, 58], [236, 54], [252, 50]], 10), "Sanctum Soldiers"),
        room("trio_arena", "open", circle(292, 60, 42), "Graverobber, Varg & Cerah"),
      ],
      features: [
        note([230, 38], "Alluring Skulls by a statue trap"),
        fog([250, 40], [252, 60], "Fog gate (Graverobber, Varg & Cerah)"),
        note([292, 112], "Flower Skirt chest & Blackweed Balm after the fight"),
        drop([318, 88], [330, 106], { label: "Exit hole: falls to the Priestess' Chamber elevator's Dark Greatsword level (one-way)" }),
        note([310, 124], "→ Shulva (Priestess' Chamber elevator)"),
      ],
    },
  ],
  positions: {
    "cave_dead.entrance": pos(198, 198, "entry"),
    "cave_dead.statue_room": pos(110, 160, "statues"),
    "cave_dead.trio": pos(292, 60, "arena"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map104_caveofthedead.png",
  ],
  note: "Original schematic from the Kouryakubo sheet only (no Fextralife plate). The dark cave's several ledges and holes are collapsed into one statue-room floor with a single exit drop.",
};

export default caveDead;
