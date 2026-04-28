/**
 * tokens/audit-contrast.mjs
 *
 * Walks every semantic alias pair from Section 4 of FMDS_BRAND_REFACTOR.md
 * and asserts documented contrast ratios are met.
 *
 * Usage: node tokens/audit-contrast.mjs
 * Exits 1 on any failure.
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Color math ───────────────────────────────────────────────────────────────

function linearizeChannel(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const h = hex.replace('#', '');
  const r = linearizeChannel(parseInt(h.slice(0, 2), 16));
  const g = linearizeChannel(parseInt(h.slice(2, 4), 16));
  const b = linearizeChannel(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
}

// ─── Token resolution (mirrors build-css-vars.mjs logic) ─────────────────────

function readJson(p) {
  return JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
}

const primitives = readJson('tokens/primitives.json');

function hexFromHsl(hsl) {
  if (typeof hsl !== 'string') return null;
  const m = hsl.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  if (!m) return null;
  const h = parseFloat(m[1]);
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m0 = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }

  const toHex = v => Math.round((v + m0) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function unwrapDtcg(v) {
  if (v && typeof v === 'object' && '$value' in v) return v.$value;
  return v;
}

function getByPath(obj, refPath) {
  return refPath.split('.').reduce((acc, k) => acc?.[k], obj);
}

function resolveHex(ref, sources, stack = []) {
  if (typeof ref !== 'string') {
    if (ref && typeof ref === 'object' && ref.hex) return ref.hex.toUpperCase();
    return null;
  }
  if (!ref.startsWith('{')) {
    if (ref.startsWith('#')) return ref.toUpperCase();
    return hexFromHsl(ref);
  }
  const path_ = ref.slice(1, -1);
  if (stack.includes(path_)) throw new Error(`Circular: ${path_}`);
  const [src, ...rest] = path_.split('.');
  const source = sources[src];
  if (!source) throw new Error(`Unknown source: ${src}`);
  const node = getByPath(source, rest.join('.'));
  if (node === undefined) throw new Error(`Cannot resolve: ${ref}`);
  const val = unwrapDtcg(node);
  return resolveHex(val, sources, [...stack, path_]);
}

function buildSources(themeFile) {
  const loaded = readJson(themeFile);
  const tokenMap = loaded.theme ?? loaded;
  return {
    theme: tokenMap,
    color: primitives.color,
    primitives,
  };
}

function resolveSemanticHex(key, sources) {
  const token = sources.theme[key];
  if (!token) throw new Error(`Missing semantic token: ${key}`);
  const val = unwrapDtcg(token);
  return resolveHex(val, sources);
}

// ─── Contrast pairs per Section 4 ────────────────────────────────────────────

// [fg, bg, minRatio, label]
const PATIENTLY_PAIRS = [
  ['foreground',           'background',          4.5, 'text AA'],
  ['card-foreground',      'card',                4.5, 'text AA'],
  ['popover-foreground',   'popover',             4.5, 'text AA'],
  ['primary-foreground',   'primary',             4.5, 'text AA (lime on navy, brand-mandated)'],
  ['secondary-foreground', 'secondary',           4.5, 'text AA'],
  ['accent-foreground',    'accent',              4.5, 'text AA'],
  ['destructive-foreground','destructive',        4.5, 'text AA'],
  ['muted-foreground',     'background',          4.5, 'muted text on bg'],
];

const HSA_PAIRS = [
  ['foreground',           'background',          4.5, 'text AA'],
  ['card-foreground',      'card',                4.5, 'text AA'],
  ['primary-foreground',   'primary',             4.5, 'text AA'],
  ['secondary-foreground', 'secondary',           4.5, 'text AA'],
  // accent-foreground/accent: documented 4.4:1 (option a: non-text only), check 3:1 UI
  ['accent-foreground',    'accent',              3.0, 'UI (accent teal-500 non-text)'],
  ['destructive-foreground','destructive',        4.5, 'text AA'],
  ['muted-foreground',     'background',          4.5, 'muted text on bg'],
];

const FSA_PAIRS = [
  ['foreground',           'background',          4.5, 'text AA'],
  ['card-foreground',      'card',                4.5, 'text AA'],
  ['primary-foreground',   'primary',             4.5, 'text AA (crimson-600)'],
  ['secondary-foreground', 'secondary',           4.5, 'text AA'],
  ['accent-foreground',    'accent',              4.5, 'text AA'],
  ['destructive-foreground','destructive',        4.5, 'text AA'],
  ['muted-foreground',     'background',          4.5, 'muted text on bg'],
];

// ─── Run audit ────────────────────────────────────────────────────────────────

const THEMES = [
  { name: 'patiently', file: 'tokens/themes/patiently.json', pairs: PATIENTLY_PAIRS },
  { name: 'hsa',       file: 'tokens/themes/hsa.json',       pairs: HSA_PAIRS },
  { name: 'fsa',       file: 'tokens/themes/fsa.json',       pairs: FSA_PAIRS },
];

let failures = 0;
let passes = 0;

for (const { name, file, pairs } of THEMES) {
  const sources = buildSources(file);
  console.log(`\n${name.toUpperCase()}`);

  for (const [fg, bg, minRatio, label] of pairs) {
    let fgHex, bgHex;
    try {
      fgHex = resolveSemanticHex(fg, sources);
      bgHex = resolveSemanticHex(bg, sources);
    } catch (e) {
      console.error(`  ERROR resolving ${fg}/${bg}: ${e.message}`);
      failures++;
      continue;
    }

    if (!fgHex || !bgHex) {
      console.error(`  ERROR hex not resolvable: ${fg}=${fgHex} ${bg}=${bgHex}`);
      failures++;
      continue;
    }

    const ratio = contrastRatio(fgHex, bgHex);
    const ok = ratio >= minRatio;
    const status = ok ? '✓' : '✗';
    const ratioStr = ratio.toFixed(2);
    const msg = `  ${status} ${fg} / ${bg}: ${ratioStr}:1 (min ${minRatio}:1, ${label})  [${fgHex} on ${bgHex}]`;

    if (ok) {
      console.log(msg);
      passes++;
    } else {
      console.error(msg);
      failures++;
    }
  }
}

console.log(`\n${passes} passed, ${failures} failed.`);
if (failures > 0) process.exit(1);
