---
name: gorilla-brain-setup
description: Usa este flujo cuando una persona quiera crear, configurar, instalar o comenzar su segundo cerebro con Gorilla Brain en un repositorio nuevo o existente.
---

# Configuración inicial de Gorilla Brain

Convierte la realidad del usuario en un repositorio operativo. El usuario describe su trabajo; tú decides la arquitectura.

## Capacidad y rutas: comprobar antes de intentar ejecutar

1. Comprueba si esta conversación dispone de lectura/escritura de archivos y ejecución de procesos. El MCP local es solo lectura: no basta para construir el cerebro. Si no hay ejecución, no repitas comandos fallidos ni declares instalado el sistema. Explica el bloqueo y el paso mínimo para abrir un espacio con ejecución local; continúa organizando la información disponible en la conversación sin fingir persistencia.
2. Resuelve la carpeta real del plugin a partir de la ruta de este SKILL.md facilitada por el host. Su raíz es dos niveles por encima de la carpeta `skills/setup`. En un checkout es `<checkout>/plugins/gorilla-brain`. No presupongas que el directorio de trabajo es la carpeta de la skill. Verifica que allí existen `plugin.json` y `scripts/doctor.mjs`.
3. Ejecuta `node "<raíz-absoluta-del-plugin>/scripts/doctor.mjs"`. Las rutas entre `<...>` son marcadores: sustitúyelas por rutas comprobadas, nunca las ejecutes literalmente. En Windows usa comillas dobles y rutas locales, sin exigir Bash. Doctor exige Node.js 20 o posterior. Si no existe Node o el proceso está denegado, explica el error exacto sin instalar software o eludir permisos.
4. Usa siempre rutas absolutas entre comillas para los scripts y el repositorio privado. No guardes información personal en el checkout público del plugin.
5. Consulta `../../references/capabilities.md` y registra qué fuentes y herramientas están realmente disponibles.

## Antes de preguntar

1. Inspecciona el repositorio actual sin modificarlo.
2. Si ya existe `STATE.md`, no reinicies: carga el estado y deriva al orquestador.
3. Si hay documentos, identifica formatos y ubicaciones, pero no interpretes nombres de archivo como hechos.
4. No leas ni publiques secretos. No muevas, borres o sobrescribas contenido existente.

Si el repositorio está vacío, ejecuta primero `node "<raíz-absoluta-del-plugin>/scripts/init-brain.mjs" --root "<ruta-privada>" --title "<nombre>"` para mostrar la vista previa. Ejecuta de nuevo con `--apply` solo después de comprobar la ruta. El inicializador se detiene si encuentra archivos esenciales existentes.

## Única entrevista inicial

Aprovecha primero respuestas y contexto ya disponibles. Formula juntas solo las preguntas esenciales aún sin respuesta y espera una respuesta conjunta; no repitas información conocida:

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

Cuando el usuario necesite consultar el repositorio desde el agente principal, ejecuta `node "<raíz-absoluta-del-plugin>/scripts/create-librarian.mjs" --root "<ruta-privada>" --scope "<ámbito>" --folders "<carpetas>"` como vista previa y después con `--apply`. No amplíes las carpetas autorizadas por conveniencia.

No copies ejemplos como si fueran datos del usuario. Conserva siempre la procedencia y separa:

- hechos confirmados;
- información reportada;
- decisiones recomendadas;
- hipótesis;
- pendientes.

## Continuar hasta un segundo cerebro usable

La inicialización solo crea plantillas. **No termines al completar discover ni esperes otra petición para construir la vista.** Tras la respuesta del usuario, ejecuta sucesivamente los flujos de orquestación, captura, Site y consulta dentro de la misma tarea autorizada:

1. Rellena PROJECT.md con objetivo, ámbitos personales/profesionales autorizados, fuentes accesibles, exclusiones y permiso de mantenimiento. Crea una tabla de cobertura: ámbito / fuente / acceso real / incorporado / pendiente. «Global» significa organizar el alcance autorizado, no leer toda la cuenta por defecto.
2. Incorpora la información ya aportada a notas útiles, cada una con fuente y fecha. Registra fuentes y decisiones; no entregues ejemplos ficticios como si fueran hechos del usuario. Si aún no hay contenido, solicita el primer conjunto esencial, no declares operativo un cascarón.
3. Crea un HOME.md con enlaces a los ámbitos poblados. Registra ámbitos sin datos como pendientes, sin inventarlos. Crea Bibliotecario si procede, sin afirmar que existe un subagente real cuando solo has creado su especificación.
4. Genera la vista con `node "<raíz-absoluta-del-plugin>/scripts/build-site.mjs" --vault "<ruta-privada>" --out "<ruta-privada>/site" --title "<nombre>"`. Revisa notas, enlaces y ausencia de datos no autorizados. Si la salida anterior no es reconocida, usa una carpeta nueva: no fuerces borrados.
5. Abre la vista mediante servidor exclusivamente local, por ejemplo `python -m http.server 4173 --bind 127.0.0.1 --directory "<ruta-privada>/site"` si Python está disponible. Si no existe, usa el servidor local autorizado del entorno. Comprueba visualmente búsqueda, nota, fuente, enlaces y mapas. Si no puedes abrirla, marca esa prueba pendiente; no confundas build con prueba visual o publicación.
6. Ejecuta `node "<raíz-absoluta-del-plugin>/scripts/query-brain.mjs" --vault "<ruta-privada>" --query "<pregunta-con-evidencia>"`; verifica la nota citada y luego prueba una pregunta sin evidencia. Una coincidencia de palabras no demuestra la respuesta: lee la nota antes de afirmar.
7. Añade una corrección autorizada conservando el antecedente, regenera y verifica que se ve. Registra pasos repetibles y pruebas en STATE.md. No añadas una corrección inventada a datos reales para probar: usa un espacio ficticio separado.
8. Define cómo se mantendrá: captura durante sesiones autorizadas y revisión de fuentes. No prometas actualización diaria ni en todos los chats sin una automatización realmente creada y acceso verificado.

Continúa sin pedir «¿sigo?» entre fases. Solo detente por dato imprescindible, permiso pendiente, fallo no resoluble de forma segura o límite del entorno. Guarda estado, evidencia del bloqueo y siguiente acción para reanudar sin reinicializar. «No parar» nunca autoriza bucles infinitos, saltar permisos, publicar o inventar información.

Entrega una ruta o enlace utilizable, cobertura real, prueba de consulta, mecanismo de actualización y pendientes. Distingue guardado, construido, probado, publicado y aceptado por el usuario.
