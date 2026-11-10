# Piloto de Gorilla Brain

Esta guía deja una implantación preparada para una prueba controlada con un usuario. No incorpora datos reales ni concede accesos por sí sola.

## 1. Condiciones previas

- Windows, macOS o Linux con Node.js 20 o posterior.
- ChatGPT o Codex Desktop con ejecución local de plugins.
- Un repositorio privado independiente para el usuario o cliente.
- Una carpeta local o sincronizada de Google Drive u OneDrive cuyo acceso ya haya sido autorizado.
- Copia de seguridad o historial de versiones activo antes de incorporar documentación real.

No reutilices un repositorio entre clientes. El Site generado es una vista derivada: la fuente de verdad continúa siendo el repositorio Markdown privado.

## 2. Crear la estructura

Primero revisa el plan sin escribir archivos:

```powershell
node .\plugins\gorilla-brain\scripts\init-brain.mjs --root "C:\ruta\privada\cliente" --title "Nombre del cliente"
```

Si la ruta y los archivos son correctos, aplica la creación:

```powershell
node .\plugins\gorilla-brain\scripts\init-brain.mjs --root "C:\ruta\privada\cliente" --title "Nombre del cliente" --apply
```

Se crean `PROJECT.md`, `STATE.md`, `brain.config.json` y las carpetas `knowledge`, `projects`, `processes`, `people`, `agents`, `archive` y `site`. Si detecta archivos esenciales, el comando se detiene sin sobrescribirlos.

## 3. Incorporar conocimiento

1. Copia únicamente fuentes aprobadas a la carpeta privada del cliente.
2. Registra cada fuente en `knowledge/SOURCES.md`, con ubicación, responsable, fecha y estado.
3. Resume hechos confirmados en `knowledge/CONTEXT.md` sin eliminar el enlace al original.
4. Registra acuerdos en `knowledge/DECISIONS.md`, separando decisiones vigentes de antecedentes históricos.
5. Marca como `PENDIENTE DE VALIDAR` cualquier dato no confirmado.

No importes automáticamente una unidad completa de Drive o OneDrive. Excluye credenciales, datos personales innecesarios, borradores obsoletos y contenido sin autorización.

## 4. Crear el Bibliotecario

Vista previa:

```powershell
node .\plugins\gorilla-brain\scripts\create-librarian.mjs --root "C:\ruta\privada\cliente" --scope "Nombre del cliente" --folders "knowledge/, projects/, processes/"
```

Creación:

```powershell
node .\plugins\gorilla-brain\scripts\create-librarian.mjs --root "C:\ruta\privada\cliente" --scope "Nombre del cliente" --folders "knowledge/, projects/, processes/" --apply
```

El resultado queda en `agents/BIBLIOTECARIO.md` y se registra en `agents/AGENTS.md`. Su función es consultar y citar; no modifica fuentes ni ejecuta acciones externas.

## 5. Conectar la consulta local

Al instalar el plugin, `mcp.json` registra `gorilla-brain-local` como servidor MCP por `stdio`. Expone:

- `brain_search`: busca fragmentos y devuelve rutas fuente;
- `brain_get_note`: abre una nota dentro de la raíz autorizada;
- `brain_status`: comprueba estructura y estado del repositorio.

El MCP no conoce una carpeta global ni recibe memoria de la cuenta. Cada llamada debe indicar la raíz privada del proyecto. Después de instalar o actualizar el plugin, abre un chat nuevo para que el cliente de escritorio cargue el servidor.

## 6. Generar el Site privado

```powershell
node .\plugins\gorilla-brain\scripts\build-site.mjs --vault "C:\ruta\privada\cliente" --out "C:\ruta\privada\cliente\site" --title "Nombre del cliente"
```

Comprueba el resultado localmente antes de publicarlo:

```powershell
python -m http.server 4173 --directory "C:\ruta\privada\cliente\site"
```

Abre `http://localhost:4173`. Verifica búsqueda, notas, fuentes, tablas, backlinks y mapas. La publicación y los permisos del Site son un paso separado y requieren confirmación expresa.

## 7. Prueba con el primer usuario

La sesión debe validar, como mínimo:

| Escenario | Resultado esperado |
| --- | --- |
| Pregunta con respuesta documentada | Responde y cita la nota fuente. |
| Pregunta sin evidencia | Declara la ausencia y no inventa. |
| Dos fuentes contradictorias | Muestra ambas y solicita validación. |
| Solicitud fuera de las carpetas autorizadas | Rechaza el acceso. |
| Petición de envío, publicación o cambio externo | Pide autorización antes de actuar. |
| Corrección de una nota | Se realiza en Markdown y aparece tras regenerar el Site. |
| Acceso de otro usuario | Solo ve el proyecto compartido, no otros repositorios. |

Registra incidencias y decisiones en el repositorio del piloto. No uses el resultado de una conversación como prueba suficiente: comprueba los archivos, las rutas citadas y los permisos efectivos.

## 8. Verificación técnica

Desde la raíz de Gorilla Brain:

```powershell
npm test
```

La prueba valida manifiestos, nueve skills, build del Site, enlaces, consulta trazable, inicialización del piloto, creación del Bibliotecario y protocolo MCP.

## 9. Recuperación

- Si el inicializador detecta contenido existente, no fuerces la escritura: revisa la carpeta y continúa manualmente.
- Si el MCP no aparece, reinicia el cliente de escritorio y abre un chat nuevo después de confirmar la instalación del plugin.
- Si una consulta no devuelve evidencia, revisa que el archivo sea Markdown y esté dentro de la raíz autorizada.
- Si el Site queda desactualizado, regenera la carpeta de salida; no edites `knowledge.json` directamente.
- Si se comparte información por error, revoca primero el acceso externo y restaura después desde el historial privado.
