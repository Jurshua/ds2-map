import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, locked, lever, bridge, note } from "./helpers";

/**
 * Shrine of Winter. One long mountain path running west to east: the shrine itself behind the
 * great door on the left, the rainy slope, the tunnel, the Royal Soldiers' path and the bridge
 * to Drangleic Castle on the right.
 */
const winter: AreaMap = {
  areaId: "winter",
  width: 380,
  height: 200,
  floors: [
    {
      id: "path",
      name: "Mountain path",
      level: 0,
      rooms: [
        room("shrine", "interior", circle(46, 70, 24), "Shrine of Winter"),
        room("shrine_steps", "open", strip([[46, 94], [56, 116], [80, 130]], 10), "Steps down"),
        room("slope", "open", strip([[80, 130], [120, 140], [160, 128], [190, 100], [214, 84]], 14), "Rainy slope"),
        room("hero_nook", "open", rect(96, 146, 28, 18), "Soul of a Hero"),
        room("tunnel", "interior", strip([[214, 84], [238, 70], [262, 68]], 8), "Tunnel"),
        room("soldier_path", "open", strip([[262, 68], [290, 78], [312, 104], [326, 132]], 14), "Royal Soldier path"),
        room("boulder_nook", "open", rect(300, 44, 26, 18), "Behind the boulder"),
        room("bridge", "open", strip([[326, 132], [340, 158], [366, 184]], 10), "Bridge to Drangleic Castle"),
      ],
      features: [
        locked([22, 60], [22, 80], "Shrine of Winter door (four Great Souls or 1M Soul Memory)"),
        note([20, 40], "← Shaded Woods"),
        lever([46, 70], "Obelisk → Frozen Eleum Loyce (Frozen Flower, DLC)"),
        note([110, 168], "Down the slope, turn right: Soul of a Hero"),
        note([130, 118], "Roaming Souls, Divine Blessing"),
        note([190, 116], "Large Soul, Human Effigy before the tunnel"),
        note([240, 56], "Tunnel"),
        note([312, 36], "Holy Water Urns x2"),
        note([282, 100], "Lightning Royal Soldiers"),
        note([300, 140], "Crystal Lizard before the bridge"),
        bridge([[330, 140], [366, 184]], "Long bridge"),
        note([348, 194], "→ Drangleic Castle"),
      ],
    },
  ],
  positions: {
    "winter.entrance": pos(46, 70, "path"),
    "winter.slope": pos(150, 132, "path"),
    "winter.soldiers": pos(300, 88, "path"),
    "winter.bridge": pos(344, 164, "path"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map23_shrineofwinter.png",
  ],
  note: "Original schematic. The winding path is straightened into one S-curve; the shrine interior is a single round room and the obelisk is drawn as a contraption icon. Height changes along the slope are not shown.",
};

export default winter;
