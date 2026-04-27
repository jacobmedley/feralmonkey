/**
 * generate-figma-themes.mjs
 *
 * Reads FMDS theme files (tokens/themes/*.json) and Default.tokens.json,
 * then writes per-theme Figma Variables DTCG mode files to figma-tokens/.
 *
 * Each output file represents one mode of the "theme" collection and can be
 * imported into Figma via the Variables REST API or a compatible plugin.
 * Variable IDs are sourced directly from figma-tokens/Default.tokens.json
 * so links remain stable across imports.
 *
 * Usage: node tokens/generate-figma-themes.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
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

// ─── Load Default.tokens.json ─────────────────────────────────────────────────

const defaultTokens = JSON.parse(
  readFileSync(join(ROOT, 'figma-tokens', 'Default.tokens.json'), 'utf8')
);

// Extract variable IDs from the theme collection
const THEME_VARIABLE_IDS = {};
for (const [key, token] of Object.entries(defaultTokens.theme ?? {})) {
  const id = token?.$extensions?.['com.figma.variableId'];
  if (id) THEME_VARIABLE_IDS[key] = id;
}

// Pull default values from the Default.tokens.json theme so missing
// theme-specific variables fall back to Figma defaults
const DEFAULT_THEME_VALUES = defaultTokens.theme ?? {};

// ─── Build a Figma DTCG mode file from an FMDS theme ─────────────────────────

function buildModeFile(fmdsTheme, modeName) {
  const theme = {};

  // Start with defaults from the Figma default mode, then overlay FMDS values
  for (const [key, defaultToken] of Object.entries(DEFAULT_THEME_VALUES)) {
    const id = THEME_VARIABLE_IDS[key];
    const scopes = defaultToken?.$extensions?.['com.figma.scopes'] ?? ['ALL_SCOPES'];

    // Check if the FMDS theme overrides this key
    const fmdsToken = fmdsTheme[key];

    let value;
    if (fmdsToken) {
      const raw = fmdsToken['$value'] ?? fmdsToken;
      const type = fmdsToken['$type'] ?? 'color';

      if (type === 'color') {
        if (typeof raw === 'string' && raw.startsWith('{')) {
          // Reference — keep as-is (maps to Figma color collection)
          value = raw;
        } else if (typeof raw === 'string' && raw.startsWith('#')) {
          value = hexToFigmaColor(raw);
        } else {
          value = raw; // already a Figma color object or pass-through
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
      // Not overridden — carry forward the Figma default value unchanged
      theme[key] = {
        ...defaultToken,
        '$extensions': { 'com.figma.variableId': id, 'com.figma.scopes': scopes, 'com.figma.isOverride': true },
      };
    }
  }

  return { theme, '$extensions': { 'com.figma.modeName': modeName } };
}

// ─── Mode name mapping ────────────────────────────────────────────────────────

const MODE_NAMES = {
  default: 'FMDS Default',
  fsa: 'FSA',
  hsa: 'HSA',
  patiently: 'Patiently',
};

// ─── Process all theme files ──────────────────────────────────────────────────

const themesDir = join(ROOT, 'tokens', 'themes');
const outDir = join(ROOT, 'figma-tokens');

const themeFiles = readdirSync(themesDir)
  .filter(f => f.endsWith('.json'))
  .sort();

for (const file of themeFiles) {
  const name = basename(file, '.json');
  const raw = JSON.parse(readFileSync(join(themesDir, file), 'utf8'));
  const fmdsTheme = raw.theme ?? raw;
  const modeName = MODE_NAMES[name] ?? name;

  const output = buildModeFile(fmdsTheme, modeName);
  const outPath = join(outDir, `${name}.json`);
  writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

  const overrideCount = Object.keys(fmdsTheme).length;
  const totalCount = Object.keys(output.theme).length;
  console.log(`${outPath.replace(ROOT + '/', '')}  [${modeName}]  ${overrideCount} overrides / ${totalCount} total`);
}
