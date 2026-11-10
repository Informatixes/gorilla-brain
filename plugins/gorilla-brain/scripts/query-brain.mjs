#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function argumentsFrom(values) {
  const result = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) continue;
    const key = value.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith("--")) result[key] = true;
    else { result[key] = next; index += 1; }
  }
  return result;
}

function normalize(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const stopwords = new Set(["a", "al", "algo", "como", "con", "cual", "de", "del", "el", "en", "es", "esta", "este", "la", "las", "lo", "los", "o", "para", "por", "que", "se", "sin", "su", "sus", "un", "una", "y"]);

function terms(value) {
  return [...new Set(normalize(value).split(/[^a-z0-9]+/).filter((term) => term.length > 1 && !stopwords.has(term)))];
}

function parseDocument(source, fallback) {
  const metadata = {};
  let body = source.replace(/^\uFEFF/, "");
  const frontmatter = body.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (frontmatter) {
    for (const line of frontmatter[1].split(/\r?\n/)) {
      const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (match) metadata[match[1]] = match[2].replace(/^\[|\]$/g, "").replace(/["']/g, "");
    }
    body = body.slice(frontmatter[0].length);
  }
  const title = metadata.title || body.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
  return { metadata, body, title };
}

async function markdownFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", ".openai", "node_modules"].includes(entry.name)) continue;
    if (entry.isSymbolicLink()) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await markdownFiles(fullPath));
    else if (entry.name.toLowerCase().endsWith(".md")) result.push(fullPath);
  }
  return result;
}

function count(haystack, needle) {
  let matches = 0, start = 0;
  while ((start = haystack.indexOf(needle, start)) !== -1) { matches += 1; start += needle.length; }
  return matches;
}

function cleanText(value) {
  return value.replace(/^---[\s\S]*?---/m, "").replace(/^#{1,6}\s+/gm, "").replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => alias || target).replace(/[*_`>|]/g, "").replace(/\s+/g, " ").trim();
}

function bestSnippet(body, queryTerms) {
  const blocks = body.split(/\r?\n\s*\r?\n/).map(cleanText).filter((block) => block.length > 30);
  const ranked = blocks.map((block) => ({ block, score: queryTerms.reduce((total, term) => total + count(normalize(block), term), 0) })).sort((a, b) => b.score - a.score || b.block.length - a.block.length);
  const text = ranked[0]?.block || cleanText(body);
  return text.length > 320 ? `${text.slice(0, 317).trim()}…` : text;
}

const args = argumentsFrom(process.argv.slice(2));
if (!args.vault || !args.query) {
  console.error("Uso: node scripts/query-brain.mjs --vault <directorio> --query <consulta> [--limit 5] [--format json|markdown]");
  process.exit(1);
}

const vault = path.resolve(process.cwd(), args.vault);
const query = String(args.query).trim();
const queryTerms = terms(query);
if (!query || queryTerms.length === 0) {
  console.error("La consulta no contiene términos significativos.");
  process.exit(1);
}

const results = [];
for (const file of await markdownFiles(vault)) {
  const relativePath = path.relative(vault, file).replaceAll("\\", "/");
  const source = await readFile(file, "utf8");
  const note = parseDocument(source, path.basename(file, ".md"));
  const normalized = { title: normalize(note.title), path: normalize(relativePath), tags: normalize(note.metadata.tags || ""), body: normalize(note.body) };
  let score = 0;
  for (const term of queryTerms) score += count(normalized.title, term) * 10 + count(normalized.tags, term) * 6 + count(normalized.path, term) * 4 + count(normalized.body, term);
  if (normalized.title.includes(normalize(query))) score += 20;
  if (score > 0) results.push({ path: relativePath, title: note.title, type: note.metadata.type || "note", status: note.metadata.status || "unknown", score, snippet: bestSnippet(note.body, queryTerms) });
}

results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
const limit = Math.min(20, Math.max(1, Number.parseInt(args.limit || "5", 10) || 5));
const output = { query, terms: queryTerms, matches: results.length, results: results.slice(0, limit) };

if (args.format === "markdown") {
  console.log(`# Consulta: ${query}\n`);
  if (!output.results.length) console.log("No se encontraron notas relacionadas. No completes la respuesta con conocimiento externo.");
  for (const result of output.results) console.log(`## ${result.title}\n\n- Fuente: \`${result.path}\`\n- Tipo: ${result.type}\n- Estado: ${result.status}\n- Relevancia: ${result.score}\n\n${result.snippet}\n`);
} else {
  console.log(JSON.stringify(output, null, 2));
}
