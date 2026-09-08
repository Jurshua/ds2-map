import type { AreaMap } from "../types";
import { room, pos, rect, circle, lever, note } from "./helpers";

/**
 * Old Chaos. A single brimstone arena in a sea of lava: you land at the south end, three portals
 * ring the floor and the Burnt Ivory King rises from the alcove at the north.
 */
const oldChaos: AreaMap = {
  areaId: "old_chaos",
  width: 200,
  height: 220,
  floors: [
    {
      id: "arena",
      name: "Arena",
      level: 0,
      rooms: [
        room("lava", "lava", [[0, 0], [200, 0], [200, 220], [0, 220]], "Lava"),
        room("arena", "open", circle(100, 128, 66), "Burnt Ivory King's arena"),
        room("alcove", "open", rect(78, 30, 44, 50), "King's alcove"),
        room("landing", "open", rect(84, 182, 32, 20), "Landing"),
        room("portal_w", "lava", circle(48, 130, 8), "Portal"),
        room("portal_c", "lava", circle(104, 148, 8), "Portal"),
        room("portal_e", "lava", circle(140, 96, 8), "Portal"),
        room("portal_king", "lava", circle(100, 46, 9), "King's portal"),
      ],
      features: [
        note([100, 212], "Landing from the Grand Cathedral"),
        lever([100, 192], "White beam: return to the Grand Cathedral"),
        note([48, 118], "Portal (Charred Loyce Knights)"),
        note([104, 162], "Portal (Charred Loyce Knights)"),
        note([140, 84], "Portal (Charred Loyce Knights)"),
        note([100, 22], "Burnt Ivory King rises here; Crown of the Ivory King after the fight"),
        note([170, 160], "Loyce Knights seal the portals"),
      ],
    },
  ],
  positions: {
    "oc.arena": pos(100, 118, "arena"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map303_theoldchaos.png",
  ],
  note: "Original schematic. Portal positions are approximate; the arena is drawn as a circle with the King's alcove to the north.",
};

export default oldChaos;
