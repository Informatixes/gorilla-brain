import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const root = await mkdtemp(path.join(os.tmpdir(), "gorilla-pilot-"));
const pluginScripts = path.join(process.cwd(), "plugins", "gorilla-brain", "scripts");
try {
  const init = spawnSync(process.execPath, [path.join(pluginScripts, "init-brain.mjs"), "--root", root, "--title", "Piloto", "--apply"], { encoding: "utf8" });
  if (init.status !== 0) throw new Error(init.stderr || "Falló la inicialización");
  const initialized = JSON.parse(init.stdout);
  if (!initialized.created) throw new Error("El inicializador no confirmó la creación");
  await writeFile(path.join(root, "knowledge", "CONTEXT.md"), "# Contexto\n\nLa fuente de verdad del piloto es Registro Central.\n", "utf8");
  const librarian = spawnSync(process.execPath, [path.join(pluginScripts, "create-librarian.mjs"), "--root", root, "--scope", "Piloto", "--folders", "knowledge/", "--apply"], { encoding: "utf8" });
  if (librarian.status !== 0) throw new Error(librarian.stderr || "Falló el Bibliotecario");
  const query = spawnSync(process.execPath, [path.join(pluginScripts, "query-brain.mjs"), "--vault", root, "--query", "fuente de verdad"], { encoding: "utf8" });
  if (query.status !== 0) throw new Error(query.stderr || "Falló la consulta");
  const result = JSON.parse(query.stdout);
  const catalog = await readFile(path.join(root, "agents", "AGENTS.md"), "utf8");
  if (catalog.indexOf("| Bibliotecario |") > catalog.indexOf("## Candidatos")) throw new Error("Bibliotecario fuera de la tabla");
  const agent = await readFile(path.join(root, "agents", "BIBLIOTECARIO.md"), "utf8");
  const usage = await readFile(path.join(root, "agents", "COMO-USAR-GORILLA-BRAIN.md"), "utf8");
  if (!result.results.some((item) => item.path === "knowledge/CONTEXT.md")) throw new Error("No recuperó la fuente preparada");
  if (!agent.includes("Piloto") || !agent.includes("Solo lectura")) throw new Error("Bibliotecario sin ámbito o límites");
  if (!usage.includes(root) || !usage.includes("knowledge/")) throw new Error("Guía de invocación sin repositorio o carpetas autorizadas");
  console.log("Piloto verificado: inicialización, Bibliotecario, guía de invocación y consulta trazable.");
} finally {
  await rm(root, { recursive: true, force: true });
}
