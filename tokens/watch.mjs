/**
 * tokens/watch.mjs
 *
 * Watches figma-tokens/ and tokens/themes/ for changes and rebuilds CSS vars.
 *
 * figma-tokens/*.tokens.json → import-figma → build-css-vars
 * tokens/themes/*.json       → build-css-vars
 * tokens/primitives.json     → build-css-vars
 *
 * Usage: node tokens/watch.mjs
 */

import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let debounceTimer = null;
let running = false;
const queue = { figma: false, build: false };

function run(commands) {
  if (running) {
    // Queue whichever stages are needed
    for (const cmd of commands) queue[cmd] = true;
    return;
  }
  running = true;

  const seq = [...commands];

  function next() {
    const cmd = seq.shift();
    if (!cmd) {
      running = false;
      // Drain any queued work accumulated while we were running
      const deferred = [];
      if (queue.figma) { deferred.push('figma'); queue.figma = false; }
      if (queue.build) { deferred.push('build'); queue.build = false; }
      if (deferred.length) run(deferred);
      return;
    }

    const [script, label] = cmd === 'figma'
      ? ['tokens/import-figma.mjs', 'import-figma']
      : ['tokens/build-css-vars.mjs', 'build-css-vars'];

    console.log(`\n[watch] running ${label}…`);
    const child = spawn(process.execPath, [join(ROOT, script)], {
      cwd: ROOT,
      stdio: 'inherit',
    });
    child.on('close', (code) => {
      if (code !== 0) console.error(`[watch] ${label} exited with code ${code}`);
      next();
    });
  }

  next();
}

function schedule(commands) {
  for (const cmd of commands) {
    if (!queue[cmd] && !running) {} // will be passed directly
  }
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => run(commands), 150);
}

// figma-tokens/ → import then build
watch(join(ROOT, 'figma-tokens'), { persistent: true }, (event, filename) => {
  if (!filename?.endsWith('.tokens.json')) return;
  console.log(`[watch] figma-tokens/${filename} ${event}`);
  schedule(['figma', 'build']);
});

// tokens/themes/ → build only
watch(join(ROOT, 'tokens', 'themes'), { persistent: true }, (event, filename) => {
  if (!filename?.endsWith('.json')) return;
  console.log(`[watch] tokens/themes/${filename} ${event}`);
  schedule(['build']);
});

// tokens/primitives.json → build only
watch(join(ROOT, 'tokens', 'primitives.json'), { persistent: true }, (event) => {
  console.log(`[watch] tokens/primitives.json ${event}`);
  schedule(['build']);
});

console.log('[watch] watching figma-tokens/, tokens/themes/, tokens/primitives.json');
console.log('[watch] ctrl-c to stop\n');
