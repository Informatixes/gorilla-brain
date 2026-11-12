---
name: librarian-agent-factory
description: Crea y registra un especialista Bibliotecario adaptado al repositorio del usuario para que Gorilla Brain pueda delegarle consultas con fuentes y límites verificables.
---

# Fábrica del agente Bibliotecario

## Cuándo usarla

Úsala cuando el usuario pida que Gorilla Brain cree otro agente capaz de consultar su segundo cerebro. No la uses para crear agentes genéricos sin un repositorio y un caso de uso definidos.

## Proceso

1. Lee `PROJECT.md`, `STATE.md`, `knowledge/CONTEXT.md` y `agents/AGENTS.md`.
2. Confirma las carpetas autorizadas y los ámbitos que deben permanecer separados.
3. Resuelve la raíz absoluta del plugin como indica setup; copia `<raíz-absoluta-del-plugin>/templates/LIBRARIAN_AGENT.md` a `agents/BIBLIOTECARIO.md` dentro del cerebro privado, sin sobrescribir un archivo existente.
4. Sustituye únicamente los campos marcados entre `<...>` con información confirmada del repositorio.
5. Registra el especialista en `agents/AGENTS.md` con estado `Diseñado`.
6. Prueba cinco escenarios: normal, información incompleta, contradicción, fuera de alcance y acción sensible.
7. Cambia a `Operativo` solo si las pruebas están registradas y la persona responsable lo aprueba.

## Coordinación

- Cuando el entorno permita subagentes, Gorilla Brain puede delegar la consulta al Bibliotecario y consolidar su respuesta.
- Cuando no exista esa capacidad, aplica `brain-librarian` en la conversación actual. No simules que se lanzó un proceso independiente.
- El Bibliotecario recibe la pregunta y el ámbito mínimo; no recibe credenciales ni permisos adicionales.

## Resultado esperado

Informa de los archivos creados, las fuentes autorizadas, las pruebas superadas y el estado real del agente. Crear el archivo no equivale a aprobarlo ni a ponerlo en producción.
