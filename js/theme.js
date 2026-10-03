(function () {
  var STORAGE_KEY = 'alnr-theme';
  var html = document.documentElement;

  var THEMES = {
    'dark': {
      name: 'Dark',
      icon: '\u263e',
      badge: ''
    },
    'dark-lite': {
      name: 'Dark',
      icon: '\u263d',
      badge: 'Lite'
    },
    'light': {
      name: 'Light',
      icon: '\u2600',
      badge: ''
    },
    'light-lite': {
      name: 'Light',
      icon: '\u263c',
      badge: 'Lite'
    }
  };

  function normalizeTheme(theme) {
    return THEMES[theme] ? theme : 'dark';
  }

  function applyTheme(theme, animate) {
    theme = normalizeTheme(theme);

    if (animate) {
      html.classList.add('theme-transitioning');
      setTimeout(function () {
        html.classList.remove('theme-transitioning');
      }, 350);
    }

    html.setAttribute('data-theme', theme);

    var info = THEMES[theme];
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = info.icon;
      btn.setAttribute('aria-label', 'Theme: ' + info.name + (info.badge ? ' (' + info.badge + ')' : '') + ' (Click to change)');
    }

    var options = document.querySelectorAll('.theme-option');
    options.forEach(function (opt) {
      if (opt.getAttribute('data-theme-val') === theme) {
        opt.classList.add('active');
        opt.setAttribute('aria-selected', 'true');
      } else {
        opt.classList.remove('active');
        opt.setAttribute('aria-selected', 'false');
      }
    });

    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  var initialTheme = normalizeTheme(savedTheme || html.getAttribute('data-theme') || 'dark');
  applyTheme(initialTheme, false);

  function setupThemeDropdown() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    if (document.getElementById('theme-dropdown-menu')) return;

    var wrapper = btn.closest('.theme-menu-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'theme-menu-wrapper';
      btn.parentNode.insertBefore(wrapper, btn);
      wrapper.appendChild(btn);
    }

    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');

    var dropdown = document.createElement('div');
    dropdown.className = 'theme-dropdown-menu';
    dropdown.id = 'theme-dropdown-menu';
    dropdown.setAttribute('role', 'menu');
    dropdown.setAttribute('aria-label', 'Theme options');

    var htmlContent = '';
    var order = ['dark', 'dark-lite', 'light', 'light-lite'];
    order.forEach(function (key, idx) {
      if (idx === 2) {
        htmlContent += '<div class="theme-dropdown-sep"></div>';
      }
      var t = THEMES[key];
      var badgeHtml = t.badge ? '<span class="theme-pill">' + t.badge + '</span>' : '';
      htmlContent += '\
        <button type="button" class="theme-option" data-theme-val="' + key + '" role="menuitem">\
          <span class="theme-option-icon">' + t.icon + '</span>\
          <span class="theme-option-title">' + t.name + (badgeHtml ? ' ' + badgeHtml : '') + '</span>\
          <span class="theme-option-check">&#10003;</span>\
        </button>';
    });

    dropdown.innerHTML = htmlContent;
    wrapper.appendChild(dropdown);

    function toggleDropdown(open) {
      var isOpen = typeof open === 'boolean' ? open : !wrapper.classList.contains('open');
      if (isOpen) {
        wrapper.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        wrapper.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDropdown();
    });

    dropdown.addEventListener('click', function (e) {
      var option = e.target.closest('.theme-option');
      if (!option) return;
      var selectedTheme = option.getAttribute('data-theme-val');
      if (selectedTheme) {
        applyTheme(selectedTheme, true);
        toggleDropdown(false);
      }
    });

    document.addEventListener('click', function (e) {
      if (!wrapper.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        toggleDropdown(false);
      }
    });

    var current = html.getAttribute('data-theme') || 'dark';
    applyTheme(current, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThemeDropdown);
  } else {
    setupThemeDropdown();
  }
})();
