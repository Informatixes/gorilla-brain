## 0.6.0 — 2026-11-13

- Onboarding obligatorio que explica qué es Gorilla Brain, qué encontrará el usuario, cómo consultarlo, qué pasos realizará y qué accesos no obtiene por instalarlo.
- Flujo `daily-brain-maintenance` para actualizaciones idempotentes, trazables y limitadas a fuentes autorizadas.
- Política de mantenimiento por implantación, registro diario, cursores por fuente y estados verificables de automatización.
- Inicializador y pruebas ampliados con mantenimiento desactivado de forma segura por defecto.
- No declara sincronización diaria activa hasta verificar fuente, permisos, programador y una ejecución completa.

## 0.5.1 — Corrección de arranque y recorrido completo

- Rutas absolutas resueltas desde la skill y diagnóstico temprano de ejecución/Node.
- Configuración que continúa hasta captura, Site y consultas verificadas; límites de memoria e historial explícitos.
- Continuidad local mediante AGENTS.md y mantenimiento limitado al alcance autorizado.
- Generación del Site sin borrado recursivo, rechazo de salida sobre las fuentes o archivos ajenos.
- Pruebas desde carpetas con espacios y directorio de trabajo distinto del plugin.
- No implica aceptación del usuario ni prueba en todos los hosts ChatGPT/Codex.

# Changelog

## 0.5.0 — 2026-11-10

- Inicializador de implantaciones con vista previa, creación explícita y protección contra sobrescritura.
- Generador del agente Bibliotecario adaptado al ámbito y carpetas autorizadas de cada cliente.
- MCP local de escritorio con búsqueda, lectura de notas y estado, todas en solo lectura.
- Guía integral de piloto con privacidad, fuentes, Site, criterios de aceptación y recuperación.
- Pruebas automáticas del circuito de alta, consulta trazable y protocolo MCP.

## 0.4.0 — 2026-11-10

- Consulta funcional del segundo cerebro desde el Site, con resultados enlazados a sus notas fuente.
- Recuperador determinista `query-brain.mjs` para consultas trazables desde terminal o agentes.
- Skill `brain-librarian` para responder con evidencias, contradicciones y ausencias explícitas.
- Skill `librarian-agent-factory` para que Gorilla Brain cree y registre un Bibliotecario adaptado al repositorio.
- Plantilla del agente Bibliotecario con permisos de solo lectura y pruebas de aceptación.

## 0.3.0 — 2026-11-10

- Experiencia de notas más cercana a Obsidian, conservando la identidad visual de Gorilla Brain.
- Iconos SVG por tipo de nota y carpetas con una familia visual consistente.
- Pestaña activa, ruta jerárquica y bloque de propiedades por nota.
- Renderizado de tablas Markdown con desplazamiento horizontal accesible en móvil.
- Plantilla `NOTE.md` con relaciones, seguimiento y tabla estructurada.

## 0.2.0 — 2026-11-10

- Compilador determinista de repositorios Markdown a Site estático.
- Soporte para wikilinks, aliases, enlaces Markdown, backlinks y métricas de integridad.
- Explorador, búsqueda y navegación tipo Obsidian.
- Mapa interactivo 2D y 3D en Canvas, sin dependencias externas de JavaScript.
- Skill `knowledge-site-builder` para generar, revisar y publicar el Site por cliente.
- Repositorio ficticio de demostración y prueba completa del build.

## 0.1.0 — 2026-11-10

- Primera versión pública del plugin Gorilla Brain.
- Orquestación por fases con una sola ronda de preguntas por fase.
- Configuración inicial, captura, uso operativo, diseño de especialistas y auditoría.
- Plantillas para proyecto, estado, contexto, fuentes, decisiones y agentes.
- Marketplace de repositorio y validador sin dependencias.

