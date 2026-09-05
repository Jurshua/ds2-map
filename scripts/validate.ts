import { validate, counts } from "../src/data";
const problems = validate();
console.log(JSON.stringify(counts));
if (problems.length) { console.log(problems.join("\n")); process.exit(1); }
console.log("data OK");
