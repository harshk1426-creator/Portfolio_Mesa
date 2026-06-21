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

// AI orbit — show node detail in center card on hover
const orbitCenter = document.getElementById('aiOrbitCenter');
const orbitIdle   = document.getElementById('aiOrbitIdle');
const orbitDetail = document.getElementById('aiOrbitDetail');

if (orbitCenter) {
  let hideTimer = null;

  function showOrbitDetail(wrap) {
    clearTimeout(hideTimer);
    document.getElementById('aiPopupTag').textContent   = wrap.dataset.tag;
    document.getElementById('aiPopupTitle').textContent = wrap.dataset.title;
    document.getElementById('aiPopupDesc').textContent  = wrap.dataset.desc;
    document.getElementById('aiPopupBtn').href          = wrap.dataset.loom;
    orbitIdle.style.display   = 'none';
    orbitDetail.style.display = 'flex';
  }

  function scheduleOrbitReset() {
    hideTimer = setTimeout(() => {
      orbitIdle.style.display   = 'flex';
      orbitDetail.style.display = 'none';
    }, 150);
  }

  document.querySelectorAll('.ai-node-wrap').forEach(wrap => {
    wrap.addEventListener('mouseenter', () => showOrbitDetail(wrap));
    wrap.addEventListener('mouseleave', scheduleOrbitReset);
  });

  orbitCenter.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  orbitCenter.addEventListener('mouseleave', scheduleOrbitReset);
}

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
