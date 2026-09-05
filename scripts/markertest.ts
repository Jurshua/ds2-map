import { markers, nodeById } from "../src/lib/markers";
import { search } from "../src/lib/search";
console.log("markers", markers.length, "bad nodes", markers.filter((m) => !nodeById.get(m.nodeId)).length, "NaN", markers.filter((m) => Number.isNaN(m.x) || Number.isNaN(m.y)).length);
console.log(search("far fire").slice(0, 2).map((h) => h.label));
