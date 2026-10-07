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

    // Blink & Break: a playable copy of the safe (LED panel, button box, safe with dial)
    const SAFE = `
        <div class="safe-game" data-safe>
            <div class="sg-scene">
                <div class="sg-leds" aria-hidden="true">${'<i></i>'.repeat(9)}</div>
                <div class="sg-pad" role="group" aria-label="Button grid">${Array.from({ length: 9 }, (_, i) =>
                    `<button type="button" aria-label="Button ${i + 1}" disabled></button>`).join('')}</div>
                <div class="sg-safe" aria-hidden="true">
                    <div class="sg-inside"><span>★</span></div>
                    <div class="sg-door">
                        <span class="sg-screen">READY</span>
                        <span class="sg-dial"><i></i></span>
                    </div>
                </div>
            </div>
            <div class="sg-bar">
                <ol class="sg-progress" aria-label="Correct sequences">${'<li></li>'.repeat(6)}</ol>
                <p class="sg-msg" aria-live="polite">Press start, then watch the lights.</p>
                <button type="button" class="sg-start">Start</button>
            </div>
        </div>`;

    function mediaHTML(m, alt) {
        if (m.safe) return SAFE;
        if (m.youtube) return yt(m);
        if (m.video) return `<video class="clip${m.portrait ? ' is-portrait' : ''}" src="${esc(m.video)}" ${m.poster ? `poster="${esc(m.poster)}"` : ''} muted loop playsinline preload="metadata"${reduce ? ' controls' : ' autoplay'} aria-label="${esc(m.alt || alt)}"></video>`;
        return `<img src="${esc(m.src)}" alt="${esc(m.alt || alt)}" loading="lazy">`;
    }

    // Small line icons for "How to play" (drawn for the site, not stock)
    const STEP_ICONS = {
        watch:    '<circle cx="26" cy="26" r="14"/><path d="M36 36l14 14"/><path d="M20 22h3M29 22h3M20 30h3M29 30h3" stroke-width="3"/>',
        remember: '<path d="M18 54V44c-6-4-9-10-9-17C9 15 19 7 31 7s21 8 21 19c0 3-1 5-2 7l4 8h-5v6c0 3-2 5-5 5h-6v4"/><path d="M38 24a7 7 0 1 1-3-6"/><path d="M38 14v6h-6"/>',
        press:    '<path d="M24 31V13a4 4 0 0 1 8 0v15l12 2c3 1 5 3 4 7l-3 14c-1 3-3 5-6 5H30c-3 0-5-1-6-3l-8-12c-2-3 2-6 5-4z"/><path d="M14 10l-4-4M28 4V0M42 10l4-4"/>'
    };
    const RULE_MARKS = { up: '↑', ok: '✓', no: '✕', door: '★' };

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
        if (d.goal) h += `
            <div class="d-goal">
                <small class="d-label">Experience goal</small>
                <p>${d.goal}</p>
            </div>`;
        if (d.steps) h += `
            <div class="d-sec">
                <small class="d-label">How to play</small>
                <ol class="d-steps">${d.steps.map((s, i) => `
                    <li>
                        <svg viewBox="0 0 60 60" aria-hidden="true">${STEP_ICONS[s.icon] || ''}</svg>
                        <b>0${i + 1}</b>
                        <strong>${esc(s.title)}</strong>
                        <p>${esc(s.text)}</p>
                    </li>`).join('')}
                </ol>
            </div>`;
        if (d.rules) h += `
            <div class="d-sec">
                <small class="d-label">${esc(d.rulesLabel || 'As you play')}</small>
                <ul class="d-rules">${d.rules.map(r => `
                    <li class="r--${esc(r.mark)}"><b aria-hidden="true">${RULE_MARKS[r.mark] || '•'}</b><p>${esc(r.text)}</p></li>`).join('')}
                </ul>
            </div>`;
        if (d.compare) {
            const c = d.compare;
            const side = s => `
                <figure>
                    <img src="${esc(s.src)}" alt="${esc(s.alt || s.label)}" loading="lazy">
                    <figcaption><strong>${esc(s.label)}</strong>${s.note ? `<span>${esc(s.note)}</span>` : ''}</figcaption>
                </figure>`;
            h += `
            <div class="d-sec">
                <small class="d-label">${esc(c.label || 'From display piece to creature')}</small>
                <div class="d-compare">
                    ${side(c.before)}
                    <div class="d-adds"><small>What I added</small><ul>${c.adds.map(a => `<li>${esc(a)}</li>`).join('')}</ul><span aria-hidden="true"></span></div>
                    ${side(c.after)}
                </div>
            </div>`;
        }
        if (d.contrib) h += `
            <div class="d-sec">
                <small class="d-label">My part</small>
                <ul class="d-contrib">${d.contrib.map(c => `<li>${c}</li>`).join('')}</ul>
            </div>`;
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
        if (d.build) h += `
            <div class="d-sec">
                <small class="d-label">${esc(d.buildLabel || 'Making it')}</small>
                <div class="d-build">${d.build.map(b => `<img src="${esc(b.src)}" alt="${esc(b.alt || '')}">`).join('')}</div>
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
            const facts = [['Type', it.type], ['Made with', it.madeWith], ['Team', it.team], ['My part', it.role], ['In collaboration with', it.with], ['Course', it.course], ['When', it.when], ['Status', it.status]]
                .filter(f => f[1]).map(f => `<div><small>${f[0]}</small><strong>${esc(f[1])}</strong></div>`).join('');
            const tools = (it.tools || []).map(t => `<li>${esc(t)}</li>`).join('');
            // Collage project: text on top, photo wall underneath
            if (it.collage) return `
            <article class="build build--collage" id="item-${i + 1}">
                <div class="c-top reveal">
                    <div class="b-copy">
                        <div class="label"><b>${pad(i)}</b><span>${esc(it.kicker || topic.title)}</span></div>
                        <h2>${esc(it.title)}</h2>
                        ${it.tagline ? `<p class="b-tag hand">${esc(it.tagline)}</p>` : ''}
                        <p class="lead">${esc(it.text)}</p>
                    </div>
                    <div class="b-copy c-side">
                        ${facts ? `<div class="b-facts">${facts}</div>` : ''}
                        ${tools ? `<div class="b-tools"><small>Made with</small><ul>${tools}</ul></div>` : ''}
                        ${it.link ? `<a class="b-link" href="${esc(it.link.url)}" target="_blank" rel="noopener">${esc(it.link.label)} <span>↗</span></a>` : ''}
                    </div>
                </div>
                <div class="collage reveal">${it.collage.map(c =>
                    `<img src="${esc(c.src)}" alt="${esc(c.alt || it.title)}" loading="lazy">`).join('')}</div>
                ${it.deep ? deepHTML(it.deep, it) : ''}
            </article>`;
            return `
            <article class="build${it.deep ? ' build--deep' : ''}" id="item-${i + 1}">
                <div class="build-row reveal">
                    <div class="b-media${media[0] && media[0].portrait ? ' b-media--portrait' : ''}">${first}${extra}</div>
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

    /* ---------- Short clips: play like GIFs, pause when off-screen ---------- */
    if (!reduce && 'IntersectionObserver' in window) {
        const vio = new IntersectionObserver(es => es.forEach(e => {
            if (e.isIntersecting) { const p = e.target.play(); p && p.catch(() => {}); } else e.target.pause();
        }), { threshold: 0.2 });
        main.querySelectorAll('video.clip').forEach(v => vio.observe(v));
    }

    /* ---------- Blink & Break: the playable safe ----------
       Same rules as the real build: watch the LEDs, repeat the pattern on the buttons.
       Right = handle turns forward + green flash; wrong = handle turns back + red flash.
       Six right and the door swings open, then closes to reset. Each round is longer and faster. */
    document.querySelectorAll('[data-safe]').forEach(game => {
        const leds = [...game.querySelectorAll('.sg-leds i')];
        const btns = [...game.querySelectorAll('.sg-pad button')];
        const dots = [...game.querySelectorAll('.sg-progress li')];
        const msg = game.querySelector('.sg-msg');
        const screen = game.querySelector('.sg-screen');
        const dial = game.querySelector('.sg-dial');
        const startBtn = game.querySelector('.sg-start');
        const GOAL = 6;
        let progress = 0, seq = [], pos = 0, state = 'idle', run = 0;

        const wait = ms => new Promise(r => setTimeout(r, ms));
        const say = t => { msg.textContent = t; };
        const setPads = on => btns.forEach(b => { b.disabled = !on; });
        const allLeds = cls => leds.forEach(l => { l.className = cls || ''; });

        function draw() {
            dial.style.setProperty('--turn', (progress * 60) + 'deg');
            dots.forEach((d, i) => d.classList.toggle('on', i < progress));
            screen.textContent = state === 'open' ? 'OPEN' : progress ? `${progress} / ${GOAL}` : (state === 'idle' ? 'READY' : `0 / ${GOAL}`);
        }

        async function flash(cls, times, id) {
            for (let k = 0; k < times; k++) {
                allLeds(cls); game.classList.add('is-' + cls);
                await wait(220); if (id !== run) return;
                allLeds(); game.classList.remove('is-' + cls);
                await wait(140); if (id !== run) return;
            }
        }

        async function round() {
            const id = ++run;
            const len = 3 + progress;                         // 3 lights, then one more each round
            const on = Math.max(260, 620 - progress * 70);    // and a little faster
            seq = [];
            while (seq.length < len) {
                const n = Math.floor(Math.random() * 9);
                if (n !== seq[seq.length - 1]) seq.push(n);
            }
            pos = 0; state = 'showing'; setPads(false); draw();
            say(`Round ${progress + 1}: watch the lights…`);
            await wait(650); if (id !== run) return;
            for (const n of seq) {
                leds[n].className = 'lit';
                await wait(on); if (id !== run) return;
                leds[n].className = '';
                await wait(170); if (id !== run) return;
            }
            state = 'input'; setPads(true);
            say('Your turn: repeat it on the buttons.');
        }

        async function press(n) {
            if (state !== 'input') return;
            const id = run;
            leds[n].className = 'lit';
            setTimeout(() => { if (leds[n].className === 'lit') leds[n].className = ''; }, 180);
            if (n !== seq[pos]) {                              // wrong: handle turns back, red flash
                state = 'busy'; setPads(false);
                progress = Math.max(0, progress - 1); draw();
                say('Not quite. The handle turns back. Watch again…');
                await flash('red', 2, id); if (id !== run) return;
                await wait(500); if (id !== run) return;
                return round();
            }
            pos++;
            if (pos < seq.length) return;
            state = 'busy'; setPads(false);                     // right: handle turns forward, green flash
            progress++; draw();
            await flash('green', 2, id); if (id !== run) return;
            if (progress < GOAL) {
                say(`Correct! ${GOAL - progress} more to open the safe.`);
                await wait(700); if (id !== run) return;
                return round();
            }
            state = 'open'; draw(); game.classList.add('is-open');
            say('Cracked it! The door swings open…');
            await wait(2600); if (id !== run) return;
            game.classList.remove('is-open');
            await wait(700); if (id !== run) return;
            progress = 0; state = 'idle'; draw();
            say('The door closes and the safe resets. Play again?');
            startBtn.textContent = 'Play again';
        }

        btns.forEach((b, i) => b.addEventListener('click', () => press(i)));
        game.addEventListener('keydown', e => {                // number keys 1–9 work too
            const n = parseInt(e.key, 10);
            if (n >= 1 && n <= 9 && state === 'input') { e.preventDefault(); btns[n - 1].focus(); press(n - 1); }
        });
        startBtn.addEventListener('click', () => {
            run++; progress = 0; allLeds(); game.classList.remove('is-open', 'is-red', 'is-green');
            startBtn.textContent = 'Restart';
            round();
        });
        draw();
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
