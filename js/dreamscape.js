/* ============================================================================
   A Late Night Reborn - Refresh [Beta] (Dreamscape Twilight Sky Engine)
   Cleanly mountable & unmountable when toggling data-ui="refresh"
   ============================================================================ */

(function () {
  if (window.__alnrDreamscapeEngine) return;

  var path = (window.location.pathname || '').toLowerCase();
  var isSubdir = /\/(ftb|ftm|chaotic)\//.test(path);
  var rootPrefix = isSubdir ? '../' : '';

  var mounted = false;
  var mountedKind = null;
  var scrollHandler = null;
  var hashHandler = null;
  var resizeHandler = null;
  var homeTabObserver = null;
  var homeRaidCleanup = null;
  var guideTocObserver = null;
  var profileNavCleanup = null;
  var motionResizeHandler = null;
  var lastProfileUser = null;
  var lastProfileMeta = null;

  function isRefreshActive() {
    return document.documentElement.getAttribute('data-ui') === 'refresh';
  }

  function isLiteOrReduced() {
    var t = document.documentElement.getAttribute('data-theme') || '';
    if (t.indexOf('lite') !== -1) return true;
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  /* ── 1. Desktop Primary Navigation Links in Header ───────────────────────── */
  function injectDesktopNav() {
    var headerInner = document.querySelector('.site-header .header-inner');
    if (!headerInner || headerInner.querySelector('.ds-header-nav')) return;

    var discordBtn = headerInner.querySelector('.header-discord');
    var nav = document.createElement('nav');
    nav.className = 'ds-header-nav';
    nav.setAttribute('aria-label', 'Primary');

    var isSignups = path.indexOf('signups') !== -1;
    var isProfile = path.indexOf('profile') !== -1;
    var isGuides = !isSignups && !isProfile && path.indexOf('contact') === -1 && path.indexOf('privacy') === -1 && path.indexOf('dashboard') === -1;

    var isFile = window.location.protocol === 'file:';
    var links = [
      { label: 'Guides', href: isFile ? (rootPrefix + 'index.html') : '/', active: isGuides },
      { label: 'Signups', href: isFile ? (rootPrefix + 'signups.html') : '/signups', active: isSignups }
    ];

    links.forEach(function (item) {
      var a = document.createElement('a');
      a.className = 'ds-header-link' + (item.active ? ' is-active' : '');
      a.href = item.href;
      a.textContent = item.label;
      nav.appendChild(a);
    });

    var insertAnchor = headerInner.querySelector('.header-live-wrap') || discordBtn;
    if (insertAnchor) {
      headerInner.insertBefore(nav, insertAnchor);
    } else {
      headerInner.appendChild(nav);
    }
  }

  function removeDesktopNav() {
    var nav = document.querySelector('.site-header .ds-header-nav');
    if (nav && nav.parentNode) nav.parentNode.removeChild(nav);
  }

  /* ── 2. Scroll State & Subtle GPU Sky Parallax ───────────────────────────── */
  function startScrollAndParallax() {
    var ticking = false;
    var headerEl = document.querySelector('.site-header');
    var skyEl = document.querySelector('.ds-home-sky, .ds-guide-sky, .ds-signups-sky, .ds-profile-sky, .ds-secondary-sky, .ds-dashboard-sky');
    var moonLayer = document.querySelector('.ds-parallax-moon');
    var towerLayer = document.querySelector('.ds-parallax-tower');
    var midCloud = document.querySelector('.ds-parallax-cloud');

    scrollHandler = function () {
      if (ticking || !mounted) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        if (!mounted) { ticking = false; return; }
        var y = window.scrollY || window.pageYOffset || 0;
        document.body.classList.toggle('ds-scrolled', y > 28);

        var headerH = headerEl ? headerEl.offsetHeight : 64;
        var pastSky = skyEl ? (skyEl.getBoundingClientRect().bottom <= headerH + 22) : true;
        var prevPastSky = document.body.classList.contains('ds-past-sky');
        document.body.classList.toggle('ds-past-sky', pastSky);
        if (pastSky !== prevPastSky && window.alnrTheme && typeof window.alnrTheme.syncThemeColor === 'function') {
          window.alnrTheme.syncThemeColor(pastSky);
        }

        if (!isLiteOrReduced() && y < 700) {
          if (moonLayer) moonLayer.style.transform = 'translate3d(0,' + (y * 0.16).toFixed(1) + 'px,0)';
          if (towerLayer) towerLayer.style.transform = 'translate3d(0,' + (y * 0.09).toFixed(1) + 'px,0)';
          if (midCloud) midCloud.style.transform = 'translate3d(0,' + (y * 0.05).toFixed(1) + 'px,0)';
        }
        ticking = false;
      });
    };
    hashHandler = function () { setTimeout(scrollHandler, 40); };
    resizeHandler = function () { scrollHandler(); };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('hashchange', hashHandler);
    window.addEventListener('resize', resizeHandler, { passive: true });
    setTimeout(scrollHandler, 120);
    scrollHandler();
  }

  function stopScrollAndParallax() {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
      scrollHandler = null;
    }
    if (hashHandler) {
      window.removeEventListener('hashchange', hashHandler);
      hashHandler = null;
    }
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }
    document.body.classList.remove('ds-scrolled', 'ds-past-sky');
    if (window.alnrTheme && typeof window.alnrTheme.syncThemeColor === 'function') {
      window.alnrTheme.syncThemeColor(false);
    }
  }

  /* ── 3. Illustrated Twilight Sky SVGs ────────────────────────────────────── */
  function buildHomeSkySvg() {
    return (
      '<svg viewBox="0 0 1440 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="dsMoonGlow" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%" stop-color="#fdd4c9" stop-opacity="0.50"/>' +
            '<stop offset="52%" stop-color="#fdd4c9" stop-opacity="0.16"/>' +
            '<stop offset="100%" stop-color="#fdd4c9" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<radialGradient id="dsSoftStarGlow" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%" stop-color="#ebd09b" stop-opacity="0.45"/>' +
            '<stop offset="100%" stop-color="#ebd09b" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<g class="ds-parallax-moon">' +
          '<circle cx="1165" cy="222" r="195" fill="url(#dsMoonGlow)"/>' +
          '<circle cx="942" cy="148" r="46" fill="url(#dsSoftStarGlow)"/>' +
          '<g class="ds-anim-moon">' +
            '<path d="M1156 124 A98 98 0 1 0 1222 294 A75 75 0 1 1 1156 124 Z" fill="#fdd4c9"/>' +
          '</g>' +
          '<g class="ds-anim-star">' +
            '<path d="M942 122 L947 143 L968 148 L947 153 L942 174 L937 153 L916 148 L937 143 Z" fill="#ebd09b"/>' +
          '</g>' +
          '<g class="ds-anim-star-2">' +
            '<path d="M838 206 L842 219 L855 223 L842 227 L838 240 L834 227 L821 223 L834 219 Z" fill="#ebd09b" opacity="0.92"/>' +
          '</g>' +
          '<path d="M1312 138 L1315 148 L1325 151 L1315 154 L1312 164 L1309 154 L1299 151 L1309 148 Z" fill="#fdd4c9" opacity="0.9"/>' +
          '<path d="M1018 254 L1020 262 L1028 264 L1020 266 L1018 274 L1016 266 L1008 264 L1016 262 Z" fill="#fdd4c9" opacity="0.82"/>' +
          '<circle cx="710" cy="116" r="2.6" fill="#ffffff" opacity="0.78"/>' +
          '<circle cx="788" cy="96" r="2.1" fill="#ebd09b" opacity="0.82"/>' +
          '<circle cx="1048" cy="106" r="2.3" fill="#ffffff" opacity="0.74"/>' +
          '<circle cx="1296" cy="232" r="2.5" fill="#ffffff" opacity="0.78"/>' +
          '<circle cx="640" cy="172" r="2" fill="#fdd4c9" opacity="0.68"/>' +
          '<circle cx="520" cy="116" r="2.1" fill="#ffffff" opacity="0.52"/>' +
          '<circle cx="892" cy="286" r="2.1" fill="#ffffff" opacity="0.65"/>' +
          '<circle cx="1372" cy="166" r="2.2" fill="#ebd09b" opacity="0.78"/>' +
        '</g>' +
        '<g class="ds-parallax-tower">' +
          '<path d="M-40 404 Q140 326 320 384 Q510 318 710 382 Q930 312 1150 378 Q1310 330 1480 368 L1480 500 L-40 500 Z" fill="#352864" opacity="0.56"/>' +
        '</g>' +
        '<g class="ds-parallax-cloud ds-anim-cloud-slow">' +
          '<path d="M-40 428 Q115 352 270 404 Q430 340 600 400 Q780 336 980 394 Q1180 330 1480 390 L1480 500 L-40 500 Z" fill="#523f85" opacity="0.74"/>' +
          '<path d="M-40 454 Q170 394 350 438 Q560 380 780 436 Q1020 378 1260 430 Q1380 402 1480 424 L1480 500 L-40 500 Z" fill="#775ea0" opacity="0.46"/>' +
        '</g>' +
        '<path d="M0 462 Q185 404 380 450 Q585 396 815 452 Q1055 402 1265 446 Q1375 426 1440 442 L1440 502 L0 502 Z" fill="var(--ds-ground)"/>' +
      '</svg>'
    );
  }

  function buildGuideSkySvg() {
    return (
      '<svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="dsGuideMoonGlow" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%" stop-color="#fdd4c9" stop-opacity="0.46"/>' +
            '<stop offset="55%" stop-color="#fdd4c9" stop-opacity="0.14"/>' +
            '<stop offset="100%" stop-color="#fdd4c9" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<radialGradient id="dsGuideStarGlow" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%" stop-color="#ebd09b" stop-opacity="0.42"/>' +
            '<stop offset="100%" stop-color="#ebd09b" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<g class="ds-parallax-moon">' +
          '<circle cx="1158" cy="206" r="145" fill="url(#dsGuideMoonGlow)"/>' +
          '<circle cx="990" cy="166" r="36" fill="url(#dsGuideStarGlow)"/>' +
          '<g class="ds-anim-moon">' +
            '<path d="M1152 138 A68 68 0 1 0 1198 256 A53 53 0 1 1 1152 138 Z" fill="#fdd4c9" opacity="0.95"/>' +
          '</g>' +
          '<g class="ds-anim-star">' +
            '<path d="M990 146 L994 162 L1010 166 L994 170 L990 186 L986 170 L970 166 L986 162 Z" fill="#ebd09b"/>' +
          '</g>' +
          '<g class="ds-anim-star-2">' +
            '<path d="M904 224 L907 234 L917 237 L907 240 L904 250 L901 240 L891 237 L901 234 Z" fill="#fdd4c9" opacity="0.86"/>' +
          '</g>' +
          '<path d="M1274 156 L1276 164 L1284 166 L1276 168 L1274 176 L1272 168 L1264 166 L1272 164 Z" fill="#ebd09b" opacity="0.88"/>' +
          '<circle cx="852" cy="146" r="2.2" fill="#ffffff" opacity="0.75"/>' +
          '<circle cx="1072" cy="126" r="2" fill="#ffffff" opacity="0.72"/>' +
          '<circle cx="1292" cy="230" r="2.3" fill="#ffffff" opacity="0.78"/>' +
          '<circle cx="1048" cy="252" r="2" fill="#ebd09b" opacity="0.75"/>' +
        '</g>' +
        '<path d="M0 368 Q260 320 520 358 Q840 314 1180 356 Q1330 338 1440 352 L1440 422 L0 422 Z" fill="#4f3d80" opacity="0.46"/>' +
        '<path d="M0 382 Q260 336 540 374 Q880 330 1220 370 Q1350 356 1440 368 L1440 424 L0 424 Z" fill="var(--ds-ground)"/>' +
      '</svg>'
    );
  }

  function buildBannerSkySvg() {
    return (
      '<svg viewBox="0 0 1440 290" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="dsPrMoon" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%" stop-color="#fdd4c9" stop-opacity="0.44"/>' +
            '<stop offset="100%" stop-color="#fdd4c9" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<g class="ds-parallax-moon">' +
          '<circle cx="1196" cy="154" r="118" fill="url(#dsPrMoon)"/>' +
          '<g class="ds-anim-moon"><path d="M1190 96 A58 58 0 1 0 1230 198 A45 45 0 1 1 1190 96 Z" fill="#fdd4c9" opacity="0.95"/></g>' +
          '<path d="M1044 116 L1048 130 L1062 134 L1048 138 L1044 152 L1040 138 L1026 134 L1040 130 Z" fill="#ebd09b" class="ds-anim-star"/>' +
          '<path d="M942 162 L944 170 L952 172 L944 174 L942 182 L940 174 L932 172 L940 170 Z" fill="#ebd09b" opacity="0.85" class="ds-anim-star-2"/>' +
          '<circle cx="850" cy="116" r="2.2" fill="#ffffff" opacity="0.72"/>' +
          '<circle cx="1328" cy="148" r="2.3" fill="#ffffff" opacity="0.78"/>' +
        '</g>' +
        '<path d="M0 248 Q280 206 580 242 Q910 202 1240 240 Q1360 226 1440 236 L1440 292 L0 292 Z" fill="#5b458d" opacity="0.45"/>' +
        '<path d="M0 260 Q300 218 610 254 Q940 214 1270 252 Q1375 240 1440 248 L1440 294 L0 294 Z" fill="var(--ds-ground)"/>' +
      '</svg>'
    );
  }

  /* ── 4. Profile Hero Sync Helper ─────────────────────────────────────────── */
  function escapeHeroText(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function getInitials(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function applyProfileHero(user, extra) {
    lastProfileUser = user || null;
    if (!user) {
      lastProfileMeta = null;
    } else if (extra && typeof extra === 'object') {
      lastProfileMeta = extra;
    }
    if (!mounted || mountedKind !== 'profile') return;
    var skyInner = document.querySelector('.ds-profile-sky-inner');
    if (!skyInner) return;
    var titleEl = skyInner.querySelector('.signups-title');
    var metaEl = document.getElementById('ds-profile-sky-meta');
    var avatarWrap = document.getElementById('ds-profile-avatar-wrap');
    if (!titleEl || !metaEl) return;

    if (user) {
      var displayName = user.character_name || user.global_name || user.display_name || user.username || 'My Profile';
      titleEl.textContent = displayName;

      if (avatarWrap) {
        var checkHtml = user.is_verified
          ? '<span class="ds-profile-avatar-check" title="Verified Raider" aria-label="Verified Raider">&#10003;</span>'
          : '';
        var initials = escapeHeroText(getInitials(displayName));
        if (user.avatar_url) {
          avatarWrap.innerHTML =
            '<img class="ds-profile-avatar" src="' + escapeHeroText(user.avatar_url) + '" alt="' + escapeHeroText(displayName) + '" />' +
            '<span class="ds-profile-avatar ds-profile-avatar-fallback" style="display:none;" aria-hidden="true">' + initials + '</span>' +
            checkHtml;
          var imgEl = avatarWrap.querySelector('img.ds-profile-avatar');
          var fbEl = avatarWrap.querySelector('.ds-profile-avatar-fallback');
          if (imgEl && fbEl) {
            imgEl.onerror = function () {
              imgEl.style.display = 'none';
              fbEl.style.display = 'flex';
            };
          }
        } else {
          avatarWrap.innerHTML =
            '<span class="ds-profile-avatar ds-profile-avatar-fallback" aria-hidden="true">' + initials + '</span>' +
            checkHtml;
        }
        avatarWrap.style.display = '';
      }

      var badge = '';
      if (user.is_in_guild === false) {
        badge = '<a href="https://discord.gg/alnr" target="_blank" rel="noopener" class="ds-profile-sky-badge is-warn">Not in Server</a>';
      } else if (user.is_verified) {
        badge = '<span class="ds-profile-sky-badge">&#10022; Verified Raider</span>';
      } else {
        badge = '<button type="button" class="ds-profile-sky-badge is-warn is-clickable" id="ds-hero-verify-btn">Unverified &bull; Verify Now</button>';
      }

      var handle = user.username ? '<span class="ds-profile-sky-handle">@' + escapeHeroText(user.username) + '</span>' : '';
      var raidingSince = lastProfileMeta && lastProfileMeta.raidingSince ? String(lastProfileMeta.raidingSince).trim() : '';
      var sinceHtml = (raidingSince && raidingSince !== 'N/A')
        ? '<span class="ds-profile-sky-sep" aria-hidden="true">&bull;</span><span class="ds-profile-sky-since">Raiding since ' + escapeHeroText(raidingSince) + '</span>'
        : '';

      metaEl.innerHTML = badge + handle + sinceHtml;

      var verifyBtn = document.getElementById('ds-hero-verify-btn');
      if (verifyBtn) {
        verifyBtn.onclick = function () {
          if (typeof window.alnrSwitchProfileTab === 'function') {
            window.alnrSwitchProfileTab('verify');
          }
        };
      }
    } else {
      titleEl.textContent = 'My Profile';
      metaEl.innerHTML = '';
      if (avatarWrap) {
        avatarWrap.innerHTML = '';
        avatarWrap.style.display = 'none';
      }
    }
  }

  window.alnrDreamscapeUpdateProfileHero = applyProfileHero;

  function mountHomeMotion() {
    var tabBar = document.querySelector('.ds-cloud-land .raid-tab-bar.ds-editorial-tabs');
    if (!tabBar) return;
    var sidebar = tabBar.closest('.home-sidebar');
    if (!sidebar) return;

    var raidBadges = {
      ftb: 'FT:B',
      ftm: 'FT:M',
      cod: 'Chaotic',
      ba: 'BA',
      drs: 'DRS'
    };

    var availableRaids = [];
    var lockedRaids = [];
    tabBar.querySelectorAll('.raid-tab').forEach(function (tab) {
      var id = tab.dataset.raid || '';
      var titleEl = tab.querySelector('.tab-title');
      var title = titleEl ? titleEl.textContent.trim() : id.toUpperCase();
      var locked = tab.classList.contains('is-locked');
      var item = {
        id: id,
        title: title,
        locked: locked,
        badge: raidBadges[id] || id.toUpperCase()
      };
      if (locked) lockedRaids.push(item);
      else availableRaids.push(item);
    });

    /* Stage 1: Initial Raid Selector Hub */
    var hub = document.createElement('div');
    hub.className = 'ds-raid-hub';
    hub.innerHTML =
      '<div class="ds-raid-hub-group">' +
        '<div class="sections-label">Select a Raid</div>' +
        '<div class="ds-raid-hub-grid">' +
          availableRaids.map(function (r) {
            return (
              '<button type="button" class="ds-raid-hub-card" data-raid="' + escapeHeroText(r.id) + '">' +
                '<span class="ds-raid-hub-badge">' + escapeHeroText(r.badge) + '</span>' +
                '<span class="ds-raid-hub-title">' + escapeHeroText(r.title) + '</span>' +
                '<span class="ds-raid-hub-cta" aria-hidden="true">&#8594;</span>' +
              '</button>'
            );
          }).join('') +
        '</div>' +
      '</div>' +
      (lockedRaids.length ? (
        '<div class="ds-raid-hub-group">' +
          '<div class="sections-label">Coming Soon</div>' +
          '<div class="ds-raid-hub-wip-grid">' +
            lockedRaids.map(function (r) {
              return (
                '<div class="ds-raid-hub-card is-locked" data-raid="' + escapeHeroText(r.id) + '" aria-disabled="true">' +
                  '<div class="ds-raid-hub-wip-left">' +
                    '<span class="ds-raid-dot ' + escapeHeroText(r.id) + '" aria-hidden="true"></span>' +
                    '<span class="ds-raid-hub-wip-title">' + escapeHeroText(r.title) + '</span>' +
                  '</div>' +
                  '<span class="ds-raid-hub-wip-pill"><span class="material-symbols-outlined" aria-hidden="true">lock</span> WIP</span>' +
                '</div>'
              );
            }).join('') +
          '</div>' +
        '</div>'
      ) : '');

    /* Stage 2: Selected Raid Dropdown Switcher Bar */
    var switcherBar = document.createElement('div');
    switcherBar.className = 'ds-raid-switcher-bar';
    switcherBar.innerHTML =
      '<div class="ds-raid-dropdown" data-active-raid="">' +
        '<button type="button" class="ds-raid-dropdown-trigger" aria-haspopup="listbox" aria-expanded="false">' +
          '<span class="ds-raid-dropdown-trigger-left">' +
            '<span class="ds-raid-dot" aria-hidden="true"></span>' +
            '<span class="ds-raid-dropdown-label">Select a Raid</span>' +
          '</span>' +
          '<span class="material-symbols-outlined ds-raid-dropdown-chev" aria-hidden="true">expand_more</span>' +
        '</button>' +
        '<div class="ds-raid-dropdown-menu" role="listbox" aria-label="Select Raid">' +
          availableRaids.map(function (r) {
            return (
              '<button type="button" class="ds-raid-dropdown-option" role="option" aria-selected="false" data-raid="' + escapeHeroText(r.id) + '">' +
                '<span class="ds-raid-dropdown-opt-left">' +
                  '<span class="ds-raid-dot ' + escapeHeroText(r.id) + '" aria-hidden="true"></span>' +
                  '<span>' + escapeHeroText(r.title) + '</span>' +
                '</span>' +
                '<span class="material-symbols-outlined ds-raid-dropdown-check" aria-hidden="true">check</span>' +
              '</button>'
            );
          }).join('') +
          (lockedRaids.length ? '<div class="ds-raid-dropdown-sep" role="separator"></div>' : '') +
          lockedRaids.map(function (r) {
            return (
              '<div class="ds-raid-dropdown-option is-locked" aria-disabled="true" data-raid="' + escapeHeroText(r.id) + '">' +
                '<span class="ds-raid-dropdown-opt-left">' +
                  '<span class="ds-raid-dot ' + escapeHeroText(r.id) + '" aria-hidden="true"></span>' +
                  '<span>' + escapeHeroText(r.title) + '</span>' +
                '</span>' +
                '<span class="ds-raid-hub-wip-pill"><span class="material-symbols-outlined" aria-hidden="true">lock</span> WIP</span>' +
              '</div>'
            );
          }).join('') +
        '</div>' +
      '</div>' +
      '<button type="button" class="ds-raid-back-btn">' +
        '<span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>' +
        '<span>All Raids</span>' +
      '</button>';

    sidebar.appendChild(hub);
    sidebar.appendChild(switcherBar);

    var dropdown = switcherBar.querySelector('.ds-raid-dropdown');
    var trigger = switcherBar.querySelector('.ds-raid-dropdown-trigger');
    var triggerDot = trigger.querySelector('.ds-raid-dot');
    var triggerLabel = trigger.querySelector('.ds-raid-dropdown-label');
    var backBtn = switcherBar.querySelector('.ds-raid-back-btn');

    function closeDropdown(restoreFocus) {
      if (!dropdown.classList.contains('is-open')) return;
      dropdown.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger.focus();
    }

    function staggerNodes(nodes) {
      if (isLiteOrReduced()) return;
      nodes.forEach(function (card, idx) {
        card.classList.remove('ds-card-enter');
        card.style.setProperty('--ds-i', String(Math.min(idx, 10)));
        void card.offsetWidth;
        card.classList.add('ds-card-enter');
      });
    }

    function staggerVisibleCards() {
      var activeContent = document.querySelector('.ds-cloud-land .raid-content:not([hidden])');
      if (!activeContent) return;
      staggerNodes(activeContent.querySelectorAll('.section-card'));
    }

    function updateDropdownUI(raidId) {
      var found = availableRaids.find(function (r) { return r.id === raidId; });
      if (!found) return;
      dropdown.setAttribute('data-active-raid', found.id);
      triggerDot.className = 'ds-raid-dot ' + found.id;
      triggerLabel.textContent = found.title;
      dropdown.querySelectorAll('.ds-raid-dropdown-option[data-raid]').forEach(function (opt) {
        var isMatch = opt.dataset.raid === found.id;
        opt.classList.toggle('is-active', isMatch);
        if (opt.hasAttribute('aria-selected')) {
          opt.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        }
      });
    }

    function getUrlRaid() {
      var h = (window.location.hash || '').replace('#', '').toLowerCase();
      var q = '';
      try {
        q = (new URLSearchParams(window.location.search).get('raid') || '').toLowerCase();
      } catch (e) { q = ''; }
      var candidate = h || q;
      if (!candidate) return '';
      var valid = availableRaids.some(function (r) { return r.id === candidate; });
      return valid ? candidate : '';
    }

    var currentSelectedRaid = '';

    function showRaidHub(clearUrl, animate) {
      closeDropdown(false);
      currentSelectedRaid = '';
      document.body.classList.add('ds-home-raid-picker');
      document.body.classList.remove('ds-home-raid-selected');
      if (clearUrl && history.replaceState) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      if (animate) {
        staggerNodes(hub.querySelectorAll('.ds-raid-hub-card'));
      }
    }

    function selectRaid(raidId, triggerTabClick, animate) {
      var found = availableRaids.find(function (r) { return r.id === raidId; });
      if (!found) return;
      closeDropdown(false);
      if (triggerTabClick) {
        var underlyingBtn = tabBar.querySelector('.raid-tab[data-raid="' + raidId + '"]');
        if (underlyingBtn) underlyingBtn.click();
      }
      var changed = currentSelectedRaid !== raidId || document.body.classList.contains('ds-home-raid-picker');
      currentSelectedRaid = raidId;
      document.body.classList.remove('ds-home-raid-picker');
      document.body.classList.add('ds-home-raid-selected');
      updateDropdownUI(raidId);
      if (animate && changed) {
        staggerVisibleCards();
      }
    }

    hub.querySelectorAll('.ds-raid-hub-card:not(.is-locked)').forEach(function (card) {
      card.addEventListener('click', function () {
        selectRaid(card.dataset.raid, true, true);
      });
    });

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !dropdown.classList.contains('is-open');
      dropdown.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    dropdown.querySelectorAll('.ds-raid-dropdown-option:not(.is-locked)').forEach(function (opt) {
      opt.addEventListener('click', function () {
        selectRaid(opt.dataset.raid, true, true);
      });
    });

    backBtn.addEventListener('click', function () {
      showRaidHub(true, true);
    });

    function onDocClick(e) {
      if (!dropdown.contains(e.target)) closeDropdown(false);
    }

    function onDocKeydown(e) {
      if (e.key === 'Escape' && dropdown.classList.contains('is-open')) {
        e.stopPropagation();
        closeDropdown(true);
      }
    }

    function onHashChange() {
      var r = getUrlRaid();
      if (r) selectRaid(r, false, true);
      else showRaidHub(false, false);
    }

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onDocKeydown);
    window.addEventListener('hashchange', onHashChange);

    if (window.MutationObserver) {
      homeTabObserver = new MutationObserver(function () {
        if (!document.body.classList.contains('ds-home-raid-selected')) return;
        var active = tabBar.querySelector('.raid-tab.active');
        if (active && active.dataset.raid && active.dataset.raid !== currentSelectedRaid) {
          currentSelectedRaid = active.dataset.raid;
          updateDropdownUI(currentSelectedRaid);
          staggerVisibleCards();
        }
      });
      tabBar.querySelectorAll('.raid-tab').forEach(function (btn) {
        homeTabObserver.observe(btn, { attributes: true, attributeFilter: ['class'] });
      });
    }

    homeRaidCleanup = function () {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onDocKeydown);
      window.removeEventListener('hashchange', onHashChange);
      if (hub && hub.parentNode) hub.parentNode.removeChild(hub);
      if (switcherBar && switcherBar.parentNode) switcherBar.parentNode.removeChild(switcherBar);
      document.body.classList.remove('ds-home-raid-picker', 'ds-home-raid-selected');
    };

    var initialRaid = getUrlRaid();
    if (initialRaid) {
      selectRaid(initialRaid, false, false);
    } else {
      showRaidHub(false, false);
    }
  }

  function unmountHomeMotion() {
    if (homeTabObserver) { homeTabObserver.disconnect(); homeTabObserver = null; }
    if (motionResizeHandler) { window.removeEventListener('resize', motionResizeHandler); motionResizeHandler = null; }
    if (homeRaidCleanup) { homeRaidCleanup(); homeRaidCleanup = null; }
    document.querySelectorAll('.section-card.ds-card-enter').forEach(function (c) {
      c.classList.remove('ds-card-enter');
      c.style.removeProperty('--ds-i');
    });
  }

  function mountGuideMotion() {
    var tocList = document.querySelector('.ds-guide-body-wrap .guide-toc-list');
    if (!tocList) return;

    var indicator = document.createElement('span');
    indicator.className = 'ds-toc-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    tocList.classList.add('ds-has-indicator');
    tocList.insertBefore(indicator, tocList.firstChild);

    function positionToc(instant) {
      var active = tocList.querySelector('.guide-toc-link.active');
      if (!active) { indicator.style.opacity = '0'; return; }
      if (instant) indicator.style.transition = 'none';
      indicator.style.opacity = '1';
      indicator.style.height = active.offsetHeight + 'px';
      indicator.style.transform = 'translate3d(0, ' + active.offsetTop + 'px, 0)';
      if (instant) {
        void indicator.offsetHeight;
        indicator.style.transition = '';
      }
    }

    if (window.MutationObserver) {
      guideTocObserver = new MutationObserver(function () {
        positionToc(false);
      });
      tocList.querySelectorAll('.guide-toc-link').forEach(function (a) {
        guideTocObserver.observe(a, { attributes: true, attributeFilter: ['class'] });
      });
    }

    motionResizeHandler = function () { positionToc(true); };
    window.addEventListener('resize', motionResizeHandler, { passive: true });
    requestAnimationFrame(function () { positionToc(true); });
  }

  function unmountGuideMotion() {
    if (guideTocObserver) { guideTocObserver.disconnect(); guideTocObserver = null; }
    if (motionResizeHandler) { window.removeEventListener('resize', motionResizeHandler); motionResizeHandler = null; }
    var tocList = document.querySelector('.guide-toc-list.ds-has-indicator');
    if (tocList) {
      tocList.classList.remove('ds-has-indicator');
      var ind = tocList.querySelector('.ds-toc-indicator');
      if (ind) ind.remove();
    }
  }

  function mountProfileMotion() {
    var navCard = document.getElementById('profile-top-tabs');
    if (!navCard || navCard.querySelector('.ds-profile-nav-indicator')) return;

    var indicator = document.createElement('span');
    indicator.className = 'ds-profile-nav-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    navCard.classList.add('ds-has-indicator');
    navCard.insertBefore(indicator, navCard.firstChild);

    var positionedOnce = false;

    function positionNav(instant) {
      var active = navCard.querySelector('.profile-nav-btn.active');
      if (!active || active.offsetWidth === 0 || active.offsetHeight === 0) {
        indicator.style.opacity = '0';
        return;
      }
      var snap = Boolean(instant || !positionedOnce);
      if (snap) indicator.style.transition = 'none';
      indicator.style.opacity = '1';
      indicator.style.width = active.offsetWidth + 'px';
      indicator.style.height = active.offsetHeight + 'px';
      indicator.style.transform = 'translate3d(' + active.offsetLeft + 'px, ' + active.offsetTop + 'px, 0)';
      positionedOnce = true;
      if (snap) {
        void indicator.offsetHeight;
        indicator.style.transition = '';
      }
    }

    var btnObserver = null;
    var visObserver = null;
    var ro = null;

    if (window.MutationObserver) {
      btnObserver = new MutationObserver(function () {
        positionNav(false);
      });
      navCard.querySelectorAll('.profile-nav-btn').forEach(function (btn) {
        btnObserver.observe(btn, { attributes: true, attributeFilter: ['class'] });
      });

      var workspace = document.getElementById('profile-workspace-card');
      if (workspace) {
        visObserver = new MutationObserver(function () {
          requestAnimationFrame(function () { positionNav(true); });
        });
        visObserver.observe(workspace, { attributes: true, attributeFilter: ['style', 'class'] });
      }
    }

    if (window.ResizeObserver) {
      ro = new ResizeObserver(function () { positionNav(true); });
      ro.observe(navCard);
    }

    var onResize = function () { positionNav(true); };
    window.addEventListener('resize', onResize, { passive: true });
    requestAnimationFrame(function () { positionNav(true); });

    profileNavCleanup = function () {
      if (btnObserver) btnObserver.disconnect();
      if (visObserver) visObserver.disconnect();
      if (ro) ro.disconnect();
      window.removeEventListener('resize', onResize);
      navCard.classList.remove('ds-has-indicator');
      if (indicator && indicator.parentNode) indicator.parentNode.removeChild(indicator);
    };
  }

  function unmountProfileMotion() {
    if (profileNavCleanup) {
      profileNavCleanup();
      profileNavCleanup = null;
    }
  }

  /* ── 5. Page Mount & Clean Unmount ───────────────────────────────────────── */
  function mountHome() {
    var main = document.querySelector('main.main-content');
    var hero = main ? main.querySelector(':scope > section.hero') : null;
    var workspace = main ? main.querySelector(':scope > .home-workspace-grid') : null;
    if (!hero || !workspace) return false;

    document.body.classList.add('ds-page-home');

    var skyWrap = document.createElement('div');
    skyWrap.className = 'ds-home-sky';
    var art = document.createElement('div');
    art.className = 'ds-sky-art';
    art.innerHTML = buildHomeSkySvg();
    skyWrap.appendChild(art);

    main.insertBefore(skyWrap, hero);
    skyWrap.appendChild(hero);

    var land = document.createElement('div');
    land.className = 'ds-cloud-land';
    main.insertBefore(land, workspace);
    land.appendChild(workspace);

    mountedKind = 'home';
    mountHomeMotion();
    return true;
  }

  function unmountHome() {
    unmountHomeMotion();
    var main = document.querySelector('main.main-content');
    var skyWrap = main ? main.querySelector(':scope > .ds-home-sky') : null;
    var land = main ? main.querySelector(':scope > .ds-cloud-land') : null;
    if (skyWrap) {
      var hero = skyWrap.querySelector(':scope > section.hero');
      if (hero) main.insertBefore(hero, skyWrap);
      skyWrap.remove();
    }
    if (land) {
      var ws = land.querySelector(':scope > .home-workspace-grid');
      if (ws) main.insertBefore(ws, land);
      land.remove();
    }
    document.body.classList.remove('ds-page-home');
  }

  function mountGuide() {
    var main = document.querySelector('main.main-content');
    var pageHeader = main ? main.querySelector(':scope > .page-header') : null;
    if (!pageHeader) return false;

    document.body.classList.add('ds-page-guide');
    var breadcrumb = main.querySelector(':scope > .breadcrumb');

    var sky = document.createElement('div');
    sky.className = 'ds-guide-sky';
    var art = document.createElement('div');
    art.className = 'ds-sky-art';
    art.innerHTML = buildGuideSkySvg();
    sky.appendChild(art);

    var skyInner = document.createElement('div');
    skyInner.className = 'ds-guide-sky-inner';
    if (breadcrumb) skyInner.appendChild(breadcrumb);
    skyInner.appendChild(pageHeader);
    sky.appendChild(skyInner);

    var bodyWrap = document.createElement('div');
    bodyWrap.className = 'ds-guide-body-wrap';

    var remaining = Array.from(main.children);
    main.insertBefore(sky, main.firstChild);
    main.appendChild(bodyWrap);
    remaining.forEach(function (child) {
      if (child !== sky && child !== bodyWrap) bodyWrap.appendChild(child);
    });

    mountedKind = 'guide';
    mountGuideMotion();
    return true;
  }

  function unmountGuide() {
    unmountGuideMotion();
    var main = document.querySelector('main.main-content');
    var sky = main ? main.querySelector(':scope > .ds-guide-sky') : null;
    var bodyWrap = main ? main.querySelector(':scope > .ds-guide-body-wrap') : null;
    if (sky) {
      var inner = sky.querySelector('.ds-guide-sky-inner');
      if (inner) {
        Array.from(inner.children).forEach(function (ch) {
          main.insertBefore(ch, sky);
        });
      }
      sky.remove();
    }
    if (bodyWrap) {
      Array.from(bodyWrap.children).forEach(function (ch) {
        main.insertBefore(ch, bodyWrap);
      });
      bodyWrap.remove();
    }
    document.body.classList.remove('ds-page-guide');
  }

  function mountSignupsOrProfile(kind) {
    var container = document.querySelector('.signups-container');
    var topBar = container ? container.querySelector(':scope > .signups-top-bar') : null;
    if (!container || !topBar) return false;

    var isProfile = kind === 'profile';
    document.body.classList.add(isProfile ? 'ds-page-profile' : 'ds-page-signups');

    var sky = document.createElement('div');
    sky.className = isProfile ? 'ds-profile-sky' : 'ds-signups-sky';
    var art = document.createElement('div');
    art.className = 'ds-sky-art';
    art.innerHTML = buildBannerSkySvg();
    sky.appendChild(art);

    var skyInner = document.createElement('div');
    skyInner.className = isProfile ? 'ds-profile-sky-inner' : 'ds-signups-sky-inner';
    if (isProfile) {
      var heroRow = document.createElement('div');
      heroRow.className = 'ds-profile-hero-row';

      var avatarWrap = document.createElement('div');
      avatarWrap.className = 'ds-profile-avatar-wrap';
      avatarWrap.id = 'ds-profile-avatar-wrap';
      avatarWrap.style.display = 'none';

      var idCol = document.createElement('div');
      idCol.className = 'ds-profile-identity-col';
      idCol.appendChild(topBar);

      var meta = document.createElement('div');
      meta.className = 'ds-profile-sky-meta';
      meta.id = 'ds-profile-sky-meta';
      idCol.appendChild(meta);

      heroRow.appendChild(avatarWrap);
      heroRow.appendChild(idCol);
      skyInner.appendChild(heroRow);
    } else {
      skyInner.appendChild(topBar);
    }
    sky.appendChild(skyInner);

    var bodyWrap = document.createElement('div');
    bodyWrap.className = isProfile ? 'ds-profile-body-wrap' : 'ds-signups-body-wrap';
    var bodyInner = document.createElement('div');
    bodyInner.className = isProfile ? 'ds-profile-body-inner' : 'ds-signups-body-inner';

    var rest = Array.from(container.children).filter(function (el) { return el !== topBar; });
    container.innerHTML = '';
    container.appendChild(sky);
    rest.forEach(function (el) { bodyInner.appendChild(el); });
    bodyWrap.appendChild(bodyInner);
    container.appendChild(bodyWrap);

    mountedKind = kind;
    if (isProfile) {
      if (lastProfileUser) applyProfileHero(lastProfileUser);
      mountProfileMotion();
    }
    return true;
  }

  function unmountSignupsOrProfile(kind) {
    var isProfile = kind === 'profile';
    if (isProfile) unmountProfileMotion();
    var container = document.querySelector('.signups-container');
    if (container) {
      var sky = container.querySelector(isProfile ? ':scope > .ds-profile-sky' : ':scope > .ds-signups-sky');
      var bodyWrap = container.querySelector(isProfile ? ':scope > .ds-profile-body-wrap' : ':scope > .ds-signups-body-wrap');
      if (sky) {
        var topBar = sky.querySelector('.signups-top-bar');
        if (topBar) {
          if (isProfile) {
            var tEl = topBar.querySelector('.signups-title');
            if (tEl) tEl.textContent = 'My Profile';
          }
          container.insertBefore(topBar, sky);
        }
        sky.remove();
      }
      if (bodyWrap) {
        var inner = bodyWrap.firstElementChild;
        if (inner) {
          Array.from(inner.children).forEach(function (ch) {
            container.insertBefore(ch, bodyWrap);
          });
        }
        bodyWrap.remove();
      }
    }
    document.body.classList.remove('ds-page-profile', 'ds-page-signups');
  }

  function mountSecondary() {
    var container = document.querySelector('.signups-container');
    var main = document.querySelector('main.main-content');
    var host = container || main;
    if (!host) return false;
    var hero = host.querySelector(':scope > .signups-hero, :scope > .signups-top-bar, :scope > .page-header, :scope > .contact-hero');
    if (!hero) return false;

    document.body.classList.add('ds-page-secondary');

    var sky = document.createElement('div');
    sky.className = 'ds-secondary-sky';
    var art = document.createElement('div');
    art.className = 'ds-sky-art';
    art.innerHTML = buildBannerSkySvg();
    sky.appendChild(art);

    var skyInner = document.createElement('div');
    skyInner.className = 'ds-secondary-sky-inner';
    skyInner.appendChild(hero);
    sky.appendChild(skyInner);

    var bodyWrap = document.createElement('div');
    bodyWrap.className = 'ds-secondary-body-wrap';
    var bodyInner = document.createElement('div');
    bodyInner.className = 'ds-secondary-body-inner';

    var rest = Array.from(host.children).filter(function (el) { return el !== hero; });
    host.innerHTML = '';
    host.appendChild(sky);
    rest.forEach(function (el) { bodyInner.appendChild(el); });
    bodyWrap.appendChild(bodyInner);
    host.appendChild(bodyWrap);

    mountedKind = 'secondary';
    return true;
  }

  function unmountSecondary() {
    var sky = document.querySelector('.ds-secondary-sky');
    var bodyWrap = document.querySelector('.ds-secondary-body-wrap');
    var host = (sky && sky.parentNode) || (bodyWrap && bodyWrap.parentNode);
    if (host) {
      if (sky) {
        var inner = sky.querySelector('.ds-secondary-sky-inner');
        if (inner) {
          Array.from(inner.children).forEach(function (ch) {
            host.insertBefore(ch, sky);
          });
        }
        sky.remove();
      }
      if (bodyWrap) {
        var bInner = bodyWrap.querySelector('.ds-secondary-body-inner');
        if (bInner) {
          Array.from(bInner.children).forEach(function (ch) {
            host.insertBefore(ch, bodyWrap);
          });
        }
        bodyWrap.remove();
      }
    }
    document.body.classList.remove('ds-page-secondary');
  }

  function mountDashboard() {
    var main = document.querySelector('main.main-content');
    var root = document.getElementById('alnr-dashboard-root');
    if (!main || !root) return false;

    document.body.classList.add('ds-page-dashboard');

    var sky = document.createElement('div');
    sky.className = 'ds-dashboard-sky';
    var art = document.createElement('div');
    art.className = 'ds-sky-art';
    art.innerHTML = buildBannerSkySvg();
    sky.appendChild(art);

    var skyInner = document.createElement('div');
    skyInner.className = 'ds-dashboard-sky-inner';
    skyInner.innerHTML =
      '<div class="signups-hero">' +
        '<h1 class="signups-title">Host Dashboard</h1>' +
        '<p class="signups-desc">Manage active runs and signed-up players.</p>' +
      '</div>';
    sky.appendChild(skyInner);

    var bodyWrap = document.createElement('div');
    bodyWrap.className = 'ds-dashboard-body-wrap';
    var bodyInner = document.createElement('div');
    bodyInner.className = 'ds-dashboard-body-inner';

    main.insertBefore(sky, root);
    main.insertBefore(bodyWrap, root);
    bodyInner.appendChild(root);
    bodyWrap.appendChild(bodyInner);

    mountedKind = 'dashboard';
    return true;
  }

  function unmountDashboard() {
    var main = document.querySelector('main.main-content');
    var sky = main ? main.querySelector(':scope > .ds-dashboard-sky') : null;
    var bodyWrap = main ? main.querySelector(':scope > .ds-dashboard-body-wrap') : null;
    if (sky) sky.remove();
    if (bodyWrap) {
      var root = document.getElementById('alnr-dashboard-root');
      if (root && main) main.insertBefore(root, bodyWrap);
      bodyWrap.remove();
    }
    document.body.classList.remove('ds-page-dashboard');
  }

  function mount() {
    if (mounted || !isRefreshActive()) return;
    mounted = true;
    injectDesktopNav();

    var isProfile = Boolean(document.body && document.body.dataset && document.body.dataset.page === 'profile');
    var isSignups = Boolean(document.getElementById('runs-selection-container'));
    var isDashboard = Boolean(document.getElementById('alnr-dashboard-root'));

    if (isDashboard) {
      mountDashboard();
    } else if (!mountHome()) {
      if (isProfile) mountSignupsOrProfile('profile');
      else if (isSignups) mountSignupsOrProfile('signups');
      else if (!mountGuide()) mountSecondary();
    }
    startScrollAndParallax();
  }

  function unmount() {
    if (!mounted) return;
    stopScrollAndParallax();
    removeDesktopNav();

    if (mountedKind === 'home') unmountHome();
    else if (mountedKind === 'guide') unmountGuide();
    else if (mountedKind === 'profile') unmountSignupsOrProfile('profile');
    else if (mountedKind === 'signups') unmountSignupsOrProfile('signups');
    else if (mountedKind === 'secondary') unmountSecondary();
    else if (mountedKind === 'dashboard') unmountDashboard();

    mountedKind = null;
    mounted = false;
  }

  function sync() {
    if (isRefreshActive()) mount();
    else unmount();
  }

  window.__alnrDreamscapeEngine = { mount: mount, unmount: unmount, sync: sync };

  window.addEventListener('alnr:uichange', function () {
    sync();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync);
  } else {
    sync();
  }
})();
