/* ═══════════════════════════════════════════════════════
   CMS-LOADER — reads from /content/*.json and injects
   content into the page without touching source HTML.
   Called by every page; only updates elements that exist.
   ═══════════════════════════════════════════════════════ */

const CONTENT = '/content';

async function fetchJSON(file) {
  try {
    const res = await fetch(`${CONTENT}/${file}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/* ── Gallery ──────────────────────────────────────────── */
async function loadGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const data = await fetchJSON('gallery.json');
  if (!data?.photos?.length) return;

  const labels = {
    portrait: 'Portrait', wedding: 'Wedding', engagement: 'Engagement',
    event: 'Events', content: 'Content'
  };

  grid.innerHTML = data.photos.map((photo, i) => {
    const delay = ((i % 3) * 0.08).toFixed(2);
    const cat   = photo.category || 'portrait';
    return `
      <div class="gallery-item reveal" data-category="${cat}" data-delay="${delay}">
        <img src="${photo.image}" alt="${photo.alt || photo.caption || ''}">
        <div class="gallery-overlay">
          <span class="overlay-category">${labels[cat] || cat}</span>
          <span class="overlay-view">View image</span>
        </div>
      </div>`;
  }).join('');

  // Re-init gallery interactions with the new DOM nodes
  if (typeof window.initGallery === 'function') window.initGallery();
}

/* ── Testimonials ─────────────────────────────────────── */
async function loadTestimonials() {
  const grid = document.querySelector('.testimonials-grid');
  if (!grid) return;

  const data = await fetchJSON('testimonials.json');
  if (!data?.testimonials?.length) return;

  grid.innerHTML = data.testimonials.map((t, i) => `
    <blockquote class="testimonial-card reveal" data-delay="${(i * 0.12).toFixed(2)}">
      <p>${t.quote}</p>
      <footer>
        <span class="t-name">${t.name}</span>
        <span class="t-type">${t.type}</span>
      </footer>
    </blockquote>`).join('');
}

/* ── Settings: contact info + social links ────────────── */
async function loadSettings() {
  const data = await fetchJSON('settings.json');
  if (!data) return;

  const setText = (sel, val) => {
    if (!val || val === 'To be updated') return;
    document.querySelectorAll(sel).forEach(el => { el.textContent = val; });
  };
  const setHref = (sel, href) => {
    if (!href) return;
    document.querySelectorAll(sel).forEach(el => { el.href = href; });
  };

  setText('[data-cms="email"]',    data.email);
  setText('[data-cms="phone"]',    data.phone);
  setText('[data-cms="location"]', data.location);

  setHref('[data-social="instagram"]', data.instagram);
  setHref('[data-social="twitter"]',   data.twitter);
  setHref('[data-social="youtube"]',   data.youtube);
  setHref('[data-social="linkedin"]',  data.linkedin);
}

/* ── Packages / Prices ────────────────────────────────── */
async function loadPackages() {
  const data = await fetchJSON('packages.json');
  if (!data) return;

  const map = {
    single:            '#single .price-value',
    double:            '#double .price-value',
    engagement:        '#engagement .price-value',
    wedding:           '#wedding .price-value',
    event_photography: '#event-photography .price-value',
    event_videography: '#event-videography .price-value',
    content_creation:  '#content-creation .price-value',
  };

  Object.entries(map).forEach(([key, sel]) => {
    const val = data[key];
    if (!val || val === '$XXX') return;
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  });
}

/* ── Boot ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadGallery();
  loadTestimonials();
  loadSettings();
  loadPackages();
});
