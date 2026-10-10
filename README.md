#CAUGHT!

## Descripción del proyecto

CAUGHT! es un videojuego de investigación y misterio con fines educativos. El jugador explora un teléfono simulado y analiza pistas, conversaciones, fotografías, mensajes y horarios para descubrir qué está ocurriendo.

Durante la investigación debe relacionar las evidencias, encontrar posibles contradicciones entre los personajes y utilizar su razonamiento para llegar a una conclusión.

La propuesta combina investigación, misterio, deducción y exploración. Su desarrollo permite aplicar conocimientos de programación web, diseño de interfaces, organización de archivos, control de versiones y trabajo colaborativo.

Los casos, personajes y situaciones del juego son ficticios. Las aplicaciones del teléfono forman parte de la simulación del videojuego.

El caso implementado es **El ticket de las 23:15**. El jugador dispone de cinco minutos para encontrar cinco pistas y resolver el misterio de una cena cancelada.

## Integrantes y roles

- Lautaro: analista de negocio y programador.
- Kimberly: Project Manager y diseño.
- Morena: marketing y diseño.
- Malena: análisis funcional y diseño.
- Ayrton: programador y analista de negocio.

## Tecnologías y herramientas

- HTML5: estructura de las pantallas.
- CSS3: diseño visual de la interfaz.
- JavaScript: lógica e interacción del videojuego.
- Visual Studio Code: edición del proyecto.
- Live Server: ejecución local en el navegador.
- Git y Git Bash: control de versiones.
- GitHub: repositorio y trabajo colaborativo.
- Codex y Claude: asistencia durante el desarrollo.

## Organización del proyecto

La interfaz, los estilos, la lógica de las aplicaciones, los datos y las imágenes se organizan según su función. En la versión entregada, las aplicaciones se reúnen en **apps.js** y el contenido del caso se reúne en **data.js**.

```text
CAUGHT-instagram-whatsapp/
├── index.html
├── style.css
├── script.js
├── apps.js
├── data.js
├── fonts/
├── img/
│   ├── personajes/
│   ├── evidencias/
│   ├── interfaz/
│   └── fondos/
└── README.md
```

### Función de los archivos y carpetas

- **index.html:** estructura de las pantallas y elementos de la interfaz.
- **style.css:** estilos, adaptación de tamaños y animaciones del videojuego.
- **script.js:** lógica principal, navegación, cronómetro, pistas, preguntas, veredictos y reinicio.
- **apps.js:** lógica de WhatsApp, Instagram, llamadas y contactos, notas, calendario, mapa, correo y galería. También contiene calculadora y ajustes.
- **data.js:** contenido del caso, personajes, pistas, chats y mensajes, perfiles y publicaciones, contactos, llamadas, notas, calendario, ubicaciones, correos, galería, preguntas, opciones y conclusiones.
- **img/personajes/:** imágenes de los personajes.
- **img/evidencias/:** imágenes utilizadas como evidencias.
- **img/interfaz/:** iconos y recursos de la interfaz.
- **img/fondos/:** fondos del juego.
- **fonts/:** fuentes locales.
- **README.md:** documentación general del proyecto.

La estructura propuesta con index/index.html, css/styles.css, js/apps/apps.js y data/casos.js es una organización alternativa. Esos nombres y rutas no corresponden al paquete actual; moverlos requiere actualizar las referencias del proyecto.

## Criterios de redacción

Los textos usan español rioplatense y voseo: «podés», «tenés», «elegí», «revisá» y «vos». Se conservan «tu» y «tus» cuando indican posesión. Los chats mantienen a Martín de un lado y al contacto del otro, con horarios del caso ficticio y pausas variadas entre respuestas.

## Recorrido del juego

- **Inicio:** CAUGHT!, «¿Podés descubrir la verdad?» y «Comenzar historia».
- **Expediente:** presentación de «El ticket de las 23:15», con un ticket ilustrado.
- **01 · La situación:** contexto, fotografía de Martín y Lucía y misión.
- **02 · Personajes:** presentación de los protagonistas.
- **03 · Pista principal / contenido:** ticket e inicio de la investigación.
- **Investigación:** teléfono con aplicaciones, hora, Wi-Fi, batería y cronómetro.
- **04 · Tiempo agotado:** informa cuántas pistas se encontraron; «Siguiente» lleva al resumen.
- **05 · Pistas encontradas:** lista las evidencias descubiertas.
- **06 · Preguntas:** todas las preguntas pertenecen a esta sección; se muestra el progreso.
- **07 · Resultados:** conclusión elegida, veredicto, explicación y acción posterior.

Los mini títulos están alineados a la izquierda. Al completar las cinco pistas antes del límite, el juego pasa al resumen después del último aviso de hallazgo.

## Cronómetro y pistas

La investigación comienza con **05:00**, **0/5 pistas** y las decisiones vacías. El cronómetro corre normalmente: las pausas temporales usadas para capturas fueron retiradas.

Cada pista nueva muestra el aviso «¡Pista encontrada!» y el contador correspondiente. El aviso permanece tres segundos. Una misma pista no incrementa dos veces el contador.

Las pistas se registran cuando la evidencia se hace visible en la aplicación. Los mensajes vinculados con pistas se resaltan. El reloj y el tiempo permanecen visibles en el aviso dentro del teléfono.

Al encontrar la quinta pista se conserva el tiempo restante y se cierra la investigación tras el aviso. La transición al resumen muestra ese tiempo final junto a la carga; la pantalla del resumen conserva su mini título sin el temporizador adicional.

Si el tiempo termina antes de reunirlas todas, se pasa a Tiempo agotado. Las preguntas de interpretación se filtran según las pistas encontradas; la pregunta final del veredicto se conserva. Cuando no hay ninguna pista, el botón del resumen dice «Revisar de nuevo» y comienza una investigación nueva.

## Evidencias

1. Conversación de Instagram entre Martín y Valentina.
2. Conversación de WhatsApp con Ricardo sobre la reserva del bar.
3. Conversación de WhatsApp con Nicolás sobre algo que está preparando.
4. Evidencia fotográfica del bar y su imagen complementaria.
5. Reserva en el calendario.

La reserva del bar corresponde a Martín y Nicolás. La fotografía y el ticket muestran tres consumiciones; esa cantidad no se usa como cantidad de personas de la reserva.

En el calendario, el título de la reserva no se muestra al entrar en el mes. Aparece al seleccionar su fecha, con el color magenta y texto blanco, para evitar revelar la pista de inmediato.

## Aplicaciones

El teléfono permite explorar correo, mapa, calendario, Instagram, notas, calculadora, ajustes, galería, teléfono y WhatsApp.

### Chats

Martín escribe a la derecha y el contacto a la izquierda. Los horarios pertenecen al caso ficticio y tienen pausas variadas. Los mensajes escritos durante la partida se guardan solo en la sesión y no modifican las evidencias originales.

En Instagram, Lucía confirma la cena del día siguiente. En WhatsApp pregunta «¿Salimos hoy a cenar?». Martín la cancela con la excusa de trabajar esa noche. La reserva con Ricardo es para dos personas: Martín y Nicolás.

La barra de WhatsApp incluye adjuntar, stickers, cámara y micrófono. Al escribir, el micrófono cambia al botón de enviar. La barra y el botón usan tonos violetas. Cámara, adjuntos, stickers y grabación de voz son controles de la simulación: no acceden a servicios reales y muestran un aviso de función no disponible.

### Ajustes

Incluye Modo avión, Wi-Fi, Bluetooth y Tiempo en pantalla. Los iconos aportados se muestran con un recorte circular que oculta su fondo exterior.

Activar Modo avión apaga Wi-Fi y Bluetooth. Desactivarlo recupera el estado anterior. Estos controles modifican la simulación, no la conectividad del dispositivo real.

Tiempo en pantalla presenta el uso registrado durante la partida, no el historial real del equipo.

### Otras aplicaciones

Correo utiliza avatares y logotipos, con lista, menú y lectura de mensajes. Teléfono muestra llamadas, contactos y teclado con iconos vectoriales. Notas tiene fondo blanco. Mapa, calendario y galería permiten explorar los datos del caso. Los servicios externos y las comunicaciones reales no están conectados.

## Preguntas y resultados

Para confirmar una respuesta hay que seleccionar una opción. Sin selección, aparece «¡Atención! Elegí una opción para continuar».

El veredicto depende de la conclusión final elegida. Las preguntas anteriores permiten interpretar las pistas; no se presenta un sistema de puntuación por cada respuesta intermedia.

- **Conclusión correcta:** muestra «¡Tu conclusión es correcta!» y explica el viaje sorpresa para Martín y Lucía, preparado con ayuda de Nicolás y Valentina. El botón «Volver al inicio» regresa a la primera pantalla de CAUGHT!.
- **Conclusión incorrecta:** muestra «Tu conclusión es incorrecta» e invita a investigar mejor, sin revelar la solución. «Reintentar» vuelve directamente al celular para una nueva investigación.

La pantalla de resultados también muestra la conclusión seleccionada, el número de pistas encontradas y el tiempo empleado.

## Reinicio

Una nueva investigación restablece el tiempo a 05:00, las pistas a 0/5 y las respuestas sin selección. También limpia mensajes de prueba, borradores, uso de aplicaciones, vistas abiertas y restos visuales del resultado anterior.

El retorno tras acertar lleva a la portada. El reintento tras una conclusión incorrecta lleva al celular. «Revisar de nuevo» sin pistas también inicia desde el celular.

## Transiciones

La carga inicial y los cambios de pantalla muestran tres corazones centrados en una fila. Saltan sucesivamente hacia arriba y regresan a la misma línea, sin desplazarse por debajo de ella.

La transición dura **1,5 segundos**, avanza automáticamente y no incluye un botón «Continuar». Las pantallas mantienen una transición horizontal. Al entrar al celular, la cuenta de investigación se reanuda después de la carga.

En Pistas encontradas, cada fila simula su carga y se revela consecutivamente de arriba hacia abajo. El botón de avance se habilita cuando termina esa secuencia. Se respeta la preferencia de movimiento reducido para las animaciones compatibles.

## Publicación y dispositivos

La versión entregada es local. Para compartir un enlace hay que publicar la carpeta completa en un alojamiento que admita sitios HTML, CSS y JavaScript. index.html debe estar en la raíz publicada.

Un mismo enlace puede abrirse en computadora y celular. La interfaz incluye reglas de adaptación, pero la comprobación completa de la versión final en dispositivos móviles reales queda pendiente de la prueba de la usuaria.

Al actualizar archivos locales también hay que actualizar la versión publicada. Las capturas de documentos o manuales anteriores no se modifican automáticamente con el código.

## Verificaciones y límites

Se comprobaron las rutas de imágenes, la asignación de remitentes en los 16 chats, el orden de horarios, la conservación de las pistas, el filtrado de preguntas, los veredictos y el restablecimiento del estado. También se realizaron comprobaciones de sintaxis y pruebas de lógica de navegación y ajustes.

Estas comprobaciones no equivalen a una prueba visual completa de todos los recorridos en todos los navegadores. La revisión de ortografía, tildes, puntuación y voseo fue realizada; pueden surgir ajustes menores durante las pruebas finales.

El juego no guarda partidas en un servidor ni incluye cuentas de usuario, sincronización entre dispositivos o comunicaciones reales. Al recargar, comienza una sesión nueva.

## Últimos cambios incorporados

- Revisión de voseo, tildes, puntuación y redacción.
- Ajustes de las imágenes iniciales y de la ilustración del celular.
- Orden de las secciones: 04 Tiempo agotado, 05 Pistas encontradas, 06 Preguntas y 07 Resultados.
- Chats con Martín y cada contacto en su lado correspondiente; pausas de respuesta variadas.
- Cancelación de la cena en WhatsApp y reserva del bar para dos.
- Reserva del calendario oculta hasta seleccionar su fecha.
- Iconos y comportamiento de Modo avión en Ajustes.
- Barra de escritura de WhatsApp adaptada a la referencia y a la paleta del juego.
- Carga con corazones durante 1,5 segundos y revelado consecutivo de las pistas.
- Corrección del doble cambio de pantalla al completar las cinco pistas.
- Veredictos explícitos; las conclusiones incorrectas no revelan la verdad.
- Retorno a la portada al acertar y al celular al reintentar tras un error.
- Reinicio completo y cronómetro normal después de las capturas.