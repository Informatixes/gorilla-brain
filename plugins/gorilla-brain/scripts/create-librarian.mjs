#!/usr/bin/env node
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const values = process.argv.slice(2);
const option = (name) => { const index = values.indexOf(`--${name}`); return index >= 0 ? values[index + 1] : undefined; };
const root = path.resolve(process.cwd(), option("root") || ".");
const scope = option("scope") || "el repositorio autorizado";
const folders = option("folders") || "knowledge/, projects/, processes/";
const apply = values.includes("--apply");
const target = path.join(root, "agents", "BIBLIOTECARIO.md");
const usage = path.join(root, "agents", "COMO-USAR-GORILLA-BRAIN.md");

for (const file of [target, usage]) {
  try { await access(file); console.error(`No se sobrescribe un archivo existente: ${file}`); process.exit(2); } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

const replacements = (content) => content
  .replaceAll("<ÁMBITO>", scope)
  .replaceAll("<RAÍZ_DEL_REPOSITORIO>", root)
  .replaceAll("<CARPETAS_AUTORIZADAS>", folders)
  .replaceAll("<FECHA>", new Date().toISOString().slice(0, 10));

const template = replacements(await readFile(path.join(pluginRoot, "templates", "LIBRARIAN_AGENT.md"), "utf8"));
const usageGuide = replacements(await readFile(path.join(pluginRoot, "templates", "BRAIN_USAGE.md"), "utf8"));
const result = { target, usage, scope, folders, apply };
if (!apply) { console.log(JSON.stringify(result, null, 2)); process.exit(0); }

await writeFile(target, template, { encoding: "utf8", flag: "wx" });
await writeFile(usage, usageGuide, { encoding: "utf8", flag: "wx" });
const catalog = path.join(root, "agents", "AGENTS.md");
const catalogText = await readFile(catalog, "utf8");
const row = `| Bibliotecario | Consultar conocimiento con fuentes | Pregunta sobre el repositorio | ${folders} | Solo lectura | Diseñado |`;
const tableSeparator = /^\| --- \| --- \| --- \| --- \| --- \| --- \|$/m;
const updated = tableSeparator.test(catalogText)
  ? catalogText.replace(tableSeparator, (line) => `${line}\n${row}`)
  : `${catalogText}\n## Bibliotecario\n\n| Nombre | Propósito | Activador | Fuentes | Acciones permitidas | Estado |\n| --- | --- | --- | --- | --- | --- |\n${row}\n`;
await writeFile(catalog, updated, "utf8");
console.log(JSON.stringify({ ...result, created: true, catalog }, null, 2));
