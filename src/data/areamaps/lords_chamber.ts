import type { AreaMap } from "../types";
import { room, pos, circle, strip, stairs, note } from "./helpers";

/**
 * Lord's Private Chamber. A two-room tail on Brightstone Cove Tseldora: the corridor from
 * The Duke's Dear Freja's lair enters from the south-west, the Duke sits in his round study,
 * and the stairs to the right go down into the octagonal Primal Bonfire chamber.
 */
const lordsChamber: AreaMap = {
  areaId: "lords_chamber",
  width: 210,
  height: 140,
  floors: [
    {
      id: "chamber",
      name: "Chamber",
      level: 0,
      rooms: [
        room("corridor", "interior", strip([[18, 122], [56, 122], [78, 102], [78, 74]], 8), "Corridor from Freja's lair"),
        room("study", "interior", circle(90, 50, 22), "Duke Tseldora's study"),
        room("stair_hall", "interior", strip([[110, 52], [128, 62]], 8)),
        room("primal", "interior", circle(160, 76, 32, 8), "Primal Bonfire chamber"),
      ],
      features: [
        note([26, 132], "← Brightstone Cove Tseldora (Freja's lair)"),
        note([90, 30], "Duke Tseldora at his table (Brightstone Key)"),
        stairs([128, 62], [110, 52], { label: "Stairs down to the right of the study" }),
        note([160, 118], "Primal Bonfire warps back to Majula"),
      ],
    },
  ],
  positions: {
    "lpc.study": pos(90, 50, "chamber"),
    "lpc.primal": pos(160, 76, "chamber"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map22_loadsprivatechamber.png",
  ],
  note: "Original schematic. The winding approach corridor is straightened and the study is drawn as a circle; the Primal Bonfire chamber keeps its octagonal footprint.",
};

export default lordsChamber;
