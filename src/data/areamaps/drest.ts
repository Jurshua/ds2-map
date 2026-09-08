import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, stairs, fog, door, drop, lever, note } from "./helpers";

/**
 * Dragon's Rest. A descent: the elevator-building landing and the Drakeblood switch room are on
 * top; the broken bridge drops to the Sanctum Interior bonfire (drawn on the Dragon's Sanctum plan),
 * whose stairs reach the Drakeblood Set room and whose broken bridge starts the ledge descent on the
 * middle floor; the last drops land at the nadir with Elana's arena, the Sanctum Nadir bonfire and
 * Sinh's round arena, laid out top to bottom as on the Kouryakubo sheet.
 */
const drest: AreaMap = {
  areaId: "drest",
  width: 300,
  height: 460,
  floors: [
    {
      id: "top",
      name: "Switch room",
      level: 2,
      rooms: [
        room("elev_landing", "interior", rect(40, 20, 40, 32), "Elevator building landing"),
        room("switch_room", "interior", rect(88, 20, 60, 44), "Drakeblood switch room"),
        room("lizard_vault", "interior", rect(150, 26, 32, 30), "Crystal Lizard vault"),
        room("empty_room", "interior", rect(96, 66, 26, 18), "Empty room"),
        room("broken_bridge", "open", strip([[148, 52], [190, 62], [222, 84]], 10), "Broken bridge"),
      ],
      features: [
        note([60, 10], "← Dragon's Sanctum (elevators)"),
        lever([102, 30], "Left floor switch: only opens an empty room"),
        lever([136, 30], "Right floor switch: the wheel releases four Crystal Lizards"),
        note([166, 66], "Crystal Lizards: Slab, Dragon Bones, stones"),
        drop([222, 88], [228, 104], { label: "Pillar drops down to the Hexing Urn ledge and the Sanctum Interior bonfire" }),
        note([236, 118], "→ Sanctum Interior bonfire (Dragon's Sanctum)"),
      ],
    },
    {
      id: "middle",
      name: "Descent",
      level: 1,
      rooms: [
        room("knight_stairs", "interior", strip([[204, 128], [182, 150], [162, 170]], 10), "Stairs past two Knights"),
        room("drakeblood_room", "interior", rect(100, 160, 62, 42), "Drakeblood Set room"),
        room("descent_ledges", "open", strip([[240, 128], [256, 160], [250, 200], [236, 240], [220, 278]], 14), "Broken bridges & ledges"),
      ],
      features: [
        note([214, 116], "← Sanctum Interior bonfire (Dragon's Sanctum)"),
        stairs([164, 168], [202, 130], { label: "Stairs down past two Drakeblood Knights, left and left" }),
        note([130, 212], "Drakeblood Set among the opened chests"),
        drop([236, 116], [242, 130], { label: "Broken bridge right of the bonfire: drops (one-way)" }),
        note([278, 150], "Run-jump platform: Vine Balm, Twinkling"),
        note([276, 232], "Large Soul, Twinkling, Small Smooth & Silky Stones"),
        drop([222, 264], [220, 280], { to: "nadir", label: "Dead end: drop right and keep dropping (Dragon's Rest title)" }),
      ],
    },
    {
      id: "nadir",
      name: "Nadir",
      level: 0,
      rooms: [
        room("arrival", "open", rect(190, 240, 50, 46), "Landing"),
        room("elana_arena", "interior", rect(170, 290, 90, 70), "Elana's arena"),
        room("nadir_passage", "interior", strip([[170, 328], [140, 330], [104, 342]], 14), "Sanctum Nadir"),
        room("sinh_arena", "open", circle(66, 380, 52), "Sinh's arena"),
      ],
      features: [
        note([250, 262], "Benhart & Steelheart Ellie's signs"),
        fog([200, 290], [230, 290], "Elana's fog gate"),
        door([170, 320], [170, 338], "Dragon-adorned wall (opens after Elana)"),
        note([140, 314], "Abbess Feeva & Transcendent Edde's signs"),
        fog([108, 330], [100, 348], "Sinh's fog gate"),
        note([66, 444], "Crown of the Sunken King & Yorgh's Ring after Sinh"),
      ],
    },
  ],
  positions: {
    "drest.entrance": pos(118, 42, "top"),
    "drest.drakeblood_room": pos(130, 180, "middle"),
    "drest.descent": pos(250, 200, "middle"),
    "drest.elana": pos(215, 325, "nadir"),
    "drest.sanctum_nadir": pos(140, 330, "nadir"),
    "drest.sinh": pos(66, 380, "nadir"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map103_dragonsrest.png",
    "http://www.kouryakubo.com/darksouls2/image/maps/map102_dragonssanctrum.png",
  ],
  note: "Original schematic. The Sanctum Interior bonfire between the switch room and the descent belongs to the Dragon's Sanctum plan; the chain of pillar drops and ledges is drawn as one strip per floor, not ledge by ledge. Only Kouryakubo covers the nadir.",
};

export default drest;
