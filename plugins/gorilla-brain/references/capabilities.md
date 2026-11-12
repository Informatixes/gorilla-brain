# Capacidades y límites verificables

El plugin aporta instrucciones, plantillas, scripts y un MCP local de solo lectura. No es un servicio que actúe permanentemente ni una copia de la memoria global de ChatGPT.

| Fuente o función | Qué se puede afirmar |
| --- | --- |
| Conversación actual | Solo el contexto realmente proporcionado al agente; no historial íntegro implícito. |
| Otras conversaciones o memoria | Solo si el host ofrece herramientas autorizadas que permiten leerlas; comprobar resultados, no presumir acceso por instalar el plugin. |
| Archivos locales | Solo rutas disponibles y autorizadas en el entorno. |
| Gmail, Drive, Microsoft 365 | Requieren conexión, permisos y selección de alcance. No los instala ni sincroniza este plugin. |
| Captura y edición | Requieren herramientas de escritura del agente; el MCP incluido únicamente consulta. |
| ChatGPT web sin ejecución local | No puede ejecutar este paquete local por sí solo. Puede trabajar con texto aportado, pero no debe declarar creada una implantación en disco. |
| Otro chat | Necesita acceso al mismo espacio y cargar su contexto; AGENTS.md no garantiza memoria global. |
| Site | Build local incluido; hosting y visibilidad son pasos distintos que requieren autorización. |
| Actualización continua | Durante sesiones autorizadas sí; periodicidad solo si el host permite crear una tarea, el usuario la pide y se verifica el acceso de esa tarea. |

Una prueba automatizada de scripts no demuestra que una versión concreta de ChatGPT/Codex cargue el plugin ni complete por sí misma la entrevista y la captura. Registrar estas pruebas por separado. No prometer ausencia total de intervención: datos, permisos y decisiones imprescindibles pertenecen al usuario.
