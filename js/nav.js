(function () {
  var navHTML = '\
  <div class="nav-panel-overlay" id="nav-overlay"></div>\
  <nav class="nav-panel" id="nav-panel" aria-label="Site navigation">\
    <div class="nav-panel-header">\
      <span class="nav-panel-title" data-i18n="nav-title">Navigation</span>\
      <button class="nav-panel-close" id="nav-close" aria-label="Close navigation">&times;</button>\
    </div>\
    <div class="nav-panel-body">\
      <a href="index.html" class="nav-home-link"><span data-i18n="nav-home">&#8962; Home</span></a>\
      <div class="nav-divider"></div>\
      <div class="nav-raid-group" id="nav-raid-ftb">\
        <div class="nav-raid-header nav-raid-toggle"><span data-i18n="raid-ftb-name">Forked Tower: Blood</span><span class="nav-raid-chevron">&#9656;</span></div>\
        <div class="nav-raid-pages">\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss" data-i18n="nav-boss1">Boss 1</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/demon-tablet.html" class="nav-page-link"><span data-i18n="demon-tablet">Demon Tablet</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/demon-tablet.html#overview" class="nav-sub-link"><span data-i18n="dt-overview-heading">Overview</span></a>\
              <a href="ftb/demon-tablet.html#timeline" class="nav-sub-link"><span data-i18n="dt-timeline-heading">Fight Timeline</span></a>\
              <a href="ftb/demon-tablet.html#ray-of-expulsion" class="nav-sub-link"><span data-i18n="dt-ray-heading">Ray of Expulsion</span></a>\
              <a href="ftb/demon-tablet.html#demonograph" class="nav-sub-link"><span data-i18n="dt-demonograph-heading">Demonograph</span></a>\
              <a href="ftb/demon-tablet.html#expulsion-reference" class="nav-sub-link"><span data-i18n="dt-expulsion-ref-heading">Reference Images</span></a>\
              <a href="ftb/demon-tablet.html#rotate" class="nav-sub-link"><span data-i18n="dt-rotate-heading">Rotate Left / Right</span></a>\
              <a href="ftb/demon-tablet.html#cometeor" class="nav-sub-link"><span data-i18n="dt-cometeor-heading">Cometeor</span></a>\
              <a href="ftb/demon-tablet.html#summon-adds" class="nav-sub-link"><span data-i18n="dt-summon-adds-heading">Summon: Adds Phase</span></a>\
              <a href="ftb/demon-tablet.html#summon-statues" class="nav-sub-link"><span data-i18n="dt-summon-statues-heading">Summon: Statues</span></a>\
              <a href="ftb/demon-tablet.html#how-to" class="nav-sub-link"><span data-i18n="dt-howto-heading">How Do We Resolve Mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal" data-i18n="traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/hallways.html" class="nav-page-link"><span data-i18n="central-passages">Central Passages</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/hallways.html#overview" class="nav-sub-link"><span data-i18n="hw-overview-heading">Overview</span></a>\
              <a href="ftb/hallways.html#explosive-traps" class="nav-sub-link"><span data-i18n="hw-traps-heading">Explosive Traps</span></a>\
              <a href="ftb/hallways.html#phantom-jobs" class="nav-sub-link"><span data-i18n="hw-jobs-heading">Phantom Job Responsibilities</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss" data-i18n="nav-boss2">Boss 2</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/dead-stars.html" class="nav-page-link"><span data-i18n="dead-stars">Dead Stars</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/dead-stars.html#overview" class="nav-sub-link"><span data-i18n="ds-overview-heading">Overview</span></a>\
              <a href="ftb/dead-stars.html#timeline" class="nav-sub-link"><span data-i18n="ds-timeline-heading">Fight Timeline</span></a>\
              <a href="ftb/dead-stars.html#slice-n-dice" class="nav-sub-link"><span data-i18n="ds-slice-heading">Slice \'n\' Dice</span></a>\
              <a href="ftb/dead-stars.html#phobos" class="nav-sub-link"><span data-i18n="ds-phobos-heading">Three-Body: Phobos</span></a>\
              <a href="ftb/dead-stars.html#jumping-cleaves" class="nav-sub-link"><span data-i18n="ds-cleaves-heading">Jumping Cleaves</span></a>\
              <a href="ftb/dead-stars.html#delta-attack" class="nav-sub-link"><span data-i18n="ds-delta-heading">Delta Attack</span></a>\
              <a href="ftb/dead-stars.html#nereid" class="nav-sub-link"><span data-i18n="ds-nereid-heading">Three-Body: Nereid</span></a>\
              <a href="ftb/dead-stars.html#triton" class="nav-sub-link"><span data-i18n="ds-triton-heading">Three-Body: Triton</span></a>\
              <a href="ftb/dead-stars.html#soft-enrage" class="nav-sub-link"><span data-i18n="ds-enrage-heading">Soft Enrage</span></a>\
              <a href="ftb/dead-stars.html#how-to" class="nav-sub-link"><span data-i18n="ds-howto-heading">How Do We Resolve Mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal" data-i18n="traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/bridges.html" class="nav-page-link"><span data-i18n="pronged-passages">Pronged Passages</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/bridges.html#overview" class="nav-sub-link"><span data-i18n="br-overview-heading">Overview</span></a>\
              <a href="ftb/bridges.html#zone-1" class="nav-sub-link"><span data-i18n="br-z1-heading">Zone 1</span></a>\
              <a href="ftb/bridges.html#zone-2" class="nav-sub-link"><span data-i18n="br-z2-heading">Zone 2</span></a>\
              <a href="ftb/bridges.html#zone-3" class="nav-sub-link"><span data-i18n="br-z3-heading">Zone 3</span></a>\
              <a href="ftb/bridges.html#zone-4" class="nav-sub-link"><span data-i18n="br-z4-heading">Zone 4: Progenitor &amp; Progenitrix</span></a>\
              <a href="ftb/bridges.html#phantom-jobs" class="nav-sub-link"><span data-i18n="br-jobs-heading">Phantom Job Responsibilities</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss" data-i18n="nav-boss3">Boss 3</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/marble-dragon.html" class="nav-page-link"><span data-i18n="marble-dragon">Marble Dragon</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/marble-dragon.html#overview" class="nav-sub-link"><span data-i18n="md-overview-heading">Overview</span></a>\
              <a href="ftb/marble-dragon.html#timeline" class="nav-sub-link"><span data-i18n="md-timeline-heading">Fight Timeline</span></a>\
              <a href="ftb/marble-dragon.html#dread-deluge" class="nav-sub-link"><span data-i18n="md-deluge-heading">Dread Deluge</span></a>\
              <a href="ftb/marble-dragon.html#draconiform" class="nav-sub-link"><span data-i18n="md-motion-heading">Draconiform Motion</span></a>\
              <a href="ftb/marble-dragon.html#imitation-rain" class="nav-sub-link"><span data-i18n="md-rain-heading">Imitation Rain</span></a>\
              <a href="ftb/marble-dragon.html#adds-eternity" class="nav-sub-link"><span data-i18n="md-adds-heading">Adds: Withering Eternity</span></a>\
              <a href="ftb/marble-dragon.html#adds-party" class="nav-sub-link"><span data-i18n="md-party-heading">Adds: Party</span></a>\
              <a href="ftb/marble-dragon.html#adds-tank" class="nav-sub-link"><span data-i18n="md-tank-heading">Adds: Tank</span></a>\
              <a href="ftb/marble-dragon.html#wicked-water" class="nav-sub-link"><span data-i18n="md-wicked-heading">Wicked Water</span></a>\
              <a href="ftb/marble-dragon.html#towers" class="nav-sub-link"><span data-i18n="md-towers-heading">Towers: Imitation Rain 4</span></a>\
              <a href="ftb/marble-dragon.html#how-to" class="nav-sub-link"><span data-i18n="md-howto-heading">How do we resolve mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal" data-i18n="traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/lockwards.html" class="nav-page-link"><span data-i18n="binding-lock">The Binding Lock</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/lockwards.html#overview" class="nav-sub-link"><span data-i18n="lw-overview-heading">Overview</span></a>\
              <a href="ftb/lockwards.html#nw-golem" class="nav-sub-link"><span data-i18n="lw-nw-heading">NW: Guardian Golem</span></a>\
              <a href="ftb/lockwards.html#w-berserker" class="nav-sub-link"><span data-i18n="lw-w-heading">W: Guardian Berserker</span></a>\
              <a href="ftb/lockwards.html#sw-wraith" class="nav-sub-link"><span data-i18n="lw-sw-heading">SW: Guardian Wraith</span></a>\
              <a href="ftb/lockwards.html#ne-knight" class="nav-sub-link"><span data-i18n="lw-ne-heading">NE: Guardian Knight</span></a>\
              <a href="ftb/lockwards.html#e-bats" class="nav-sub-link"><span data-i18n="lw-e-heading">E: Guardian Bats</span></a>\
              <a href="ftb/lockwards.html#se-weapon" class="nav-sub-link"><span data-i18n="lw-se-heading">SE: Guardian Weapon</span></a>\
              <a href="ftb/lockwards.html#pillars" class="nav-sub-link"><span data-i18n="lw-pillars-heading">6 Pillars Puzzle</span></a>\
              <a href="ftb/lockwards.html#lockwards-section" class="nav-sub-link"><span data-i18n="lw-lockwards-heading">The Lockwards</span></a>\
              <a href="ftb/lockwards.html#phantom-jobs" class="nav-sub-link"><span data-i18n="lw-jobs-heading">Phantom Job Responsibilities</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss" data-i18n="nav-boss4">Boss 4</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/magitaur.html" class="nav-page-link"><span data-i18n="magitaur">Magitaur</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/magitaur.html#overview" class="nav-sub-link"><span data-i18n="mg-overview-heading">Overview</span></a>\
              <a href="ftb/magitaur.html#simulator" class="nav-sub-link"><span data-i18n="mg-sim-heading">Simulator</span></a>\
              <a href="ftb/magitaur.html#timeline" class="nav-sub-link"><span data-i18n="mg-timeline-heading">Fight Timeline</span></a>\
              <a href="ftb/magitaur.html#weapon-mechanics" class="nav-sub-link"><span data-i18n="mg-weapon-heading">Weapon Mechanics</span></a>\
              <a href="ftb/magitaur.html#assassins-dagger" class="nav-sub-link"><span data-i18n="mg-dagger-heading">Assassin\'s Dagger</span></a>\
              <a href="ftb/magitaur.html#forked-fury" class="nav-sub-link"><span data-i18n="mg-fury-heading">Forked Fury</span></a>\
              <a href="ftb/magitaur.html#conduits" class="nav-sub-link"><span data-i18n="mg-conduits-heading">Conduits</span></a>\
              <a href="ftb/magitaur.html#sages-staff" class="nav-sub-link"><span data-i18n="mg-staff-heading">Sage\'s Staff</span></a>\
              <a href="ftb/magitaur.html#rune-axe" class="nav-sub-link"><span data-i18n="mg-axe-heading">Rune Axe</span></a>\
              <a href="ftb/magitaur.html#holy-lance" class="nav-sub-link"><span data-i18n="mg-lance-heading">Holy Lance</span></a>\
              <a href="ftb/magitaur.html#how-to" class="nav-sub-link"><span data-i18n="mg-howto-heading">How do we resolve mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge additional" data-i18n="phantom-job">Phantom Job</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/phantom-jobs.html" class="nav-page-link"><span data-i18n="phantom-jobs">Phantom Jobs</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/phantom-jobs.html#overview" class="nav-sub-link"><span data-i18n="pj-overview-heading">Overview</span></a>\
              <a href="ftb/phantom-jobs.html#knight" class="nav-sub-link"><span data-i18n="pj-knight-heading">Knight</span></a>\
              <a href="ftb/phantom-jobs.html#bard" class="nav-sub-link"><span data-i18n="pj-bard-heading">Bard</span></a>\
              <a href="ftb/phantom-jobs.html#geomancer" class="nav-sub-link"><span data-i18n="pj-geo-heading">Geomancer</span></a>\
              <a href="ftb/phantom-jobs.html#time-mage" class="nav-sub-link"><span data-i18n="pj-tm-heading">Time Mage</span></a>\
              <a href="ftb/phantom-jobs.html#thief" class="nav-sub-link"><span data-i18n="pj-thief-heading">Thief</span></a>\
              <a href="ftb/phantom-jobs.html#ranger" class="nav-sub-link"><span data-i18n="pj-ranger-heading">Ranger</span></a>\
              <a href="ftb/phantom-jobs.html#samurai" class="nav-sub-link"><span data-i18n="pj-samurai-heading">Samurai</span></a>\
              <a href="ftb/phantom-jobs.html#cannoneer" class="nav-sub-link"><span data-i18n="pj-cannoneer-heading">Cannoneer</span></a>\
              <a href="ftb/phantom-jobs.html#dancer" class="nav-sub-link"><span data-i18n="pj-dancer-heading">Dancer</span></a>\
              <a href="ftb/phantom-jobs.html#mystic-knight" class="nav-sub-link"><span data-i18n="pj-mystic-heading">Mystic Knight</span></a>\
              <a href="ftb/phantom-jobs.html#chemist" class="nav-sub-link"><span data-i18n="pj-chemist-heading">Chemist</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge additional" data-i18n="phantom-job">Phantom Job</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/phantom-berserker.html" class="nav-page-link"><span data-i18n="phantom-berserker">Phantom Berserker</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/phantom-berserker.html#overview" class="nav-sub-link"><span data-i18n="pb-overview-heading">Overview</span></a>\
              <a href="ftb/phantom-berserker.html#remove-mit-macros" class="nav-sub-link"><span data-i18n="pb-macros-heading">Remove Mitigation Macros</span></a>\
              <a href="ftb/phantom-berserker.html#boss1" class="nav-sub-link"><span data-i18n="pb-b1-heading">Boss 1: Demon Tablet</span></a>\
              <a href="ftb/phantom-berserker.html#boss2" class="nav-sub-link"><span data-i18n="pb-b2-heading">Boss 2: Dead Stars</span></a>\
              <a href="ftb/phantom-berserker.html#boss3" class="nav-sub-link"><span data-i18n="pb-b3-heading">Boss 3: Marble Dragon</span></a>\
              <a href="ftb/phantom-berserker.html#boss4" class="nav-sub-link"><span data-i18n="pb-b4-heading">Boss 4: Magitaur</span></a>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>\
  </nav>';

  var inFTB = window.location.pathname.indexOf('/ftb/') !== -1;
  var inBA  = window.location.pathname.indexOf('/ba/')  !== -1;
  if (inFTB || inBA) {
    navHTML = navHTML
      .replace('href="index.html" class="nav-home-link"', 'href="../index.html" class="nav-home-link"')
      .replace(/href="ftb\//g, 'href="../ftb/')
      .replace(/href="ba\//g, 'href="../ba/');
  }

  document.body.insertAdjacentHTML('beforeend', navHTML);

  var toggle  = document.getElementById('nav-toggle');
  var panel   = document.getElementById('nav-panel');
  var overlay = document.getElementById('nav-overlay');
  var close   = document.getElementById('nav-close');

  function openNav() {
    panel.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle)  toggle.addEventListener('click', openNav);
  close.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  document.querySelectorAll('.nav-sub-link, .nav-page-link, .nav-home-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.querySelectorAll('.nav-section-toggle').forEach(function (el) {
    el.addEventListener('click', function () {
      this.closest('.nav-section').classList.toggle('expanded');
    });
  });

  document.querySelectorAll('.nav-raid-toggle').forEach(function (el) {
    el.addEventListener('click', function () {
      this.closest('.nav-raid-group').classList.toggle('expanded');
    });
  });

  var pathParts = window.location.pathname.split('/').filter(Boolean);
  var current = pathParts.length >= 2
    ? pathParts[pathParts.length - 2] + '/' + pathParts[pathParts.length - 1]
    : (pathParts.pop() || 'index.html');

  document.querySelectorAll('.nav-page-link, .nav-home-link').forEach(function (link) {
    var href = link.getAttribute('href').split('#')[0].replace(/^\.\.\//, '');
    if (href === current || href === current.split('/').pop()) {
      link.classList.add('nav-current');
      var section = link.closest('.nav-section');
      if (section) section.classList.add('expanded');
      var raidGroup = link.closest('.nav-raid-group');
      if (raidGroup) raidGroup.classList.add('expanded');
    }
  });
})();
