import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Unwrap DTCG token: { $type, $value } → raw value
function unwrapDtcg(raw) {
  if (raw && typeof raw === "object" && "$value" in raw) return raw.$value;
  return raw;
}

// Convert a resolved value to a CSS-ready string.
// Handles: hex strings, HSL strings, Figma color objects { hex, components, ... }, numbers.
function toCssValue(value, key = "") {
  if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)) {
    return hexToHsl(value);
  }
  // Figma color object: { hex, colorSpace, components, alpha }
  if (value && typeof value === "object" && value.hex) {
    return hexToHsl(value.hex);
  }
  // Radius number tokens are always px
  if (typeof value === "number" && key === "radius") return `${value}px`;
  if (typeof value === "number") return String(value);
  return value;
}

// Check if a value is a nested namespace group (not a DTCG token)
function isNestedGroup(raw) {
  if (!raw || typeof raw !== "object") return false;
  return !("$value" in raw) && !("$type" in raw);
}

const primitives = readJson(path.join(root, "tokens/primitives.json"));
const semantics = readJson(path.join(root, "tokens/semantics.json"));

// Base sources — theme is set per-file below
const sources = {
  primitives,
  semantics,
  color: primitives.color,
  radius: primitives.radius,
};

function getByPath(obj, refPath) {
  return refPath.split(".").reduce((acc, key) => acc?.[key], obj);
}

function resolveReference(ref, stack = []) {
  if (typeof ref !== "string") return ref;

  const match = ref.match(/^\{(.+)\}$/);
  if (!match) return ref;

  const refPath = match[1];

  if (stack.includes(refPath)) {
    throw new Error(`Circular token reference: ${[...stack, refPath].join(" -> ")}`);
  }

  const [sourceName, ...rest] = refPath.split(".");
  const source = sources[sourceName];

  if (!source) {
    throw new Error(`Unknown token source: ${sourceName} in ${ref}`);
  }

  const value = getByPath(source, rest.join("."));

  if (value === undefined) {
    throw new Error(`Unable to resolve token reference: ${ref}`);
  }

  const unwrapped = unwrapDtcg(value);

  if (typeof unwrapped === "string" && /^\{.+\}$/.test(unwrapped)) {
    return resolveReference(unwrapped, [...stack, refPath]);
  }

  return unwrapped;
}

const themesDir = path.join(root, "tokens/themes");
const themeFiles = fs.readdirSync(themesDir).filter((f) => f.endsWith(".json"));

const blocks = [];

for (const file of themeFiles) {
  const themeName = path.basename(file, ".json");
  const loaded = readJson(path.join(themesDir, file));

  // Support both DTCG-wrapped ({ theme: { ... } }) and flat ({ key: value }) formats
  const tokenMap = loaded.theme ?? loaded;

  // Make the current theme's full token map available for self-referential aliases
  // (e.g. {theme.brand.navy} resolves from this theme, not the default theme)
  sources.theme = tokenMap;

  const themeResolved = {};
  for (const [key, raw] of Object.entries(tokenMap)) {
    // Skip nested namespace groups (e.g. the brand palette) — they're for
    // resolution only and don't emit CSS vars directly.
    if (isNestedGroup(raw)) continue;

    const value = unwrapDtcg(raw);
    let resolved;

    if (typeof value === "string" && /^\{.+\}$/.test(value)) {
      resolved = resolveReference(value);
    } else {
      resolved = value;
    }

    themeResolved[key] = toCssValue(resolved, key);
  }

  const selector = themeName === "default" ? ":root" : `[data-theme='${themeName}']`;
  const lines = [];
  lines.push(`${selector} {`);

  for (const [key, value] of Object.entries(themeResolved)) {
    lines.push(`  --${key}: ${value};`);
  }

  if (themeName === "default") {
    const radius = primitives.radius ?? {};
    if (radius.sm) lines.push(`  --radius-sm: ${radius.sm};`);
    if (radius.md) lines.push(`  --radius-md: ${radius.md};`);
    if (radius.lg) lines.push(`  --radius-lg: ${radius.lg};`);
    if (radius.xl) lines.push(`  --radius-xl: ${radius.xl};`);

    const fontSize = primitives.fontSize ?? {};
    for (const [key, value] of Object.entries(fontSize)) {
      lines.push(`  --font-size-${key}: ${value};`);
    }

    const fontFamily = primitives.fontFamily ?? {};
    for (const [key, value] of Object.entries(fontFamily)) {
      lines.push(`  --font-family-${key}: ${value};`);
    }

    const lineHeight = primitives.lineHeight ?? {};
    for (const [key, value] of Object.entries(lineHeight)) {
      lines.push(`  --line-height-${key}: ${value};`);
    }

    const fontWeight = primitives.fontWeight ?? {};
    for (const [key, value] of Object.entries(fontWeight)) {
      lines.push(`  --font-weight-${key}: ${value};`);
    }
  }

  lines.push("}");
  blocks.push(lines.join("\n"));
}

const output = blocks.join("\n\n") + "\n";

const targets = [
  "apps/web/src/styles",
  "apps/docs/src/styles",
];

for (const target of targets) {
  const outDir = path.join(root, target);
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "fmds-tokens.css");
  fs.writeFileSync(outFile, output, "utf8");
  console.log(`Wrote ${outFile}`);
}
