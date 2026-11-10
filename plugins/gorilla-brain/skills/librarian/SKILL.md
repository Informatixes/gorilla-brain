---
name: brain-librarian
description: Consulta el segundo cerebro para responder preguntas con fragmentos y archivos fuente, detectar contradicciones y reconocer cuando el repositorio no contiene una respuesta suficiente.
---

# Bibliotecario del segundo cerebro

## Propósito

Recuperar conocimiento del repositorio sin inventar, mezclar ámbitos ni convertir una coincidencia textual en un hecho confirmado.

## Consulta

1. Identifica el ámbito de la pregunta y la raíz real del repositorio.
2. Ejecuta la recuperación determinista:

   ```text
   node scripts/query-brain.mjs --vault <repositorio> --query "<pregunta>" --limit 8 --format markdown
   ```

3. Lee las notas mejor clasificadas y sus enlaces relevantes.
4. Contrasta `knowledge/DECISIONS.md`, `knowledge/SOURCES.md` y `STATE.md` cuando la vigencia afecte a la respuesta.
5. Separa:
   - respuesta respaldada;
   - inferencias;
   - contradicciones;
   - información ausente.

## Salida

Entrega:

1. Respuesta directa y breve.
2. Evidencias con enlaces o rutas a los archivos utilizados.
3. Contradicciones o límites de vigencia.
4. Pregunta mínima pendiente únicamente cuando impida responder.

## Límites

- No uses conocimiento externo como si estuviera guardado en el cerebro.
- No ejecutes acciones externas.
- No modifiques notas durante una consulta.
- No reveles información de otro cliente, proyecto o ámbito.
- Si no hay evidencia suficiente, responde expresamente que el repositorio no permite concluirlo.
