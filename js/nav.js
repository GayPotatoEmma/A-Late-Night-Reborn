(function () {
  var navHTML = '\
  <div class="nav-panel-overlay" id="nav-overlay"></div>\
  <nav class="nav-panel" id="nav-panel" aria-label="Site navigation">\
    <div class="nav-panel-header">\
      <span class="nav-panel-title">Navigation</span>\
      <button class="nav-panel-close" id="nav-close" aria-label="Close navigation">&times;</button>\
    </div>\
    <div class="nav-panel-body">\
      <a href="/" class="nav-home-link"><span>⌂ Home</span></a>\
      <a href="/signups" class="nav-home-link" style="margin-top: 4px;"><span class="material-symbols-outlined" style="font-size: 1.15rem; vertical-align: middle; margin-right: 6px; color: var(--accent-rose);">how_to_reg</span><span>Run Signups</span></a>\
      <div class="nav-divider"></div>\
      <div class="nav-raid-group" id="nav-raid-ftb">\
        <div class="nav-raid-header nav-raid-toggle"><span>Forked Tower: Blood</span><span class="nav-raid-chevron">&#9656;</span></div>\
        <div class="nav-raid-pages">\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 1</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftb/demon-tablet" class="nav-page-link"><span>Demon Tablet</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftb/demon-tablet#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftb/demon-tablet#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="/ftb/demon-tablet#ray-of-expulsion" class="nav-sub-link"><span>Ray of Expulsion Afar / Dangers Near</span></a>\
              <a href="/ftb/demon-tablet#demonograph" class="nav-sub-link"><span>Demonograph of Expulsion Afar / Dangers Near</span></a>\
              <a href="/ftb/demon-tablet#expulsion-reference" class="nav-sub-link"><span>Expulsion Afar / Dangers Near: Reference Images</span></a>\
              <a href="/ftb/demon-tablet#rotate" class="nav-sub-link"><span>Rotate Left / Right</span></a>\
              <a href="/ftb/demon-tablet#cometeor" class="nav-sub-link"><span>Cometeor of Expulsion Afar / Dangers Near</span></a>\
              <a href="/ftb/demon-tablet#summon-adds" class="nav-sub-link"><span>Summon: Adds Phase</span></a>\
              <a href="/ftb/demon-tablet#summon-statues" class="nav-sub-link"><span>Summon: Statues & Stack Towers</span></a>\
              <a href="/ftb/demon-tablet#how-to" class="nav-sub-link"><span>How Do We Resolve Mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftb/hallways" class="nav-page-link"><span>Central Passages</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftb/hallways#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftb/hallways#explosive-traps" class="nav-sub-link"><span>Explosive Traps</span></a>\
              <a href="/ftb/hallways#phantom-jobs" class="nav-sub-link"><span>Phantom Job Responsibilities</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 2</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftb/dead-stars" class="nav-page-link"><span>Dead Stars</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftb/dead-stars#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftb/dead-stars#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="/ftb/dead-stars#slice-n-dice" class="nav-sub-link"><span>Slice \'n\' Dice</span></a>\
              <a href="/ftb/dead-stars#phobos" class="nav-sub-link"><span>Three-Body Problem: Phobos (Slimes)</span></a>\
              <a href="/ftb/dead-stars#jumping-cleaves" class="nav-sub-link"><span>Jumping Cleaves</span></a>\
              <a href="/ftb/dead-stars#delta-attack" class="nav-sub-link"><span>Delta Attack & Firestrike</span></a>\
              <a href="/ftb/dead-stars#nereid" class="nav-sub-link"><span>Three-Body Problem: Nereid (Snowballs)</span></a>\
              <a href="/ftb/dead-stars#triton" class="nav-sub-link"><span>Three-Body Problem: Triton (Fireballs)</span></a>\
              <a href="/ftb/dead-stars#soft-enrage" class="nav-sub-link"><span>Soft Enrage: Six-Handed Fistfight</span></a>\
              <a href="/ftb/dead-stars#how-to" class="nav-sub-link"><span>How Do We Resolve Mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftb/bridges" class="nav-page-link"><span>Pronged Passages</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftb/bridges#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftb/bridges#zone-1" class="nav-sub-link"><span>Zone 1</span></a>\
              <a href="/ftb/bridges#zone-2" class="nav-sub-link"><span>Zone 2</span></a>\
              <a href="/ftb/bridges#zone-3" class="nav-sub-link"><span>Zone 3</span></a>\
              <a href="/ftb/bridges#zone-4" class="nav-sub-link"><span>Zone 4: Progenitor &amp; Progenitrix</span></a>\
              <a href="/ftb/bridges#phantom-jobs" class="nav-sub-link"><span>Phantom Job Responsibilities</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 3</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftb/marble-dragon" class="nav-page-link"><span>Marble Dragon</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftb/marble-dragon#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftb/marble-dragon#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="/ftb/marble-dragon#dread-deluge" class="nav-sub-link"><span>Dread Deluge</span></a>\
              <a href="/ftb/marble-dragon#draconiform" class="nav-sub-link"><span>Draconiform Motion</span></a>\
              <a href="/ftb/marble-dragon#imitation-rain" class="nav-sub-link"><span>Imitation Rain & Imitation Icicle / Frigid Twister</span></a>\
              <a href="/ftb/marble-dragon#adds-eternity" class="nav-sub-link"><span>Add Phase: Withering Eternity</span></a>\
              <a href="/ftb/marble-dragon#adds-party" class="nav-sub-link"><span>Add Phase: Party</span></a>\
              <a href="/ftb/marble-dragon#adds-tank" class="nav-sub-link"><span>Add Phase: Tank</span></a>\
              <a href="/ftb/marble-dragon#wicked-water" class="nav-sub-link"><span>Wicked Water</span></a>\
              <a href="/ftb/marble-dragon#towers" class="nav-sub-link"><span>Towers during Imitation Rain 4</span></a>\
              <a href="/ftb/marble-dragon#how-to" class="nav-sub-link"><span>How do we resolve mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge puzzle">Puzzle</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftb/lockwards" class="nav-page-link"><span>The Binding Lock</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftb/lockwards#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftb/lockwards#nw-golem" class="nav-sub-link"><span>Northwest: Guardian Golem</span></a>\
              <a href="/ftb/lockwards#w-berserker" class="nav-sub-link"><span>West: Guardian Berserker</span></a>\
              <a href="/ftb/lockwards#sw-wraith" class="nav-sub-link"><span>Southwest: Guardian Wraith</span></a>\
              <a href="/ftb/lockwards#ne-knight" class="nav-sub-link"><span>Northeast: Guardian Knight</span></a>\
              <a href="/ftb/lockwards#e-bats" class="nav-sub-link"><span>East: Guardian Bats</span></a>\
              <a href="/ftb/lockwards#se-weapon" class="nav-sub-link"><span>Southeast: Guardian Weapon</span></a>\
              <a href="/ftb/lockwards#pillars" class="nav-sub-link"><span>6 Pillars Puzzle</span></a>\
              <a href="/ftb/lockwards#lockwards-section" class="nav-sub-link"><span>The Lockwards</span></a>\
              <a href="/ftb/lockwards#phantom-jobs" class="nav-sub-link"><span>Phantom Job Responsibilities</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 4</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftb/magitaur" class="nav-page-link"><span>Magitaur</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftb/magitaur#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftb/magitaur#simulator" class="nav-sub-link"><span>Simulator</span></a>\
              <a href="/ftb/magitaur#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="/ftb/magitaur#weapon-mechanics" class="nav-sub-link"><span>Weapon Mechanics: Axe and Lance</span></a>\
              <a href="/ftb/magitaur#assassins-dagger" class="nav-sub-link"><span>Assassin\'s Dagger</span></a>\
              <a href="/ftb/magitaur#forked-fury" class="nav-sub-link"><span>Forked Fury</span></a>\
              <a href="/ftb/magitaur#conduits" class="nav-sub-link"><span>Conduits (Canisters)</span></a>\
              <a href="/ftb/magitaur#sages-staff" class="nav-sub-link"><span>Sage\'s Staff</span></a>\
              <a href="/ftb/magitaur#rune-axe" class="nav-sub-link"><span>Rune Axe</span></a>\
              <a href="/ftb/magitaur#holy-lance" class="nav-sub-link"><span>Holy Lance</span></a>\
              <a href="/ftb/magitaur#how-to" class="nav-sub-link"><span>How do we resolve mechanics?</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge additional">Phantom Job</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftb/phantom-jobs" class="nav-page-link"><span>Phantom Jobs</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftb/phantom-jobs#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftb/phantom-jobs#knight" class="nav-sub-link"><span>Knight</span></a>\
              <a href="/ftb/phantom-jobs#bard" class="nav-sub-link"><span>Bard</span></a>\
              <a href="/ftb/phantom-jobs#geomancer" class="nav-sub-link"><span>Geomancer</span></a>\
              <a href="/ftb/phantom-jobs#time-mage" class="nav-sub-link"><span>Time Mage</span></a>\
              <a href="/ftb/phantom-jobs#thief" class="nav-sub-link"><span>Thief</span></a>\
              <a href="/ftb/phantom-jobs#ranger" class="nav-sub-link"><span>Ranger</span></a>\
              <a href="/ftb/phantom-jobs#samurai" class="nav-sub-link"><span>Samurai</span></a>\
              <a href="/ftb/phantom-jobs#cannoneer" class="nav-sub-link"><span>Cannoneer</span></a>\
              <a href="/ftb/phantom-jobs#dancer" class="nav-sub-link"><span>Dancer</span></a>\
              <a href="/ftb/phantom-jobs#mystic-knight" class="nav-sub-link"><span>Mystic Knight</span></a>\
              <a href="/ftb/phantom-jobs#chemist" class="nav-sub-link"><span>Chemist/White Mage</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge additional">Phantom Job</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftb/phantom-berserker" class="nav-page-link"><span>Phantom Berserker</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftb/phantom-berserker#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftb/phantom-berserker#remove-mit-macros" class="nav-sub-link"><span>Remove Mitigation Macros</span></a>\
              <a href="/ftb/phantom-berserker#boss1" class="nav-sub-link"><span>Boss 1: Demon Tablet</span></a>\
              <a href="/ftb/phantom-berserker#boss2" class="nav-sub-link"><span>Boss 2: Dead Stars</span></a>\
              <a href="/ftb/phantom-berserker#bridges" class="nav-sub-link"><span>Bridges: Progenitor/Progenitrix</span></a>\
              <a href="/ftb/phantom-berserker#boss3" class="nav-sub-link"><span>Boss 3: Marble Dragon</span></a>\
              <a href="/ftb/phantom-berserker#boss4" class="nav-sub-link"><span>Boss 4: Magitaur</span></a>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="nav-divider"></div>\
      <div class="nav-raid-group" id="nav-raid-ftm">\
        <div class="nav-raid-header nav-raid-toggle"><span>Forked Tower: Magic (Extreme)</span><span class="nav-raid-chevron">&#9656;</span></div>\
        <div class="nav-raid-pages">\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 1</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftm/two-headed-aevis" class="nav-page-link"><span>Two-headed Aevis</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftm/two-headed-aevis#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftm/two-headed-aevis#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="/ftm/two-headed-aevis#buffet" class="nav-sub-link"><span>Buffet</span></a>\
              <a href="/ftm/two-headed-aevis#breath-and-fugue" class="nav-sub-link"><span>Breath and Fugue</span></a>\
              <a href="/ftm/two-headed-aevis#blazeloop-and-crossblaze" class="nav-sub-link"><span>Blazeloop and Crossblaze</span></a>\
              <a href="/ftm/two-headed-aevis#arcane-revelation-1" class="nav-sub-link"><span>Arcane Revelation 1</span></a>\
              <a href="/ftm/two-headed-aevis#breathy-duet" class="nav-sub-link"><span>Summon &amp; Breathy Duet</span></a>\
              <a href="/ftm/two-headed-aevis#arcane-revelation-2" class="nav-sub-link"><span>Arcane Revelation 2</span></a>\
              <a href="/ftm/two-headed-aevis#hissing-resonance" class="nav-sub-link"><span>Hissing Resonance</span></a>\
              <a href="/ftm/two-headed-aevis#waymarks" class="nav-sub-link"><span>Waymarks</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftm/bridgeways" class="nav-page-link"><span>Lower Passages</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftm/bridgeways#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftm/bridgeways#explosive-traps" class="nav-sub-link"><span>Explosive Traps &amp; Hazards</span></a>\
              <a href="/ftm/bridgeways#mechanics" class="nav-sub-link"><span>Mechanics &amp; Progression</span></a>\
              <a href="/ftm/bridgeways#phantom-jobs" class="nav-sub-link"><span>Phantom Job Responsibilities</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 2</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftm/sword-dancer" class="nav-page-link"><span>Sword Dancer</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftm/sword-dancer#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftm/sword-dancer#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="/ftm/sword-dancer#throwing-swords" class="nav-sub-link"><span>Throwing Swords &amp; Martial Mystique</span></a>\
              <a href="/ftm/sword-dancer#cycloswords-unsheathed-1" class="nav-sub-link"><span>Cycloswords Unsheathed 1</span></a>\
              <a href="/ftm/sword-dancer#sword-dance" class="nav-sub-link"><span>Sword Dance</span></a>\
              <a href="/ftm/sword-dancer#leaping-lift" class="nav-sub-link"><span>Leaping Lift</span></a>\
              <a href="/ftm/sword-dancer#cycloswords-unsheathed-2" class="nav-sub-link"><span>Cycloswords Unsheathed 2</span></a>\
              <a href="/ftm/sword-dancer#cycloswords-unsheathed-3" class="nav-sub-link"><span>Cycloswords Unsheathed 3</span></a>\
              <a href="/ftm/sword-dancer#waymarks" class="nav-sub-link"><span>Waymarks</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge traversal">Traversal</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftm/bridge" class="nav-page-link"><span>Central Mezzanine</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftm/bridge#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftm/bridge#explosive-traps" class="nav-sub-link"><span>Explosive Traps</span></a>\
              <a href="/ftm/bridge#secret-nook" class="nav-sub-link"><span>Secret Nook &amp; Entrap</span></a>\
              <a href="/ftm/bridge#mechanics" class="nav-sub-link"><span>Mechanics &amp; Progression</span></a>\
              <a href="/ftm/bridge#phantom-jobs" class="nav-sub-link"><span>Phantom Job Responsibilities</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge mini-boss">Mini Boss</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftm/storm-generators" class="nav-page-link"><span>Storm Generators</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftm/storm-generators#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftm/storm-generators#cyclops" class="nav-sub-link"><span>Cyclops</span></a>\
              <a href="/ftm/storm-generators#slimes" class="nav-sub-link"><span>Slimes</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 3</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftm/necrophobia" class="nav-page-link"><span>Necrophobia</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftm/necrophobia#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftm/necrophobia#simulator" class="nav-sub-link"><span>Simulator</span></a>\
              <a href="/ftm/necrophobia#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="/ftm/necrophobia#death-shroud-1" class="nav-sub-link"><span>Death Shroud 1</span></a>\
              <a href="/ftm/necrophobia#dark-current" class="nav-sub-link"><span>Dark Current &amp; Vacuum Wave</span></a>\
              <a href="/ftm/necrophobia#death-shroud-2" class="nav-sub-link"><span>Death Shroud 2</span></a>\
              <a href="/ftm/necrophobia#fertile-ground" class="nav-sub-link"><span>Fertile Ground</span></a>\
              <a href="/ftm/necrophobia#waymarks" class="nav-sub-link"><span>Waymarks</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge puzzle">Puzzle</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftm/clockwards" class="nav-page-link"><span>Tower Curseclocks</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftm/clockwards#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftm/clockwards#the-puzzle" class="nav-sub-link"><span>The Puzzle</span></a>\
              <a href="/ftm/clockwards#lockward" class="nav-sub-link"><span>Lockward</span></a>\
              <a href="/ftm/clockwards#calculator" class="nav-sub-link"><span>Calculator</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Boss 4</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftm/the-index" class="nav-page-link"><span>The Index</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftm/the-index#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftm/the-index#timeline" class="nav-sub-link"><span>Fight Timeline</span></a>\
              <a href="/ftm/the-index#quadrilogy" class="nav-sub-link"><span>Quadrilogy of Implements</span></a>\
              <a href="/ftm/the-index#all-knowing-flames" class="nav-sub-link"><span>All-Knowing Flames</span></a>\
              <a href="/ftm/the-index#elemental-rings" class="nav-sub-link"><span>Elemental Rings</span></a>\
              <a href="/ftm/the-index#elementary-expansion" class="nav-sub-link"><span>Elementary Expansion</span></a>\
              <a href="/ftm/the-index#elementary-chemistry" class="nav-sub-link"><span>Elementary Chemistry</span></a>\
              <a href="/ftm/the-index#summon" class="nav-sub-link"><span>Summon</span></a>\
              <a href="/ftm/the-index#elementary-evocation" class="nav-sub-link"><span>Elementary Evocation</span></a>\
              <a href="/ftm/the-index#mitigation" class="nav-sub-link"><span>Mitigation</span></a>\
              <a href="/ftm/the-index#waymarks" class="nav-sub-link"><span>Waymarks</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge additional">Phantom Job</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/ftm/phantom-jobs" class="nav-page-link"><span>Phantom Jobs</span></a>\
            <div class="nav-sub-links">\
              <a href="/ftm/phantom-jobs#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/ftm/phantom-jobs#knight" class="nav-sub-link"><span>Knight</span></a>\
              <a href="/ftm/phantom-jobs#bard" class="nav-sub-link"><span>Bard</span></a>\
              <a href="/ftm/phantom-jobs#time-mage" class="nav-sub-link"><span>Time Mage</span></a>\
              <a href="/ftm/phantom-jobs#thief" class="nav-sub-link"><span>Thief</span></a>\
              <a href="/ftm/phantom-jobs#ranger" class="nav-sub-link"><span>Ranger</span></a>\
              <a href="/ftm/phantom-jobs#samurai" class="nav-sub-link"><span>Samurai</span></a>\
              <a href="/ftm/phantom-jobs#cannoneer" class="nav-sub-link"><span>Cannoneer</span></a>\
              <a href="/ftm/phantom-jobs#dancer" class="nav-sub-link"><span>Dancer</span></a>\
              <a href="/ftm/phantom-jobs#mystic-knight" class="nav-sub-link"><span>Mystic Knight</span></a>\
              <a href="/ftm/phantom-jobs#chemist" class="nav-sub-link"><span>Chemist/White Mage</span></a>\
              <a href="/ftm/phantom-jobs#black-mage" class="nav-sub-link"><span>Black Mage</span></a>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="nav-divider"></div>\
      <div class="nav-raid-group" id="nav-raid-cod">\
        <div class="nav-raid-header nav-raid-toggle"><span>Cloud of Darkness (Chaotic)</span><span class="nav-raid-chevron">&#9656;</span></div>\
        <div class="nav-raid-pages">\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Phase 0</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/chaotic/phase-0" class="nav-page-link"><span>Phase 0</span></a>\
            <div class="nav-sub-links">\
              <a href="/chaotic/phase-0#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/chaotic/phase-0#timeline" class="nav-sub-link"><span>Phase Timeline</span></a>\
              <a href="/chaotic/phase-0#blade-of-darkness" class="nav-sub-link"><span>Blade of Darkness</span></a>\
              <a href="/chaotic/phase-0#deluge-of-darkness" class="nav-sub-link"><span>Deluge of Darkness</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Phase 1</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/chaotic/phase-1" class="nav-page-link"><span>Phase 1 (Diamond)</span></a>\
            <div class="nav-sub-links">\
              <a href="/chaotic/phase-1#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/chaotic/phase-1#timeline" class="nav-sub-link"><span>Phase Timeline</span></a>\
              <a href="/chaotic/phase-1#auto-attacks" class="nav-sub-link"><span>Auto-Attacks & Tank Swap</span></a>\
              <a href="/chaotic/phase-1#grim-embrace" class="nav-sub-link"><span>Grim Embrace</span></a>\
              <a href="/chaotic/phase-1#cloudlets" class="nav-sub-link"><span>Cloudlets & Lasers</span></a>\
              <a href="/chaotic/phase-1#flares-and-unholy" class="nav-sub-link"><span>Flares & Unholy Darkness</span></a>\
              <a href="/chaotic/phase-1#rapid-sequence" class="nav-sub-link"><span>Rapid-Sequence Particle Beam</span></a>\
              <a href="/chaotic/phase-1#break-iv" class="nav-sub-link"><span>Break IV (Sinister Eyes)</span></a>\
              <a href="/chaotic/phase-1#stored-spells" class="nav-sub-link"><span>Stored Enaero & Endeath</span></a>\
            </div>\
          </div>\
          <div class="nav-section">\
            <div class="nav-section-label nav-section-toggle"><span class="nav-badge boss">Phase 2</span><span class="nav-chevron">&#9656;</span></div>\
            <a href="/chaotic/phase-2" class="nav-page-link"><span>Phase 2 (Tiles)</span></a>\
            <div class="nav-sub-links">\
              <a href="/chaotic/phase-2#overview" class="nav-sub-link"><span>Overview</span></a>\
              <a href="/chaotic/phase-2#timeline" class="nav-sub-link"><span>Phase Timeline</span></a>\
              <a href="/chaotic/phase-2#tile-rules" class="nav-sub-link"><span>Tiles</span></a>\
              <a href="/chaotic/phase-2#third-art-of-darkness" class="nav-sub-link"><span>The Third Art of Darkness</span></a>\
              <a href="/chaotic/phase-2#particle-concentration" class="nav-sub-link"><span>Particle Concentration</span></a>\
              <a href="/chaotic/phase-2#ghastly-gloom" class="nav-sub-link"><span>Ghastly Gloom</span></a>\
              <a href="/chaotic/phase-2#curse-of-darkness" class="nav-sub-link"><span>Curse of Darkness</span></a>\
              <a href="/chaotic/phase-2#seeds-and-vines" class="nav-sub-link"><span>Evil Seeds & Thorny Vine</span></a>\
              <a href="/chaotic/phase-2#spread-and-stacks" class="nav-sub-link"><span>Spread AoEs & Line Stacks</span></a>\
              <a href="/chaotic/phase-2#active-pivot" class="nav-sub-link"><span>Active-Pivot Particle Beam</span></a>\
              <a href="/chaotic/phase-2#looming-chaos" class="nav-sub-link"><span>Looming Chaos (Swap)</span></a>\
              <a href="/chaotic/phase-2#feint-particle-beam" class="nav-sub-link"><span>Feint Particle Beam</span></a>\
              <a href="/chaotic/phase-2#evaporation" class="nav-sub-link"><span>Evaporation</span></a>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>\
  </nav>';

  // Address bar cleaner: strip .html extension if directly visited
  if (window.location.protocol !== 'file:' && window.location.pathname.endsWith('.html')) {
    var cleanPath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
  }

  var isFile = window.location.protocol === 'file:';
  var inFTB = window.location.pathname.indexOf('/ftb/') !== -1;
  var inFTM = window.location.pathname.indexOf('/ftm/') !== -1;
  var inCOD = window.location.pathname.indexOf('/chaotic/') !== -1;
  if (isFile) {
    var prefix = (inFTB || inFTM || inCOD) ? '../' : './';
    navHTML = navHTML
      .replace('href="/" class="nav-home-link"', 'href="' + prefix + 'index.html" class="nav-home-link"')
      .replace(/href="\/(ftb|ftm|chaotic)\/([^"#]+)(#[^"]*)?"/g, function (m, folder, page, hash) {
        return 'href="' + prefix + folder + '/' + page + '.html' + (hash || '') + '"';
      });
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

  var currentPath = window.location.pathname
    .replace(/\/index\.html$|\/index$|\.html$/, '')
    .replace(/\/$/, '') || '/';

  document.querySelectorAll('.nav-page-link, .nav-home-link').forEach(function (link) {
    var hrefAttr = link.getAttribute('href');
    if (!hrefAttr) return;
    var linkPath = hrefAttr.split('#')[0]
      .replace(/^\.\.\//, '/')
      .replace(/^[^\/]/, '/$&')
      .replace(/\/index\.html$|\/index$|\.html$/, '')
      .replace(/\/$/, '') || '/';

    if (linkPath === currentPath) {
      link.classList.add('nav-current');
      var section = link.closest('.nav-section');
      if (section) section.classList.add('expanded');
      var raidGroup = link.closest('.nav-raid-group');
      if (raidGroup) raidGroup.classList.add('expanded');
    }
  });
})();
