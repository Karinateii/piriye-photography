/* ── Gallery Filter ── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
    });
  });
});

/* ── Lightbox with prev / next navigation ── */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentIndex = 0;

function getVisible() {
  return [...document.querySelectorAll('.gallery-item:not(.hidden)')];
}

function openAt(index) {
  const items = getVisible();
  if (!items.length) return;
  currentIndex = ((index % items.length) + items.length) % items.length;
  const img = items[currentIndex].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    if (item.classList.contains('hidden')) return;
    openAt(getVisible().indexOf(item));
  });
});

lightboxPrev.addEventListener('click', () => openAt(currentIndex - 1));
lightboxNext.addEventListener('click', () => openAt(currentIndex + 1));
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  openAt(currentIndex - 1);
  if (e.key === 'ArrowRight') openAt(currentIndex + 1);
  if (e.key === 'Escape')     closeLightbox();
});
