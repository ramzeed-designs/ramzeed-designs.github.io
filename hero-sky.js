// Hero background that changes with the theme.
// Light ("chalk"): small, faint watercolour cherry blossoms open petal by petal at random spots on the
// sides, stay a while, then fold back in and fade.
// Dark ("ink"): a night sky where tiny stars twinkle, and a faint shooting star
// crosses every 10–15 seconds.
// Nothing falls or moves around much: things just appear and fade away again.
(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const root = document.documentElement;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const NS = 'http://www.w3.org/2000/svg';
    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // ---------- shared drawings (defined once, reused with <use>) ----------
    // A petal pointing up from the centre, with the little notch at its tip.
    const PETAL = 'M0 -5 C -15 -10, -23 -30, -13 -42 C -8 -47, -3 -45, 0 -39 C 3 -45, 8 -47, 13 -42 C 23 -30, 15 -10, 0 -5 Z';
    // Faint veins inside each petal, to give the watercolour texture
    const VEINS = 'M0 -8 L0 -34 M-3 -10 C -7 -20, -10 -28, -9 -35 M3 -10 C 7 -20, 10 -28, 9 -35';

    // One flower, drawn fresh each time so no two are the same. Each petal sits in its own
    // group so it can unfurl on its own; the pink centre and stamens open last.
    // `life` is how long the flower stays, so the petals know when to close again.
    function flowerSVG(life, delay = 0) {
        const jitter = rand(3, 9);
        const start = delay + rand(0.3, 0.6);                  // a short pause as a closed bud (counted from when the flower appears)
        const close = (delay + life * 0.7).toFixed(2);         // petals start folding back in
        const closeDur = (life * 0.3).toFixed(2);
        const order = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);   // petals open in a random order
        let petals = '';
        for (let i = 0; i < 5; i++) {
            const a = i * 72 + rand(-jitter, jitter);
            const s = rand(0.92, 1.06).toFixed(2);
            const d = (start + order[i] * rand(0.22, 0.32)).toFixed(2);
            petals += `<g transform="rotate(${a.toFixed(1)}) scale(${s})"><g class="bl-petal" style="--pd:${d}s;--cd:${close}s;--cl:${closeDur}s">
                <path d="${PETAL}" fill="url(#sky-petal)" stroke="#e58aab" stroke-opacity=".35" stroke-width=".8"/>
                <path d="${PETAL}" fill="url(#sky-wash)"/>
                <path d="${VEINS}" fill="none" stroke="#d76b95" stroke-opacity=".22" stroke-width=".7" stroke-linecap="round"/>
            </g></g>`;
        }
        let stamens = '';
        for (let i = 0; i < 11; i++) {
            const a = (i / 11) * Math.PI * 2 + rand(-0.15, 0.15);
            const r = rand(11, 17);
            const x = (Math.cos(a) * r).toFixed(1), y = (Math.sin(a) * r).toFixed(1);
            stamens += `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#c2336f" stroke-opacity=".55" stroke-width=".8"/>
                        <circle cx="${x}" cy="${y}" r="${rand(1.3, 2).toFixed(1)}" fill="#b81f5e" fill-opacity=".8"/>`;
        }
        const sd = (start + 1.5).toFixed(2);
        return `<svg viewBox="-50 -50 100 100" width="100%" height="100%">${petals}
            <g class="bl-heart" style="--sd:${sd}s;--cd:${close}s;--cl:${closeDur}s"><circle r="9" fill="url(#sky-heart)"/>${stamens}</g></svg>`;
    }

    const defs = `
        <svg width="0" height="0" style="position:absolute" aria-hidden="true">
            <defs>
                <radialGradient id="sky-petal" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="46">
                    <stop offset="0" stop-color="#e2639a"/>
                    <stop offset=".22" stop-color="#f094b6"/>
                    <stop offset=".62" stop-color="#f7b6cb"/>
                    <stop offset="1" stop-color="#fbd4e1"/>
                </radialGradient>
                <!-- a lighter wash across the middle of each petal, like watercolour drying unevenly -->
                <radialGradient id="sky-wash" gradientUnits="userSpaceOnUse" cx="-4" cy="-26" r="16">
                    <stop offset="0" stop-color="#fff" stop-opacity=".45"/>
                    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
                </radialGradient>
                <radialGradient id="sky-heart">
                    <stop offset="0" stop-color="#c41f62" stop-opacity=".85"/>
                    <stop offset="1" stop-color="#e2639a" stop-opacity="0"/>
                </radialGradient>
                <symbol id="sky-p" viewBox="-25 -50 50 54">
                    <path d="${PETAL}" fill="url(#sky-petal)" stroke="#e58aab" stroke-opacity=".35" stroke-width=".8"/>
                    <path d="${PETAL}" fill="url(#sky-wash)"/>
                </symbol>
            </defs>
        </svg>`;

    const sky = document.createElement('div');
    sky.className = 'hero-sky';
    sky.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
    sky.setAttribute('aria-hidden', 'true');
    sky.innerHTML = defs + '<div class="sky-day" style="position:absolute;inset:0"></div><div class="sky-night" style="position:absolute;inset:0"></div>';
    hero.prepend(sky);
    const dayLayer = sky.querySelector('.sky-day');
    const nightLayer = sky.querySelector('.sky-night');

    // ---------- placing things ----------
    const small = () => window.innerWidth < 640;
    // keep the bigger items away from the text in the middle
    function spot(avoidText, others, gap) {
        let x, y;
        for (let t = 0; t < 14; t++) {
            x = rand(2, 98); y = rand(4, 96);
            // on phones the text fills the whole width, so keep to the space above and below it
            const inText = small() ? (y > 12 && y < 76) : ((x - 50) / 36) ** 2 + ((y - 47) / 33) ** 2 < 1;
            if (avoidText && inText) continue;
            if (others && others.some(o => Math.hypot(o.x - x, o.y - y) < gap)) continue;
            break;
        }
        return { x, y };
    }

    function item(layer, kind, anim, { x, y, size, opacity, duration, delay = 0, extra = {} }) {
        const el = document.createElement('div');
        el.className = 'sky-item sky-' + kind;
        el.style.cssText = `position:absolute;opacity:0;left:${x}%;top:${y}%;width:${size}px;height:${size}px;` +
            `--o:${opacity.toFixed(2)};--r:${rand(0, 360).toFixed(0)}deg;` +
            `animation-name:${anim};animation-duration:${duration.toFixed(1)}s;animation-delay:${delay.toFixed(1)}s;`;
        for (const k in extra) el.style.setProperty(k, extra[k]);
        el._pos = { x, y };
        el.addEventListener('animationend', (e) => { if (e.target === el) el.remove(); });   // ignore the petals' own animations
        layer.appendChild(el);
        return el;
    }

    function svgUse(el, id, viewBoxW, viewBoxH) {
        el.innerHTML = `<svg viewBox="0 0 ${viewBoxW} ${viewBoxH}" width="100%" height="100%"><use href="#${id}" width="${viewBoxW}" height="${viewBoxH}"/></svg>`;
    }

    const live = (layer, kind) => [...layer.querySelectorAll('.sky-' + kind)];

    // ---------- day: cherry blossoms ----------
    // Blossoms stay on the left and right sides only. The script measures where the name and the
    // lines of text actually are, and keeps every flower well clear of that box.
    const textParts = ['.hero-hello', '.hero-name', '.hero-roles', '.hero-line', '.hero-scroll'];
    function textBox() {
        const h = hero.getBoundingClientRect();
        let l = Infinity, r = -Infinity, t = Infinity, b = -Infinity;
        textParts.forEach(sel => {
            const el = hero.querySelector(sel); if (!el) return;
            // measure the text itself, not the full-width block it sits in
            const range = document.createRange(); range.selectNodeContents(el);
            const box = range.getBoundingClientRect();
            if (!box.width) return;
            l = Math.min(l, box.left - h.left); r = Math.max(r, box.right - h.left);
            t = Math.min(t, box.top - h.top);   b = Math.max(b, box.bottom - h.top);
        });
        return { l, r, t, b, w: h.width, h: h.height };
    }

    function sideSpot(size, others) {
        const box = textBox();
        if (!isFinite(box.l)) return null;
        const gap = small() ? 14 : 56;                     // clear space kept around the text
        const half = size / 2;
        const leftBand  = [half + 8, box.l - gap - half];
        const rightBand = [box.r + gap + half, box.w - half - 8];
        // phones: almost no room beside the text, so flowers just peek in from the very edge
        if (leftBand[1] < leftBand[0]) { leftBand[0] = -half * 0.35; leftBand[1] = Math.min(box.l - gap - half, half * 0.3); }
        if (rightBand[1] < rightBand[0]) { rightBand[0] = Math.max(box.r + gap + half, box.w - half * 0.3); rightBand[1] = box.w + half * 0.35; }
        const bands = [leftBand, rightBand].filter(([a, b]) => b >= a);
        if (!bands.length) return null;
        for (let t = 0; t < 20; t++) {
            const [a, b] = pick(bands);
            const x = rand(a, b);
            const y = rand(box.h * 0.06 + half, box.h * 0.95 - half);
            const near = others.some(o => Math.hypot(o.px - x, o.py - y) < (o.size + size) / 2 + 24);
            if (!near) return { x: (x / box.w) * 100, y: (y / box.h) * 100, px: x, py: y };
        }
        return null;                                        // no free spot right now; try again on the next tick
    }

    function addBlossom(delay = 0) {
        const others = live(dayLayer, 'flower').concat(live(dayLayer, 'petal')).map(e => e._pos);
        const loose = Math.random() < 0.28;                 // now and then a single fallen petal instead of a flower
        const size = small()
            ? (loose ? rand(10, 14) : rand(22, 34))
            : (loose ? rand(12, 20) : rand(30, 62));
        const p = sideSpot(size, others);
        if (!p) return;
        const life = rand(8, 12);
        const el = item(dayLayer, loose ? 'petal' : 'flower', loose ? 'sky-bloom' : 'sky-flower', {
            x: p.x, y: p.y, size, delay,
            opacity: loose ? rand(0.3, 0.45) : rand(0.38, 0.58),
            duration: life
        });
        el._pos = { x: p.x, y: p.y, px: p.px, py: p.py, size };
        if (loose) svgUse(el, 'sky-p', 100, 100);
        else el.innerHTML = flowerSVG(life, delay);
    }

    // ---------- night: stars and shooting stars ----------
    function addStar(prefill = false) {
        const { x, y } = spot(false);
        const big = Math.random() < 0.18;
        const duration = rand(3.5, 9);
        item(nightLayer, 'star', 'sky-twinkle', {
            x, y, duration,
            delay: prefill ? -rand(0, duration * 0.8) : 0,   // on first load, start part-way so the sky is already full
            size: big ? rand(2.4, 3.4) : rand(1, 2.2),
            opacity: big ? rand(0.75, 1) : rand(0.35, 0.8)
        });
    }

    // a faint shooting star: a thin streak that glides across and fades
    function addShootingStar() {
        const right = Math.random() < 0.5;                       // heading down-right or down-left
        const angle = right ? rand(18, 32) : rand(148, 162);
        const len = rand(160, 280) * (small() ? 0.7 : 1);
        const el = item(nightLayer, 'shoot', 'sky-shoot', {
            x: right ? rand(8, 55) : rand(45, 92), y: rand(6, 38),
            size: rand(70, 120) * (small() ? 0.7 : 1),
            opacity: rand(0.35, 0.55),
            duration: rand(1.1, 1.6),
            extra: { '--a': angle.toFixed(0) + 'deg', '--len': len.toFixed(0) + 'px' }
        });
        el.style.height = '1.5px';
    }
    function scheduleShootingStar() {
        setTimeout(() => {
            if (current === 'night' && onScreen && !document.hidden) addShootingStar();
            scheduleShootingStar();
        }, rand(10000, 15000));
    }

    // how many of each to keep on screen
    const want = () => small()
        ? { flower: 4, star: 38 }
        : { flower: 10, star: 80 };

    const mode = () => root.getAttribute('data-theme') === 'ink' ? 'night' : 'day';

    function fill(m, first) {
        const n = want();
        // on first fill, start things at different moments so they don't all fade in together
        const d = (span) => first ? (still ? 0 : rand(0, span)) : 0;
        if (m === 'day') {
            const have = live(dayLayer, 'flower').length + live(dayLayer, 'petal').length;
            for (let i = have; i < n.flower; i++) addBlossom(d(8));
        } else {
            for (let i = live(nightLayer, 'star').length; i < n.star; i++) addStar(first && !still);
        }
    }

    // Reduced motion: a quiet still picture, nothing changes
    if (still) {
        sky.classList.add('sky-still');
        fill(mode(), true);
        new MutationObserver(() => { dayLayer.innerHTML = ''; nightLayer.innerHTML = ''; fill(mode(), true); })
            .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
        return;
    }

    // Only run while the hero is on screen and the tab is open
    let onScreen = true;
    new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        sky.classList.toggle('sky-paused', !onScreen);
    }).observe(hero);

    let current = mode();
    fill(current, true);
    scheduleShootingStar();

    // top up a little at a time, so new things keep popping up at random moments
    setInterval(() => {
        if (!onScreen || document.hidden) return;
        const n = want();
        if (current === 'day') {
            const have = live(dayLayer, 'flower').length + live(dayLayer, 'petal').length;
            if (have < n.flower && Math.random() < 0.8) addBlossom();
        } else {
            const missing = n.star - live(nightLayer, 'star').length;
            for (let i = 0; i < Math.min(missing, 8); i++) if (Math.random() < 0.8) addStar();
        }
    }, 450);

    // Theme switch: the old layer fades out (CSS), then gets cleared; the new one fills in
    new MutationObserver(() => {
        const m = mode();
        if (m === current) return;
        current = m;
        const old = m === 'day' ? nightLayer : dayLayer;
        setTimeout(() => { if (current !== (old === dayLayer ? 'day' : 'night')) old.innerHTML = ''; }, 900);
        fill(m, true);
    }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
})();
