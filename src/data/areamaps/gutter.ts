import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, ladder, fog, door, locked, illusory, drop, lever, bridge, note } from "./helpers";

/**
 * The Gutter. A shanty of scaffolds that steps down from north-west to south-east: the
 * Grave of Saints tunnel and the Upper Gutter bonfire on the top floor, the six-sconce
 * platform, jar tower, Heide Knight ledge, Ant Queen platform and Central Gutter on the
 * middle floor, and the ladder pit down to the Black Gulch fog gate at the bottom.
 */
const gutter: AreaMap = {
  areaId: "gutter",
  width: 420,
  height: 380,
  floors: [
    {
      id: "upper",
      name: "Upper Gutter",
      level: 2,
      rooms: [
        room("grave_tunnel", "interior", strip([[18, 30], [50, 40], [70, 62]], 8), "Tunnel from the Grave of Saints"),
        room("ramps", "open", strip([[70, 62], [86, 90], [100, 116]], 10), "Wooden ramps down"),
        room("bonfire_structure", "open", rect(78, 114, 62, 52), "Upper Gutter (wooden structure)"),
        room("majula_scaffold", "open", rect(38, 128, 32, 26), "Majula ladder scaffold"),
        room("coal_tar", "open", rect(150, 94, 48, 42), "Coal Tar pools (vases)"),
        room("ramp_up", "open", strip([[140, 128], [166, 96], [192, 74]], 8), "Ramps up past the Coal Tar"),
        room("melinda_platform", "open", rect(184, 38, 58, 40), "Ring of Soul Protection platform"),
        room("mimic_room", "interior", rect(248, 46, 24, 20), "Mimic room"),
        room("ramp_back", "open", strip([[186, 74], [154, 100], [128, 122]], 6), "Ramp back to the bonfire"),
        room("havel_cave", "interior", rect(148, 198, 34, 30), "Cave above the six-sconce platform"),
        room("havel_room", "interior", rect(184, 198, 32, 30), "Havel's Set (jars behind poison statues)"),
        room("zip_roof", "open", rect(322, 140, 38, 30), "Roof above the long ladder"),
      ],
      features: [
        note([20, 20], "← Grave of Saints"),
        ladder([54, 141], { label: "Gilligan's longest ladder from Majula (one-way down)" }),
        note([54, 162], "↑ Majula's pit"),
        door([70, 136], [70, 148], "Door from the Majula ladder"),
        lever([92, 122], "Sconces: light them all for the Gutter Denizen"),
        ladder([190, 72], { label: "Ladder up to the chest platform" }),
        lever([232, 46], "Sconce by the chest: Melinda the Butcher invades"),
        drop([110, 156], [110, 178], { to: "middle", label: "Collapsing floor → long jump to the six-sconce platform" }),
        ladder([160, 212], { to: "middle", label: "Ladder down to the six-sconce platform" }),
        locked([183, 204], [183, 222], "Forgotten Key door (Havel's Set)"),
        ladder([340, 152], { to: "middle", label: "Long ladder down to the Heide Knight ledge" }),
        note([356, 178], "Estus Flask Shard, Bandit Greataxe"),
        drop([324, 150], [252, 172], { to: "middle", label: "Zip-line back to the heart-jar tower roof (one-way)" }),
      ],
    },
    {
      id: "middle",
      name: "Middle Gutter",
      level: 1,
      rooms: [
        room("collapsed_room", "interior", rect(92, 168, 36, 26), "Collapsed-floor room"),
        room("six_sconce", "open", rect(140, 176, 50, 40), "Six-sconce platform"),
        room("hole_platform", "open", rect(190, 186, 32, 24), "Next platform (hole in the floor)"),
        room("jar_tower", "interior", rect(226, 164, 40, 46), "Heart-jar tower (3 storeys)"),
        room("three_sconce", "open", rect(266, 210, 30, 22), "Three-sconce platform"),
        room("bridge_room", "open", strip([[296, 221], [320, 221]], 6), "Bridge"),
        room("heide_ledge", "open", rect(320, 200, 62, 42), "Heide Knight ledge"),
        room("ramp_down", "open", strip([[350, 242], [350, 262], [330, 282]], 8), "Ramp & ladder down"),
        room("mummy_bridge", "open", strip([[330, 282], [298, 294]], 6), "Exploding-mummy bridge"),
        room("greatshield_cave", "interior", rect(300, 312, 28, 22), "Wicked Eye Greatshield cave"),
        room("ant_queen", "open", rect(230, 286, 66, 44), "Ant Queen platform (fog gate)"),
        room("ant_cave", "interior", rect(232, 332, 32, 20), "Ant Queen's cave (Poison Moss)"),
        room("ladder_room", "interior", rect(170, 286, 60, 44), "Ladder room"),
        room("central", "interior", rect(128, 292, 42, 32), "Central Gutter"),
      ],
      features: [
        drop([128, 182], [140, 190], { label: "Long jump (Navlaan can invade)" }),
        ladder([160, 212], { to: "upper", label: "Ladder up to the Forgotten Key cave" }),
        drop([206, 198], [228, 198], { label: "Drop through the hole → jar tower doorway" }),
        note([246, 154], "Dark Pyromancy Flame ledge"),
        note([246, 220], "Top floor: Fragrant Branch, Twinkling Titanite"),
        drop([262, 200], [278, 214], { label: "Drop from the top floor to the three-sconce platform" }),
        bridge([[296, 221], [320, 221]], "Bridge to the Heide Knight ledge"),
        note([351, 190], "Heide Knight; Aurous Set chest; Tattered Cloth hole"),
        ladder([340, 208], { to: "upper", label: "Long ladder up (Estus Shard, zip-line roof)" }),
        ladder([350, 256], { label: "Ladder down to the mummy bridge" }),
        drop([300, 294], [290, 302], { label: "Drop to the fog-gate platform" }),
        note([262, 276], "Poison Arrows; Rotten Vermin's blue gas"),
        fog([230, 296], [230, 318], "Fog gate"),
        illusory([170, 300], [170, 316], "Breakable wall (Central Gutter)"),
        ladder([182, 294], { to: "lower", label: "Ladder hidden by jars → ladder pit" }),
      ],
    },
    {
      id: "lower",
      name: "Ladder pit",
      level: 0,
      rooms: [
        room("pit", "void", circle(200, 312, 32), "Ladder pit (Gutter Denizen)"),
        room("rock_platform", "open", rect(150, 300, 26, 18), "Rock platform (Rotten Pine Resin)"),
        room("club_platform", "open", rect(140, 322, 28, 18), "Great Club chest"),
        room("pit_bottom", "open", rect(180, 330, 52, 22), "Pit bottom (20 Lifegems, Dark Fog, Torch)"),
        room("branch_ledge", "open", rect(258, 340, 42, 24), "Fragrant Branch ledge"),
      ],
      features: [
        ladder([182, 294], { to: "middle", label: "Ladders up to the ladder room" }),
        drop([176, 309], [188, 322], { label: "Platforms and ladders down" }),
        note([200, 366], "Gutter Denizen invades once every sconce is lit"),
        drop([232, 341], [260, 352], { label: "Hole behind the heart-jars → Fragrant Branch ledge" }),
        lever([268, 352], "Sconce"),
        fog([300, 344], [300, 360], "Fog gate → Black Gulch"),
        note([332, 352], "→ Black Gulch"),
      ],
    },
  ],
  positions: {
    "gutter.upper": pos(110, 140, "upper"),
    "gutter.melinda": pos(213, 58, "upper"),
    "gutter.six_sconces": pos(165, 196, "middle"),
    "gutter.jar_tower": pos(246, 187, "middle"),
    "gutter.heide": pos(351, 221, "middle"),
    "gutter.ant_queen": pos(263, 308, "middle"),
    "gutter.central": pos(149, 308, "middle"),
    "gutter.ladders": pos(206, 341, "lower"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map17_thegutter.png",
    "https://static0.fextralifeimages.com/file/darksouls2/3/3c/The_gutter_map_dark_souls2_wiki_guide565px.png",
  ],
  note: "Original schematic. The Gutter's dozens of half-levels are collapsed into three floors; the jar tower is one footprint, the zip-line is drawn as a one-way drop, and the ladder pit's stepped platforms are shown in plan only.",
};

export default gutter;
