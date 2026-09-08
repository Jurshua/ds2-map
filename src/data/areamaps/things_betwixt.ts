import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, ladder, fog, door, locked, drop, lever, bridge, note } from "./helpers";

/**
 * Things Betwixt. Follows the in-game walk from the south-east: the starting grassland, the hollow
 * field and the hidden Ogre path, the Fire Keepers' house, then west through the wooded tunnel to
 * the mist hub with its three tutorial doors, and north up the final path to Majula. One floor;
 * the crows' nest above the first mist tunnel is drawn in plan with its ladder.
 */
const thingsBetwixt: AreaMap = {
  areaId: "things_betwixt",
  width: 380,
  height: 320,
  floors: [
    {
      id: "surface",
      name: "Things Betwixt",
      level: 0,
      rooms: [
        room("sea", "water", [[0, 170], [60, 170], [110, 220], [80, 275], [0, 275]], "Sea"),
        room("pool", "water", [[168, 120], [198, 110], [214, 130], [204, 160], [174, 150]], "Pool under the waterfall"),
        room("beach", "open", [[40, 178], [95, 176], [105, 210], [75, 245], [35, 232]], "Coffin beach"),
        room("grassland", "open", circle(315, 270, 40), "Starting grassland"),
        room("gazebo", "ruin", circle(315, 270, 8), "Gazebo"),
        room("neck", "open", strip([[315, 230], [300, 205]], 12)),
        room("field", "open", [[245, 160], [315, 155], [328, 190], [290, 205], [250, 200]], "Hollow field"),
        room("coin_ledge", "open", circle(340, 170, 10), "Stone-arch ledge"),
        room("ogre_path", "open", strip([[250, 180], [215, 190], [195, 175], [190, 150], [210, 125]], 12), "Hidden Ogre path"),
        room("approach", "open", strip([[280, 160], [266, 130], [258, 110]], 12), "Path to the big doors"),
        room("yard", "open", circle(250, 92, 18), "Fire Keepers' Dwelling"),
        room("house", "interior", rect(268, 74, 30, 28), "Fire Keepers' house"),
        room("tunnel", "open", strip([[232, 96], [200, 104], [168, 100]], 10), "Wooded tunnel"),
        room("hub", "open", circle(148, 95, 20), "Tutorial mists"),
        room("mist1", "open", strip([[128, 95], [100, 90], [80, 70]], 10), "First mist tunnel (hollows)"),
        room("nest", "open", circle(70, 50, 13), "Dyna & Tillo's nest"),
        room("mist2", "open", strip([[160, 82], [178, 62], [195, 45]], 10), "Second mist (dash-jump stone)"),
        room("orb_room", "interior", rect(186, 16, 28, 20), "Dead-end room"),
        room("mist3", "open", strip([[134, 110], [112, 132], [96, 152]], 10), "Third mist (Basilisks)"),
        room("basilisk", "interior", circle(100, 160, 12), "Basilisk chamber"),
        room("exit_path", "open", strip([[148, 75], [152, 50], [145, 28], [135, 12]], 10), "Path to the final gate"),
      ],
      features: [
        note([300, 314], "Start: Prowler Hounds in the grass"),
        note([352, 160], "Stone arch (Rusted Coin)"),
        note([222, 206], "Bushy break (Gold Pine Resin, Ogre)"),
        note([186, 116], "Waterfall (Small Smooth & Silky Stone)"),
        bridge([[210, 125], [232, 104]], "Small wooden bridge"),
        drop([234, 104], [242, 98], { label: "Drop down to the house doors" }),
        door([252, 116], [264, 112], "Big doors"),
        door([268, 88], [268, 96], "House door (Fire Keepers, Milibeth)"),
        note([262, 114], "Cart (Torch, Soul of a Lost Undead)"),
        fog([128, 84], [128, 100], "Mist 1"),
        ladder([76, 62], { label: "Ladder up to the nest (kick it down to return)" }),
        fog([158, 78], [166, 88], "Mist 2"),
        ladder([194, 42], { label: "Ladder to the Cracked Red Eye Orb room" }),
        door([198, 36], [206, 36], "Wooden door"),
        fog([134, 106], [144, 116], "Mist 3"),
        locked([118, 124], [128, 132], "Petrified statue (Fragrant Branch of Yore)"),
        drop([100, 170], [85, 186], { label: "Hole past the Basilisks (Estus Flask Shard)" }),
        lever([60, 222], "Coffin: changes your character's gender"),
        note([70, 250], "Two Ogres; the Pursuer appears here (SotFS)"),
        door([130, 14], [142, 10], "Final gate"),
        note([150, 6], "→ Majula"),
      ],
    },
  ],
  positions: {
    "tb.gazebo": pos(315, 270, "surface"),
    "tb.ogre_path": pos(215, 190, "surface"),
    "tb.dwelling": pos(250, 92, "surface"),
    "tb.tutorial": pos(148, 95, "surface"),
    "tb.nest": pos(70, 50, "surface"),
    "tb.coffin": pos(70, 208, "surface"),
    "tb.exit": pos(150, 45, "surface"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map01_betwixt.png",
    "https://static0.fextralifeimages.com/file/darksouls2/e/e3/Things_betwixt_map_dark_souls2_wiki_guide565px.png",
  ],
  note: "Original schematic. The three mist tunnels are straightened and shortened; the nest ledge and the Red Eye Orb room are drawn beside their ladders rather than above them, and the coffin beach is placed west of the Basilisk drop.",
};

export default thingsBetwixt;
