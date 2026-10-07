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

// Hand-drawn underline under the hero title: after drawing in, it trembles a little,
// redrawn 8 times a second like a hand-animated line.
const scribble = document.getElementById('scribble');
if (scribble && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const path = scribble.querySelector('path');
    path.setAttribute('pathLength', '1');
    const j = (n) => (Math.random() - 0.5) * n;
    setTimeout(() => setInterval(() => {
        if (document.hidden) return;
        path.setAttribute('d',
            `M${6 + j(3)} ${26 + j(3)} C ${120 + j(6)} ${14 + j(4)}, ${260 + j(6)} ${30 + j(4)}, ${380 + j(6)} ${20 + j(4)} S ${540 + j(6)} ${14 + j(4)}, ${594 + j(3)} ${22 + j(3)}`);
    }, 125), 1500);
} else if (scribble) {
    scribble.querySelector('path').setAttribute('pathLength', '1');
}

