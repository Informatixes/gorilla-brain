#!/usr/bin/env node
import { access, copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
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
const files = [
  ["PROJECT.md", "PROJECT.md"], ["STATE.md", "STATE.md"],
  ["knowledge/CONTEXT.md", "CONTEXT.md"], ["knowledge/SOURCES.md", "SOURCES.md"], ["knowledge/DECISIONS.md", "DECISIONS.md"],
  ["agents/AGENTS.md", "AGENTS.md"]
];
const existing = [];
for (const [target] of files) try { await access(path.join(root, target)); existing.push(target); } catch {}
if (existing.length) { console.error(`No se sobrescribe una implantación existente: ${existing.join(", ")}`); process.exit(2); }
const plan = { root, title: String(args.title), files: files.map(([target]) => target), apply: args.apply === true };
if (args.apply !== true) { console.log(JSON.stringify(plan, null, 2)); process.exit(0); }
for (const directory of ["knowledge", "projects", "processes", "people", "agents", "archive", "site"]) await mkdir(path.join(root, directory), { recursive: true });
for (const [target, template] of files) await copyFile(path.join(pluginRoot, "templates", template), path.join(root, target));
await writeFile(path.join(root, "brain.config.json"), `${JSON.stringify({ schemaVersion: 1, title: String(args.title), knowledgeRoot: ".", siteOutput: "site", sources: [{ type: "local", path: ".", readOnly: false }], separation: "one-private-repository-per-client" }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...plan, created: true }, null, 2));
