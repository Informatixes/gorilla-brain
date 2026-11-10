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
- Presenta cada nota con pestaña, ruta, propiedades, icono semántico y tablas Markdown.
- Permite consultar el conocimiento desde el Site y abrir directamente cada evidencia.
- Puede crear un especialista Bibliotecario para que el agente principal le delegue consultas con fuentes.
- Incluye un MCP local de solo lectura para buscar, abrir notas y consultar el estado sin publicar el repositorio.
- Inicializa un piloto repetible y crea el Bibliotecario mediante comandos con vista previa y protección contra sobrescrituras.

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

La implantación completa está descrita en [PILOT.md](PILOT.md), incluida la separación por cliente, la carga de fuentes, los permisos y la prueba de aceptación.

Los datos de clientes no deben guardarse en este repositorio público. Cada implantación utiliza su propio repositorio privado.

## Estructura

```text
.agents/plugins/marketplace.json       Catálogo instalable desde el repositorio
plugins/gorilla-brain/plugin.json      Manifiesto portable
plugins/gorilla-brain/skills/          Flujos reutilizables
plugins/gorilla-brain/templates/       Plantillas del segundo cerebro y notas
plugins/gorilla-brain/references/      Metodología y modelo de conocimiento
plugins/gorilla-brain/site/            Interfaz web autocontenida
plugins/gorilla-brain/scripts/         Compilador Markdown → Site
plugins/gorilla-brain/server/          MCP local de consulta en solo lectura
demo-vault/                             Conocimiento ficticio para pruebas
scripts/validate.mjs                   Validación sin dependencias
```

## Inicializar un cliente

La vista previa no escribe nada:

```text
node plugins/gorilla-brain/scripts/init-brain.mjs --root <ruta-privada> --title "<cliente>"
```

Tras revisar la salida, crea la estructura y el Bibliotecario:

```text
node plugins/gorilla-brain/scripts/init-brain.mjs --root <ruta-privada> --title "<cliente>" --apply
node plugins/gorilla-brain/scripts/create-librarian.mjs --root <ruta-privada> --scope "<cliente>" --folders "knowledge/, projects/, processes/" --apply
```

Ambos comandos rechazan sobrescribir una implantación existente.

## Generar el Site de un repositorio

Desde la carpeta `plugins/gorilla-brain`:

```text
node scripts/build-site.mjs --vault <ruta-al-repositorio> --out <ruta-de-salida> --title "Mi segundo cerebro"
```

El compilador lee únicamente archivos `.md`, interpreta frontmatter básico, `[[wikilinks]]`, aliases y enlaces Markdown relativos. Produce una carpeta estática con `index.html`, estilos, aplicación y `knowledge.json`. El repositorio original no se modifica.

## Consultar el cerebro desde un agente

El recuperador local ofrece resultados trazables sin enviar el repositorio a un servicio externo:

```text
node scripts/query-brain.mjs --vault <ruta-al-repositorio> --query "<pregunta>" --limit 8 --format markdown
```

La skill `librarian-agent-factory` puede crear `agents/BIBLIOTECARIO.md` en el repositorio del usuario. Cuando el entorno soporta subagentes, Gorilla Brain delega la recuperación; en otros entornos aplica el mismo flujo en la conversación actual y lo indica expresamente.

El plugin registra además un servidor MCP local `gorilla-brain-local` con tres herramientas de solo lectura: `brain_search`, `brain_get_note` y `brain_status`. El cliente pasa la ruta privada en cada llamada; el servidor valida que las notas permanezcan dentro de esa raíz. No sincroniza ni sube archivos a un servicio remoto.

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

Versión pública `0.5.0`. Incluye el generador de Site, consulta verificable, experiencia visual de notas, nueve skills, inicializador protegido y MCP local de solo lectura. No incluye sincronización automática con Google Drive o Microsoft 365: esas integraciones requieren configurar identidad, permisos y fuente autorizada en cada implantación.

