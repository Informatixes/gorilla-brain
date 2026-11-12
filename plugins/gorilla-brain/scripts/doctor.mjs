#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checks = [];
checks.push({check: 'node', ok: Number(process.versions.node.split('.')[0]) >= 20, value: process.version});
for (const relative of ['scripts/init-brain.mjs', 'scripts/build-site.mjs', 'scripts/query-brain.mjs', 'templates/PROJECT.md', 'site/index.html']) {
  try { await access(path.join(pluginRoot, relative), constants.R_OK); checks.push({check: relative, ok: true}); }
  catch { checks.push({check: relative, ok: false}); }
}
const version = JSON.parse(await readFile(path.join(pluginRoot, 'plugin.json'), 'utf8')).version;
console.log(JSON.stringify({ok: checks.every(c => c.ok), version, pluginRoot, cwd: process.cwd(), checks,
  limits: ['No acceso implícito al historial ni memoria global de ChatGPT.', 'Sin sincronización ni ejecución en segundo plano por instalar el plugin.']}, null, 2));
if (checks.some(c => !c.ok)) process.exitCode = 1;
