(function () {
  var navHTML = '\
  <div class="nav-panel-overlay" id="nav-overlay"></div>\
  <nav class="nav-panel" id="nav-panel" aria-label="Site navigation">\
    <div class="nav-panel-header">\
      <span class="nav-panel-title">Navigation</span>\
      <button class="nav-panel-close" id="nav-close" aria-label="Close navigation">&times;</button>\
    </div>\
    <div class="nav-panel-body">\
      <a href="index.html" class="nav-home-link">&#8962; Home</a>\
      <div class="nav-divider"></div>\
      <div class="nav-raid-group" id="nav-raid-ba">\
        <div class="nav-raid-header nav-raid-toggle">Baldesion Arsenal<span class="nav-raid-chevron">&#9656;</span></div>\
        <div class="nav-raid-pages">\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge fate">FATE</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ba/ovni.html" class="nav-page-link">Ovni</a>\
            <div class="nav-sub-links">\
              <a href="ba/ovni.html#overview" class="nav-sub-link">Overview</a>\
              <a href="ba/ovni.html#getting-gold" class="nav-sub-link">Getting Gold</a>\
              <a href="ba/ovni.html#mechanics" class="nav-sub-link">Mechanics</a>\
              <a href="ba/ovni.html#entering" class="nav-sub-link">Entering the Arsenal</a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label"><span class="nav-badge boss">Boss 1</span></div>\
            <a href="ba/twin-spears.html" class="nav-page-link wip">The Twin Spears</a>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label"><span class="nav-badge boss">Boss 2</span></div>\
            <a href="ba/raiden.html" class="nav-page-link wip">Raiden</a>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label"><span class="nav-badge traversal">Traversal</span></div>\
            <a href="ba/hallways.html" class="nav-page-link wip">Hallways</a>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label"><span class="nav-badge support">Support</span></div>\
            <a href="ba/support-rooms.html" class="nav-page-link wip">Support Rooms</a>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label"><span class="nav-badge support">Support</span></div>\
            <a href="ba/tristitia.html" class="nav-page-link wip">Tristitia</a>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label"><span class="nav-badge boss">Boss 3</span></div>\
            <a href="ba/absolute-virtue.html" class="nav-page-link wip">Absolute Virtue</a>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label"><span class="nav-badge boss">Boss 4</span></div>\
            <a href="ba/proto-ozma.html" class="nav-page-link wip">Proto-Ozma</a>\
          </div>\
        </div>\
      </div>\
      <div class="nav-divider"></div>\
      <div class="nav-raid-group" id="nav-raid-ftb">\
        <div class="nav-raid-header nav-raid-toggle">Forked Tower: Blood<span class="nav-raid-chevron">&#9656;</span></div>\
        <div class="nav-raid-pages">\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 1</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/demon-tablet.html" class="nav-page-link">Demon Tablet</a>\
            <div class="nav-sub-links">\
              <a href="ftb/demon-tablet.html#overview" class="nav-sub-link">Overview</a>\
              <a href="ftb/demon-tablet.html#timeline" class="nav-sub-link">Fight Timeline</a>\
              <a href="ftb/demon-tablet.html#ray-of-expulsion" class="nav-sub-link">Ray of Expulsion</a>\
              <a href="ftb/demon-tablet.html#demonograph" class="nav-sub-link">Demonograph</a>\
              <a href="ftb/demon-tablet.html#expulsion-reference" class="nav-sub-link">Reference Images</a>\
              <a href="ftb/demon-tablet.html#rotate" class="nav-sub-link">Rotate Left / Right</a>\
              <a href="ftb/demon-tablet.html#cometeor" class="nav-sub-link">Cometeor</a>\
              <a href="ftb/demon-tablet.html#summon-adds" class="nav-sub-link">Summon: Adds Phase</a>\
              <a href="ftb/demon-tablet.html#summon-statues" class="nav-sub-link">Summon: Statues</a>\
              <a href="ftb/demon-tablet.html#how-to" class="nav-sub-link">How Do We Resolve?</a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/hallways.html" class="nav-page-link">Central Passages</a>\
            <div class="nav-sub-links">\
              <a href="ftb/hallways.html#overview" class="nav-sub-link">Overview</a>\
              <a href="ftb/hallways.html#explosive-traps" class="nav-sub-link">Explosive Traps</a>\
              <a href="ftb/hallways.html#phantom-jobs" class="nav-sub-link">Phantom Job Responsibilities</a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 2</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/dead-stars.html" class="nav-page-link">Dead Stars</a>\
            <div class="nav-sub-links">\
              <a href="ftb/dead-stars.html#overview" class="nav-sub-link">Overview</a>\
              <a href="ftb/dead-stars.html#timeline" class="nav-sub-link">Fight Timeline</a>\
              <a href="ftb/dead-stars.html#slice-n-dice" class="nav-sub-link">Slice \'n\' Dice</a>\
              <a href="ftb/dead-stars.html#phobos" class="nav-sub-link">Three-Body: Phobos</a>\
              <a href="ftb/dead-stars.html#jumping-cleaves" class="nav-sub-link">Jumping Cleaves</a>\
              <a href="ftb/dead-stars.html#delta-attack" class="nav-sub-link">Delta Attack</a>\
              <a href="ftb/dead-stars.html#nereid" class="nav-sub-link">Three-Body: Nereid</a>\
              <a href="ftb/dead-stars.html#triton" class="nav-sub-link">Three-Body: Triton</a>\
              <a href="ftb/dead-stars.html#soft-enrage" class="nav-sub-link">Soft Enrage</a>\
              <a href="ftb/dead-stars.html#how-to" class="nav-sub-link">How Do We Resolve?</a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/bridges.html" class="nav-page-link">Pronged Passages</a>\
            <div class="nav-sub-links">\
              <a href="ftb/bridges.html#overview" class="nav-sub-link">Overview</a>\
              <a href="ftb/bridges.html#zone-1" class="nav-sub-link">Zone 1</a>\
              <a href="ftb/bridges.html#zone-2" class="nav-sub-link">Zone 2</a>\
              <a href="ftb/bridges.html#zone-3" class="nav-sub-link">Zone 3</a>\
              <a href="ftb/bridges.html#zone-4" class="nav-sub-link">Zone 4: Progenitor &amp; Progenitrix</a>\
              <a href="ftb/bridges.html#phantom-jobs" class="nav-sub-link">Phantom Job Responsibilities</a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 3</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/marble-dragon.html" class="nav-page-link">Marble Dragon</a>\
            <div class="nav-sub-links">\
              <a href="ftb/marble-dragon.html#overview" class="nav-sub-link">Overview</a>\
              <a href="ftb/marble-dragon.html#timeline" class="nav-sub-link">Fight Timeline</a>\
              <a href="ftb/marble-dragon.html#dread-deluge" class="nav-sub-link">Dread Deluge</a>\
              <a href="ftb/marble-dragon.html#draconiform" class="nav-sub-link">Draconiform Motion</a>\
              <a href="ftb/marble-dragon.html#imitation-rain" class="nav-sub-link">Imitation Rain</a>\
              <a href="ftb/marble-dragon.html#adds-eternity" class="nav-sub-link">Adds: Withering Eternity</a>\
              <a href="ftb/marble-dragon.html#adds-party" class="nav-sub-link">Adds: Party</a>\
              <a href="ftb/marble-dragon.html#adds-tank" class="nav-sub-link">Adds: Tank</a>\
              <a href="ftb/marble-dragon.html#wicked-water" class="nav-sub-link">Wicked Water</a>\
              <a href="ftb/marble-dragon.html#towers" class="nav-sub-link">Towers: Imitation Rain 4</a>\
              <a href="ftb/marble-dragon.html#how-to" class="nav-sub-link">How Do We Resolve?</a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/lockwards.html" class="nav-page-link">The Binding Lock</a>\
            <div class="nav-sub-links">\
              <a href="ftb/lockwards.html#overview" class="nav-sub-link">Overview</a>\
              <a href="ftb/lockwards.html#nw-golem" class="nav-sub-link">NW: Guardian Golem</a>\
              <a href="ftb/lockwards.html#w-berserker" class="nav-sub-link">W: Guardian Berserker</a>\
              <a href="ftb/lockwards.html#sw-wraith" class="nav-sub-link">SW: Guardian Wraith</a>\
              <a href="ftb/lockwards.html#ne-knight" class="nav-sub-link">NE: Guardian Knight</a>\
              <a href="ftb/lockwards.html#e-bats" class="nav-sub-link">E: Guardian Bats</a>\
              <a href="ftb/lockwards.html#se-weapon" class="nav-sub-link">SE: Guardian Weapon</a>\
              <a href="ftb/lockwards.html#pillars" class="nav-sub-link">6 Pillars Puzzle</a>\
              <a href="ftb/lockwards.html#lockwards-section" class="nav-sub-link">The Lockwards</a>\
              <a href="ftb/lockwards.html#phantom-jobs" class="nav-sub-link">Phantom Job Responsibilities</a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 4</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/magitaur.html" class="nav-page-link">Magitaur</a>\
            <div class="nav-sub-links">\
              <a href="ftb/magitaur.html#overview" class="nav-sub-link">Overview</a>\
              <a href="ftb/magitaur.html#simulator" class="nav-sub-link">Simulator</a>\
              <a href="ftb/magitaur.html#timeline" class="nav-sub-link">Fight Timeline</a>\
              <a href="ftb/magitaur.html#weapon-mechanics" class="nav-sub-link">Weapon Mechanics</a>\
              <a href="ftb/magitaur.html#assassins-dagger" class="nav-sub-link">Assassin\'s Dagger</a>\
              <a href="ftb/magitaur.html#forked-fury" class="nav-sub-link">Forked Fury</a>\
              <a href="ftb/magitaur.html#conduits" class="nav-sub-link">Conduits</a>\
              <a href="ftb/magitaur.html#sages-staff" class="nav-sub-link">Sage\'s Staff</a>\
              <a href="ftb/magitaur.html#rune-axe" class="nav-sub-link">Rune Axe</a>\
              <a href="ftb/magitaur.html#holy-lance" class="nav-sub-link">Holy Lance</a>\
              <a href="ftb/magitaur.html#how-to" class="nav-sub-link">How Do We Resolve?</a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge additional">Phantom Job</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/phantom-jobs.html" class="nav-page-link">Phantom Jobs</a>\
            <div class="nav-sub-links">\
              <a href="ftb/phantom-jobs.html#overview" class="nav-sub-link">Overview</a>\
              <a href="ftb/phantom-jobs.html#knight" class="nav-sub-link">Knight</a>\
              <a href="ftb/phantom-jobs.html#bard" class="nav-sub-link">Bard</a>\
              <a href="ftb/phantom-jobs.html#geomancer" class="nav-sub-link">Geomancer</a>\
              <a href="ftb/phantom-jobs.html#time-mage" class="nav-sub-link">Time Mage</a>\
              <a href="ftb/phantom-jobs.html#thief" class="nav-sub-link">Thief</a>\
              <a href="ftb/phantom-jobs.html#ranger" class="nav-sub-link">Ranger</a>\
              <a href="ftb/phantom-jobs.html#samurai" class="nav-sub-link">Samurai</a>\
              <a href="ftb/phantom-jobs.html#cannoneer" class="nav-sub-link">Cannoneer</a>\
              <a href="ftb/phantom-jobs.html#dancer" class="nav-sub-link">Dancer</a>\
              <a href="ftb/phantom-jobs.html#mystic-knight" class="nav-sub-link">Mystic Knight</a>\
              <a href="ftb/phantom-jobs.html#chemist" class="nav-sub-link">Chemist</a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge additional">Phantom Job</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/phantom-berserker.html" class="nav-page-link">Phantom Berserker</a>\
            <div class="nav-sub-links">\
              <a href="ftb/phantom-berserker.html#overview" class="nav-sub-link">Overview</a>\
              <a href="ftb/phantom-berserker.html#remove-mit-macros" class="nav-sub-link">Remove Mitigation Macros</a>\
              <a href="ftb/phantom-berserker.html#boss1" class="nav-sub-link">Boss 1: Demon Tablet</a>\
              <a href="ftb/phantom-berserker.html#boss2" class="nav-sub-link">Boss 2: Dead Stars</a>\
              <a href="ftb/phantom-berserker.html#boss3" class="nav-sub-link">Boss 3: Marble Dragon</a>\
              <a href="ftb/phantom-berserker.html#boss4" class="nav-sub-link">Boss 4: Magitaur</a>\
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
