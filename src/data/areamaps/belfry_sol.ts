import type { AreaMap } from "../types";
import { room, pos, rect, circle, strip, stairs, ladder, fog, door, locked, illusory, drop, lever, note } from "./helpers";

/**
 * Belfry Sol. Three small sheets stacked on top of Iron Keep: the Approach bonfire behind the
 * Pharros' door (bottom), the belfry courtyard with its two towers and the exit ledge (middle),
 * and the rooftop run from the ladder tower back down to the Immolation chest (top).
 */
const belfrySol: AreaMap = {
  areaId: "belfry_sol",
  width: 220,
  height: 200,
  floors: [
    {
      id: "roof",
      name: "Rooftops",
      level: 2,
      rooms: [
        room("ladder_tower_top", "interior", circle(50, 60, 12), "Ladder tower (top)"),
        room("roof_run", "open", strip([[62, 60], [100, 52], [140, 58], [172, 74]], 12), "Rooftops"),
        room("roof_end", "open", rect(166, 74, 30, 26), "Roof end (Greatsword keeper)"),
      ],
      features: [
        ladder([50, 60], { to: "belfry", label: "Ladder down to the courtyard" }),
        note([100, 40], "Simpleton's Spice corpses"),
        note([140, 44], "Dual Avelyn Bell Keeper"),
        stairs([181, 100], [181, 88], { to: "belfry", label: "Doorway on the left: stairs down to the Immolation chest" }),
      ],
    },
    {
      id: "belfry",
      name: "Belfry",
      level: 1,
      rooms: [
        room("landing", "interior", rect(20, 96, 30, 30), "Ladder landing"),
        room("courtyard", "open", [[50, 40], [150, 40], [150, 130], [50, 130]], "Belfry courtyard"),
        room("ladder_tower", "interior", circle(50, 60, 12), "Ladder tower"),
        room("bell_tower", "interior", circle(150, 60, 12), "Bell-lever tower"),
        room("side_passage", "interior", strip([[150, 120], [176, 120], [181, 100]], 10), "Passage from the rooftops"),
        room("chest_room", "interior", rect(160, 126, 40, 26), "Immolation chest"),
        room("exit_ledge", "interior", strip([[180, 152], [180, 178]], 14), "Exit ledge"),
      ],
      features: [
        ladder([28, 118], { to: "approach", label: "Ladder down to Belfry Sol Approach" }),
        note([35, 86], "Head Bell Keeper (gravestone if dead)"),
        fog([50, 104], [50, 118], "Fog gate"),
        note([100, 56], "Puppet phantoms, ballista"),
        note([100, 110], "Drifter Swordsman Aidel's sign (right after the first puppets)"),
        note([66, 122], "Mad Warrior corner"),
        lever([150, 60], "Bell lever: rings the bell"),
        ladder([50, 60], { to: "roof", label: "Ladder tower up to the rooftops" }),
        stairs([181, 100], [181, 88], { to: "roof", label: "Stairs up to the roof end" }),
        door([176, 126], [186, 126], "Door to the Immolation chest"),
        stairs([180, 152], [180, 142], { label: "Stairs down to the ledge (Human Effigy, Triclops Snake Troches)" }),
        illusory([187, 158], [187, 172], "Illusory wall: Black Knight Greatsword, Protective Chime, Grand Spirit Tree Shield"),
        drop([180, 178], [180, 190], { label: "Drop back into Iron Keep above the lever hall" }),
        note([170, 194], "→ Iron Keep (lever hall)"),
      ],
    },
    {
      id: "approach",
      name: "Approach",
      level: 0,
      rooms: [
        room("ladder_shaft", "interior", strip([[28, 150], [28, 120]], 10), "Ladder from Iron Keep"),
        room("bonfire_room", "interior", rect(10, 150, 60, 36), "Belfry Sol Approach"),
      ],
      features: [
        locked([28, 190], [28, 186], "Pharros' door below (Iron Keep lever hall)"),
        note([50, 194], "← Iron Keep (Pharros' door, ladder up)"),
        note([56, 158], "Thunder Quartz Ring +1 chest"),
        ladder([28, 124], { to: "belfry", label: "Ladder up to the belfry" }),
      ],
    },
  ],
  positions: {
    "sol.approach": pos(40, 168, "approach"),
    "sol.leader": pos(35, 106, "belfry"),
    "sol.courtyard": pos(100, 85, "belfry"),
    "sol.roof": pos(120, 56, "roof"),
    "sol.exit": pos(180, 165, "belfry"),
  },
  references: [
    "http://www.kouryakubo.com/darksouls2/image/maps/map15_belfrysol.png",
  ],
  note: "Original schematic. The belfry is drawn as one square courtyard between two round towers; the rooftop run and the Approach bonfire are separate sheets although they are only a storey apart. The drop into Iron Keep lands above the lever hall of the Iron Keep plan.",
};

export default belfrySol;
