/**
 * 赛博先贤祠 — 粒子系统
 * 金色+青色双色粒子 + 连线效果
 */
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, mouseX = -1000, mouseY = -1000;
  const PARTICLE_COUNT_BASE = 80;
  const CONNECTION_DIST = 120;
  const MOUSE_DIST = 160;

  const COLORS = [
    { r: 212, g: 168, b: 83 },   // gold
    { r: 212, g: 168, b: 83 },   // gold (weighted)
    { r: 0, g: 240, b: 255 },    // cyan
    { r: 180, g: 160, b: 120 },  // dim gold
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = Math.random() * 2 + 0.5;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size,
      baseSize: size,
      color,
      alpha: Math.random() * 0.5 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    const count = Math.min(PARTICLE_COUNT_BASE, Math.floor((width * height) / 15000));
    particles = Array.from({ length: count }, createParticle);
  }

  function update(time) {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Twinkle
      p.alpha = p.baseAlpha + Math.sin(time * p.twinkleSpeed + p.twinkleOffset) * 0.15;

      // Mouse interaction: gentle push
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const force = (1 - dist / MOUSE_DIST) * 0.015;
        p.vx += dx * force;
        p.vy += dy * force;
      }

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.8) {
        p.vx *= 0.98;
        p.vy *= 0.98;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.08;
          ctx.strokeStyle = `rgba(212, 168, 83, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      const { r, g, b } = p.color;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Glow
      if (p.size > 1.2) {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.15})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function loop(time) {
    update(time);
    draw();
    requestAnimationFrame(loop);
  }

  // Events
  window.addEventListener('resize', () => {
    resize();
    // Re-populate if needed
    const target = Math.min(PARTICLE_COUNT_BASE, Math.floor((width * height) / 15000));
    while (particles.length < target) particles.push(createParticle());
    while (particles.length > target) particles.pop();
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  init();
  requestAnimationFrame(loop);
})();
