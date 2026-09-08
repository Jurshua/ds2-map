import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, lift, fog, locked, illusory, lever, bridge, note } from "./helpers";

/**
 * Shrine of Amana. One floor: the caverns are drawn as pools of deep water with the walkable
 * shallows laid over them. The castle elevator arrives top-left, the Tower of Prayer and the first
 * cavern fill the top, the Crumbled Ruins cave leads into the Shrine Maiden cavern on the right
 * (Vendrick's door at the far east edge), Rhoy's cave drops into the third cavern at the bottom,
 * with the Rise of the Dead and the Altar road to the west and the Demon of Song and the Undead
 * Crypt elevator to the south-east.
 */
const amana: AreaMap = {
  areaId: "amana",
  width: 460,
  height: 480,
  floors: [
    {
      id: "caverns",
      name: "Caverns",
      level: 0,
      rooms: [
        room("cavern1_water", "water", [[100, 60], [200, 50], [260, 70], [280, 110], [240, 150], [180, 160], [120, 150], [96, 120]], "First cavern"),
        room("cavern2_water", "water", [[290, 110], [400, 100], [445, 140], [440, 220], [390, 262], [300, 270], [262, 240], [262, 170]], "Shrine Maiden cavern"),
        room("cavern3_water", "water", [[120, 330], [300, 320], [360, 350], [380, 400], [340, 450], [220, 462], [130, 440], [100, 390]], "Third cavern"),
        room("arrival", "interior", rect(14, 200, 26, 22), "Elevator landing"),
        room("vines", "interior", strip([[40, 211], [62, 190], [70, 160], [62, 130]], 8), "Vine tunnels"),
        room("tower_of_prayer", "interior", circle(62, 116, 14), "Tower of Prayer"),
        room("tower_walk", "open", strip([[76, 116], [100, 110], [122, 112]], 7), "Walkway"),
        room("cavern1_path", "open", strip([[120, 112], [150, 100], [190, 96], [230, 104], [258, 96]], 12), "Shallows (Lizardmen)"),
        room("milfanito_cabin", "interior", circle(150, 128, 9), "Milfanito's cabin"),
        room("cave1", "interior", strip([[258, 96], [280, 80], [302, 66]], 10), "Cave to the fog"),
        room("crumbled_ruins", "interior", rect(300, 44, 34, 26), "Crumbled Ruins"),
        room("ogre_nook", "interior", circle(348, 40, 9), "Ogre's nook"),
        room("cave1_exit", "interior", strip([[317, 70], [320, 102]], 10)),
        room("cavern2_path", "open", strip([[320, 100], [330, 140], [350, 180], [380, 210], [400, 242]], 12), "Colosseum ruins"),
        room("kings_bridge", "open", strip([[400, 190], [446, 190]], 6), "Submerged rock bridge"),
        room("kings_door", "interior", circle(452, 190, 8), "Vendrick's door"),
        room("felicia_cabin", "interior", circle(382, 236, 8), "Felicia's cabin"),
        room("cave2", "interior", strip([[402, 262], [392, 284], [370, 312]], 10), "Mushroom cave"),
        room("rhoy", "interior", circle(380, 300, 13), "Rhoy's Resting Place"),
        room("mage_path", "open", strip([[370, 312], [340, 330], [310, 340], [280, 370], [262, 384]], 8), "Past the two close mages"),
        room("pillar_circle", "open", circle(250, 395, 22), "Submerged pillar circle"),
        room("rise_path", "open", strip([[228, 395], [190, 400], [148, 396]], 8), "Magic Arrow path"),
        room("rise_of_dead", "interior", circle(134, 396, 14), "Rise of the Dead"),
        room("altar_road", "open", strip([[122, 408], [90, 430], [60, 440], [40, 420]], 8), "Road to the Altar"),
        room("altar", "interior", circle(30, 405, 14), "Altar of Amana"),
        room("song_path", "open", strip([[262, 410], [300, 430], [346, 440]], 8), "Pillar-lined path"),
        room("demon_arena", "open", circle(385, 445, 24), "Demon of Song"),
        room("crypt_path", "open", strip([[409, 445], [432, 445]], 8)),
      ],
      features: [
        lift([27, 211], { label: "Elevator from the King's Passage" }),
        note([27, 232], "→ Drangleic Castle"),
        note([62, 100], "Bottom of the vine tunnels"),
        note([180, 76], "Archdrake knights, Dragon Charm chest"),
        note([150, 142], "First Milfanito"),
        fog([286, 68], [294, 80], "Fog door"),
        note([352, 28], "Ogre; submerged Sunlight Blade path"),
        lever([300, 150], "Pharros' contraption (Helix Halberd, underwater)"),
        note([352, 132], "Shrine Maidens (homing soul arrows)"),
        note([290, 190], "Fire Tempest chest"),
        illusory([300, 214], [310, 224], "Breakable branches (Life Ring +2 ogre)"),
        bridge([[402, 190], [444, 190]], "Submerged rock bridge from the third mage"),
        locked([444, 182], [444, 198], "Vendrick's door (opens after Vendrick, while human)"),
        note([446, 208], "Soul of the King, King's Set"),
        note([382, 250], "Felicia's sign"),
        fog([394, 254], [408, 260], "Fog door"),
        note([392, 322], "Amana Priestess (healer) & Archdrake clerics"),
        note([250, 370], "Loot on every pillar"),
        note([200, 386], "Magic Arrows, last mages"),
        locked([120, 406], [126, 414], "Sealed door (opens only while hollow)"),
        note([44, 456], "Third Milfanito; Manslayer & Bonfire Ascetic chests"),
        note([320, 424], "Last Shrine Maiden"),
        fog([348, 432], [354, 448], "Fog door"),
        lift([442, 445], { label: "Elevator down to the Undead Crypt (Royal Knight in SotFS)" }),
        note([440, 464], "→ Undead Crypt"),
      ],
    },
  ],
  positions: {
    "amana.tower_of_prayer": pos(62, 116, "caverns"),
    "amana.first_cavern": pos(175, 100, "caverns"),
    "amana.crumbled_ruins": pos(317, 57, "caverns"),
    "amana.second_cavern": pos(345, 170, "caverns"),
    "amana.kings_door": pos(452, 190, "caverns"),
    "amana.rhoy": pos(380, 300, "caverns"),
    "amana.third_cavern": pos(250, 395, "caverns"),
    "amana.rise_of_dead": pos(134, 396, "caverns"),
    "amana.demon_of_song": pos(385, 445, "caverns"),
    "amana.altar": pos(30, 405, "caverns"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map27_shrineofamana.png",
    "https://static0.fextralifeimages.com/file/darksouls2/1/1f/Shrine_of_amana_dark_souls_2_wiki_guide_565px.png",
  ],
  note: "Original schematic. The caverns are simplified to three pools with a single drawn shallows path each; the tower descents at the Tower of Prayer and the Rise of the Dead are flattened onto the one floor, and the long Altar road is shortened.",
};

export default amana;
