import { items } from "../src/data";
const cats = ["estus-shard","bone-dust","branch","lockstone","soul-vessel","ascetic","twinkling","dragon-bone","key"];
for (const c of cats) {
  const list = items.filter((i) => i.category === c);
  console.log(`${c}: ${list.length} records, qty ${list.reduce((s, i) => s + (i.qty ?? 1), 0)}`);
  for (const i of list) console.log(`   - ${i.areaId}: ${i.name}${i.qty ? " x" + i.qty : ""} @ ${i.node}`);
}
