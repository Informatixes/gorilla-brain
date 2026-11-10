#!/usr/bin/env node
import { access, appendFile, readFile, writeFile } from "node:fs/promises";
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
try { await access(target); console.error("El Bibliotecario ya existe; no se sobrescribe."); process.exit(2); } catch {}
let template = await readFile(path.join(pluginRoot, "templates", "LIBRARIAN_AGENT.md"), "utf8");
template = template.replaceAll("<ÁMBITO>", scope).replaceAll("<RAÍZ_DEL_REPOSITORIO>", root).replaceAll("<CARPETAS_AUTORIZADAS>", folders).replaceAll("<FECHA>", new Date().toISOString().slice(0, 10));
const result = { target, scope, folders, apply };
if (!apply) { console.log(JSON.stringify(result, null, 2)); process.exit(0); }
await writeFile(target, template, { encoding: "utf8", flag: "wx" });
const catalog = path.join(root, "agents", "AGENTS.md");
await appendFile(catalog, `\n| Bibliotecario | Consultar conocimiento con fuentes | Pregunta sobre el repositorio | ${folders} | Solo lectura | Diseñado |\n`, "utf8");
console.log(JSON.stringify({ ...result, created: true, catalog }, null, 2));
