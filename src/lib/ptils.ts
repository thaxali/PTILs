import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PTIL {
  id: string;
  number: number;
  title: string;
  prompt: string;
  whyItWorks: string;
  exampleOutput: string;
  tags: string[];
  worksWith: string[];
  imageUrl: string;
  createdAt: string;
}

const contentDir = path.join(process.cwd(), "content/ptils");

const unsplashImages = [
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=800&q=80",
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",
  "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80",
  "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80",
  "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&q=80",
  "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=800&q=80",
  "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&q=80",
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
  "https://images.unsplash.com/photo-1540206395-68808572332f?w=800&q=80",
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
];

function parseMdxFile(filePath: string): PTIL {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // Parse body sections
  const sections: Record<string, string> = {};
  let currentSection = "";
  for (const line of content.split("\n")) {
    const heading = line.match(/^## (.+)/);
    if (heading) {
      currentSection = heading[1].trim();
      sections[currentSection] = "";
    } else if (currentSection) {
      sections[currentSection] += line + "\n";
    }
  }

  const number = data.number as number;
  const imageUrl =
    data.imageUrl || unsplashImages[(number - 1) % unsplashImages.length];

  return {
    id: data.id,
    number,
    title: data.title,
    prompt: data.prompt,
    tags: data.tags || [],
    worksWith: data.worksWith || ["Claude", "GPT-4", "Gemini"],
    imageUrl,
    createdAt: data.createdAt || "2025-01-15",
    whyItWorks: (sections["Why It Works"] || "").trim(),
    exampleOutput: (sections["Example Output"] || "").trim(),
  };
}

let _cache: PTIL[] | null = null;

export function getAllPtils(): PTIL[] {
  if (_cache) return _cache;

  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  _cache = files.map((f) => parseMdxFile(path.join(contentDir, f)));
  return _cache;
}

export function getPtilById(id: string): PTIL | undefined {
  return getAllPtils().find((p) => p.id === id);
}
