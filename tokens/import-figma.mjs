/**
 * import-figma.mjs
 *
 * Reads figma-tokens/Default.tokens.json (raw Figma variable export),
 * resolves internal references, and writes DTCG-format theme files to
 * tokens/themes/. Only the "theme" collection is written as a theme file;
 * color/radius primitives from Figma update tokens/primitives.json.
 *
 * Usage: node tokens/import-figma.mjs
 */

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const figmaFile = path.join(root, "figma-tokens/wireframe.tokens.json");
const themesDir = path.join(root, "tokens/themes");

const figma = JSON.parse(fs.readFileSync(figmaFile, "utf8"));

// ─── Helpers ───────────────────────────────────────────────────────────────

function rgbToHex(components) {
  return (
    "#" +
    components
      .map((c) => Math.round(c * 255).toString(16).padStart(2, "0"))
      .join("")
  ).toUpperCase();
}

// Resolve a Figma {token.path} reference within the flat Figma token space
function resolveRef(ref, visited = new Set()) {
  if (typeof ref !== "string") return ref;
  const match = ref.match(/^\{(.+)\}$/);
  if (!match) return ref;

  const path_ = match[1]; // e.g. "color.slate.950"
  if (visited.has(path_)) throw new Error(`Circular ref: ${path_}`);
  visited.add(path_);

  const parts = path_.split(".");
  let node = figma;
  for (const part of parts) {
    node = node?.[part];
    if (node === undefined) throw new Error(`Cannot resolve: ${path_}`);
  }

  const value = node.$value ?? node;
  // Recurse if the resolved value is itself a reference
  if (typeof value === "string" && /^\{.+\}$/.test(value)) {
    return resolveRef(value, visited);
  }
  return value;
}

// Convert a Figma color value to a hex string
function toHex(value) {
  if (typeof value === "string") {
    // Already a hex or reference
    if (value.startsWith("#")) return value;
    return toHex(resolveRef(value));
  }
  if (value && value.hex) return value.hex.toUpperCase();
  if (value && value.components) return rgbToHex(value.components);
  throw new Error(`Cannot convert to hex: ${JSON.stringify(value)}`);
}

// ─── Process theme collection ──────────────────────────────────────────────

const themeTokens = figma.theme ?? {};
const output = { theme: {} };

for (const [key, token] of Object.entries(themeTokens)) {
  // Skip nested groups (e.g. brand palette inside a mode file)
  if (token && typeof token === "object" && !("$value" in token) && !("$type" in token)) {
    continue;
  }

  const raw = token.$value ?? token;
  const type = token.$type ?? "color";

  if (type === "color") {
    // Preserve alias references — do not flatten to hex.
    // Aliases round-trip cleanly and keep Figma variable links intact.
    if (typeof raw === "string" && /^\{.+\}$/.test(raw)) {
      output.theme[key] = { $type: "color", $value: raw };
    } else {
      // Raw Figma color object → resolve to hex
      let resolved = raw;
      if (typeof resolved === "string" && /^\{.+\}$/.test(resolved)) {
        resolved = resolveRef(resolved);
      }
      output.theme[key] = { $type: "color", $value: toHex(resolved) };
    }
  } else if (type === "number") {
    let resolved = raw;
    if (typeof resolved === "string" && /^\{.+\}$/.test(resolved)) {
      resolved = resolveRef(resolved);
      // resolved is now a radius number token — unwrap if needed
      if (resolved && typeof resolved === "object" && "$value" in resolved) {
        resolved = resolved.$value;
      }
    }
    output.theme[key] = { $type: "number", $value: Number(resolved) };
  } else {
    output.theme[key] = { $type: type, $value: String(raw) };
  }
}

// ─── Write output ──────────────────────────────────────────────────────────

const outFile = path.join(themesDir, "figma-default.json");
fs.writeFileSync(outFile, JSON.stringify(output, null, 2) + "\n", "utf8");
console.log(`Wrote ${outFile}`);
console.log(`  ${Object.keys(output.theme).length} theme tokens exported`);
