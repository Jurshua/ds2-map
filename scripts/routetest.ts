import { route, nearest } from "../src/lib/graph";
import { bosses, bonfires } from "../src/data";
const o = { allowGated: true, useWarps: true };
let bad = 0;
for (const b of bosses) {
  const r = route("maj.far_fire", b.node, o);
  if (!r) { console.log("NO ROUTE", b.name); continue; }
  if (r.requirements.some((q) => q.type === "boss" && q.name === b.name) || r.warpRequirements.some((q) => q.type === "boss" && q.name === b.name)) { bad++; console.log("SELF-REQ", b.name); }
}
console.log("self-requiring boss routes:", bad);
const s = route("maj.far_fire", "ik.old_iron_king", { allowGated: true, useWarps: false });
console.log("OIK reqs:", s?.requirements.map((q) => q.name).join(", "));
const n = nearest("brume.throne_floor", bonfires.filter((b) => !b.primal).map((b) => b.id), { allowGated: true, useWarps: false });
console.log("nearest bonfire from Throne Floor:", n?.target.name, n?.total);
const a = route("maj.far_fire", "eleum.aava", o);
console.log("Aava:", a?.steps.map((st) => (st.warp ? "warp:" : "") + st.to.name).join(" > "), "| req:", a?.requirements.map((q) => q.name).join(", "), "| warp req:", a?.warpRequirements.map((q) => q.name).join(", "));
const bs = route("brume.throne_floor", "ip.blue_smelter", { allowGated: true, useWarps: false });
console.log("Blue Smelter:", bs?.steps.map((st) => st.to.name).join(" > "), "| req:", bs?.requirements.map((q) => q.name).join(", "));
