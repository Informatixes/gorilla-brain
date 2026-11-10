#!/usr/bin/env node
import { readFile, readdir, realpath, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const queryScript = path.join(pluginRoot, "scripts", "query-brain.mjs");
const tools = [
  { name: "brain_search", title: "Search second brain", description: "Search an authorized Gorilla Brain repository and return source-linked Markdown notes.", inputSchema: { type: "object", properties: { repository_path: { type: "string" }, query: { type: "string" }, limit: { type: "integer", minimum: 1, maximum: 20, default: 8 } }, required: ["repository_path", "query"], additionalProperties: false }, annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false } },
  { name: "brain_get_note", title: "Read brain note", description: "Read one Markdown note inside an authorized Gorilla Brain repository.", inputSchema: { type: "object", properties: { repository_path: { type: "string" }, note_path: { type: "string" } }, required: ["repository_path", "note_path"], additionalProperties: false }, annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false } },
  { name: "brain_status", title: "Inspect second brain", description: "Report whether a directory has the minimum Gorilla Brain structure and count its Markdown notes.", inputSchema: { type: "object", properties: { repository_path: { type: "string" } }, required: ["repository_path"], additionalProperties: false }, annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false } }
];
async function verifiedRoot(value) { const root = await realpath(path.resolve(String(value))); if (!(await stat(root)).isDirectory()) throw new Error("repository_path no es un directorio"); return root; }
async function countMarkdown(directory) { let total = 0; for (const entry of await readdir(directory, { withFileTypes: true })) { if ([".git", ".openai", "node_modules"].includes(entry.name) || entry.isSymbolicLink()) continue; const full = path.join(directory, entry.name); if (entry.isDirectory()) total += await countMarkdown(full); else if (entry.name.toLowerCase().endsWith(".md")) total += 1; } return total; }
async function callTool(name, args) {
  const root = await verifiedRoot(args.repository_path);
  if (name === "brain_search") { const run = spawnSync(process.execPath, [queryScript, "--vault", root, "--query", String(args.query), "--limit", String(args.limit || 8)], { encoding: "utf8" }); if (run.status !== 0) throw new Error(run.stderr.trim() || "Falló la consulta"); const data = JSON.parse(run.stdout); return { structuredContent: data, content: [{ type: "text", text: data.results.length ? `Encontradas ${data.matches} notas. Fuentes principales: ${data.results.map((item) => item.path).join(", ")}` : "No hay evidencia suficiente en el repositorio." }] }; }
  if (name === "brain_get_note") { const requested = path.resolve(root, String(args.note_path)); if (!requested.startsWith(`${root}${path.sep}`) || !requested.toLowerCase().endsWith(".md")) throw new Error("note_path fuera del repositorio o no Markdown"); const target = await realpath(requested); if (!target.startsWith(`${root}${path.sep}`)) throw new Error("note_path resuelve fuera del repositorio"); const text = await readFile(target, "utf8"); return { structuredContent: { path: path.relative(root, target).replaceAll("\\", "/"), text }, content: [{ type: "text", text }] }; }
  if (name === "brain_status") { const required = ["PROJECT.md", "STATE.md", "knowledge/CONTEXT.md", "agents/AGENTS.md"]; const checks = {}; for (const file of required) try { await accessFile(path.join(root, file)); checks[file] = true; } catch { checks[file] = false; } const data = { repository_path: root, ready: Object.values(checks).every(Boolean), files: checks, markdown_notes: await countMarkdown(root) }; return { structuredContent: data, content: [{ type: "text", text: data.ready ? `Cerebro preparado con ${data.markdown_notes} notas.` : "Falta estructura mínima de Gorilla Brain." }] }; }
  throw new Error(`Herramienta desconocida: ${name}`);
}
async function accessFile(file) { await stat(file); }
function send(message) { process.stdout.write(`${JSON.stringify(message)}\n`); }
let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => { buffer += chunk; const lines = buffer.split(/\r?\n/); buffer = lines.pop() || ""; for (const line of lines) if (line.trim()) handle(JSON.parse(line)).catch((error) => send({ jsonrpc: "2.0", id: null, error: { code: -32603, message: error.message } })); });
async function handle(request) {
  if (request.method === "initialize") return send({ jsonrpc: "2.0", id: request.id, result: { protocolVersion: request.params?.protocolVersion || "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "gorilla-brain-local", version: "0.5.0" }, instructions: "Use read-only tools to consult the user's authorized Gorilla Brain repository. Cite returned note paths and acknowledge missing evidence." } });
  if (request.method === "ping") return send({ jsonrpc: "2.0", id: request.id, result: {} });
  if (request.method === "tools/list") return send({ jsonrpc: "2.0", id: request.id, result: { tools } });
  if (request.method === "tools/call") { try { const result = await callTool(request.params?.name, request.params?.arguments || {}); return send({ jsonrpc: "2.0", id: request.id, result }); } catch (error) { return send({ jsonrpc: "2.0", id: request.id, result: { isError: true, content: [{ type: "text", text: error.message }] } }); } }
  if (request.id !== undefined) send({ jsonrpc: "2.0", id: request.id, error: { code: -32601, message: "Método no soportado" } });
}
