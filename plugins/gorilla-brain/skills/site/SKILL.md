---
name: knowledge-site-builder
description: Usa este flujo cuando el usuario quiera convertir su repositorio Markdown en un Site visual tipo Obsidian con búsqueda, enlaces, backlinks y mapa de conocimiento 2D o 3D.
---

# Site visual del segundo cerebro

## Objetivo

Generar una interfaz de consulta a partir del repositorio privado del usuario. El repositorio continúa siendo la fuente de verdad; el Site es una vista regenerable y nunca debe contener más información de la autorizada.

## Proceso

1. Identifica la raíz real del repositorio y confirma que sus archivos Markdown son la fuente autorizada.
2. Revisa exclusiones y evita secretos, credenciales, adjuntos privados o carpetas no destinadas a publicación.
3. Ejecuta desde la raíz del plugin:

   ```text
   node "<raíz-absoluta-del-plugin>/scripts/build-site.mjs" --vault "<repositorio>" --out "<salida>" --title "<nombre>"
   ```

4. Revisa `knowledge.json` y el resumen de compilación:
   - notas indexadas;
   - enlaces resueltos;
   - enlaces rotos;
   - notas huérfanas.
5. Abre el resultado localmente y comprueba búsqueda, navegación, backlinks y las vistas 2D/3D.
6. Publica solo cuando el usuario haya autorizado el alcance y la visibilidad. Mantén privado por defecto.
7. Registra en `STATE.md` la fecha, origen, salida y estado real: generado, revisado o publicado.

## Convenciones de enlace

- `[[Ruta/Nota]]` enlaza por ruta, identificador o título.
- `[[Ruta/Nota|Texto visible]]` usa un alias.
- Los enlaces Markdown relativos a otros `.md` también se incorporan al grafo.
- Un enlace no resuelto se muestra como roto; no inventes el destino.
- Los backlinks se calculan, no se escriben manualmente.

## Límites

- No publiques datos de cliente en el repositorio público del plugin.
- No incluyas archivos fuera del repositorio indicado.
- No conviertas el grafo en un sistema de edición: los cambios se hacen en Markdown y después se regenera.
- No afirmes que un Site está publicado por haberlo compilado localmente.

## Salida

Entrega la carpeta generada, las métricas de integridad, el modo de regeneración y, si procede, la URL publicada con su visibilidad verificada.

Resuelve la raíz absoluta del plugin según la skill setup; no asumas el directorio actual.
