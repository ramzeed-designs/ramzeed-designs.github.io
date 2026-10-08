/* Sketch portrait for about.html
   Ramzi writing at his desk. The room is black & white and soft; he and the desk stay sharp and in colour.
   - yellow hand-drawn lines boil around him (behind him and behind the desk)
   - little chalk doodles sketch themselves onto the desk: a to-do notepad and a steaming mug of coffee
   - the photo itself doesn't move, and there's no hover / click behaviour
   Markup: <div class="sketch-me" id="sketch-me" data-bg="images/portrait-desk-bg.webp" data-me="images/portrait-desk-me.webp"> <canvas width="960" height="1280"></canvas> </div>
   Colours: --sketch (yellow lines) and --chalk (desk doodles) in style.css. Everything is in photo pixels (960 × 1280). */
(() => {

const W = 960, H = 1280;
const stage = document.getElementById('sketch-me');
if (!stage) return;
const cv = stage.querySelector('canvas'), ctx = cv.getContext('2d');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rnd = (a) => { const x = Math.sin(a * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* ---------- the three lines around him (traced around his outline, offset outwards) ---------- */
const LINES = [[[-50,860],[20,859],[37,847],[79,757],[89,716],[129,673],[172,590],[224,541],[279,517],[339,511],[383,495],[437,493],[478,395],[504,357],[532,335],[636,321],[715,341],[790,423],[810,476],[805,514],[769,564],[750,579],[686,599],[648,661],[653,681],[735,761],[742,775],[739,796],[570,928],[300,1069]],[[-50,824],[-9,817],[11,801],[61,697],[174,536],[248,490],[402,448],[469,345],[507,310],[554,293],[628,286],[698,297],[745,320],[825,413],[844,470],[840,516],[814,566],[779,601],[718,630],[703,654],[709,680],[771,757],[767,814],[587,959],[315,1100]],[[-50,777],[-7,745],[109,555],[154,505],[223,461],[363,415],[493,277],[563,254],[643,250],[701,260],[766,291],[851,386],[880,474],[866,549],[784,669],[810,769],[803,820],[762,873],[630,975],[406,1100]]];

// resample a polyline to evenly spaced points with smoothed normals
function prep(pts, step) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(d / step));
    for (let k = 0; k < n; k++) out.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
  }
  out.push(pts[pts.length - 1]);
  let s = 0; const P = out.map((p, i) => { if (i) s += Math.hypot(p[0] - out[i - 1][0], p[1] - out[i - 1][1]); return { x: p[0], y: p[1], s }; });
  P.forEach((p, i) => { const a = P[Math.max(0, i - 2)], b = P[Math.min(P.length - 1, i + 2)], l = Math.hypot(b.x - a.x, b.y - a.y) || 1; p.nx = (b.y - a.y) / l; p.ny = -(b.x - a.x) / l; });
  return { P, len: s };
}
const lines = LINES.map((pts, li) => ({ ...prep(pts, 20), amp: 9 + li * 4, w: 6.5 - li * 0.6, jit: 2.6,
  freq: 1 / (150 + li * 45), phase: rnd(li + 1) * 6.28, speed: 0.35 + li * 0.08, delay: 0.25 + li * 0.22, dur: 1.1 }));

/* ---------- desk doodles ---------- */
// small helpers that return polylines
const arc = (cx, cy, rx, ry, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
const dot = (x, y, r = 4) => arc(x, y, r, r * 0.8, 0, Math.PI * 2, 8);
const wave = (x, y0, y1, amp, n = 3) => Array.from({ length: 13 }, (_, i) => { const t = i / 12; return [x + Math.sin(t * Math.PI * n) * amp, y0 + (y1 - y0) * t]; });

const PI = Math.PI;
// a point inside the to-do notepad: u = across (0–1), v = down (0–1), following the desk's perspective
const PAD = { tl: [570, 1108], tr: [778, 1076], br: [796, 1222], bl: [582, 1202] };
const q = (u, v) => {
  const top = [PAD.tl[0] + (PAD.tr[0] - PAD.tl[0]) * u, PAD.tl[1] + (PAD.tr[1] - PAD.tl[1]) * u];
  const bot = [PAD.bl[0] + (PAD.br[0] - PAD.bl[0]) * u, PAD.bl[1] + (PAD.br[1] - PAD.bl[1]) * u];
  return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
};
const box = (u0, v0, u1, v1) => [q(u0, v0), q(u1, v0), q(u1, v1), q(u0, v1), q(u0, v0)];
const tick = (u0, v0, u1, v1) => [q(u0 + (u1 - u0) * 0.1, v0 + (v1 - v0) * 0.5), q(u0 + (u1 - u0) * 0.42, v1 - (v1 - v0) * 0.05), q(u1 + (u1 - u0) * 0.35, v0 - (v1 - v0) * 0.45)];
const scribble = (u0, u1, v, n) => Array.from({ length: n * 4 + 1 }, (_, i) => { const t = i / (n * 4); return q(u0 + (u1 - u0) * t, v + Math.sin(t * Math.PI * 2 * n) * 0.035 - (i % 4 === 1 ? 0.02 : 0)); });
const ROWS = [0.36, 0.6, 0.84];

const DOODLES = [
  // a to-do notepad on the desk: two things ticked, one to go
  { at: 2.0, paths: [
      box(0, 0, 1, 1),                                                                 // the pad
      [[PAD.bl[0], PAD.bl[1]], [PAD.bl[0] + 3, PAD.bl[1] + 11], [PAD.br[0] + 3, PAD.br[1] + 11], [PAD.br[0], PAD.br[1]]], // pages underneath
      ...[0.14, 0.3, 0.46, 0.62, 0.78].map(u => { const [x, y] = q(u, 0); return arc(x, y - 3, 6, 8, Math.PI * 0.15, Math.PI * 1.85, 10); }), // spiral rings
      scribble(0.1, 0.42, 0.17, 2),                                                    // a little heading
      ...ROWS.flatMap((v, i) => {
        const b = box(0.08, v - 0.08, 0.17, v + 0.08), line = scribble(0.25, i === 2 ? 0.7 : 0.86, v, i === 1 ? 3 : 2);
        return i < 2 ? [b, tick(0.08, v - 0.08, 0.17, v + 0.08), line] : [b, line];
      }),
  ] },
  // a mug of coffee with steam, by the red pens on the right
  { at: 3.0, paths: [
      arc(866, 770, 58, 14, 0, 2 * PI, 24),                                            // rim
      [[808, 770], [812, 858], [826, 874], [866, 880], [906, 874], [920, 858], [924, 770]], // body
      arc(926, 816, 30, 34, -PI / 2, PI / 2, 12),                                      // handle
      wave(848, 748, 668, 9), wave(884, 742, 652, 9),                                  // steam
  ] },
].map((d, di) => ({ ...d, paths: d.paths.map((p, pi) => ({ ...prep(p, 6), seed: di * 31 + pi * 7 })) }));

/* ---------- colours ---------- */
let sketchCol = '#f2b705', chalkCol = '#fffaf0';
const readCol = () => {
  const cs = getComputedStyle(stage);
  sketchCol = cs.getPropertyValue('--sketch').trim() || '#f2b705';
  chalkCol = cs.getPropertyValue('--chalk').trim() || '#fffaf0';
};
readCol();

function stroke(pts, w) {
  if (pts.length < 2) return;
  ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
  ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
  ctx.stroke();
}

function drawLines(now) {
  const t = now - t0, boil = Math.floor(now * 8);            // 8 fps "boil", like hand-drawn animation
  ctx.strokeStyle = sketchCol; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  lines.forEach((st, li) => {
    const prog = still ? 1 : Math.max(0, Math.min(1, (t - st.delay) / st.dur));
    if (!prog) return;
    const upto = st.len * (1 - Math.pow(1 - prog, 3)), pts = [];
    for (let i = 0; i < st.P.length; i++) {
      const p = st.P[i]; if (p.s > upto) break;
      const wob = still ? 0 : Math.sin(p.s * st.freq + st.phase + now * st.speed) * st.amp;
      const j1 = still ? 0 : (rnd(boil * 13.1 + li * 7.7 + i * 0.913) - 0.5) * 2 * st.jit;
      pts.push([p.x + p.nx * (wob + j1), p.y + p.ny * (wob + j1)]);
    }
    stroke(pts, st.w);
  });
}

function drawDoodles(now) {
  const t = now - t0, boil = Math.floor(now * 8);
  ctx.strokeStyle = chalkCol; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(40, 20, 0, .45)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;   // keeps the chalk readable on the wood
  DOODLES.forEach((d) => {
    const prog = still ? 1 : Math.max(0, Math.min(1, (t - d.at) / 0.9));
    if (!prog) return;
    const n = d.paths.length;
    d.paths.forEach((p, pi) => {
      // paths draw one after another within the doodle
      const local = Math.max(0, Math.min(1, prog * n - pi));
      if (!local) return;
      const upto = p.len * local, pts = [];
      for (let i = 0; i < p.P.length; i++) {
        const q = p.P[i]; if (q.s > upto + 0.01) break;
        const j = still ? 0 : (rnd(boil * 3.3 + p.seed + i * 0.77) - 0.5) * 2.4;
        const k = still ? 0 : (rnd(boil * 5.7 + p.seed * 1.3 + i * 1.31) - 0.5) * 2.4;
        pts.push([q.x + j, q.y + k]);
      }
      stroke(pts, 5.2);
    });
  });
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
}

let t0 = -1, running = true, visible = true, bg, me;
function draw(now) {
  if (t0 < 0) t0 = now;
  ctx.drawImage(bg, 0, 0, W, H);     // black & white room
  drawLines(now);                    // lines over the room…
  ctx.drawImage(me, 0, 0, W, H);     // …behind him and the desk
  drawDoodles(now);                  // doodles on top of the desk
}
function loop(ts) {
  if (!running) return;
  draw(ts / 1000);
  requestAnimationFrame(loop);
}

const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
Promise.all([load(stage.dataset.bg), load(stage.dataset.me)]).then(([a, b]) => {
  bg = a; me = b;
  new MutationObserver(() => { readCol(); if (still) draw(99); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (still) { draw(99); return; }
  const resume = () => { if (!running && !document.hidden && visible) { running = true; requestAnimationFrame(loop); } };
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (!visible) running = false; else resume(); }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) running = false; else resume(); });
  requestAnimationFrame(loop);
}).catch(() => {});
})();
