import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, lift, fog, drop, lever, note } from "./helpers";

/**
 * Dark Chasm of Old. Three separate pockets of the Abyss on one sheet, each entered from its
 * own Grandahl altar: the Shaded Ruins chasm bottom-left, the Black Gulch chasm in the middle
 * and the Drangleic Castle chasm on the right. The Darklurker's arena sits top-left; every
 * chasm's exit pit leads there once all three sconces burn.
 */
const chasm: AreaMap = {
  areaId: "chasm",
  width: 440,
  height: 280,
  floors: [
    {
      id: "chasms",
      name: "Chasms",
      level: 0,
      rooms: [
        // Darklurker
        room("arena", "interior", circle(70, 50, 30), "Darklurker's arena"),
        room("return", "interior", rect(60, 84, 20, 18), "Return portal"),
        // Shaded Ruins chasm
        room("shaded_entry", "open", rect(14, 150, 20, 26), "Shaded Ruins entry"),
        room("shaded_path", "open", strip([[34, 162], [70, 150], [104, 150]], 10), "Path (Tenebrous Rogue)"),
        room("shaded_hall", "open", [[104, 140], [150, 136], [170, 160], [166, 200], [140, 228], [118, 214], [112, 176]], "Deadeye & Witchtree Spirit hall"),
        room("shaded_lift_room", "interior", rect(66, 210, 30, 24), "Second Rogue's ledge"),
        // Black Gulch chasm
        room("gulch_entry", "open", rect(196, 100, 20, 22), "Black Gulch entry"),
        room("gulch_upper", "open", [[216, 96], [270, 92], [290, 110], [280, 130], [220, 130]], "Upper hall (Abyss Ironclad, Dark Xanthous)"),
        room("gulch_left", "open", strip([[240, 130], [232, 160], [232, 184]], 10), "Left hall to the sconce"),
        room("gulch_sconce", "open", circle(232, 198, 14), "Sconce chamber"),
        room("gulch_lower", "open", [[250, 150], [310, 146], [330, 166], [318, 196], [258, 196], [246, 172]], "Lower hall (Witchtree Spirits)"),
        room("gulch_pit", "void", rect(280, 200, 26, 22), "Exit pit"),
        // Drangleic Castle chasm
        room("castle_entry", "open", rect(400, 16, 20, 24), "Drangleic Castle entry"),
        room("castle_descent", "open", strip([[410, 40], [404, 80], [392, 120], [376, 150]], 10), "Long descent (Dark Prince, Abyss Havel)"),
        room("castle_hall", "open", [[352, 150], [400, 146], [426, 172], [418, 216], [380, 232], [352, 206]], "Witchtree Spirit hall"),
        room("castle_pit", "void", rect(392, 236, 24, 22), "Exit pit"),
        room("castle_sconce", "open", circle(346, 238, 14), "Sconce chamber"),
      ],
      features: [
        // Darklurker
        note([70, 14], "Reached from any chasm's exit pit once all three sconces are lit"),
        fog([56, 78], [84, 78], "Mist: Darklurker"),
        note([70, 112], "Portal back to the area you came from"),
        // Shaded Ruins chasm
        note([24, 140], "← Shaded Woods (Grandahl's altar, Human Effigy)"),
        note([140, 124], "Underworld Deadeye"),
        lift([116, 200], { label: "Lift down to the second Tenebrous Rogue" }),
        lever([150, 216], "Sconce (Flame Butterfly)"),
        drop([140, 228], [140, 244], { label: "Foggy exit pit → Darklurker" }),
        // Black Gulch chasm
        note([206, 90], "← Black Gulch (Grandahl's altar, Human Effigy)"),
        lever([232, 198], "Sconce down the left hall"),
        drop([250, 186], [258, 170], { label: "Drop into the lower hall" }),
        drop([292, 196], [292, 214], { label: "Foggy exit pit → Darklurker" }),
        // Drangleic Castle chasm
        note([410, 8], "← Drangleic Castle (Grandahl's altar, Human Effigy)"),
        note([420, 96], "Abyss Havel; Dark Prince"),
        fog([388, 224], [404, 234], "Shadowveil Assassin's mist"),
        lever([346, 238], "Sconce"),
        drop([404, 236], [404, 256], { label: "Foggy exit pit → Darklurker" }),
      ],
    },
  ],
  positions: {
    "chasm.shaded_portal": pos(24, 163, "chasms"),
    "chasm.gulch_portal": pos(206, 111, "chasms"),
    "chasm.castle_portal": pos(410, 28, "chasms"),
    "chasm.darklurker": pos(70, 50, "chasms"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map25_darkchasmofoldest.png",
    "https://static0.fextralifeimages.com/file/darksouls2/0/08/Dark_chasm_of_old_dark_souls_2_wiki_guide_565px.png",
  ],
  note: "Original schematic. The three chasms are separate instances drawn side by side on one floor; their winding halls are simplified to a few polygons and the exit pits are drawn as one-way drops toward the Darklurker's arena.",
};

export default chasm;
