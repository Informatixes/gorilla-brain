import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.cwd());
const pluginRoot = path.join(root, "plugins", "gorilla-brain");
const errors = [];

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

const manifestPath = path.join(pluginRoot, "plugin.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
check(manifest.$schema === "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", "plugin.json: esquema incorrecto");
check(/^[a-z0-9](?:[a-z0-9.-]{0,62}[a-z0-9])?$/.test(manifest.name), "plugin.json: nombre inválido");
check(/^\d+\.\d+\.\d+$/.test(manifest.version), "plugin.json: versión no SemVer");
const shortDescription = manifest.extensions?.["com.openai"]?.interface?.shortDescription ?? "";
check(shortDescription.length > 0 && shortDescription.length <= 30, "plugin.json: shortDescription debe tener entre 1 y 30 caracteres");
const defaultPrompt = manifest.extensions?.["com.openai"]?.interface?.defaultPrompt;
check(typeof defaultPrompt === "string" || (Array.isArray(defaultPrompt) && defaultPrompt.length >= 1 && defaultPrompt.length <= 3), "plugin.json: defaultPrompt debe ser texto o una lista de 1 a 3 elementos");
const onboarding = manifest.extensions?.["com.openai"]?.onboardingSkill;
check(typeof onboarding === "string" && onboarding.startsWith("./"), "plugin.json: onboardingSkill ausente o inválido");
if (typeof onboarding === "string") {
  check(await exists(path.join(pluginRoot, onboarding)), "plugin.json: onboardingSkill no existe");
}

check(await exists(path.join(pluginRoot, "references", "first-run.md")), "Falta references/first-run.md");

const mcpPath = path.join(pluginRoot, "mcp.json");
check(await exists(mcpPath), "Falta mcp.json");
if (await exists(mcpPath)) {
  const mcp = JSON.parse(await readFile(mcpPath, "utf8"));
  check(mcp.$schema === "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json", "mcp.json: esquema incorrecto");
  const localServer = mcp.mcpServers?.["gorilla-brain-local"];
  check(localServer?.type === "stdio", "mcp.json: servidor local ausente");
  check(Array.isArray(localServer?.args) && localServer.args.some((item) => item.includes("server/index.mjs")), "mcp.json: entrypoint ausente");
  check(await exists(path.join(pluginRoot, "server", "index.mjs")), "Falta server/index.mjs");
}

const skillsRoot = path.join(pluginRoot, "skills");
const skillDirectories = (await readdir(skillsRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory());
check(skillDirectories.length >= 1, "No hay skills");
const skillNames = new Set();

for (const directory of skillDirectories) {
  const skillPath = path.join(skillsRoot, directory.name, "SKILL.md");
  check(await exists(skillPath), `Falta skills/${directory.name}/SKILL.md`);
  if (!(await exists(skillPath))) continue;
  const content = await readFile(skillPath, "utf8");
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  check(Boolean(frontmatter), `${directory.name}: frontmatter ausente`);
  if (!frontmatter) continue;
  const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  check(Boolean(name), `${directory.name}: name ausente`);
  check(Boolean(description), `${directory.name}: description ausente`);
  check(!skillNames.has(name), `${directory.name}: name duplicado ${name}`);
  skillNames.add(name);
}

async function collectFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && [".git", "node_modules", "artifacts", "site-dist", "site-hosting"].includes(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await collectFiles(fullPath));
    else result.push(fullPath);
  }
  return result;
}

const publicFiles = (await collectFiles(root)).filter((filePath) => !filePath.includes(`${path.sep}.git${path.sep}`));
const forbidden = [
  new RegExp(["ALVA", "MANTI"].join(""), "gi"),
  new RegExp(["Álvaro", "Amanti"].join(" "), "gi"),
  new RegExp(["Marta", "Gómez"].join(" "), "gi"),
  new RegExp(["OPENAI", "API", "KEY"].join("_") + "\\s*=", "gi"),
  /sk-[A-Za-z0-9_-]{20,}/g
];

for (const filePath of publicFiles) {
  if (!/\.(md|json|mjs|js|css|html|yaml|yml|txt)$/i.test(filePath)) continue;
  const content = await readFile(filePath, "utf8");
  for (const pattern of forbidden) {
    pattern.lastIndex = 0;
    check(!pattern.test(content), `${path.relative(root, filePath)}: posible dato privado o secreto (${pattern})`);
  }
}

if (errors.length) {
  console.error(`Validación fallida (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Gorilla Brain ${manifest.version}: ${skillDirectories.length} skills válidas; manifiesto, onboarding y privacidad comprobados.`);
