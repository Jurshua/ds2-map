import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, stairs, ladder, lift, fog, drop, lever, bridge, note } from "./helpers";

/**
 * Shulva, Sanctum City. The Black Gulch passage enters at the top right and the dragon's cave and
 * Sanctum Walk bonfire sit on the heights with the obelisk plaza and the egg rooms. The wide
 * staircase drops to the cliffs floor: the winding cliff, the chasm bridged by the three obelisk
 * towers to the Tower of Prayer, the Pagan Tree cave, and (east) the Priestess' Chamber tower with
 * its long bridge to the Sanctum key wing. The lower city runs under both, from the Tower of
 * Prayer drop to the elevator building and Sinh's bridge down to the Dragon's Sanctum.
 */
const shulva: AreaMap = {
  areaId: "shulva",
  width: 440,
  height: 470,
  floors: [
    {
      id: "heights",
      name: "Heights",
      level: 2,
      rooms: [
        room("gulch_corridor", "interior", strip([[420, 8], [416, 36], [410, 66]], 12), "Passage from the Black Gulch"),
        room("dragon_cave", "interior", circle(400, 94, 24), "Dragon's cave"),
        room("descent", "open", strip([[386, 116], [366, 142], [354, 166]], 10), "Path down to the bonfire"),
        room("sanctum_walk", "open", circle(346, 186, 18), "Sanctum Walk"),
        room("balm_landing", "interior", rect(356, 204, 30, 52), "Elevator landing (Old Growth Balm)"),
        room("plaza_path", "open", strip([[328, 186], [306, 192], [286, 198]], 10)),
        room("plaza", "open", [[196, 150], [286, 160], [292, 214], [256, 248], [200, 244], [176, 204]], "Obelisk plaza"),
        room("archer_tower", "interior", circle(258, 172, 10), "Archers' tower"),
        room("bow_platform", "open", rect(178, 226, 22, 16), "Long Bow platform"),
        room("red_room", "interior", rect(140, 112, 46, 34), "Red egg room"),
        room("poisonbite_bld", "interior", rect(96, 100, 38, 28), "Poisonbite Ring building"),
        room("crawler_room", "interior", rect(188, 96, 34, 26), "Four-crawler room"),
        room("mushroom_ledge", "open", rect(224, 100, 16, 12), "Elizabeth Mushroom ledge"),
      ],
      features: [
        note([378, 14], "← Black Gulch (the Rotten's obelisk)"),
        note([372, 60], "Dragon Charms (left inside the doorway)"),
        note([400, 124], "The sleeping dragon flies off"),
        stairs([368, 230], [360, 206], { label: "Stairs down left of the bonfire (Old Growth Balm)" }),
        lift([370, 246], { to: "lower", label: "Elevator from the Rusted Coin building (rides up only once the Dragon's Rest obelisk is struck)" }),
        note([300, 178], "Feigning Sanctum Soldier"),
        lever([246, 186], "Obelisk: raises the archers' tower (Dark Quartz Ring +3 on the pillar)"),
        lever([210, 232], "Obelisk: gazebo tower, ride it down to the Long Bow +7 platform"),
        note([276, 240], "Poison Stone soldier"),
        stairs([196, 168], [184, 150], { label: "Stairs up to the egg rooms" }),
        lever([138, 122], "Obelisk: raises a tower into the Poisonbite Ring building"),
        note([206, 88], "Urn cluster & stairs to the Elizabeth Mushroom ledge"),
        stairs([118, 170], [140, 150], { to: "cliffs", label: "Wide staircase down past the Poison Statue Cluster" }),
      ],
    },
    {
      id: "cliffs",
      name: "Cliffs",
      level: 1,
      rooms: [
        room("chasm", "void", [[8, 196], [90, 196], [96, 300], [8, 300]], "Chasm"),
        room("tower1", "interior", circle(78, 246, 7), "1st tower"),
        room("tower2", "interior", circle(60, 246, 7), "2nd tower"),
        room("tower3", "interior", circle(42, 246, 7), "3rd tower"),
        room("tower_of_prayer", "interior", circle(22, 246, 14), "Tower of Prayer"),
        room("ladder_bld", "interior", rect(62, 274, 22, 20), "Ladder building"),
        room("statue_landing", "open", circle(108, 184, 16), "Poison Statue Cluster"),
        room("winding_cliff", "open", strip([[108, 200], [94, 226], [102, 254], [124, 274], [150, 286]], 14), "Winding cliff (archers)"),
        room("statue_path", "open", strip([[150, 286], [176, 298], [196, 318]], 10), "Red-eyed statues"),
        room("pagan_chasm", "void", [[186, 322], [250, 322], [250, 356], [186, 356]], "Chasm"),
        room("pagan_cave", "interior", circle(236, 374, 18), "Pagan Tree cave"),
        room("priestess", "interior", circle(330, 290, 18), "Priestess' Chamber"),
        room("long_bridge", "open", strip([[314, 304], [302, 372], [296, 440]], 8), "Long bridge"),
        room("dead_cave", "interior", strip([[348, 290], [380, 286], [412, 282]], 10), "Cave to the dead"),
      ],
      features: [
        stairs([118, 170], [140, 150], { to: "heights", label: "Wide staircase up to the egg rooms" }),
        note([134, 196], "Throwing Knives, Cracked Red Eye Orbs"),
        note([122, 268], "Twinkling Titanite, Lloyd's Talismans among the archers"),
        lever([104, 240], "Obelisks: shoot them to raise the three towers"),
        bridge([[92, 246], [36, 246]], "Three raised obelisk towers"),
        note([60, 226], "Pillar hopping: Darknight Stones, Thunder Quartz Ring +3"),
        ladder([73, 284], { label: "Ladder building (alternative route to the tower)" }),
        drop([22, 262], [22, 272], { to: "lower", label: "Other door: drop down left to the lower city" }),
        note([164, 306], "Break the red-eyed statues"),
        lever([200, 326], "Obelisk: raises the tower across the chasm"),
        bridge([[200, 330], [226, 358]], "Raised tower to the Pagan Tree cave"),
        note([272, 384], "Torches on the structure's middle level"),
        lever([344, 280], "Obelisk: enables the elevator"),
        lift([318, 300], { to: "lower", label: "Elevator down to Sinh's bridge building" }),
        note([290, 380], "Rockshield Baldyr invades"),
        note([296, 458], "→ Dragon's Sanctum (Eternal Sanctum Key wing)"),
        fog([394, 276], [394, 292], "Fog gate to the Cave of the Dead"),
        note([420, 268], "→ Cave of the Dead"),
        note([352, 320], "Cave of the Dead exit hole lands on the elevator's mid-level (Dark Greatsword)"),
      ],
    },
    {
      id: "lower",
      name: "Lower city",
      level: 0,
      rooms: [
        room("drop_ledge", "open", rect(8, 236, 30, 24), "Dried Root ledge"),
        room("lower_bld", "interior", rect(38, 226, 50, 38), "Building below the Tower of Prayer"),
        room("mace_ledge", "open", strip([[88, 260], [122, 270], [152, 270]], 8), "Sanctum Mace ledge"),
        room("lower_path", "open", strip([[88, 244], [140, 236], [200, 232], [262, 236], [316, 246]], 12), "Lower city"),
        room("elev_bld", "interior", rect(316, 226, 72, 82), "Elevator building (Rusted Coins)"),
        room("sinh_bridge", "open", strip([[352, 308], [354, 366], [356, 426]], 9), "Sinh's bridge"),
        room("focus_ledge", "open", rect(370, 400, 28, 16), "Vase ledge (Focus Souls)"),
        room("sanctum_gate", "interior", rect(338, 426, 36, 26), "Sanctum building"),
      ],
      features: [
        note([22, 226], "Drop from the Tower of Prayer (Dried Root)"),
        note([152, 282], "Sanctum Mace at the far right of the ledge"),
        lift([370, 246], { to: "heights", label: "Elevator up to Sanctum Walk (activated from the Dragon's Rest obelisk)" }),
        lift([318, 300], { to: "cliffs", label: "Elevator up to the Priestess' Chamber" }),
        note([380, 372], "Sinh bombards the bridge"),
        note([356, 462], "→ Dragon's Sanctum"),
      ],
    },
  ],
  positions: {
    "shulva.entrance": pos(416, 36, "heights"),
    "shulva.sanctum_walk": pos(346, 186, "heights"),
    "shulva.obelisks": pos(232, 200, "heights"),
    "shulva.red_rooms": pos(163, 129, "heights"),
    "shulva.winding_cliff": pos(102, 254, "cliffs"),
    "shulva.tower_of_prayer": pos(22, 246, "cliffs"),
    "shulva.pagan_tree": pos(236, 374, "cliffs"),
    "shulva.lower_city": pos(200, 232, "lower"),
    "shulva.priestess_chamber": pos(334, 286, "cliffs"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map101_shulvasanctumcity.png",
    "https://static0.fextralifeimages.com/file/darksouls2/5/5e/Shulva_sanctum_city_dark_souls_2_wiki_guide_565px.png",
  ],
  note: "Original schematic. The city's many half-levels are collapsed into three floors; obelisk towers are drawn only where they form bridges, the two elevator shafts are drawn end-over-end in plan, and the Priestess' Chamber is placed above the bridge building its elevator descends to.",
};

export default shulva;
