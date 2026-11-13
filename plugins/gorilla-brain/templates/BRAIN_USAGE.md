# Cómo usar Gorilla Brain

- Ámbito: <ÁMBITO>
- Repositorio privado: `<RAÍZ_DEL_REPOSITORIO>`
- Carpetas autorizadas: `<CARPETAS_AUTORIZADAS>`
- Bibliotecario: [BIBLIOTECARIO.md](BIBLIOTECARIO.md)
- Configurado: <FECHA>

## Cómo invocarlo

Si la interfaz admite menciones de complementos:

```text
@Gorilla Brain consulta mi segundo cerebro sobre <tema> y cita las notas fuente.
```

Si no admite menciones, utiliza una petición natural en un espacio que tenga acceso a este repositorio:

```text
Usa mi Gorilla Brain para responder <pregunta>. Consulta primero las fuentes y señala ausencias o contradicciones.
```

Peticiones habituales:

- «¿Qué decidimos sobre <proyecto> y en qué fuente consta?»
- «Relaciona estas notas sin duplicar información.»
- «Incorpora este documento y conserva su procedencia.»
- «¿Qué información está desactualizada o se contradice?»
- «Ejecuta el mantenimiento diario de las fuentes autorizadas.»

## Qué ocurre al invocarlo

1. Localiza el ámbito mínimo necesario.
2. Consulta notas y conexiones autorizadas.
3. Abre las fuentes relevantes antes de afirmar.
4. Distingue hechos, información reportada, decisiones, propuestas y pendientes.
5. Responde con rutas de notas y reconoce cuando no hay evidencia.
6. No ejecuta acciones externas por disponer de contexto.

## Siguientes pasos

1. Probar una pregunta con evidencia y otra sin evidencia.
2. Probar una contradicción y una petición fuera de alcance.
3. Registrar el Bibliotecario como `Probado` si supera las pruebas.
4. Conectar únicamente las fuentes autorizadas.
5. Configurar el mantenimiento diario si existe un programador real.
6. Revisar periódicamente fuentes, permisos, contradicciones y vigencia.

Crear estos archivos no demuestra que el host pueda ejecutar un subagente independiente. Cuando no sea posible, Gorilla Brain aplica el flujo del Bibliotecario en la conversación actual.
