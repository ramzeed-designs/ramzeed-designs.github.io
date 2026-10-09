/* =====================================================================
   YOUR PROJECTS: the one place you edit.
   The homepage cards AND each project page are built from this list,
   in this order. To add a project, copy one { ... } entry, change it,
   and put its images in images/<slug>/.

   slug      short id used in the link: project.html?p=<slug>
             (lowercase, hyphens, no spaces)
   title     project name
   category  small label on the card and page (also decides the filter chip)
   tags      extra pills on the home card, e.g. ['Rapid prototyping']
   brand     optional company logo on the card: 'smartivity' (logos live in BRAND_LOGOS below)
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
        thumb: 'images/wrist-shooter/cs/final-4.webp',
        page: 'project-wrist-shooter.html',     // hand-coded case study built from the Figma design
        tags: ['Rapid prototyping'],
        brand: 'smartivity'
    },
    {
        slug: 'diy-sketch-toy',
        title: 'DIY Sketch Toy',
        category: 'Toy design',
        summary: 'A build-it-yourself drawing toy that helps kids draw',
        thumb: 'images/sketch-toy/cs/card.webp',   // the Amazon box
        page: 'project-diy-sketch-toy.html',
        tags: ['Rapid prototyping'],
        brand: 'smartivity'
    },
    {
        slug: 'fidget-puzzle',
        title: 'DIY Fidget Puzzle',
        category: 'Toy design',
        summary: 'A rotating ball puzzle built around an existing ball inventory',
        thumb: 'images/fidget-puzzle/cs/card.webp',  // tighter crop of final-render
        page: 'project-fidget-puzzle.html',
        tags: ['Rapid prototyping'],
        brand: 'smartivity'
    },
    {
        slug: 'blowpli',
        title: 'BlowPli',
        category: 'Toy design',
        summary: 'A breath-powered maze toy for Anganwadi kids, with Gulab Tribe',
        thumb: 'images/blowpli/cs/room.webp',
        page: 'project-blowpli.html',
        tags: ['Early childhood development']
    },
    {
        slug: 'binome',
        title: 'BinoMe',
        category: 'Toy design',
        summary: 'A role-play toy that helps kids explore emotions, with Gulab Tribe',
        thumb: 'images/binome/cs/thumb.webp',
        page: 'project-binome.html',
        tags: ['Social-emotional learning']
    },
    {
        slug: 'hydraulic-press',
        title: 'Hydraulic Crusher / Lifter',
        category: 'Toy concept',
        summary: 'A syringe-powered DIY press that rebuilds into a lifter',
        thumb: 'images/hydraulic-press/cs/thumb.webp',
        page: 'project-hydraulic-press.html',
        tags: ['3D design']
    },
    {
        slug: 'naveena-sombu',
        title: 'Naveena Sombu',
        category: 'Product design',
        summary: 'A modern lota: designing for extreme users, drivers who chew pan',
        thumb: 'images/naveena-sombu/cs/thumb.webp',
        page: 'project-naveena-sombu.html',
        tags: ['Behavioural study', 'User research']
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
        page: 'project-prison-break.html',
        tags: ['Interactive play', 'XR prototyping']
    },
    {
        slug: 'splash-out',
        title: 'Splash Out',
        category: 'Game design',
        summary: 'A Unity physics-puzzle game about a fish escaping a kitchen',
        thumb: 'images/splash-out/cs/shot-3.webp',
        page: 'project-splash-out.html',
        tags: ['Level design']
    },
    {
        slug: 'trove',
        title: 'Trove',
        category: 'UX/UI design',
        summary: 'A library app that lets NID students find, reserve and track books',
        thumb: 'images/trove/cs/thumb-hero.webp',
        page: 'project-trove.html',
        tags: ['Cognitive ergonomics']
    },
    {
        slug: 'grip-n-glow',
        title: 'Grip-n-Glow',
        category: 'Design for special needs',
        summary: 'A squeeze-to-light grip exercise device for children with cerebral palsy',
        thumb: 'images/grip-n-glow/cs/thumb.svg',
        page: 'project-grip-n-glow.html',
        tags: ['Product design', 'Prototyping']
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
   tag      sticker on the tile (only shown on tiles without items, e.g. 'Soon')
   summary  one line on the tile
   shape    'tall', 'wide' or 'square'
   colour   'purple', 'orange', 'green', 'blue', 'yellow' or 'pink' (tile + topic page colour)
   icon     line drawing on the tile while there's no thumb: gear, cursor, heart, toy
   thumb    tile image (optional)
   tagline  handwritten line on the topic page
   intro    one or two sentences under the topic title
   layout   'list' (default) or 'gallery' (photo wall, for Hobbies)
   soon     true = dashed "Coming soon" tile that can't be clicked

   items: the projects inside a topic. Each one can have:
     title, tagline (handwritten), text (2–3 lines), kicker (small label above the title),
     thumb: small photo for the Playground tile (falls back to the first photo / poster / video still),
     short: shorter name for that tile photo (optional),
     type / madeWith / team / role / course / when / status (facts row; leave out any you don't know),
     tools: ['TouchDesigner', ...],
     media: first one is big, up to 3 more show small underneath:
            { src: 'images/x.webp', alt: '...' }  or  { video: 'clip.mp4', poster: '...', portrait: true }  or  { youtube: 'VIDEO_ID', title: '...', mute: true }
            or { safe: true } (the playable Blink & Break safe)
     collage: [{ src, alt }, ...] instead of media: the text sits on top and the photos
            form a wall underneath, 4 across (2 on phones), each at its own proportions
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
                thumb: 'images/luminara/cs/story-4.webp',
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
                thumb: 'images/ratkasque/cs/logo.webp',
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
    {
        slug: 'mechatronics', title: 'Mechatronics', icon: 'gear',
        summary: 'Small machines that move, blink and beep',
        shape: 'tall', colour: 'blue', thumb: '',
        tagline: 'wired, coded & brought to life',
        intro: 'Small builds where code meets moving parts: a safe you crack with your memory, a cockroach that reacts when you come close, and a speaker I\'m building right now.',
        items: [
            {
                title: 'Blink & Break',
                thumb: 'images/mechatronics/cs/bb-final.webp',
                kicker: 'Arduino game',
                tagline: 'crack the code.',
                text: 'An interactive puzzle game about memory and pattern recognition. LEDs on a 3×3 grid blink a sequence, and players repeat it on a matching 3×3 button grid to unlock a safe. Give it a go right here.',
                type: 'Arduino puzzle game',
                when: 'Apr 2024',                       // guessed from the photo dates: confirm
                tools: ['Arduino Uno', 'LEDs', 'Push buttons', 'Servo motor', 'Laser-cut MDF'],
                media: [
                    { safe: true },                     // the playable safe (built in topic.js)
                    { src: 'images/mechatronics/cs/bb-final.webp', alt: 'The finished build: a grey LED panel, a wooden button box and a laser-cut wooden safe with a dial and a small screen' },
                    { src: 'images/mechatronics/cs/bb-led-board.webp', alt: 'The hand-soldered 3×3 LED board, held in a hand' },
                    { src: 'images/mechatronics/cs/bb-servo.webp', alt: 'Inside the safe: a servo turning a laser-cut gear that moves the door' }
                ],
                deep: {
                    theme: 'safe',
                    goal: 'Blink & Break merges <b>cognitive challenge</b> with <b>physical feedback</b>, simulating the thrill of cracking a high-tech safe. It encourages quick thinking, memory and playful experimentation.',
                    steps: [
                        { icon: 'watch', title: 'Watch', text: 'The LEDs on the 3×3 grid blink in a sequence.' },
                        { icon: 'remember', title: 'Memorise', text: 'Hold the pattern in your head.' },
                        { icon: 'press', title: 'Recreate', text: 'Press the same pattern on the 3×3 button grid.' }
                    ],
                    rules: [
                        { mark: 'up', text: 'With every round the challenge grows: the blinking gets faster and the sequence gets longer.' },
                        { mark: 'ok', text: 'Each correct answer turns the safe\'s handle forward, with a green flash.' },
                        { mark: 'no', text: 'A wrong answer turns the handle back, with a red flash.' },
                        { mark: 'door', text: 'After six correct sequences the door unlocks, swings open, then closes again to reset the challenge.' }
                    ],
                    buildLabel: 'From laser-cut parts to a working safe',
                    build: [
                        { src: 'images/mechatronics/cs/bb-parts.webp', alt: 'Laser-cut MDF parts: a gear and curved living-hinge panels' },
                        { src: 'images/mechatronics/cs/bb-gear.webp', alt: 'The safe body half assembled, with the gear mechanism inside' },
                        { src: 'images/mechatronics/cs/bb-wiring.webp', alt: 'The safe open at the back, full of jumper wires' },
                        { src: 'images/mechatronics/cs/bb-buttons.webp', alt: 'Wiring the push buttons inside the button box' },
                        { src: 'images/mechatronics/cs/bb-arduino.webp', alt: 'The Arduino Uno wired up inside the box' },
                        { src: 'images/mechatronics/cs/bb-side.webp', alt: 'Side view of the safe with the screen on top and the servo inside' },
                        { src: 'images/mechatronics/cs/bb-final-2.webp', alt: 'The finished safe, LED panel and button box from another angle' }
                    ]
                }
            },
            {
                title: 'The Cockroach',
                thumb: 'images/mechatronics/cs/roach-interactive.webp', short: 'Cockroach',
                kicker: 'Interactive artifact',
                tagline: 'it knows you\'re there.',
                text: 'A senior had built a static cockroach out of waste materials, as a display piece. I helped bring it to life: an ultrasonic sensor notices when something comes close, and servo motors make the cockroach react with lifelike movements.',
                type: 'Interactive model',
                team: 'A senior\'s project',
                role: 'Sensors, servos & code',
                when: 'Sep 2025',                       // guessed from the video date: confirm
                tools: ['Arduino', 'Ultrasonic sensor', 'Servo motors', 'Wing mechanism'],
                media: [{ video: 'images/videos/cockroach-interactive.mp4', poster: 'images/videos/cockroach-interactive-poster.jpg', portrait: true, alt: 'A hand comes close to the cockroach and it reacts' }],
                deep: {
                    theme: 'sage',
                    compare: {
                        before: { src: 'images/mechatronics/cs/roach-static.webp', label: 'Where it started', note: 'a static model made from waste materials', alt: 'The static cockroach model: a striped green and black body with wire legs, on a wooden table' },
                        adds: ['Arduino', 'Servo + wing mechanism', 'Ultrasonic sensor'],
                        after: { src: 'images/mechatronics/cs/roach-interactive.webp', label: 'Where it ended up', note: 'electronics built into the body', alt: 'The cockroach on a workbench with its circuit board, servo and wires built into the body' }
                    },
                    contrib: [
                        'Added interactivity with an <b>ultrasonic sensor</b> that detects nearby objects.',
                        'Programmed the <b>servo motors</b> so the cockroach moves and reacts to its surroundings.',
                        'Fitted the electronics into the <b>existing model</b>, so it still reads as one creature.'
                    ],
                    flow: [
                        { label: 'Sense', nodes: [{ name: 'Ultrasonic sensor', note: 'something comes close' }] },
                        { label: 'Process', nodes: [{ name: 'Arduino', note: 'reads the distance' }] },
                        { label: 'Output', nodes: [{ name: 'Servo motors', note: 'drive the wing mechanism' }] },
                        { label: 'Result', nodes: [{ name: 'A lifelike reaction', note: 'from a model made of waste' }] }
                    ]
                }
            },
            {
                title: 'Smart DIY Bluetooth Speaker',
                short: 'DIY Speaker',
                thumb: 'images/mechatronics/cs/speaker-final.webp',
                kicker: 'Hobby build',
                tagline: 'on my desk right now.',
                text: 'What if your speaker could track your movement, so you get a seamless listening experience wherever you are in the room? That\'s the idea behind this build: a Bluetooth speaker in a laser-cut wooden body, with two ultrasonic sensors on top and a turning base underneath, all run by an Arduino.',
                type: 'Hobby project',
                status: 'In progress',
                tools: ['Arduino', 'Ultrasonic sensors', 'Stepper motor', 'Laser-cut MDF'],
                media: [
                    { src: 'images/mechatronics/cs/speaker-final.webp', alt: 'The speaker from the front: two drivers in a wooden box, two ultrasonic sensors on top' },
                    { src: 'images/mechatronics/cs/speaker-first-look.webp', alt: 'The wooden speaker sitting on its metal turntable on the desk' },
                ],
                deep: {
                    theme: 'wave',
                    flow: [
                        { label: 'Sense', nodes: [{ name: '2 ultrasonic sensors', note: 'on top of the box' }] },
                        { label: 'Process', nodes: [{ name: 'Arduino', note: 'reads the sensors' }] },
                        { label: 'Output', nodes: [{ name: 'Stepper motor', note: 'turns the base' }, { name: 'Bluetooth audio', note: 'two drivers' }] },
                        { label: 'Result', nodes: [{ name: 'An interactive speaker', note: 'that turns with you' }] }
                    ],
                    processLabel: 'How it came together',
                    process: [
                        { src: 'images/mechatronics/cs/sp-p1-base.webp', title: 'The base', text: 'Drilling the base.', alt: 'Drilling the laser-cut base plate' },
                        { src: 'images/mechatronics/cs/speaker-wiring.webp', title: 'Breadboard first', text: 'Testing the Arduino, stepper motor and both ultrasonic sensors before building anything around them.', alt: 'An Arduino, a stepper motor and two ultrasonic sensors wired on a breadboard' },
                        { src: 'images/mechatronics/cs/sp-p3-turntable.webp', title: 'The turning base', text: 'Making a DIY lazy Susan turntable for the speaker to turn on.', alt: 'A metal turntable, wires and two ultrasonic sensors on the desk' },
                        { src: 'images/mechatronics/cs/sp-p4-body.webp', grow: 1, ratio: '3 / 4', title: 'Building the body', text: 'Assembling the laser-cut box around the two drivers and the audio board.', alt: 'The laser-cut wooden box open, with a circuit board and wires inside, next to a soldering iron' },
                        { src: 'images/mechatronics/cs/sp-p5-inside.webp', grow: 1, ratio: '3 / 4', pos: '40% 50%', title: 'Wiring it inside', text: 'Fitting the board and soldering the connections inside the box.', alt: 'Top view of the open wooden body with the board inside and a soldering iron beside it' },
                        { src: 'images/mechatronics/cs/speaker-desk.webp', grow: 1.5, ratio: '3 / 4', title: 'On the table', text: 'All wired up and sitting on its turntable for the first time.', alt: 'The finished speaker on the desk: two drivers in a wooden box, two ultrasonic sensors on top, on its metal turntable' }
                    ],
                    film: { video: 'images/videos/speaker-film.mp4', poster: 'images/videos/speaker-film-poster.jpg', label: 'See it in action', note: 'Turn your sound on', alt: 'The speaker on the desk, turning on its base' }
                }
            }
        ]
    },
    { slug: 'hobbies',      title: 'Hobbies',      tag: 'Off the clock', icon: 'heart', summary: 'What I do when I\'m not designing',     shape: 'tall',   colour: 'yellow', thumb: '', soon: true },
    {
        slug: 'soft-toys', title: 'Soft Toys', icon: 'toy',
        summary: 'Stitched, stuffed and squeezable',
        shape: 'square', colour: 'green', thumb: '',
        tagline: 'stitched, stuffed & squeezable',
        intro: 'Soft things I\'ve cut, sewn and stuffed by hand.',
        items: [
            {
                title: 'Shark Cast Cover',
                thumb: 'images/soft-toys/cs/shark-assembled.webp',
                kicker: 'Soft toy',
                tagline: 'a cast worth showing off.',
                text: 'A soft toy for kids who have broken their arm. It slips over the hand cast and covers it, so the cast turns into a shark and becomes something cool to show off instead of something to hide.',
                type: 'Soft toy · cast cover',
                tools: ['Fabric', 'Stuffing', 'Sewing machine', 'Hand stitching'],
                // Photo collage (4 across, 2 on phones). First row: making it; second row: the finished shark
                collage: [
                    { src: 'images/soft-toys/cs/shark-pieces.webp',    alt: 'The shark body pieces in grey and white fabric laid out on a table, with stuffing beside them' },
                    { src: 'images/soft-toys/cs/shark-sewing.webp',    alt: 'Red fabric cut for the mouth, next to a sewing machine' },
                    { src: 'images/soft-toys/cs/shark-teeth.webp',     alt: 'Hand-stitching the red mouth with white zig-zag teeth' },
                    { src: 'images/soft-toys/cs/shark-eyes.webp',      alt: 'Fitting the black felt eyes on the stuffed shark' },
                    { src: 'images/soft-toys/cs/shark-assembled.webp', alt: 'The finished shark on the table: grey back, white belly, fins and a red toothy mouth' },
                    { src: 'images/soft-toys/cs/shark-hand.webp',      alt: 'The shark with a hand inside it' },
                    { src: 'images/soft-toys/cs/shark-worn-1.webp',    alt: 'The shark worn over an arm, held up by a smiling friend' },
                    { src: 'images/soft-toys/cs/shark-worn-2.webp',    alt: 'The shark worn over the arm, jaws up by the shoulder' }
                ]
            }
        ]
    },
    { slug: 'more-1',       title: 'More on the way', tag: 'Soon',                     summary: '',                                        shape: 'square', colour: 'pink', thumb: '', soon: true }
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

// Picture for one project inside a topic: its own thumb, else the first photo, poster or video still
function itemThumb(it) {
    if (it.thumb) return it.thumb;
    for (const m of (it.media || [])) {
        if (m.src) return m.src;
        if (m.poster) return m.poster;
        if (m.youtube) return 'https://i.ytimg.com/vi/' + m.youtube + '/hqdefault.jpg';
    }
    if (it.collage && it.collage[0]) return it.collage[0].src;
    return '';
}

function playCardHTML(p) {
    let media;
    if (p.items && p.items.length) {
        // A little photo wall of the projects inside this topic, each with its name
        const shots = p.items.map(it => {
            const src = itemThumb(it);
            const pic = src
                ? `<img src="${escapeHTML(src)}" alt="" loading="lazy">`
                : `<span class="play-shot-empty" aria-hidden="true">${it.status ? escapeHTML(it.status) : 'Photos soon'}</span>`;
            return `<span class="play-shot">${pic}<b>${escapeHTML(it.short || it.title)}</b></span>`;
        }).join('');
        media = `<div class="play-shots n${Math.min(p.items.length, 4)}">${shots}</div>`;
    } else {
        media = '<span class="play-dots" aria-hidden="true"></span>';
        if (p.thumb) media = `<img src="${escapeHTML(p.thumb)}" alt="" loading="lazy">`;
        else if (p.icon && PLAY_ICONS[p.icon]) media += `<svg class="play-icon" viewBox="0 0 64 64" aria-hidden="true">${PLAY_ICONS[p.icon]}</svg>`;
    }
    const tag = p.items && p.items.length ? '' : (p.tag || '');
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

/* ---------- Home page "Works" grid (filter chips + cards) ---------- */

// Which filter chip each category belongs to. Add a line here if you add a new category.
const WORK_FILTERS = [
    { id: 'toys',    label: 'Toy design',         match: ['Toy design', 'Toy concept'] },
    { id: 'games',   label: 'Games & XR',         match: ['Game design', 'AR experience', 'VR experience'] },
    { id: 'product', label: 'Product & UX',       match: ['Product design', 'UX/UI design', 'Design for special needs'] },
    { id: 'craft',   label: 'Research & craft',   match: ['Craft documentation'] }
];
function workFilterOf(p) {
    const f = WORK_FILTERS.find(f => f.match.includes(p.category));
    return f ? f.id : 'other';
}

// Company logos that can sit on a card's image (set `brand` on the project)
const BRAND_LOGOS = {
    smartivity: { src: 'images/logos/smartivity.png', alt: 'Smartivity' }
};

// Light colours for the travelling border on hover, one per card in turn
const GLOW_COLOURS = ['#ff8a3d', '#8b6cff', '#22c98a', '#3aa0ff', '#ff4f9a', '#f5c400'];

function workCardHTML(p, i = 0) {
    const media = p.thumb
        ? `<img src="${escapeHTML(p.thumb)}" alt="" loading="lazy">`
        : `<span class="wcard-empty">${escapeHTML(p.title)}</span>`;
    const logo = p.brand && BRAND_LOGOS[p.brand]
        ? `<img class="wcard-brand" src="${BRAND_LOGOS[p.brand].src}" alt="${BRAND_LOGOS[p.brand].alt}">`
        : '';
    const pills = [p.category, ...(p.tags || [])]
        .map(t => `<li>${escapeHTML(t)}</li>`).join('');
    const inner = `
        <div class="wcard-media">${media}${logo}</div>
        <div class="wcard-body">
            <div class="wcard-head">
                <h3>${escapeHTML(p.title)}</h3>
                ${p.soon ? '' : `<span class="wcard-arrow" aria-hidden="true">${ARROW_SVG}</span>`}
            </div>
            <p>${escapeHTML(p.summary)}</p>
            <ul class="wcard-pills" aria-label="Tags">${pills}</ul>
        </div>`;
    const attrs = `data-filter="${workFilterOf(p)}" style="--glow: ${GLOW_COLOURS[i % GLOW_COLOURS.length]}"`;
    return p.soon
        ? `<div class="wcard is-soon" ${attrs}>${inner}<span class="wcard-soon">Coming soon</span></div>`
        : `<a class="wcard" ${attrs} href="${escapeHTML(projectLink(p))}">${inner}</a>`;
}
