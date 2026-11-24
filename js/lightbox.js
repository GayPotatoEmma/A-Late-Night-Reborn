/* Lightbox - click any .section-img to enlarge, click image inside lightbox to toggle full zoom */
(function () {
  var overlay  = document.getElementById('lightbox');
  if (!overlay) return;

  var lbImg    = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('lightbox-close');
  var lastTrigger = null;

  overlay.setAttribute('aria-hidden', 'true');

  function open(src, alt, triggerEl) {
    if (!src) return;
    lastTrigger = triggerEl || document.activeElement;
    lbImg.classList.remove('zoomed');
    lbImg.src = src;
    lbImg.alt = alt || '';
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    lbImg.classList.remove('zoomed');
    lbImg.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
    lastTrigger = null;
  }

  document.querySelectorAll('.section-img, .lightbox-trigger').forEach(function (el) {
    el.addEventListener('click', function () {
      var img = el.tagName === 'IMG' ? el : el.querySelector('img');
      if (img && img.src) open(img.src, img.alt, el);
    });
  });

  if (lbImg) {
    lbImg.addEventListener('click', function (e) {
      e.stopPropagation();
      lbImg.classList.toggle('zoomed');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      close();
    });
  }
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) close();
  });
}());
