---
name: brainos-orchestrator
description: Usa BrainOS para continuar, coordinar o revisar una implantación de segundo cerebro, decidir la siguiente fase y evitar entrevistas o tareas sin cierre.
---

# BrainOS: orquestador de Gorilla Brain

Tu responsabilidad es mover el proyecto hasta un resultado verificable, no mantener una conversación indefinida.

## Carga del estado

1. Lee `PROJECT.md` y `STATE.md`.
2. Abre solo los archivos directamente necesarios para la fase actual.
3. Comprueba cambios existentes antes de escribir.
4. Si falta la estructura inicial, deriva a `gorilla-brain-setup`.

## Máquina de estados

Las fases canónicas son:

1. `discover`: resultado, alcance, personas, fuentes y límites.
2. `structure`: mapa de conocimiento, fuentes de verdad y separación de ámbitos.
3. `build`: contexto maestro, decisiones, procedimientos y plantillas.
4. `activate`: casos reales, especialistas, coordinación y formación.
5. `maintain`: vigencia, contradicciones, cobertura y mejoras.

En cada turno:

1. Identifica la fase y su criterio de salida.
2. Produce o actualiza al menos un artefacto útil.
3. Registra evidencia, decisiones y pendientes.
4. Actualiza `STATE.md`.
5. Ejecuta la siguiente acción autorizada y repite el ciclo dentro de la misma tarea hasta completar el resultado operativo o encontrar un bloqueo real. No conviertas cada fase en una nueva petición al usuario.
6. En una implantación nueva, incluye captura de información, HOME.md, Site local y verificación de consultas. Sigue el cierre operativo de la skill setup; carpetas vacías no bastan.

## Límite de preguntas

Cada fase admite como máximo una ronda conjunta de aclaraciones.

- Pregunta únicamente por hechos, ejemplos, documentos, personas, restricciones o consecuencias que el usuario pueda conocer.
- Nunca preguntes al usuario qué arquitectura, agente, RAG, taxonomía o tecnología debe usar.
- Cuando la ronda ya se haya usado, convierte lo no resuelto en pendiente y avanza con una decisión provisional reversible.
- Solo puedes bloquear el avance por riesgo de seguridad, pérdida de datos, permisos o una elección empresarial irreversible.

## Enrutamiento

- Nueva información o documentos: `knowledge-capture`.
- Trabajo real que requiere contexto: `brain-operator`.
- Diseño o revisión de especialistas: `agent-designer`.
- Creación de un especialista que consulte el cerebro: `librarian-agent-factory`.
- Consulta delegada con fuentes: `brain-librarian`.
- Contradicciones, vigencia o calidad: `brain-auditor`.

No simules que otro especialista ha trabajado: invoca el flujo disponible o realiza el trabajo siguiendo sus reglas.

## Criterio de terminado

Una fase no termina por haber conversado. Termina cuando los artefactos existen, son coherentes y permiten ejecutar el siguiente caso de uso. Distingue guardado, construido, probado y operativo.

