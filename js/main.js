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

// Hero liquid metal magnetic effect
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const hero = canvas.parentElement;
  const ctx  = canvas.getContext('2d');

  const COLS = 28, ROWS = 18;
  const SPRING   = 0.06;
  const DAMPING  = 0.72;
  const PULL_R   = 180;   // radius of influence
  const STRENGTH = 0.38;  // how far points pull toward mouse

  let pts = [];
  let mouse = { x: -999, y: -999 };

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    init();
  }

  function init() {
    pts = [];
    const w = canvas.width, h = canvas.height;
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        const ox = (c / COLS) * w;
        const oy = (r / ROWS) * h;
        pts.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
      }
    }
  }

  function update() {
    pts.forEach(p => {
      const dx   = mouse.x - p.ox;
      const dy   = mouse.y - p.oy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const pull = Math.max(0, 1 - dist / PULL_R);
      // smooth cubic falloff
      const f = pull * pull * (3 - 2 * pull) * STRENGTH;

      const tx = p.ox + dx * f;
      const ty = p.oy + dy * f;

      p.vx += (tx - p.x) * SPRING;
      p.vy += (ty - p.y) * SPRING;
      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.x  += p.vx;
      p.y  += p.vy;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = COLS + 1;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tl = pts[r * W + c];
        const tr = pts[r * W + c + 1];
        const bl = pts[(r + 1) * W + c];
        const br = pts[(r + 1) * W + c + 1];

        // displacement magnitude at cell centre
        const cx = (tl.x + tr.x + bl.x + br.x) / 4;
        const cy = (tl.y + tr.y + bl.y + br.y) / 4;
        const ocx = (tl.ox + tr.ox + bl.ox + br.ox) / 4;
        const ocy = (tl.oy + tr.oy + bl.oy + br.oy) / 4;
        const disp = Math.sqrt((cx - ocx) ** 2 + (cy - ocy) ** 2);
        const t = Math.min(disp / (PULL_R * STRENGTH * 0.6), 1);

        // metallic sheen: lighter highlight at peak, dark edge
        const lightness = Math.round(210 - t * 60);
        const alpha     = t * 0.55;

        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.closePath();
        ctx.fillStyle   = `rgba(${lightness},${lightness},${lightness+8},${alpha})`;
        ctx.fill();

        // fine grid lines for the "mesh/metal" feel
        ctx.strokeStyle = `rgba(170,170,178,${t * 0.18})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }

    // bright specular dot at mouse centre
    if (mouse.x > 0) {
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, PULL_R * 0.35);
      grad.addColorStop(0,   'rgba(255,255,255,0.18)');
      grad.addColorStop(0.4, 'rgba(220,220,224,0.07)');
      grad.addColorStop(1,   'rgba(220,220,224,0)');
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, PULL_R * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  hero.addEventListener('mouseleave', () => {
    mouse.x = -999; mouse.y = -999;
  });

  resize();
  window.addEventListener('resize', resize);
  loop();
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
