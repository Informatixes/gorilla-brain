const state = {
  data: null,
  notes: new Map(),
  currentId: null,
  view: "notes",
  query: "",
  graph: { mode: "2d", rotationX: -0.18, rotationY: 0.18, zoom: 1, panX: 0, panY: 0, dragging: false, moved: false, lastX: 0, lastY: 0, nodes: [], projected: [] }
};

const elements = {
  title: document.querySelector("#site-title"),
  metrics: document.querySelector("#metrics"),
  tree: document.querySelector("#tree"),
  search: document.querySelector("#search"),
  note: document.querySelector("#note"),
  activeTab: document.querySelector("#active-tab"),
  breadcrumbs: document.querySelector("#breadcrumbs"),
  noteMeta: document.querySelector("#note-meta"),
  outgoing: document.querySelector("#outgoing"),
  backlinks: document.querySelector("#backlinks"),
  integrity: document.querySelector("#integrity"),
  notesView: document.querySelector("#notes-view"),
  graphView: document.querySelector("#graph-view"),
  graphTitle: document.querySelector("#graph-title"),
  canvas: document.querySelector("#graph"),
  navigation: document.querySelector("#navigation"),
  mobileNav: document.querySelector("#mobile-nav"),
  status: document.querySelector("#status")
};

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
const escapeAttribute = escapeHtml;

const iconPaths = {
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
  folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  project: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
  process: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h5a3 3 0 0 1 3 3v7M16 18H9a3 3 0 0 1-3-3V8"/>',
  decision: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/>',
  sources: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/>',
  agent: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/>',
  tag: '<path d="M20 13 11 22l-9-9V2h11Z"/><circle cx="7" cy="7" r="1"/>',
  status: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  type: '<path d="M4 5h16M4 12h10M4 19h13"/>'
};

function icon(name, className = "") {
  return `<svg class="ui-icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.file}</svg>`;
}

function noteIcon(note) {
  const type = note?.type?.toLowerCase() || "";
  if (type === "index") return "home";
  if (type.includes("project")) return "project";
  if (type.includes("process")) return "process";
  if (type.includes("decision")) return "decision";
  if (type.includes("source")) return "sources";
  if (type.includes("agent")) return "agent";
  return "file";
}

function resolveReference(raw, sourceId) {
  const target = raw.split("#")[0].replace(/\\/g, "/").replace(/\.md$/i, "").replace(/^\.\//, "");
  const sourceDirectory = sourceId.includes("/") ? sourceId.slice(0, sourceId.lastIndexOf("/")) : "";
  const candidates = [target, sourceDirectory ? `${sourceDirectory}/${target}` : target];
  for (const candidate of candidates) {
    const clean = candidate.split("/").reduce((parts, part) => part === ".." ? parts.slice(0, -1) : part === "." ? parts : [...parts, part], []).join("/");
    if (state.notes.has(clean)) return clean;
  }
  const lower = target.toLowerCase();
  return [...state.notes.values()].find((note) => note.title.toLowerCase() === lower || note.id.split("/").at(-1).toLowerCase() === lower)?.id || null;
}

function inlineMarkdown(text, sourceId) {
  let result = escapeHtml(text);
  result = result.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, raw, alias) => {
    const target = resolveReference(raw, sourceId);
    const label = escapeHtml(alias || raw);
    return target ? `<button class="note-link" data-note="${escapeAttribute(target)}" type="button">${label}</button>` : `<span class="broken-link" title="Enlace no resuelto">${label}</span>`;
  });
  result = result.replace(/\[([^\]]+)\]\(([^)]+\.md(?:#[^)]+)?)\)/gi, (_, label, raw) => {
    const target = resolveReference(raw, sourceId);
    return target ? `<button class="note-link" data-note="${escapeAttribute(target)}" type="button">${escapeHtml(label)}</button>` : `<span class="broken-link">${escapeHtml(label)}</span>`;
  });
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  return result;
}

function parseTableRow(line) {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

function isTableDivider(line) {
  const cells = parseTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function renderMarkdown(markdown, sourceId) {
  const lines = markdown.split(/\r?\n/);
  const output = [];
  let list = null;
  const closeList = () => { if (list) { output.push(`</${list}>`); list = null; } };
  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trimEnd();
    if (!line.trim()) { closeList(); continue; }
    if (line.includes("|") && lines[index + 1]?.includes("|") && isTableDivider(lines[index + 1])) {
      closeList();
      const headers = parseTableRow(line);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].trim() && lines[index].includes("|")) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }
      index -= 1;
      output.push(`<div class="table-wrap" role="region" aria-label="Tabla desplazable" tabindex="0"><table><thead><tr>${headers.map((cell) => `<th scope="col">${inlineMarkdown(cell, sourceId)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${headers.map((_, cellIndex) => `<td>${inlineMarkdown(row[cellIndex] || "", sourceId)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { closeList(); output.push(`<h${heading[1].length}>${inlineMarkdown(heading[2], sourceId)}</h${heading[1].length}>`); continue; }
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (bullet || ordered) {
      const wanted = bullet ? "ul" : "ol";
      if (list !== wanted) { closeList(); list = wanted; output.push(`<${list}>`); }
      output.push(`<li>${inlineMarkdown((bullet || ordered)[1], sourceId)}</li>`);
      continue;
    }
    const quote = line.match(/^>\s?(.+)$/);
    if (quote) { closeList(); output.push(`<blockquote>${inlineMarkdown(quote[1], sourceId)}</blockquote>`); continue; }
    closeList();
    output.push(`<p>${inlineMarkdown(line, sourceId)}</p>`);
  }
  closeList();
  return output.join("\n");
}

function groupNotes(notes) {
  return notes.reduce((groups, note) => {
    const folder = note.id.includes("/") ? note.id.split("/")[0] : "Inicio";
    (groups[folder] ||= []).push(note);
    return groups;
  }, {});
}

function renderMetrics() {
  const { notes, links, brokenLinks, orphans } = state.data.metrics;
  elements.metrics.innerHTML = [
    [notes, "Notas", false], [links, "Conexiones", false], [brokenLinks, "Rotos", brokenLinks > 0], [orphans, "Huérfanas", orphans > 0]
  ].map(([value, label, warning]) => `<div class="metric${warning ? " has-warning" : ""}"><strong>${value}</strong><span>${label}</span></div>`).join("");
}

function renderTree() {
  const query = state.query.toLowerCase().trim();
  const filtered = [...state.notes.values()].filter((note) => !query || [note.title, note.body, note.tags.join(" "), note.type].join(" ").toLowerCase().includes(query));
  const groups = groupNotes(filtered);
  elements.tree.innerHTML = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).map(([folder, notes]) => `
    <div class="tree-group">
      <button class="tree-folder" type="button" aria-expanded="true">
        <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>${icon("folder", "folder-icon")}${escapeHtml(folder)}<span>(${notes.length})</span>
      </button>
      <div class="tree-items">${notes.sort((a, b) => a.title.localeCompare(b.title)).map((note) => `<button class="tree-note${note.id === state.currentId ? " is-active" : ""}" data-note="${escapeAttribute(note.id)}" type="button">${icon(noteIcon(note))}<span>${escapeHtml(note.title)}</span></button>`).join("")}</div>
    </div>`).join("") || `<p class="empty-state">No hay resultados para “${escapeHtml(state.query)}”.</p>`;
}

function noteButton(id) {
  const note = state.notes.get(id);
  return note ? `<button class="context-link" data-note="${escapeAttribute(id)}" type="button">${escapeHtml(note.title)}</button>` : "";
}

function renderNote() {
  const note = state.notes.get(state.currentId);
  if (!note) return;
  const bodyWithoutTitle = note.body.replace(/^\s*#\s+.+\r?\n?/, "");
  const properties = `<div class="properties" aria-label="Propiedades de la nota"><div class="property-name">${icon("type")}Tipo</div><div class="property-value">${escapeHtml(note.type)}</div><div class="property-name">${icon("status")}Estado</div><div class="property-value">${escapeHtml(note.status)}</div><div class="property-name">${icon("tag")}Etiquetas</div><div class="property-value">${note.tags.length ? note.tags.map((tag) => `#${escapeHtml(tag)}`).join(" · ") : "Sin etiquetas"}</div></div>`;
  elements.note.innerHTML = `<div class="eyebrow">Nota · ${escapeHtml(note.type)}</div><h1>${escapeHtml(note.title)}</h1>${properties}${renderMarkdown(bodyWithoutTitle, note.id)}`;
  elements.activeTab.innerHTML = `${icon(noteIcon(note))}<span>${escapeHtml(note.title)}</span>`;
  const route = note.id.split("/");
  elements.breadcrumbs.innerHTML = route.map((part, index) => `${index ? '<span class="separator">›</span>' : ""}<span>${escapeHtml(index === route.length - 1 ? note.title : part)}</span>`).join("");
  elements.noteMeta.innerHTML = `<h2 class="meta-title">${escapeHtml(note.title)}</h2><div class="meta-path">${escapeHtml(note.path)}</div><div class="chips"><span class="chip status">${escapeHtml(note.status)}</span><span class="chip">${escapeHtml(note.type)}</span>${note.tags.map((tag) => `<span class="chip">#${escapeHtml(tag)}</span>`).join("")}</div>`;
  elements.outgoing.innerHTML = note.outgoing.map(noteButton).join("") || `<span class="empty-state">Sin enlaces salientes</span>`;
  elements.backlinks.innerHTML = note.backlinks.map(noteButton).join("") || `<span class="empty-state">Sin backlinks</span>`;
  const localBroken = state.data.brokenLinks.filter((link) => link.source === note.id).length;
  elements.integrity.innerHTML = `<div class="integrity-row"><span>Entradas</span><strong>${note.backlinks.length}</strong></div><div class="integrity-row"><span>Salidas</span><strong>${note.outgoing.length}</strong></div><div class="integrity-row"><span>Enlaces rotos</span><strong>${localBroken}</strong></div>`;
  document.title = `${note.title} · ${state.data.title}`;
}

function selectNote(id, switchView = true) {
  if (!state.notes.has(id)) return;
  state.currentId = id;
  if (switchView) setView("notes");
  renderTree();
  renderNote();
  elements.notesView.scrollTop = 0;
  elements.navigation.classList.remove("is-open");
  elements.mobileNav.setAttribute("aria-expanded", "false");
  history.replaceState(null, "", `#${encodeURIComponent(id)}`);
}

function setView(view) {
  state.view = view;
  const graph = view.startsWith("graph");
  state.graph.mode = view === "graph3d" ? "3d" : "2d";
  elements.notesView.classList.toggle("is-active", !graph);
  elements.graphView.classList.toggle("is-active", graph);
  document.querySelectorAll(".view-button").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  elements.graphTitle.textContent = state.graph.mode === "3d" ? "Mapa 3D del conocimiento" : "Mapa 2D del conocimiento";
  if (graph) requestAnimationFrame(() => { resizeCanvas(); drawGraph(); });
}

function buildGraphNodes() {
  const total = state.data.notes.length;
  state.graph.nodes = state.data.notes.map((note, index) => {
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    const y = total === 1 ? 0 : 1 - (index / (total - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    return { id: note.id, title: note.title, type: note.type, x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
  });
}

function resizeCanvas() {
  const rect = elements.canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  elements.canvas.width = Math.max(1, Math.round(rect.width * ratio));
  elements.canvas.height = Math.max(1, Math.round(rect.height * ratio));
  const context = elements.canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function project(node, width, height) {
  const graph = state.graph;
  let { x, y, z } = node;
  if (graph.mode === "2d") {
    const index = graph.nodes.indexOf(node);
    const angle = (index / graph.nodes.length) * Math.PI * 2 - Math.PI / 2;
    const ring = 0.52 + (index % 3) * 0.12;
    x = Math.cos(angle) * ring; y = Math.sin(angle) * ring; z = 0;
  } else {
    const cy = Math.cos(graph.rotationY), sy = Math.sin(graph.rotationY);
    const cx = Math.cos(graph.rotationX), sx = Math.sin(graph.rotationX);
    const x1 = x * cy - z * sy;
    const z1 = x * sy + z * cy;
    const y1 = y * cx - z1 * sx;
    z = y * sx + z1 * cx; x = x1; y = y1;
  }
  const perspective = graph.mode === "3d" ? 1 / (1.7 - z * .45) : 1;
  const scale = Math.min(width, height) * .43 * graph.zoom * perspective;
  return { ...node, screenX: width / 2 + graph.panX + x * scale, screenY: height / 2 + graph.panY + y * scale, depth: z, radius: Math.max(5, 7 * perspective) };
}

function drawGraph() {
  if (!state.data || !elements.graphView.classList.contains("is-active")) return;
  const context = elements.canvas.getContext("2d");
  const rect = elements.canvas.getBoundingClientRect();
  context.clearRect(0, 0, rect.width, rect.height);
  state.graph.projected = state.graph.nodes.map((node) => project(node, rect.width, rect.height));
  const byId = new Map(state.graph.projected.map((node) => [node.id, node]));

  context.lineWidth = 1;
  for (const link of state.data.links) {
    const source = byId.get(link.source), target = byId.get(link.target);
    if (!source || !target) continue;
    context.strokeStyle = link.source === state.currentId || link.target === state.currentId ? "rgba(200,162,0,.7)" : "rgba(70,70,70,.16)";
    context.beginPath(); context.moveTo(source.screenX, source.screenY); context.lineTo(target.screenX, target.screenY); context.stroke();
  }

  for (const node of [...state.graph.projected].sort((a, b) => a.depth - b.depth)) {
    const active = node.id === state.currentId;
    context.fillStyle = active ? "#f4c900" : "#ffffff";
    context.strokeStyle = active ? "#8c7300" : "#555555";
    context.lineWidth = active ? 2 : 1;
    context.beginPath(); context.arc(node.screenX, node.screenY, active ? node.radius + 3 : node.radius, 0, Math.PI * 2); context.fill(); context.stroke();
    context.fillStyle = active ? "#171717" : "#4a4a4a";
    context.font = `${active ? 600 : 400} 11px Roboto, Arial, sans-serif`;
    context.textAlign = "center";
    context.fillText(node.title.length > 28 ? `${node.title.slice(0, 26)}…` : node.title, node.screenX, node.screenY + node.radius + 16);
  }
}

function resetGraph() {
  Object.assign(state.graph, { rotationX: -0.18, rotationY: 0.18, zoom: 1, panX: 0, panY: 0 });
  drawGraph();
}

function hitNode(x, y) {
  return [...state.graph.projected].reverse().find((node) => Math.hypot(node.screenX - x, node.screenY - y) <= node.radius + 9);
}

function canvasPoint(event) {
  const rect = elements.canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function showStatus(message) {
  elements.status.textContent = message;
  elements.status.classList.add("is-visible");
  clearTimeout(showStatus.timeout);
  showStatus.timeout = setTimeout(() => elements.status.classList.remove("is-visible"), 1600);
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const noteButton = event.target.closest("[data-note]");
    if (noteButton) selectNote(noteButton.dataset.note);
    const folder = event.target.closest(".tree-folder");
    if (folder) {
      const group = folder.closest(".tree-group");
      group.classList.toggle("is-collapsed");
      folder.setAttribute("aria-expanded", String(!group.classList.contains("is-collapsed")));
    }
  });
  document.querySelectorAll(".view-button").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  elements.search.addEventListener("input", () => { state.query = elements.search.value; renderTree(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== elements.search) { event.preventDefault(); elements.search.focus(); }
    if (event.key === "Escape") { elements.search.value = ""; state.query = ""; renderTree(); elements.search.blur(); }
  });
  document.querySelector("#expand-tree").addEventListener("click", () => {
    document.querySelectorAll(".tree-group").forEach((group) => group.classList.remove("is-collapsed"));
  });
  elements.mobileNav.addEventListener("click", () => {
    const open = elements.navigation.classList.toggle("is-open");
    elements.mobileNav.setAttribute("aria-expanded", String(open));
  });
  document.querySelector("#reset-graph").addEventListener("click", resetGraph);
  window.addEventListener("resize", () => { if (state.view.startsWith("graph")) { resizeCanvas(); drawGraph(); } });

  elements.canvas.addEventListener("pointerdown", (event) => {
    const point = canvasPoint(event);
    Object.assign(state.graph, { dragging: true, moved: false, lastX: point.x, lastY: point.y });
    elements.canvas.setPointerCapture(event.pointerId);
  });
  elements.canvas.addEventListener("pointermove", (event) => {
    if (!state.graph.dragging) return;
    const point = canvasPoint(event), dx = point.x - state.graph.lastX, dy = point.y - state.graph.lastY;
    if (Math.abs(dx) + Math.abs(dy) > 2) state.graph.moved = true;
    if (state.graph.mode === "3d") { state.graph.rotationY += dx * .008; state.graph.rotationX += dy * .008; }
    else { state.graph.panX += dx; state.graph.panY += dy; }
    state.graph.lastX = point.x; state.graph.lastY = point.y; drawGraph();
  });
  elements.canvas.addEventListener("pointerup", (event) => {
    const point = canvasPoint(event);
    if (!state.graph.moved) {
      const node = hitNode(point.x, point.y);
      if (node) { selectNote(node.id, false); drawGraph(); showStatus(`${node.title} seleccionado`); }
    }
    state.graph.dragging = false;
  });
  elements.canvas.addEventListener("wheel", (event) => {
    event.preventDefault(); state.graph.zoom = Math.min(2.6, Math.max(.45, state.graph.zoom * (event.deltaY > 0 ? .9 : 1.1))); drawGraph();
  }, { passive: false });
}

async function start() {
  try {
    const response = await fetch("knowledge.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.data = await response.json();
    state.notes = new Map(state.data.notes.map((note) => [note.id, note]));
    elements.title.textContent = state.data.title;
    const hash = decodeURIComponent(location.hash.slice(1));
    state.currentId = state.notes.has(hash) ? hash : state.data.notes.find((note) => /(^|\/)home$/i.test(note.id))?.id || state.data.notes[0]?.id;
    renderMetrics(); renderTree(); renderNote(); buildGraphNodes(); bindEvents();
  } catch (error) {
    elements.note.innerHTML = `<div class="eyebrow">Error de carga</div><h1>No se pudo abrir el segundo cerebro</h1><p>Comprueba que <code>knowledge.json</code> existe y que el Site se sirve mediante HTTP.</p><p>${escapeHtml(error.message)}</p>`;
    console.error(error);
  }
}

start();
