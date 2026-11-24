// A Late Night Reborn - Static Raid, Role, Job & Progression Definitions
(function () {
  var CONTENT_TYPES = ['Chaotic', 'FT:B', 'FT:M', 'BA', 'DRS'];
  var CONTENT_SCHEMA_VERSIONS = {
    'Chaotic': 1,
    'FT:B': 1,
    'FT:M': 1,
    'BA': 1,
    'DRS': 1
  };

  var BA_LOGOS_ACTIONS = [
    'Perception (Finding Traps)',
    'Spirit Dart (Vulnerability)',
    'Feint (Evasion)',
    'Dispel (Buff Removal)',
    'Bravery (Buffs)',
    'Refresh (Magia Wheel)'
  ];

  var DRS_LOST_ACTIONS = [
    'Perception (Finding Traps)',
    'Rend Armor (Vulnerability)',
    'Banish (Phantom Vulnerability)',
    'Flare Star (BLM DoT)',
    'Dispel (Buff Removal)',
    'Cure IV (Party Bravery)'
  ];

  var DRS_DUEL_OPTIONS = [
    'No',
    "Yes and I'm experienced",
    "Yes but it's my first time"
  ];

  function getPartyOptionsForContent(contentType) {
    if (contentType === 'Chaotic') {
      return [
        { value: 'Any', label: 'Any Party' },
        { value: 'A', label: 'Party A' },
        { value: 'B', label: 'Party B' },
        { value: 'C', label: 'Party C' }
      ];
    } else if (contentType === 'DRS') {
      return [
        { value: 'Any', label: 'Any Party' },
        { value: 'A (Slimes)', label: 'A (Slimes)' },
        { value: 'B (Slimes)', label: 'B (Slimes)' },
        { value: 'C (Slimes)', label: 'C (Slimes)' },
        { value: '1 (Golems)', label: '1 (Golems)' },
        { value: '2 (Golems)', label: '2 (Golems)' },
        { value: '3 (Golems)', label: '3 (Golems)' }
      ];
    }
    return [
      { value: 'Any', label: 'Any Party' },
      { value: 'A', label: 'Party A' },
      { value: 'B', label: 'Party B' },
      { value: 'C', label: 'Party C' },
      { value: '1', label: 'Party 1' },
      { value: '2', label: 'Party 2' },
      { value: '3', label: 'Party 3' }
    ];
  }

  var ALL_ROLES = [
    { id: 'Tank', label: 'Tank', class: 'role-tank' },
    { id: 'Regen Healer', label: 'Regen Healer', class: 'role-healer' },
    { id: 'Shield Healer', label: 'Shield Healer', class: 'role-healer' },
    { id: 'Melee DPS', label: 'Melee DPS', class: 'role-dps' },
    { id: 'Magical DPS', label: 'Magical DPS', class: 'role-dps' },
    { id: 'Physical Ranged DPS', label: 'Physical Ranged', class: 'role-dps' },
    { id: 'Any', label: 'Any Role', class: 'role-any' }
  ];

  var REGEN_HEALER_JOBS = ['White Mage', 'Astrologian'];
  var SHIELD_HEALER_JOBS = ['Scholar', 'Sage'];

  var JOBS_BY_ROLE = {
    'Tank': ['Paladin', 'Warrior', 'Dark Knight', 'Gunbreaker'],
    'Healer': ['White Mage', 'Astrologian', 'Scholar', 'Sage'],
    'Melee DPS': ['Monk', 'Dragoon', 'Ninja', 'Samurai', 'Reaper', 'Viper'],
    'Magical DPS': ['Black Mage', 'Summoner', 'Red Mage', 'Pictomancer'],
    'Physical Ranged DPS': ['Bard', 'Machinist', 'Dancer']
  };

  var PHANTOM_JOBS = [
    'Bard', 'Berserker', 'Black Mage', 'Blue Mage', 'Cannoneer',
    'Chemist', 'Dancer', 'Dragoon', 'Geomancer', 'Gladiator',
    'Knight', 'Monk', 'Mystic Knight', 'Necromancer', 'Ninja',
    'Oracle', 'Ranger', 'Red Mage', 'Samurai', 'Summoner',
    'Thief', 'Time Mage', 'White Mage'
  ];

  var PROG_OPTIONS = {
    'Chaotic': [
      'No Experience', 'Seen Phase 2 - Swaps', 'Seen Enrage',
      'Cleared 1-4 times', 'Cleared 5+ times'
    ],
    'FT:B': [
      'No Experience', 'Seen Dead Stars', 'Seen Bridges', 'Seen Marble Dragon',
      'Seen Magitaur', 'Clear Ready: Seen Magitaur - Holy Lance',
      'Cleared 1-4 times', 'Cleared 5+ times'
    ],
    'FT:M': [
      'No Experience', 'Seen Twin Snakes', 'Seen Sword Dancer', 'Seen Platforms',
      'Seen Necrophobia', 'Seen Index', 'Cleared 1-4 times', 'Cleared 5+ times'
    ],
    'BA': [
      'No Experience', 'Seen Raiden', 'Seen Absolute Virtue', 'Seen Ozma',
      'Cleared 1-4 times', 'Cleared 5+ times'
    ],
    'DRS': [
      'No Experience', 'Seen Trinity Seeker', "Seen Queen's Guard",
      'Seen Trinity Avowed', 'Seen the Queen', 'Cleared 1-4 times', 'Cleared 5+ times'
    ]
  };

  window.ALNR_SIGNUP_DATA = {
    PREFS_STORAGE_KEY: 'alnr_signup_preferences_v1',
    CONTENT_TYPES: CONTENT_TYPES,
    CONTENT_SCHEMA_VERSIONS: CONTENT_SCHEMA_VERSIONS,
    BA_LOGOS_ACTIONS: BA_LOGOS_ACTIONS,
    DRS_LOST_ACTIONS: DRS_LOST_ACTIONS,
    DRS_DUEL_OPTIONS: DRS_DUEL_OPTIONS,
    getPartyOptionsForContent: getPartyOptionsForContent,
    ALL_ROLES: ALL_ROLES,
    REGEN_HEALER_JOBS: REGEN_HEALER_JOBS,
    SHIELD_HEALER_JOBS: SHIELD_HEALER_JOBS,
    JOBS_BY_ROLE: JOBS_BY_ROLE,
    PHANTOM_JOBS: PHANTOM_JOBS,
    PROG_OPTIONS: PROG_OPTIONS
  };
})();
