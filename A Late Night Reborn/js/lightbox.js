/* Lightbox — click any .section-img to enlarge */
(function () {
  var overlay  = document.getElementById('lightbox');
  if (!overlay) return;

  var lbImg    = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('lightbox-close');

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.section-img').forEach(function (el) {
    el.addEventListener('click', function () { open(el.src, el.alt); });
  });

  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    close();
  });
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
}());
