# Estudia a tu ritmo

Aplicación para organizar una sesión de estudio en bloques completos de 25 minutos, con descansos de 5 minutos entre bloques. Avance de Laboratorio 3 de CMP1001.

## Abrir la aplicación

1. Guarda `index.html`, `styles.css` y `app.js` en la misma carpeta.
2. Abre `index.html` con Chrome, Edge o Firefox.
3. Elige una materia, escribe los minutos disponibles y pulsa **Crear mi plan**.
4. Usa **Limpiar** para volver al formulario inicial.

No necesita instalación, conexión, servidor ni compilación. No guarda sesiones.

## Decisión de funcionamiento

La aplicación cuenta sólo bloques completos. El primer bloque cuesta 25 minutos. Cada bloque adicional cuesta 30: 5 de descanso y 25 de estudio. No agrega un descanso al terminar y deja libre el tiempo sobrante.

Por ejemplo, 60 minutos permiten `25 + 5 + 25 = 55` minutos de sesión. Quedan 5 libres. Con 25 minutos hay un bloque y ningún descanso.

La materia cambia el nombre mostrado; no modifica la duración de los bloques.

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

## Qué revisar en el navegador

Antes de cada acción, escribe en la tarjeta qué esperas. Luego ejecuta la acción y anota lo que realmente ves:

1. Programación, 60 minutos: crear el plan y revisar los tres totales.
2. Cambiar a 20 minutos: comprobar el aviso y que desaparezca el resultado anterior.
3. Probar 25 y 55 minutos; volver a 60 para comprobar que sigue funcionando.
4. Pulsar Limpiar. Crear otro plan, actualizar la página y comprobar que se reinicia.
5. Cerrar la pestaña, volver a abrir `index.html` y repetir 60 minutos.
6. Tomar una captura que muestre los datos y el resultado.

## Cómo explicar una acción

Al pulsar **Crear mi plan**, el evento `submit` ejecuta el código del formulario. `preventDefault()` evita la recarga. Se convierte el valor a número y se comprueba que sea un entero de 25 a 240. `calculatePlan` usa un bucle para contar los bloques que caben. `showPlan` escribe los totales y crea la lista de estudio y descansos.

`textContent` cambia el texto de un elemento. `hidden` muestra u oculta una parte de la página. `addEventListener` conecta una acción del usuario con una función.

## Herramientas y ayuda

HTML, CSS y JavaScript sin frameworks, API externas, base de datos ni backend. Se utilizó ChatGPT para generar el código y comprobar su lógica con Node.js. El estudiante debe revisar el código y repetir las acciones en su navegador antes de entregar.
