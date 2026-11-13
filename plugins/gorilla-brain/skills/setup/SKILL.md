---
name: gorilla-brain-setup
description: Usa este flujo cuando una persona quiera crear, configurar, instalar o comenzar su segundo cerebro con Gorilla Brain en un repositorio nuevo o existente.
---

# Configuración inicial de Gorilla Brain

Convierte la realidad del usuario en un repositorio operativo. El usuario describe su trabajo; tú decides la arquitectura.

## Primera respuesta obligatoria

Antes de ejecutar comandos, pedir datos o crear archivos, explica en lenguaje claro y en este orden:

1. **Qué es:** un segundo cerebro privado basado en archivos Markdown enlazados, consultable por personas y agentes, con una vista visual tipo Obsidian.
2. **Qué encontrará:** notas, fuentes, decisiones, proyectos, personas, procesos, enlaces, backlinks, búsqueda, grafo y un registro del estado del sistema.
3. **Qué podrá hacer:** consultar información conectada entre sí, localizar la evidencia de una respuesta, detectar contradicciones, recuperar decisiones y mantener contexto entre sesiones autorizadas.
4. **Cómo se usa:** mediante preguntas naturales o, si la interfaz admite menciones, con `@Gorilla Brain`. Incluye ejemplos de consulta, captura, relación, auditoría y mantenimiento: «¿qué decidimos sobre este proyecto?», «relaciona estas notas», «incorpora esta fuente sin duplicarla», «¿qué está desactualizado?» y «actualiza el cerebro con las fuentes autorizadas».
5. **Qué se va a hacer:** comprobar capacidades, elegir una carpeta privada, crear o continuar la estructura, incorporar las primeras fuentes, generar el Site, crear el Bibliotecario, probar su invocación, analizar el repositorio para proponer agentes o complementos útiles y definir el mantenimiento.
6. **Qué no ocurre por instalarlo:** no obtiene automáticamente el historial completo de ChatGPT, el correo, Drive o Microsoft 365; cada fuente requiere acceso, alcance y autorización verificables. La actualización diaria solo se considera activa cuando exista una automatización creada y probada.

Termina esta explicación con dos bloques visibles:

- **Cómo lo usarás después:** indica la mención disponible, si existe, y ofrece al menos un ejemplo para consultar, incorporar conocimiento, comprobar vigencia y ejecutar el mantenimiento diario.
- **Siguientes pasos:** carpeta privada y primer ámbito; primeras fuentes; notas y conexiones; Site; creación y prueba del Bibliotecario; análisis de oportunidades; aprobación de agentes o complementos concretos; mantenimiento diario opcional.

Adapta la extensión al contexto, pero no omitas estos puntos ni los sustituyas por una lista de comandos. Después continúa con las comprobaciones y la única entrevista inicial.

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

Al finalizar una implantación nueva, crea siempre el Bibliotecario vinculado al repositorio, salvo rechazo expreso del usuario o bloqueo técnico documentado. Ejecuta `node "<raíz-absoluta-del-plugin>/scripts/create-librarian.mjs" --root "<ruta-privada>" --scope "<ámbito>" --folders "<carpetas>"` como vista previa y después con `--apply`. El script también genera `agents/COMO-USAR-GORILLA-BRAIN.md`. No amplíes las carpetas autorizadas por conveniencia. Crear los archivos deja el agente en estado `Diseñado`: prueba consulta normal, ausencia, contradicción, fuera de alcance y acción sensible; regístralo como `Probado` solo tras superar las pruebas. `Operativo` requiere además una invocación real y aceptación del responsable.

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
3. Crea un HOME.md con enlaces a los ámbitos poblados. Registra ámbitos sin datos como pendientes, sin inventarlos. Crea el Bibliotecario y su guía de uso. Si el host admite subagentes, prueba una invocación delegada; si no, prueba el mismo flujo mediante `brain-librarian` y deja visible esa diferencia.
4. Genera la vista con `node "<raíz-absoluta-del-plugin>/scripts/build-site.mjs" --vault "<ruta-privada>" --out "<ruta-privada>/site" --title "<nombre>"`. Revisa notas, enlaces y ausencia de datos no autorizados. Si la salida anterior no es reconocida, usa una carpeta nueva: no fuerces borrados.
5. Abre la vista mediante servidor exclusivamente local, por ejemplo `python -m http.server 4173 --bind 127.0.0.1 --directory "<ruta-privada>/site"` si Python está disponible. Si no existe, usa el servidor local autorizado del entorno. Comprueba visualmente búsqueda, nota, fuente, enlaces y mapas. Si no puedes abrirla, marca esa prueba pendiente; no confundas build con prueba visual o publicación.
6. Ejecuta `node "<raíz-absoluta-del-plugin>/scripts/query-brain.mjs" --vault "<ruta-privada>" --query "<pregunta-con-evidencia>"`; verifica la nota citada y luego prueba una pregunta sin evidencia. Una coincidencia de palabras no demuestra la respuesta: lee la nota antes de afirmar.
7. Añade una corrección autorizada conservando el antecedente, regenera y verifica que se ve. Registra pasos repetibles y pruebas en STATE.md. No añadas una corrección inventada a datos reales para probar: usa un espacio ficticio separado.
8. Abre `agents/COMO-USAR-GORILLA-BRAIN.md` con el usuario y confirma el método real de invocación de esa superficie. Ejecuta una consulta desde ese método y registra el resultado; no confundas un archivo de agente con un subagente disponible.
9. Ejecuta `agent-designer` en modo descubrimiento sobre todo el alcance autorizado. Rellena `agents/OPPORTUNITIES.md`, presenta entre tres y cinco recomendaciones priorizadas y explica cómo se invocaría cada una. No las implementes ni actives sin aprobación del usuario.
10. Define cómo se mantendrá: captura durante sesiones autorizadas y revisión de fuentes. Rellena `knowledge/MAINTENANCE.md`. Si el usuario pide actualización diaria, aplica `daily-brain-maintenance`: verifica fuentes, alcance, permisos y programador disponible; crea la automatización solo con esos datos comprobados y registra su identificador, horario y última prueba. No la declares activa hasta observar una ejecución completa.

Continúa sin pedir «¿sigo?» entre fases. Solo detente por dato imprescindible, permiso pendiente, fallo no resoluble de forma segura o límite del entorno. Guarda estado, evidencia del bloqueo y siguiente acción para reanudar sin reinicializar. «No parar» nunca autoriza bucles infinitos, saltar permisos, publicar o inventar información.

Entrega una ruta o enlace utilizable, cobertura real, prueba de consulta, mecanismo de actualización y pendientes. Distingue guardado, construido, probado, publicado y aceptado por el usuario.
