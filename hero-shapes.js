// Shape friends at the bottom of the home hero.
// A row of chunky coloured shapes with googly eyes. They toss a ball around,
// hop, squash, and every so often one morphs into a different shape.
// Eyes follow the ball, or your cursor when you move it.
// Hover one: it opens its mouth. Click one: it hops and changes shape.
// With "reduce motion" on, they just sit there quietly.
(() => {
const host = document.getElementById('shape-play');
if (!host) return;

const NS = 'http://www.w3.org/2000/svg';
const N = 120;                                   // points per outline (all shapes share this, so they can morph)
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLORS = {
    orange: '#f26a2e', pink: '#e8418c', cobalt: '#2d4fe3', yellow: '#ffc93c',
    olive: '#8db92e', sky: '#3a98d6', clay: '#c47a4a', ink: 'var(--fg)'
};

// ---------- shape outlines (in px, bottom-centre at 0,0, y goes up = negative) ----------
function roundRect(w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    const pts = [], x0 = -w / 2, x1 = w / 2, y0 = -h, y1 = 0;
    const arc = (cx, cy, a0) => { for (let i = 0; i <= 12; i++) { const a = a0 + (i / 12) * Math.PI / 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    pts.push([0, y1]);
    arc(x0 + r, y1 - r, Math.PI / 2);            // bottom-left
    arc(x0 + r, y0 + r, Math.PI);                // top-left
    arc(x1 - r, y0 + r, Math.PI * 1.5);          // top-right
    arc(x1 - r, y1 - r, 0);                      // bottom-right
    return pts;
}
function polar(R, fn, cy) {
    const pts = [];
    for (let i = 0; i < 240; i++) {
        const a = Math.PI / 2 + (i / 240) * Math.PI * 2;   // start at the bottom, same direction as roundRect
        const r = R * fn(a);
        pts.push([Math.cos(a) * r, -cy + Math.sin(a) * r]);
    }
    return pts;
}
const SHAPES = {
    dome:   (s) => roundRect(s * 1.15, s * 0.95, s * 0.575),
    pill:   (s) => roundRect(s * 0.5, s * 1.35, s * 0.25),
    tower:  (s) => roundRect(s * 0.48, s * 1.6, s * 0.06),
    block:  (s) => roundRect(s * 0.8, s * 0.8, s * 0.14),
    ball:   (s) => roundRect(s * 0.85, s * 0.85, s * 0.425),
    wide:   (s) => roundRect(s * 1.2, s * 0.6, s * 0.3),
    spiky:  (s) => polar(s * 0.52, (a) => 0.82 + 0.18 * Math.cos(9 * a), s * 0.5),
    flower: (s) => polar(s * 0.48, (a) => 0.88 + 0.12 * Math.cos(5 * a), s * 0.46),
};

// resample any outline to N points spaced evenly along its length
function resample(pts) {
    const closed = pts.concat([pts[0]]);
    const seg = []; let total = 0;
    for (let i = 1; i < closed.length; i++) { const d = Math.hypot(closed[i][0] - closed[i - 1][0], closed[i][1] - closed[i - 1][1]); seg.push(d); total += d; }
    const out = []; let k = 0, acc = 0;
    for (let i = 0; i < N; i++) {
        const target = (i / N) * total;
        while (k < seg.length - 1 && acc + seg[k] < target) { acc += seg[k]; k++; }
        const t = seg[k] ? (target - acc) / seg[k] : 0;
        const a = closed[k], b = closed[k + 1];
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
    return out;
}
const outline = (name, s) => resample(SHAPES[name](s));
const bbox = (pts) => { let t = 0, l = 0, r = 0; for (const p of pts) { if (p[1] < t) t = p[1]; if (p[0] < l) l = p[0]; if (p[0] > r) r = p[0]; } return { top: t, left: l, right: r }; };
const toPath = (pts) => 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
const backOut = (t) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

// ---------- the cast (x = position across the width, s = size as a share of strip height) ----------
const CAST = [
    { x: .04, s: .95, shape: 'dome',   color: 'orange', mouth: 'line',  sink: .18, set: ['dome', 'ball', 'wide'] },
    { x: .13, s: .80, shape: 'pill',   color: 'olive',  mouth: 'dot',   sink: .02, set: ['pill', 'tower', 'flower'] },
    { x: .21, s: .70, shape: 'tower',  color: 'yellow', mouth: 'smile', sink: .00, set: ['tower', 'pill', 'block'] },
    { x: .30, s: .90, shape: 'spiky',  color: 'cobalt', mouth: 'line',  sink: .10, set: ['spiky', 'flower', 'dome'] },
    { x: .41, s: .78, shape: 'ball',   color: 'pink',   mouth: 'smile', sink: .05, set: ['ball', 'block', 'dome'] },
    { x: .505, s: .62, shape: 'block',  color: 'ink',    mouth: 'none',  sink: .00, set: ['block', 'tower', 'ball'], mobile: false },
    { x: .62, s: .85, shape: 'wide',   color: 'sky',    mouth: 'line',  sink: .12, set: ['wide', 'dome', 'spiky'] },
    { x: .72, s: .74, shape: 'flower', color: 'clay',   mouth: 'dot',   sink: .04, set: ['flower', 'spiky', 'ball'], mobile: false },
    { x: .82, s: .82, shape: 'pill',   color: 'pink',   mouth: 'smile', sink: .00, set: ['pill', 'tower', 'dome'] },
    { x: .94, s: 1.0, shape: 'dome',   color: 'yellow', mouth: 'line',  sink: .22, set: ['dome', 'wide', 'block'] },
];

// ---------- build ----------
const svg = document.createElementNS(NS, 'svg');
host.appendChild(svg);
const ballEl = document.createElementNS(NS, 'circle');
let W = 0, H = 0, ground = 0, actors = [];
const ball = { holder: 0, from: null, to: null, t: 0, dur: 1, x: 0, y: 0, wait: 1.2, r: 9 };

function el(name, attrs, parent) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
}

function build() {
    W = host.clientWidth; H = host.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.textContent = '';
    ground = H;
    const phone = W < 700;
    const cast = CAST.filter(c => !(phone && c.mobile === false));
    const unit = phone ? Math.min(H * 0.8, W / 4.4) : H * 0.74;
    actors = cast.map((c, i) => {
        const s = c.s * unit;
        const xs = phone ? (0.06 + (i / (cast.length - 1)) * 0.88) : c.x;
        const g = el('g', { class: 'body' }, svg);
        const body = el('path', {}, g);
        body.style.fill = COLORS[c.color];
        const eyes = [0, 1].map(() => {
            const e = el('g', {}, g);
            return { white: el('circle', { fill: '#fff' }, e), pupil: el('circle', { fill: '#17181a' }, e) };
        });
        const mouth = el('path', { fill: '#17181a', stroke: '#17181a', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
        const pts = outline(c.shape, s);
        const a = {
            ...c, mtype: c.mouth, i, s, g, body, eyes, mouthEl: mouth,
            x: xs * W, pts, from: pts, to: pts, mt: 1, shapeNow: c.shape,
            sy: 1, vsy: 0, hop: 0, vhop: 0, blink: 0, nextBlink: 1 + Math.random() * 4,
            happy: 0, hover: false, look: [0, 0], lean: 0
        };
        g.addEventListener('pointerenter', () => { a.hover = true; a.vsy -= 1.2; });
        g.addEventListener('pointerleave', () => { a.hover = false; });
        g.addEventListener('click', () => { jump(a, 340); morph(a); });
        return a;
    });
    // ball sits on top of everything
    svg.appendChild(ballEl);
    ballEl.setAttribute('fill', '#ffffff');
    ballEl.setAttribute('stroke', '#17181a');
    ballEl.setAttribute('stroke-width', '2');
    ball.r = Math.max(7, unit * 0.06);
    ballEl.setAttribute('r', ball.r);
    ball.holder = Math.min(4, actors.length - 1);
    ball.from = null; ball.wait = 1.2;
    actors.forEach(draw);
}

function morph(a, name) {
    const options = a.set.filter(n => n !== a.shapeNow);
    a.shapeNow = name || options[Math.floor(Math.random() * options.length)];
    a.from = a.pts.map(p => p.slice());
    a.to = outline(a.shapeNow, a.s);
    a.mt = 0;
}
function jump(a, v) { if (a.hop === 0) a.vhop = v; }

// ---------- draw one actor ----------
const target = { x: 0, y: 0 }; let lastPointer = -1e9;
function draw(a) {
    const bb = bbox(a.pts);
    const h = -bb.top, w = bb.right - bb.left;
    const sink = a.sink * a.s;
    const sx = 1 + (1 - a.sy) * 0.6;
    a.g.setAttribute('transform', `translate(${a.x.toFixed(1)} ${(ground + sink - a.hop).toFixed(1)}) rotate(${a.lean.toFixed(2)}) scale(${sx.toFixed(3)} ${a.sy.toFixed(3)})`);
    a.body.setAttribute('d', toPath(a.pts));

    // eyes near the top of whatever shape it is right now
    const er = Math.max(3.5, Math.min(w * 0.11, 11));
    const gap = Math.min(w * 0.2, er * 2.6);
    const ey = bb.top + Math.min(Math.max(h * 0.3, er * 2.2), h * 0.45);
    const ex = (bb.left + bb.right) / 2;
    // where to look
    const wx = a.x + ex, wy = ground + sink - a.hop + ey;
    const dx = target.x - wx, dy = target.y - wy, d = Math.hypot(dx, dy) || 1;
    a.look[0] += ((dx / d) * er * 0.42 - a.look[0]) * 0.2;
    a.look[1] += ((dy / d) * er * 0.42 - a.look[1]) * 0.2;
    const lid = a.blink > 0 ? 0.12 : 1;
    a.eyes.forEach((e, k) => {
        const cx = ex + (k ? gap : -gap) / 2 * 1.0 + (k ? er * 0.5 : -er * 0.5);
        e.white.setAttribute('cx', cx.toFixed(1)); e.white.setAttribute('cy', ey.toFixed(1));
        e.white.setAttribute('r', er.toFixed(1));
        e.white.setAttribute('transform', `translate(0 ${ey * (1 - lid)}) scale(1 ${lid})`);
        e.pupil.setAttribute('cx', (cx + a.look[0]).toFixed(1)); e.pupil.setAttribute('cy', (ey + a.look[1]).toFixed(1));
        e.pupil.setAttribute('r', (er * 0.52).toFixed(1));
        e.pupil.setAttribute('transform', `translate(0 ${(ey + a.look[1]) * (1 - lid)}) scale(1 ${lid})`);
    });

    // mouth
    const my = ey + er * 2.3, mw = Math.min(w * 0.22, er * 2.6);
    const open = Math.max(a.happy, a.hover ? 1 : 0);
    let m = '';
    if (open > 0.05 || a.mtype === 'smile') {
        const o = a.mtype === 'smile' ? Math.max(open, 0.55) : open;
        const mh = mw * 0.75 * o;
        m = `M${ex - mw / 2} ${my} Q${ex} ${my - 2} ${ex + mw / 2} ${my} Q${ex + mw * 0.4} ${my + mh} ${ex} ${my + mh} Q${ex - mw * 0.4} ${my + mh} ${ex - mw / 2} ${my}Z`;
        a.mouth_el_stroke = 1.5;
    } else if (a.mtype === 'line') {
        m = `M${ex - mw * 0.35} ${my} L${ex + mw * 0.35} ${my}`;
        a.mouth_el_stroke = Math.max(3, er * 0.55);
    } else if (a.mtype === 'dot') {
        m = `M${ex} ${my} L${ex} ${my + 0.1}`;
        a.mouth_el_stroke = Math.max(4, er * 0.7);
    }
    a.mouthEl.setAttribute('d', m);
    a.mouthEl.setAttribute('stroke-width', a.mouth_el_stroke || 0);
}

function headOf(a) {
    const bb = bbox(a.pts);
    return { x: a.x + (bb.left + bb.right) / 2, y: ground + a.sink * a.s - a.hop + bb.top * a.sy };
}

// ---------- the loop ----------
let last = performance.now(), morphTimer = 2.5;
function step(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (!document.hidden && actors.length) {
        // ball: sit on a head, then throw to someone nearby
        const holder = actors[ball.holder];
        if (!ball.from) {
            const hd = headOf(holder);
            ball.x = hd.x; ball.y = hd.y - ball.r + 1;
            ball.wait -= dt;
            if (ball.wait <= 0) {
                const near = actors.filter(o => o !== holder && Math.abs(o.i - holder.i) <= 3);
                const to = near[Math.floor(Math.random() * near.length)];
                ball.from = { x: ball.x, y: ball.y }; ball.to = to; ball.t = 0;
                ball.dur = 0.75 + Math.abs(to.x - holder.x) / W * 1.6;
                holder.vsy += 2.2; jump(holder, 120);
            }
        } else {
            ball.t += dt / ball.dur;
            const hd = headOf(ball.to);
            const t = Math.min(ball.t, 1);
            const peak = H * 0.3 + Math.abs(hd.x - ball.from.x) * 0.12;
            ball.x = ball.from.x + (hd.x - ball.from.x) * t;
            ball.y = ball.from.y + (hd.y - ball.r + 1 - ball.from.y) * t - Math.sin(Math.PI * t) * peak;
            // catcher gets excited as the ball arrives
            if (t > 0.6) ball.to.happy = Math.min(1, ball.to.happy + dt * 4);
            if (ball.t >= 1) {
                ball.holder = ball.to.i; ball.from = null;
                ball.wait = 0.5 + Math.random() * 1.4;
                ball.to.vsy -= 3.2;                          // squash on catch
                if (Math.random() < 0.35) morph(ball.to);
            }
        }
        ballEl.setAttribute('cx', ball.x.toFixed(1));
        ballEl.setAttribute('cy', ball.y.toFixed(1));

        // eyes: cursor if it moved recently, otherwise the ball
        if (now - lastPointer > 1800) { target.x = ball.x; target.y = ball.y; }

        // now and then someone changes shape
        morphTimer -= dt;
        if (morphTimer <= 0) {
            const pick = actors[Math.floor(Math.random() * actors.length)];
            if (pick.i !== ball.holder) { morph(pick); jump(pick, 180); }
            morphTimer = 1.6 + Math.random() * 2.4;
        }

        for (const a of actors) {
            // squash spring
            a.vsy += (1 - a.sy) * 260 * dt;
            a.vsy *= Math.pow(0.02, dt);
            a.sy += a.vsy * dt;
            // hop
            if (a.vhop || a.hop > 0) {
                a.vhop -= 1500 * dt; a.hop += a.vhop * dt;
                if (a.hop <= 0) { a.hop = 0; if (a.vhop < -60) a.vsy -= a.vhop / 180; a.vhop = 0; }
            }
            // morph
            if (a.mt < 1) {
                a.mt = Math.min(1, a.mt + dt / 0.7);
                const e = backOut(a.mt);
                for (let k = 0; k < N; k++) {
                    a.pts[k][0] = a.from[k][0] + (a.to[k][0] - a.from[k][0]) * e;
                    a.pts[k][1] = Math.min(0, a.from[k][1] + (a.to[k][1] - a.from[k][1]) * e);
                }
            }
            // blink
            a.nextBlink -= dt;
            if (a.nextBlink <= 0) { a.blink = 0.12; a.nextBlink = 2 + Math.random() * 5; }
            if (a.blink > 0) a.blink -= dt;
            // mouth relaxes
            if (!(ball.from && ball.to === a)) a.happy = Math.max(0, a.happy - dt * 1.6);
            // lean slightly toward what it's looking at
            const want = Math.max(-4, Math.min(4, (target.x - a.x) / W * 10));
            a.lean += (want - a.lean) * 0.04;
            draw(a);
        }
    }
    requestAnimationFrame(step);
}

window.addEventListener('pointermove', (e) => {
    const r = svg.getBoundingClientRect();
    target.x = e.clientX - r.left; target.y = e.clientY - r.top;
    lastPointer = performance.now();
}, { passive: true });

let rt;
window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { const keep = W; build(); if (calm) actors.forEach(draw); }, 150); });

build();
if (calm) {
    const hd = headOf(actors[ball.holder]);
    ballEl.setAttribute('cx', hd.x); ballEl.setAttribute('cy', hd.y - ball.r + 1);
    target.x = W / 2; target.y = -H;
    actors.forEach(draw);
} else {
    requestAnimationFrame(step);
}
})();
