import type { AreaMap } from "../types";
import { room, pos, circle, strip, ladder, lift, locked, drop, bridge, note } from "./helpers";

/**
 * Dragon Aerie. The elevator from Aldia's Keep arrives at the top; the bonfire and the
 * petrified-hollow bridge lead into the cave, the first nest sits up to the right, the
 * Dark Priestess path drops back to a hillside that runs along the bottom to the second
 * nest, the ledge over the third dragon, and the long bridge to the Dragon Shrine at the
 * right edge. The zip-line is its own floor above everything.
 */
const aerie: AreaMap = {
  areaId: "aerie",
  width: 440,
  height: 315,
  floors: [
    {
      id: "zip",
      name: "Zip-line",
      level: 2,
      rooms: [
        room("zip_pf", "open", circle(196, 108, 10), "Zip-line platform"),
        room("landing", "open", circle(386, 254, 9), "Zip-line landing"),
      ],
      features: [
        ladder([196, 118], { to: "cliffs", label: "Ladder down to the Dragon Aerie bonfire" }),
        bridge([[204, 116], [300, 194], [380, 250]], "Zip-line (one-way): carries you over the whole Aerie"),
        note([300, 182], "Let go mid-way: Soul of a Great Hero"),
        drop([386, 262], [388, 268], { to: "cliffs", label: "Drop to the foot of the Dragon Shrine bridge" }),
      ],
    },
    {
      id: "cliffs",
      name: "Cliffs",
      level: 1,
      rooms: [
        room("elevator", "interior", circle(150, 40, 12), "Elevator top"),
        room("entry_path", "open", strip([[142, 50], [126, 66], [120, 88], [130, 102]], 9)),
        room("herald_cliff", "open", [[112, 96], [142, 98], [152, 114], [142, 130], [118, 132], [104, 116]], "Emerald Herald's cliff"),
        room("first_bridge", "open", strip([[150, 112], [172, 122]], 6)),
        room("bonfire_pf", "open", circle(188, 128, 14), "Dragon Aerie bonfire"),
        room("winding", "open", strip([[192, 142], [188, 162], [202, 178], [224, 180]], 9), "Winding path"),
        room("statue_bridge", "open", strip([[224, 180], [250, 162], [274, 146]], 7), "Statue bridge"),
        room("cave", "interior", [[276, 120], [300, 108], [328, 112], [340, 134], [332, 158], [306, 166], [282, 154]], "Rupturing Hollow cave"),
        room("left_path", "open", strip([[338, 130], [356, 114], [372, 102]], 8)),
        room("nest1", "open", [[372, 62], [406, 56], [430, 76], [432, 110], [410, 128], [382, 122], [366, 98]], "First dragon's nest"),
        room("loop_bridge", "open", strip([[380, 124], [366, 146], [358, 164]], 6), "Loop bridge"),
        room("tunnel", "open", strip([[306, 166], [312, 182], [328, 188]], 7), "Tunnel"),
        room("right_path", "open", [[326, 166], [368, 166], [380, 190], [366, 212], [336, 214], [318, 190]], "Egg bridge & Dark Priestess path"),
        room("hillside", "open", strip([[322, 200], [280, 208], [230, 208], [180, 210], [140, 214]], 8), "Hillside walkway"),
        room("nest2", "open", [[40, 196], [96, 190], [140, 204], [144, 240], [112, 262], [60, 264], [30, 240]], "Second dragon's open area"),
        room("lockstone_ledge", "open", [[160, 222], [176, 222], [176, 234], [160, 234]], "Lockstone ledge"),
        room("ledge", "open", strip([[144, 240], [166, 252], [190, 258]], 8)),
        room("overlook", "open", [[190, 246], [236, 242], [248, 262], [232, 280], [196, 282], [184, 264]], "Ledge above the third dragon"),
        room("nest3", "open", [[150, 268], [188, 266], [200, 284], [190, 304], [156, 306], [142, 288]], "Third dragon's nest"),
        room("shrine_path", "open", strip([[248, 262], [290, 264], [330, 266], [366, 268]], 7), "Bridge past two Rupturing Hollows"),
        room("bridge_foot", "open", [[366, 254], [404, 250], [416, 266], [404, 284], [368, 284], [356, 270]], "Foot of the Dragon Shrine bridge"),
        room("long_bridge", "open", strip([[412, 268], [436, 268]], 8), "Long bridge"),
      ],
      features: [
        note([150, 20], "→ Aldia's Keep (elevator)"),
        lift([150, 40], { label: "Elevator from Aldia's Keep" }),
        note([96, 142], "Emerald Herald: Aged Feather"),
        bridge([[150, 112], [172, 122]], "First bridge"),
        ladder([196, 118], { to: "zip", label: "Ladder beside the bonfire: up to the zip-line (bypasses the petrified hollow)" }),
        bridge([[224, 180], [274, 146]], "Winding-path bridge"),
        locked([268, 138], [280, 152], "Petrified hollow (Fragrant Branch of Yore)"),
        note([322, 100], "Crystal Lizard recess (Radiant Lifegem)"),
        note([414, 48], "Egg nest: Dragon Tooth"),
        bridge([[380, 124], [358, 164]], "Bridge on the far left of the first nest"),
        note([394, 176], "Egg bridge: break an egg to pass (Fencer Sharron)"),
        note([352, 226], "Petrified Dragon Bone past the Dark Priestess"),
        drop([166, 246], [168, 236], { label: "Drop down the ledge: Pharros' Lockstone" }),
        note([216, 232], "Two Rupturing Hollows"),
        bridge([[248, 262], [366, 268]], "Bridge past two Rupturing Hollows"),
        note([386, 296], "Egg count: 7 = timed crossing, 10 = bridge destroyed"),
        bridge([[412, 268], [436, 268]], "Long bridge (wyvern lands if too many eggs are broken)"),
        note([420, 240], "→ Dragon Shrine"),
      ],
    },
  ],
  positions: {
    "aerie.entrance": pos(128, 114, "cliffs"),
    "aerie.bonfire": pos(188, 128, "cliffs"),
    "aerie.cave": pos(308, 136, "cliffs"),
    "aerie.dragon1": pos(398, 92, "cliffs"),
    "aerie.right_path": pos(348, 190, "cliffs"),
    "aerie.dragon2": pos(90, 228, "cliffs"),
    "aerie.dragon3": pos(216, 262, "cliffs"),
    "aerie.bridge": pos(388, 268, "cliffs"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map30_dragonaerie.png",
    "https://static0.fextralifeimages.com/file/darksouls2/1/12/Dragon_aerie_and_dragon_shrine_dark_souls_2_wiki_guide_565px.png",
  ],
  note: "Original schematic. The Aerie's stacked bridges are flattened onto one floor and the nests are drawn as blobs; the second and third nests are placed along the bottom so the route reads left to right without crossings, which does not match the sheets' exact arrangement. The zip-line floor holds only its two platforms.",
};

export default aerie;
