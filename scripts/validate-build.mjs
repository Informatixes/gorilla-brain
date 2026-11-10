import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const output = path.join(root, "site-dist");
const required = ["index.html", "styles.css", "app.js", "knowledge.json"];
for (const file of required) await stat(path.join(output, file));

const data = JSON.parse(await readFile(path.join(output, "knowledge.json"), "utf8"));
if (data.metrics.notes !== 7) throw new Error(`Se esperaban 7 notas y se obtuvieron ${data.metrics.notes}`);
if (data.metrics.links < 8) throw new Error(`El grafo contiene pocos enlaces: ${data.metrics.links}`);
if (data.metrics.brokenLinks !== 0) throw new Error(`Hay ${data.metrics.brokenLinks} enlaces rotos en la demo`);
if (data.metrics.orphans !== 0) throw new Error(`Hay ${data.metrics.orphans} notas huérfanas en la demo`);
if (!data.notes.every((note) => Array.isArray(note.backlinks) && Array.isArray(note.outgoing))) throw new Error("Backlinks u outgoing ausentes");

console.log(`Build verificado: ${data.metrics.notes} notas, ${data.metrics.links} enlaces, sin roturas ni huérfanos.`);
