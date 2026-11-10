import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const server = spawn(process.execPath, [path.join(process.cwd(), "plugins", "gorilla-brain", "server", "index.mjs")], { stdio: ["pipe", "pipe", "pipe"] });
const responses = new Map();
let buffer = "";
server.stdout.setEncoding("utf8");
server.stdout.on("data", (chunk) => { buffer += chunk; const lines = buffer.split(/\r?\n/); buffer = lines.pop() || ""; for (const line of lines) { const message = JSON.parse(line); if (message.id !== undefined) responses.set(message.id, message); } });
const send = (message) => server.stdin.write(`${JSON.stringify(message)}\n`);
const waitFor = async (id) => { for (let tries = 0; tries < 50; tries += 1) { if (responses.has(id)) return responses.get(id); await new Promise((resolve) => setTimeout(resolve, 20)); } throw new Error(`Sin respuesta MCP para ${id}`); };
try {
  send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } } });
  const initialized = await waitFor(1);
  send({ jsonrpc: "2.0", method: "notifications/initialized" });
  send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
  const listed = await waitFor(2);
  send({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "brain_search", arguments: { repository_path: path.join(process.cwd(), "demo-vault"), query: "decisiones del proyecto", limit: 3 } } });
  const called = await waitFor(3);
  send({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "brain_get_note", arguments: { repository_path: path.join(process.cwd(), "demo-vault"), note_path: "../README.md" } } });
  const rejected = await waitFor(4);
  if (initialized.result?.serverInfo?.name !== "gorilla-brain-local") throw new Error("Inicialización MCP inválida");
  if (listed.result?.tools?.length !== 3) throw new Error("Catálogo MCP incompleto");
  if (!called.result?.structuredContent?.results?.length) throw new Error("MCP no devolvió resultados");
  if (!rejected.result?.isError || !rejected.result?.content?.[0]?.text?.includes("fuera del repositorio")) throw new Error("MCP permitió salir de la raíz autorizada");
  console.log("MCP verificado: initialize, tools/list y brain_search.");
} finally {
  server.kill();
}
