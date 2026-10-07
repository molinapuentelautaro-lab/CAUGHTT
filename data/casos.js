'use strict';
/* Caso ficticio de ejemplo. Cargar antes de script.js y apps.js.
   script.js debe conservar Caught.data. Tiempo límite en segundos.
   Las preguntas se incluyen aquí para entregar dos archivos JS. */
(function (root) {
  const C = root.Caught = root.Caught || {};
  const img = (texto) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#394c68"/><text x="400" y="300" text-anchor="middle" fill="white" font-family="Arial" font-size="24">${texto}</text></svg>`);
  const personajes = ['Martín', 'Lucía', 'Valentina', 'Tomás', 'Carolina'].map((nombre, i) => ({ id_personaje: i + 1, nombre, foto: img(nombre), rol: ['Dueño del teléfono', 'Pareja', 'Conocida', 'Amigo', 'Compañera de trabajo'][i] }));
  const pistas = [
    ['Mensaje privado', 'Valentina pide discreción sobre el encuentro del 12.', 'instagram'],
    ['La excusa', 'Martín dice a Lucía que trabajará la noche del 12 de octubre.', 'whatsapp'],
    ['El favor', 'Martín pide a Tomás que lo cubra y menciona a Valentina y el Aurora.', 'whatsapp'],
    ['Las fotos', 'Una foto muestra a Martín con Valentina; otra registra la reserva.', 'gallery'],
    ['La reserva', 'El calendario confirma el 12 de octubre, 20:30, en el Hotel Aurora.', 'calendar']
  ].map(([titulo, descripcion, app], i) => ({ id_pista: i + 1, id_caso: 1, titulo, descripcion, app }));
  const datos = {
    casos: [{ id_caso: 1, titulo: 'La reserva oculta', tiempo_limite: 1200, dificultad: 'Media', fecha_inicio: '2026-09-28', id_personaje: 1, descripcion: 'Explorá el teléfono de Martín para descubrir con quién, cuándo y dónde planea reunirse en secreto.' }],
    personajes, pistas,
    chat_whatsapp: [{ id_chat: 1, nombre: 'Lucía' }, { id_chat: 2, nombre: 'Tomás' }, { id_chat: 3, nombre: 'Carolina · Trabajo' }],
    mensaje: [
      { id_mensaje: 1, id_chat: 1, id_personaje: 2, contenido: '¿Cenamos juntos el 12 de octubre?', fecha_hora: '2026-09-27T18:10:00', es_pista: false },
      { id_mensaje: 2, id_chat: 1, id_personaje: 1, contenido: 'No puedo, tengo que quedarme trabajando esa noche.', fecha_hora: '2026-09-27T18:12:00', es_pista: true, id_pista: 2 },
      { id_mensaje: 3, id_chat: 2, id_personaje: 1, contenido: 'El 12 voy al Hotel Aurora con Valentina. Si Lucía pregunta, ¿me cubrís con lo del trabajo?', fecha_hora: '2026-09-28T10:00:00', es_pista: true, id_pista: 3 },
      { id_mensaje: 4, id_chat: 2, id_personaje: 4, contenido: 'No me metas en eso. Hablalo con ella.', fecha_hora: '2026-09-28T10:03:00', es_pista: false },
      { id_mensaje: 5, id_chat: 3, id_personaje: 5, contenido: 'Reunión de equipo el 30 a las 10.', fecha_hora: '2026-09-28T09:00:00', es_pista: false }
    ],
    perfil_instagram: personajes.slice(0, 4).map((p, i) => ({ id_perfil: p.id_personaje, id_personaje: p.id_personaje, usuario: ['martin.r', 'lucia.m', 'valen.s', 'tomas.g'][i], foto_perfil: p.foto })),
    publicacion: [
      { id_publicacion: 1, id_perfil: 1, contenido: 'Un café para arrancar.', imagen: img('Café de la mañana'), fecha_hora: '2026-09-26T08:30:00' },
      { id_publicacion: 2, id_perfil: 3, contenido: 'Hay lugares a los que siempre quiero volver.', imagen: img('Terraza del Aurora'), fecha_hora: '2026-09-27T19:00:00' }
    ],
    actividad_instagram: [
      { id_actividad: 1, id_perfil: 1, id_publicacion: 2, tipo: 'me_gusta', descripcion: 'martin.r indicó que le gusta la publicación de valen.s.', fecha_hora: '2026-09-27T19:10:00' },
      { id_actividad: 2, id_perfil: 4, id_publicacion: 1, tipo: 'comentario', descripcion: 'tomas.g: ¡Invitá uno!', fecha_hora: '2026-09-26T09:00:00' }
    ],
    chat_instagram: [{ id_chat_ig: 1, id_perfil: 3 }],
    mensaje_instagram: [
      { id_mensaje_ig: 1, id_chat_ig: 1, id_perfil: 3, contenido: '¿Seguimos con el plan del 12? Prefiero que quede entre nosotros.', fecha_hora: '2026-09-27T21:00:00', es_pista: true, id_pista: 1 },
      { id_mensaje_ig: 2, id_chat_ig: 1, id_perfil: 1, contenido: 'Sí, ya reservé.', fecha_hora: '2026-09-27T21:04:00', es_pista: false }
    ],
    contacto: personajes.slice(1).map((p, i) => ({ id_contacto: i + 1, id_personaje: p.id_personaje, nombre: p.nombre, numero: '+54 11 5550 010' + (i + 1), foto: p.foto })),
    llamada: [
      { id_llamada: 1, id_contacto: 2, tipo: 'saliente', duracion: 245, fecha_hora: '2026-09-28T09:30:00' },
      { id_llamada: 2, id_contacto: 1, tipo: 'entrante', duracion: 92, fecha_hora: '2026-09-27T20:00:00' },
      { id_llamada: 3, id_contacto: 3, tipo: 'perdida', duracion: 0, fecha_hora: '2026-09-27T17:20:00' }
    ],
    nota: [
      { id_nota: 1, titulo: 'Compras', contenido: 'Café, pan, detergente.', fecha: '2026-09-25' },
      { id_nota: 2, titulo: 'Pendientes', contenido: 'Entregar informe. Retirar camisa. Confirmar transporte para el 12.', fecha: '2026-09-28' }
    ],
    evento_calendario: [
      { id_evento: 1, titulo: 'Reunión de equipo', fecha: '2026-09-30', hora: '10:00', descripcion: 'Presentar informe mensual.', es_pista: false },
      { id_evento: 2, titulo: 'Reserva · Aurora', fecha: '2026-10-12', hora: '20:30', descripcion: 'Cena para dos con Valentina. Hotel Aurora, terraza.', es_pista: true, id_pista: 5 },
      { id_evento: 3, titulo: 'Dentista', fecha: '2026-10-15', hora: '09:00', descripcion: 'Control anual.', es_pista: false }
    ],
    ubicacion: [
      { id_ubicacion: 1, nombre: 'Casa', direccion: 'Los Olmos 145 (ficticia)' },
      { id_ubicacion: 2, nombre: 'Oficina', direccion: 'Avenida Central 420 (ficticia)' },
      { id_ubicacion: 3, nombre: 'Hotel Aurora', direccion: 'Avenida del Río 820 (ficticia)' },
      { id_ubicacion: 4, nombre: 'Café de la plaza', direccion: 'Calle del Parque 30 (ficticia)' }
    ],
    email: [
      { id_email: 1, remitente: 'equipo@oficina.example', asunto: 'Reunión del 30 de septiembre', contenido: 'La reunión será a las 10:00. Traer el informe mensual.', fecha_hora: '2026-09-28T08:00:00' },
      { id_email: 2, remitente: 'tienda@compras.example', asunto: 'Tu pedido está en camino', contenido: 'Entrega estimada para el 29 de septiembre.', fecha_hora: '2026-09-27T12:00:00' }
    ],
    foto: [
      { id_foto: 1, archivo: img('Martín y Valentina · Aurora'), descripcion: 'Martín y Valentina juntos en la terraza del Hotel Aurora.', fecha_hora: '2026-09-20T21:15:00', es_pista: true, id_pista: 4 },
      { id_foto: 2, archivo: img('Parque'), descripcion: 'Paseo por el parque.', fecha_hora: '2026-09-21T16:00:00', es_pista: false },
      { id_foto: 9, archivo: img('Aurora · 12/10 · 20:30 · 2 personas'), descripcion: 'Reserva a nombre de Martín: Hotel Aurora, 12 de octubre de 2026, 20:30, dos personas.', fecha_hora: '2026-09-28T09:45:00', es_pista: true, id_pista: 4 }
    ],
    preguntas: [
      { id_pregunta: 1, id_caso: 1, pregunta: '¿Con quién planea reunirse Martín?', opciones: [{ id_opcion: 'a', texto: 'Carolina' }, { id_opcion: 'b', texto: 'Valentina' }, { id_opcion: 'c', texto: 'Tomás' }], respuesta_correcta: 'b', pistas: [1, 3, 5], conclusion: 'Los mensajes y la reserva identifican a Valentina.' },
      { id_pregunta: 2, id_caso: 1, pregunta: '¿Dónde será el encuentro?', opciones: [{ id_opcion: 'a', texto: 'La oficina' }, { id_opcion: 'b', texto: 'El café' }, { id_opcion: 'c', texto: 'Hotel Aurora' }], respuesta_correcta: 'c', pistas: [3, 4, 5], conclusion: 'El chat, las fotos y el calendario coinciden en el Aurora.' },
      { id_pregunta: 3, id_caso: 1, pregunta: '¿Cuándo será el encuentro?', opciones: [{ id_opcion: 'a', texto: '12 de octubre de 2026, 20:30' }, { id_opcion: 'b', texto: '30 de septiembre, 10:00' }, { id_opcion: 'c', texto: '15 de octubre, 09:00' }], respuesta_correcta: 'a', pistas: [4, 5], conclusion: 'La reserva y el calendario confirman fecha y hora.' },
      { id_pregunta: 4, id_caso: 1, pregunta: '¿Qué excusa le dio a Lucía?', opciones: [{ id_opcion: 'a', texto: 'Turno con el dentista' }, { id_opcion: 'b', texto: 'Quedarse trabajando' }, { id_opcion: 'c', texto: 'Un partido' }], respuesta_correcta: 'b', pistas: [2, 3], conclusion: 'Martín usó el trabajo como excusa y pidió que Tomás lo cubriera.' }
    ],
    conclusiones: { completa: 'Martín planea una cena secreta con Valentina el 12 de octubre de 2026 a las 20:30 en el Hotel Aurora. Dijo a Lucía que estaría trabajando y pidió a Tomás que lo cubriera.', incompleta: 'Contrastá tus respuestas con los mensajes, las fotos y el calendario.' }
  };
  C.data = Object.assign(C.data || {}, datos);
})(globalThis);
