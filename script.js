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
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
});

// Hero slider
let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let countItem = items.length;
let itemActive = 0;

if (next && prev && countItem > 0) {
  let refreshInterval = setInterval(() => next.click(), 6000);

  next.onclick = () => {
    itemActive = (itemActive + 1) % countItem;
    showSlider();
  };

  prev.onclick = () => {
    itemActive = (itemActive - 1 + countItem) % countItem;
    showSlider();
  };

  function showSlider() {
    document.querySelector('.slider .list .item.active').classList.remove('active');
    items[itemActive].classList.add('active');
    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => next.click(), 6000);
  }
}

// Intro fade-in is now handled by experience.js via .reveal class

// Set blurred background on each slide from its own image
document.querySelectorAll('.slider .list .item').forEach(item => {
  const img = item.querySelector('img');
  if (img) {
    item.style.setProperty('--slide-img', `url('${img.getAttribute('src')}')`);
  }
});
