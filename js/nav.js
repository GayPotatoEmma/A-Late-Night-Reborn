(function () {
  var navHTML = '\
  <div class="nav-panel-overlay" id="nav-overlay"></div>\
  <nav class="nav-panel" id="nav-panel" aria-label="Site navigation">\
    <div class="nav-panel-header">\
      <span class="nav-panel-title">Navigation</span>\
      <button class="nav-panel-close" id="nav-close" aria-label="Close navigation">&times;</button>\
    </div>\
    <div class="nav-panel-body">\
      <a href="index.html" class="nav-home-link"><span>⌂ Home</span></a>\
      <div class="nav-divider"></div>\
      <div class="nav-raid-group" id="nav-raid-ftb">\
        <div class="nav-raid-header nav-raid-toggle"><span>Forked Tower: Blood</span><span class="nav-raid-chevron">&#9656;</span></div>\
        <div class="nav-raid-pages">\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 1</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/demon-tablet.html" class="nav-page-link"><span>Demon Tablet</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/demon-tablet.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftb/demon-tablet.html#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="ftb/demon-tablet.html#ray-of-expulsion" class="nav-sub-link"><span>Ray of Expulsion Afar / Dangers Near</span></a>\
              <a href="ftb/demon-tablet.html#demonograph" class="nav-sub-link"><span>Demonograph of Expulsion Afar / Dangers Near</span></a>\
              <a href="ftb/demon-tablet.html#expulsion-reference" class="nav-sub-link"><span>Expulsion Afar / Dangers Near: Reference Images</span></a>\
              <a href="ftb/demon-tablet.html#rotate" class="nav-sub-link"><span>Rotate Left / Right</span></a>\
              <a href="ftb/demon-tablet.html#cometeor" class="nav-sub-link"><span>Cometeor of Expulsion Afar / Dangers Near</span></a>\
              <a href="ftb/demon-tablet.html#summon-adds" class="nav-sub-link"><span>Summon: Adds Phase</span></a>\
              <a href="ftb/demon-tablet.html#summon-statues" class="nav-sub-link"><span>Summon: Statues & Stack Towers</span></a>\
              <a href="ftb/demon-tablet.html#how-to" class="nav-sub-link"><span>How Do We Resolve Mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/hallways.html" class="nav-page-link"><span>Central Passages</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/hallways.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftb/hallways.html#explosive-traps" class="nav-sub-link"><span>Explosive Traps</span></a>\
              <a href="ftb/hallways.html#phantom-jobs" class="nav-sub-link"><span>Phantom Job Responsibilities</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 2</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/dead-stars.html" class="nav-page-link"><span>Dead Stars</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/dead-stars.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftb/dead-stars.html#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="ftb/dead-stars.html#slice-n-dice" class="nav-sub-link"><span>Slice \'n\' Dice</span></a>\
              <a href="ftb/dead-stars.html#phobos" class="nav-sub-link"><span>Three-Body Problem: Phobos (Slimes)</span></a>\
              <a href="ftb/dead-stars.html#jumping-cleaves" class="nav-sub-link"><span>Jumping Cleaves</span></a>\
              <a href="ftb/dead-stars.html#delta-attack" class="nav-sub-link"><span>Delta Attack & Firestrike</span></a>\
              <a href="ftb/dead-stars.html#nereid" class="nav-sub-link"><span>Three-Body Problem: Nereid (Snowballs)</span></a>\
              <a href="ftb/dead-stars.html#triton" class="nav-sub-link"><span>Three-Body Problem: Triton (Fireballs)</span></a>\
              <a href="ftb/dead-stars.html#soft-enrage" class="nav-sub-link"><span>Soft Enrage: Six-Handed Fistfight</span></a>\
              <a href="ftb/dead-stars.html#how-to" class="nav-sub-link"><span>How Do We Resolve Mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/bridges.html" class="nav-page-link"><span>Pronged Passages</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/bridges.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftb/bridges.html#zone-1" class="nav-sub-link"><span>Zone 1</span></a>\
              <a href="ftb/bridges.html#zone-2" class="nav-sub-link"><span>Zone 2</span></a>\
              <a href="ftb/bridges.html#zone-3" class="nav-sub-link"><span>Zone 3</span></a>\
              <a href="ftb/bridges.html#zone-4" class="nav-sub-link"><span>Zone 4: Progenitor &amp; Progenitrix</span></a>\
              <a href="ftb/bridges.html#phantom-jobs" class="nav-sub-link"><span>Phantom Job Responsibilities</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 3</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/marble-dragon.html" class="nav-page-link"><span>Marble Dragon</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/marble-dragon.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftb/marble-dragon.html#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="ftb/marble-dragon.html#dread-deluge" class="nav-sub-link"><span>Dread Deluge</span></a>\
              <a href="ftb/marble-dragon.html#draconiform" class="nav-sub-link"><span>Draconiform Motion</span></a>\
              <a href="ftb/marble-dragon.html#imitation-rain" class="nav-sub-link"><span>Imitation Rain & Imitation Icicle / Frigid Twister</span></a>\
              <a href="ftb/marble-dragon.html#adds-eternity" class="nav-sub-link"><span>Add Phase: Withering Eternity</span></a>\
              <a href="ftb/marble-dragon.html#adds-party" class="nav-sub-link"><span>Add Phase: Party</span></a>\
              <a href="ftb/marble-dragon.html#adds-tank" class="nav-sub-link"><span>Add Phase: Tank</span></a>\
              <a href="ftb/marble-dragon.html#wicked-water" class="nav-sub-link"><span>Wicked Water</span></a>\
              <a href="ftb/marble-dragon.html#towers" class="nav-sub-link"><span>Towers during Imitation Rain 4</span></a>\
              <a href="ftb/marble-dragon.html#how-to" class="nav-sub-link"><span>How do we resolve mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge puzzle">Puzzle</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/lockwards.html" class="nav-page-link"><span>The Binding Lock</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/lockwards.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftb/lockwards.html#nw-golem" class="nav-sub-link"><span>Northwest: Guardian Golem</span></a>\
              <a href="ftb/lockwards.html#w-berserker" class="nav-sub-link"><span>West: Guardian Berserker</span></a>\
              <a href="ftb/lockwards.html#sw-wraith" class="nav-sub-link"><span>Southwest: Guardian Wraith</span></a>\
              <a href="ftb/lockwards.html#ne-knight" class="nav-sub-link"><span>Northeast: Guardian Knight</span></a>\
              <a href="ftb/lockwards.html#e-bats" class="nav-sub-link"><span>East: Guardian Bats</span></a>\
              <a href="ftb/lockwards.html#se-weapon" class="nav-sub-link"><span>Southeast: Guardian Weapon</span></a>\
              <a href="ftb/lockwards.html#pillars" class="nav-sub-link"><span>6 Pillars Puzzle</span></a>\
              <a href="ftb/lockwards.html#lockwards-section" class="nav-sub-link"><span>The Lockwards</span></a>\
              <a href="ftb/lockwards.html#phantom-jobs" class="nav-sub-link"><span>Phantom Job Responsibilities</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 4</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/magitaur.html" class="nav-page-link"><span>Magitaur</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/magitaur.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftb/magitaur.html#simulator" class="nav-sub-link"><span>Simulator</span></a>\
              <a href="ftb/magitaur.html#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="ftb/magitaur.html#weapon-mechanics" class="nav-sub-link"><span>Weapon Mechanics: Axe and Lance</span></a>\
              <a href="ftb/magitaur.html#assassins-dagger" class="nav-sub-link"><span>Assassin\'s Dagger</span></a>\
              <a href="ftb/magitaur.html#forked-fury" class="nav-sub-link"><span>Forked Fury</span></a>\
              <a href="ftb/magitaur.html#conduits" class="nav-sub-link"><span>Conduits (Canisters)</span></a>\
              <a href="ftb/magitaur.html#sages-staff" class="nav-sub-link"><span>Sage\'s Staff</span></a>\
              <a href="ftb/magitaur.html#rune-axe" class="nav-sub-link"><span>Rune Axe</span></a>\
              <a href="ftb/magitaur.html#holy-lance" class="nav-sub-link"><span>Holy Lance</span></a>\
              <a href="ftb/magitaur.html#how-to" class="nav-sub-link"><span>How do we resolve mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge additional">Phantom Job</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/phantom-jobs.html" class="nav-page-link"><span>Phantom Jobs</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/phantom-jobs.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftb/phantom-jobs.html#knight" class="nav-sub-link"><span>Knight</span></a>\
              <a href="ftb/phantom-jobs.html#bard" class="nav-sub-link"><span>Bard</span></a>\
              <a href="ftb/phantom-jobs.html#geomancer" class="nav-sub-link"><span>Geomancer</span></a>\
              <a href="ftb/phantom-jobs.html#time-mage" class="nav-sub-link"><span>Time Mage</span></a>\
              <a href="ftb/phantom-jobs.html#thief" class="nav-sub-link"><span>Thief</span></a>\
              <a href="ftb/phantom-jobs.html#ranger" class="nav-sub-link"><span>Ranger</span></a>\
              <a href="ftb/phantom-jobs.html#samurai" class="nav-sub-link"><span>Samurai</span></a>\
              <a href="ftb/phantom-jobs.html#cannoneer" class="nav-sub-link"><span>Cannoneer</span></a>\
              <a href="ftb/phantom-jobs.html#dancer" class="nav-sub-link"><span>Dancer</span></a>\
              <a href="ftb/phantom-jobs.html#mystic-knight" class="nav-sub-link"><span>Mystic Knight</span></a>\
              <a href="ftb/phantom-jobs.html#chemist" class="nav-sub-link"><span>Chemist/White Mage</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge additional">Phantom Job</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftb/phantom-berserker.html" class="nav-page-link"><span>Phantom Berserker</span></a>\
            <div class="nav-sub-links">\
              <a href="ftb/phantom-berserker.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftb/phantom-berserker.html#remove-mit-macros" class="nav-sub-link"><span>Remove Mitigation Macros</span></a>\
              <a href="ftb/phantom-berserker.html#boss1" class="nav-sub-link"><span>Boss 1: Demon Tablet</span></a>\
              <a href="ftb/phantom-berserker.html#boss2" class="nav-sub-link"><span>Boss 2: Dead Stars</span></a>\
              <a href="ftb/phantom-berserker.html#bridges" class="nav-sub-link"><span>Bridges: Progenitor/Progenitrix</span></a>\
              <a href="ftb/phantom-berserker.html#boss3" class="nav-sub-link"><span>Boss 3: Marble Dragon</span></a>\
              <a href="ftb/phantom-berserker.html#boss4" class="nav-sub-link"><span>Boss 4: Magitaur</span></a>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="nav-divider"></div>\
      <div class="nav-raid-group" id="nav-raid-ftm">\
        <div class="nav-raid-header nav-raid-toggle"><span>Forked Tower: Magic</span><span class="nav-raid-chevron">&#9656;</span></div>\
        <div class="nav-raid-pages">\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 1</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftm/two-headed-aevis.html" class="nav-page-link"><span>Two-headed Aevis</span></a>\
            <div class="nav-sub-links">\
              <a href="ftm/two-headed-aevis.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftm/two-headed-aevis.html#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="ftm/two-headed-aevis.html#buffet" class="nav-sub-link"><span>Buffet</span></a>\
              <a href="ftm/two-headed-aevis.html#breath-and-fugue" class="nav-sub-link"><span>Breath and Fugue</span></a>\
              <a href="ftm/two-headed-aevis.html#blazeloop-and-crossblaze" class="nav-sub-link"><span>Blazeloop and Crossblaze</span></a>\
              <a href="ftm/two-headed-aevis.html#arcane-revelation-1" class="nav-sub-link"><span>Arcane Revelation 1</span></a>\
              <a href="ftm/two-headed-aevis.html#breathy-duet" class="nav-sub-link"><span>Summon &amp; Breathy Duet</span></a>\
              <a href="ftm/two-headed-aevis.html#arcane-revelation-2" class="nav-sub-link"><span>Arcane Revelation 2</span></a>\
              <a href="ftm/two-headed-aevis.html#hissing-resonance" class="nav-sub-link"><span>Hissing Resonance</span></a>\
              <a href="ftm/two-headed-aevis.html#waymarks" class="nav-sub-link"><span>Waymarks</span></a>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 2</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftm/sword-dancer.html" class="nav-page-link"><span>Sword Dancer</span></a>\
            <div class="nav-sub-links">\
              <a href="ftm/sword-dancer.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftm/sword-dancer.html#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="ftm/sword-dancer.html#throwing-swords" class="nav-sub-link"><span>Throwing Swords &amp; Martial Mystique</span></a>\
              <a href="ftm/sword-dancer.html#cycloswords-unsheathed-1" class="nav-sub-link"><span>Cycloswords Unsheathed 1</span></a>\
              <a href="ftm/sword-dancer.html#sword-dance" class="nav-sub-link"><span>Sword Dance</span></a>\
              <a href="ftm/sword-dancer.html#leaping-lift" class="nav-sub-link"><span>Leaping Lift</span></a>\
              <a href="ftm/sword-dancer.html#cycloswords-unsheathed-2" class="nav-sub-link"><span>Cycloswords Unsheathed 2</span></a>\
              <a href="ftm/sword-dancer.html#cycloswords-unsheathed-3" class="nav-sub-link"><span>Cycloswords Unsheathed 3</span></a>\
              <a href="ftm/sword-dancer.html#waymarks" class="nav-sub-link"><span>Waymarks</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge mini-boss">Mini Boss</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftm/storm-generators.html" class="nav-page-link"><span>Storm Generators</span></a>\
            <div class="nav-sub-links">\
              <a href="ftm/storm-generators.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftm/storm-generators.html#cyclops" class="nav-sub-link"><span>Cyclops</span></a>\
              <a href="ftm/storm-generators.html#slimes" class="nav-sub-link"><span>Slimes</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label"><span class="nav-badge boss">Boss 3</span></div>\
            <a class="nav-page-link wip"><span>Necrophobia</span></a>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge additional">Phantom Job</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="ftm/phantom-jobs.html" class="nav-page-link"><span>Phantom Jobs</span></a>\
            <div class="nav-sub-links">\
              <a href="ftm/phantom-jobs.html#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="ftm/phantom-jobs.html#knight" class="nav-sub-link"><span>Knight</span></a>\
              <a href="ftm/phantom-jobs.html#bard" class="nav-sub-link"><span>Bard</span></a>\
              <a href="ftm/phantom-jobs.html#time-mage" class="nav-sub-link"><span>Time Mage</span></a>\
              <a href="ftm/phantom-jobs.html#thief" class="nav-sub-link"><span>Thief</span></a>\
              <a href="ftm/phantom-jobs.html#ranger" class="nav-sub-link"><span>Ranger</span></a>\
              <a href="ftm/phantom-jobs.html#samurai" class="nav-sub-link"><span>Samurai</span></a>\
              <a href="ftm/phantom-jobs.html#cannoneer" class="nav-sub-link"><span>Cannoneer</span></a>\
              <a href="ftm/phantom-jobs.html#dancer" class="nav-sub-link"><span>Dancer</span></a>\
              <a href="ftm/phantom-jobs.html#mystic-knight" class="nav-sub-link"><span>Mystic Knight</span></a>\
              <a href="ftm/phantom-jobs.html#chemist" class="nav-sub-link"><span>Chemist/White Mage</span></a>\
              <a href="ftm/phantom-jobs.html#black-mage" class="nav-sub-link"><span>Black Mage</span></a>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>\
  </nav>';

  var inFTB = window.location.pathname.indexOf('/ftb/') !== -1;
  var inFTM = window.location.pathname.indexOf('/ftm/') !== -1;
  if (inFTB || inFTM) {
    navHTML = navHTML
      .replace('href="index.html" class="nav-home-link"', 'href="../index.html" class="nav-home-link"')
      .replace(/href="ftb\//g, 'href="../ftb/')
      .replace(/href="ftm\//g, 'href="../ftm/');
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
