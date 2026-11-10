---
name: gorilla-brain-setup
description: Usa este flujo cuando una persona quiera crear, configurar, instalar o comenzar su segundo cerebro con Gorilla Brain en un repositorio nuevo o existente.
---

# Configuración inicial de Gorilla Brain

Convierte la realidad del usuario en un repositorio operativo. El usuario describe su trabajo; tú decides la arquitectura.

## Antes de preguntar

1. Inspecciona el repositorio actual sin modificarlo.
2. Si ya existe `STATE.md`, no reinicies: carga el estado y deriva al orquestador.
3. Si hay documentos, identifica formatos y ubicaciones, pero no interpretes nombres de archivo como hechos.
4. No leas ni publiques secretos. No muevas, borres o sobrescribas contenido existente.

Si el repositorio está vacío, ejecuta primero `node ../../scripts/init-brain.mjs --root <ruta> --title <nombre>` para mostrar la vista previa. Ejecuta de nuevo con `--apply` solo después de comprobar la ruta. El inicializador se detiene si encuentra archivos esenciales existentes.

## Única entrevista inicial

Formula juntas estas cinco preguntas y espera una sola respuesta conjunta:

1. ¿Qué actividad, empresa, proyecto o parte de tu vida quieres organizar primero y qué resultado práctico esperas?
2. ¿Qué tareas, consultas o decisiones se repiten y te consumen más tiempo? Incluye un ejemplo reciente.
3. ¿Qué información o documentos utilizas y dónde están guardados actualmente?
4. ¿Qué personas intervienen y qué necesita consultar, aportar o aprobar cada una?
5. ¿Qué información debe mantenerse protegida o separada y qué debería funcionar primero?

No añadas preguntas sobre agentes, RAG, nodos, bases vectoriales, taxonomías, Markdown, repositorios o arquitectura. Son decisiones tuyas.

## Después de la respuesta

No abras otra entrevista inicial. Si falta algo:

- registra lo no esencial como `PENDIENTE DE VALIDAR`;
- toma una decisión provisional reversible;
- solicita únicamente una confirmación imprescindible si existe riesgo de pérdida, exposición o acción externa.

Lee `../../references/methodology.md` y `../../references/knowledge-model.md`. Después crea, usando las plantillas incluidas:

- `PROJECT.md`;
- `STATE.md`;
- `knowledge/CONTEXT.md`;
- `knowledge/SOURCES.md`;
- `knowledge/DECISIONS.md`;
- `agents/AGENTS.md`;
- las carpetas mínimas que requiera el caso real.

Cuando el usuario necesite consultar el repositorio desde el agente principal, ejecuta `node ../../scripts/create-librarian.mjs --root <ruta> --scope <ámbito> --folders <carpetas>` como vista previa y después con `--apply`. No amplíes las carpetas autorizadas por conveniencia.

No copies ejemplos como si fueran datos del usuario. Conserva siempre la procedencia y separa:

- hechos confirmados;
- información reportada;
- decisiones recomendadas;
- hipótesis;
- pendientes.

## Cierre

Marca la fase `discover` como completada cuando existan objetivo, alcance inicial, límites y primer caso de uso. Deja `STATE.md` con la siguiente acción concreta y entrega un resumen de archivos creados o modificados.

