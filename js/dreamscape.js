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
  var lastProfileUser = null;

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

    if (discordBtn) {
      headerInner.insertBefore(nav, discordBtn);
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
        document.body.classList.toggle('ds-past-sky', pastSky);

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
  function applyProfileHero(user) {
    lastProfileUser = user || null;
    if (!mounted || mountedKind !== 'profile') return;
    var skyInner = document.querySelector('.ds-profile-sky-inner');
    if (!skyInner) return;
    var titleEl = skyInner.querySelector('.signups-title');
    var metaEl = document.getElementById('ds-profile-sky-meta');
    if (!titleEl || !metaEl) return;
    if (user) {
      var displayName = user.character_name || user.display_name || user.username || 'My Profile';
      titleEl.textContent = displayName;
      var badge = user.is_verified
        ? '<span class="ds-profile-sky-badge">&#10022; Verified Raider</span>'
        : '<span class="ds-profile-sky-badge">Discord Connected</span>';
      var handle = user.username ? '<span>@' + String(user.username).replace(/[<>&"]/g, '') + '</span>' : '';
      metaEl.innerHTML = badge + handle;
    } else {
      titleEl.textContent = 'My Profile';
      metaEl.innerHTML = '';
    }
  }

  window.alnrDreamscapeUpdateProfileHero = applyProfileHero;

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
    return true;
  }

  function unmountHome() {
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
    return true;
  }

  function unmountGuide() {
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
    skyInner.appendChild(topBar);
    if (isProfile) {
      var meta = document.createElement('div');
      meta.className = 'ds-profile-sky-meta';
      meta.id = 'ds-profile-sky-meta';
      skyInner.appendChild(meta);
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
    if (isProfile && lastProfileUser) applyProfileHero(lastProfileUser);
    return true;
  }

  function unmountSignupsOrProfile(kind) {
    var isProfile = kind === 'profile';
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
