import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
const root = await mkdtemp(path.join(os.tmpdir(), 'gorilla setup spaces '));
const scripts = path.resolve('plugins/gorilla-brain/scripts');
function run(script, args = [], expected = 0) {
  const result = spawnSync(process.execPath, [path.join(scripts, script), ...args], {cwd: root, encoding: 'utf8'});
  if (result.status !== expected) throw new Error(`${script}: ${result.status}\n${result.stderr}`);
  return result;
}
try {
  if (!JSON.parse(run('doctor.mjs').stdout).ok) throw new Error('Doctor failed');
  const vault = path.join(root, 'cerebro privado');
  run('init-brain.mjs', ['--root', vault, '--title', 'Persona ficticia', '--apply']);
  const guard = await readFile(path.join(vault, 'AGENTS.md'), 'utf8');
  if (!guard.includes('no sustituye')) throw new Error('Missing continuity limits');
  const opportunities = await readFile(path.join(vault, 'agents/OPPORTUNITIES.md'), 'utf8');
  if (!opportunities.includes('## Cobertura')) throw new Error('Missing opportunity analysis template');
  const maintenance = await readFile(path.join(vault, 'knowledge/MAINTENANCE.md'), 'utf8');
  if (!maintenance.includes('not_configured')) throw new Error('Missing maintenance policy');
  const config = JSON.parse(await readFile(path.join(vault, 'brain.config.json'), 'utf8'));
  if (config.maintenance?.status !== 'not_configured') throw new Error('Unexpected maintenance status');
  const context = path.join(vault, 'knowledge/CONTEXT.md');
  await writeFile(context, '# Contexto\n\nFuente: entrevista ficticia de prueba.\nLa entrega del proyecto ficticio Atlas es el 30 de noviembre.\n');
  run('init-brain.mjs', ['--root', vault, '--title', 'Otra', '--apply'], 2);
  if (!(await readFile(context, 'utf8')).includes('Atlas')) throw new Error('Context overwritten');
  run('create-librarian.mjs', ['--root', vault, '--scope', 'Ficticio', '--folders', 'knowledge/', '--apply']);
  const out = path.join(vault, 'site');
  const build = () => run('build-site.mjs', ['--vault', vault, '--out', out]);
  build(); build();
  const result = JSON.parse(run('query-brain.mjs', ['--vault', vault, '--query', 'Atlas']).stdout);
  if (!result.results.some(n => n.path === 'knowledge/CONTEXT.md')) throw new Error('No source result');
  const absent = JSON.parse(run('query-brain.mjs', ['--vault', vault, '--query', 'zzzznotpresentzzzz']).stdout);
  if (absent.results.length) throw new Error('Unexpected match');
  await writeFile(context, '# Contexto\n\nFuente: corrección ficticia.\nLa entrega Atlas cambia al 2 de diciembre. Antes: 30 noviembre.\n');
  build();
  if (!(await readFile(path.join(out, 'knowledge.json'), 'utf8')).includes('2 de diciembre')) throw new Error('Stale view');
  run('build-site.mjs', ['--vault', vault, '--out', vault], 1);
  run('build-site.mjs', ['--vault', vault, '--out', root], 1);
  const unsafe = path.join(root, 'unrelated'); await mkdir(unsafe);
  await writeFile(path.join(unsafe, 'index.html'), 'keep');
  run('build-site.mjs', ['--vault', vault, '--out', unsafe], 1);
  if (await readFile(path.join(unsafe, 'index.html'), 'utf8') !== 'keep') throw new Error('Output overwritten');
  const alias = path.join(root, 'alias');
  await symlink(vault, alias, process.platform === 'win32' ? 'junction' : 'dir');
  run('build-site.mjs', ['--vault', vault, '--out', alias], 1);
  console.log('Setup regression: foreign cwd, spaces, doctor, opportunity analysis template, maintenance defaults, resume protection, positive/negative query, correction, rebuild, source and alias protection passed.');
} finally { await rm(root, {recursive: true, force: true}); }
