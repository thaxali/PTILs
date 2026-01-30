import type { PTIL } from "./ptils";

const WIDTH = 1200;
const HEIGHT = 630;
const DPR = 2; // 2x resolution for sharp output

function loadImage(src: string, crossOrigin?: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = crossOrigin;
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCoverFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = w / h;
  let sx = 0,
    sy = 0,
    sw = img.naturalWidth,
    sh = img.naturalHeight;

  if (imgRatio > canvasRatio) {
    sw = img.naturalHeight * canvasRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / canvasRatio;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
}

async function loadLogoAsWhite(): Promise<HTMLImageElement> {
  try {
    const resp = await fetch("/ptils.svg");
    let svgText = await resp.text();
    svgText = svgText.replace(/fill="#2D2A32"/g, 'fill="#FFFFFF"');
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = await loadImage(url);
    URL.revokeObjectURL(url);
    return img;
  } catch {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }
}

// Word-wrap text to fit within maxWidth, returns array of lines
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? currentLine + " " + word : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function generateShareImage(ptil: PTIL): Promise<Blob> {
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * DPR;
  canvas.height = HEIGHT * DPR;
  canvas.style.width = WIDTH + "px";
  canvas.style.height = HEIGHT + "px";
  const ctx = canvas.getContext("2d")!;
  ctx.scale(DPR, DPR);

  // 1. Background image
  try {
    const imgUrl = ptil.imageUrl + "&_share=1";
    const bgImg = await loadImage(imgUrl, "anonymous");
    drawCoverFit(ctx, bgImg, WIDTH, HEIGHT);
  } catch {
    const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    grad.addColorStop(0, "#2D2A32");
    grad.addColorStop(1, "#1a1820");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  // 2. Gradient overlay
  const overlay = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  overlay.addColorStop(0, "rgba(0,0,0,0.2)");
  overlay.addColorStop(0.35, "rgba(0,0,0,0.1)");
  overlay.addColorStop(0.7, "rgba(0,0,0,0.35)");
  overlay.addColorStop(1, "rgba(0,0,0,0.7)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 3. PTILS logo (top-left, white version)
  const logo = await loadLogoAsWhite();
  const logoHeight = 50;
  const logoWidth = (logo.naturalWidth / logo.naturalHeight) * logoHeight;
  ctx.drawImage(logo, 48, 40, logoWidth, logoHeight);

  // 4. Tagline — same line as logo, to its right
  ctx.font = '28px "Instrument Serif", serif';
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText("Discover New AI Prompts", 48 + logoWidth + 20, 40 + logoHeight / 2);

  // 5. "Today's prompt is" — bottom area
  ctx.font = '40px "Instrument Serif", serif';
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText("Today's prompt is", 48, 400);

  // 6. Title text with blur effect
  ctx.font = '54px "Instrument Serif", serif';
  const titleLines = wrapText(ctx, ptil.title, WIDTH - 96);
  const lineHeight = 66;
  const titleStartY = 465;

  const supportsFilter = typeof ctx.filter !== "undefined";

  if (supportsFilter) {
    ctx.save();
    ctx.filter = "blur(14px)";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    for (let i = 0; i < titleLines.length; i++) {
      ctx.fillText(titleLines[i], 48, titleStartY + i * lineHeight);
    }
    ctx.filter = "none";
    ctx.restore();
  } else {
    // Safari fallback
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    for (let i = 0; i < titleLines.length; i++) {
      ctx.fillText(titleLines[i], 48, titleStartY + i * lineHeight);
    }
    ctx.restore();
  }

  // 7. Silver shimmer dots over blurred text — matched to text bounds
  // Measure actual text width to constrain particles
  ctx.font = '54px "Instrument Serif", serif';
  let maxTextWidth = 0;
  for (const line of titleLines) {
    maxTextWidth = Math.max(maxTextWidth, ctx.measureText(line).width);
  }
  const particleArea = {
    x: 48,
    y: titleStartY - 54, // top of first line (ascent)
    w: Math.min(maxTextWidth, WIDTH - 96),
    h: titleLines.length * lineHeight,
  };

  // Seeded random for deterministic particles
  let seed = ptil.number;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  // Silver/white shimmer dots (~120)
  for (let i = 0; i < 120; i++) {
    const x = particleArea.x + rand() * particleArea.w;
    const y = particleArea.y + rand() * particleArea.h;
    const radius = 0.5 + rand() * 2;
    const opacity = 0.3 + rand() * 0.7;
    const silver = Math.floor(200 + rand() * 55);
    ctx.save();
    ctx.globalAlpha = opacity;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `rgb(${silver},${silver},${Math.min(255, silver + 10)})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 8. Watermark
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("ptils.me", WIDTH - 48, HEIGHT - 28);

  // 8. Export as PNG blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/png"
    );
  });
}
