import fs from "fs";
import path from "path";
import matter from "gray-matter";

const dir = "/Users/ax/PTILs/content/ptils";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".mdx")).sort();
let errors = [];
for (const f of files) {
  try {
    const raw = fs.readFileSync(path.join(dir, f), "utf-8");
    const { data } = matter(raw);
    if (!data.id || !data.title || !data.prompt) errors.push(f + ": missing fields");
  } catch(e) {
    errors.push(f + ": " + e.message);
  }
}
console.log("Total files:", files.length);
console.log("Errors:", errors.length);
errors.forEach(e => console.log("  ", e));
