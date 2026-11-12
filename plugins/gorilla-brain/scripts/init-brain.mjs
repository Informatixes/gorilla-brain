#!/usr/bin/env node
import { access, copyFile, mkdir, readdir, lstat, writeFile } from "node:fs/promises";
import path from "node:path";
import { constants } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const values = process.argv.slice(2);
const args = {};
for (let index = 0; index < values.length; index += 1) {
  const value = values[index];
  if (!value.startsWith("--")) continue;
  const next = values[index + 1];
  args[value.slice(2)] = next && !next.startsWith("--") ? next : true;
  if (next && !next.startsWith("--")) index += 1;
}
if (!args.root || !args.title) { console.error("Uso: init-brain.mjs --root <ruta> --title <nombre> [--apply]"); process.exit(1); }
const root = path.resolve(process.cwd(), args.root);
// Refuse existing user content or symlinked roots instead of guessing ownership.
let cursor = root;
while (true) {
  try { if ((await lstat(cursor)).isSymbolicLink()) throw new Error(`Ruta con enlace simbólico no admitida: ${cursor}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const parent = path.dirname(cursor); if (parent === cursor) break; cursor = parent;
}
try {
  const entries = await readdir(root);
  if (entries.some(name => name !== '.git')) { console.error('La carpeta no está vacía; continúa la implantación existente sin reinicializar.'); process.exit(2); }
} catch (error) { if (error.code !== 'ENOENT') throw error; }
const files = [
  ["PROJECT.md", "PROJECT.md"], ["STATE.md", "STATE.md"], ["AGENTS.md", "WORKSPACE.md"],
  ["knowledge/CONTEXT.md", "CONTEXT.md"], ["knowledge/SOURCES.md", "SOURCES.md"], ["knowledge/DECISIONS.md", "DECISIONS.md"],
  ["agents/AGENTS.md", "AGENTS.md"]
];
const existing = [];
for (const [target] of [...files, ["brain.config.json"]]) try { await access(path.join(root, target), constants.COPYFILE_EXCL); existing.push(target); } catch {}
if (existing.length) { console.error(`No se sobrescribe una implantación existente: ${existing.join(", ")}`); process.exit(2); }
const plan = { root, title: String(args.title), files: files.map(([target]) => target), apply: args.apply === true };
if (args.apply !== true) { console.log(JSON.stringify(plan, null, 2)); process.exit(0); }
for (const directory of ["knowledge", "projects", "processes", "people", "agents", "archive", "site"]) await mkdir(path.join(root, directory), { recursive: true });
for (const [target, template] of files) await copyFile(path.join(pluginRoot, "templates", template), path.join(root, target), constants.COPYFILE_EXCL);
await writeFile(path.join(root, "brain.config.json"), `${JSON.stringify({ schemaVersion: 1, title: String(args.title), knowledgeRoot: ".", siteOutput: "site", sources: [{ type: "local", path: ".", readOnly: false }], separation: "one-private-repository-per-client" }, null, 2)}\n`, {encoding: "utf8", flag: "wx"});
console.log(JSON.stringify({ ...plan, created: true }, null, 2));
