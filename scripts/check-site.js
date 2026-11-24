#!/usr/bin/env node
// A Late Night Reborn - Zero-dependency site integrity & hygiene check
// Run with: node scripts/check-site.js

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === '.git' || ent.name === 'node_modules') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(root);
const jsFiles = files.filter(f => f.endsWith('.js') && !f.includes(`${path.sep}scripts${path.sep}`));
const htmlFiles = files.filter(f => f.endsWith('.html'));

// 1. JS syntax check
for (const jf of jsFiles) {
  try {
    execFileSync(process.execPath, ['--check', jf], { stdio: 'pipe' });
  } catch (e) {
    errors.push(`[JS-SYNTAX] ${path.relative(root, jf)}: ${e.stderr ? e.stderr.toString().trim() : e.message}`);
  }
}

// 2. HTML checks: duplicate IDs, missing alt, missing lazy/dims, missing canonical, broken local assets, version consistency
const versionMap = new Map();
const pageIds = new Map();

for (const hf of htmlFiles) {
  const rel = path.relative(root, hf).replace(/\\/g, '/');
  const dir = path.dirname(hf);
  const src = fs.readFileSync(hf, 'utf8');

  // Collect IDs & flag duplicates
  const ids = new Set();
  for (const m of src.matchAll(/\bid=["']([^"']+)["']/gi)) {
    if (ids.has(m[1])) errors.push(`[DUP-ID] ${rel}: #${m[1]}`);
    ids.add(m[1]);
  }
  pageIds.set(rel.replace(/\.html$/, ''), ids);

  // Canonical check (except dashboard.html)
  if (rel !== 'dashboard.html' && !/rel=["']canonical["']/i.test(src)) {
    warnings.push(`[SEO] ${rel}: missing canonical link`);
  }

  // Check local href/src (allowing extensionless GitHub Pages clean URLs)
  for (const m of src.matchAll(/\b(?:src|href)=["']([^"'#?]+)(?:[?#][^"']*)?["']/gi)) {
    const target = m[1].trim();
    if (!target || /^(https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(target)) continue;
    const base = target.startsWith('/')
      ? path.join(root, decodeURIComponent(target.slice(1)))
      : path.resolve(dir, decodeURIComponent(target));
    if (!fs.existsSync(base) && !fs.existsSync(base + '.html') && !fs.existsSync(path.join(base, 'index.html'))) {
      errors.push(`[BROKEN-LINK] ${rel} -> ${target}`);
    }
  }

  // Image checks
  for (const m of src.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\balt\s*=/i.test(tag)) errors.push(`[IMG-ALT] ${rel}: missing alt on ${tag.slice(0, 80)}`);
    if (/id=["']lightbox-img["']/.test(tag)) continue;
    if (!/header-logo/.test(tag) && !/\bloading\s*=/i.test(tag)) {
      warnings.push(`[IMG-LAZY] ${rel}: missing loading="lazy" on ${tag.slice(0, 80)}`);
    }
    if (!/\bwidth\s*=/i.test(tag) || !/\bheight\s*=/i.test(tag)) {
      warnings.push(`[IMG-DIMS] ${rel}: missing width/height on ${tag.slice(0, 80)}`);
    }
  }

  // Script defer check
  for (const m of src.matchAll(/<script\b([^>]*)>/gi)) {
    if (/\bsrc=/.test(m[1]) && !/\b(defer|async|type="module")\b/i.test(m[1])) {
      warnings.push(`[NO-DEFER] ${rel}: ${m[0]}`);
    }
  }

  // Track CSS/JS cache-busting versions
  for (const m of src.matchAll(/(?:css|js)\/([a-z0-9_-]+\.(?:css|js))(?:\?v=(\d+))?/gi)) {
    const asset = m[1].toLowerCase();
    const ver = m[2] || 'none';
    if (!versionMap.has(asset)) versionMap.set(asset, new Set());
    versionMap.get(asset).add(ver);
  }
}

for (const [asset, vers] of versionMap) {
  if (vers.size > 1) {
    warnings.push(`[VERSION-MISMATCH] ${asset}: found versions ${[...vers].join(', ')}`);
  }
}

// 3. Verify all anchors in js/nav.js
const navSrc = fs.readFileSync(path.join(root, 'js/nav.js'), 'utf8');
for (const m of navSrc.matchAll(/href="\/([^"#]+)#([^"]+)"/g)) {
  const ids = pageIds.get(m[1]);
  if (!ids) errors.push(`[NAV-PAGE] /${m[1]} missing`);
  else if (!ids.has(m[2])) errors.push(`[NAV-ANCHOR] /${m[1]}#${m[2]} missing`);
}

console.log(`Checked ${htmlFiles.length} HTML files and ${jsFiles.length} JS files.`);
console.log(`Errors: ${errors.length} | Warnings: ${warnings.length}`);
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach(e => console.log('  ' + e));
}
if (warnings.length) {
  console.log('\nWarnings:');
  warnings.forEach(w => console.log('  ' + w));
}
process.exit(errors.length > 0 ? 1 : 0);
