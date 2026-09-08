import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, stairs, ladder, lift, fog, door, locked, illusory, lever, note } from "./helpers";

/**
 * Sinners' Rise. Runs west to east then south: the Bastille bridge enters on the left, the
 * Saltfort bonfire sits on a rooftop above the entrance hall, the lift in the Royal Swordsman
 * building drops into the flooded dungeon, and the cell corridor leads south past the two
 * oil-room stairways to the Lost Sinner and the Primal Bonfire.
 */
const sinnersRise: AreaMap = {
  areaId: "sinners_rise",
  width: 300,
  height: 430,
  floors: [
    {
      id: "saltfort",
      name: "Saltfort roof",
      level: 2,
      rooms: [
        room("saltfort_room", "interior", rect(90, 20, 50, 40), "The Saltfort"),
        room("saltfort_ledge", "interior", rect(140, 28, 26, 14), "Small ledge (Large Soul)"),
      ],
      features: [
        ladder([100, 56], { to: "entry", label: "Ladder down to the entrance hall" }),
        door([140, 32], [140, 42], "Doorway to the right: tiny ledge with a corpse"),
      ],
    },
    {
      id: "entry",
      name: "Entrance & lift",
      level: 1,
      rooms: [
        room("bridge", "open", strip([[10, 140], [70, 140]], 8), "Bridge from the Bastille"),
        room("entrance_hall", "interior", rect(70, 120, 50, 40), "Entrance hall"),
        room("outer_ledge", "open", strip([[120, 152], [150, 172], [178, 182]], 8), "Outer ledge (broken stairs)"),
        room("lift_house", "interior", rect(132, 100, 60, 60), "Royal Swordsman lift house"),
      ],
      features: [
        note([14, 130], "← Lost Bastille (bridge)"),
        door([66, 134], [66, 146], "Mist door from the Bastille bridge"),
        note([96, 112], "Archer above the entrance"),
        ladder([100, 126], { to: "saltfort", label: "Ladder up to the Saltfort bonfire" }),
        stairs([132, 140], [120, 140], { label: "Stairs down into the Royal Swordsman building" }),
        note([186, 192], "Human Effigy by the archer's broken stairs"),
        lift([162, 130], { to: "dungeon", label: "Lift down to the flooded dungeon" }),
      ],
    },
    {
      id: "dungeon",
      name: "Flooded dungeon",
      level: 0,
      rooms: [
        room("lift_landing", "interior", circle(162, 130, 14), "Lift landing"),
        room("knife_platform", "interior", rect(180, 112, 16, 12), "Lacerating Knife platform"),
        room("landing_corridor", "water", strip([[162, 144], [162, 166]], 8)),
        room("flexile_hall", "water", rect(120, 166, 84, 56), "Flexile Sentry hall"),
        room("left_alcove", "interior", rect(90, 178, 30, 24), "Left alcove (Blossom Kite Shield)"),
        room("right_alcove", "interior", rect(204, 178, 30, 24), "Right alcove"),
        room("ritual_ledge", "open", strip([[236, 188], [254, 176], [266, 160]], 6), "Ledge outside (Bleed Stone)"),
        room("cell_hall", "water", rect(140, 222, 44, 70), "Cell corridor (water level)"),
        room("cell_l1", "interior", rect(116, 228, 24, 18), "Cell"),
        room("cell_l2", "interior", rect(116, 254, 24, 18), "Cell (Lockstone)"),
        room("cell_r1", "interior", rect(184, 228, 24, 18), "Cell"),
        room("cell_r2", "interior", rect(184, 254, 24, 18), "Cell"),
        room("balcony_l", "interior", rect(80, 226, 30, 50), "Upper-left balcony cells"),
        room("balcony_r", "interior", rect(214, 226, 30, 50), "Upper-right balcony (Luet's sign)"),
        room("boss_path", "open", strip([[162, 292], [162, 352]], 8), "Path to the arena"),
        room("left_stair", "open", strip([[156, 312], [130, 326], [110, 346]], 6)),
        room("right_stair", "open", strip([[168, 312], [194, 326], [214, 346]], 6)),
        room("oil_l", "interior", rect(80, 346, 30, 20), "Oil room"),
        room("oil_r", "interior", rect(214, 346, 30, 20), "Oil room (Smooth & Silky Stone)"),
        room("arena", "interior", [[118, 356], [206, 356], [214, 380], [206, 416], [118, 416], [110, 380]], "Lost Sinner's arena"),
        room("exit_stairs", "interior", strip([[212, 382], [240, 382]], 8)),
        room("primal_room", "interior", rect(240, 364, 50, 40), "Primal Bonfire"),
      ],
      features: [
        lift([162, 130], { to: "entry", label: "Lift up to the Royal Swordsman building" }),
        note([146, 112], "Lucatiel's summon sign behind the lift"),
        note([206, 108], "Lacerating Knives: drop onto the platform while riding down"),
        note([162, 160], "Respawning Flexile Sentry, Undead Aberrations"),
        illusory([234, 182], [234, 194], "Hidden door: hug the left wall outside (Northern Ritual Band)"),
        note([214, 210], "Large Soul of a Nameless Soldier (alcove to the right)"),
        stairs([140, 284], [110, 284], { label: "Stairs up to the left balcony" }),
        stairs([184, 284], [214, 284], { label: "Stairs up to the right balcony" }),
        locked([110, 262], [110, 274], "Resting Heide Knight cell (Bastille Key): Fire Seed, Heide Spear"),
        note([94, 218], "First balcony cell: hidden corpse in the left corner"),
        lever([190, 296], "Cell gate mechanism (right of the middle door)"),
        door([152, 292], [172, 292], "Cell gate (raised by the mechanism)"),
        stairs([150, 315], [112, 344], { label: "Stairs up to the left oil room" }),
        stairs([174, 315], [212, 344], { label: "Stairs up to the right oil room" }),
        locked([110, 350], [110, 362], "Oil room gate (Bastille Key): light the oil with a torch"),
        locked([214, 350], [214, 362], "Oil room gate (Bastille Key): light the oil with a torch"),
        note([138, 338], "Radiant Lifegem: narrow path between the stairs"),
        fog([152, 354], [172, 354], "Fog door: Lost Sinner"),
        door([208, 376], [212, 386], "Door on the far side of the arena"),
        stairs([238, 382], [214, 382], { label: "Stairs down beyond the arena" }),
        note([232, 358], "Chest: Fragrant Branch of Yore, Elizabeth Mushroom"),
        note([265, 412], "Primal Bonfire warps back to Majula"),
      ],
    },
  ],
  positions: {
    "sinners.entrance": pos(95, 140, "entry"),
    "sinners.saltfort": pos(115, 40, "saltfort"),
    "sinners.lift": pos(162, 130, "entry"),
    "sinners.dungeon": pos(162, 194, "dungeon"),
    "sinners.lost_sinner": pos(162, 386, "dungeon"),
    "sinners.primal": pos(265, 384, "dungeon"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map09_sinnersrise.png",
    "https://static0.fextralifeimages.com/file/darksouls2/c/cb/Sinner%27s_rise_dark_souls_2_wiki_guide_565px.png",
  ],
  note: "Original schematic. The dungeon's upper balcony cells are drawn beside the water-level cells on the same floor (stairs, no floor change); the curved oil-room stairways and the arena are simplified to strips and a hexagon.",
};

export default sinnersRise;
