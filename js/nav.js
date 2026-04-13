(function () {
  var toggle  = document.getElementById('nav-toggle');
  var panel   = document.getElementById('nav-panel');
  var overlay = document.getElementById('nav-overlay');
  var close   = document.getElementById('nav-close');

  function openNav() {
    if (!panel) return;
    panel.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    if (!panel) return;
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle)  toggle.addEventListener('click', openNav);
  if (close)   close.addEventListener('click', closeNav);
  if (overlay) overlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  document.querySelectorAll('.nav-sub-link, .nav-page-link, .nav-home-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  var current = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-page-link, .nav-home-link').forEach(function (link) {
    var href = link.getAttribute('href').split('#')[0];
    if (href === current) link.classList.add('nav-current');
  });
})();
