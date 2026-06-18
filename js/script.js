/* ── Back to Top ── */
document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 300);
  });
  backToTop.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ── Navbar: transparent → dark on scroll ── */
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Mobile Sidebar ── */
document.addEventListener('DOMContentLoaded', () => {
  const sidebar  = document.querySelector('.sidebar');
  const toggle   = document.getElementById('toggle-sidebar');
  const closeBtn = document.getElementById('close-sidebar');

  toggle?.addEventListener('click', e => {
    e.preventDefault();
    if (sidebar) sidebar.style.display = 'flex';
  });

  closeBtn?.addEventListener('click', e => {
    e.preventDefault(); // stop href="#" scrolling the page to top
    if (sidebar) sidebar.style.display = 'none';
  });

  // Close sidebar automatically when any nav link inside it is tapped
  sidebar?.querySelectorAll('a:not(#close-sidebar)').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.style.display = 'none';
    });
  });
});

/* ── Hero Slider (called by cms-loader after slides are injected) ── */
let _sliderInterval;

window.initSlider = function () {
  const list = document.querySelector('.slider .list');
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');
  if (!list || !next || !prev) return;

  const items = [...list.querySelectorAll('.item')];
  const count = items.length;
  if (!count) return;

  let active = 0;

  items.forEach(item => {
    const img  = item.querySelector('img');
    const blur = item.querySelector('.slide-blur');
    if (img && blur) blur.style.backgroundImage = `url('${img.getAttribute('src')}')`;
  });

  clearInterval(_sliderInterval);

  function show(index) {
    items[active].classList.remove('active');
    active = ((index % count) + count) % count;
    items[active].classList.add('active');
    clearInterval(_sliderInterval);
    _sliderInterval = setInterval(() => show(active + 1), 6000);
  }

  next.onclick = () => show(active + 1);
  prev.onclick = () => show(active - 1);

  _sliderInterval = setInterval(() => show(active + 1), 6000);
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelectorAll('.slider .list .item').length > 0) {
    window.initSlider();
  }
});
