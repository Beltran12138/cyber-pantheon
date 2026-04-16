/**
 * 赛博先贤祠 — 核心交互
 * 数据加载 → 渲染 → 滚动动画 → 弹窗
 */
(function () {
  'use strict';

  let figuresData = [];
  let poetryData = [];
  let currentFilter = 'all';

  // ==================== Data Loading ====================
  async function loadData() {
    const [figRes, poetRes] = await Promise.all([
      fetch('data/figures.json'),
      fetch('data/poetry.json')
    ]);
    figuresData = await figRes.json();
    poetryData = await poetRes.json();
  }

  // ==================== Hero Poem Typewriter ====================
  function startHeroPoem() {
    const container = document.getElementById('heroPoem');
    if (!container || poetryData.length === 0) return;

    const poem = poetryData[0]; // 《侠客行》
    const selectedLines = [
      poem.lines[0], poem.lines[1],
      poem.lines[2], poem.lines[3],
      poem.lines[10], poem.lines[11]
    ];

    selectedLines.forEach((line, i) => {
      const el = document.createElement('div');
      el.className = 'poem-line';
      if (line === poem.lines[10]) el.classList.add('highlight');
      el.textContent = line;
      container.appendChild(el);

      setTimeout(() => el.classList.add('visible'), 2000 + i * 500);
    });
  }

  // ==================== Timeline Nav ====================
  function renderTimeline() {
    const nav = document.getElementById('timelineNav');
    if (!nav) return;

    // Collect unique eras
    const eraMap = new Map();
    figuresData.forEach(g => {
      const key = g.era;
      if (!eraMap.has(key)) eraMap.set(key, { era: g.era, count: 0 });
      eraMap.get(key).count += g.figures.length;
    });

    // "All" tag
    const allTag = document.createElement('button');
    allTag.className = 'era-tag active';
    allTag.innerHTML = `全部 <span class="era-count">${figuresData.reduce((s, g) => s + g.figures.length, 0)}</span>`;
    allTag.addEventListener('click', () => filterByEra('all', allTag));
    nav.appendChild(allTag);

    eraMap.forEach(({ era, count }) => {
      const tag = document.createElement('button');
      tag.className = 'era-tag';
      tag.innerHTML = `${era} <span class="era-count">${count}</span>`;
      tag.addEventListener('click', () => filterByEra(era, tag));
      nav.appendChild(tag);
    });
  }

  function filterByEra(era, activeTag) {
    currentFilter = era;

    // Update active state
    document.querySelectorAll('.era-tag').forEach(t => t.classList.remove('active'));
    activeTag.classList.add('active');

    // Filter cards
    document.querySelectorAll('.group-card').forEach(card => {
      const cardEra = card.dataset.era;
      if (era === 'all' || cardEra === era) {
        card.style.display = '';
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.remove('visible');
        setTimeout(() => card.style.display = 'none', 400);
      }
    });
  }

  // ==================== Pantheon Cards ====================
  function renderPantheon() {
    const grid = document.getElementById('pantheonGrid');
    if (!grid) return;

    figuresData.forEach((group, idx) => {
      const card = document.createElement('div');
      card.className = 'group-card';
      card.dataset.era = group.era;
      card.dataset.id = group.id;

      // Representative quote
      const repQuote = group.figures[0].quote || group.figures[0].desc;

      card.innerHTML = `
        <div class="card-number">${String(group.id).padStart(2, '0')}</div>
        <div class="card-glow"></div>
        <div class="card-era">${group.era} · ${group.year}</div>
        <div class="card-group-name">${group.group}</div>
        <div class="card-figures">
          ${group.figures.map(f => `
            <div class="card-figure">
              <span class="figure-name">${f.name}</span>
              <span class="figure-title">${f.title}</span>
            </div>
          `).join('')}
        </div>
        <div class="card-quote">${repQuote}</div>
      `;

      // Mouse glow tracking
      const glow = card.querySelector('.card-glow');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left - 100) + 'px';
        glow.style.top = (e.clientY - rect.top - 100) + 'px';
      });

      card.addEventListener('click', () => openModal(group));

      grid.appendChild(card);
    });
  }

  // ==================== Poetry Wall ====================
  function renderPoetry() {
    const wall = document.getElementById('poetryWall');
    if (!wall) return;

    poetryData.forEach((poem, idx) => {
      const piece = document.createElement('div');
      piece.className = 'poetry-piece';

      const linesHtml = poem.lines.map(line => {
        if (line === '') return '<div class="poetry-line empty-line"></div>';
        const isHL = poem.highlight && line.includes(poem.highlight);
        return `<div class="poetry-line${isHL ? ' is-highlight' : ''}">${line}</div>`;
      }).join('');

      piece.innerHTML = `
        <div class="poetry-meta">
          <div class="poetry-type">${poem.type}</div>
          <div class="poetry-title-line">${poem.title}</div>
          <div class="poetry-author">${poem.dynasty} · ${poem.author}</div>
        </div>
        <div class="poetry-body">
          ${linesHtml}
        </div>
        ${idx < poetryData.length - 1 ? '<div class="poetry-divider" style="margin-top:40px;"></div>' : ''}
      `;

      wall.appendChild(piece);
    });
  }

  // ==================== Modal ====================
  function openModal(group) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    if (!overlay || !content) return;

    content.innerHTML = `
      <div class="modal-era-badge">${group.era} · ${group.year}</div>
      <div class="modal-group-title">${group.group}</div>
      ${group.figures.map(f => `
        <div class="modal-figure">
          <div class="modal-figure-name">${f.name}${f.fullName !== f.name ? ` <span style="color:var(--text-muted);font-size:0.85rem;font-weight:400">${f.fullName}</span>` : ''}</div>
          <div class="modal-figure-title">${f.title}</div>
          <div class="modal-figure-years">${f.born}${f.died ? ' — ' + f.died : ' — 至今'}</div>
          <div class="modal-figure-desc">${f.desc}</div>
          <div class="modal-figure-quote">${f.quote}</div>
        </div>
      `).join('')}
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ==================== Scroll Observer ====================
  function setupScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Observe cards with stagger
    document.querySelectorAll('.group-card').forEach((card, i) => {
      card.style.transitionDelay = `${(i % 6) * 0.08}s`;
      observer.observe(card);
    });

    // Observe poetry pieces
    document.querySelectorAll('.poetry-piece').forEach((piece, i) => {
      piece.style.transitionDelay = `${i * 0.15}s`;
      observer.observe(piece);
    });

    // Observe section headers
    document.querySelectorAll('.section-header').forEach(header => {
      header.classList.add('fade-in');
      observer.observe(header);
    });
  }

  // ==================== Scroll Hint Hide ====================
  function setupScrollHintHide() {
    const hint = document.getElementById('scrollHint');
    if (!hint) return;
    let hidden = false;
    window.addEventListener('scroll', () => {
      if (!hidden && window.scrollY > 100) {
        hint.style.opacity = '0';
        hint.style.transform = 'translateY(20px)';
        hint.style.transition = 'opacity 0.5s, transform 0.5s';
        hidden = true;
      }
    }, { passive: true });
  }

  // ==================== Init ====================
  async function init() {
    await loadData();
    startHeroPoem();
    renderTimeline();
    renderPantheon();
    renderPoetry();
    setupScrollObserver();
    setupScrollHintHide();

    // Modal events
    document.getElementById('modalClose')?.addEventListener('click', closeModal);
    document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
