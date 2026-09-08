import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, stairs, ladder, door, locked, drop, lever, bridge, note } from "./helpers";

/**
 * Majula. Orientation follows the in-game walk: the Things Betwixt cliff path enters from the east,
 * the coast path to the Forest leaves north-east, the halls to Heide's leave west, and the sea lies
 * south of the plateau. The Pit is its own floor because the descent is vertical.
 */
const majula: AreaMap = {
  areaId: "majula",
  width: 340,
  height: 260,
  floors: [
    {
      id: "surface",
      name: "Majula",
      level: 1,
      rooms: [
        room("sea", "water", [[0, 205], [120, 215], [220, 225], [340, 215], [340, 260], [0, 260]], "The sea"),
        room("town", "open", [[95, 45], [140, 32], [185, 30], [235, 45], [252, 80], [248, 128], [222, 170], [178, 190], [130, 185], [96, 165], [80, 125], [78, 80]], "Majula"),
        room("cliff", "open", [[38, 92], [80, 84], [88, 132], [62, 152], [36, 134]], "Victor's Stone"),
        room("lenigrast", "interior", rect(118, 42, 22, 16), "Lenigrast"),
        room("maughlin", "interior", rect(146, 36, 22, 16), "Maughlin"),
        room("shalquoir", "interior", rect(88, 86, 16, 14), "Shalquoir"),
        room("mansion", "interior", rect(104, 150, 36, 28), "Majula Mansion"),
        room("pit", "void", circle(172, 138, 13), "The Pit"),
        room("betwixt_path", "open", strip([[338, 152], [300, 140], [262, 124], [240, 112]], 12), "Cliff path"),
        room("shaded_path", "open", strip([[280, 130], [296, 160], [306, 192], [311, 206]], 10), "Leafy path"),
        room("shaded_chamber", "interior", circle(312, 222, 14), "Round chamber"),
        room("forest_tunnel", "open", strip([[236, 58], [262, 48], [288, 40], [318, 28], [338, 20]], 10), "Coast path"),
        room("archway", "interior", strip([[58, 146], [52, 166], [46, 176]], 8)),
        room("rotunda", "interior", circle(45, 190, 16), "Rotunda"),
        room("heide_hall", "interior", strip([[30, 186], [12, 170], [10, 130], [16, 96], [12, 60], [8, 32]], 8), "Halls to Heide's"),
      ],
      features: [
        note([322, 166], "→ Things Betwixt"),
        note([300, 174], "Benhart of Jugo"),
        lever([312, 226], "Lever (Rosabeth petrified in front of it)"),
        locked([304, 235], [320, 235], "Gate to the Shaded Woods"),
        note([312, 248], "→ Shaded Woods"),
        door([260, 43], [264, 53], "Lever-gate"),
        bridge([[280, 44], [296, 37]], "Wooden bridge over the stream"),
        note([322, 12], "→ Forest of Fallen Giants"),
        locked([116, 150], [126, 150], "Mansion door (House Key)"),
        note([148, 152], "Well"),
        locked([124, 58], [134, 58], "Workshop door (Lenigrast's Key)"),
        stairs([48, 174], [58, 146], { label: "Stairs between the cliff and the rotunda" }),
        lever([45, 190], "Contraption (Licia, 2,000 souls)"),
        locked([36, 204], [54, 204], "Passage to Huntsman's Copse (after Licia turns the rotunda)"),
        note([45, 216], "→ Huntsman's Copse"),
        door([8, 100], [24, 100], "Pull-chain doors"),
        note([14, 20], "→ Heide's Tower of Flame"),
        ladder([188, 138], { to: "pit", label: "Gilligan's ladders down the pit" }),
        drop([172, 150], [172, 160], { to: "pit", label: "Drop into the pit (Silvercat Ring)" }),
      ],
    },
    {
      id: "pit",
      name: "The Pit",
      level: 0,
      rooms: [
        room("shaft", "interior", circle(172, 138, 24), "Pit shaft"),
        room("ledge", "interior", rect(134, 120, 18, 14), "Ledge"),
        room("forgotten_room", "interior", rect(100, 116, 34, 22), "Forgotten Key room"),
        room("grave_ledge", "interior", rect(196, 140, 18, 12), "Torch-lined ledge"),
        room("lower_cave", "interior", strip([[172, 162], [178, 190], [196, 214], [224, 232]], 12), "Lower cave"),
        room("mummy_cave", "interior", rect(224, 222, 30, 20), "Mummy cave"),
      ],
      features: [
        ladder([186, 118], { to: "surface", label: "Ladders back up to Majula" }),
        locked([134, 124], [134, 134], "Forgotten Key door"),
        drop([190, 138], [204, 146], { label: "Board-to-board drops (Silvercat Ring)" }),
        note([222, 148], "→ Grave of Saints"),
        bridge([[172, 166], [176, 184]], "Crystal Lizard bridge"),
        ladder([250, 244], { label: "Scaffolding ladders down (one-way)" }),
        note([262, 254], "→ The Gutter"),
      ],
    },
  ],
  positions: {
    "maj.betwixt_path": pos(300, 140, "surface"),
    "maj.far_fire": pos(150, 108, "surface"),
    "maj.village": pos(150, 70, "surface"),
    "maj.victors_stone": pos(62, 116, "surface"),
    "maj.mansion": pos(122, 164, "surface"),
    "maj.pit": pos(172, 138, "surface"),
    "maj.rotunda": pos(45, 190, "surface"),
    "maj.heide_passage": pos(12, 120, "surface"),
    "maj.forest_tunnel": pos(262, 48, "surface"),
    "maj.shaded_gate": pos(312, 222, "surface"),
    "maj.forgotten_door": pos(143, 127, "pit"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map02_madura.png",
    "http://www.kouryakubo.com/darksouls2/image/maps/map02_madura_holl.png",
    "https://static0.fextralifeimages.com/file/darksouls2/8/84/Majula_map_dark_souls2_wiki_guide565px.png",
  ],
  note: "Original schematic traced against the wiki sheets and the in-game walk. Building footprints and path widths are simplified; the pit floor shows the ledges in plan, not their depth.",
};

export default majula;
