# Gorilla Brain

Gorilla Brain convierte ChatGPT o Codex en un acompañante para construir, utilizar y mantener un segundo cerebro propio. No es un chatbot que encadena entrevistas: trabaja sobre archivos, conserva trazabilidad y cierra cada fase con entregables verificables.

Desarrollado por [Innown](https://innown.es).

## Qué hace

- Crea un repositorio de conocimiento adaptado al usuario o a su organización.
- Separa hechos confirmados, decisiones, hipótesis y pendientes.
- Limita cada fase a una única ronda de preguntas comprensibles para el usuario.
- Propone la arquitectura técnica sin trasladar esas decisiones al cliente.
- Diseña especialistas y un coordinador solo cuando existe contexto suficiente.
- Usa el segundo cerebro para resolver trabajo real sin volcar todo el repositorio en cada conversación.
- Audita contradicciones, fuentes, permisos y vigencia.
- Genera un Site visual tipo Obsidian desde cualquier repositorio Markdown.
- Resuelve wikilinks, backlinks, enlaces Markdown, huérfanas y enlaces rotos.
- Incluye búsqueda, explorador y mapas interactivos 2D y 3D sin dependencias de frontend.

## Instalación desde GitHub

En Codex o ChatGPT Desktop, añade este repositorio como marketplace:

```text
codex plugin marketplace add Informatixes/gorilla-brain
codex plugin add gorilla-brain@gorilla-brain-marketplace
```

También puedes instalar **Gorilla Brain** desde el directorio de plugins. Después comienza con:

```text
Configura mi segundo cerebro con Gorilla Brain.
```

La disponibilidad de marketplaces basados en repositorios depende de la superficie y de las políticas del workspace. Consulta la [documentación oficial de plugins](https://developers.openai.com/plugins/build/plugins).

## Uso recomendado

1. Crea un repositorio privado vacío para la persona o empresa.
2. Abre ese repositorio como espacio de trabajo.
3. Instala Gorilla Brain.
4. Ejecuta la configuración inicial.
5. Revisa y confirma los archivos creados antes de incorporar documentación sensible.

Los datos de clientes no deben guardarse en este repositorio público. Cada implantación utiliza su propio repositorio privado.

## Estructura

```text
.agents/plugins/marketplace.json       Catálogo instalable desde el repositorio
plugins/gorilla-brain/plugin.json      Manifiesto portable
plugins/gorilla-brain/skills/          Flujos reutilizables
plugins/gorilla-brain/templates/       Plantillas del segundo cerebro
plugins/gorilla-brain/references/      Metodología y modelo de conocimiento
plugins/gorilla-brain/site/            Interfaz web autocontenida
plugins/gorilla-brain/scripts/         Compilador Markdown → Site
demo-vault/                             Conocimiento ficticio para pruebas
scripts/validate.mjs                   Validación sin dependencias
```

## Generar el Site de un repositorio

Desde la carpeta `plugins/gorilla-brain`:

```text
node scripts/build-site.mjs --vault <ruta-al-repositorio> --out <ruta-de-salida> --title "Mi segundo cerebro"
```

El compilador lee únicamente archivos `.md`, interpreta frontmatter básico, `[[wikilinks]]`, aliases y enlaces Markdown relativos. Produce una carpeta estática con `index.html`, estilos, aplicación y `knowledge.json`. El repositorio original no se modifica.

Para ejecutar la demostración incluida:

```text
npm run build:demo
python -m http.server 4173 --directory site-dist
```

La publicación debe ser privada por defecto. La carpeta compilada es una vista: las correcciones se realizan en Markdown y después se regenera.

## Principios

- El repositorio del cliente es la fuente de verdad.
- Una conversación no equivale a conocimiento validado.
- La ausencia de información no debe producir invenciones ni entrevistas infinitas.
- Cada afirmación importante debe poder vincularse con una fuente o marcarse como pendiente.
- Leer contexto no autoriza acciones externas.
- Guardado, construido, publicado, aprobado y operativo son estados distintos.

## Validación

Requiere Node.js 20 o posterior:

```text
npm test
```

## Estado

Versión pública `0.2.0`. Incluye el generador de Site y siete skills. No incluye todavía servidor MCP ni sincronización automática con Google Drive o Microsoft 365: esas integraciones requieren configurar identidad, permisos y fuente autorizada en cada implantación.

