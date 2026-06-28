"use client";
import { useEffect, useRef } from "react";

// A tiny minimalist game for the homepage: pick up office trash off the floor
// and toss it into the bin. The room is a pared-down take on a real SF
// coworking lounge — tin ceiling + crystal chandelier, white columns, a
// staircase, a TV showing the match, a plant, and a brick wall with a fridge.

const C = {
  card: "#F4F4EF", ink: "#16181D", muted: "#6B6E66", line: "#CDCDC3",
  emerald: "#0B6E4F", paper: "#ECECE5", wood: "#DCCFB2", woodLine: "#CBBC95",
};

const W = 340, H = 300, FLOOR = 230;
const GRAV = 0.16, POWER = 5.6;
const ORIGIN = { x: 72, y: 196 };
const CAN = { cx: 208, topY: 182, half: 19, inner: 12 };

type Piece = {
  x: number; y: number; vx: number; vy: number; py: number;
  r: number; seed: number; state: "floor" | "held" | "fly" | "sink"; t: number;
};

function rnd(seed: number) {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawColumn(ctx: CanvasRenderingContext2D, x: number) {
  ctx.fillStyle = C.paper; ctx.fillRect(x, 50, 15, FLOOR - 50);
  ctx.fillStyle = "rgba(0,0,0,0.05)"; ctx.fillRect(x + 10, 50, 5, FLOOR - 50);
  ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, 50.5, 15, FLOOR - 50);
  const g = ctx.createRadialGradient(x + 7, 92, 1, x + 7, 92, 16);
  g.addColorStop(0, "rgba(255,236,180,0.5)"); g.addColorStop(1, "rgba(255,236,180,0)");
  ctx.fillStyle = g; ctx.fillRect(x - 9, 76, 33, 33);
}

function drawStairs(ctx: CanvasRenderingContext2D) {
  const steps = 7, sw = 8, sh = 9;
  ctx.fillStyle = "rgba(22,24,29,0.85)";
  ctx.beginPath();
  ctx.moveTo(8, FLOOR); ctx.lineTo(8 + steps * sw, FLOOR - steps * sh); ctx.lineTo(8 + steps * sw, FLOOR);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.muted; ctx.lineWidth = 1.3; ctx.lineJoin = "round";
  let x = 8, y = FLOOR;
  ctx.beginPath(); ctx.moveTo(x, y);
  for (let i = 0; i < steps; i++) { ctx.lineTo(x, y - sh); ctx.lineTo(x + sw, y - sh); x += sw; y -= sh; }
  ctx.stroke();
}

function drawTV(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(40, 196); ctx.lineTo(34, FLOOR); ctx.moveTo(86, 196); ctx.lineTo(92, FLOOR); ctx.stroke();
  rr(ctx, 30, 150, 66, 44, 3); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.emerald; ctx.fillRect(33, 153, 60, 38);
  ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(63, 153); ctx.lineTo(63, 191); ctx.stroke();
  ctx.beginPath(); ctx.arc(63, 172, 6, 0, Math.PI * 2); ctx.stroke();
}

function drawBrick(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "rgba(150,120,105,0.16)"; ctx.fillRect(286, 120, 54, FLOOR - 120);
  ctx.strokeStyle = "rgba(120,95,80,0.25)"; ctx.lineWidth = 1;
  for (let by = 128; by < FLOOR; by += 10) { ctx.beginPath(); ctx.moveTo(286, by); ctx.lineTo(340, by); ctx.stroke(); }
  rr(ctx, 296, 150, 34, 78, 4); ctx.fillStyle = C.card; ctx.fill();
  ctx.strokeStyle = C.line; ctx.stroke();
  ctx.fillStyle = "rgba(11,110,79,0.12)"; rr(ctx, 300, 155, 26, 50, 3); ctx.fill();
  ctx.strokeStyle = C.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(323, 160); ctx.lineTo(323, 200); ctx.stroke();
}

function drawPlant(ctx: CanvasRenderingContext2D, x: number) {
  ctx.fillStyle = C.muted; ctx.beginPath();
  ctx.moveTo(x - 9, FLOOR); ctx.lineTo(x - 7, FLOOR - 16); ctx.lineTo(x + 7, FLOOR - 16); ctx.lineTo(x + 9, FLOOR);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.emerald; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  const base = FLOOR - 16;
  for (const a of [-0.5, -0.18, 0.12, 0.42]) {
    ctx.beginPath(); ctx.moveTo(x, base);
    ctx.quadraticCurveTo(x + a * 30, base - 24, x + a * 46, base - 40); ctx.stroke();
  }
}

function drawThrower(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = C.ink;
  rr(ctx, 40, 178, 22, 52, 8); ctx.fill();
  ctx.beginPath(); ctx.arc(51, 170, 8.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(58, 190); ctx.lineTo(ORIGIN.x, ORIGIN.y); ctx.stroke();
}

function drawScene(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = C.card; ctx.fillRect(0, 0, W, FLOOR);
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, 42);
  const g = ctx.createRadialGradient(170, 42, 6, 170, 42, 140);
  g.addColorStop(0, "rgba(255,255,255,0.55)"); g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.fillRect(30, 0, 280, 110);
  rr(ctx, 96, 24, 148, 17, 8); ctx.fillStyle = "#F8F8F3"; ctx.fill();
  ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = "rgba(180,180,170,0.8)";
  for (let i = 0; i < 27; i++) { const x = 101 + i * 5.2; ctx.beginPath(); ctx.moveTo(x, 41); ctx.lineTo(x, 41 + 3 + (i % 3) * 2.2); ctx.stroke(); }
  drawColumn(ctx, 122); drawColumn(ctx, 252);
  drawStairs(ctx);
  drawTV(ctx);
  drawBrick(ctx);
  ctx.fillStyle = C.wood; ctx.fillRect(0, FLOOR, W, H - FLOOR);
  ctx.strokeStyle = C.woodLine; ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) { const y = FLOOR + i * ((H - FLOOR) / 4); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(176, 254, 126, 17, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(236,236,229,0.9)"; ctx.fill();
  ctx.strokeStyle = "rgba(205,205,195,0.7)"; ctx.lineWidth = 1; ctx.stroke();
  drawPlant(ctx, 158);
  drawThrower(ctx);
}

function drawCan(ctx: CanvasRenderingContext2D, flash: number) {
  const { cx } = CAN; const top = CAN.topY, bot = FLOOR, halfT = CAN.half, halfB = CAN.half - 4;
  ctx.beginPath();
  ctx.moveTo(cx - halfT, top); ctx.lineTo(cx - halfB, bot); ctx.lineTo(cx + halfB, bot); ctx.lineTo(cx + halfT, top);
  ctx.closePath(); ctx.fillStyle = C.paper; ctx.fill();
  ctx.strokeStyle = flash > 0 ? C.emerald : C.muted; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.strokeStyle = "rgba(107,110,102,0.4)"; ctx.lineWidth = 1;
  for (const o of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.moveTo(cx + o * halfT, top + 3); ctx.lineTo(cx + o * halfB, bot - 2); ctx.stroke(); }
  ctx.beginPath(); ctx.ellipse(cx, top, halfT, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#2A2D33"; ctx.fill();
  ctx.strokeStyle = flash > 0 ? C.emerald : C.muted; ctx.lineWidth = flash > 0 ? 2.4 : 1.4; ctx.stroke();
}

function drawTrash(ctx: CanvasRenderingContext2D, p: Piece) {
  ctx.save(); ctx.translate(p.x, p.y);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rad = p.r * (0.78 + 0.34 * rnd(p.seed + i));
    const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
    if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = "#FBFBF7"; ctx.fill();
  ctx.strokeStyle = C.muted; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = "rgba(107,110,102,0.45)";
  ctx.beginPath(); ctx.moveTo(-p.r * 0.4, -p.r * 0.1); ctx.lineTo(p.r * 0.35, p.r * 0.25); ctx.stroke();
  ctx.restore();
}

export function OfficeTrashGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pieces: Piece[] = [];
    let held: Piece | null = null;
    const mouse = { x: ORIGIN.x + 90, y: ORIGIN.y - 70 };
    let score = 0;
    let flash = 0;
    let raf = 0;

    const spawn = () => {
      let x = 0;
      do { x = 92 + Math.random() * 206; } while (Math.abs(x - CAN.cx) < 26);
      pieces.push({ x, y: FLOOR - 6 - Math.random() * 4, vx: 0, vy: 0, py: 0, r: 6, seed: Math.random() * 1000, state: "floor", t: 0 });
    };
    const refill = () => { while (pieces.length < 5) spawn(); };
    refill();

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      drawScene(ctx);
      for (const p of pieces) if (p.state === "sink") { ctx.save(); ctx.globalAlpha = Math.max(0, 1 - p.t / 16); drawTrash(ctx, p); ctx.restore(); }
      drawCan(ctx, flash);
      for (const p of pieces) if (p.state === "floor" || p.state === "fly") drawTrash(ctx, p);
      if (held) {
        let dx = mouse.x - ORIGIN.x, dy = mouse.y - ORIGIN.y;
        const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
        let x = ORIGIN.x, y = ORIGIN.y, vx = dx * POWER, vy = dy * POWER;
        ctx.fillStyle = "rgba(11,110,79,0.5)";
        for (let i = 0; i < 70; i++) {
          x += vx; y += vy; vy += GRAV;
          if (y > FLOOR || x < 0 || x > W) break;
          if (i % 3 === 0) { ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill(); }
        }
        drawTrash(ctx, { ...held, x: ORIGIN.x, y: ORIGIN.y });
      }
      ctx.fillStyle = C.paper; ctx.font = "700 12px 'JetBrains Mono', ui-monospace, monospace"; ctx.textBaseline = "middle";
      ctx.fillText(`IN  ${score}`, 12, 16);
    };

    const tick = () => {
      raf = 0;
      let animating = false;
      for (const p of pieces) {
        if (p.state === "fly") {
          animating = true;
          p.py = p.y;
          p.x += p.vx; p.y += p.vy; p.vy += GRAV;
          if (p.vy > 0 && p.py < CAN.topY && p.y >= CAN.topY && Math.abs(p.x - CAN.cx) < CAN.inner) {
            p.state = "sink"; p.t = 0; score += 1; flash = 16;
          } else if (p.y >= FLOOR - p.r) {
            p.y = FLOOR - p.r; p.x = clamp(p.x, 92, W - 14); p.vx = 0; p.vy = 0; p.state = "floor";
          } else if (p.x < -24 || p.x > W + 24) {
            p.state = "sink"; p.t = 20;
          }
        } else if (p.state === "sink") {
          animating = true; p.t += 1; p.y += 1.5;
        }
      }
      for (let i = pieces.length - 1; i >= 0; i--) if (pieces[i].state === "sink" && pieces[i].t > 16) pieces.splice(i, 1);
      refill();
      if (flash > 0) flash -= 1;
      render();
      if (animating || flash > 0) raf = requestAnimationFrame(tick);
    };
    const ensureLoop = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
    };
    const onMove = (e: PointerEvent) => { const p = toLocal(e); mouse.x = p.x; mouse.y = p.y; if (!raf) render(); };
    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      const p = toLocal(e); mouse.x = p.x; mouse.y = p.y;
      if (held) {
        let dx = p.x - ORIGIN.x, dy = p.y - ORIGIN.y;
        const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
        held.x = ORIGIN.x; held.y = ORIGIN.y; held.py = ORIGIN.y;
        held.vx = dx * POWER; held.vy = dy * POWER; held.state = "fly"; held.t = 0;
        held = null; ensureLoop();
      } else {
        let best: Piece | null = null, bd = Infinity;
        for (const pc of pieces) { if (pc.state !== "floor") continue; const d = Math.hypot(pc.x - p.x, pc.y - p.y); if (d < bd) { bd = d; best = pc; } }
        if (best) { best.state = "held"; held = best; }
        render();
      }
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    render();

    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="game">
      <canvas ref={canvasRef} aria-label="A small game: pick up the crumpled trash off the office floor and toss it into the bin." />
      <div className="cap"><span>Office Toss</span><span>click to pick up · click to <b>throw</b></span></div>
    </div>
  );
}
