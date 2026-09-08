import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, stairs, door, locked, drop, note } from "./helpers";

/**
 * Grand Cathedral. Runs south to north: the stairs from Aava's arena arrive at the bottom, the doors
 * open into the vestibule with the bonfire, the nave and its red carpet climb to Alsanna's altar, and
 * the passage behind her leads east to the Old Chaos portal.
 */
const grandCathedral: AreaMap = {
  areaId: "grand_cath",
  width: 220,
  height: 300,
  floors: [
    {
      id: "cathedral",
      name: "Cathedral",
      level: 0,
      rooms: [
        room("entry_stairs", "interior", strip([[110, 290], [110, 260]], 12), "Stairs from Aava's arena"),
        room("vestibule", "interior", rect(94, 228, 32, 30), "Vestibule"),
        room("nave", "interior", [[80, 226], [140, 226], [152, 190], [150, 130], [135, 100], [110, 92], [85, 100], [70, 130], [68, 190]], "Nave (red carpet)"),
        room("altar", "interior", rect(96, 96, 28, 20), "Alsanna's altar"),
        room("passage", "interior", strip([[110, 92], [110, 70]], 10), "Passage"),
        room("corridor", "interior", strip([[110, 66], [160, 66], [185, 58]], 10), "Corridor"),
        room("portal", "open", circle(190, 40, 18), "Old Chaos portal"),
      ],
      features: [
        note([110, 296], "← Frozen Eleum Loyce (Aava)"),
        locked([100, 258], [120, 258], "Grand Cathedral doors (open after Aava)"),
        note([132, 244], "Vessel Shield"),
        door([100, 228], [120, 228], "Doors to the nave"),
        stairs([110, 220], [110, 180], { label: "Steps up the red carpet" }),
        locked([102, 90], [118, 90], "Path opened after agreeing to help Alsanna"),
        note([150, 76], "Loyce Knights gather here"),
        note([190, 62], "Lucatiel and Twiggy Shei's signs"),
        drop([190, 46], [190, 26], { label: "Drop into the Old Chaos with the Loyce Knights (one-way)" }),
        note([190, 14], "→ Old Chaos"),
      ],
    },
  ],
  positions: {
    "gc.bonfire": pos(110, 243, "cathedral"),
    "gc.alsanna": pos(110, 106, "cathedral"),
    "gc.chaos_drop": pos(190, 40, "cathedral"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map302_grandcathedral.png",
  ],
  note: "Original schematic. The nave is drawn as one hall; its side aisles and the stairs to the upper walkway are omitted.",
};

export default grandCathedral;
