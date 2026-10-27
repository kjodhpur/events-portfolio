import { QUOTES } from "@/lib/profile-quotes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(text: string, width: number) {
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
  return lines.slice(0, 3);
}

function renderSvg() {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const lines = wrap(q.text, 72);
  const author = q.author || "Unknown";

  const W = 860;
  const H = 220;
  const PAD = 24;
  const TITLEBAR_H = 30;
  const BG = "#0d1117";
  const BG2 = "#111722";
  const FRAME = "#30363d";
  const MUTED = "#7d8590";
  const INK = "#e6edf3";
  const GREEN = "#39d353";
  const ACCENT = "#58a6ff";
  const bodyY = TITLEBAR_H + 78;

  const texts = lines
    .map(
      (line, i) =>
        `<text x="${PAD}" y="${bodyY + i * 28}" fill="${INK}" font-size="18" font-weight="600">${esc(line)}</text>`
    )
    .join("") +
    `<text x="${PAD}" y="${bodyY + lines.length * 28 + 18}" fill="${ACCENT}" font-size="14">— ${esc(author)}</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${BG2}"/><stop offset="1" stop-color="${BG}"/></linearGradient></defs>
  <rect width="${W}" height="${H}" rx="12" fill="url(#bg)"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="${FRAME}"/>
  <line x1="0" y1="${TITLEBAR_H}" x2="${W}" y2="${TITLEBAR_H}" stroke="${FRAME}"/>
  <circle cx="${PAD}" cy="${TITLEBAR_H / 2}" r="5" fill="#ff5f56"/>
  <circle cx="${PAD + 16}" cy="${TITLEBAR_H / 2}" r="5" fill="#ffbd2e"/>
  <circle cx="${PAD + 32}" cy="${TITLEBAR_H / 2}" r="5" fill="#27c93f"/>
  <text x="${W / 2}" y="${TITLEBAR_H / 2 + 4}" fill="${MUTED}" font-size="12" text-anchor="middle">kanha@github: ~$ fortune</text>
  <text x="${PAD}" y="${TITLEBAR_H + 36}" fill="${MUTED}" font-size="14">$ echo <tspan fill="${GREEN}">$QUOTE</tspan></text>
  ${texts}
  <text x="${PAD}" y="${H - 18}" fill="${MUTED}" font-size="11">// random on every refresh · Cache-Control: no-store</text>
</svg>`;
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
