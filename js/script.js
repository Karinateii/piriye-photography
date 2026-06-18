// Back to Top
document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 300);
    });
    backToTop.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// Navbar: transparent → dark on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Hero slider — called by cms-loader after slides are injected
let _sliderInterval;

window.initSlider = function () {
  const list  = document.querySelector('.slider .list');
  const next  = document.getElementById('next');
  const prev  = document.getElementById('prev');
  if (!list || !next || !prev) return;

  const items = [...list.querySelectorAll('.item')];
  const count = items.length;
  if (!count) return;

  let active = 0;

  // Wire blur backgrounds to each slide's image
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

// Auto-init if slides are already in the DOM (static / fallback)
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelectorAll('.slider .list .item').length > 0) {
    window.initSlider();
  }
});
