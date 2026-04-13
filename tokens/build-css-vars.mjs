import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const primitives = readJson(path.join(root, "tokens/primitives.json"));
const semantics = readJson(path.join(root, "tokens/semantics.json"));
const defaultTheme = readJson(path.join(root, "tokens/themes/default.json"));

const sources = {
  primitives,
  semantics,
  theme: defaultTheme,
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

  if (typeof value === "string" && /^\{.+\}$/.test(value)) {
    return resolveReference(value, [...stack, refPath]);
  }

  return value;
}

const themesDir = path.join(root, "tokens/themes");
const themeFiles = fs.readdirSync(themesDir).filter((f) => f.endsWith(".json"));

const blocks = [];

for (const file of themeFiles) {
  const themeName = path.basename(file, ".json");
  const theme = readJson(path.join(themesDir, file));

  const themeResolved = {};
  for (const [key, value] of Object.entries(theme)) {
    themeResolved[key] = resolveReference(value);
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
    if (radius.lg) lines.push(`  --radius: ${radius.lg};`);

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