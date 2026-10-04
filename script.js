// Light / dark switch in the navbar.
// The two colours live in style.css under [data-theme="chalk"] and [data-theme="ink"].
const themes = [
    { name: 'chalk', swatch: '#f1f1ec', label: 'Switch to light mode' },
    { name: 'ink',   swatch: '#16181d', label: 'Switch to dark mode' }
];

const root = document.documentElement;
const button = document.getElementById('theme-btn');

function current() {
    return root.getAttribute('data-theme') === 'ink' ? 1 : 0;
}

// The dot shows the colour you'll get on click
function updateButton() {
    const next = themes[1 - current()];
    root.style.setProperty('--next', next.swatch);
    if (button) {
        button.setAttribute('aria-label', next.label);
        button.setAttribute('title', next.label);
    }
}

if (button) {
    button.addEventListener('click', function () {
        const next = themes[1 - current()];
        root.setAttribute('data-theme', next.name);
        try { localStorage.setItem('theme', next.name); } catch (e) { /* storage blocked: colour still changes */ }
        updateButton();
    });
}

updateButton();

// Sticky header: slim it down once the page has scrolled a little
const header = document.querySelector('.site-header');
if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// Rotating greeting in the hero. Add or reorder greetings here.
const greetings = [
    { word: 'Hello',     lang: 'en', note: 'English',                colour: 'purple' },
    { word: 'Bonjour',   lang: 'fr', note: 'French',                 colour: 'blue' },
    { word: 'مرحبا',     lang: 'ar', note: 'Marhaba · Arabic',       colour: 'orange', rtl: true },
    { word: 'Hej',       lang: 'da', note: 'Danish',                 colour: 'green' },
    { word: 'नमस्ते',     lang: 'hi', note: 'Namaste · Hindi',        colour: 'purple' },
    { word: 'നമസ്കാരം',  lang: 'ml', note: 'Namaskaram · Malayalam', colour: 'blue' }
];
const helloBox = document.getElementById('hello');
if (helloBox) {
    let g = 0;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setInterval(() => {
        g = (g + 1) % greetings.length;
        const next = greetings[g];
        const old = helloBox.querySelector('.hello-word:not(.is-leaving)');
        const el = document.createElement('span');
        el.className = 'hello-word c-' + next.colour + (still ? '' : ' is-entering');
        el.lang = next.lang;
        if (next.rtl) el.dir = 'rtl';
        el.textContent = next.word;
        helloBox.appendChild(el);
        if (old) {
            if (still) old.remove();
            else { old.classList.add('is-leaving'); setTimeout(() => old.remove(), 600); }
        }
        if (!still) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('is-entering')));
    }, 2400);
}
