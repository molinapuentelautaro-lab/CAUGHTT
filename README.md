# CAUGHT!

## Descripción del proyecto

CAUGHT! es un videojuego de investigación y misterio con fines educativos. El jugador explora un teléfono simulado y analiza pistas, conversaciones, fotografías, mensajes y horarios para descubrir qué está ocurriendo.

Durante la investigación debe relacionar las evidencias, encontrar posibles contradicciones entre los personajes y utilizar su razonamiento para llegar a una conclusión.

La propuesta combina investigación, misterio, deducción y exploración. Su desarrollo permite aplicar conocimientos de programación web, diseño de interfaces, organización de archivos, control de versiones y trabajo colaborativo.

Los casos, personajes y situaciones del juego son ficticios. Las aplicaciones del teléfono forman parte de la simulación del videojuego.

## Integrantes y roles

- Lautaro: Analista de negocio y programador.
- Kimberly: Project Manager y diseñador.
- Morena: Marketing y diseñador.
- Malena: Analista funcional y diseñador.
- Ayrton: Programador y analista de negocio.

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

La interfaz, los estilos, la lógica de las aplicaciones, los datos y las imágenes se organizan en carpetas según su función. En esta distribución, las aplicaciones se reúnen en `apps.js` y el contenido del caso se reúne en `casos.js`.

```text
CAUGHT!/
├── index/
│   └── index.html
├── css/
│   └── styles.css
├── js/
│   ├── script.js
│   └── apps/
│       └── apps.js
├── data/
│   └── casos.js
├── img/
│   ├── personajes/
│   ├── evidencias/
│   ├── interfaz/
│   └── fondos/
└── README.md
```

### Función de los archivos y carpetas

- `index/index.html`: estructura de las pantallas y elementos de la interfaz.
- `css/styles.css`: estilos del videojuego.
- `js/script.js`: lógica principal e interacción del juego.
- `js/apps/apps.js`: lógica de WhatsApp, Instagram, llamadas y contactos, notas, calendario, mapa, correo y galería. También contiene calculadora y ajustes.
- `data/casos.js`: contenido del caso, personajes, pistas, chats y mensajes, perfiles y publicaciones, contactos, llamadas, notas, calendario, ubicaciones, correos, galería, preguntas, opciones y conclusiones.
- `img/personajes/`: imágenes de los personajes.
- `img/evidencias/`: imágenes utilizadas como evidencias.
- `img/interfaz/`: iconos y recursos de la interfaz.
- `img/fondos/`: fondos del juego.
- `README.md`: documentación general del proyecto.

## Instrucciones para abrir el proyecto

1. Descargar o clonar el repositorio.
2. Abrir la carpeta raíz `CAUGHT!` en Visual Studio Code.
3. Localizar el archivo `index/index.html`.
4. Hacer clic derecho sobre el archivo y seleccionar **Open with Live Server** con la extensión instalada.

Las rutas de estilos, scripts e imágenes deben corresponder a su ubicación dentro del proyecto para que el navegador pueda cargar los recursos.
