/* ══════════════════════════════════════
   EXPERIENCE.JS — Premium interactions
   Loader · Cursor · Progress · Reveal
   ══════════════════════════════════════ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Page Loader ── */
(function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader || prefersReduced) {
    if (loader) loader.style.display = 'none';
    return;
  }

  const finish = () => {
    loader.classList.add('done');
    document.body.classList.add('page-ready');
    loader.addEventListener('transitionend', () => {
      loader.style.display = 'none';
    }, { once: true });
  };

  if (document.readyState === 'complete') {
    setTimeout(finish, 480);
  } else {
    window.addEventListener('load', () => setTimeout(finish, 480));
  }
})();

/* ── Scroll Progress Bar ── */
(function initProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }, { passive: true });
})();

/* ── Custom Cursor (desktop/fine pointer only) ── */
(function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches || prefersReduced) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  (function animateRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Expand ring over interactive elements
  document.addEventListener('mouseover', e => {
    const interactive = e.target.closest(
      'a, button, input, textarea, select, .gallery-item, .filter-btn, .service-box'
    );
    ring.classList.toggle('expanded', !!interactive);
  });

  // Dim dot inside text inputs
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('dimmed'));
    el.addEventListener('mouseleave', () => dot.classList.remove('dimmed'));
  });
})();

/* ── Scroll Reveal ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (prefersReduced) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  // Apply data-delay values
  els.forEach(el => {
    if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + 's';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  els.forEach(el => observer.observe(el));
})();
