/**
 * Validate one or more floor-plan files without registering them:
 *   npx tsx scripts/plancheck.ts src/data/areamaps/wharf.ts [more files...]
 * Prints per-file problems and a coverage summary (nodes placed / rooms / features per floor).
 */
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { nodes, areas } from "../src/data";
import { validateAreaMaps } from "../src/data/areamaps";
import type { AreaMap } from "../src/data/types";

const files = process.argv.slice(2);
if (!files.length) { console.error("usage: npx tsx scripts/plancheck.ts <plan.ts> [...]"); process.exit(2); }
const areaIds = new Set(areas.map((a) => a.id));
async function main() {
let bad = 0;
for (const f of files) {
  const mod = await import(pathToFileURL(resolve(f)).href);
  const map: AreaMap = mod.default;
  if (!map || !map.areaId) { console.log(`${f}: no default AreaMap export`); bad++; continue; }
  const problems = validateAreaMaps(nodes, areaIds, [map]);
  const floors = map.floors.map((fl) => `${fl.id}(${fl.rooms.length} rooms, ${fl.features.length} features)`).join(", ");
  console.log(`${map.areaId}: ${map.width}x${map.height}, ${Object.keys(map.positions).length} nodes placed; floors: ${floors}`);
  if (problems.length) { bad++; for (const p of problems) console.log("  ✗ " + p); } else console.log("  ✓ OK");
}
process.exit(bad ? 1 : 0);
}
main();
