import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, fog, lever, note } from "./helpers";

/**
 * Frigid Outskirts. One open snowfield: the coffin drops you at the west end, the summon circle is
 * just south-west of it, three ruins mark the way east through the blizzard (the middle one has the
 * Pharros' healing spring), and the box-lined cliff edge at the south-east corner leads down to the
 * thin icy bridge and Lud and Zallen's arena.
 */
const frigid: AreaMap = {
  areaId: "frigid",
  width: 470,
  height: 275,
  floors: [
    {
      id: "field",
      name: "Snowfield",
      level: 0,
      rooms: [
        room("chasm", "void", [[350, 200], [470, 190], [470, 275], [380, 275]], "Chasm"),
        room("snowfield", "open", [[20, 40], [70, 18], [130, 12], [200, 24], [240, 60], [300, 80], [400, 74], [440, 110], [436, 190], [400, 232], [360, 240], [300, 222], [240, 200], [180, 176], [120, 170], [40, 150], [12, 92]], "Blizzard snowfield"),
        room("coffin", "ruin", circle(100, 98, 9), "Coffin landing"),
        room("summon", "open", circle(88, 118, 9), "Summon circle"),
        room("ruin_a", "ruin", rect(166, 78, 20, 16), "First ruin"),
        room("ruin_b", "ruin", rect(262, 140, 24, 20), "Second ruin (spring)"),
        room("ruin_c", "ruin", rect(372, 128, 20, 18), "Third ruin"),
        room("box_path", "open", strip([[382, 160], [386, 200], [386, 222]], 10), "Boxes and barrels"),
        room("bridge", "open", strip([[386, 226], [392, 240], [404, 246]], 5), "Icy bridge"),
        room("arena", "open", rect(406, 232, 48, 32), "Lud and Zallen's arena"),
      ],
      features: [
        note([100, 84], "← Coffin from the Expulsion Chamber"),
        note([118, 108], "Wilted Dusk Herb under the coffin; Blackweed Balm in the coffin to the right"),
        note([88, 132], "Vengarl, Feeva, O'Harrah signs"),
        note([200, 60], "Frozen Reindeer spawn from every storm"),
        note([176, 70], "Mirrah Hat, Dried Root"),
        lever([274, 150], "Pharros' healing spring"),
        note([300, 118], "Lacerating Knives, Twinkling Titanite"),
        note([382, 118], "Human Effigies"),
        note([120, 180], "Blizzard landmark (light)"),
        note([240, 214], "Blizzard landmark (light)"),
        note([372, 250], "Ring of the Living (cliff edge)"),
        note([392, 264], "Maldron the Assassin (invader)"),
        fog([406, 238], [406, 254], "Fog gate"),
        note([430, 270], "Beam of light → Expulsion Chamber bonfire"),
      ],
    },
  ],
  positions: {
    "frigid.coffin": pos(100, 98, "field"),
    "frigid.ruins": pos(274, 150, "field"),
    "frigid.bridge": pos(393, 240, "field"),
    "frigid.pets": pos(430, 248, "field"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map304_frgidoutskirts.png",
    "https://static0.fextralifeimages.com/file/darksouls2/a/a4/Outskirts.png",
  ],
  note: "Original schematic. The snowfield outline is a rough blob; the three ruins and the light landmarks are placed relative to each other, not to scale, and the icy bridge is drawn much shorter than it feels.",
};

export default frigid;
