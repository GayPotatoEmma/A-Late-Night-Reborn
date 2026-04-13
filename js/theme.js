(function () {
  var STORAGE_KEY = 'alnr-theme';
  var html = document.documentElement;

  function applyTheme(theme, animate) {
    if (animate) {
      html.classList.add('theme-transitioning');
      setTimeout(function () {
        html.classList.remove('theme-transitioning');
      }, 350);
    }
    html.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '\u2600' : '\u263e';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  applyTheme(html.getAttribute('data-theme') || 'dark', false);

  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var next = (html.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }
})();
