import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const script = path.join(process.cwd(), "plugins", "gorilla-brain", "scripts", "query-brain.mjs");
const run = spawnSync(process.execPath, [script, "--vault", "demo-vault", "--query", "decisiones y fuentes del proyecto", "--limit", "4"], { encoding: "utf8" });
if (run.status !== 0) throw new Error(run.stderr || `query-brain terminó con ${run.status}`);
const output = JSON.parse(run.stdout);
if (output.matches < 2) throw new Error(`Se esperaban varias coincidencias y se obtuvieron ${output.matches}`);
if (!output.results.some((item) => item.path === "projects/Atlas.md")) throw new Error("La consulta no recuperó el proyecto relacionado");
if (!output.results.every((item) => item.path && item.snippet && item.score > 0)) throw new Error("Resultado incompleto o sin trazabilidad");
console.log(`Consulta verificada: ${output.matches} coincidencias; ${output.results.length} resultados trazables.`);
