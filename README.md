# Estudia a tu ritmo

Aplicación para organizar una sesión de estudio en bloques completos de 25 minutos, con descansos de 5 minutos entre bloques. Revisión para Proyecto 1 de CMP1001 a partir de los comentarios del docente.

## Abrir la aplicación

1. Guarda `index.html`, `styles.css` y `app.js` en la misma carpeta.
2. Abre `index.html` con Chrome, Edge o Firefox.
3. Elige una materia, escribe los minutos disponibles y selecciona la hora de inicio. Pulsa **Crear mi plan**.
4. Usa **Limpiar** para volver al formulario inicial.

No necesita instalación, conexión, servidor ni compilación. No guarda sesiones.

## Decisión de funcionamiento

La aplicación cuenta sólo bloques completos. El primer bloque cuesta 25 minutos. Cada bloque adicional cuesta 30: 5 de descanso y 25 de estudio. No agrega un descanso al terminar y deja libre el tiempo sobrante.

Por ejemplo, 60 minutos permiten `25 + 5 + 25 = 55` minutos de sesión. Quedan 5 libres. Con 25 minutos hay un bloque y ningún descanso.

La materia cambia el nombre mostrado; no modifica la duración de los bloques.

## Mejora solicitada por el docente

Ahora se muestra **Terminas a las**, junto con la hora final del plan. Se propone la hora local del dispositivo como inicio; se puede cambiar. La hora final suma estudio y pausas. No suma los minutos libres y no añade un descanso final.

Con inicio a las 16:00 y 60 minutos disponibles, el plan ocupa 55 minutos y termina a las **16:55**, con 5 minutos libres. Si empieza a las 23:30, termina a las **00:25 del día siguiente**. Las horas se muestran en formato de 24 horas.

Al cambiar la hora de inicio se oculta el resultado anterior hasta volver a calcular. **Limpiar** propone de nuevo la hora actual del dispositivo. La aplicación es una guía: no inicia un cronómetro ni envía alarmas.

## Archivos

| Archivo | Función |
| --- | --- |
| `index.html` | Formulario y elementos donde se muestra el resultado. |
| `styles.css` | Colores, tamaños y distribución adaptable a la pantalla. |
| `app.js` | Validación, cálculo y actualización de los elementos. |

## Pruebas de lógica realizadas

Se ejecutó el JavaScript en Node.js con elementos y eventos simulados. Estas pruebas no sustituyen la comprobación de la interfaz en un navegador. No se ha verificado visualmente la aplicación ni su reapertura en un navegador.

| Entrada | Resultado verificado en la simulación |
| --- | --- |
| 60 min | 2 bloques, 50 de estudio, 5 de descanso y 5 libres. |
| 20 min | Aviso de mínimo 25; resultado oculto. |
| 25 min | 1 bloque, 25 de estudio, 0 de descanso y 0 libres. |
| 55 min | 2 bloques, 50 de estudio, 5 de descanso y 0 libres. |
| Repetir 60 | Mantiene 50/5/5 después de los casos anteriores. |
| Vacío | Pide introducir los minutos. |
| 25.5 min | Pide un número entero. |
| 241 min | Advierte que el máximo es 240. |
| 240 min | 8 bloques, 200 de estudio, 35 de descanso y 5 libres. |
| Recargar app.js desde disco | Vuelve a producir 50/5/5 para 60 minutos. |

También se comprobó el cálculo para cada número entero de 25 a 240: usa el máximo de bloques completos que caben, no supera el tiempo disponible y cuenta descansos sólo entre bloques.

Pruebas adicionales de la revisión, también con elementos y eventos simulados:

| Inicio y minutos disponibles | Resultado verificado |
| --- | --- |
| 16:00; 60 min | 16:55 del mismo día; 5 minutos libres. |
| 23:30; 60 min | 00:25 del día siguiente. |
| 23:35; 25 min | 00:00 del día siguiente. |
| 00:00; 25 min | 00:25 del mismo día. |
| 22:00; 240 min | 01:55 del día siguiente; 5 minutos libres. |
| Hora vacía o inválida | Pide una hora de inicio válida. |
| Cambiar de 16:00 a 17:00; 60 min | Oculta el plan anterior; al recalcular muestra 17:55. |

## Qué revisar en el navegador

Antes de cada acción, escribe en la tarjeta qué esperas. Luego ejecuta la acción y anota lo que realmente ves:

1. Programación, 60 minutos e inicio a las 16:00: crear el plan, revisar los tres totales y comprobar que termina a las 16:55.
2. Cambiar a 20 minutos: comprobar el aviso y que desaparezca el resultado anterior.
3. Probar 25 y 55 minutos; volver a 60 para comprobar que sigue funcionando. Con inicio a las 23:30 y 60 minutos, comprobar que indica 00:25 del día siguiente.
4. Pulsar Limpiar. Crear otro plan, actualizar la página y comprobar que se reinicia.
5. Cerrar la pestaña, volver a abrir `index.html` y repetir 60 minutos.
6. Tomar una captura que muestre los datos y el resultado.

## Cómo explicar una acción

Al pulsar **Crear mi plan**, el evento `submit` ejecuta el código del formulario. `preventDefault()` evita la recarga. Se comprueba que los minutos sean un entero de 25 a 240 y que la hora sea válida. `calculatePlan` cuenta los bloques completos. `parseStartTime` convierte la hora a minutos desde medianoche. `calculateFinishTime` suma la duración del plan y determina si termina al día siguiente. `showPlan` escribe los resultados.

`textContent` cambia el texto de un elemento. `hidden` muestra u oculta una parte de la página. `addEventListener` conecta una acción del usuario con una función.

## Herramientas y ayuda

HTML, CSS y JavaScript sin frameworks, API externas, base de datos ni backend. Se utilizó ChatGPT para generar el código y comprobar su lógica con Node.js. El estudiante debe revisar el código y repetir las acciones en su navegador antes de entregar.

## Historial de entrega

El avance inicial se publicó el 7 de octubre de 2026 como corrección posterior: [ver commit del avance original](https://github.com/davidalejogarcia18082005-svg/Estudia-a-tu-ritmo/commit/d11bfbb1be1fbb5eafc6c3e67c35d6d9f477ff8a). No se había entregado un enlace a un commit en Laboratorio 3.

La versión actual incorpora la hora de inicio y finalización solicitada por el docente. Las pruebas registradas arriba se realizaron con elementos y eventos simulados; la captura de una prueba real en navegador sigue pendiente.

## Publicación en GitHub Pages

Los archivos de la aplicación están en la raíz del repositorio. Para publicar, abre **Settings > Pages**, elige **Deploy from a branch**, selecciona **main** y **/(root)** y pulsa **Save**. La publicación y su enlace deben verificarse antes de añadirlos a la tarjeta.
