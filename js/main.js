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

// Hero canvas ripple effect
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const hero  = canvas.parentElement;
  const ctx   = canvas.getContext('2d');
  let ripples = [];
  let animId  = null;

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 0, alpha: 0.45 });
    if (ripples.length === 1) animate();
  });

  hero.addEventListener('mouseleave', () => {
    ripples = [];
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ripples = ripples.filter(r => r.alpha > 0.01);
    ripples.forEach(r => {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(160,160,160,${r.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      r.r     += 3.5;
      r.alpha *= 0.92;
    });
    if (ripples.length) animId = requestAnimationFrame(animate);
    else { animId = null; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }
})();

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
