/**
 * generate-figma-themes.mjs
 *
 * Reads FMDS theme files (tokens/themes/*.json) and the existing
 * figma-tokens/wireframe.tokens.json (the FMDS Default mode file), then writes
 * per-theme Figma Variables DTCG mode files to figma-tokens/.
 *
 * Output per brand theme (FSA, HSA, Patiently):
 *   figma-tokens/{name}-brand.tokens.json  — brand ramp variables, "brand" collection
 *   figma-tokens/{name}.tokens.json        — semantic alias tokens, "theme" collection
 *
 * Import order into Figma:
 *   1. {name}-brand.tokens.json first (creates brand variables, isOverride: false)
 *   2. {name}.tokens.json second (sets semantic aliases that reference brand collection)
 *
 * Brand aliases in Figma use {brand.X.N} (separate collection).
 * Code-side themes still use {theme.brand.X.N}; the generator translates on emit.
 *
 * Usage: node tokens/generate-figma-themes.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToFigmaColor(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return { colorSpace: 'srgb', components: [r, g, b], alpha: 1, hex: `#${h.toUpperCase()}` };
}

// Translate code-side alias paths to Figma collection paths.
// {theme.brand.navy.500} → {brand.navy.500}  (brand lives in its own Figma collection)
function translateAlias(raw) {
  if (typeof raw === 'string' && raw.startsWith('{theme.brand.')) {
    return raw.replace('{theme.brand.', '{brand.');
  }
  return raw;
}

// ─── Bug 3 fix — preserve real variableIds across regenerations ───────────────
// After a successful Figma import, real IDs replace placeholders. This loader
// reads existing files and returns a Map<tokenPath, realId> so the generator
// reuses real IDs instead of overwriting them with fresh placeholders.

function walkTokens(obj, cb, path = '') {
  if (!obj || typeof obj !== 'object') return;
  if ('$type' in obj || '$value' in obj) { cb(obj, path); return; }
  for (const [key, val] of Object.entries(obj)) {
    walkTokens(val, cb, path ? `${path}.${key}` : key);
  }
}

function loadExistingIds(filepath) {
  if (!existsSync(filepath)) return new Map();
  const existing = JSON.parse(readFileSync(filepath, 'utf8'));
  const ids = new Map();
  walkTokens(existing, (token, path) => {
    const id = token.$extensions?.['com.figma.variableId'];
    if (id && !id.startsWith('VariableID:placeholder:')) {
      ids.set(path, id);
    }
  });
  return ids;
}

// ─── Load the Wireframe mode file ────────────────────────────────────────────

const defaultModeFile = JSON.parse(
  readFileSync(join(ROOT, 'figma-tokens', 'wireframe.tokens.json'), 'utf8')
);

const THEME_VARIABLE_IDS = {};
for (const [key, token] of Object.entries(defaultModeFile.theme ?? {})) {
  const id = token?.$extensions?.['com.figma.variableId'];
  if (id) THEME_VARIABLE_IDS[key] = id;
}

const DEFAULT_THEME_VALUES = defaultModeFile.theme ?? {};

// ─── Brand token builders ─────────────────────────────────────────────────────

function isRamp(entry) {
  if (!entry || typeof entry !== 'object') return false;
  if ('$value' in entry || '$type' in entry) return false;
  return Object.keys(entry).some(k => /^\d+$/.test(k));
}

function buildBrandToken(raw, variableId) {
  const hex = typeof raw === 'string' && raw.startsWith('#') ? raw : null;
  return {
    '$type': 'color',
    '$value': hex ? hexToFigmaColor(hex) : raw,
    '$extensions': {
      'com.figma.variableId': variableId,
      'com.figma.scopes': ['ALL_SCOPES'],
      'com.figma.isOverride': false,  // Bug 1 fix: brand vars are NEW, not overrides
    },
  };
}

function buildBrandGroup(brandMap, themeName, existingIds) {
  const brand = {};
  for (const [name, entry] of Object.entries(brandMap)) {
    if (isRamp(entry)) {
      brand[name] = {};
      for (const [step, token] of Object.entries(entry)) {
        const raw = token['$value'] ?? token;
        // Bug 3 fix: prefer real ID from prior export over placeholder
        const idKey = `brand.${name}.${step}`;
        const variableId = existingIds.get(idKey)
          ?? `VariableID:placeholder:${themeName}:brand:${name}:${step}`;
        brand[name][step] = buildBrandToken(raw, variableId);
      }
    } else {
      const raw = entry['$value'] ?? entry;
      const idKey = `brand.${name}`;
      const variableId = existingIds.get(idKey)
        ?? `VariableID:placeholder:${themeName}:brand:${name}`;
      brand[name] = buildBrandToken(raw, variableId);
    }
  }
  return brand;
}

// ─── Build a brand-only Figma DTCG mode file ─────────────────────────────────
// Bug 2 fix: brand variables live in their own "brand" collection (not "theme").
// isOverride: false — these are new variables, not mode overrides.
// Import this file FIRST so brand variables exist before semantic aliases reference them.

function buildBrandModeFile(brandMap, modeName, themeName, existingIds) {
  return {
    brand: buildBrandGroup(brandMap, themeName, existingIds),
    '$extensions': {
      'com.figma.modeName': modeName,
      'com.figma.collectionName': 'brand',  // Bug 2 fix: explicit separate collection
    },
  };
}

// ─── Build a semantic-alias-only Figma DTCG mode file ────────────────────────
// Targets the "theme" collection. Contains no brand group.
// Aliases use {brand.X.N} — cross-collection refs to the brand collection.
// Import AFTER the brand file so alias targets resolve.

function buildModeFile(fmdsTheme, modeName) {
  const theme = {};

  for (const [key, defaultToken] of Object.entries(DEFAULT_THEME_VALUES)) {
    const id = THEME_VARIABLE_IDS[key];
    const scopes = defaultToken?.$extensions?.['com.figma.scopes'] ?? ['ALL_SCOPES'];
    const fmdsToken = fmdsTheme[key];

    let value;
    if (fmdsToken) {
      const raw = fmdsToken['$value'] ?? fmdsToken;
      const type = fmdsToken['$type'] ?? 'color';

      if (type === 'color') {
        if (typeof raw === 'string' && raw.startsWith('{')) {
          // Translate {theme.brand.X.N} → {brand.X.N} for Figma cross-collection alias
          value = translateAlias(raw);
        } else if (typeof raw === 'string' && raw.startsWith('#')) {
          value = hexToFigmaColor(raw);
        } else {
          value = raw;
        }
        theme[key] = {
          '$type': 'color',
          '$value': value,
          '$extensions': { 'com.figma.variableId': id, 'com.figma.scopes': scopes, 'com.figma.isOverride': true },
        };
      } else if (type === 'number') {
        theme[key] = {
          '$type': 'number',
          '$value': typeof raw === 'number' ? raw : Number(raw),
          '$extensions': { 'com.figma.variableId': id, 'com.figma.scopes': scopes, 'com.figma.isOverride': true },
        };
      } else {
        theme[key] = {
          '$type': type,
          '$value': String(raw),
          '$extensions': { 'com.figma.variableId': id, 'com.figma.scopes': scopes, 'com.figma.isOverride': true },
        };
      }
    } else {
      theme[key] = {
        ...defaultToken,
        '$extensions': { 'com.figma.variableId': id, 'com.figma.scopes': scopes, 'com.figma.isOverride': true },
      };
    }
  }

  return { theme, '$extensions': { 'com.figma.modeName': modeName } };
}

// ─── Post-emit assertions ─────────────────────────────────────────────────────

function assertOverrideFlags(fileObj, rootKey, expected, label) {
  const mismatches = [];
  walkTokens(fileObj[rootKey] ?? {}, (token, path) => {
    const ovr = token.$extensions?.['com.figma.isOverride'];
    if (ovr !== expected) mismatches.push(`  ${path}: expected isOverride=${expected}, got ${ovr}`);
  });
  if (mismatches.length) {
    throw new Error(`${label} override-flag assertion failed:\n${mismatches.join('\n')}`);
  }
}

// ─── Mode name and output filename mappings ───────────────────────────────────

const MODE_NAMES = {
  default:   'FMDS Default',
  fsa:       'FSA',
  hsa:       'HSA',
  patiently: 'Patiently',
};

const OUTPUT_NAMES = {
  default:   'wireframe.tokens.json',
  fsa:       'fsa.tokens.json',
  hsa:       'hsa.tokens.json',
  patiently: 'patiently.tokens.json',
};

const BRAND_OUTPUT_NAMES = {
  fsa:       'fsa-brand.tokens.json',
  hsa:       'hsa-brand.tokens.json',
  patiently: 'patiently-brand.tokens.json',
};

// ─── Process all theme files ──────────────────────────────────────────────────

const themesDir = join(ROOT, 'tokens', 'themes');
const outDir = join(ROOT, 'figma-tokens');

const CANONICAL_THEMES = new Set(['default.json', 'fsa.json', 'hsa.json', 'patiently.json']);

const themeFiles = readdirSync(themesDir)
  .filter(f => CANONICAL_THEMES.has(f))
  .sort();

for (const file of themeFiles) {
  const name = basename(file, '.json');
  const raw = JSON.parse(readFileSync(join(themesDir, file), 'utf8'));
  const fmdsTheme = raw.theme ?? raw;
  const modeName = MODE_NAMES[name] ?? name;

  // Pass 1 — brand collection file (new variables, isOverride: false)
  if (fmdsTheme.brand && BRAND_OUTPUT_NAMES[name]) {
    const brandPath = join(outDir, BRAND_OUTPUT_NAMES[name]);
    const existingIds = loadExistingIds(brandPath);
    const brandOutput = buildBrandModeFile(fmdsTheme.brand, modeName, name, existingIds);

    assertOverrideFlags(brandOutput, 'brand', false, BRAND_OUTPUT_NAMES[name]);

    writeFileSync(brandPath, JSON.stringify(brandOutput, null, 2), 'utf8');
    const brandCount = Object.values(fmdsTheme.brand).reduce(
      (sum, v) => sum + (isRamp(v) ? Object.keys(v).length : 1), 0
    );
    const realIdCount = [...existingIds.keys()].length;
    console.log(
      `${brandPath.replace(ROOT + '/', '')}  [brand/${modeName}]  vars:${brandCount}  ` +
      `realIds:${realIdCount}  (import FIRST — creates brand variables)`
    );
  }

  // Pass 2 — semantic aliases file (overrides in theme collection, isOverride: true)
  const output = buildModeFile(fmdsTheme, modeName);
  const outPath = join(outDir, OUTPUT_NAMES[name] ?? `${name}.tokens.json`);

  assertOverrideFlags(output, 'theme', true, OUTPUT_NAMES[name] ?? `${name}.tokens.json`);

  writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  const overrideCount = Object.keys(fmdsTheme).filter(k => k !== 'brand').length;
  console.log(
    `${outPath.replace(ROOT + '/', '')}  [theme/${modeName}]  overrides:${overrideCount}  ` +
    `total:${Object.keys(output.theme).length}  (import SECOND — sets semantic aliases)`
  );
}
