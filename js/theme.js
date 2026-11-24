(function () {
  var STORAGE_KEY = 'alnr-theme';
  var UI_STORAGE_KEY = 'alnr-ui';
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

    var isLight = theme.indexOf('light') === 0;
    var isLite = theme.indexOf('lite') !== -1;

    var info = THEMES[theme];
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = isLight
        ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
        : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      btn.setAttribute('aria-label', 'Theme: ' + info.name + (info.badge ? ' (' + info.badge + ')' : '') + ' (Click to change)');
    }

    document.querySelectorAll('.theme-mode-btn').forEach(function (opt) {
      var active = opt.getAttribute('data-theme-mode') === (isLight ? 'light' : 'dark');
      opt.classList.toggle('active', active);
      opt.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    var perfToggle = document.getElementById('theme-perf-toggle');
    if (perfToggle) {
      perfToggle.classList.toggle('active', isLite);
      perfToggle.setAttribute('aria-checked', isLite ? 'true' : 'false');
    }

    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}

    window.dispatchEvent(new CustomEvent('alnr:themechange', { detail: { theme: theme } }));
  }

  function normalizeUi(ui) {
    return ui === 'refresh' ? 'refresh' : 'classic';
  }

  function applyUi(ui, animate) {
    ui = normalizeUi(ui);
    if (animate) {
      html.classList.add('theme-transitioning');
      setTimeout(function () {
        html.classList.remove('theme-transitioning');
      }, 320);
    }

    if (ui === 'refresh') {
      html.setAttribute('data-ui', 'refresh');
    } else {
      html.removeAttribute('data-ui');
    }

    var refreshToggle = document.getElementById('theme-refresh-toggle');
    if (refreshToggle) {
      var isRefresh = ui === 'refresh';
      refreshToggle.classList.toggle('active', isRefresh);
      refreshToggle.setAttribute('aria-checked', isRefresh ? 'true' : 'false');
    }

    try { localStorage.setItem(UI_STORAGE_KEY, ui); } catch (e) {}
    window.dispatchEvent(new CustomEvent('alnr:uichange', { detail: { ui: ui } }));
  }

  window.alnrTheme = {
    get: function () {
      return normalizeTheme(html.getAttribute('data-theme') || 'dark');
    },
    set: function (theme) {
      applyTheme(theme, true);
    },
    getUi: function () {
      return normalizeUi(html.getAttribute('data-ui') || 'classic');
    },
    setUi: function (ui) {
      applyUi(ui, true);
    },
    themes: THEMES
  };

  var savedTheme = null;
  var savedUi = null;
  try {
    savedTheme = localStorage.getItem(STORAGE_KEY);
    savedUi = localStorage.getItem(UI_STORAGE_KEY);
  } catch (e) {}
  var initialTheme = normalizeTheme(savedTheme || html.getAttribute('data-theme') || 'dark');
  var initialUi = normalizeUi(savedUi || html.getAttribute('data-ui') || 'classic');
  applyTheme(initialTheme, false);
  applyUi(initialUi, false);

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

    dropdown.innerHTML =
      '<div class="popover-theme-grid">' +
        '<button type="button" class="popover-theme-btn theme-mode-btn" data-theme-mode="dark">\u263e Dark</button>' +
        '<button type="button" class="popover-theme-btn theme-mode-btn" data-theme-mode="light">\u2600 Light</button>' +
      '</div>' +
      '<button type="button" class="popover-perf-row" id="theme-perf-toggle" role="switch" aria-checked="false">' +
        '<span class="popover-perf-label">Performance Mode</span>' +
        '<span class="popover-switch" aria-hidden="true"><span class="popover-switch-thumb"></span></span>' +
      '</button>' +
      '<button type="button" class="popover-perf-row" id="theme-refresh-toggle" role="switch" aria-checked="false">' +
        '<span class="popover-perf-label">Refresh <span class="popover-beta-pill">Beta</span></span>' +
        '<span class="popover-switch" aria-hidden="true"><span class="popover-switch-thumb"></span></span>' +
      '</button>';
    wrapper.appendChild(dropdown);

    function toggleDropdown(open) {
      var isOpen = typeof open === 'boolean' ? open : !wrapper.classList.contains('open');
      if (isOpen) {
        if (window.alnrHeaderProfile && typeof window.alnrHeaderProfile.close === 'function') {
          window.alnrHeaderProfile.close();
        }
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
      e.stopPropagation();
      var modeBtn = e.target.closest('.theme-mode-btn');
      if (modeBtn) {
        var cur = normalizeTheme(html.getAttribute('data-theme') || 'dark');
        var isLite = cur.indexOf('lite') !== -1;
        var mode = modeBtn.getAttribute('data-theme-mode') === 'light' ? 'light' : 'dark';
        applyTheme(mode + (isLite ? '-lite' : ''), true);
        return;
      }
      var perfBtn = e.target.closest('#theme-perf-toggle');
      if (perfBtn) {
        var cur2 = normalizeTheme(html.getAttribute('data-theme') || 'dark');
        var isLight = cur2.indexOf('light') === 0;
        var isLite2 = cur2.indexOf('lite') !== -1;
        applyTheme((isLight ? 'light' : 'dark') + (!isLite2 ? '-lite' : ''), true);
        return;
      }
      var refreshBtn = e.target.closest('#theme-refresh-toggle');
      if (refreshBtn) {
        var curUi = normalizeUi(html.getAttribute('data-ui') || 'classic');
        applyUi(curUi === 'refresh' ? 'classic' : 'refresh', true);
      }
    });

    document.addEventListener('click', function (e) {
      if (!wrapper.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && wrapper.classList.contains('open')) {
        toggleDropdown(false);
        btn.focus();
      }
    });

    window.alnrTheme.closeDropdown = function () {
      toggleDropdown(false);
    };

    var current = html.getAttribute('data-theme') || 'dark';
    var currentUi = html.getAttribute('data-ui') || 'classic';
    applyTheme(current, false);
    applyUi(currentUi, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThemeDropdown);
  } else {
    setupThemeDropdown();
  }
})();
