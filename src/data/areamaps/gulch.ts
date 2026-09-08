import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, lift, fog, door, locked, drop, lever, note } from "./helpers";

/**
 * Black Gulch. The gorge runs south to north: the fog gate from The Gutter at the bottom,
 * the Black Gulch Mouth cave on the left, the two oil fields, the Hidden Chamber around the
 * hill on the right and The Rotten at the top. The Forgotten Door platform, Grandahl's altar
 * and the Giants' cave lie below the main path on their own floor, joined by the elevator.
 */
const gulch: AreaMap = {
  areaId: "gulch",
  width: 320,
  height: 460,
  floors: [
    {
      id: "gorge",
      name: "Gorge",
      level: 1,
      rooms: [
        room("entry", "open", strip([[160, 446], [160, 410]], 10), "Path from The Gutter"),
        room("mouth_link", "interior", strip([[152, 410], [134, 407]], 8)),
        room("mouth", "interior", circle(118, 405, 16), "Black Gulch Mouth"),
        room("gorge_lower", "open", strip([[160, 410], [164, 370], [160, 325]], 22), "Gorge (poison statues)"),
        room("oil_field", "open", rect(128, 258, 72, 70), "First oil field (Darksuckers)"),
        room("shotel_link", "interior", strip([[130, 282], [116, 282]], 6)),
        room("shotel_cave", "interior", circle(108, 280, 12), "Shotel cave"),
        room("lucatiel_tunnel", "interior", strip([[136, 325], [105, 340], [85, 362]], 8), "Ledge tunnel (Lucatiel)"),
        room("lucatiel", "interior", circle(78, 370, 10), "Lucatiel of Mirrah"),
        room("worms", "open", rect(140, 195, 60, 63), "Cragslipper wall"),
        room("lift_ledge", "open", rect(204, 205, 24, 22), "Elevator ledge"),
        room("big_gully", "open", rect(118, 108, 92, 87), "Big gully (second oil field)"),
        room("blessing_link", "interior", strip([[120, 140], [110, 140]], 6)),
        room("blessing_cave", "interior", circle(102, 140, 12), "Divine Blessing cave"),
        room("hill_path", "open", strip([[210, 185], [242, 178], [262, 160]], 8), "Around the hill"),
        room("hidden_chamber", "interior", circle(278, 142, 16), "Hidden Chamber"),
        room("shortcut", "interior", strip([[278, 126], [262, 100], [228, 92]], 8), "Shortcut to the fog gate"),
        room("arena", "open", circle(164, 68, 36), "The Rotten's arena"),
        room("tunnel", "interior", strip([[130, 60], [100, 50], [72, 48]], 7), "Narrow tunnel after the boss"),
        room("spice_room", "interior", rect(76, 62, 22, 16), "Chest (Petrified Something, spices)"),
        room("primal", "interior", rect(22, 26, 52, 42), "Primal Bonfire (The Rotten)"),
      ],
      features: [
        note([160, 455], "← The Gutter"),
        fog([150, 438], [170, 438], "Fog gate from The Gutter"),
        note([124, 384], "Cave immediately left of the entrance"),
        note([214, 292], "Schmidt's sign"),
        note([172, 246], "Scraps of Life, Torch; Bashful Ray's sign"),
        lift([216, 216], { to: "below", label: "Elevator from the Giants' cave" }),
        drop([200, 232], [236, 246], { to: "below", label: "Ledge drop to the Forgotten Door platform" }),
        note([164, 198], "Woodland Child Gully invades"),
        locked([256, 158], [266, 168], "Petrified hollow (Fragrant Branch of Yore)"),
        door([270, 128], [286, 128], "Shortcut urn: break it"),
        fog([148, 106], [180, 106], "Fog gate: The Rotten"),
        note([204, 104], "Woodland Child Victor invades"),
        note([164, 40], "Fire Seed across the flames"),
        door([128, 54], [128, 66], "Small door after the boss"),
        note([48, 76], "Obelisk → Shulva, Sanctum City (Dragon Talon)"),
      ],
    },
    {
      id: "below",
      name: "Beneath the gorge",
      level: 0,
      rooms: [
        room("forgotten_platform", "open", rect(222, 238, 36, 28), "Forgotten Door platform"),
        room("grandahl", "interior", rect(260, 238, 40, 28), "Grandahl's altar"),
        room("giants_cave", "interior", circle(190, 315, 34), "Giants' cave (Forgotten Key)"),
        room("ring_room", "interior", rect(150, 342, 32, 24), "Ring of Giants +1 chest"),
        room("lift_passage", "interior", strip([[190, 282], [205, 250], [216, 228]], 8), "Side door to the elevator"),
        room("lift_room", "interior", rect(206, 205, 20, 22), "Elevator"),
      ],
      features: [
        locked([259, 244], [259, 260], "Forgotten Door (Forgotten Key)"),
        lever([284, 258], "Pilgrims of Dark altar"),
        note([280, 282], "→ Dark Chasm of Old"),
        drop([232, 268], [206, 290], { label: "Further drops down to the Giants' cave" }),
        note([190, 300], "Two Giants: Forgotten Key, Soul of a Giant"),
        door([182, 348], [182, 360], "Doorway straight ahead from the cave entrance"),
        note([232, 232], "Silver Talismans on the ledge behind the elevator"),
        lift([216, 216], { to: "gorge", label: "Elevator up to the ledge above the pit" }),
      ],
    },
  ],
  positions: {
    "gulch.entrance": pos(160, 426, "gorge"),
    "gulch.mouth": pos(118, 405, "gorge"),
    "gulch.oil_field": pos(164, 293, "gorge"),
    "gulch.worms": pos(170, 226, "gorge"),
    "gulch.forgotten_door": pos(240, 252, "below"),
    "gulch.grandahl": pos(280, 252, "below"),
    "gulch.big_gully": pos(164, 150, "gorge"),
    "gulch.hidden_chamber": pos(278, 142, "gorge"),
    "gulch.rotten": pos(164, 68, "gorge"),
    "gulch.primal": pos(48, 47, "gorge"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map18_blackgulch.png",
    "https://static0.fextralifeimages.com/file/darksouls2/3/3c/The_gutter_map_dark_souls2_wiki_guide565px.png",
  ],
  note: "Original schematic. The gorge is straightened into a north-south strip and the oil fields are rectangles; the Forgotten Door platform, Grandahl's altar and the Giants' cave are shown on one lower floor although they step down twice in the game.",
};

export default gulch;
