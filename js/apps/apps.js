'use strict';
/* ============================================================
   APPS.JS — aplicaciones del teléfono de Martín
   Estructura según Etapa 12 (diseño), Etapa 13 (datos) y Etapa 14 (arquitectura).
   Se carga DESPUÉS de script.js: usa Caught.data, Caught.ui y Caught.apps.

   Cada aplicación se registra como Caught.apps.<id> con esta interfaz
   (la que espera Caught.main en script.js):
     render()        → devuelve el HTML de la app (se monta en #app-view)
     handle(a, v)    → recibe los clics de botones con data-action="a" data-value="v"
     input(el)       → recibe los eventos "input" (buscadores y campos de texto)
     reset()         → vuelve al estado inicial cuando se reinicia la partida
   Las pistas se abren con U.evidence(id) / U.message(): el botón
   "Revisar evidencia" ya está resuelto en script.js (acción "clue").
   ============================================================ */
(function () {
  const A = Caught.apps, U = Caught.ui, D = Caught.data, esc = U.escape;
  const MARTIN = 1;                       // id_personaje / id_perfil de Martín (dueño del teléfono)

  /* ---------- Utilidades compartidas ---------- */
  const byDateDesc = (a, b) => String(b.fecha_hora || '').localeCompare(String(a.fecha_hora || ''));
  const byDateAsc = (a, b) => String(a.fecha_hora || '').localeCompare(String(b.fecha_hora || ''));
  const mmss = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  const stamp = v => v ? `${U.date(v)} · ${U.time(v)}` : 'Sin fecha';
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const matches = (q, ...fields) => !q || fields.some(f => norm(f).includes(norm(q)));
  const empty = text => `<p class="empty-state">${esc(text)}</p>`;
  const listBox = html => `<div class="app-scroll" data-list>${html}</div>`;
  const scroll = html => `<div class="app-scroll">${html}</div>`;
  const searchBox = (placeholder, value = '') => `<label class="app-search"><span aria-hidden="true">⌕</span><input type="search" data-search placeholder="${esc(placeholder)}" value="${esc(value)}" autocomplete="off"></label>`;
  // Cabecera con flecha "volver" a la vista anterior de la propia app (acción "back").
  const back = (title, sub) => `<header class="app-header">${U.button('back', U.icon('volver'), '', 'icon-button')}<div><h2>${esc(title)}</h2>${sub ? `<small>${esc(sub)}</small>` : ''}</div></header>`;
  const tabs = (items, current, cls = '') => `<nav class="app-tabs ${cls}">${items.map(([id, label, ico]) => `<button type="button" class="${id === current ? 'active' : ''}" data-action="tab" data-value="${id}">${ico ? `<span aria-hidden="true">${ico}</span><small>${label}</small>` : label}</button>`).join('')}</nav>`;
  const redrawList = app => { const el = U.$('#app-view [data-list]'); if (el) el.innerHTML = app.list(); };
  // Registra una app con su estado inicial; reset() lo restaura.
  const define = (id, initial, api) => (A[id] = { state: initial(), reset() { this.state = initial(); }, handle() {}, ...api });
  // Input común de los buscadores: filtra solo la lista (no vuelve a dibujar la app, así no se pierde el foco).
  const onSearch = function (el) { if (el.matches('[data-search]')) { this.state.q = el.value; redrawList(this); } };

  /* ============================================================
     WHATSAPP — chat_whatsapp + mensaje (pistas 2 y 3)
     ============================================================ */
  define('whatsapp', () => ({ chat: null, q: '' }), {
    chats() {
      return D.chat_whatsapp.map(c => {
        const msgs = D.mensaje.filter(m => m.id_chat === c.id_chat).sort(byDateDesc);
        const other = msgs.find(m => m.id_personaje !== MARTIN);
        return { c, last: msgs[0], who: U.person(other && other.id_personaje) };
      }).sort((a, b) => byDateDesc(a.last || {}, b.last || {}));
    },
    list() {
      const rows = this.chats().filter(x => matches(this.state.q, x.c.nombre, x.last && x.last.contenido));
      return rows.map(x => U.row('open', x.c.id_chat, x.c.nombre, x.last ? x.last.contenido : '', U.avatar(x.who))).join('') || empty('Sin resultados.');
    },
    render() {
      const s = this.state;
      if (s.chat !== null) {
        const c = D.chat_whatsapp.find(x => x.id_chat === s.chat);
        const msgs = D.mensaje.filter(m => m.id_chat === s.chat).sort(byDateAsc);
        return `${back(c.nombre)}${scroll(`<div class="thread">${msgs.map(m => U.message(m, m.id_personaje === MARTIN)).join('')}</div>`)}<div class="chat-input" aria-hidden="true">Mensaje…</div>`;
      }
      return `${U.header('WhatsApp', `${D.chat_whatsapp.length} conversaciones`)}${searchBox('Buscar conversación', s.q)}${listBox(this.list())}`;
    },
    handle(a, v) {
      if (a === 'open') this.state.chat = Number(v);
      else if (a === 'back') { this.state.chat = null; this.state.q = ''; }
      else return;
      U.refresh();
    },
    input: onSearch
  });

  /* ============================================================
     INSTAGRAM — perfil, publicación, actividad, chat y mensaje (pista 1)
     ============================================================ */
  const igProfile = id => D.perfil_instagram.find(p => p.id_perfil === Number(id));
  const igAvatar = p => p ? `<img class="avatar" src="${p.foto_perfil}" alt="${esc(p.usuario)}">` : '';
  const igLikes = id => D.actividad_instagram.filter(a => a.id_publicacion === id && a.tipo === 'me_gusta').length;
  const igComments = id => D.actividad_instagram.filter(a => a.id_publicacion === id && a.tipo === 'comentario');
  const igPost = p => {
    const u = igProfile(p.id_perfil);
    return `<article class="real-post"><header><button type="button" class="post-user" data-action="profile" data-value="${u.id_perfil}">${igAvatar(u)}${esc(u.usuario)}</button><small>${stamp(p.fecha_hora)}</small></header>${p.imagen ? `<img class="post-photo" src="${p.imagen}" alt="Publicación de ${esc(u.usuario)}">` : ''}<div class="post-copy"><span class="like-button" aria-hidden="true">♡</span> <small>${igLikes(p.id_publicacion)} me gusta</small><p><b>${esc(u.usuario)}</b> ${esc(p.contenido)}</p>${igComments(p.id_publicacion).map(c => `<small>${esc(c.descripcion)}</small>`).join('')}</div></article>`;
  };
  define('instagram', () => ({ tab: 'home', chat: null, profile: null }), {
    posts: () => D.publicacion.slice().sort(byDateDesc),
    home() {
      const strip = D.perfil_instagram.map(p => `<button type="button" data-action="profile" data-value="${p.id_perfil}">${igAvatar(p)}<small>${esc(p.usuario)}</small></button>`).join('');
      return `<div class="profile-strip">${strip}</div>${this.posts().map(igPost).join('')}`;
    },
    explore() {
      return `<div class="ig-grid">${this.posts().filter(p => p.imagen).map(p => `<button type="button" data-action="profile" data-value="${p.id_perfil}"><img src="${p.imagen}" alt="Publicación de ${esc(igProfile(p.id_perfil).usuario)}"></button>`).join('')}</div>`;
    },
    messages() {
      const rows = D.chat_instagram.map(c => {
        const last = D.mensaje_instagram.filter(m => m.id_chat_ig === c.id_chat_ig).sort(byDateDesc)[0];
        return { c, last, u: igProfile(c.id_perfil) };
      }).sort((a, b) => byDateDesc(a.last, b.last));
      return rows.map(x => U.row('open', x.c.id_chat_ig, x.u.usuario, x.last.contenido, igAvatar(x.u))).join('');
    },
    activity() {
      return D.actividad_instagram.slice().sort(byDateDesc).map(a => `<div class="content-row">${igAvatar(igProfile(a.id_perfil))}<span><b>${esc(a.descripcion)}</b><small>${stamp(a.fecha_hora)}</small></span></div>`).join('');
    },
    profileView(id) {
      const u = igProfile(id), mine = this.posts().filter(p => p.id_perfil === u.id_perfil);
      return `<div class="profile-card">${igAvatar(u)}<h3>@${esc(u.usuario)}</h3><p>${mine.length} publicaciones</p></div>${mine.map(igPost).join('') || empty('Sin publicaciones.')}`;
    },
    render() {
      const s = this.state;
      if (s.chat !== null) {
        const c = D.chat_instagram.find(x => x.id_chat_ig === s.chat), u = igProfile(c.id_perfil);
        const msgs = D.mensaje_instagram.filter(m => m.id_chat_ig === s.chat).sort(byDateAsc);
        return `${back(u.usuario, 'Mensaje directo')}${scroll(`<div class="thread">${msgs.map(m => U.message(m, m.id_perfil === MARTIN)).join('')}</div>`)}`;
      }
      if (s.profile !== null) return `${back('Perfil')}${scroll(this.profileView(s.profile))}`;
      const view = { home: () => this.home(), search: () => this.explore(), messages: () => this.messages(), activity: () => this.activity(), me: () => this.profileView(MARTIN) }[s.tab]();
      const title = { home: 'Instagram', search: 'Buscar', messages: 'Mensajes', activity: 'Actividad', me: 'Perfil' }[s.tab];
      return `${U.header(title)}${scroll(view)}${tabs([['home', 'Inicio', '⌂'], ['search', 'Buscar', '⌕'], ['messages', 'Mensajes', '✉'], ['activity', 'Actividad', '♡'], ['me', 'Perfil', '☺']], s.tab, 'instagram-tabs')}`;
    },
    handle(a, v) {
      const s = this.state;
      if (a === 'tab') { s.tab = v; s.chat = null; s.profile = null; }
      else if (a === 'open') s.chat = Number(v);
      else if (a === 'profile') s.profile = Number(v);
      else if (a === 'back') { if (s.chat !== null) s.chat = null; else s.profile = null; }
      else return;
      U.refresh();
    }
  });

  /* ============================================================
     TELÉFONO — llamada + contacto (Llamadas / Contactos / Teclado)
     ============================================================ */
  const contact = id => D.contacto.find(c => c.id_contacto === Number(id));
  const callInfo = c => {
    const kind = { saliente: '↗ Saliente', entrante: '↙ Entrante', perdida: '✕ Perdida' }[c.tipo];
    return `${kind} · ${stamp(c.fecha_hora)}${c.duracion ? ` · ${mmss(c.duracion)}` : ''}`;
  };
  define('phone', () => ({ tab: 'recents', q: '', contact: null, dial: '' }), {
    avatarOf: c => `<img class="avatar" src="${c.foto}" alt="${esc(c.nombre)}">`,
    list() {
      const s = this.state;
      if (s.tab === 'recents') {
        return D.llamada.slice().sort(byDateDesc).filter(l => matches(s.q, contact(l.id_contacto).nombre))
          .map(l => { const c = contact(l.id_contacto); return U.row('contact', c.id_contacto, c.nombre, callInfo(l), this.avatarOf(c)); }).join('') || empty('Sin resultados.');
      }
      return D.contacto.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')).filter(c => matches(s.q, c.nombre, c.numero))
        .map(c => U.row('contact', c.id_contacto, c.nombre, c.numero, this.avatarOf(c))).join('') || empty('Sin resultados.');
    },
    keypad() {
      const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
      return `<div class="dial-display">${esc(this.state.dial) || '&nbsp;'}</div><div class="dial-pad">${keys.map(k => U.button('dial', k, k)).join('')}</div><div class="dial-actions">${U.button('call', '📞', '', 'dial-call')}${U.button('dial', '⌫', 'del', 'dial-del')}</div>`;
    },
    detail(id) {
      const c = contact(id), calls = D.llamada.filter(l => l.id_contacto === c.id_contacto).sort(byDateDesc);
      const acts = [['Mensaje', '✉'], ['Llamar', '📞'], ['Video', '▶'], ['Correo', '@']].map(([n, i]) => U.button('unavailable', `<span>${i}</span>${n}`, n)).join('');
      return `<div class="profile-card"><img class="avatar" src="${c.foto}" alt="${esc(c.nombre)}"><h3>${esc(c.nombre)}</h3><p>${esc(c.numero)}</p></div><div class="contact-actions">${acts}</div><h3>Llamadas</h3>${calls.map(l => `<div class="content-row"><span><b>${esc(callInfo(l))}</b></span></div>`).join('') || empty('Sin llamadas con este contacto.')}`;
    },
    render() {
      const s = this.state;
      if (s.contact !== null) return `${back('Contacto')}${scroll(this.detail(s.contact))}`;
      const title = { recents: 'Llamadas', contacts: 'Contactos', keypad: 'Teclado' }[s.tab];
      const body = s.tab === 'keypad' ? scroll(this.keypad()) : `${searchBox(s.tab === 'recents' ? 'Buscar en llamadas' : 'Buscar contacto', s.q)}${listBox(this.list())}`;
      return `${U.header(title)}${body}${tabs([['recents', 'Llamadas'], ['contacts', 'Contactos'], ['keypad', 'Teclado']], s.tab)}`;
    },
    handle(a, v) {
      const s = this.state;
      if (a === 'tab') { s.tab = v; s.q = ''; }
      else if (a === 'contact') s.contact = Number(v);
      else if (a === 'back') s.contact = null;
      else if (a === 'dial') s.dial = v === 'del' ? s.dial.slice(0, -1) : (s.dial + v).slice(0, 18);
      else if (a === 'call' || a === 'unavailable') { U.toast('Función no disponible en la simulación.'); return; }
      else return;
      U.refresh();
    },
    input: onSearch
  });

  /* ============================================================
     GALERÍA — foto (pista 4: fotos 1 y 9)
     ============================================================ */
  define('gallery', () => ({ photo: null }), {
    render() {
      if (this.state.photo !== null) {
        const f = D.foto.find(x => x.id_foto === this.state.photo);
        const note = f.es_pista ? `<p>${esc(f.descripcion)}</p>${U.evidence(f.id_pista)}` : '';
        return `${back('Foto')}<div class="app-scroll gallery-real-detail"><img class="photo-detail" src="${f.archivo}" alt="Fotografía de la galería"><div class="photo-meta"><div><small>Fecha</small><b>${U.date(f.fecha_hora)}</b></div><div><small>Hora</small><b>${U.time(f.fecha_hora) || '—'}</b></div></div>${note}</div>`;
      }
      const tiles = D.foto.slice().sort(byDateDesc).map(f => `<button type="button" class="tile" data-action="photo" data-value="${f.id_foto}" aria-label="Abrir foto"><img src="${f.archivo}" alt=""></button>`).join('');
      return `${U.header('Galería', `${D.foto.length} elementos`)}<div class="gallery-layout real-gallery">${tiles}</div>`;
    },
    handle(a, v) {
      if (a === 'photo') this.state.photo = Number(v);
      else if (a === 'back') this.state.photo = null;
      else return;
      U.refresh();
    }
  });

  /* ============================================================
     EMAIL — email (distractores)
     ============================================================ */
  define('email', () => ({ mail: null, q: '' }), {
    list() {
      const rows = D.email.slice().sort(byDateDesc).filter(m => matches(this.state.q, m.asunto, m.remitente, m.contenido));
      return rows.map(m => U.row('open', m.id_email, m.asunto, `${m.remitente} · ${U.date(m.fecha_hora)}`)).join('') || empty('Sin resultados.');
    },
    render() {
      const s = this.state;
      if (s.mail !== null) {
        const m = D.email.find(x => x.id_email === s.mail);
        return `${back('Correo')}${scroll(`<h3>${esc(m.asunto)}</h3><p class="email-sender">De: ${esc(m.remitente)}</p><small>${stamp(m.fecha_hora)}</small><p class="email-body">${esc(m.contenido)}</p>`)}`;
      }
      return `${U.header('Correo', `${D.email.length} mensajes`)}${searchBox('Buscar correo', s.q)}${listBox(this.list())}`;
    },
    handle(a, v) {
      if (a === 'open') this.state.mail = Number(v);
      else if (a === 'back') { this.state.mail = null; this.state.q = ''; }
      else return;
      U.refresh();
    },
    input: onSearch
  });

  /* ============================================================
     MAPA — ubicación (esquemático, sin geolocalización real)
     ============================================================ */
  define('map', () => ({ place: null }), {
    pos: [[48, 52], [24, 30], [72, 34], [38, 76]],       // posición de cada pin en % (solo decorativo)
    render() {
      const sel = this.state.place;
      const pins = D.ubicacion.map((u, i) => `<button type="button" class="map-pin ${u.id_ubicacion === sel ? 'selected' : ''}" style="left:${this.pos[i % 4][0]}%;top:${this.pos[i % 4][1]}%" data-action="place" data-value="${u.id_ubicacion}" aria-label="${esc(u.nombre)}">${i + 1}</button>`).join('');
      const p = D.ubicacion.find(u => u.id_ubicacion === sel);
      const card = p ? `<div class="place-card"><b>${esc(p.nombre)}</b><p>${esc(p.direccion)}</p></div>` : empty('Tocá un lugar guardado.');
      return `${U.header('Mapa', 'Lugares guardados')}${scroll(`<div class="case-map">${pins}</div>${card}${D.ubicacion.map(u => U.row('place', u.id_ubicacion, u.nombre, u.direccion)).join('')}`)}`;
    },
    handle(a, v) { if (a === 'place') { this.state.place = Number(v); U.refresh(); } }
  });

  /* ============================================================
     CALENDARIO — evento_calendario (pista 5: reserva del 12/10)
     ============================================================ */
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  define('calendar', () => ({ y: 2026, m: 8, sel: null }), {      // arranca en septiembre de 2026 (mes del caso)
    render() {
      const { y, m, sel } = this.state, ev = D.evento_calendario;
      const key = d => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const offset = (new Date(y, m, 1).getDay() + 6) % 7, total = new Date(y, m + 1, 0).getDate();
      let cells = '<span></span>'.repeat(offset);
      for (let d = 1; d <= total; d++) cells += `<button type="button" class="cal-day ${ev.some(e => e.fecha === key(d)) ? 'has-event' : ''} ${sel === key(d) ? 'selected' : ''}" data-action="day" data-value="${key(d)}">${d}</button>`;
      const shown = ev.filter(e => e.fecha === sel);
      const detail = sel
        ? (shown.map(e => `<div class="event-card"><b>${esc(e.titulo)}</b><p>${U.date(e.fecha)} · ${e.hora}</p><p>${esc(e.descripcion || 'Sin descripción')}</p>${e.es_pista ? U.evidence(e.id_pista) : ''}</div>`).join('') || empty('Sin eventos este día.'))
        : `<h3>Próximos eventos</h3>${ev.map(e => U.row('event', e.fecha, e.titulo, `${U.date(e.fecha)} · ${e.hora}`)).join('')}`;
      return `${U.header('Calendario')}${scroll(`<div class="cal-nav">${U.button('prev', '‹')}<b>${MESES[m]} ${y}</b>${U.button('next', '›')}</div><div class="cal-week">${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => `<span>${d}</span>`).join('')}</div><div class="cal-grid">${cells}</div>${detail}`)}`;
    },
    handle(a, v) {
      const s = this.state;
      if (a === 'prev' || a === 'next') { s.m += a === 'next' ? 1 : -1; if (s.m < 0) { s.m = 11; s.y--; } if (s.m > 11) { s.m = 0; s.y++; } s.sel = null; }
      else if (a === 'day') s.sel = v;
      else if (a === 'event') { s.sel = v; s.y = Number(v.slice(0, 4)); s.m = Number(v.slice(5, 7)) - 1; }
      else return;
      U.refresh();
    }
  });

  /* ============================================================
     NOTAS — nota (editable durante la sesión, sin guardado permanente)
     ============================================================ */
  define('notes', () => ({ open: null, extra: [], edits: {} }), {
    all() {
      return D.nota.concat(this.state.extra).map(n => ({ ...n, ...(this.state.edits[n.id_nota] || {}) }))
        .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
    },
    render() {
      const s = this.state;
      if (s.open !== null) {
        const n = this.all().find(x => x.id_nota === s.open);
        return `${back('Nota', U.date(n.fecha))}${scroll(`<div class="note-editor"><label>Título<input data-field="titulo" value="${esc(n.titulo)}"></label><label>Contenido<textarea data-field="contenido" rows="8">${esc(n.contenido)}</textarea></label></div>`)}`;
      }
      const list = this.all();
      return `${U.header('Notas', `${list.length} notas`)}${scroll(list.map(n => U.row('open', n.id_nota, n.titulo, `${n.contenido} · ${U.date(n.fecha)}`)).join(''))}<div class="notes-tools">${U.button('add', '+ Nueva nota', '', 'text-button')}</div>`;
    },
    handle(a, v) {
      const s = this.state;
      if (a === 'open') s.open = Number(v);
      else if (a === 'back') s.open = null;
      else if (a === 'add') { const id = 100 + s.extra.length; s.extra.push({ id_nota: id, titulo: 'Nueva nota', contenido: '', fecha: new Date().toISOString().slice(0, 10) }); s.open = id; }
      else return;
      U.refresh();
    },
    input(el) { const f = el.dataset.field; if (f && this.state.open !== null) (this.state.edits[this.state.open] ||= {})[f] = el.value; }
  });

  /* ============================================================
     CALCULADORA — operaciones básicas, sin eval()
     ============================================================ */
  const KEYS = ['AC', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '⌫', '='];
  const calc = (a, op, b) => op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : (b === 0 ? NaN : a / b);
  const fmt = n => Number.isFinite(n) ? String(parseFloat(n.toPrecision(10))) : 'Error';
  define('calculator', () => ({ cur: '0', acc: null, op: null, fresh: true }), {
    render() {
      return `${U.header('Calculadora')}<div class="functional-calculator"><output>${esc(this.state.cur.replace('.', ','))}</output><div>${KEYS.map(k => U.button('key', k, k)).join('')}</div></div>`;
    },
    handle(a, k) {
      if (a !== 'key') return;
      const s = this.state;
      if (s.cur === 'Error' && k !== 'AC') Object.assign(s, { cur: '0', acc: null, op: null, fresh: true });
      if (/^\d$/.test(k)) { s.cur = s.fresh || s.cur === '0' ? k : (s.cur.length < 12 ? s.cur + k : s.cur); s.fresh = false; }
      else if (k === '.') { if (s.fresh) { s.cur = '0.'; s.fresh = false; } else if (!s.cur.includes('.')) s.cur += '.'; }
      else if (k === 'AC') Object.assign(s, { cur: '0', acc: null, op: null, fresh: true });
      else if (k === '⌫') s.cur = s.cur.length > 1 && s.cur !== '-0' ? s.cur.slice(0, -1) : '0';
      else if (k === '±') s.cur = s.cur === '0' ? '0' : (s.cur.startsWith('-') ? s.cur.slice(1) : '-' + s.cur);
      else if (k === '%') s.cur = fmt(Number(s.cur) / 100);
      else if (k === '=') { if (s.op) { s.cur = fmt(calc(s.acc, s.op, Number(s.cur))); s.acc = null; s.op = null; s.fresh = true; } }
      else {                                                           // operadores ÷ × − +
        if (s.op && !s.fresh) { s.cur = fmt(calc(s.acc, s.op, Number(s.cur))); }
        s.acc = Number(s.cur); s.op = s.cur === 'Error' ? null : k; s.fresh = true;
      }
      U.refresh();
    }
  });

  /* ============================================================
     AJUSTES — interruptores y Tiempo en pantalla (usa Caught.game.usage)
     ============================================================ */
  const APP_NAMES = { gallery: 'Galería', phone: 'Teléfono', whatsapp: 'WhatsApp' };
  Caught.main.appList.forEach(([id, name]) => { APP_NAMES[id] = name; });
  define('settings', () => ({ view: 'main', on: { avion: false, wifi: true, bluetooth: false } }), {
    render() {
      const s = this.state;
      if (s.view === 'usage') {
        const rows = Object.keys(APP_NAMES).map(id => [id, Caught.game.usage(id)]).filter(r => r[1] >= 1).sort((a, b) => b[1] - a[1]);
        const total = rows.reduce((t, r) => t + r[1], 0);
        return `${back('Tiempo en pantalla', `Total de esta sesión: ${mmss(total)}`)}${scroll(`<h3>Más usados</h3>${rows.map(r => `<div class="usage-row"><span>${esc(APP_NAMES[r[0]])}</span><b>${mmss(r[1])}</b></div>`).join('') || empty('Todavía no hay uso registrado.')}`)}`;
      }
      const toggle = (k, label) => `<button type="button" class="settings-row" data-action="toggle" data-value="${k}" role="switch" aria-checked="${s.on[k]}"><span>${label}</span><i class="${s.on[k] ? 'on' : ''}"></i></button>`;
      return `${U.header('Ajustes')}${scroll(`${toggle('avion', 'Modo avión')}${toggle('wifi', 'Wi-Fi')}${toggle('bluetooth', 'Bluetooth')}${U.button('usage', '<span>Tiempo en pantalla</span><em>›</em>', '', 'settings-row')}`)}`;
    },
    handle(a, v) {
      const s = this.state;
      if (a === 'toggle') s.on[v] = !s.on[v];
      else if (a === 'usage') s.view = 'usage';
      else if (a === 'back') s.view = 'main';
      else return;
      U.refresh();
    }
  });
})();