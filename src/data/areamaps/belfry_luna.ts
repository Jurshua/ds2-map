import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, stairs, ladder, fog, door, drop, lever, note } from "./helpers";

/**
 * Belfry Luna. West to east: the Pharros' wall from the Bastille's Servants' Quarters enters the
 * Bell Keeper's room on the left, the belfry's rooms step up to the third-floor ladder, the bell
 * and the Gargoyles' roof are the upper floor, and the wall walk descends to the Upper Ramparts
 * bonfire with the hound pit below it.
 */
const belfryLuna: AreaMap = {
  areaId: "belfry_luna",
  width: 340,
  height: 240,
  floors: [
    {
      id: "roof",
      name: "Bell & roof",
      level: 2,
      rooms: [
        room("bell_landing", "interior", circle(190, 112, 14), "Bell landing"),
        room("arena", "open", rect(210, 70, 70, 80), "Belfry Gargoyles roof"),
        room("far_tower", "interior", circle(295, 110, 12), "Far tower"),
        room("wall", "open", strip([[295, 122], [295, 186]], 10), "Wall walk"),
        room("bonfire", "open", circle(295, 200, 14), "Upper Ramparts"),
      ],
      features: [
        ladder([190, 120], { to: "belfry", label: "Ladder down to the third floor" }),
        lever([190, 104], "Ring the bell (opens the fog door)"),
        fog([206, 104], [206, 120], "Fog door"),
        note([245, 82], "Gargoyles arrive in waves"),
        note([245, 158], "Soul of a Proud Knight along the roof edge"),
        door([280, 104], [280, 116], "Door out after the boss"),
        note([300, 92], "Stairs down inside: Southern Ritual Band chest"),
        ladder([282, 206], { to: "pit", label: "Ladder down into the hound pit" }),
      ],
    },
    {
      id: "belfry",
      name: "Belfry",
      level: 1,
      rooms: [
        room("entry", "interior", strip([[20, 205], [20, 172]], 8), "Passage from the Pharros' wall"),
        room("keeper_room", "interior", [[36, 110], [70, 110], [70, 172], [10, 172], [10, 136], [36, 136]], "Bell Keeper's room"),
        room("ring_room", "interior", rect(10, 110, 26, 26), "Blue Tearstone Ring room"),
        room("upper_room", "interior", rect(90, 100, 50, 60), "Upper room (hole in the floor)"),
        room("third_floor", "interior", rect(160, 100, 60, 60), "Third floor (four Bell Keepers)"),
      ],
      features: [
        note([20, 214], "← Lost Bastille (Servants' Quarters Pharros' wall)"),
        door([14, 172], [26, 172], "Bell Keeper's door"),
        note([52, 122], "Bell Keeper dwarf (covenant)"),
        door([36, 118], [36, 130], "Blocked by dead keepers"),
        stairs([66, 124], [88, 124], { label: "Stairs up past the phantom keeper" }),
        drop([104, 120], [24, 124], { label: "Hole in the floor → Blue Tearstone Ring room" }),
        note([115, 150], "Skeptic's Spice on the way back to the stairs"),
        stairs([140, 130], [160, 130], { label: "Stairs to the third floor" }),
        note([150, 146], "Glencour's sign under the stairs"),
        ladder([190, 112], { to: "roof", label: "Ladder up to the bell" }),
        note([204, 150], "Chest: Radiant Lifegems, Twilight Herbs"),
      ],
    },
    {
      id: "pit",
      name: "Hound pit",
      level: 0,
      rooms: [
        room("pit", "interior", rect(180, 190, 120, 44), "Hound pit"),
        room("tunnel", "interior", strip([[180, 212], [150, 212]], 8), "Short tunnel"),
      ],
      features: [
        ladder([282, 208], { to: "roof", label: "Ladder up to the Upper Ramparts bonfire" }),
        note([232, 200], "Vorgel the Sinner invades"),
        note([150, 226], "Dragon Tooth, Brightbug, Petrified Something"),
        note([300, 226], "Steps: Enchanted Falchion; Bastille Key (vanilla)"),
      ],
    },
  ],
  positions: {
    "luna.entrance": pos(40, 150, "belfry"),
    "luna.tower": pos(115, 130, "belfry"),
    "luna.gargoyles": pos(245, 110, "roof"),
    "luna.upper_ramparts": pos(295, 200, "roof"),
    "luna.pit": pos(240, 212, "pit"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map08_belfryluna.png",
    "https://static0.fextralifeimages.com/file/darksouls2/a/ac/Lost_bastille_map_dark_souls2_wiki_guide565px.png",
  ],
  note: "Original schematic. The belfry's three stacked rooms are unrolled side by side on one floor; the wall walk to the Upper Ramparts is one level below the roof but shares the roof floor here.",
};

export default belfryLuna;
