import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, stairs, ladder, fog, door, drop, lever, bridge, note } from "./helpers";

/**
 * Grave of Saints. Three floors: the catacombs entered from Majula's pit (west), the upper
 * level reached by the ladder past the waterfall face (east), and the bridges above The Gutter
 * below everything. The Rat King's chamber sits over the dry fountain so its hole drops back
 * into the catacombs, and the coffin pit below the fountain lands on the stone bridge.
 */
const graveSaints: AreaMap = {
  areaId: "grave_saints",
  width: 370,
  height: 310,
  floors: [
    {
      id: "upper",
      name: "Upper level",
      level: 2,
      rooms: [
        room("ladder_top", "interior", circle(318, 58, 12), "Ladder top (Rhoy invades)"),
        room("upper_hall", "interior", strip([[318, 70], [318, 112], [302, 140]], 12), "Upper level (rats, acid pools)"),
        room("tomb", "interior", rect(328, 84, 24, 18), "Tomb (Homeward Bones)"),
        room("grave_entrance", "interior", rect(278, 138, 30, 26), "Grave Entrance"),
        room("arena", "interior", circle(245, 152, 26), "Royal Rat Vanguard"),
        room("rat_king", "interior", rect(168, 128, 52, 46), "Rat King's chamber"),
      ],
      features: [
        ladder([318, 58], { to: "catacombs", label: "Ladder down to the waterfall passage" }),
        lever([308, 108], "Pharros' contraptions (acid pools, help Rat King hosts)"),
        note([352, 108], "Repair Powder corpse"),
        fog([277, 144], [277, 158], "Mist door"),
        door([219, 146], [219, 158], "Door after the arena"),
        note([194, 138], "Rat King (covenant)"),
        drop([184, 152], [184, 118], { to: "catacombs", label: "Hole in the floor → dry fountain (one-way)" }),
      ],
    },
    {
      id: "catacombs",
      name: "Catacombs",
      level: 1,
      rooms: [
        room("pit_ledge", "open", rect(8, 30, 42, 16), "Torch-lined ledge (Majula's pit)"),
        room("entry", "interior", strip([[50, 38], [88, 38], [108, 62]], 8), "Entry (two Hollow Prisoners)"),
        room("harval", "interior", rect(100, 62, 30, 22), "Harval's Resting Place"),
        room("link_fountain", "interior", strip([[130, 73], [152, 78]], 8)),
        room("fountain", "interior", circle(182, 90, 30), "Dry fountain chamber"),
        room("coffin_pit", "void", circle(182, 138, 14), "Coffin pit"),
        room("lit_stairs", "interior", strip([[212, 90], [238, 90]], 8), "Lit stairs"),
        room("junction", "interior", rect(238, 70, 40, 40), "Pharros' junction"),
        room("bridge_gap", "void", rect(248, 110, 20, 26), "Gap"),
        room("rat_room", "interior", circle(258, 152, 16), "Petrified-rat room (Poison Moss)"),
        room("whisper", "interior", rect(280, 140, 26, 22), "Whisper of Despair"),
        room("waterfall", "interior", strip([[278, 84], [300, 72], [318, 60]], 8), "Waterfall passage"),
      ],
      features: [
        note([28, 20], "← Majula's pit"),
        note([182, 110], "Pharros' Lockstone below the hole"),
        stairs([214, 90], [236, 90], { label: "Small stairs up into the lit area" }),
        lever([258, 104], "Pharros' floor face: lowers the bridge"),
        bridge([[258, 110], [258, 136]], "Pharros' bridge"),
        stairs([270, 148], [282, 150], { label: "Stairs up (Torch, Whisper of Despair)" }),
        lever([296, 78], "Waterfall Pharros' face"),
        ladder([318, 60], { to: "upper", label: "Ladder up to the upper level (Rhoy invades)" }),
        drop([182, 118], [182, 132], { to: "bridges", label: "Jump down the jutting coffins (one-way)" }),
      ],
    },
    {
      id: "bridges",
      name: "Bridges above The Gutter",
      level: 0,
      rooms: [
        room("water_pit", "water", rect(120, 150, 140, 90), "Water pit"),
        room("coffin_landing", "interior", circle(182, 138, 14), "Coffin pit landing"),
        room("stone_bridge", "open", strip([[182, 150], [182, 236]], 8), "Stone bridge"),
        room("chime_ledge", "open", rect(198, 162, 18, 12), "Disc Chime ledge"),
        room("wooden_bridge", "open", strip([[132, 196], [232, 196]], 6), "Wooden bridge"),
        room("ring_ledge", "open", rect(232, 188, 22, 16), "Ash Knuckle Ring chest"),
        room("flooded", "water", strip([[260, 210], [288, 222], [306, 244]], 8), "Flooded tunnel (Sublime Bone Dust)"),
        room("scaffold", "void", circle(318, 262, 14), "Scaffolding shaft"),
        room("scaffold_base", "interior", rect(298, 278, 44, 20), "Scaffold base (Token of Spite)"),
      ],
      features: [
        note([182, 246], "Bleed Stone skeleton"),
        note([220, 156], "Jump from the stone bridge"),
        note([178, 206], "Running jump across the broken gap"),
        drop([190, 210], [230, 216], { label: "Drop to the water pit (one-way)" }),
        note([300, 206], "Royal Knight guards the chest; Great Heal"),
        ladder([318, 256], { label: "Scaffolding ladders down (one-way)" }),
        note([340, 250], "Human Effigy, Radiant Lifegem"),
        note([320, 304], "→ The Gutter"),
      ],
    },
  ],
  positions: {
    "grave.ledge": pos(29, 38, "catacombs"),
    "grave.harval": pos(115, 73, "catacombs"),
    "grave.fountain": pos(182, 90, "catacombs"),
    "grave.bridge_hall": pos(258, 90, "catacombs"),
    "grave.upper": pos(318, 96, "upper"),
    "grave.entrance_bf": pos(293, 151, "upper"),
    "grave.vanguard": pos(245, 152, "upper"),
    "grave.rat_king": pos(200, 156, "upper"),
    "grave.bridges": pos(182, 192, "bridges"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map16_graveofsaints.png",
    "https://static0.fextralifeimages.com/file/darksouls2/1/12/Grave_of_giants_map_dark_souls2_wiki_guide565px.png",
  ],
  note: "Original schematic. The upper level is folded back over the catacombs so the Rat King's hole lands in the fountain; the coffin descent is drawn as a single pit and the bridges, water pit and scaffolding tunnel share one floor although they step down in the game.",
};

export default graveSaints;
