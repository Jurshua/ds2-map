import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, stairs, lift, fog, door, locked, lever, bridge, note } from "./helpers";

/**
 * Heide's Tower of Flame. Runs south to north: the Majula waterway enters at the bottom, the
 * Cathedral of Blue drawbridge is on the west arm, the Dragonrider and Tower of Flame are on the
 * east arm, and the lower halls continue north to No-man's Wharf on their own floor.
 */
const heides: AreaMap = {
  areaId: "heides",
  width: 300,
  height: 420,
  floors: [
    {
      id: "towers",
      name: "Towers",
      level: 1,
      rooms: [
        room("sea", "water", [[0, 0], [300, 0], [300, 420], [0, 420]], "Sea"),
        room("entry", "interior", strip([[150, 412], [150, 380], [142, 352]], 8), "Waterway from Majula"),
        room("first_platform", "open", circle(140, 335, 18), "First platform"),
        room("ruin_platform", "open", circle(175, 352, 11), "Heide's Ruin"),
        room("link1", "open", strip([[140, 317], [140, 305]], 8)),
        room("lever_platform", "open", circle(140, 285, 20), "Contraption platform"),
        room("walkway", "open", strip([[140, 265], [145, 225], [150, 195]], 8), "Long walkway"),
        room("three_knights", "open", circle(150, 175, 22), "Three Old Knights"),
        room("west_walk", "open", strip([[128, 175], [95, 168], [70, 160]], 8)),
        room("dragon_platform", "open", circle(55, 150, 18), "Dragon's platform"),
        room("east_walk", "open", strip([[172, 178], [200, 182], [222, 190]], 8), "Resting Heide Knight"),
        room("arena", "open", circle(240, 215, 20), "Dragonrider arena"),
        room("link2", "open", strip([[256, 228], [270, 238]], 8)),
        room("tower_of_flame", "interior", circle(282, 250, 16), "Tower of Flame"),
        room("north_walk", "open", strip([[282, 234], [280, 205], [276, 175]], 8)),
        room("spiral", "interior", circle(274, 158, 12), "Spiral stair"),
      ],
      features: [
        note([150, 416], "← Majula"),
        stairs([175, 352], [158, 344], { label: "Stairs down to Heide's Ruin" }),
        lever([140, 278], "Contraption: raises the far tower ring"),
        lever([48, 142], "Drawbridge lever"),
        bridge([[40, 150], [14, 150]], "Drawbridge"),
        note([14, 138], "→ Cathedral of Blue"),
        fog([224, 204], [236, 194], "Fog door"),
        stairs([258, 230], [268, 238], { label: "Stairs up after the boss" }),
        stairs([274, 166], [274, 150], { to: "lower", label: "Spiral stair down" }),
      ],
    },
    {
      id: "lower",
      name: "Lower halls",
      level: 0,
      rooms: [
        room("spiral_base", "interior", circle(274, 158, 12), "Spiral stair (bottom)"),
        room("hallway", "interior", strip([[274, 146], [268, 110], [262, 80]], 9), "Old Knight hallway"),
        room("chest_room", "interior", rect(232, 96, 26, 20), "Chest room (Syan Soldier)"),
        room("flooded", "water", strip([[262, 68], [240, 50], [200, 40], [160, 36], [120, 30]], 10), "Flooded corridor"),
        room("knight_corridor", "interior", strip([[205, 36], [205, 12]], 7), "Knight Set corridor"),
      ],
      features: [
        stairs([274, 150], [274, 166], { to: "towers", label: "Spiral stair up" }),
        door([258, 106], [262, 106], "Chest room"),
        lift([262, 74], { label: "Pressure-plate elevator down to the flooded corridor" }),
        locked([200, 30], [210, 30], "Petrified statue (Fragrant Branch of Yore)"),
        door([118, 26], [118, 34], "Knocked-out wall"),
        note([100, 22], "→ No-man's Wharf"),
      ],
    },
  ],
  positions: {
    "heide.entrance": pos(150, 385, "towers"),
    "heide.ruin": pos(175, 352, "towers"),
    "heide.lever_tower": pos(140, 285, "towers"),
    "heide.three_knights": pos(150, 175, "towers"),
    "heide.dragon": pos(55, 150, "towers"),
    "heide.dragonrider": pos(240, 215, "towers"),
    "heide.tower_of_flame": pos(282, 250, "towers"),
    "heide.lower_halls": pos(268, 112, "lower"),
    "heide.flooded": pos(200, 40, "lower"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map04_heide'stowerofflame.png",
    "https://static0.fextralifeimages.com/file/darksouls2/a/a2/Heides_tower_of_flame_map_dark_souls2_wiki_guide565px.png",
  ],
  note: "Original schematic. Platforms are drawn as circles and walkways as strips; the elevator and the flooded corridor share the lower floor although the corridor is one level further down.",
};

export default heides;
