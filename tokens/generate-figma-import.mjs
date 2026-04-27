import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// "H S% L%" → "#rrggbb"
function hslToHex(hslStr) {
  const parts = hslStr.trim().split(/\s+/);
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const HSL_RE = /^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/;

function isHsl(v) {
  return typeof v === 'string' && HSL_RE.test(v.trim());
}

// Recursively convert primitives.json to Tokens Studio format
function convertPrimitives(obj, keyPath = []) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = [...keyPath, key];
    if (typeof value === 'object' && value !== null) {
      result[key] = convertPrimitives(value, path);
    } else if (isHsl(value)) {
      result[key] = { value: hslToHex(value), type: 'color' };
    } else if (typeof value === 'number') {
      const parentKey = keyPath[keyPath.length - 1] ?? '';
      if (parentKey === 'lineHeight') {
        result[key] = { value: String(value), type: 'lineHeights' };
      } else if (parentKey === 'fontWeight') {
        result[key] = { value: String(value), type: 'fontWeights' };
      } else {
        result[key] = { value: String(value), type: 'other' };
      }
    } else if (typeof value === 'string') {
      const parentKey = keyPath[keyPath.length - 1] ?? '';
      if (parentKey === 'fontFamily' || key.startsWith('wt-') || key === 'lato') {
        result[key] = { value, type: 'fontFamilies' };
      } else if (parentKey === 'fontSize') {
        result[key] = { value, type: 'fontSizes' };
      } else if (parentKey === 'spacing') {
        result[key] = { value, type: 'spacing' };
      } else if (parentKey === 'radius') {
        result[key] = { value, type: 'borderRadius' };
      } else {
        result[key] = { value, type: 'other' };
      }
    }
  }
  return result;
}

// Convert a DTCG theme file to Tokens Studio format, translating {color.X} refs to {global.color.X}
function convertTheme(dtcgTheme) {
  const result = {};
  for (const [key, token] of Object.entries(dtcgTheme)) {
    const rawValue = token['$value'];
    const rawType = token['$type'];

    let value = rawValue;
    let type = rawType === 'color' ? 'color'
      : rawType === 'number' ? 'borderRadius'
      : rawType === 'string' ? 'other'
      : 'other';

    // Rewrite primitive refs: {color.X} → {global.color.X}, {radius.X} → {global.radius.X}
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      const inner = value.slice(1, -1);
      value = `{global.${inner}}`;
    }

    // Radius number token → borderRadius with px
    if (rawType === 'number') {
      value = typeof rawValue === 'number' ? `${rawValue}px` : String(rawValue);
      type = 'borderRadius';
    }

    // font-sans / font-display → fontFamilies
    if (key === 'font-sans' || key === 'font-display' || key.startsWith('font-family')) {
      type = 'fontFamilies';
    }

    result[key] = { value, type };
  }
  return result;
}

// Load primitives
const primitives = JSON.parse(readFileSync(join(__dirname, 'primitives.json'), 'utf8'));
const globalSet = convertPrimitives(primitives);

// Load all themes
const themesDir = join(__dirname, 'themes');
const themeFiles = readdirSync(themesDir).filter(f => f.endsWith('.json'));

const themeSets = {};
const themeOrder = [];

for (const file of themeFiles) {
  const name = file.replace('.json', '');
  const raw = JSON.parse(readFileSync(join(themesDir, file), 'utf8'));
  const themeData = raw.theme ?? raw;
  themeSets[name] = { theme: convertTheme(themeData) };
  themeOrder.push(name);
}

// Assemble final output
const output = {
  $metadata: {
    tokenSetOrder: ['global', ...themeOrder],
  },
  global: globalSet,
  ...themeSets,
};

const outPath = join(ROOT, 'figma-tokens', 'fmds-tokens.json');
writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Written: ${outPath}`);
console.log(`Sets: global, ${themeOrder.join(', ')}`);
