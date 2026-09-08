import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, stairs, ladder, lift, fog, door, locked, illusory, drop, lever, bridge, note } from "./helpers";

/**
 * Undead Crypt. Two floors. The Amana elevator and the Entrance bonfire sit bottom-right; the
 * Leydia Witch stairs climb north-east to Agdayne's walkway on the upper floor, whose corridor
 * runs west past the Soul Vessel room to the bell & statue rooms, the Usurper room and the
 * candlelit hallway that drops into the clock room. The lower floor holds the side area with the
 * light statue, the Undead Ditch bonfire, the clock room with its Pharros' contraption and lever
 * bridge, and the bell hallway leading south-east to Velstadt and Vendrick.
 */
const crypt: AreaMap = {
  areaId: "crypt",
  width: 440,
  height: 440,
  floors: [
    {
      id: "upper",
      name: "Upper crypt",
      level: 1,
      rooms: [
        room("witch_stairs", "interior", strip([[350, 330], [370, 290], [390, 250]], 14), "Leydia Witch hall"),
        room("thin_corridor", "interior", strip([[390, 250], [400, 232]], 8), "Thin corridor"),
        room("agdayne", "interior", circle(404, 214, 16), "Agdayne's walkway"),
        room("west_corridor", "interior", strip([[388, 214], [240, 214]], 8), "Walkway"),
        room("soul_vessel", "interior", rect(226, 236, 40, 28), "Soul Vessel room"),
        room("stone_rooms", "interior", rect(150, 190, 70, 40), "Bell & statue rooms"),
        room("stone_link", "interior", strip([[165, 190], [165, 180]], 8)),
        room("usurper", "interior", rect(140, 130, 50, 50), "Usurper room"),
        room("avelyn_nook", "interior", rect(190, 145, 18, 20), "Avelyn chest"),
        room("candle_hall", "interior", strip([[140, 155], [100, 155], [80, 180], [70, 222]], 8), "Candlelit hallway"),
      ],
      features: [
        stairs([350, 332], [356, 318], { to: "lower", label: "Stairs down to the Entrance bonfire" }),
        note([386, 300], "Syan Soldiers, torch hollow; Scarlett's sign"),
        note([404, 194], "Grave Warden Agdayne (no light!)"),
        note([404, 236], "His guards line the stairs"),
        drop([240, 218], [228, 232], { to: "lower", label: "Drop off the left into the lower side area" }),
        ladder([232, 240], { to: "lower", label: "Ladder from the Crushed Eye Orb chest" }),
        note([246, 232], "Imperious Knight; Soul Vessel"),
        ladder([258, 264], { to: "lower", label: "Ladder up to the Soul of a Hero, then down to the Undead Ditch (one-way)" }),
        door([200, 230], [210, 230], "Mist door"),
        stairs([204, 240], [204, 230], { to: "lower", label: "Stairs down to the lower side area" }),
        lever([200, 200], "Bells: Leydia Pyromancers rise from the sword statues"),
        note([160, 236], "Dried Fingers chest (ladder)"),
        stairs([185, 236], [185, 228], { to: "lower", label: "Steps down to the Undead Ditch" }),
        note([165, 136], "Nameless Usurper invades"),
        illusory([190, 148], [190, 162], "Illusory wall (Avelyn)"),
        note([100, 144], "Imperious Knight blockade"),
        drop([70, 224], [70, 240], { to: "lower", label: "Hole in the floor into the clock room (one-way)" }),
      ],
    },
    {
      id: "lower",
      name: "Lower crypt",
      level: 0,
      rooms: [
        room("elevator", "interior", circle(380, 372, 12), "Elevator from Amana"),
        room("entrance", "interior", rect(330, 330, 40, 36), "Undead Crypt Entrance"),
        room("lower_side", "interior", rect(200, 222, 50, 34), "Lower side area"),
        room("ditch", "interior", rect(240, 270, 44, 30), "Undead Ditch"),
        room("pharros_nook", "interior", rect(70, 226, 20, 18), "Pharros' contraption"),
        room("clock_room", "interior", circle(80, 270, 26), "Clock room"),
        room("chest_room", "interior", rect(66, 298, 28, 20), "6 o'clock chest room"),
        room("bridge_passage", "interior", strip([[102, 282], [140, 290], [180, 288], [240, 286]], 8), "Lever bridge passage"),
        room("bell_hall", "interior", strip([[60, 306], [130, 346], [202, 382]], 24), "Bell hallway"),
        room("velstadt", "interior", rect(200, 370, 56, 56), "Velstadt's arena"),
        room("vendrick_link", "interior", strip([[256, 398], [294, 398]], 8)),
        room("vendrick", "interior", circle(316, 398, 22, 8), "Vendrick's chamber"),
      ],
      features: [
        lift([380, 372], { label: "Elevator from the Shrine of Amana" }),
        note([380, 392], "→ Shrine of Amana"),
        note([350, 326], "Aldia erupts on the first lighting"),
        stairs([350, 332], [356, 318], { to: "upper", label: "Stairs up past the Syan Soldiers" }),
        note([225, 216], "Drop from Agdayne's walkway"),
        lever([212, 248], "Light statue: lights the crypt, spawns 11 Insolent Spirits"),
        note([236, 250], "Simpleton's Spice, Soul of a Great Hero"),
        ladder([244, 232], { to: "upper", label: "Ladder up to the Crushed Eye Orb chest and the Soul Vessel room" }),
        stairs([206, 230], [196, 222], { to: "upper", label: "Stairs up to the mist door (stone rooms)" }),
        ladder([258, 274], { to: "upper", label: "Ladder from the Soul of a Hero (one-way down)" }),
        stairs([248, 276], [240, 268], { to: "upper", label: "Steps up to the bell & statue rooms" }),
        illusory([72, 244], [88, 244], "Illusory wall at 12 o'clock"),
        lever([80, 232], "Pharros' contraption: opens the 6 o'clock chest room"),
        locked([72, 296], [88, 296], "Pharros-opened door (Great Lightning Spear, Olenford's Staff)"),
        note([60, 260], "Bells & Pyromancer statues"),
        lever([150, 298], "Lever: extends the bridge"),
        bridge([[186, 288], [238, 288]], "Bridge back to the Undead Ditch"),
        stairs([60, 304], [70, 292], { label: "Stairs down to the bell hallway" }),
        note([120, 364], "Royal Knights, Dragonrider, the bell"),
        fog([201, 369], [191, 391], "Fog door"),
        note([228, 366], "Chests either side of the fog"),
        door([256, 394], [256, 402], "Doorway straight ahead after the boss"),
        note([316, 376], "King's Ring on the far side"),
        note([316, 426], "→ Memory of the King (after the King's Ring)"),
        note([340, 414], "Emerald Herald appears"),
      ],
    },
  ],
  positions: {
    "crypt.entrance": pos(350, 348, "lower"),
    "crypt.witches": pos(370, 290, "upper"),
    "crypt.agdayne": pos(404, 214, "upper"),
    "crypt.lower_side": pos(225, 239, "lower"),
    "crypt.soul_vessel": pos(246, 250, "upper"),
    "crypt.ditch": pos(262, 285, "lower"),
    "crypt.stone_rooms": pos(185, 210, "upper"),
    "crypt.avelyn_room": pos(165, 155, "upper"),
    "crypt.pharros_room": pos(80, 270, "lower"),
    "crypt.velstadt": pos(228, 398, "lower"),
    "crypt.vendrick": pos(316, 398, "lower"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map28_undeadcrypt.png",
    "https://static0.fextralifeimages.com/file/darksouls2/9/90/Undead_crypt_dark_souls_2_wiki_guide_565px.png",
  ],
  note: "Original schematic. The crypt's diagonal halls are straightened and its many half-levels are collapsed into two floors; the Soul Vessel room and the Undead Ditch are drawn stacked so the one-way ladder reads as a floor change, and the bell hallway is shortened.",
};

export default crypt;
