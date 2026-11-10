# Seguridad

## Datos que no deben publicarse

No abras incidencias ni commits que contengan:

- credenciales, tokens o claves API;
- datos personales o identificativos;
- documentación de clientes;
- información financiera, médica o laboral sensible;
- repositorios, enlaces o archivos privados sin autorización.

Los datos de cada implantación deben residir en un repositorio privado independiente.

## MCP local y rutas autorizadas

El MCP incluido se ejecuta por `stdio` en el equipo del usuario y solo expone herramientas de lectura. La raíz del repositorio se declara en cada llamada y cualquier nota solicitada debe resolverse dentro de esa raíz. No publiques el MCP como servidor remoto ni expongas carpetas sincronizadas completas sin revisar antes permisos y contenido.

Google Drive y OneDrive pueden utilizarse mediante sus carpetas sincronizadas locales, pero Gorilla Brain no concede permisos, activa OAuth ni sincroniza servicios automáticamente. La cuenta, la carpeta y las personas con acceso deben validarse para cada cliente.

## Acciones externas

Gorilla Brain trabaja en modo lectura y preparación por defecto. Enviar mensajes, publicar, modificar permisos, gastar, borrar o cambiar producción requiere autorización explícita del usuario inmediatamente antes de la acción.

## Comunicación de vulnerabilidades

Comunica los problemas de seguridad de forma privada a través de los canales de contacto publicados en [innown.es](https://innown.es). No incluyas información sensible en una incidencia pública.

