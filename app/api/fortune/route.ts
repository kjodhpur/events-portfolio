import { QUOTES } from "@/lib/profile-quotes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Same terminal chrome + typewriter clip-wipe as kanha-ascii.svg,
 * sized as the whoami square (840×880). Fewer/larger cells so the
 * quote stays readable at the README's 420px width.
 */
const COLS = 48;
const ART_W = 800;
const CELL_W = ART_W / COLS;
const CELL_H = (CELL_W * 15) / 8;
const PAD = 20;
const TITLEBAR_H = 30;
const STATUS_H = 30;
const CANVAS_W = ART_W + PAD * 2; // 840
const ART_H_TARGET = 800;
const ROWS = Math.round(ART_H_TARGET / CELL_H); // ~25
const ART_H = ROWS * CELL_H;
const CANVAS_H = TITLEBAR_H + ART_H + STATUS_H + PAD; // ~880

const BG = "#0d1117";
const BG2 = "#111722";
const FRAME = "#30363d";
const TITLE_TEXT = "#7d8590";
const INK = "#c9d1d9";
const ACCENT = "#58a6ff";
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

function wrap(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > width && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

function padCenter(s: string, width: number): string {
  if (s.length >= width) return s.slice(0, width);
  const left = Math.floor((width - s.length) / 2);
  return " ".repeat(left) + s + " ".repeat(width - left - s.length);
}

function buildRows(quote: string, author: string): string[] {
  const quoteLines = wrap(quote, COLS - 4).slice(0, 8);
  const block = [...quoteLines, "", `— ${author}`];
  const rows: string[] = Array.from({ length: ROWS }, () => " ".repeat(COLS));
  const start = Math.max(0, Math.floor((ROWS - block.length) / 2));
  block.forEach((line, i) => {
    const r = start + i;
    if (r >= 0 && r < ROWS) rows[r] = padCenter(line, COLS);
  });
  return rows;
}

function renderSvg() {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const rowsTxt = buildRows(q.text, q.author || "Unknown");
  const artTop = TITLEBAR_H + PAD * 0.35;
  const fontSize = CELL_H * 0.72;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_W}" height="${CANVAS_H.toFixed(1)}" ` +
      `viewBox="0 0 ${CANVAS_W} ${CANVAS_H.toFixed(1)}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">`
  );
  parts.push(
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="${BG2}"/><stop offset="1" stop-color="${BG}"/>` +
      `</linearGradient></defs>`
  );
  parts.push(
    `<rect width="${CANVAS_W}" height="${CANVAS_H.toFixed(1)}" rx="12" fill="url(#bg)"/>`
  );
  parts.push(
    `<rect x="0.5" y="0.5" width="${CANVAS_W - 1}" height="${(CANVAS_H - 1).toFixed(1)}" rx="12" fill="none" stroke="${FRAME}" stroke-width="1"/>`
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
    const fill = line.trim().startsWith("—") ? ACCENT : INK;
    const text =
      `<text xml:space="preserve" x="${PAD}" y="${y.toFixed(1)}" fill="${fill}" ` +
      `font-size="${fontSize.toFixed(1)}" textLength="${ART_W}" lengthAdjust="spacing">${esc(line)}</text>`;

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
      `kanha@github:~$ fortune <tspan fill="${INK}">→ new quote every refresh</tspan></text>`
  );
  const statusChars = "kanha@github:~$ fortune → new quote every refresh ".length;
  parts.push(
    `<rect x="${(PAD + statusChars * 13 * 0.6).toFixed(1)}" y="${(statusY - 12).toFixed(1)}" width="8" height="14" fill="${INK}">` +
      `<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.51;1" dur="1s" repeatCount="indefinite"/></rect>`
  );

  parts.push("</svg>");
  return parts.join("");
}

export async function GET() {
  const svg = renderSvg();
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
