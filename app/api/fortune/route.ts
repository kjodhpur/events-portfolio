import fs from "fs";
import path from "path";
import sharp from "sharp";
import { QUOTES } from "@/lib/profile-quotes";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const FONT_PATH = path.join(
  process.cwd(),
  "lib/fonts/DejaVuSansMono-Bold.ttf"
);
const FONT_DATA_URI = `data:font/ttf;base64,${fs
  .readFileSync(FONT_PATH)
  .toString("base64")}`;

/** Match make_ascii_svg.py portrait geometry + typewriter reveal. */
const COLS = 180;
const ART_W = 800;
const CELL_W = ART_W / COLS;
const CELL_H = (CELL_W * 15) / 8;
const ROWS = Math.round((COLS * 8) / 15); // 96
const PAD = 20;
const TITLEBAR_H = 30;
const STATUS_H = 30;
const CANVAS_W = ART_W + PAD * 2;
const ART_H = ROWS * CELL_H;
const CANVAS_H = TITLEBAR_H + ART_H + STATUS_H + PAD;

const RAMP = " .`:-=+*cs#%@";
const BG = "#0d1117";
const BG2 = "#111722";
const FRAME = "#30363d";
const TITLE_TEXT = "#7d8590";
const INK = "#c9d1d9";
const CURSOR = "#c9d1d9";

const ROW_DUR = 5.8 / ROWS;
const STAGGER = ROW_DUR;

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapWords(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Render quote as luminance bitmap → same ASCII ramp as the childhood portrait. */
async function quoteToAsciiRows(quote: string, author: string): Promise<string[]> {
  const scale = 8;
  const W = COLS * scale;
  const H = ROWS * scale;
  const fontSize = 13 * scale;
  const lineH = 17 * scale;

  const bodyLines = wrapWords(`"${quote}"`, 36).slice(0, 5);
  const lines = [...bodyLines, "", `— ${author}`];
  const blockH = lines.length * lineH;
  const y0 = Math.floor((H - blockH) / 2);

  const textNodes = lines
    .map((line, i) => {
      const fill = line.startsWith("—") ? "#666666" : "#1a1a1a";
      const size = line.startsWith("—") ? fontSize * 0.85 : fontSize;
      return `<text x="50%" y="${y0 + i * lineH + fontSize}" text-anchor="middle" font-size="${size}" fill="${fill}" font-family="FortuneMono">${esc(line)}</text>`;
    })
    .join("");

  // Embed mono font so Vercel/librsvg rasterizes real letter shapes (not tofu).
  const textSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <style type="text/css"><![CDATA[
      @font-face {
        font-family: "FortuneMono";
        src: url("${FONT_DATA_URI}") format("truetype");
        font-weight: 700;
        font-style: normal;
      }
    ]]></style>
  </defs>
  <rect width="100%" height="100%" fill="#ffffff"/>
  ${textNodes}
</svg>`;

  const { data } = await sharp(Buffer.from(textSvg))
    .greyscale()
    .resize(COLS, ROWS, { kernel: "lanczos3" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Autocontrast-ish: stretch luminances that aren't pure white
  let lo = 255;
  let hi = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    if (v < 250) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
  }
  if (hi <= lo) {
    hi = 255;
    lo = 0;
  }

  const rows: string[] = [];
  for (let y = 0; y < ROWS; y++) {
    let line = "";
    for (let x = 0; x < COLS; x++) {
      let lum = data[y * COLS + x] / 255;
      // stretch subject tones
      const raw = data[y * COLS + x];
      if (raw < 250) {
        lum = (raw - lo) / (hi - lo);
        lum = Math.min(1, Math.max(0, lum));
      } else {
        lum = 1;
      }
      lum = Math.pow(lum, 1.12);
      if (lum >= 0.9) {
        line += " ";
      } else {
        const idx = Math.min(
          RAMP.length - 1,
          Math.floor((1 - lum) * (RAMP.length - 1))
        );
        line += RAMP[idx];
      }
    }
    rows.push(line);
  }
  return rows;
}

async function renderSvg(): Promise<string> {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const rowsTxt = await quoteToAsciiRows(q.text, q.author || "Unknown");
  const artTop = TITLEBAR_H + PAD * 0.35;
  const fontSize = CELL_H * 0.86;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_W}" height="${CANVAS_H}" ` +
      `viewBox="0 0 ${CANVAS_W} ${CANVAS_H}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">`
  );
  parts.push(
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="${BG2}"/><stop offset="1" stop-color="${BG}"/>` +
      `</linearGradient></defs>`
  );
  parts.push(
    `<rect width="${CANVAS_W}" height="${CANVAS_H}" rx="12" fill="url(#bg)"/>`
  );
  parts.push(
    `<rect x="0.5" y="0.5" width="${CANVAS_W - 1}" height="${CANVAS_H - 1}" rx="12" fill="none" stroke="${FRAME}" stroke-width="1"/>`
  );
  parts.push(
    `<line x1="0" y1="${TITLEBAR_H}" x2="${CANVAS_W}" y2="${TITLEBAR_H}" stroke="${FRAME}"/>`
  );
  for (const [i, dot] of ["#ff5f56", "#ffbd2e", "#27c93f"].entries()) {
    parts.push(
      `<circle cx="${PAD + i * 16}" cy="${TITLEBAR_H / 2}" r="5" fill="${dot}"/>`
    );
  }
  parts.push(
    `<text x="${CANVAS_W / 2}" y="${TITLEBAR_H / 2 + 4}" fill="${TITLE_TEXT}" font-size="12" text-anchor="middle">kanha@github: ~$ ./fortune.sh</text>`
  );

  for (let ry = 0; ry < rowsTxt.length; ry++) {
    const line = rowsTxt[ry];
    const y = artTop + ry * CELL_H + CELL_H * 0.74;
    const rowY = artTop + ry * CELL_H;
    const delay = ry * STAGGER;
    const safe = esc(line);
    const text =
      `<text xml:space="preserve" x="${PAD}" y="${y.toFixed(1)}" fill="${INK}" ` +
      `font-size="${fontSize.toFixed(1)}" textLength="${ART_W}" lengthAdjust="spacing">${safe}</text>`;

    parts.push(
      `<clipPath id="r${ry}"><rect x="${PAD}" y="${rowY.toFixed(1)}" height="${CELL_H}" width="0">` +
        `<animate attributeName="width" from="0" to="${ART_W}" begin="${delay.toFixed(3)}s" ` +
        `dur="${ROW_DUR.toFixed(2)}s" fill="freeze"/></rect></clipPath>`
    );
    parts.push(`<g clip-path="url(#r${ry})">${text}</g>`);
    parts.push(
      `<rect y="${(rowY + 1).toFixed(1)}" width="${CELL_W}" height="${CELL_H - 2}" fill="${CURSOR}" opacity="0">` +
        `<animate attributeName="x" from="${PAD}" to="${PAD + ART_W}" begin="${delay.toFixed(3)}s" ` +
        `dur="${ROW_DUR.toFixed(2)}s" fill="freeze"/>` +
        `<set attributeName="opacity" to="0.85" begin="${delay.toFixed(3)}s"/>` +
        `<set attributeName="opacity" to="0" begin="${(delay + ROW_DUR).toFixed(3)}s"/></rect>`
    );
  }

  const statusLineY = TITLEBAR_H + ART_H + PAD * 0.35;
  const statusY = statusLineY + 19;
  parts.push(
    `<line x1="0" y1="${statusLineY.toFixed(1)}" x2="${CANVAS_W}" y2="${statusLineY.toFixed(1)}" stroke="${FRAME}"/>`
  );
  parts.push(
    `<text x="${PAD}" y="${statusY.toFixed(1)}" fill="${TITLE_TEXT}" font-size="13">` +
      `kanha@github:~$ fortune <tspan fill="${INK}">→ dots type in · new quote every refresh</tspan></text>`
  );
  const statusChars =
    "kanha@github:~$ fortune → dots type in · new quote every refresh ".length;
  parts.push(
    `<rect x="${(PAD + statusChars * 13 * 0.6).toFixed(1)}" y="${(statusY - 12).toFixed(1)}" width="8" height="14" fill="${INK}">` +
      `<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.51;1" dur="1s" repeatCount="indefinite"/></rect>`
  );

  parts.push("</svg>");
  return parts.join("");
}

export async function GET() {
  try {
    const svg = await renderSvg();
    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "fortune render failed";
    return new Response(`fortune error: ${message}`, { status: 500 });
  }
}
