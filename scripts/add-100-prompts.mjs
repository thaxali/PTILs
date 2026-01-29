import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Parse CSV (handling quoted fields with commas and newlines)
function parseCSV(text) {
  const rows = [];
  let current = "";
  let inQuotes = false;
  let fields = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current.trim());
        current = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        fields.push(current.trim());
        current = "";
        if (fields.length > 1) rows.push(fields);
        fields = [];
      } else {
        current += ch;
      }
    }
  }
  if (current || fields.length) {
    fields.push(current.trim());
    if (fields.length > 1) rows.push(fields);
  }
  return rows;
}

// Read existing titles to skip duplicates
const existingTitles = new Set();
const ptilsDir = join(process.cwd(), "content/ptils");
for (let i = 1; i <= 112; i++) {
  const file = join(ptilsDir, `${String(i).padStart(3, "0")}.mdx`);
  if (existsSync(file)) {
    const content = readFileSync(file, "utf-8");
    const match = content.match(/^title:\s*"(.+)"/m);
    if (match) existingTitles.add(match[1].toLowerCase());
  }
}

console.log(`Found ${existingTitles.size} existing prompts`);

// Read and parse CSV
const csv = readFileSync("/tmp/prompts.csv", "utf-8");
const rows = parseCSV(csv);
// Skip header row
const header = rows[0];
const data = rows.slice(1);

console.log(`CSV has ${data.length} prompts`);

// Existing act names (lowercased) to skip duplicates
const existingActs = new Set();
for (const title of existingTitles) {
  existingActs.add(title.toLowerCase());
}

// Tags mapping based on prompt content
function inferTags(act, prompt) {
  const tags = [];
  const lower = (act + " " + prompt).toLowerCase();

  if (lower.includes("code") || lower.includes("program") || lower.includes("developer") || lower.includes("debug") || lower.includes("software") || lower.includes("javascript") || lower.includes("python") || lower.includes("api") || lower.includes("sql") || lower.includes("git") || lower.includes("terminal") || lower.includes("regex")) tags.push("coding");
  if (lower.includes("write") || lower.includes("essay") || lower.includes("story") || lower.includes("poem") || lower.includes("novel") || lower.includes("script") || lower.includes("letter") || lower.includes("blog") || lower.includes("article") || lower.includes("content") || lower.includes("copywrite")) tags.push("writing");
  if (lower.includes("teach") || lower.includes("learn") || lower.includes("study") || lower.includes("education") || lower.includes("student") || lower.includes("tutor") || lower.includes("lesson") || lower.includes("exam")) tags.push("learning");
  if (lower.includes("business") || lower.includes("startup") || lower.includes("market") || lower.includes("brand") || lower.includes("product") || lower.includes("sales") || lower.includes("company")) tags.push("business");
  if (lower.includes("health") || lower.includes("fitness") || lower.includes("diet") || lower.includes("mental") || lower.includes("stress") || lower.includes("meditat") || lower.includes("exercise") || lower.includes("doctor") || lower.includes("dentist")) tags.push("health");
  if (lower.includes("career") || lower.includes("job") || lower.includes("interview") || lower.includes("resume") || lower.includes("salary") || lower.includes("hire") || lower.includes("recruit")) tags.push("career");
  if (lower.includes("creative") || lower.includes("art") || lower.includes("design") || lower.includes("music") || lower.includes("film") || lower.includes("photo")) tags.push("creative");
  if (lower.includes("travel") || lower.includes("trip") || lower.includes("destination") || lower.includes("hotel") || lower.includes("flight")) tags.push("travel");
  if (lower.includes("finance") || lower.includes("money") || lower.includes("invest") || lower.includes("budget") || lower.includes("account") || lower.includes("tax")) tags.push("finance");
  if (lower.includes("language") || lower.includes("translat") || lower.includes("english") || lower.includes("grammar") || lower.includes("vocabulary") || lower.includes("pronunciation")) tags.push("language");
  if (lower.includes("game") || lower.includes("puzzle") || lower.includes("play") || lower.includes("adventure")) tags.push("fun");
  if (lower.includes("research") || lower.includes("science") || lower.includes("academ") || lower.includes("journal") || lower.includes("paper")) tags.push("research");
  if (lower.includes("legal") || lower.includes("law") || lower.includes("contract") || lower.includes("court")) tags.push("legal");
  if (lower.includes("food") || lower.includes("recipe") || lower.includes("cook") || lower.includes("meal") || lower.includes("chef")) tags.push("food");
  if (lower.includes("social media") || lower.includes("instagram") || lower.includes("twitter") || lower.includes("tiktok") || lower.includes("youtube") || lower.includes("seo")) tags.push("marketing");
  if (lower.includes("security") || lower.includes("cyber") || lower.includes("hack") || lower.includes("encrypt")) tags.push("security");

  if (tags.length === 0) tags.push("general");
  return tags.slice(0, 3);
}

// Generate "Why It Works" based on the act
function generateWhyItWorks(act, prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes("act as") || lower.includes("act like")) {
    return `Giving the AI a specific role as a ${act.toLowerCase()} provides a clear frame of reference. The AI draws on patterns associated with that expertise, producing more focused, domain-appropriate responses than a generic prompt would.`;
  }
  return `This prompt works because it gives the AI a concrete task with clear boundaries. Instead of an open-ended request, it channels the response into a specific format and domain, making the output immediately actionable.`;
}

// Generate example output
function generateExampleOutput(act, prompt) {
  return `When given a specific topic or request, the AI responds in character as a ${act.toLowerCase()}, providing detailed and contextually appropriate responses that demonstrate deep understanding of the role.`;
}

// Convert act name to PTILs title format
function actToTitle(act) {
  const lower = act.toLowerCase();
  // Map common patterns
  if (lower.includes("terminal") || lower.includes("console") || lower.includes("shell")) return `You can ask AI to simulate a ${act.toLowerCase()}`;
  if (lower.includes("teacher") || lower.includes("tutor") || lower.includes("instructor")) return `You can ask AI to be your ${act.toLowerCase()}`;
  if (lower.includes("coach") || lower.includes("advisor") || lower.includes("mentor") || lower.includes("guide") || lower.includes("counselor")) return `You can ask AI to be your ${act.toLowerCase()}`;
  if (lower.includes("checker") || lower.includes("reviewer") || lower.includes("critic")) return `You can ask AI to be a ${act.toLowerCase()}`;
  if (lower.includes("generator") || lower.includes("creator") || lower.includes("maker")) return `You can ask AI to work as a ${act.toLowerCase()}`;
  if (lower.includes("writer") || lower.includes("author") || lower.includes("novelist") || lower.includes("poet") || lower.includes("rapper") || lower.includes("composer") || lower.includes("screenwriter")) return `You can ask AI to write as a ${act.toLowerCase()}`;
  if (lower.includes("expert") || lower.includes("specialist")) return `You can ask AI to be a ${act.toLowerCase()}`;
  return `You can ask AI to act as a ${act.toLowerCase()}`;
}

// Filter and select 100 good prompts
const skipTopics = [
  "ethereum", "blockchain", "crypto", // too niche/crypto
  "drunk", "spongebob", "lunatic", // inappropriate
  "gaslighter", // inappropriate
];

const selected = [];
const usedActs = new Set();

for (const row of data) {
  if (selected.length >= 100) break;

  const act = row[0];
  const prompt = row[1];
  if (!act || !prompt || prompt.length < 50) continue;

  const actLower = act.toLowerCase();

  // Skip duplicates
  if (usedActs.has(actLower)) continue;

  // Skip if similar to existing
  const title = actToTitle(act).toLowerCase();
  let skip = false;
  for (const existing of existingTitles) {
    if (existing.includes(actLower) || actLower.includes(existing.replace("you can ask ai to ", "").replace("you can ask claude to ", ""))) {
      skip = true;
      break;
    }
  }
  if (skip) continue;

  // Skip inappropriate topics
  if (skipTopics.some(t => actLower.includes(t))) continue;

  // Skip very short or unclear prompts
  if (prompt.length < 80) continue;

  usedActs.add(actLower);
  selected.push({ act, prompt });
}

console.log(`Selected ${selected.length} new prompts`);

// Unsplash images array (nature/abstract only)
const unsplashImages = [
  "photo-1506744038136-46273834b3fb", // mountain lake
  "photo-1469474968028-56623f02e42e", // sunset mountains
  "photo-1447752875215-b2761acb3c5d", // forest path
  "photo-1507525428034-b723cf961d3e", // tropical beach
  "photo-1518173946687-a4c05a439938", // aurora borealis
  "photo-1519681393784-d120267933ba", // starry mountain
  "photo-1505144808419-1957a94ca61e", // ocean waves
  "photo-1470071459604-3b5ec3a7fe05", // foggy valley
  "photo-1513002749550-c59d786b8e6c", // sky gradient
  "photo-1441974231531-c6227db76b6e", // green forest
  "photo-1501854140801-50d01698950b", // aerial forest
  "photo-1472214103451-9374bd1c798e", // sunset field
  "photo-1500534314263-a834a29e2899", // colorful sky
  "photo-1465146344425-f00d5f5c8f07", // wildflowers
  "photo-1470252649378-9c29740c9fa8", // pink sky
  "photo-1504198453319-5ce911bafcde", // northern lights
  "photo-1494500764479-0c8f2919a3d8", // misty forest
  "photo-1490730141103-6cac27aaab94", // desert sunset
  "photo-1508739773434-c26b3d09e071", // sunset clouds
  "photo-1433086966358-54859d0ed716", // waterfall
  "photo-1484591974057-265bb767ef71", // ocean horizon
  "photo-1488866022504-f2584929ca5f", // river valley
  "photo-1531366936337-7c912a4589a7", // snow peaks
  "photo-1497436072909-60f360e1d4b1", // green hills
  "photo-1542224566-6e85f2e6772f", // desert dunes
];

// Write MDX files
for (let i = 0; i < selected.length; i++) {
  const num = 113 + i;
  const { act, prompt } = selected[i];
  const title = actToTitle(act);
  const tags = inferTags(act, prompt);
  const id = `ptil-${num}`;
  const imageId = unsplashImages[(num - 1) % unsplashImages.length];
  const imageUrl = `https://images.unsplash.com/${imageId}?w=800&q=80`;
  const whyItWorks = generateWhyItWorks(act, prompt);
  const exampleOutput = generateExampleOutput(act, prompt);

  // Clean prompt text - escape quotes
  const cleanPrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, "\\n");

  const mdx = `---
id: "${id}"
number: ${num}
title: "${title}"
prompt: "${cleanPrompt}"
tags: [${tags.map(t => `"${t}"`).join(", ")}]
worksWith: ["Claude", "GPT-4", "Gemini"]
createdAt: "2025-01-15"
---

## Why It Works

${whyItWorks}

## Example Output

${exampleOutput}
`;

  const filename = `${String(num).padStart(3, "0")}.mdx`;
  writeFileSync(join(ptilsDir, filename), mdx);
  console.log(`Created ${filename}: ${title}`);
}

console.log(`\nDone! Created ${selected.length} new MDX files (${113} to ${112 + selected.length})`);
