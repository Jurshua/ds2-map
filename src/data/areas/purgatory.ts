import { finalize, it, node, edge, req, FEX } from "../helpers";

const A = "purgatory";
const SRC = FEX + "Undead+Purgatory";
const i = (name: string, cat: Parameters<typeof it>[2], n: string, how: string, extra?: Parameters<typeof it>[5]) => it(A, name, cat, n, how, extra);

export default finalize([4900, 2950], {
  area: {
    id: A,
    name: "Undead Purgatory",
    shape: [[-160, -120], [120, -140], [220, 0], [140, 130], [-140, 140], [-220, 20]],
    label: [0, -90],
    description: "A circular execution ground off Huntsman's Copse. The Executioner's Chariot thunders around the ring; Gren of the Brotherhood of Blood waits by the bonfire above.",
    connections: ["copse"],
    recommendedLevel: "55 to 65",
    source: SRC,
  },
  nodes: [
    node(A, "purg.entrance", "Purgatory fog gate", "entrance", -180, 20, "Fog gate at the end of the Executioner bridge."),
    node(A, "purg.chariot", "Executioner's Chariot ring", "boss", 0, 0, "Circular track with alcoves; lever at the far side drops the gate."),
    node(A, "purg.bonfire", "Undead Purgatory", "bonfire", 150, -60, "Small room up the stairs past the gate; Gren and three statues."),
  ],
  bonfires: [
    { id: "purg.bonfire", name: "Undead Purgatory", areaId: A, note: "Door directly after the gate on the left, up the staircase, beside Gren.", source: SRC },
  ],
  bosses: [
    { id: "boss.executioners_chariot", name: "Executioner's Chariot", areaId: A, node: "purg.chariot", required: false, description: "Two-headed horse and skeletal charioteer racing a circular track. Kill the Necromancers, reach the lever to drop the gate, then fight the horse.", drops: ["Executioner's Chariot Soul"], note: "Optional; guards the Brotherhood of Blood covenant.", source: FEX + "Executioner's+Chariot" },
  ],
  items: [
    i("Fading Soul", "soul", "purg.chariot", "Four corpses around the ring from the start of the area.", { qty: 4, prerequisites: ["Executioner's Chariot defeated (safely)"] }),
    i("Soul of a Brave Warrior", "soul", "purg.chariot", "Corpse hanging off the ledge of the floor gap near the gate lever."),
    i("Cracked Red Eye Orb", "consumable", "purg.bonfire", "Inch around the ledge from the top of the stairs after the gate to a small elevation.", { qty: 2 }),
    i("Fire Seed", "consumable", "purg.entrance", "Corpse on the ledge right of the red phantom before the fog gate (jump to it).", { note: "Fextralife lists it under both the Copse and the Purgatory." }),
  ],
  npcs: [
    { id: "npc.gren", name: "Gren", areaId: A, node: "purg.bonfire", role: "covenant", description: "Brotherhood of Blood leader in the bonfire room; needs a Token of Spite to join. Sells Cracked Red Eye Orbs to members.", wares: ["Cracked Red Eye Orb", "Crest of Blood"], source: SRC },
  ],
  features: [
    { id: "ft.purg.lever", name: "Chariot gate lever", kind: "lever", areaId: A, node: "purg.chariot", description: "Lever on the far side of the ring drops the gate and crashes the chariot.", source: SRC },
    { id: "ft.purg.covenant", name: "Brotherhood of Blood covenant", kind: "covenant", areaId: A, node: "purg.bonfire", requires: "Token of Spite", description: "PvP covenant joined through Gren.", source: SRC },
  ],
  edges: [
    edge("purg.entrance", "purg.chariot", 1, "Through the mist onto the ring."),
    edge("purg.chariot", "purg.bonfire", 1, "Door on the left after the gate, up the stairs.", { requires: [req.boss("Executioner's Chariot")] }),
  ],
}, SRC);
