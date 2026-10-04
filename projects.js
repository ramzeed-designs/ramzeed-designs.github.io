/* =====================================================================
   YOUR PROJECTS: the one place you edit.
   The homepage cards AND each project page are built from this list,
   in this order. To add a project, copy one { ... } entry, change it,
   and put its images in images/<slug>/.

   slug      short id used in the link: project.html?p=<slug>
             (lowercase, hyphens, no spaces)
   title     project name
   category  small label on the card and page
   summary   one line under the title
   colour    optional card colour: 'purple', 'orange', 'green' or 'blue'
             (leave it out and the cards cycle through the four)
   thumb     card image, e.g. 'images/thumbs/wrist-shooter.webp'
             leave '' to show a coloured placeholder
   meta      optional facts shown under the title (any labels you like)
   blocks    the page, top to bottom. Three kinds:
               { type: 'image', src: '...', alt: '...' }
               { type: 'video', src: 'videos/x.mp4', poster: 'images/x.webp' }
               { type: 'embed', url: 'https://www.youtube.com/embed/VIDEO_ID' }
               { type: 'game', src: 'games/<name>/index.html', title: '...', text: '...', hint: '...', cover: '' }
                 (an interactive HTML piece that loads when the visitor clicks Play)
   page      optional: link to a separate hand-coded page instead
   soon      true = shows as a "Coming soon" card that can't be clicked
   ===================================================================== */

const projects = [
    {
        slug: 'wrist-shooter',
        title: 'Wrist Shooter',
        category: 'Toy design',
        summary: 'A modular DIY wearable toy system',
        thumb: '',
        page: 'project-wrist-shooter.html'      // hand-coded case study built from the Figma design
    },
    {
        slug: 'diy-sketch-toy',
        title: 'DIY Sketch Toy',
        category: 'Toy design',
        summary: 'A build-it-yourself drawing toy that helps kids draw',
        thumb: 'images/sketch-toy/hero.png',
        page: 'project-diy-sketch-toy.html'
    },
    {
        slug: 'fidget-puzzle',
        title: 'DIY Fidget Puzzle',
        category: 'Toy design',
        summary: 'A rotating ball puzzle built around an existing ball inventory',
        thumb: 'images/fidget-puzzle/cs/final-render.webp',
        page: 'project-fidget-puzzle.html'
    },
    {
        slug: 'hydraulic-press',
        title: 'Hydraulic Crusher / Lifter',
        category: 'Toy concept',
        summary: 'A syringe-powered DIY press that rebuilds into a lifter',
        thumb: 'images/hydraulic-press/cs/thumb.webp',
        page: 'project-hydraulic-press.html'
    },
    {
        slug: 'dragon-island',
        title: 'Dragon Island',
        category: 'AR experience',
        summary: 'An AR scene hidden in the campus table-tennis area',
        thumb: 'images/dragon-island/cs/build-4.webp',
        page: 'project-dragon-island.html'
    },
    {
        slug: 'prison-break',
        title: 'Prison Break',
        category: 'VR experience',
        summary: 'A VR escape room where a guarded key maker holds the way out',
        thumb: 'images/key-maker/cs/gameplay.webp',
        page: 'project-prison-break.html'
    },
    {
        slug: 'splash-out',
        title: 'Splash Out',
        category: 'Game design',
        summary: 'A Unity physics-puzzle game about a fish escaping a kitchen',
        thumb: 'images/splash-out/cs/shot-3.webp',
        page: 'project-splash-out.html'
    },
    {
        slug: 'blowpli',
        title: 'BlowPli',
        category: 'Toy design',
        summary: 'A breath-powered maze toy for Anganwadi kids, with Gulab Tribe',
        thumb: 'images/blowpli/cs/room.webp',
        page: 'project-blowpli.html'
    },
    {
        slug: 'binome',
        title: 'BinoMe',
        category: 'Toy design',
        summary: 'A role-play toy that helps kids explore emotions, with Gulab Tribe',
        thumb: 'images/binome/cs/thumb.webp',
        page: 'project-binome.html'
    },
    {
        slug: 'naveena-sombu',
        title: 'Naveena Sombu',
        category: 'Product design',
        summary: 'A modern lota: a one-hand spit container for drivers who chew pan',
        thumb: 'images/naveena-sombu/cs/thumb.webp',
        page: 'project-naveena-sombu.html'
    },
    {
        slug: 'trove',
        title: 'Trove',
        category: 'UX/UI design',
        summary: 'A library app that lets NID students find, reserve and track books',
        thumb: 'images/trove/cs/thumb.webp',
        page: 'project-trove.html'
    },
    {
        slug: 'grip-n-glow',
        title: 'Grip-n-Glow',
        category: 'Design for special needs',
        summary: 'A squeeze-to-light grip exercise device for children with cerebral palsy',
        thumb: 'images/grip-n-glow/cs/thumb.svg',
        page: 'project-grip-n-glow.html'
    },
    {
        slug: 'beypore-uru',
        title: 'The Legacy of Beypore Uru',
        category: 'Craft documentation',
        summary: 'A book on how Beypore\'s wooden Uru ships are still built by hand',
        thumb: 'images/beypore-uru/cs/thumb.webp',
        page: 'project-beypore-uru.html'
    }
];

/* =====================================================================
   PLAYGROUND: one tile per topic. A tile with `items` opens topic.html?t=<slug>,
   a compact page built from those items (no hand-coded page needed).

   title    topic name on the tile and page
   tag      sticker on the tile, e.g. '3 builds' (leave out to count the items)
   summary  one line on the tile
   shape    'tall', 'wide' or 'square'
   colour   'purple', 'orange', 'green' or 'blue' (tile + topic page colour)
   icon     line drawing on the tile while there's no thumb: gear, cursor, heart, toy
   thumb    tile image (optional)
   tagline  handwritten line on the topic page
   intro    one or two sentences under the topic title
   layout   'list' (default) or 'gallery' (photo wall, for Hobbies)
   soon     true = dashed "Coming soon" tile that can't be clicked

   items: the projects inside a topic. Each one can have:
     title, tagline (handwritten), text (2–3 lines), kicker (small label above the title),
     type / madeWith / team / course / when (facts row; leave out any you don't know),
     tools: ['TouchDesigner', ...],
     media: first one is big, up to 3 more show small underneath:
            { src: 'images/x.webp', alt: '...' }  or  { video: 'clip.mp4' }  or  { youtube: 'VIDEO_ID', title: '...', mute: true }
     with: 'Name · Department' (collaborator), link: { label: 'Play on itch.io', url: '...' },
     deep: optional dark panel underneath (see Luminara) with quote, story, flow, videos
   ===================================================================== */

const playground = [
    {
        slug: 'interaction-design', title: 'Interaction Design', icon: 'cursor',
        summary: 'Spaces and objects that respond to people',
        shape: 'wide', colour: 'purple', thumb: '',
        intro: 'Some experiments of mine, trying out new tools and seeing how people respond to what I make.',
        items: [
            {
                title: 'Luminara',
                kicker: 'Interactive installation',
                text: 'An installation inspired by bioluminescence and drawn from my own encounter with it. A Kinect reads your hands over a dark, still surface; TouchDesigner answers with glowing ripples of light, and Ableton Live with shifting voices.',
                type: 'Interactive installation',
                madeWith: 'TouchDesigner',
                media: [{ youtube: 'VA65LQzWD_I', title: 'Luminara · Experience video' }],
                deep: {
                    quote: 'The goal of <b>Luminara</b> was an experience that reflects how nature is <em>interactive</em> and <em>responsive</em>: mesmerising in its movement, and <b>playful</b> in its engagement.',
                    poolHint: 'move across the water',
                    story: [
                        { src: 'images/luminara/cs/story-1.webp', text: 'Trapped in the noise of a relentless world, you find yourself in a quiet, bare room.', alt: 'a dark empty room with a shallow tray of water in the middle' },
                        { src: 'images/luminara/cs/story-2.webp', text: 'Drawn by something unspoken, you approach. A quiet curiosity rises.', alt: 'a person leaning over the tray, touching the water' },
                        { src: 'images/luminara/cs/story-3.webp', text: 'You reach out. The surface is cool and still, until your hand meets it.', alt: 'a hand resting on the water, rings spreading out' },
                        { src: 'images/luminara/cs/story-4.webp', text: 'And then, light. Gentle, glowing, alive. The water responds with colour and with feeling.', alt: 'the water glowing teal in rippling waves' }
                    ],
                    flow: [
                        { label: 'Sense', nodes: [{ name: 'Hand gestures', note: 'over the surface' }, { name: 'Kinect 2', note: 'tracks the hands' }] },
                        { label: 'Process', nodes: [{ name: 'TouchDesigner', note: 'turns movement into visuals' }, { name: 'Ableton Live', note: 'manipulates the voices' }] },
                        { label: 'Output', lanes: [
                            [{ name: 'Generating visuals' }, { name: 'Projector' }],
                            [{ name: 'Voice manipulation' }, { name: 'Audio output' }]
                        ] },
                        { label: 'Result', nodes: [{ name: 'Immersive experience', note: 'visual projection + audible sound' }] }
                    ],
                    videosLabel: 'Another session',
                    videos: [{ youtube: 'OZe9zkFFnT0', title: 'Luminara · Experience' }]
                }
            },
            {
                title: 'Ratkasque',
                kicker: 'AR art installation',
                text: 'An AR installation that critiques how consumerist algorithms push people into impulsive purchases. Set as a maze game, players help Mimi the rat buy shoes for the Great Cheese Marathon, and meet the algorithm\'s tricks along the way.',
                type: 'AR art installation',
                with: 'Naem Mohammed · New Media Design',
                media: [{ youtube: 'QVZPBECgi-4', title: 'Ratkasque · Experience video', mute: true }],
                deep: {
                    theme: 'gold',
                    intro: {
                        img: 'images/ratkasque/cs/logo.webp',
                        alt: 'Ratkasque logo: a worried rat in a suit running in a wooden wheel, surrounded by the word Ratkasque in tall copper letters',
                        text: 'Help <b>Mimi</b>, a rat with <b>₹500</b>, get a pair of shoes for a 10 km race, the <b>Great Cheese Marathon</b>. Across four chambers, players run into <b>surveillance</b>, <b>psychological tactics</b> and <b>curated realities</b>: the tricks algorithms use to create an illusion of choice and keep people buying.',
                        timer: '5 min',
                        timerNote: 'to get Mimi race-ready'
                    },
                    chambersLabel: 'Through the chambers',
                    chambers: [
                        { n: '1', title: 'Find the Magnifying Glass and Augmented Ears', text: 'These tools reveal the traps set by algorithms. Look through the magnifying glass to see <b>laser beams</b> in the chamber, and don\'t touch them.' },
                        { n: '2', title: 'Choose the shoes', text: 'Pick a suitable pair of <b>shoes</b> for Mimi from the screen, then follow the on-screen instructions to continue.' }
                    ]
                }
            }
        ]
    },
    { slug: 'mechatronics', title: 'Mechatronics', tag: '3 builds',    icon: 'gear',  summary: 'Small machines that move, blink and beep', shape: 'tall',   colour: 'blue',   thumb: '', soon: true },
    { slug: 'hobbies',      title: 'Hobbies',      tag: 'Off the clock', icon: 'heart', summary: 'What I do when I\'m not designing',     shape: 'tall',   colour: 'orange', thumb: '', soon: true },
    { slug: 'soft-toys',    title: 'Soft Toys',    tag: '1 project',   icon: 'toy',   summary: 'Stitched, stuffed and squeezable',        shape: 'square', colour: 'green',  thumb: '', soon: true },
    { slug: 'more-1',       title: 'More on the way', tag: 'Soon',                     summary: '',                                        shape: 'square', colour: 'orange', thumb: '', soon: true }
];

/* ---------- Helpers used by the pages (no need to edit) ---------- */

// Finds a slug in either list, and remembers which list it came from
function findEntry(slug) {
    for (const [list, from] of [[projects, 'work'], [playground, 'playground']]) {
        const item = list.find(p => p.slug === slug && !p.soon);
        if (item) return { item, list, from };
    }
    return null;
}

const PLAY_ICONS = {
    gear:   '<circle cx="32" cy="32" r="9"/><path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M49 15l-6 6M21 43l-6 6"/><circle cx="32" cy="32" r="17"/>',
    cursor: '<path d="M18 12l26 18-12 3 7 14-6 3-7-14-8 9z"/><path d="M44 10c4 2 7 5 9 9M47 4c6 3 10 7 13 13"/>',
    heart:  '<path d="M32 52S10 39 10 24a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 15-22 28-22 28z"/>',
    toy:    '<circle cx="18" cy="16" r="7"/><circle cx="46" cy="16" r="7"/><circle cx="32" cy="34" r="20"/><circle cx="25" cy="31" r="1.5"/><circle cx="39" cy="31" r="1.5"/><path d="M28 40q4 4 8 0"/><path d="M14 46l-4 8M50 46l4 8" stroke-dasharray="3 4"/>'
};

function playCardHTML(p) {
    let media = '<span class="play-dots" aria-hidden="true"></span>';
    if (p.thumb) media = `<img src="${escapeHTML(p.thumb)}" alt="" loading="lazy">`;
    else if (p.icon && PLAY_ICONS[p.icon]) media += `<svg class="play-icon" viewBox="0 0 64 64" aria-hidden="true">${PLAY_ICONS[p.icon]}</svg>`;
    const n = p.items ? p.items.length : 0;
    const tag = p.tag || (n ? n + (n === 1 ? ' project' : ' projects') : '');
    const inner = `
        <div class="play-media">${media}</div>
        ${tag ? `<span class="play-tag">${escapeHTML(tag)}</span>` : ''}
        <div class="play-label">
            <h3>${escapeHTML(p.title)}</h3>
            <p>${escapeHTML(p.soon ? 'Coming soon' : p.summary)}</p>
        </div>`;
    const cls = `play-card play--${p.shape || 'square'} play--${p.colour || 'purple'}`;
    return p.soon
        ? `<div class="${cls} is-soon">${inner}</div>`
        : `<a class="${cls}" href="${escapeHTML(projectLink(p))}">${inner}</a>`;
}

function projectLink(p) {
    if (p.page) return p.page;
    if (p.items) return 'topic.html?t=' + encodeURIComponent(p.slug);
    return 'project.html?p=' + encodeURIComponent(p.slug);
}

function escapeHTML(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const ARROW_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>';

const CARD_COLOURS = ['purple', 'orange', 'green', 'blue'];

function cardHTML(p, i = 0) {
    const colour = 'card--' + (p.colour || CARD_COLOURS[i % CARD_COLOURS.length]);
    const thumb = p.thumb
        ? `<div class="thumb" style="--thumb: url('${escapeHTML(p.thumb)}')"></div>`
        : `<div class="thumb thumb--empty"><span>${escapeHTML(p.title)}</span></div>`;
    const inner = `
        ${thumb}
        <div class="card-head">
            <h3>${escapeHTML(p.title)}</h3>
            <span class="arrow" aria-hidden="true">${p.soon ? '' : ARROW_SVG}</span>
        </div>
        <hr>
        <p>${escapeHTML(p.category)} · ${escapeHTML(p.summary)}</p>`;
    return p.soon
        ? `<div class="card card--soon ${colour}" aria-label="${escapeHTML(p.title)}, coming soon">${inner}<span class="soon-tag">Coming soon</span></div>`
        : `<a class="card ${colour}" href="${escapeHTML(projectLink(p))}">${inner}</a>`;
}
