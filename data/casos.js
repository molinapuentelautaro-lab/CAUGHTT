'use strict';
/* DATA.JS — datos del videojuego, separados de la lógica.
   Contiene caso, personajes, pistas, chats, publicaciones, contactos,
   fotos, ubicaciones, preguntas y conclusiones.
   Se carga antes de script.js y apps.js. Cada sección explica su contenido. */

/* ============================================================
   CASO
   Título del expediente, dificultad, tiempo límite y cantidad de pistas.
   ============================================================ */
window.Caught = window.Caught || { data: {}, apps: {} };
/* Ticket de la pantalla "03 · Pista principal / contenido". Los "__" son campos que debe completar el encargado de contenido. */
Caught.data.ticket={restaurante:'BAR DE RICARDO',ubicacion:'Buenos Aires',fecha:'26/09/2026',hora:'23:15',consumicion:'3 cervezas',total:'$__.___',nota:'____________'};
Caught.data.casos=[{"id_caso": 1, "titulo": "El ticket de las 23:15", "descripcion": "Una cena cancelada, una mentira y una prueba que parece imposible de explicar.", "tiempo_limite": 300, "dificultad": "Fácil", "total_pistas": 5, "estado": "Disponible"}];
/* ============================================================
   PERSONAJES
   Los 14 personajes del modelo. Solo los cuatro principales aparecen en la presentación; todos siguen disponibles durante la investigación.
   ============================================================ */
Caught.data.personajes = [
  {
    "id_personaje": 1,
    "id_caso": 1,
    "nombre": "Martín",
    "rol": "Investigado",
    "relacion_con_martin": "No aplica",
    "descripcion": "Investigado.",
    "imagen": "../img/personajes/martin.jpg"
  },
  {
    "id_personaje": 2,
    "id_caso": 1,
    "nombre": "Lucía",
    "rol": "Protagonista",
    "relacion_con_martin": "Esposa",
    "descripcion": "Protagonista.",
    "imagen": "../img/personajes/lucia.jpg"
  },
  {
    "id_personaje": 3,
    "id_caso": 1,
    "nombre": "Nicolás",
    "rol": "Hermano de Lucía",
    "relacion_con_martin": "Cuñado",
    "descripcion": "Hermano de Lucía.",
    "imagen": "../img/personajes/nicolas.jpg"
  },
  {
    "id_personaje": 4,
    "id_caso": 1,
    "nombre": "Valentina",
    "rol": "Amiga en común",
    "relacion_con_martin": "Amiga",
    "descripcion": "Amiga en común.",
    "imagen": "../img/personajes/valentina.jpg"
  },
  {
    "id_personaje": 5,
    "id_caso": 1,
    "nombre": "Tomás",
    "rol": "Compañero de oficina",
    "relacion_con_martin": "Compañero de oficina",
    "descripcion": "Compañero de oficina de Martín.",
    "imagen": "../img/personajes/tomas.jpg"
  },
  {
    "id_personaje": 6,
    "id_caso": 1,
    "nombre": "Aymara",
    "rol": "Compañera de oficina",
    "relacion_con_martin": "Compañera de oficina",
    "descripcion": "Compañera de oficina de Martín.",
    "imagen": "../img/personajes/aymara.jpg"
  },
  {
    "id_personaje": 7,
    "id_caso": 1,
    "nombre": "Camila",
    "rol": "Vecina",
    "relacion_con_martin": "Vecina",
    "descripcion": "Vecina de Martín.",
    "imagen": "../img/personajes/camila.jpg"
  },
  {
    "id_personaje": 8,
    "id_caso": 1,
    "nombre": "Diego",
    "rol": "Amigo desde el colegio",
    "relacion_con_martin": "Amigo",
    "descripcion": "Amigo desde el colegio de Martín.",
    "imagen": "../img/personajes/diego.jpg"
  },
  {
    "id_personaje": 9,
    "id_caso": 1,
    "nombre": "Julián",
    "rol": "Amigo desde el colegio",
    "relacion_con_martin": "Amigo",
    "descripcion": "Amigo desde el colegio de Martín.",
    "imagen": "../img/personajes/julian.jpg"
  },
  {
    "id_personaje": 10,
    "id_caso": 1,
    "nombre": "Paula",
    "rol": "Secretaria",
    "relacion_con_martin": "Secretaria en el ámbito laboral",
    "descripcion": "Secretaria de Martín.",
    "imagen": "../img/personajes/paula.jpg"
  },
  {
    "id_personaje": 11,
    "id_caso": 1,
    "nombre": "Ricardo",
    "rol": "Dueño del bar",
    "relacion_con_martin": "Conocido",
    "descripcion": "Dueño del bar al que va Martín.",
    "imagen": "../img/personajes/ricardo.jpg"
  },
  {
    "id_personaje": 12,
    "id_caso": 1,
    "nombre": "Josefina",
    "rol": "Conocida",
    "relacion_con_martin": "Conocida",
    "descripcion": "Conocida de Martín.",
    "imagen": "../img/personajes/josefina.jpg"
  },
  {
    "id_personaje": 13,
    "id_caso": 1,
    "nombre": "Lautaro",
    "rol": "Amigo",
    "relacion_con_martin": "Amigo",
    "descripcion": "Amigo de Martín.",
    "imagen": "../img/personajes/lautaro.jpg"
  },
  {
    "id_personaje": 14,
    "id_caso": 1,
    "nombre": "Nacho",
    "rol": "Amigo de Lucía",
    "relacion_con_martin": "Amigo de Lucía",
    "descripcion": "Amigo de Lucía y de Martín.",
    "imagen": "../img/personajes/nacho.jpg"
  }
];

/* ============================================================
   PISTAS
   Cinco evidencias relacionadas con los mensajes, fotografías y calendario.
   ============================================================ */
Caught.data.pistas = [
  {
    "id_pista": 1,
    "id_caso": 1,
    "tipo": "CHAT RECUPERADO",
    "origen": "instagram",
    "descripcion": "Conversación entre Martín y Valentina sobre algo entre ellos."
  },
  {
    "id_pista": 2,
    "id_caso": 1,
    "tipo": "CHAT RECUPERADO",
    "origen": "whatsapp",
    "descripcion": "Conversación entre Martín y un contacto del bar para una reserva."
  },
  {
    "id_pista": 3,
    "id_caso": 1,
    "tipo": "CHAT RECUPERADO",
    "origen": "whatsapp",
    "descripcion": "Conversación entre Martín y Nicolás sobre algo que se está preparando."
  },
  {
    "id_pista": 4,
    "id_caso": 1,
    "tipo": "FOTOGRAFÍA",
    "origen": "galeria",
    "descripcion": "Fotografía del bar con tres vasos de cerveza. Revisá también la imagen de las personas reunidas."
  },
  {
    "id_pista": 5,
    "id_caso": 1,
    "tipo": "RESERVA",
    "origen": "calendario",
    "descripcion": "Hay una reserva para el día 12/10, pero no se sabe para qué."
  }
];

/* ============================================================
   DATOS DE WHATSAPP
   Conversaciones y mensajes guardados, con fecha, remitente y referencia a la pista.
   ============================================================ */
Caught.data.chat_whatsapp=[{"id_chat": 1, "id_caso": 1, "nombre": "Lucía <3", "tipo": "privado"}, {"id_chat": 2, "id_caso": 1, "nombre": "Julián", "tipo": "privado"}, {"id_chat": 3, "id_caso": 1, "nombre": "Valentina", "tipo": "privado"}, {"id_chat": 4, "id_caso": 1, "nombre": "Ricardo", "tipo": "privado"}, {"id_chat": 5, "id_caso": 1, "nombre": "Nicolás", "tipo": "privado"}, {"id_chat": 6, "id_caso": 1, "nombre": "Paula", "tipo": "privado"}, {"id_chat": 7, "id_caso": 1, "nombre": "Lautaro", "tipo": "privado"}, {"id_chat": 8, "id_caso": 1, "nombre": "Nacho", "tipo": "privado"}, {"id_chat": 9, "id_caso": 1, "nombre": "Camila", "tipo": "privado"}];
/* Conversaciones completas: intercambios cotidianos y pistas originales intactas. */
Caught.data.mensaje=[
  {
    "id_mensaje": 10,
    "id_chat": 1,
    "id_personaje": 2,
    "contenido": "Hola, ¿ya saliste del trabajo?",
    "fecha_hora": "2026-09-26 13:18",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 11,
    "id_chat": 1,
    "id_personaje": 1,
    "contenido": "Sí, voy camino a casa.",
    "fecha_hora": "2026-09-26 13:23",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 12,
    "id_chat": 1,
    "id_personaje": 2,
    "contenido": "Buenísimo. Avisame cuando llegues.",
    "fecha_hora": "2026-09-26 13:24",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 13,
    "id_chat": 1,
    "id_personaje": 1,
    "contenido": "Dale, en un rato te escribo.",
    "fecha_hora": "2026-09-26 13:28",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 14,
    "id_chat": 2,
    "id_personaje": 9,
    "contenido": "¡Martín! Hace mucho que no hablamos.",
    "fecha_hora": "2026-09-26 09:12",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 15,
    "id_chat": 2,
    "id_personaje": 1,
    "contenido": "¡Julián! Sí, estuve bastante desconectado.",
    "fecha_hora": "2026-09-26 09:20",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 16,
    "id_chat": 2,
    "id_personaje": 9,
    "contenido": "¿Seguís con los mismos horarios en el trabajo?",
    "fecha_hora": "2026-09-26 09:26",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 17,
    "id_chat": 2,
    "id_personaje": 1,
    "contenido": "Sí, sigo igual. ¿Vos cómo venís?",
    "fecha_hora": "2026-09-26 09:38",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 18,
    "id_chat": 3,
    "id_personaje": 4,
    "contenido": "Hola, ¿están en casa esta tarde?",
    "fecha_hora": "2026-09-24 16:42",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 19,
    "id_chat": 3,
    "id_personaje": 1,
    "contenido": "Sí, por la tarde vamos a estar.",
    "fecha_hora": "2026-09-24 16:49",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 20,
    "id_chat": 3,
    "id_personaje": 4,
    "contenido": "Tengo ganas de pasar a verlos, ¿les viene bien?",
    "fecha_hora": "2026-09-24 17:03",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 21,
    "id_chat": 3,
    "id_personaje": 1,
    "contenido": "Dale, avisame cuando estés por salir.",
    "fecha_hora": "2026-09-24 17:12",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 22,
    "id_chat": 4,
    "id_personaje": 1,
    "contenido": "Hola, Ricardo. Quería consultar por una mesa.",
    "fecha_hora": "2026-09-24 16:12",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 23,
    "id_chat": 4,
    "id_personaje": 11,
    "contenido": "Hola, Martín. ¿Para cuántas personas?",
    "fecha_hora": "2026-09-24 16:18",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 24,
    "id_chat": 4,
    "id_personaje": 1,
    "contenido": "Para dos, voy con Nicolás. Si puede ser en un lugar tranquilo.",
    "fecha_hora": "2026-09-24 16:21",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 25,
    "id_chat": 4,
    "id_personaje": 11,
    "contenido": "Sí, tenemos lugar. ¿Qué día venís?",
    "fecha_hora": "2026-09-24 16:33",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 26,
    "id_chat": 4,
    "id_personaje": 1,
    "contenido": "El 26 de septiembre, bastante tarde.",
    "fecha_hora": "2026-09-24 16:39",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 27,
    "id_chat": 4,
    "id_personaje": 11,
    "contenido": "Perfecto, dejame revisar las reservas.",
    "fecha_hora": "2026-09-24 16:52",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 28,
    "id_chat": 5,
    "id_personaje": 1,
    "contenido": "Hola, ¿cómo venís con lo que hablamos?",
    "fecha_hora": "2026-09-23 09:42",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 29,
    "id_chat": 5,
    "id_personaje": 3,
    "contenido": "Bien, pude averiguar esta mañana.",
    "fecha_hora": "2026-09-23 09:51",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 30,
    "id_chat": 5,
    "id_personaje": 1,
    "contenido": "Buenísimo. Por ahora no digas nada, quiero que salga bien.",
    "fecha_hora": "2026-09-23 09:56",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 31,
    "id_chat": 5,
    "id_personaje": 3,
    "contenido": "Tranquilo, queda entre nosotros.",
    "fecha_hora": "2026-09-23 10:08",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 32,
    "id_chat": 6,
    "id_personaje": 10,
    "contenido": "Hola, Martín, ¿tenés el informe de ventas?",
    "fecha_hora": "2026-09-22 15:07",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 33,
    "id_chat": 6,
    "id_personaje": 1,
    "contenido": "Sí, estoy terminando los últimos números.",
    "fecha_hora": "2026-09-22 15:16",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 34,
    "id_chat": 6,
    "id_personaje": 10,
    "contenido": "Perfecto. La reunión de mañana es a primera hora.",
    "fecha_hora": "2026-09-22 15:28",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 35,
    "id_chat": 6,
    "id_personaje": 1,
    "contenido": "Lo mando hoy, así llegamos a revisarlo.",
    "fecha_hora": "2026-09-22 15:39",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 36,
    "id_chat": 7,
    "id_personaje": 13,
    "contenido": "¡Hola, Martín! ¿Todo bien?",
    "fecha_hora": "2026-09-22 14:52",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 37,
    "id_chat": 7,
    "id_personaje": 1,
    "contenido": "¡Lauti! Sí, ¿vos?",
    "fecha_hora": "2026-09-22 15:00",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 38,
    "id_chat": 7,
    "id_personaje": 13,
    "contenido": "Bien. ¿Seguís en la oficina?",
    "fecha_hora": "2026-09-22 15:12",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 39,
    "id_chat": 7,
    "id_personaje": 1,
    "contenido": "Sí, todavía estoy acá.",
    "fecha_hora": "2026-09-22 15:27",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 40,
    "id_chat": 8,
    "id_personaje": 14,
    "contenido": "Hola, ¿todo bien por casa?",
    "fecha_hora": "2026-09-22 12:16",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 41,
    "id_chat": 8,
    "id_personaje": 1,
    "contenido": "Todo tranquilo, gracias. ¿Ustedes?",
    "fecha_hora": "2026-09-22 12:25",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 42,
    "id_chat": 8,
    "id_personaje": 14,
    "contenido": "Bien. Hace rato que no vienen.",
    "fecha_hora": "2026-09-22 12:34",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 43,
    "id_chat": 8,
    "id_personaje": 1,
    "contenido": "Sí, tenemos que organizar una visita.",
    "fecha_hora": "2026-09-22 12:48",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 44,
    "id_chat": 9,
    "id_personaje": 7,
    "contenido": "Hola, Martín, necesito salir con el auto.",
    "fecha_hora": "2026-09-21 09:54",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 45,
    "id_chat": 9,
    "id_personaje": 1,
    "contenido": "Hola, Cami, ¿qué pasó?",
    "fecha_hora": "2026-09-21 09:57",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 46,
    "id_chat": 9,
    "id_personaje": 7,
    "contenido": "Hay un auto estacionado delante de mi entrada.",
    "fecha_hora": "2026-09-21 10:00",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 47,
    "id_chat": 9,
    "id_personaje": 1,
    "contenido": "¿Es el mío? El que dejé hace un rato.",
    "fecha_hora": "2026-09-21 10:02",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 1,
    "id_chat": 1,
    "id_personaje": 2,
    "contenido": "¿Llegaste bien?",
    "fecha_hora": "2026-09-26 14:05",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 2,
    "id_chat": 2,
    "id_personaje": 9,
    "contenido": "¿Cómo estás, amigo?",
    "fecha_hora": "2026-09-26 10:00",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 3,
    "id_chat": 3,
    "id_personaje": 4,
    "contenido": "¡Voy a casa a visitarlos!",
    "fecha_hora": "2026-09-24 17:30",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 4,
    "id_chat": 4,
    "id_personaje": 11,
    "contenido": "¿Te agendo la reserva para el 26/9 a las 23:15?",
    "fecha_hora": "2026-09-24 17:00",
    "es_pista": true,
    "id_pista": 2
  },
  {
    "id_mensaje": 5,
    "id_chat": 5,
    "id_personaje": 3,
    "contenido": "Ya conseguí lo que me pediste, avisame cuando lo necesites.",
    "fecha_hora": "2026-09-23 10:25",
    "es_pista": true,
    "id_pista": 3
  },
  {
    "id_mensaje": 6,
    "id_chat": 6,
    "id_personaje": 10,
    "contenido": "¡El jefe te quiere en la reunión a las 10!",
    "fecha_hora": "2026-09-22 16:00",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 7,
    "id_chat": 7,
    "id_personaje": 13,
    "contenido": "¿Qué hacés, Martín, mucho laburo?",
    "fecha_hora": "2026-09-22 15:40",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 8,
    "id_chat": 8,
    "id_personaje": 14,
    "contenido": "Tenés que venir a visitarnos.",
    "fecha_hora": "2026-09-22 13:05",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 9,
    "id_chat": 9,
    "id_personaje": 7,
    "contenido": "Hola, Martín, ¿podrías mover tu auto? Me tapa la salida y tengo que salir urgente.",
    "fecha_hora": "2026-09-21 10:05",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 48,
    "id_chat": 1,
    "id_personaje": 1,
    "contenido": "Sí, ya llegué. Gracias por preguntar ❤️",
    "fecha_hora": "2026-09-26 14:12",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 49,
    "id_chat": 2,
    "id_personaje": 1,
    "contenido": "Bien, amigo. Con bastante trabajo, pero todo bien. ¿Vos?",
    "fecha_hora": "2026-09-26 10:09",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 50,
    "id_chat": 3,
    "id_personaje": 1,
    "contenido": "¡Dale, los esperamos!",
    "fecha_hora": "2026-09-24 17:34",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 51,
    "id_chat": 4,
    "id_personaje": 1,
    "contenido": "Sí, agendala para las 23:15. Gracias, Ricardo.",
    "fecha_hora": "2026-09-24 17:08",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 52,
    "id_chat": 5,
    "id_personaje": 1,
    "contenido": "Buenísimo, gracias. Te aviso cuando lo necesite.",
    "fecha_hora": "2026-09-23 10:31",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 53,
    "id_chat": 6,
    "id_personaje": 1,
    "contenido": "Perfecto, mañana a las 10 estoy en la reunión.",
    "fecha_hora": "2026-09-22 16:06",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 54,
    "id_chat": 7,
    "id_personaje": 1,
    "contenido": "Sí, bastante. Cuando termine te escribo.",
    "fecha_hora": "2026-09-22 15:48",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 55,
    "id_chat": 8,
    "id_personaje": 1,
    "contenido": "Dale, después coordinamos un día para ir.",
    "fecha_hora": "2026-09-22 13:11",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 56,
    "id_chat": 9,
    "id_personaje": 1,
    "contenido": "Sí, ya voy a moverlo. Perdón por taparte la salida.",
    "fecha_hora": "2026-09-21 10:07",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 57,
    "id_chat": 1,
    "id_personaje": 2,
    "contenido": "¿Salimos hoy a cenar?",
    "fecha_hora": "2026-09-26 18:06",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 58,
    "id_chat": 1,
    "id_personaje": 1,
    "contenido": "Lu, perdón, al final no voy a poder. Tengo que trabajar esta noche, me quedó un informe pendiente.",
    "fecha_hora": "2026-09-26 18:19",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 59,
    "id_chat": 1,
    "id_personaje": 2,
    "contenido": "¿Esta noche? Ayer me habías dicho que estaba todo confirmado.",
    "fecha_hora": "2026-09-26 18:24",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 60,
    "id_chat": 1,
    "id_personaje": 1,
    "contenido": "Sí, lo sé. Me lo pidieron hoy y tengo que dejarlo listo para mañana. Seguramente termine tarde.",
    "fecha_hora": "2026-09-26 18:36",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 61,
    "id_chat": 1,
    "id_personaje": 2,
    "contenido": "Bueno… me había hecho ilusión la cena. Avisame cuando termines.",
    "fecha_hora": "2026-09-26 18:43",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 62,
    "id_chat": 1,
    "id_personaje": 1,
    "contenido": "Perdón, amor. Lo dejamos para otro día. Te escribo cuando termine.",
    "fecha_hora": "2026-09-26 18:51",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 63,
    "id_chat": 1,
    "id_personaje": 2,
    "contenido": "¿Seguís trabajando?",
    "fecha_hora": "2026-09-26 23:42",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 64,
    "id_chat": 1,
    "id_personaje": 1,
    "contenido": "Sí, todavía estoy con eso. No me esperes despierta.",
    "fecha_hora": "2026-09-26 23:54",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje": 65,
    "id_chat": 1,
    "id_personaje": 2,
    "contenido": "Está bien. Hablamos mañana.",
    "fecha_hora": "2026-09-26 23:58",
    "es_pista": false,
    "id_pista": null
  }
];
/* ============================================================
   DATOS DE INSTAGRAM
   Perfiles, publicaciones, actividad, conversaciones privadas y mensajes.
   ============================================================ */
Caught.data.perfil_instagram=[{"id_perfil": 1, "id_personaje": 1, "usuario": "Martin_12", "foto_perfil": "../img/personajes/martin.jpg"}, {"id_perfil": 2, "id_personaje": 2, "usuario": "Lucia.sw", "foto_perfil": "../img/personajes/lucia.jpg"}, {"id_perfil": 3, "id_personaje": 3, "usuario": "Nicolas.gv", "foto_perfil": "../img/personajes/nicolas.jpg"}, {"id_perfil": 4, "id_personaje": 4, "usuario": "Valennt", "foto_perfil": "../img/personajes/valentina.jpg"}, {"id_perfil": 5, "id_personaje": 5, "usuario": "Tomasss", "foto_perfil": "../img/personajes/tomas.jpg"}, {"id_perfil": 6, "id_personaje": 6, "usuario": "Aymara.lpez", "foto_perfil": "../img/personajes/aymara.jpg"}, {"id_perfil": 7, "id_personaje": 8, "usuario": "Diego.rd", "foto_perfil": "../img/personajes/diego.jpg"}, {"id_perfil": 8, "id_personaje": 9, "usuario": "Julian.alv", "foto_perfil": "../img/personajes/julian.jpg"}, {"id_perfil": 9, "id_personaje": 12, "usuario": "Joseeef", "foto_perfil": "../img/personajes/josefina.jpg"}, {"id_perfil": 10, "id_personaje": 13, "usuario": "Lauti.em", "foto_perfil": "../img/personajes/lautaro.jpg"}, {"id_perfil": 11, "id_personaje": 14, "usuario": "Nachito12", "foto_perfil": "../img/personajes/nacho.jpg"}];
/* Fotos únicas en Instagram. Las reuniones y las fotos de oficina
   repetidas permanecen en Galería; las pistas conservan sus imágenes. */
Caught.data.publicacion=[
  {
    "id_publicacion": 1,
    "id_perfil": 2,
    "contenido": "Ya falta poco para nuestro aniversario.",
    "imagen": "../img/personajes/lucia.jpg",
    "fecha_hora": "2026-09-24 20:00"
  },
  {
    "id_publicacion": 2,
    "id_perfil": 4,
    "contenido": "Una pausa para disfrutar de la vista.",
    "imagen": "../img/evidencias/lugar.jpg",
    "fecha_hora": "2026-09-25 18:12"
  },
  {
    "id_publicacion": 3,
    "id_perfil": 3,
    "contenido": "Un momento tranquilo antes de seguir con la semana.",
    "imagen": "../img/personajes/nicolas.jpg",
    "fecha_hora": "2026-09-26 22:00"
  },
  {
    "id_publicacion": 4,
    "id_perfil": 1,
    "contenido": "Semana larga de trabajo. Ya casi termina.",
    "imagen": "../img/evidencias/oficina.jpg",
    "fecha_hora": "2026-09-25 09:30"
  },
  {
    "id_publicacion": 5,
    "id_perfil": 5,
    "contenido": "Otro día de trabajo, ya casi llega el fin de semana.",
    "imagen": "../img/evidencias/enlaoficina.jpg",
    "fecha_hora": "2026-09-25 17:40"
  },
  {
    "id_publicacion": 7,
    "id_perfil": 7,
    "contenido": "¡Descubrí un paisaje buenísimo!",
    "imagen": "../img/evidencias/viaje2.jpg",
    "fecha_hora": "2026-09-20 21:30"
  },
  {
    "id_publicacion": 8,
    "id_perfil": 8,
    "contenido": "Domingo de asado con los pibes.",
    "imagen": null,
    "fecha_hora": "2026-09-21 15:00"
  },
  {
    "id_publicacion": 9,
    "id_perfil": 9,
    "contenido": "Feliz cumple a mi tía, ¡te quiero!",
    "imagen": null,
    "fecha_hora": "2026-09-22 20:00"
  },
  {
    "id_publicacion": 10,
    "id_perfil": 10,
    "contenido": "Entrenando temprano, la semana arranca.",
    "imagen": null,
    "fecha_hora": "2026-09-21 08:00"
  }
];
Caught.data.actividad_instagram=[{"id_actividad": 1, "id_perfil": 2, "id_publicacion": 4, "tipo": "me_gusta", "descripcion": "Lucía le dio me gusta a la publicación de Martín.", "fecha_hora": "2026-09-25 09:40"}, {"id_actividad": 2, "id_perfil": 2, "id_publicacion": 4, "tipo": "comentario", "descripcion": "Lucía comentó: “Ya casi terminás, dale que falta poco”.", "fecha_hora": "2026-09-25 09:42"}, {"id_actividad": 3, "id_perfil": 4, "id_publicacion": 4, "tipo": "me_gusta", "descripcion": "Valentina le dio me gusta a la publicación de Martín.", "fecha_hora": "2026-09-25 09:50"}, {"id_actividad": 4, "id_perfil": 8, "id_publicacion": 4, "tipo": "me_gusta", "descripcion": "Julián le dio me gusta a la publicación de Martín.", "fecha_hora": "2026-09-25 10:10"}, {"id_actividad": 5, "id_perfil": 6, "id_publicacion": 4, "tipo": "me_gusta", "descripcion": "Aymara le dio me gusta a la publicación de Martín.", "fecha_hora": "2026-09-25 10:15"}, {"id_actividad": 6, "id_perfil": 9, "id_publicacion": 4, "tipo": "comentario", "descripcion": "Josefina comentó: “¡Éxitos con todo!”.", "fecha_hora": "2026-09-25 10:20"}, {"id_actividad": 7, "id_perfil": 10, "id_publicacion": 4, "tipo": "me_gusta", "descripcion": "Lautaro le dio me gusta a la publicación de Martín.", "fecha_hora": "2026-09-25 10:25"}];
Caught.data.chat_instagram=[{"id_chat_ig": 1, "id_caso": 1, "id_perfil": 4}, {"id_chat_ig": 2, "id_caso": 1, "id_perfil": 5}, {"id_chat_ig": 3, "id_caso": 1, "id_perfil": 7}, {"id_chat_ig": 4, "id_caso": 1, "id_perfil": 8}, {"id_chat_ig": 5, "id_caso": 1, "id_perfil": 2}, {"id_chat_ig": 6, "id_caso": 1, "id_perfil": 6}, {"id_chat_ig": 7, "id_caso": 1, "id_perfil": 10}];
Caught.data.mensaje_instagram=[
  {
    "id_mensaje_ig": 1,
    "id_chat_ig": 1,
    "id_perfil": 4,
    "contenido": "Lo nuestro ya está confirmado. Que Lucía no se entere de nada.",
    "fecha_hora": "2026-09-25 19:40",
    "es_pista": true,
    "id_pista": 1
  },
  {
    "id_mensaje_ig": 2,
    "id_chat_ig": 1,
    "id_perfil": 1,
    "contenido": "Tranquila, está todo en orden.",
    "fecha_hora": "2026-09-25 19:52",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 3,
    "id_chat_ig": 1,
    "id_perfil": 4,
    "contenido": "Ok, pero cuidado.",
    "fecha_hora": "2026-09-25 20:03",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 4,
    "id_chat_ig": 2,
    "id_perfil": 5,
    "contenido": "Te cubro las horas, tranqui.",
    "fecha_hora": "2026-09-24 12:10",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 5,
    "id_chat_ig": 2,
    "id_perfil": 1,
    "contenido": "Gracias, te debo una.",
    "fecha_hora": "2026-09-24 12:17",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 6,
    "id_chat_ig": 2,
    "id_perfil": 5,
    "contenido": "Me lo devolvés con un café.",
    "fecha_hora": "2026-09-24 12:29",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 7,
    "id_chat_ig": 3,
    "id_perfil": 7,
    "contenido": "El lugar al que fui está divino. ¿Fuiste?",
    "fecha_hora": "2026-09-24 20:10",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 8,
    "id_chat_ig": 3,
    "id_perfil": 1,
    "contenido": "Gracias por el dato, voy a ir pronto.",
    "fecha_hora": "2026-09-24 20:25",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 9,
    "id_chat_ig": 4,
    "id_perfil": 8,
    "contenido": "¿Salimos después del trabajo esta semana?",
    "fecha_hora": "2026-09-22 18:30",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 10,
    "id_chat_ig": 4,
    "id_perfil": 1,
    "contenido": "Esta semana no puedo, tengo planes. Otro día.",
    "fecha_hora": "2026-09-22 18:47",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 11,
    "id_chat_ig": 5,
    "id_perfil": 2,
    "contenido": "¿Confirmamos la cena de mañana?",
    "fecha_hora": "2026-09-25 21:00",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 12,
    "id_chat_ig": 5,
    "id_perfil": 1,
    "contenido": "Sí, te aviso el horario mañana.",
    "fecha_hora": "2026-09-25 21:13",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 13,
    "id_chat_ig": 6,
    "id_perfil": 6,
    "contenido": "¿Tenés el informe de ventas para el lunes?",
    "fecha_hora": "2026-09-23 11:00",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 14,
    "id_chat_ig": 6,
    "id_perfil": 1,
    "contenido": "Sí, te lo mando esta tarde.",
    "fecha_hora": "2026-09-23 11:24",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 15,
    "id_chat_ig": 7,
    "id_perfil": 10,
    "contenido": "Cuando quieras, nos juntamos a entrenar.",
    "fecha_hora": "2026-09-21 08:30",
    "es_pista": false,
    "id_pista": null
  },
  {
    "id_mensaje_ig": 16,
    "id_chat_ig": 7,
    "id_perfil": 1,
    "contenido": "Dale, Lauti. Esta semana estoy complicado, pero coordinamos para la próxima.",
    "fecha_hora": "2026-09-21 08:42",
    "es_pista": false,
    "id_pista": null
  }
];
/* ============================================================
   DATOS DE CONTACTOS
   Nombres, fotografías y números de la agenda.
   ============================================================ */
Caught.data.contacto = [
  {
    "id_contacto": 1,
    "id_personaje": 6,
    "nombre": "Aymara",
    "numero": "+54 9 11 6249-1837",
    "foto": "../img/personajes/aymara.jpg"
  },
  {
    "id_contacto": 2,
    "id_personaje": 7,
    "nombre": "Camila",
    "numero": "+54 9 11 4582-7316",
    "foto": "../img/personajes/camila.jpg"
  },
  {
    "id_contacto": 3,
    "id_personaje": 8,
    "nombre": "Diego",
    "numero": "+54 9 11 3975-8421",
    "foto": "../img/personajes/diego.jpg"
  },
  {
    "id_contacto": 4,
    "id_personaje": 9,
    "nombre": "Julián",
    "numero": "+54 9 11 5138-2964",
    "foto": "../img/personajes/julian.jpg"
  },
  {
    "id_contacto": 5,
    "id_personaje": 2,
    "nombre": "Lucía",
    "numero": "+54 9 11 2851-6374",
    "foto": "../img/personajes/lucia.jpg"
  },
  {
    "id_contacto": 6,
    "id_personaje": 13,
    "nombre": "Lautaro",
    "numero": "+54 9 11 7462-5193",
    "foto": "../img/personajes/lautaro.jpg"
  },
  {
    "id_contacto": 7,
    "id_personaje": 3,
    "nombre": "Nicolás",
    "numero": "+54 9 11 9284-3157",
    "foto": "../img/personajes/nicolas.jpg"
  },
  {
    "id_contacto": 8,
    "id_personaje": 14,
    "nombre": "Nacho",
    "numero": "+54 9 11 3847-2619",
    "foto": "../img/personajes/nacho.jpg"
  },
  {
    "id_contacto": 9,
    "id_personaje": 10,
    "nombre": "Paula",
    "numero": "+54 9 11 8394-1625",
    "foto": "../img/personajes/paula.jpg"
  },
  {
    "id_contacto": 10,
    "id_personaje": 11,
    "nombre": "Ricardo",
    "numero": "+54 9 11 4726-9581",
    "foto": "../img/personajes/ricardo.jpg"
  },
  {
    "id_contacto": 11,
    "id_personaje": 4,
    "nombre": "Valentina",
    "numero": "+54 9 11 6513-2748",
    "foto": "../img/personajes/valentina.jpg"
  }
];

/* ============================================================
   DATOS DE LLAMADAS
   Registro de llamadas entrantes, salientes y perdidas.
   ============================================================ */
Caught.data.llamada = [
  {
    "id_llamada": 1,
    "id_contacto": 5,
    "tipo": "saliente",
    "fecha_hora": "2026-09-26 14:10",
    "duracion": 300
  },
  {
    "id_llamada": 2,
    "id_contacto": 3,
    "tipo": "entrante",
    "fecha_hora": "2026-09-24 11:00",
    "duracion": 100
  },
  {
    "id_llamada": 3,
    "id_contacto": 1,
    "tipo": "perdida",
    "fecha_hora": "2026-09-23 18:00",
    "duracion": null
  },
  {
    "id_llamada": 4,
    "id_contacto": 4,
    "tipo": "perdida",
    "fecha_hora": "2026-09-23 17:30",
    "duracion": null
  },
  {
    "id_llamada": 5,
    "id_contacto": 2,
    "tipo": "perdida",
    "fecha_hora": "2026-09-21 15:15",
    "duracion": null
  },
  {
    "id_llamada": 6,
    "id_contacto": 5,
    "tipo": "entrante",
    "fecha_hora": "2026-09-20 14:15",
    "duracion": 250
  }
];

/* ============================================================
   DATOS DE NOTAS
   Notas originales del teléfono de Martín.
   ============================================================ */
Caught.data.nota = [
  {
    "id_nota": 1,
    "id_caso": 1,
    "titulo": "Compras",
    "contenido": "Remeras básicas, traje en negro y azul, zapatillas nuevas.",
    "fecha": "2026-09-24"
  },
  {
    "id_nota": 2,
    "id_caso": 1,
    "titulo": "Tareas",
    "contenido": "Ordenar informes, comprar materiales, dedicarle tiempo a mi esposa.",
    "fecha": "2026-09-20"
  },
  {
    "id_nota": 3,
    "id_caso": 1,
    "titulo": "Informes a entregar",
    "contenido": "Informe financiero, informe de ventas y de producción.",
    "fecha": "2026-09-15"
  }
];

/* ============================================================
   DATOS DE CALENDARIO
   Reserva del 12 de octubre y su referencia a la pista.
   ============================================================ */
Caught.data.evento_calendario = [
  {
    "id_evento": 1,
    "id_caso": 1,
    "titulo": "Reserva especial",
    "descripcion": null,
    "fecha": "2026-10-12",
    "hora": "18:00",
    "es_pista": true,
    "id_pista": 5
  }
];

/* ============================================================
   DATOS DEL MAPA
   Lugares y direcciones guardados, sin geolocalización real.
   ============================================================ */
Caught.data.ubicacion = [
  {
    "id_ubicacion": 1,
    "id_caso": 1,
    "nombre": "Casa",
    "direccion": "Av. de los Jazmines 742, Buenos Aires"
  },
  {
    "id_ubicacion": 2,
    "id_caso": 1,
    "nombre": "Avenida Los Tilos",
    "direccion": "Av. Los Tilos 341"
  },
  {
    "id_ubicacion": 3,
    "id_caso": 1,
    "nombre": "Calle Aurora",
    "direccion": "Calle Aurora 819"
  },
  {
    "id_ubicacion": 4,
    "id_caso": 1,
    "nombre": "Pasaje La Esperanza",
    "direccion": "Pasaje La Esperanza s/n"
  }
];

/* ============================================================
   DATOS DE CORREO
   Remitentes, asuntos, cuerpos y fechas de los correos.
   ============================================================ */
Caught.data.email = [
  {
    "id_email": 1,
    "id_caso": 1,
    "remitente": "support@google.com",
    "asunto": "Alerta de seguridad",
    "contenido": "Se detectó un inicio de sesión sospechoso en una cuenta. Se recomienda verificar la actividad.",
    "fecha_hora": "2026-09-25 10:30"
  },
  {
    "id_email": 2,
    "id_caso": 1,
    "remitente": "carrefour@gmail.com",
    "asunto": "Oferta especial",
    "contenido": "Aprovechá un descuento del 90 % en productos seleccionados. Promoción por tiempo limitado.",
    "fecha_hora": "2026-09-25 10:00"
  },
  {
    "id_email": 3,
    "id_caso": 1,
    "remitente": "soporte@paypal.com",
    "asunto": "Pago rechazado",
    "contenido": "Se registró un intento de pago rechazado. Revisá los movimientos desde el sitio oficial.",
    "fecha_hora": "2026-09-20 15:00"
  },
  {
    "id_email": 4,
    "id_caso": 1,
    "remitente": "netflix@gmail.com",
    "asunto": "Nuevo estreno",
    "contenido": "Ya está disponible una nueva temporada de tu serie favorita.",
    "fecha_hora": "2026-09-19 17:00"
  },
  {
    "id_email": 5,
    "id_caso": 1,
    "remitente": "premios.sorteo@gmail.com",
    "asunto": "Premio sorpresa",
    "contenido": "¡Ganaste un celular! Para reclamarlo, ingresá tus datos personales en el enlace recibido.",
    "fecha_hora": "2026-09-19 13:15"
  },
  {
    "id_email": 6,
    "id_caso": 1,
    "remitente": "youtube@gmail.com",
    "asunto": "Nuevo video",
    "contenido": "Uno de tus canales favoritos publicó un nuevo video.",
    "fecha_hora": "2026-09-19 13:00"
  },
  {
    "id_email": 7,
    "id_caso": 1,
    "remitente": "bancoBC@gmail.com",
    "asunto": "Transferencia",
    "contenido": "Se realizó una transferencia de $15.000 desde tu cuenta. Consultá los movimientos en la aplicación.",
    "fecha_hora": "2026-09-17 18:00"
  },
  {
    "id_email": 8,
    "id_caso": 1,
    "remitente": "premios.suerte@gmail.com",
    "asunto": "Premio millonario",
    "contenido": "Fuiste seleccionado para recibir un premio en efectivo. Para reclamarlo, enviá tus datos personales.",
    "fecha_hora": "2026-09-17 15:00"
  }
];

/* ============================================================
   DATOS DE GALERÍA
   Rutas de imágenes, metadatos y vínculos a evidencias.
   ============================================================ */
Caught.data.foto=[
  {
    "id_foto": 1,
    "id_caso": 1,
    "archivo": "../img/evidencias/bar.jpg",
    "fecha_hora": "2026-09-26 23:20",
    "es_pista": true,
    "id_pista": 4,
    "descripcion": "Fotografía del bar: tres vasos de cerveza."
  },
  {
    "id_foto": 2,
    "id_caso": 1,
    "archivo": "../img/evidencias/lugarbar.jpg",
    "fecha_hora": "2026-09-26 23:17",
    "es_pista": false,
    "id_pista": null,
    "descripcion": "lugarbar"
  },
  {
    "id_foto": 4,
    "id_caso": 1,
    "archivo": "../img/evidencias/oficina.jpg",
    "fecha_hora": "2026-09-20 18:00",
    "es_pista": false,
    "id_pista": null,
    "descripcion": "oficina"
  },
  {
    "id_foto": 6,
    "id_caso": 1,
    "archivo": "../img/evidencias/viaje.jpg",
    "fecha_hora": "2026-09-01 13:55",
    "es_pista": false,
    "id_pista": null,
    "descripcion": "viaje"
  },
  {
    "id_foto": 7,
    "id_caso": 1,
    "archivo": "../img/evidencias/enlaoficina.jpg",
    "fecha_hora": "2026-08-30 00:00",
    "es_pista": false,
    "id_pista": null,
    "descripcion": "enlaoficina"
  },
  {
    "id_foto": 8,
    "id_caso": 1,
    "archivo": "../img/evidencias/viaje1.jpg",
    "fecha_hora": "2026-08-15 00:00",
    "es_pista": false,
    "id_pista": null,
    "descripcion": "viaje1"
  },
  {
    "id_foto": 9,
    "id_caso": 1,
    "archivo": "../img/evidencias/evidencia.jpg",
    "fecha_hora": null,
    "es_pista": true,
    "id_pista": 4,
    "descripcion": "Imagen de las personas reunidas. Recurso complementario de la evidencia fotográfica; el archivo no incluye fecha."
  }
];
/* ============================================================
   PREGUNTAS Y CONCLUSIONES
   Seis preguntas, sus opciones y los tres resultados posibles.
   ============================================================ */
/* id_pista relaciona cada pregunta con su evidencia; la conclusión es general. */
Caught.data.pregunta=[
  {
    "id_pregunta": 1,
    "id_caso": 1,
    "texto_pregunta": "¿Qué indica principalmente la conversación entre Martín y Valentina?",
    "orden": 1,
    "es_definitiva": false,
    "id_pista": 1
  },
  {
    "id_pregunta": 2,
    "id_caso": 1,
    "texto_pregunta": "¿Para qué creés que reservó lugar en el bar?",
    "orden": 2,
    "es_definitiva": false,
    "id_pista": 2
  },
  {
    "id_pregunta": 3,
    "id_caso": 1,
    "texto_pregunta": "¿Qué creés que se está preparando entre Martín y Nicolás?",
    "orden": 3,
    "es_definitiva": false,
    "id_pista": 3
  },
  {
    "id_pregunta": 4,
    "id_caso": 1,
    "texto_pregunta": "¿Qué significa la fotografía encontrada?",
    "orden": 4,
    "es_definitiva": false,
    "id_pista": 4
  },
  {
    "id_pregunta": 5,
    "id_caso": 1,
    "texto_pregunta": "¿Qué significa la reserva en el calendario?",
    "orden": 5,
    "es_definitiva": false,
    "id_pista": 5
  },
  {
    "id_pregunta": 6,
    "id_caso": 1,
    "texto_pregunta": "¿Qué creés que fue lo que pasó?",
    "orden": 6,
    "es_definitiva": true,
    "id_pista": null
  }
];
Caught.data.opcion=[{"id_opcion": 1, "id_pregunta": 1, "texto": "Una relación cercana entre ambos.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 2, "id_pregunta": 1, "texto": "Un conflicto o desacuerdo entre ambos.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 3, "id_pregunta": 1, "texto": "Una conversación relacionada con sus gustos personales.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 4, "id_pregunta": 2, "texto": "Para despejarse “solo”.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 5, "id_pregunta": 2, "texto": "Para esconder un encuentro con otra persona.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 6, "id_pregunta": 2, "texto": "Para alguna reunión.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 7, "id_pregunta": 3, "texto": "Una juntada entre ellos.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 8, "id_pregunta": 3, "texto": "Nicolás está ayudando a esconder algo de Martín.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 9, "id_pregunta": 3, "texto": "Lo está ayudando en algo especial.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 10, "id_pregunta": 4, "texto": "Una reunión de su trabajo.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 11, "id_pregunta": 4, "texto": "Se encontró con unos amigos en el bar.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 12, "id_pregunta": 4, "texto": "Se ve con alguien más.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 13, "id_pregunta": 5, "texto": "Algún viaje planeado.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 14, "id_pregunta": 5, "texto": "Tiene una reserva para volver al bar.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 15, "id_pregunta": 5, "texto": "Se verá con alguien.", "consecuencia": "siguiente", "id_conclusion": null}, {"id_opcion": 16, "id_pregunta": 6, "texto": "Está organizándome una sorpresa.", "consecuencia": "conclusion", "id_conclusion": 1}, {"id_opcion": 17, "id_pregunta": 6, "texto": "Me está engañando.", "consecuencia": "conclusion", "id_conclusion": 2}, {"id_opcion": 18, "id_pregunta": 6, "texto": "Simplemente es trabajo.", "consecuencia": "conclusion", "id_conclusion": 3}];
Caught.data.conclusion=[
  {
    "id_conclusion": 1,
    "id_caso": 1,
    "texto": "Está organizándome una sorpresa.",
    "es_correcta": true,
    "titulo_resultado": "El detalle hacía la diferencia.",
    "texto_resultado": "Martín se juntó con Nicolás, tu hermano, en el bar para organizar un viaje sorpresa para vos. Valentina, tu amiga, también lo estaba ayudando con los preparativos."
  },
  {
    "id_conclusion": 2,
    "id_caso": 1,
    "texto": "Me está engañando.",
    "es_correcta": false,
    "titulo_resultado": "Tu conclusión es incorrecta.",
    "texto_resultado": "Necesitás investigar mejor. Volvé a revisar las pistas y relacioná las conversaciones, la fotografía y la reserva antes de sacar una nueva conclusión."
  },
  {
    "id_conclusion": 3,
    "id_caso": 1,
    "texto": "Simplemente es trabajo.",
    "es_correcta": false,
    "titulo_resultado": "Tu conclusión es incorrecta.",
    "texto_resultado": "Necesitás investigar mejor. Volvé a revisar las pistas y relacioná las conversaciones, la fotografía y la reserva antes de sacar una nueva conclusión."
  }
];