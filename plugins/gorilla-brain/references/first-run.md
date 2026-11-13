# Primer uso de Gorilla Brain

Esta guía empieza en la pantalla de Complementos y termina cuando existe un segundo cerebro privado, poblado, consultable y probado. Instalar el código, crear carpetas, generar un Site o iniciar un servidor son estados distintos.

## 1. Lo que necesitas

- ChatGPT Desktop en un modo compatible con proyectos locales o Codex.
- Lectura y escritura de archivos y ejecución local.
- Node.js 20 o posterior.
- Una carpeta privada separada para el conocimiento del usuario.
- Permiso explícito para cada fuente que se quiera leer.

Gorilla Brain todavía no está en el directorio público universal. Buscar «Gorilla Brain» en el catálogo público no lo encontrará. Pegar la URL de GitHub en un chat puede permitir descargar o inspeccionar el repositorio, pero no demuestra que el complemento haya quedado instalado.

## 2. Instalar desde GitHub

### Con Codex CLI disponible

Ejecuta:

```text
codex plugin marketplace add Informatixes/gorilla-brain --ref main
codex plugin marketplace list
```

Después:

1. reinicia ChatGPT Desktop;
2. abre **Complementos**;
3. selecciona la fuente **Gorilla Brain by Innown**;
4. instala **Gorilla Brain**;
5. abre un chat nuevo.

La instalación del marketplace y la instalación del complemento son pasos distintos. No declares instalado Gorilla Brain solo porque el repositorio se haya descargado o `npm test` haya terminado correctamente.

### Sin el comando `codex`

1. Descarga o clona `https://github.com/Informatixes/gorilla-brain`.
2. Abre la carpeta del repositorio como proyecto local en ChatGPT Desktop/Codex.
3. Reinicia completamente la aplicación.
4. Abre **Complementos** y pulsa actualizar.
5. Selecciona el marketplace **Gorilla Brain by Innown** e instala el complemento.

Si la pantalla solo muestra complementos públicos, el repositorio no está abierto como proyecto, la aplicación no se ha reiniciado o esa cuenta/workspace no admite marketplaces locales. No pulses el `+` de otro producto.

## 3. Separar código y conocimiento

La carpeta descargada `gorilla-brain` o `gorilla-brain-main` contiene el complemento público. Nunca guardes allí información personal, de clientes o de empresa.

El segundo cerebro debe vivir en otra carpeta privada, por ejemplo:

```text
C:\Users\<usuario>\Documents\Gorilla-Brain-Privado
```

Una carpeta de OneDrive empresarial puede ser válida para conocimiento corporativo, pero sus administradores pueden conservar acceso. Para un cerebro exclusivamente personal, utiliza un espacio personal adecuado. Verifica permisos antes de incorporar información sensible.

## 4. Primera petición

En un chat nuevo escribe:

```text
Configura mi segundo cerebro con Gorilla Brain.
```

Gorilla Brain debe explicar antes de escribir:

- qué es y qué creará;
- qué podrá consultarse;
- cómo se invocará;
- qué pasos realizará;
- qué fuentes no obtiene automáticamente;
- qué decisiones o permisos necesita.

Si empieza ejecutando comandos sin esta explicación, pide que aplique la skill `gorilla-brain-setup`.

## 5. Responder a la única entrevista

Responde en un solo mensaje:

- qué quieres organizar primero;
- qué pregunta o tarea real quieres resolver;
- qué fuentes existen y dónde están;
- quién necesita acceso;
- qué debe mantenerse separado o protegido.

Mencionar una fuente no la conecta. Correo, calendario, OneDrive, Drive y otros chats deben figurar como `pending` hasta que el entorno demuestre acceso y se autorice el alcance.

## 6. Incorporar conocimiento antes de presentar el Site

La estructura inicial contiene notas administrativas: proyecto, estado, fuentes, decisiones, mantenimiento y agentes. Eso no constituye todavía un segundo cerebro útil.

Antes de presentar o publicar el Site debe existir:

- al menos una nota sustantiva del ámbito real, no solo archivos del sistema;
- una fuente identificada;
- una pregunta real que pueda responderse citando esa fuente;
- cobertura y ausencias visibles.

Si solo existen notas administrativas, marca el estado `empty_scaffold` o equivalente, continúa la captura y no presentes el grafo como conocimiento poblado.

Para empezar por una carpeta documental:

```text
Haz primero un inventario de la carpeta autorizada. Propón qué incorporar, excluir o tratar como duplicado. No copies todo ni leas fuera del alcance. Tras mi confirmación, incorpora los documentos seleccionados con fuente, fecha y ámbito.
```

Para ampliar con conversaciones de ChatGPT:

```text
Comprueba si realmente puedes listar y leer otros chats. Si puedes, inventaría los chats accesibles y procésalos por lotes conservando título, fecha, identificador y evidencia. Si no puedes, no afirmes que los has revisado: explícame cómo exportarlos o aportarlos.
```

## 7. Entender los estados del Site

- **Construido:** existen `site/index.html` y `site/knowledge.json`.
- **Servidor iniciado:** existe una URL local `127.0.0.1` mientras el proceso siga activo.
- **Probado visualmente:** se han abierto búsqueda, nota, fuente, backlinks y mapas.
- **Publicado:** existe en un alojamiento autorizado.
- **Sincronizado:** la versión publicada contiene la misma revisión que las notas fuente.

Una URL local no es una publicación. Un Site privado creado en otra plataforma no está sincronizado hasta copiar y verificar la revisión correcta. No publiques un Site con contenido sensible sin autorización explícita.

## 8. Bibliotecario y consultas

Al cerrar la implantación deben existir:

- `agents/BIBLIOTECARIO.md`;
- `agents/COMO-USAR-GORILLA-BRAIN.md`;
- una consulta con evidencia;
- una consulta sin evidencia;
- pruebas de contradicción, fuera de alcance y acción sensible.

Crear el archivo deja el Bibliotecario como `Diseñado`. Pasa a `Probado` tras superar las pruebas y a `Operativo` después de una invocación real aceptada.

## 9. Cobertura final obligatoria

La entrega debe separar:

| Estado | Qué informar |
| --- | --- |
| Fuentes previstas | Las mencionadas por el usuario |
| Fuentes conectadas | Acceso real comprobado |
| Contenido incorporado | Notas creadas con evidencia |
| Contenido pendiente | Fuentes o lotes aún no procesados |
| Site | Construido, servido, probado o publicado |
| Bibliotecario | Diseñado, probado u operativo |
| Mantenimiento | No configurado, pendiente, probado o activo |

No cierres la configuración con frases como «todo conectado» o «Site listo» si la evidencia solo demuestra una parte.

## 10. Problemas frecuentes

| Situación | Significado | Acción |
| --- | --- | --- |
| No aparece al buscar «Gorilla» | Se está consultando el directorio público | Añadir/abrir el marketplace de GitHub |
| El comando `codex` no existe | Esa terminal o sesión no tiene Codex CLI | Usar proyecto local o instalar Codex por la vía oficial |
| El repositorio se descargó | Código disponible, no complemento instalado | Reiniciar, abrir Complementos e instalar desde su fuente |
| Se creó `STATE.md` | Progreso guardado, no cerebro terminado | Continuar captura, Site y pruebas |
| El grafo tiene pocas notas | Solo existe el armazón administrativo | Incorporar fuentes reales antes de publicar |
| La URL local no abre | El servidor terminó o el puerto falló | Verificar archivos, reiniciar servidor y abrir la URL exacta |
| «Todos mis chats» | Puede no existir acceso a su contenido | Inventariar acceso real o usar una exportación |
| Fuente mencionada | No equivale a fuente conectada | Verificar conector, permisos y lectura |

## 11. Siguientes pasos

1. Incorporar una primera fuente real.
2. Comprobar una respuesta con evidencia.
3. Ampliar por lotes sin mezclar ámbitos.
4. Analizar oportunidades de agentes solo cuando exista contenido suficiente.
5. Configurar mantenimiento diario únicamente con fuentes y automatización verificadas.
