#!/usr/bin/env node
// A Late Night Reborn - Dreamscape Option A OpenGraph Card Generator (1200x630)
// Usage: node scripts/generate-og-cards.js

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'assets', 'og');
fs.mkdirSync(outDir, { recursive: true });

const logoPath = path.join(root, 'assets', 'alnr logo.png');
const logoB64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');

function findBrowser() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('Could not find Chrome or Edge executable for headless rendering.');
}

const BROWSER = findBrowser();

const THEMES = {
  home:    { accent: '#fdd4c9', glow: 'rgba(178, 139, 248, 0.34)' },
  signups: { accent: '#ebd09b', glow: 'rgba(235, 208, 155, 0.30)' },
  ftb:     { accent: '#f26b7c', glow: 'rgba(242, 107, 124, 0.34)' },
  ftm:     { accent: '#b28bf8', glow: 'rgba(178, 139, 248, 0.36)' },
  chaotic: { accent: '#34d399', glow: 'rgba(52, 211, 153, 0.30)' },
  ba:      { accent: '#6cb4f5', glow: 'rgba(108, 180, 245, 0.30)' },
  drs:     { accent: '#f2c56b', glow: 'rgba(242, 197, 107, 0.30)' }
};

const PAGES = [
  // Root pages
  { html: 'index.html',               slug: 'home',                  section: 'FFXIV Raid Community',         title: 'A Late Night Reborn', theme: 'home',    url: 'alatenightreborn.com' },
  { html: 'signups.html',             slug: 'signups',               section: 'Weekly Community Runs',        title: 'Run Signups',         theme: 'signups', url: 'alatenightreborn.com/signups' },
  { html: 'profile.html',             slug: 'profile',               section: 'Raider Profile',               title: 'My Profile',          theme: 'home',    url: 'alatenightreborn.com/profile' },
  { html: 'contact.html',             slug: 'contact',               section: 'Community Support',            title: 'Contact Us',          theme: 'home',    url: 'alatenightreborn.com/contact' },
  { html: 'privacy.html',             slug: 'privacy',               section: 'Site Policy',                  title: 'Privacy Notice',      theme: 'home',    url: 'alatenightreborn.com/privacy' },

  // Forked Tower: Blood
  { html: 'ftb/demon-tablet.html',      slug: 'ftb-demon-tablet',      section: 'Forked Tower: Blood', title: 'Demon Tablet',       theme: 'ftb', url: 'alatenightreborn.com/ftb/demon-tablet' },
  { html: 'ftb/hallways.html',          slug: 'ftb-hallways',          section: 'Forked Tower: Blood', title: 'Central Passages',   theme: 'ftb', url: 'alatenightreborn.com/ftb/hallways' },
  { html: 'ftb/dead-stars.html',        slug: 'ftb-dead-stars',        section: 'Forked Tower: Blood', title: 'Dead Stars',         theme: 'ftb', url: 'alatenightreborn.com/ftb/dead-stars' },
  { html: 'ftb/lockwards.html',         slug: 'ftb-lockwards',         section: 'Forked Tower: Blood', title: 'The Binding Lock',   theme: 'ftb', url: 'alatenightreborn.com/ftb/lockwards' },
  { html: 'ftb/bridges.html',           slug: 'ftb-bridges',           section: 'Forked Tower: Blood', title: 'Pronged Passages',   theme: 'ftb', url: 'alatenightreborn.com/ftb/bridges' },
  { html: 'ftb/marble-dragon.html',     slug: 'ftb-marble-dragon',     section: 'Forked Tower: Blood', title: 'Marble Dragon',      theme: 'ftb', url: 'alatenightreborn.com/ftb/marble-dragon' },
  { html: 'ftb/magitaur.html',          slug: 'ftb-magitaur',          section: 'Forked Tower: Blood', title: 'Magitaur',           theme: 'ftb', url: 'alatenightreborn.com/ftb/magitaur' },
  { html: 'ftb/phantom-jobs.html',      slug: 'ftb-phantom-jobs',      section: 'Forked Tower: Blood', title: 'Phantom Jobs',       theme: 'ftb', url: 'alatenightreborn.com/ftb/phantom-jobs' },
  { html: 'ftb/phantom-berserker.html', slug: 'ftb-phantom-berserker', section: 'Forked Tower: Blood', title: 'Phantom Berserker',  theme: 'ftb', url: 'alatenightreborn.com/ftb/phantom-berserker' },

  // Forked Tower: Magic
  { html: 'ftm/two-headed-aevis.html',  slug: 'ftm-two-headed-aevis',  section: 'Forked Tower: Magic', title: 'Two-Headed Aevis',   theme: 'ftm', url: 'alatenightreborn.com/ftm/two-headed-aevis' },
  { html: 'ftm/bridgeways.html',        slug: 'ftm-bridgeways',        section: 'Forked Tower: Magic', title: 'Lower Passages',     theme: 'ftm', url: 'alatenightreborn.com/ftm/bridgeways' },
  { html: 'ftm/sword-dancer.html',      slug: 'ftm-sword-dancer',      section: 'Forked Tower: Magic', title: 'Sword Dancer',       theme: 'ftm', url: 'alatenightreborn.com/ftm/sword-dancer' },
  { html: 'ftm/storm-generators.html',  slug: 'ftm-storm-generators',  section: 'Forked Tower: Magic', title: 'Storm Generators',   theme: 'ftm', url: 'alatenightreborn.com/ftm/storm-generators' },
  { html: 'ftm/bridge.html',            slug: 'ftm-bridge',            section: 'Forked Tower: Magic', title: 'Central Mezzanine',  theme: 'ftm', url: 'alatenightreborn.com/ftm/bridge' },
  { html: 'ftm/necrophobia.html',       slug: 'ftm-necrophobia',       section: 'Forked Tower: Magic', title: 'Necrophobia',        theme: 'ftm', url: 'alatenightreborn.com/ftm/necrophobia' },
  { html: 'ftm/clockwards.html',        slug: 'ftm-clockwards',        section: 'Forked Tower: Magic', title: 'Tower Curseclocks',  theme: 'ftm', url: 'alatenightreborn.com/ftm/clockwards' },
  { html: 'ftm/the-index.html',         slug: 'ftm-the-index',         section: 'Forked Tower: Magic', title: 'The Index',          theme: 'ftm', url: 'alatenightreborn.com/ftm/the-index' },
  { html: 'ftm/phantom-jobs.html',      slug: 'ftm-phantom-jobs',      section: 'Forked Tower: Magic', title: 'Phantom Jobs',       theme: 'ftm', url: 'alatenightreborn.com/ftm/phantom-jobs' },

  // Cloud of Darkness (Chaotic)
  { html: 'chaotic/phase-0.html',       slug: 'chaotic-phase-0',       section: 'Cloud of Darkness (Chaotic)', title: 'Phase 0',           theme: 'chaotic', url: 'alatenightreborn.com/chaotic/phase-0' },
  { html: 'chaotic/phase-1.html',       slug: 'chaotic-phase-1',       section: 'Cloud of Darkness (Chaotic)', title: 'Phase 1 (Diamond)', theme: 'chaotic', url: 'alatenightreborn.com/chaotic/phase-1' },
  { html: 'chaotic/phase-2.html',       slug: 'chaotic-phase-2',       section: 'Cloud of Darkness (Chaotic)', title: 'Phase 2 (Tiles)',   theme: 'chaotic', url: 'alatenightreborn.com/chaotic/phase-2' }
];

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildCardHtml(page) {
  const th = THEMES[page.theme] || THEMES.home;
  const titleFontSize = page.title.length >= 17 ? 80 : 92;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Quicksand:wght@600;700;800&display=swap" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; background: #16122c; font-family: 'Quicksand', sans-serif; -webkit-font-smoothing: antialiased; }
  .og-card { position: relative; width: 1200px; height: 630px; overflow: hidden; background: #16122c; }
  .sky-bg {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, #0e0b22 0%, #241b4b 48%, #523874 82%, #7d5075 100%);
  }
  .aura {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 62% 55% at 20% 72%, ${th.glow} 0%, transparent 72%),
      radial-gradient(ellipse 46% 45% at 84% 34%, rgba(253, 212, 201, 0.18) 0%, transparent 70%);
  }
  .sky-svg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; }
  .content {
    position: relative; z-index: 4;
    padding: 64px 78px 72px;
    height: 100%;
    display: flex; flex-direction: column; justify-content: space-between;
    max-width: 790px;
  }
  .brand-row { display: inline-flex; align-items: center; gap: 18px; }
  .logo {
    width: 64px; height: 64px; object-fit: contain;
    filter: drop-shadow(0 0 18px rgba(253, 212, 201, 0.55));
  }
  .brand-name {
    font-family: 'Fredoka', sans-serif;
    font-size: 30px; font-weight: 500;
    color: rgba(255, 255, 255, 0.94);
    letter-spacing: 0.01em;
  }
  .main-copy {
    display: flex; flex-direction: column; gap: 12px;
    margin: auto 0; padding-bottom: 18px;
  }
  .section-line {
    font-family: 'Quicksand', sans-serif;
    font-size: 32px; font-weight: 800;
    color: ${th.accent};
    letter-spacing: 0.01em;
    text-shadow: 0 3px 18px rgba(14, 10, 36, 0.5);
  }
  .title {
    font-family: 'Fredoka', sans-serif;
    font-size: ${titleFontSize}px; font-weight: 600;
    line-height: 1.03;
    color: #ffffff;
    text-shadow: 0 6px 28px rgba(14, 10, 36, 0.55);
  }
  .footer-row { padding-top: 8px; }
  .domain {
    display: inline-block;
    font-size: 23px; font-weight: 700;
    color: rgba(253, 212, 201, 0.92);
    letter-spacing: 0.02em;
  }
</style>
</head>
<body>
  <div class="og-card">
    <div class="sky-bg"></div>
    <div class="aura"></div>
    <svg class="sky-svg" viewBox="0 0 1200 630" preserveAspectRatio="none">
      <defs>
        <radialGradient id="mg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fdd4c9" stop-opacity="0.52"/>
          <stop offset="55%" stop-color="#fdd4c9" stop-opacity="0.16"/>
          <stop offset="100%" stop-color="#fdd4c9" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="sg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ebd09b" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#ebd09b" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="984" cy="222" r="215" fill="url(#mg)"/>
      <circle cx="805" cy="141" r="52" fill="url(#sg)"/>
      <path d="M976 108 A112 112 0 1 0 1052 302 A86 86 0 1 1 976 108 Z" fill="#fdd4c9"/>
      <path d="M805 112 L811 135 L834 141 L811 147 L805 170 L799 147 L776 141 L799 135 Z" fill="#ebd09b"/>
      <path d="M776 306 L780 318 L792 322 L780 326 L776 338 L772 326 L760 322 L772 318 Z" fill="#ebd09b" opacity="0.9"/>
      <path d="M1125 142 L1128 153 L1139 156 L1128 159 L1125 170 L1122 159 L1111 156 L1122 153 Z" fill="#fdd4c9" opacity="0.92"/>
      <circle cx="670" cy="96" r="3" fill="#fff" opacity="0.75"/>
      <circle cx="882" cy="88" r="2.6" fill="#ebd09b" opacity="0.82"/>
      <circle cx="1098" cy="272" r="3" fill="#fff" opacity="0.72"/>
      <circle cx="836" cy="368" r="2.5" fill="#fdd4c9" opacity="0.7"/>
      <circle cx="1148" cy="212" r="2.6" fill="#ebd09b" opacity="0.78"/>
      <path d="M-30 515 Q160 432 350 492 Q560 422 770 492 Q990 416 1230 480 L1230 635 L-30 635 Z" fill="#2c2254" opacity="0.72"/>
      <path d="M-30 548 Q190 474 400 530 Q630 464 860 528 Q1060 476 1230 514 L1230 635 L-30 635 Z" fill="#463478" opacity="0.65"/>
      <path d="M0 578 Q210 518 430 564 Q670 508 920 562 Q1090 526 1200 550 L1200 635 L0 635 Z" fill="#16122c"/>
    </svg>
    <div class="content">
      <div class="brand-row">
        <img class="logo" src="${logoB64}" alt="ALNR" />
        <span class="brand-name">A Late Night Reborn</span>
      </div>
      <div class="main-copy">
        <div class="section-line">${escapeHtml(page.section)}</div>
        <h1 class="title">${escapeHtml(page.title)}</h1>
      </div>
      <div class="footer-row">
        <span class="domain">${escapeHtml(page.url)}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alnr-og-'));

try {
  for (const page of PAGES) {
    const tmpHtml = path.join(tmpDir, `${page.slug}.html`);
    const outPng = path.join(outDir, `${page.slug}.png`);
    fs.writeFileSync(tmpHtml, buildCardHtml(page), 'utf8');
    const fileUrl = 'file:///' + tmpHtml.replace(/\\/g, '/');
    execFileSync(BROWSER, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      '--virtual-time-budget=3500',
      `--screenshot=${outPng}`,
      fileUrl
    ], { stdio: 'pipe' });
    const kb = (fs.statSync(outPng).size / 1024).toFixed(1);
    console.log(`Generated assets/og/${page.slug}.png (${kb} KB)`);
  }
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

console.log(`Done! Generated ${PAGES.length} OpenGraph cards in assets/og/.`);
