/* ═══════════════════════════════════════════════════════
   GALLERY.JS
   Filter, sibling dimming, lightbox, swipe, keyboard nav.

   window.initGallery() is called by cms-loader.js after
   it injects photos from content/gallery.json. It is also
   auto-called on DOMContentLoaded for static/fallback items.
   ═══════════════════════════════════════════════════════ */

/* ── Static refs (never change between inits) ─────────── */
const filterBtns      = document.querySelectorAll('.filter-btn');
const grid            = document.querySelector('.gallery-grid');
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxClose   = document.getElementById('lightbox-close');
const lightboxPrev    = document.getElementById('lightbox-prev');
const lightboxNext    = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');

/* ── Dynamic state (rebuilt on every initGallery call) ── */
let galleryItems  = [];
let currentFilter = 'all';
let currentIndex  = 0;
let filterTimeout;

/* ── Helpers ─────────────────────────────────────────── */
function getVisible() {
  return galleryItems.filter(item => !item.classList.contains('hidden'));
}

function updateCounter() {
  if (!lightboxCounter) return;
  const total = getVisible().length;
  lightboxCounter.textContent =
    `${String(currentIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

/* ── Lightbox ─────────────────────────────────────────── */
function openAt(index) {
  const items = getVisible();
  if (!items.length) return;
  currentIndex = ((index % items.length) + items.length) % items.length;
  const img = items[currentIndex].querySelector('img');

  lightboxImg.style.transition = 'none';
  lightboxImg.style.transform  = 'scale(0.88)';
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateCounter();

  requestAnimationFrame(() => requestAnimationFrame(() => {
    lightboxImg.style.transition = '';
    lightboxImg.style.transform  = 'scale(1)';
  }));
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Filter (uses galleryItems — updated by initGallery) */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    if (filter === currentFilter) return;
    currentFilter = filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const visible = galleryItems.filter(item => !item.classList.contains('hidden'));
    visible.forEach((item, i) => {
      item.style.transitionDelay = `${i * 18}ms`;
      item.classList.add('filter-exit');
    });

    const exitDuration = Math.min(visible.length * 18 + 160, 380);
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      let enterIndex = 0;
      galleryItems.forEach(item => {
        item.classList.remove('filter-exit');
        item.style.transitionDelay = '';
        const show = filter === 'all' || item.dataset.category === filter;
        if (show) {
          item.classList.remove('hidden');
          const delay = enterIndex++ * 55;
          setTimeout(() => {
            item.classList.add('filter-enter');
            setTimeout(() => item.classList.remove('filter-enter'), 500);
          }, delay);
        } else {
          item.classList.add('hidden');
        }
      });
    }, exitDuration);
  });
});

/* ── Sibling dimming (event delegation — no reinit needed) */
grid?.addEventListener('mouseover', e => {
  const item = e.target.closest('.gallery-item');
  if (!item) return;
  galleryItems.forEach(gi =>
    gi.classList.toggle('sibling-dim', gi !== item && !gi.classList.contains('hidden')));
});

grid?.addEventListener('mouseleave', () => {
  galleryItems.forEach(gi => gi.classList.remove('sibling-dim'));
});

/* ── Lightbox controls (static — no reinit needed) ───── */
lightboxPrev?.addEventListener('click', () => openAt(currentIndex - 1));
lightboxNext?.addEventListener('click', () => openAt(currentIndex + 1));
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  openAt(currentIndex - 1);
  if (e.key === 'ArrowRight') openAt(currentIndex + 1);
  if (e.key === 'Escape')     closeLightbox();
});

let touchStartX = 0;
lightbox?.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
lightbox?.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? openAt(currentIndex + 1) : openAt(currentIndex - 1);
});

/* ── initGallery ──────────────────────────────────────── *
 * Called by cms-loader after it injects gallery items,   *
 * and auto-called on DOMContentLoaded for static items.  */
window.initGallery = function initGallery() {
  galleryItems = [...document.querySelectorAll('.gallery-item')];

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('hidden')) return;
      openAt(getVisible().indexOf(item));
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelectorAll('.gallery-item').length > 0) {
    window.initGallery();
  }
});
