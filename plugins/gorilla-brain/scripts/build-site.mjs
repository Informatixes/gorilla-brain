#!/usr/bin/env node

import { cp, mkdir, readFile, readdir, realpath, lstat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(scriptDirectory, "..");

function parseArguments(values) {
  const result = {};
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith("--")) result[key] = true;
    else {
      result[key] = next;
      index += 1;
    }
  }
  return result;
}

function normalize(value) {
  return value.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\.md$/i, "").replace(/^\/+|\/+$/g, "");
}

function slug(value) {
  return normalize(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9/._-]+/g, "-").replace(/-+/g, "-");
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed.slice(1, -1).split(",").map((item) => item.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
  }
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === "true";
  return trimmed.replace(/^['"]|['"]$/g, "");
}

function parseDocument(source) {
  const metadata = {};
  let body = source.replace(/^\uFEFF/, "");
  const frontmatter = body.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (frontmatter) {
    for (const line of frontmatter[1].split(/\r?\n/)) {
      const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (match) metadata[match[1]] = parseScalar(match[2]);
    }
    body = body.slice(frontmatter[0].length);
  }
  return { metadata, body };
}

function firstHeading(body, fallback) {
  return body.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

async function collectMarkdown(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules", ".openai"].includes(entry.name) || path.resolve(directory, entry.name) === output) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await collectMarkdown(fullPath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) result.push(fullPath);
  }
  return result.sort((a, b) => a.localeCompare(b));
}

function resolveTarget(rawTarget, sourceId, lookup) {
  const target = normalize(decodeURIComponent(rawTarget.split("#")[0]));
  if (!target) return null;
  const relative = normalize(path.posix.join(path.posix.dirname(sourceId), target));
  const candidates = [target, relative, slug(target), slug(relative), path.posix.basename(target), slug(path.posix.basename(target))];
  for (const candidate of candidates) {
    const hit = lookup.get(candidate.toLowerCase());
    if (hit) return hit;
  }
  return null;
}

function extractReferences(body) {
  const references = [];
  const wiki = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g;
  const markdown = /\[([^\]]+)\]\(([^)]+\.md(?:#[^)]+)?)\)/gi;
  for (const match of body.matchAll(wiki)) references.push({ target: match[1].trim(), label: match[2]?.trim() || match[1].trim(), syntax: match[0] });
  for (const match of body.matchAll(markdown)) references.push({ target: match[2].trim(), label: match[1].trim(), syntax: match[0] });
  return references;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

const args = parseArguments(process.argv.slice(2));
if (!args.vault || !args.out) {
  console.error("Uso: node scripts/build-site.mjs --vault <directorio> --out <directorio> [--title <titulo>]");
  process.exit(1);
}

const vault = await realpath(path.resolve(process.cwd(), args.vault));
let output = path.resolve(process.cwd(), args.out);
async function canonicalTarget(target) {
  try { return await realpath(target); }
  catch (error) { if (error.code !== 'ENOENT') throw error; return path.join(await canonicalTarget(path.dirname(target)), path.basename(target)); }
}
output = await canonicalTarget(output);
const relativeVault = path.relative(output, vault);
if (!relativeVault || (!relativeVault.startsWith('..' + path.sep) && relativeVault !== '..' && !path.isAbsolute(relativeVault))) {
  throw new Error('La salida no puede ser la raíz de conocimiento ni un directorio que la contenga.');
}
let entries = [];
try { entries = await readdir(output); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const generated = ['index.html', 'styles.css', 'app.js', 'knowledge.json', '.gorilla-generated.json'];
if (entries.some(name => !generated.includes(name))) throw new Error('Salida con archivos ajenos: elige una carpeta vacía.');
for (const entry of entries) {
  if ((await lstat(path.join(output, entry))).isSymbolicLink()) throw new Error("La salida contiene enlaces simbólicos; usa una carpeta nueva.");
}
if (entries.length) {
  const marker = JSON.parse(await readFile(path.join(output, '.gorilla-generated.json'), 'utf8'));
  if (marker.generator !== 'gorilla-brain' || marker.vault !== vault) throw new Error('Salida no reconocida o pertenece a otro cerebro. Usa una carpeta nueva.');
}
const title = String(args.title || "Gorilla Brain").trim();
const files = await collectMarkdown(vault);
if (files.length === 0) {
  console.error(`No se encontraron archivos Markdown en ${vault}`);
  process.exit(1);
}

const notes = [];
for (const filePath of files) {
  const relative = normalize(path.relative(vault, filePath));
  const source = await readFile(filePath, "utf8");
  const { metadata, body } = parseDocument(source);
  const name = path.posix.basename(relative);
  const noteTitle = String(metadata.title || firstHeading(body, name));
  notes.push({
    id: relative,
    path: `${relative}.md`,
    title: noteTitle,
    type: String(metadata.type || relative.split("/")[0] || "note"),
    status: String(metadata.status || "unknown"),
    tags: unique(Array.isArray(metadata.tags) ? metadata.tags.map(String) : metadata.tags ? [String(metadata.tags)] : []),
    body,
    references: extractReferences(body),
    outgoing: [],
    backlinks: []
  });
}

const lookup = new Map();
for (const note of notes) {
  const keys = [note.id, slug(note.id), note.title, slug(note.title), path.posix.basename(note.id), slug(path.posix.basename(note.id))];
  for (const key of keys) if (!lookup.has(key.toLowerCase())) lookup.set(key.toLowerCase(), note.id);
}

const noteById = new Map(notes.map((note) => [note.id, note]));
const links = [];
const brokenLinks = [];
for (const note of notes) {
  for (const reference of note.references) {
    const target = resolveTarget(reference.target, note.id, lookup);
    if (!target) {
      brokenLinks.push({ source: note.id, target: reference.target, label: reference.label });
      continue;
    }
    if (!note.outgoing.includes(target)) note.outgoing.push(target);
    const destination = noteById.get(target);
    if (!destination.backlinks.includes(note.id)) destination.backlinks.push(note.id);
    if (!links.some((link) => link.source === note.id && link.target === target)) links.push({ source: note.id, target });
  }
}

for (const note of notes) delete note.references;
const connected = new Set(links.flatMap((link) => [link.source, link.target]));
const orphans = notes.filter((note) => !connected.has(note.id)).map((note) => note.id);
const payload = {
  schemaVersion: 1,
  title,
  generatedAt: new Date().toISOString(),
  metrics: { notes: notes.length, links: links.length, brokenLinks: brokenLinks.length, orphans: orphans.length },
  notes,
  links,
  brokenLinks,
  orphans
};

await mkdir(output, { recursive: true });
await cp(path.join(pluginRoot, "site"), output, { recursive: true });
await writeFile(path.join(output, ".gorilla-generated.json"), JSON.stringify({generator: "gorilla-brain", vault}));
const htmlPath = path.join(output, "index.html");
const html = (await readFile(htmlPath, "utf8")).replaceAll("{{SITE_TITLE}}", title.replace(/[<&>"']/g, ""));
await writeFile(htmlPath, html, "utf8");
await writeFile(path.join(output, "knowledge.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(JSON.stringify({ output, ...payload.metrics }, null, 2));
