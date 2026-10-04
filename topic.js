/* Builds a Playground topic page (topic.html?t=<slug>) from projects.js.
   Field guide is at the top of the `playground` list in projects.js. */
(function () {
    const slug = new URLSearchParams(location.search).get('t');
    const live = playground.filter(p => p.items && !p.soon);
    const topic = live.find(p => p.slug === slug) || live[0];
    const main = document.getElementById('topic');
    if (!topic) { main.innerHTML = '<p class="tp-wrap">Nothing here yet.</p>'; return; }

    document.title = topic.title + ' – Ramzi';
    document.body.classList.add('tp--' + (topic.colour || 'purple'));
    if (topic.layout === 'gallery') document.body.classList.add('tp--gallery');

    const esc = escapeHTML;
    const pad = n => String(n + 1).padStart(2, '0');
    const items = topic.items || [];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const CAM = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
    const slot = (note, ratio) => `<div class="slot" style="aspect-ratio:${ratio}">${CAM}<span class="hand">${note}</span></div>`;

    // YouTube: shows the thumbnail, loads the player only when clicked
    const yt = (v, cls = '') => `
        <div class="yt ${cls}" role="button" tabindex="0" data-yt="${esc(v.youtube)}"${v.mute ? ' data-mute="1"' : ''} aria-label="Play video: ${esc(v.title || '')}"
                style="--yt: url('https://i.ytimg.com/vi/${esc(v.youtube)}/hqdefault.jpg')">
            <span class="yt-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>
            ${v.title ? `<span class="yt-title">${esc(v.title)}</span>` : ''}
        </div>`;

    function mediaHTML(m, alt) {
        if (m.youtube) return yt(m);
        if (m.video) return `<video src="${esc(m.video)}" ${m.poster ? `poster="${esc(m.poster)}"` : ''} autoplay muted loop playsinline></video>`;
        return `<img src="${esc(m.src)}" alt="${esc(m.alt || alt)}" loading="lazy">`;
    }

    /* ---------- Optional dark panel under a project (story, flow, more videos) ---------- */
    function flowHTML(cols) {
        const node = n => `<div class="f-node"><strong>${esc(n.name)}</strong>${n.note ? `<span>${esc(n.note)}</span>` : ''}</div>`;
        return `<div class="flow">` + cols.map((c, i) => `
            ${i ? '<span class="f-arrow" aria-hidden="true"></span>' : ''}
            <div class="f-col${c.lanes ? ' f-col--lanes' : ''}">
                <small>${esc(c.label)}</small>
                ${c.lanes
                    ? c.lanes.map(l => `<div class="f-lane">${l.map(node).join('<i class="f-to" aria-hidden="true">→</i>')}</div>`).join('')
                    : c.nodes.map(node).join('<i class="f-down" aria-hidden="true">↓</i>')}
            </div>`).join('') + `</div>`;
    }

    // Route through the four chambers: a figure-eight, with a dot walking 1 → 2 → 3 → 4
    const MAZE = `
        <svg class="maze" viewBox="0 0 320 320" role="img" aria-label="Map of the installation: four chambers in a square, joined by a figure-eight path that runs through chambers 1, 2, 3 and 4 in order">
            <path class="m-wall" d="M10 10h118M192 10h118v300H192M128 310H10V10M10 160h110M200 160h110M160 30v100M160 190v100"/>
            <path class="m-route" d="M160 160C100 200 76 300 160 300C244 300 220 200 160 160C220 120 244 20 160 20C76 20 100 120 160 160"/>
            <g class="m-num"><circle cx="40" cy="270" r="18"/><text x="40" y="276">1</text><circle cx="280" cy="270" r="18"/><text x="280" y="276">2</text><circle cx="280" cy="50" r="18"/><text x="280" y="56">3</text><circle cx="40" cy="50" r="18"/><text x="40" y="56">4</text></g>
            <circle class="m-rat" r="7"><animateMotion dur="9s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear" path="M160 160C100 200 76 300 160 300C244 300 220 200 160 160C220 120 244 20 160 20C76 20 100 120 160 160"/></circle>
        </svg>`;

    function deepHTML(d, it) {
        let h = '';
        if (d.intro) h += `
            <div class="d-intro">
                ${d.intro.img ? `<img src="${esc(d.intro.img)}" alt="${esc(d.intro.alt || '')}" loading="lazy">` : ''}
                <div>
                    <p class="d-brief">${d.intro.text}</p>
                    ${d.intro.timer ? `<p class="d-timer"><b>${esc(d.intro.timer)}</b><span>${esc(d.intro.timerNote || '')}</span></p>` : ''}
                </div>
            </div>`;
        if (d.chambers) h += `
            <div class="d-sec">
                <small class="d-label">${esc(d.chambersLabel || 'The four chambers')}</small>
                <div class="d-maze">
                    ${MAZE}
                    <ol class="chambers">${d.chambers.map(c => `
                        <li><b>${esc(c.n)}</b><div><strong>${esc(c.title)}</strong><p>${c.text}</p></div></li>`).join('')}
                    </ol>
                </div>
            </div>`;
        if (d.quote) h += `
            <div class="d-open">
                <div class="d-pool" aria-hidden="true"><canvas></canvas><span>${esc(d.poolHint || 'move across the water')}</span></div>
                <p class="d-quote">${d.quote}</p>
            </div>`;
        if (d.story) h += `
            <div class="d-sec">
                <small class="d-label">Storyboard</small>
                <ol class="story">${d.story.map((s, i) => `
                    <li><img src="${esc(s.src)}" alt="Storyboard frame ${i + 1}: ${esc(s.alt || s.text)}" loading="lazy"><p>${esc(s.text)}</p></li>`).join('')}
                </ol>
                ${d.storyEnd ? `<p class="d-end">${d.storyEnd}</p>` : ''}
            </div>`;
        if (d.flow) h += `
            <div class="d-sec">
                <small class="d-label">How the setup works</small>
                ${flowHTML(d.flow)}
            </div>`;
        if (d.videos) h += `
            <div class="d-sec">
                <small class="d-label">${esc(d.videosLabel || 'More from the experience')}</small>
                <div class="d-videos">${d.videos.map(v => yt(v, 'yt--wide')).join('')}</div>
            </div>`;
        return `<div class="deep${d.theme ? ' deep--' + esc(d.theme) : ''} reveal" aria-label="More about ${esc(it.title)}">${h}</div>`;
    }

    /* ---------- Hero ---------- */
    const index = items.map((it, i) =>
        `<li><a href="#item-${i + 1}"><b>${pad(i)}</b>${esc(it.title)}<span aria-hidden="true">↓</span></a></li>`).join('');

    let html = `
    <div class="tp-wrap">
        <a class="tp-back" href="playground.html">← Playground</a>
        <section class="tp-hero">
            <div class="tp-hero-copy">
                <span class="chip">Playground · ${esc(topic.title)}</span>
                <h1>${esc(topic.title)}</h1>
                ${topic.tagline ? `<p class="hand tagline">${esc(topic.tagline)}</p>` : ''}
                <p class="intro">${esc(topic.intro || topic.summary)}</p>
            </div>
            ${topic.layout === 'gallery' ? '' : `
            <nav class="tp-index" aria-label="In this topic">
                <small>${items.length === 1 ? 'One project' : items.length + ' projects'} inside</small>
                <ol>${index}</ol>
            </nav>`}
        </section>
    </div>`;

    /* ---------- Body ---------- */
    if (topic.layout === 'gallery') {
        const ratios = ['4 / 5', '1 / 1', '4 / 3', '3 / 4'];
        html += `<section class="tp-wrap gallery">` + items.map((it, i) => `
            <figure class="g-item reveal" id="item-${i + 1}">
                ${it.media && it.media.length ? mediaHTML(it.media[0], it.title) : slot('photo here', ratios[i % ratios.length])}
                <figcaption><strong>${esc(it.title)}</strong><span>${esc(it.text)}</span></figcaption>
            </figure>`).join('') + `</section>`;
    } else {
        html += `<div class="tp-wrap builds">` + items.map((it, i) => {
            const media = it.media || [];
            const first = media.length ? mediaHTML(media[0], it.title) : slot('photo or short clip', '4 / 3');
            const extra = media.length > 1
                ? `<div class="b-thumbs">${media.slice(1, 4).map(m => `<div>${mediaHTML(m, it.title)}</div>`).join('')}</div>` : '';
            const facts = [['Type', it.type], ['Made with', it.madeWith], ['Team', it.team], ['In collaboration with', it.with], ['Course', it.course], ['When', it.when]]
                .filter(f => f[1]).map(f => `<div><small>${f[0]}</small><strong>${esc(f[1])}</strong></div>`).join('');
            const tools = (it.tools || []).map(t => `<li>${esc(t)}</li>`).join('');
            return `
            <article class="build${it.deep ? ' build--deep' : ''}" id="item-${i + 1}">
                <div class="build-row reveal">
                    <div class="b-media">${first}${extra}</div>
                    <div class="b-copy">
                        <div class="label"><b>${pad(i)}</b><span>${esc(it.kicker || topic.title)}</span></div>
                        <h2>${esc(it.title)}</h2>
                        ${it.tagline ? `<p class="b-tag hand">${esc(it.tagline)}</p>` : ''}
                        <p class="lead">${esc(it.text)}</p>
                        ${facts ? `<div class="b-facts">${facts}</div>` : ''}
                        ${tools ? `<div class="b-tools"><small>Made with</small><ul>${tools}</ul></div>` : ''}
                        ${it.link ? `<a class="b-link" href="${esc(it.link.url)}" target="_blank" rel="noopener">${esc(it.link.label)} <span>↗</span></a>` : ''}
                    </div>
                </div>
                ${it.deep ? deepHTML(it.deep, it) : ''}
            </article>`;
        }).join('') + `</div>`;
    }
    main.innerHTML = html;

    /* ---------- Click-to-play YouTube ----------
       Loads YouTube's player only on click. No control bar, optional mute, and when the
       video is paused or ends our own cover sits on top, so YouTube's "more videos"
       suggestions never show. */
    let ytApi;
    const loadYT = () => ytApi || (ytApi = new Promise(res => {
        if (window.YT && YT.Player) return res(true);
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => { prev && prev(); res(true); };
        const sc = document.createElement('script');
        sc.src = 'https://www.youtube.com/iframe_api';
        sc.onerror = () => res(false);
        document.head.appendChild(sc);
        setTimeout(() => res(!!(window.YT && YT.Player)), 6000);
    }));
    const PARAMS = { autoplay: 1, controls: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: 1, fs: 0 };

    main.addEventListener('keydown', e => {
        const b = e.target.closest('.yt');
        if (b && e.target === b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); b.click(); }
    });
    main.addEventListener('click', async e => {
        const b = e.target.closest('.yt');
        if (!b) return;
        if (b.player) {                                      // cover clicked: resume, or replay after the end
            if (b.ended) b.player.seekTo(0);
            b.player.playVideo();
            return;
        }
        if (b.classList.contains('is-loading')) return;
        b.classList.add('is-loading');
        const id = b.dataset.yt, mute = b.dataset.mute === '1';
        const host = document.createElement('div');
        host.className = 'yt-frame';
        b.appendChild(host);
        const ok = await loadYT();
        if (!ok) {                                           // API blocked: plain embed as a fallback
            const q = new URLSearchParams({ ...PARAMS, mute: mute ? 1 : 0 });
            host.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${q}" allow="autoplay; encrypted-media; picture-in-picture" title="${esc(b.getAttribute('aria-label'))}"></iframe>`;
            b.classList.add('is-live', 'is-playing'); b.classList.remove('is-loading');
            return;
        }
        b.player = new YT.Player(host, {
            videoId: id,
            host: 'https://www.youtube-nocookie.com',
            playerVars: { ...PARAMS, mute: mute ? 1 : 0 },
            events: {
                onReady: ev => { if (mute) ev.target.mute(); ev.target.playVideo(); b.classList.add('is-live'); b.classList.remove('is-loading'); },
                onStateChange: ev => {
                    const st = ev.data;                      // 1 playing, 2 paused, 0 ended
                    b.ended = st === 0;
                    b.classList.toggle('is-playing', st === 1 || st === 3);
                    b.classList.toggle('is-ended', st === 0);
                }
            }
        });
    });

    /* ---------- Glowing pool: a small water surface that ripples under the pointer ----------
       A height-field wave simulation (each point pulls on its neighbours), so ripples
       spread, bounce off the edges and settle like real water. Light only shows where
       the water moves, like bioluminescence. */
    document.querySelectorAll('.d-pool canvas').forEach(cv => {
        const ctx = cv.getContext('2d');
        const pool = cv.parentElement;
        const CELL = 4;                       // one simulated point per 4px
        const DAMP = 0.986;                   // how quickly the water calms down
        let cols, rows, cur, prev, sm, img, buf, seen = false, lastDrop = 0, lx = null, ly = null;

        const off = document.createElement('canvas');
        const octx = off.getContext('2d');

        function size() {
            const w = pool.clientWidth, h = pool.clientHeight;
            const dpr = Math.min(devicePixelRatio || 1, 2);
            cv.width = w * dpr; cv.height = h * dpr;
            cols = Math.max(20, Math.round(w / CELL)); rows = Math.max(12, Math.round(h / CELL));
            cur = new Float32Array(cols * rows); prev = new Float32Array(cols * rows); sm = new Float32Array(cols * rows);
            off.width = cols; off.height = rows;
            img = octx.createImageData(cols, rows); buf = img.data;
            render();
        }

        function drop(gx, gy, strength = 1, r = 2) {
            gx = Math.round(gx); gy = Math.round(gy);
            for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
                const d = Math.hypot(x, y); if (d > r) continue;
                const px = gx + x, py = gy + y;
                if (px < 1 || py < 1 || px >= cols - 1 || py >= rows - 1) continue;
                cur[py * cols + px] -= strength * 9 * (0.5 + 0.5 * Math.cos(Math.PI * d / (r + 1)));   // soft, rounded push
            }
        }

        function step() {
            for (let y = 1; y < rows - 1; y++) {
                const row = y * cols;
                for (let x = 1; x < cols - 1; x++) {
                    const i = row + x;
                    prev[i] = ((cur[i - 1] + cur[i + 1] + cur[i - cols] + cur[i + cols]) / 2 - prev[i]) * DAMP;
                }
            }
            const t = cur; cur = prev; prev = t;
        }

        function render() {
            // Smooth each point with its neighbours first, so the surface reads as one body of water
            for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
                const i = y * cols + x;
                sm[i] = (cur[i] * 4 + cur[i - 1] + cur[i + 1] + cur[i - cols] + cur[i + cols]) / 8;
            }
            for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
                const i = y * cols + x;
                const inner = x > 1 && x < cols - 2 && y > 1 && y < rows - 2;
                const h = sm[i];
                const sx = inner ? sm[i + 1] - sm[i - 1] : 0;
                const sy = inner ? sm[i + cols] - sm[i - cols] : 0;
                const glow = Math.min(1, Math.abs(h) * 0.1 + Math.hypot(sx, sy) * 0.07);   // light where water moves
                const shine = Math.max(0, Math.min(1, (sx + sy) * 0.08));                   // crest highlights
                const k = i * 4;
                buf[k]     = 10 + glow * 33  + shine * 90;
                buf[k + 1] = 20 + glow * 160 + shine * 70;
                buf[k + 2] = 24 + glow * 150 + shine * 60;
                buf[k + 3] = 255;
            }
            octx.putImageData(img, 0, 0);
            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(off, 0, 0, cv.width, cv.height);
        }

        function frame(t) {
            if (seen && !reduce) {
                if (t - lastDrop > 3200) { drop(cols * (0.2 + Math.random() * 0.6), rows * (0.25 + Math.random() * 0.5), 0.5, 2); lastDrop = t; }
                step(); step();
                render();
            }
            requestAnimationFrame(frame);
        }

        // Pointer: a soft wake along the path, like a hand through water
        function move(e) {
            const r = cv.getBoundingClientRect();
            const gx = (e.clientX - r.left) / r.width * cols, gy = (e.clientY - r.top) / r.height * rows;
            if (lx === null || e.type === 'pointerdown') { drop(gx, gy, e.type === 'pointerdown' ? 1.6 : 0.6, 3); }
            else {
                const n = Math.ceil(Math.hypot(gx - lx, gy - ly) / 2);
                for (let s = 1; s <= n; s++) drop(lx + (gx - lx) * s / n, ly + (gy - ly) * s / n, 0.35, 2);
            }
            lx = gx; ly = gy;
            pool.classList.add('touched');
            if (reduce) { for (let s = 0; s < 30; s++) step(); render(); }
        }

        size();
        addEventListener('resize', size);
        pool.addEventListener('pointermove', move);
        pool.addEventListener('pointerdown', move);
        pool.addEventListener('pointerleave', () => { lx = ly = null; });
        if (reduce) { drop(cols / 2, rows / 2, 1.5, 3); for (let s = 0; s < 40; s++) step(); render(); }
        new IntersectionObserver(es => es.forEach(e => (seen = e.isIntersecting))).observe(pool);
        requestAnimationFrame(frame);
    });

    /* ---------- Next topic in the footer ---------- */
    const i = live.indexOf(topic);
    const next = live[(i + 1) % live.length];
    const a = document.getElementById('next-topic');
    if (next && next !== topic) {
        a.href = projectLink(next);
        a.innerHTML = esc(next.title) + ' <span>→</span>';
    } else a.closest('div').querySelector('small').textContent = 'BACK TO';

    /* ---------- Fade-up on scroll (content stays visible if this never runs) ---------- */
    const els = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduce) {
        document.body.classList.add('js-reveal');
        const io = new IntersectionObserver(es => es.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        }), { rootMargin: '0px 0px -8% 0px' });
        els.forEach(el => io.observe(el));
    }
})();
