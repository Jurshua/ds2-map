import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, stairs, fog, door, note } from "./helpers";

/**
 * Cathedral of Blue. South to north: the drawbridge from Heide's enters the antechamber at the
 * bottom, the Old Dragonslayer's nave fills the middle, Targray's balcony is the round apse at the
 * top, and the side passage on the right drops to the bonfire. One floor.
 */
const cathedralBlue: AreaMap = {
  areaId: "cathedral_blue",
  width: 210,
  height: 265,
  floors: [
    {
      id: "cathedral",
      name: "Cathedral",
      level: 0,
      rooms: [
        room("entry", "interior", rect(80, 200, 40, 50), "Entrance hall"),
        room("nave", "interior", rect(40, 80, 120, 118), "Nave (Old Dragonslayer)"),
        room("balcony", "interior", circle(100, 50, 22), "Targray's balcony"),
        room("side", "interior", strip([[112, 78], [140, 72], [162, 80], [176, 96], [178, 120]], 8), "Side passage"),
        room("bonfire", "interior", rect(158, 150, 36, 30), "The Blue Cathedral"),
      ],
      features: [
        note([100, 258], "← Heide's Tower of Flame (drawbridge)"),
        note([100, 240], "Corpse & iron chest (Old Radiant Lifegem, Human Effigies)"),
        fog([88, 199], [112, 199], "Fog door"),
        door([92, 80], [108, 80], "Doors to the balcony (after the boss)"),
        note([100, 34], "Blue Sentinel Targray (covenant)"),
        note([78, 60], "Chest: Cracked Blue Eye Orbs"),
        note([122, 60], "Chest: Tower Shield, Cleric's Parma"),
        stairs([178, 148], [178, 124], { label: "Staircase down to the bonfire" }),
      ],
    },
  ],
  positions: {
    "cob.entrance": pos(100, 225, "cathedral"),
    "cob.dragonslayer": pos(100, 140, "cathedral"),
    "cob.bonfire": pos(176, 165, "cathedral"),
    "cob.balcony": pos(100, 50, "cathedral"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map05_cathedralofblue.png",
    "https://static0.fextralifeimages.com/file/darksouls2/a/a2/Heides_tower_of_flame_map_dark_souls2_wiki_guide565px.png",
  ],
  note: "Original schematic. The nave's pews and pillars are omitted and the bonfire stair is drawn as a short side passage; the bonfire room is actually one level below the balcony.",
};

export default cathedralBlue;
