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
      <div class="nav-section">\
        <div class="nav-section-label"><span class="nav-badge boss">Boss 1</span></div>\
        <a href="demon-tablet.html" class="nav-page-link">Demon Tablet</a>\
        <div class="nav-sub-links">\
          <a href="demon-tablet.html#overview" class="nav-sub-link">Overview</a>\
          <a href="demon-tablet.html#timeline" class="nav-sub-link">Fight Timeline</a>\
          <a href="demon-tablet.html#ray-of-expulsion" class="nav-sub-link">Ray of Expulsion</a>\
          <a href="demon-tablet.html#demonograph" class="nav-sub-link">Demonograph</a>\
          <a href="demon-tablet.html#expulsion-reference" class="nav-sub-link">Reference Images</a>\
          <a href="demon-tablet.html#rotate" class="nav-sub-link">Rotate Left / Right</a>\
          <a href="demon-tablet.html#cometeor" class="nav-sub-link">Cometeor</a>\
          <a href="demon-tablet.html#summon-adds" class="nav-sub-link">Summon: Adds Phase</a>\
          <a href="demon-tablet.html#summon-statues" class="nav-sub-link">Summon: Statues</a>\
          <a href="demon-tablet.html#how-to" class="nav-sub-link">How Do We Resolve?</a>\
        </div>\
      </div>\
      <div class="nav-divider"></div>\
      <div class="nav-section">\
        <div class="nav-section-label"><span class="nav-badge traversal">Traversal</span></div>\
        <a href="hallways.html" class="nav-page-link">Central Passages</a>\
        <div class="nav-sub-links">\
          <a href="hallways.html#overview" class="nav-sub-link">Overview</a>\
          <a href="hallways.html#explosive-traps" class="nav-sub-link">Explosive Traps</a>\
          <a href="hallways.html#phantom-jobs" class="nav-sub-link">Phantom Job Responsibilities</a>\
        </div>\
      </div>\
      <div class="nav-divider"></div>\
      <div class="nav-section">\
        <div class="nav-section-label"><span class="nav-badge boss">Boss 2</span></div>\
        <a href="dead-stars.html" class="nav-page-link">Dead Stars</a>\
        <div class="nav-sub-links">\
          <a href="dead-stars.html#overview" class="nav-sub-link">Overview</a>\
          <a href="dead-stars.html#timeline" class="nav-sub-link">Fight Timeline</a>\
          <a href="dead-stars.html#slice-n-dice" class="nav-sub-link">Slice \'n\' Dice</a>\
          <a href="dead-stars.html#phobos" class="nav-sub-link">Three-Body: Phobos</a>\
          <a href="dead-stars.html#jumping-cleaves" class="nav-sub-link">Jumping Cleaves</a>\
          <a href="dead-stars.html#delta-attack" class="nav-sub-link">Delta Attack</a>\
          <a href="dead-stars.html#nereid" class="nav-sub-link">Three-Body: Nereid</a>\
          <a href="dead-stars.html#triton" class="nav-sub-link">Three-Body: Triton</a>\
          <a href="dead-stars.html#soft-enrage" class="nav-sub-link">Soft Enrage</a>\
          <a href="dead-stars.html#how-to" class="nav-sub-link">How Do We Resolve?</a>\
        </div>\
      </div>\
      <div class="nav-divider"></div>\
      <div class="nav-section">\
        <div class="nav-section-label"><span class="nav-badge traversal">Traversal</span></div>\
        <a href="bridges.html" class="nav-page-link">Pronged Passages</a>\
        <div class="nav-sub-links">\
          <a href="bridges.html#overview" class="nav-sub-link">Overview</a>\
          <a href="bridges.html#zone-1" class="nav-sub-link">Zone 1</a>\
          <a href="bridges.html#zone-2" class="nav-sub-link">Zone 2</a>\
          <a href="bridges.html#zone-3" class="nav-sub-link">Zone 3</a>\
          <a href="bridges.html#zone-4" class="nav-sub-link">Zone 4: Progenitor &amp; Progenitrix</a>\
          <a href="bridges.html#phantom-jobs" class="nav-sub-link">Phantom Job Responsibilities</a>\
        </div>\
      </div>\
      <div class="nav-divider"></div>\
      <div class="nav-section">\
        <div class="nav-section-label"><span class="nav-badge boss">Boss 3</span></div>\
        <a href="marble-dragon.html" class="nav-page-link">Marble Dragon</a>\
        <div class="nav-sub-links">\
          <a href="marble-dragon.html#overview" class="nav-sub-link">Overview</a>\
          <a href="marble-dragon.html#timeline" class="nav-sub-link">Fight Timeline</a>\
          <a href="marble-dragon.html#dread-deluge" class="nav-sub-link">Dread Deluge</a>\
          <a href="marble-dragon.html#draconiform" class="nav-sub-link">Draconiform Motion</a>\
          <a href="marble-dragon.html#imitation-rain" class="nav-sub-link">Imitation Rain</a>\
          <a href="marble-dragon.html#adds-eternity" class="nav-sub-link">Adds: Withering Eternity</a>\
          <a href="marble-dragon.html#adds-party" class="nav-sub-link">Adds: Party</a>\
          <a href="marble-dragon.html#adds-tank" class="nav-sub-link">Adds: Tank</a>\
          <a href="marble-dragon.html#wicked-water" class="nav-sub-link">Wicked Water</a>\
          <a href="marble-dragon.html#towers" class="nav-sub-link">Towers: Imitation Rain 4</a>\
          <a href="marble-dragon.html#how-to" class="nav-sub-link">How Do We Resolve?</a>\
        </div>\
      </div>\
      <div class="nav-divider"></div>\
      <div class="nav-section">\
        <div class="nav-section-label"><span class="nav-badge traversal">Traversal</span></div>\
        <a href="lockwards.html" class="nav-page-link">The Binding Lock</a>\
        <div class="nav-sub-links">\
          <a href="lockwards.html#overview" class="nav-sub-link">Overview</a>\
          <a href="lockwards.html#nw-golem" class="nav-sub-link">NW: Guardian Golem</a>\
          <a href="lockwards.html#w-berserker" class="nav-sub-link">W: Guardian Berserker</a>\
          <a href="lockwards.html#sw-wraith" class="nav-sub-link">SW: Guardian Wraith</a>\
          <a href="lockwards.html#ne-knight" class="nav-sub-link">NE: Guardian Knight</a>\
          <a href="lockwards.html#e-bats" class="nav-sub-link">E: Guardian Bats</a>\
          <a href="lockwards.html#se-weapon" class="nav-sub-link">SE: Guardian Weapon</a>\
          <a href="lockwards.html#pillars" class="nav-sub-link">6 Pillars Puzzle</a>\
          <a href="lockwards.html#lockwards-section" class="nav-sub-link">The Lockwards</a>\
          <a href="lockwards.html#phantom-jobs" class="nav-sub-link">Phantom Job Responsibilities</a>\
        </div>\
      </div>\
      <div class="nav-divider"></div>\
      <div class="nav-section">\
        <div class="nav-section-label"><span class="nav-badge boss">Boss 4</span></div>\
        <a href="magitaur.html" class="nav-page-link">Magitaur</a>\
        <div class="nav-sub-links">\
          <a href="magitaur.html#overview" class="nav-sub-link">Overview</a>\
          <a href="magitaur.html#simulator" class="nav-sub-link">Simulator</a>\
          <a href="magitaur.html#timeline" class="nav-sub-link">Fight Timeline</a>\
          <a href="magitaur.html#weapon-mechanics" class="nav-sub-link">Weapon Mechanics</a>\
          <a href="magitaur.html#assassins-dagger" class="nav-sub-link">Assassin\'s Dagger</a>\
          <a href="magitaur.html#forked-fury" class="nav-sub-link">Forked Fury</a>\
          <a href="magitaur.html#conduits" class="nav-sub-link">Conduits</a>\
          <a href="magitaur.html#sages-staff" class="nav-sub-link">Sage\'s Staff</a>\
          <a href="magitaur.html#rune-axe" class="nav-sub-link">Rune Axe</a>\
          <a href="magitaur.html#holy-lance" class="nav-sub-link">Holy Lance</a>\
          <a href="magitaur.html#how-to" class="nav-sub-link">How Do We Resolve?</a>\
        </div>\
      </div>\
    </div>\
  </nav>';

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

  var current = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-page-link, .nav-home-link').forEach(function (link) {
    var href = link.getAttribute('href').split('#')[0];
    if (href === current) link.classList.add('nav-current');
  });
})();

