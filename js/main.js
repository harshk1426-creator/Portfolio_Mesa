// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// Active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// Scroll fade-up animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


// Custom cursor
const cursorDot  = document.createElement('div');
const cursorRing = document.createElement('div');
cursorDot.className  = 'cursor-dot';
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

  // Spawn a dust particle on every move
  spawnDust(mouseX, mouseY);
});

// Lazy-follow ring via rAF
(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateRing);
})();

// Grow ring on clickable elements
document.querySelectorAll('a, button, [class*="cs-tile"]').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-ring--hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-ring--hover'));
});

// AI Workflow modal
const aiAgents = [
  {
    title: 'Instagram Auditor',
    tag: 'Social Media',
    desc: "An AI agent that analyses an Instagram profile's content, engagement rates, posting patterns, and audience signals to generate a comprehensive audit report with actionable recommendations.",
    loom: 'https://www.loom.com/share/0a87caac58aa4b19910358daf4d7ec9a'
  },
  {
    title: 'Trend-based Notification Generator',
    tag: 'Content',
    desc: 'Automatically detects trending topics relevant to a brand and generates timely, personalised push notifications or messages - keeping audiences engaged with minimal manual effort.',
    loom: 'https://www.loom.com/share/b1d49808c2894594a07eae59274eff8b'
  },
  {
    title: 'Amazon Review Scraper',
    tag: 'E-Commerce',
    desc: 'Scrapes and analyses Amazon product reviews at scale, extracting sentiment, recurring pain points, and feature requests - turning raw reviews into structured competitive intelligence.',
    loom: 'https://www.loom.com/share/acd0e05b573e474e8a1d4c8194d3711e'
  },
  {
    title: 'Automated Invoice Processor',
    tag: 'Finance Ops',
    desc: 'Reads, extracts, and categorises invoice data automatically - eliminating manual data entry, reducing errors, and feeding structured outputs directly into accounting or ERP workflows.',
    loom: 'https://www.loom.com/share/75bfc85659074923bbd9a77d81e704a0'
  },
  {
    title: 'Financial Analyst',
    tag: 'Finance',
    desc: 'An AI agent that ingests financial data (P&L, balance sheets, cash flows) and generates analysis reports, highlights anomalies, and surfaces key ratios - acting as an always-on analyst.',
    loom: 'https://www.loom.com/share/75bfc85659074923bbd9a77d81e704a0'
  }
];

const aiModal      = document.getElementById('aiModal');
const aiModalClose = document.getElementById('aiModalClose');

document.querySelectorAll('.ai-node').forEach(node => {
  node.addEventListener('click', () => {
    const idx   = parseInt(node.dataset.index, 10);
    const agent = aiAgents[idx];
    document.getElementById('aiModalTag').textContent   = agent.tag;
    document.getElementById('aiModalTitle').textContent = agent.title;
    document.getElementById('aiModalDesc').textContent  = agent.desc;
    document.getElementById('aiModalBtn').href          = agent.loom;
    aiModal.classList.add('open');
  });
});

if (aiModalClose) aiModalClose.addEventListener('click', () => aiModal.classList.remove('open'));
if (aiModal) aiModal.addEventListener('click', e => { if (e.target === aiModal) aiModal.classList.remove('open'); });

// Dust / texture trail
function spawnDust(x, y) {
  const d = document.createElement('div');
  d.className = 'cursor-dust';
  const offset = () => (Math.random() - 0.5) * 18;
  d.style.left = (x + offset()) + 'px';
  d.style.top  = (y + offset()) + 'px';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 600);
}
