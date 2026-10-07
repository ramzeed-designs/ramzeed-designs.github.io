/* Sketch portrait for about.html
   Ramzi's portrait with hand-drawn lines boiling around him (drawn on a canvas).
   - lines sketch themselves in, then tremble like hand-drawn animation
   - head follows the cursor, blinks; hover says hi in a few languages
   - click (or Enter) knocks him out for a few seconds
   Markup: <div class="sketch-me" id="sketch-me" data-src="images/portrait-cutout.webp"> <canvas width="853" height="1280"></canvas> <div class="bubble"></div> </div>
   Line colour: --sketch in style.css. */
(() => {

const LINES = [[[922,1222],[902,1221],[897,709],[873,679],[849,666],[672,649],[719,593],[742,519],[809,398],[824,294],[819,265],[748,156],[738,116],[708,87],[638,70],[609,73],[540,39],[463,26],[427,31],[390,18],[357,28],[222,136],[201,160],[194,193],[163,244],[154,312],[176,407],[169,507],[181,550],[224,605],[261,695],[221,728],[39,790],[-1,816],[-41,858],[-50,888],[-50,1221],[-69,1222]],[[922,684],[863,635],[739,624],[774,534],[842,408],[858,294],[849,250],[815,204],[761,90],[714,52],[618,36],[564,10],[376,-15],[282,41],[186,124],[127,245],[120,314],[140,406],[136,514],[152,567],[221,683],[207,696],[23,760],[-23,790],[-70,840]],[[923,630],[873,600],[795,589],[877,417],[894,287],[882,234],[788,66],[713,14],[627,-1],[551,-30],[370,-50],[316,-28],[161,98],[94,230],[84,314],[102,406],[100,517],[117,578],[169,666],[10,726],[-69,785]]];                              // offset outlines traced around the silhouette
const W = 853, H = 1280, SHIFT = 120;                 // portrait sits a little lower, leaving room for the lines
const stage = document.getElementById('sketch-me');
if (!stage) return;
const cv = stage.querySelector('canvas'), ctx = cv.getContext('2d'), bubble = stage.querySelector('.bubble');
const SRC = stage.dataset.src;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- rig geometry (photo pixels) ---------- */
const PIVOT = { x: 455, y: 742 };
const inHead = (x, y) => y < 685 || (y < 740 && x > 336 && x < 572);
const EYE = [ { x0: 336, x1: 432, y0: 372, y1: 410, lash: 394, cx: 384, cy: 392 },
              { x0: 518, x1: 612, y0: 392, y1: 428, lash: 412, cx: 566, cy: 412 } ];
const GREET = ['hi!', 'Hello!', 'Bonjour!', 'مرحبا!', 'Hej!', 'नमस्ते!', 'നമസ്കാരം!'];
const LASH = '#24140d';

/* ---------- hand-drawn lines ---------- */
// resample each outline to evenly spaced points, give each its own wobble
const rnd = (a) => { const x = Math.sin(a * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const strokes = LINES.map((pts, li) => {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(d / 20));
    for (let k = 0; k < n; k++) out.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
  }
  out.push(pts[pts.length - 1]);
  let s = 0; const P = out.map((p, i) => { if (i) s += Math.hypot(p[0] - out[i - 1][0], p[1] - out[i - 1][1]); return { x: p[0], y: p[1], s }; });
  P.forEach((p, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], l = Math.hypot(b.x - a.x, b.y - a.y) || 1; p.nx = (b.y - a.y) / l; p.ny = -(b.x - a.x) / l; });
  return { P, len: s, amp: 9 + li * 4, freq: 1 / (150 + li * 45), phase: rnd(li + 1) * 6.28, speed: 0.35 + li * 0.08, delay: 0.25 + li * 0.22 };
});

// little sketch doodles that draw themselves, hang around, and get rubbed out
const DOODLES = [
  { x: 92,  y: -40, make: () => spiral(26, 2.3) },
  { x: 770, y: -20, make: () => star(30) },
  { x: 60,  y: 430, make: () => sparks() },
  { x: 800, y: 380, make: () => squiggle() },
];
function spiral(r, turns) { const p = []; for (let a = 0; a <= turns * 6.28; a += 0.3) { const rr = r * a / (turns * 6.28); p.push([Math.cos(a) * rr, Math.sin(a) * rr]); } return [p]; }
function star(r) { const p = []; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; p.push([Math.cos(a) * rr, Math.sin(a) * rr]); } return [p]; }
function sparks() { return [-0.5, 0, 0.5].map(a => [[Math.cos(a + 3.4) * 18, Math.sin(a + 3.4) * 18], [Math.cos(a + 3.4) * 46, Math.sin(a + 3.4) * 46]]); }
function squiggle() { const p = []; for (let x = 0; x <= 70; x += 5) p.push([x - 35, Math.sin(x / 7) * 10]); return [p]; }
DOODLES.forEach((d, i) => { d.paths = d.make(); d.offset = i * 1.7; });
const DOODLE_CYCLE = 7;

const img = new Image();
img.onload = start;
img.src = SRC;

let head, body;
function start() {
  const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  const full = mk(), fc = full.getContext('2d'); fc.drawImage(img, 0, 0);
  const src = fc.getImageData(0, 0, W, H);
  head = mk(); body = mk();
  const hd = head.getContext('2d').createImageData(W, H), bd = body.getContext('2d').createImageData(W, H);
  const s = new Uint32Array(src.data.buffer), h32 = new Uint32Array(hd.data.buffer), b32 = new Uint32Array(bd.data.buffer);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; (inHead(x, y) ? h32 : b32)[i] = s[i]; }
  for (let y = 600; y < 740; y++) for (let x = 336; x < 572; x++) { const i = y * W + x, j = 768 * W + x; if (s[j] >>> 24) b32[i] = s[j]; }
  head.getContext('2d').putImageData(hd, 0, 0); body.getContext('2d').putImageData(bd, 0, 0);
  bindInput();
  if (still) { draw(99); return; }
  observe(); requestAnimationFrame(loop);
}

/* ---------- little pixel sprites that orbit when knocked out ---------- */
const PX = { h:'#8a5a2b', m:'#c9ced6', r:'#e0457b', b:'#2d7fe0', w:'#ffffff', y:'#f2c230', k:'#24140d', g:'#3fbf7f', o:'#ff8a3d' };
const SPR = [
  ['...y...','...y...','yyyyyyy','.yyyyy.','..yyy..','.yy.yy.','y.....y'],
  ['......kk','.....kyk','....kyk.','...kyk..','..kyk...','.kmk....','krk.....','kk......'],
  ['..kkk..','.kbbbk.','kbbwbbk','kbbbbbk','.kbbbk.','..kbk..','...k...'],
  ['...o...','..ooo..','ooooooo','..ooo..','...o...'],
  ['kkkkkkkk','kggggggk','kgkgkgkg','kggggggk','kkkkkkkk'],
  ['...y...','...y...','yyyyyyy','.yyyyy.','..yyy..','.yy.yy.','y.....y'],
];
function sprite(map, x, y, c) {
  map.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.') { ctx.fillStyle = PX[ch]; ctx.fillRect(Math.round(x + i * c), Math.round(y + j * c), c, c); } }));
}

/* ---------- state ---------- */
let tx = 0, ty = 0, lastMove = -9, hx = 0, hy = 0, hr = 0, puff = 0;
let greetIdx = 0, sayUntil = 0, koStart = -99, nextBlink = 2.5, blinkEnd = 0, okUntil = 0, t0 = -1;
const KO_T = 3.4;
const q = (v, s) => Math.round(v / s) * s;
const say = (txt, dur) => { bubble.textContent = txt; bubble.classList.add('on'); sayUntil = performance.now() / 1000 + dur; };
const greet = (now) => { if (now - koStart > KO_T) say(GREET[greetIdx++ % GREET.length], 2.4); };
const knock = (now) => { if (now - koStart < KO_T) return; koStart = now; say('ow!', KO_T); };
let sketchCol = '#f2b705';
const readCol = () => { sketchCol = getComputedStyle(stage).getPropertyValue('--sketch').trim() || '#f2b705'; };
readCol(); new MutationObserver(readCol).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
const lineColor = () => sketchCol;

// head transform applied to a point (used so the lines near the head move with it)
function headXY(x, y, ox, oy, rot) {
  const c = Math.cos(rot), s = Math.sin(rot), dx = x - PIVOT.x, dy = y - PIVOT.y;
  return [PIVOT.x + ox + dx * c - dy * s, PIVOT.y + oy + dx * s + dy * c];
}

function drawLines(now, ox, oy, rot, ko) {
  const t = now - t0, boil = Math.floor(now * 8);            // 8 fps "boil", like hand-drawn animation
  ctx.strokeStyle = lineColor(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  strokes.forEach((st, li) => {
    const prog = still ? 1 : Math.max(0, Math.min(1, (t - st.delay) / 1.1));
    if (!prog) return;
    const ease = 1 - Math.pow(1 - prog, 3), upto = st.len * ease;
    const jit = (ko ? 9 : 2.6), pts = [];
    for (let i = 0; i < st.P.length; i++) {
      const p = st.P[i]; if (p.s > upto) break;
      const wob = Math.sin(p.s * st.freq + st.phase + now * st.speed) * st.amp + puff * (10 + li * 6);
      const j1 = (rnd(boil * 13.1 + li * 7.7 + i * 0.913) - 0.5) * 2 * jit;
      let x = p.x + p.nx * (wob + j1), y = p.y + p.ny * (wob + j1);
      const w = Math.max(0, Math.min(1, (900 - p.y) / 260));   // near the head → follows the head
      if (w) { const [hx2, hy2] = headXY(x, y, ox, oy, rot); x += (hx2 - x) * w; y += (hy2 - y) * w; }
      pts.push([x, y]);
    }
    if (pts.length < 2) return;
    ctx.lineWidth = 6.5 - li * 0.6;
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
    ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
    ctx.stroke();
  });
}

function drawDoodles(now, ko) {
  if (still) return;
  const boil = Math.floor(now * 8);
  ctx.lineWidth = 5; ctx.strokeStyle = lineColor();
  DOODLES.forEach((d, di) => {
    const c = ((now - t0 - 1.6 + d.offset) % DOODLE_CYCLE + DOODLE_CYCLE) % DOODLE_CYCLE;
    if (now - t0 < 1.6) return;
    // 0–0.8 draw in · hold · 3.6–4.2 rub out from the start · rest
    let a = 0, b = 0;
    if (c < 0.8) { b = c / 0.8; } else if (c < 3.6) { b = 1; } else if (c < 4.2) { a = (c - 3.6) / 0.6; b = 1; } else return;
    const sc = ko ? 1.25 : 1;
    d.paths.forEach((path, pi) => {
      const n = path.length - 1, i0 = Math.floor(a * n), i1 = Math.ceil(b * n);
      if (i1 - i0 < 1) return;
      ctx.beginPath();
      for (let i = i0; i <= i1; i++) {
        const jx = (rnd(boil * 3.3 + di * 9.1 + pi * 2.2 + i * 0.77) - 0.5) * 3.2, jy = (rnd(boil * 5.7 + di * 4.3 + pi + i * 1.31) - 0.5) * 3.2;
        const x = d.x + path[i][0] * sc + jx, y = d.y + path[i][1] * sc + jy;
        i === i0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  });
}

function draw(now) {
  if (t0 < 0) t0 = now;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.translate(0, SHIFT);
  ctx.imageSmoothingEnabled = false;
  const ko = now - koStart < KO_T, kt = now - koStart;

  // head target
  let gx, gy, gr;
  if (ko) {
    const settle = Math.min(1, kt / 0.4);
    gx = 10 * settle; gy = 14 * settle; gr = (7 + Math.sin(kt * 4) * 4) * settle;
  } else {
    const idle = now - lastMove > 4;
    const ix = idle ? Math.sin(now * 0.5) * 0.6 : tx, iy = idle ? Math.sin(now * 0.37) * 0.3 : ty;
    gx = ix * 12; gy = iy * 8 + Math.sin(now * 1.9) * 2; gr = ix * 3.5 + Math.sin(now * 1.1) * 0.8;
  }
  hx += (gx - hx) * 0.12; hy += (gy - hy) * 0.12; hr += (gr - hr) * 0.12;
  puff += ((hovering ? 1 : 0) - puff) * 0.08;

  const breath = q(Math.sin(now * Math.PI * 2 / 3.4) * 4, 2);
  const shake = ko && kt < 0.35 ? (Math.floor(kt * 20) % 2 ? 14 : -14) : 0;
  const ox = q(hx, 4) + shake, oy = q(hy, 4) - breath, rot = q(hr, 0.5) * Math.PI / 180;

  // the sketch layer sits behind him
  drawLines(now, ox, oy, rot, ko);
  drawDoodles(now, ko);

  ctx.drawImage(body, shake, -breath);

  const orb = [];
  if (ko && kt < KO_T - 0.3) for (let i = 0; i < SPR.length; i++) {
    const a = kt * 3.2 + i * Math.PI * 2 / SPR.length;
    orb.push({ i, x: PIVOT.x + ox + Math.cos(a) * 300, y: 150 + oy + Math.sin(a) * 55, front: Math.sin(a) > 0 });
  }
  orb.filter(o => !o.front).forEach(o => sprite(SPR[o.i], o.x - 30, o.y - 30, 8));

  ctx.save();
  ctx.translate(PIVOT.x + ox, PIVOT.y + oy);
  ctx.rotate(rot);
  ctx.translate(-PIVOT.x, -PIVOT.y);
  ctx.drawImage(head, 0, 0);
  if ((!ko && now < blinkEnd) || ko) for (const e of EYE) {
    ctx.drawImage(head, e.x0, e.y1 + 2, e.x1 - e.x0, 18, e.x0, e.y0, e.x1 - e.x0, e.y1 - e.y0 + 2);
    ctx.fillStyle = LASH;
    if (ko) { for (let k = -3; k <= 3; k++) { ctx.fillRect(e.cx + k * 7 - 4, e.cy + k * 7 - 4, 9, 9); ctx.fillRect(e.cx + k * 7 - 4, e.cy - k * 7 - 4, 9, 9); } }
    else { for (let x = e.x0 + 8; x < e.x1 - 8; x += 8) { const mid = Math.abs(x - (e.x0 + e.x1) / 2) < 26; ctx.fillRect(x, e.lash + (mid ? 6 : 0), 8, 8); } }
  }
  if (!ko && !still) {
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    for (const e of EYE) { const g = q(e.x1 - 34 + tx * 12, 6); ctx.fillRect(g, e.y0 + 2, 6, 6); ctx.fillRect(g - 6, e.y0 + 8, 6, 6); }
  }
  ctx.restore();

  orb.filter(o => o.front).forEach(o => sprite(SPR[o.i], o.x - 35, o.y - 35, 10));

  if (now > sayUntil && now > okUntil) bubble.classList.remove('on');
}

function loop(ts) {
  if (!running) return;
  const now = ts / 1000;
  if (now > nextBlink) { blinkEnd = now + 0.13; nextBlink = now + 2.2 + Math.random() * 3.5; if (Math.random() < 0.2) nextBlink = now + 0.3; }
  if (koStart > 0 && now - koStart > KO_T && okUntil < koStart + KO_T) { okUntil = now + 1.2; say("I'm ok!", 1.2); }
  draw(now);
  requestAnimationFrame(loop);
}

/* ---------- input ---------- */
let running = true, hovering = false, visible = true;
const nowS = () => performance.now() / 1000;
function bindInput() {
  addEventListener('pointermove', e => { tx = Math.max(-1, Math.min(1, (e.clientX / innerWidth - 0.5) * 2)); ty = Math.max(-1, Math.min(1, (e.clientY / innerHeight - 0.5) * 2)); lastMove = nowS(); });
  stage.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hovering = true; greet(nowS()); } });
  stage.addEventListener('pointerleave', () => { hovering = false; });
  stage.addEventListener('focus', () => greet(nowS()));
  stage.addEventListener('click', () => { if (!still) knock(nowS()); });
  stage.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!still) knock(nowS()); } });
}
function observe() {
  const resume = () => { if (!running && !document.hidden && visible) { running = true; requestAnimationFrame(loop); } };
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (!visible) running = false; else resume(); }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) running = false; else resume(); });
  new MutationObserver(() => { if (still) draw(99); }).observe(document.documentElement, { attributes: true });
}
})();
