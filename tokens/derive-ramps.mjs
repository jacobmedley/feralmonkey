/**
 * tokens/derive-ramps.mjs
 *
 * Generates 9-step OKLab-derived ramps from brand base colors.
 * Algorithm from Section 2.2 of FMDS_BRAND_REFACTOR.md.
 *
 * Usage:
 *   node tokens/derive-ramps.mjs           # writes tokens/audit/derived-ramps.json
 *   node tokens/derive-ramps.mjs --verify  # verifies existing theme files match
 */

import { writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── OKLab color math (Björn Ottosson) ────────────────────────────────────────

function linearize(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function delinearize(c) {
  const v = Math.max(0, Math.min(1, c));
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

function hexToOklab(hex) {
  const h = hex.replace('#', '');
  const r = linearize(parseInt(h.slice(0, 2), 16));
  const g = linearize(parseInt(h.slice(2, 4), 16));
  const b = linearize(parseInt(h.slice(4, 6), 16));

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}

function oklabToHex(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = delinearize(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = delinearize(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bv = delinearize(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);

  const rh = Math.round(r * 255).toString(16).padStart(2, '0');
  const gh = Math.round(g * 255).toString(16).padStart(2, '0');
  const bh = Math.round(bv * 255).toString(16).padStart(2, '0');

  return `#${rh}${gh}${bh}`.toUpperCase();
}

// ─── Ramp definition ──────────────────────────────────────────────────────────

// OKLab L targets per step. Step 500 = original base hex (enforced below).
const STEP_LIGHTNESS = {
  '50':  0.97,
  '100': 0.93,
  '200': 0.86,
  '300': 0.76,
  '400': 0.64,
  '600': 0.44,
  '700': 0.36,
  '800': 0.28,
  '900': 0.20,
};

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

export function generateRamp(baseHex) {
  const { a, b } = hexToOklab(baseHex);
  const ramp = {};
  for (const step of STEPS) {
    if (step === '500') {
      ramp['500'] = baseHex.toUpperCase();
    } else {
      ramp[step] = oklabToHex(STEP_LIGHTNESS[step], a, b);
    }
  }
  return ramp;
}

// ─── Brand base hexes (locked in FMDS_BRAND_REFACTOR.md Section 3) ───────────

const THEME_BASES = {
  patiently: {
    navy:   '#121E3D',
    lime:   '#D9FD6F',
    iris:   '#8B93F7',
    mint:   '#EFFEC2',
    cream:  '#F9F8F5',
    sand:   '#F0EFE9',
    stone:  '#E8E5DE',
    ash:    '#5B6070',
  },
  hsa: {
    navy:     '#142643',
    violet:   '#56449C',
    teal:     '#238672',
    lilac:    '#FAF0FA',
    gray:     '#666666',
    silver:   '#CCCCCC',
    forest:   '#12784F',
    straw:    '#FFEA9E',
    lavender: '#8D81C1',
  },
  fsa: {
    navy:    '#142745',
    crimson: '#FF295B',
    blush:   '#FEEBE5',
    sky:     '#E9F2FF',
    mist:    '#F6FAFF',
    slate:   '#375481',
  },
};

// ─── Generate all ramps ───────────────────────────────────────────────────────

const ramps = {};
for (const [theme, bases] of Object.entries(THEME_BASES)) {
  ramps[theme] = {};
  for (const [hue, baseHex] of Object.entries(bases)) {
    ramps[theme][hue] = generateRamp(baseHex);
  }
}

const verify = process.argv.includes('--verify');

if (!verify) {
  const outPath = join(ROOT, 'tokens', 'audit', 'derived-ramps.json');
  writeFileSync(outPath, JSON.stringify(ramps, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${outPath}\n`);

  for (const [theme, hues] of Object.entries(ramps)) {
    console.log(`${theme}:`);
    for (const [hue, ramp] of Object.entries(hues)) {
      const base = THEME_BASES[theme][hue];
      const { L } = hexToOklab(base);
      console.log(`  ${hue.padEnd(10)} base-L=${L.toFixed(3)}  50=${ramp['50']}  500=${ramp['500']}  900=${ramp['900']}`);
    }
    console.log('');
  }
} else {
  // ─── Verify mode: check existing theme files match derived ramps ─────────────
  let failures = 0;

  for (const [theme, hues] of Object.entries(ramps)) {
    const filePath = join(ROOT, 'tokens', 'themes', `${theme}.json`);
    let file;
    try {
      file = JSON.parse(readFileSync(filePath, 'utf8'));
    } catch {
      console.error(`MISSING: ${filePath}`);
      failures++;
      continue;
    }
    const brand = (file.theme ?? file).brand ?? {};

    for (const [hue, expected] of Object.entries(hues)) {
      const actual = brand[hue];
      if (!actual) {
        console.error(`MISSING brand.${hue} in ${theme}`);
        failures++;
        continue;
      }
      for (const step of STEPS) {
        const expectedHex = expected[step];
        const actualToken = actual[step];
        if (!actualToken) {
          console.error(`MISSING brand.${hue}.${step} in ${theme}`);
          failures++;
          continue;
        }
        const actualHex = (actualToken['$value'] ?? actualToken).toUpperCase();
        if (actualHex !== expectedHex) {
          console.error(`MISMATCH ${theme}.brand.${hue}.${step}: expected ${expectedHex}, got ${actualHex}`);
          failures++;
        }
      }
    }
  }

  if (failures === 0) {
    console.log('✓ All ramp values verified — theme files match derived ramps.');
  } else {
    console.error(`\n${failures} ramp verification failure(s).`);
    process.exit(1);
  }
}
