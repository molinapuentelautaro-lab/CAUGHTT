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
      return `<div class="dial-display">${esc(this.state.dial) || '&nbsp;'}</div><div class="dial-pad">${keys.map(k => U.button('dial', k, k)).join('')}</div><div class="dial-actions">${U.button('call', '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 2.5 10 7.6 7.8 10c1.5 3 3.2 4.7 6.2 6.2l2.4-2.2 5.1 3.4c-.4 3.4-2.8 4-5.2 3.2C9.4 18.3 5.7 14.6 3.4 7.7 2.6 5.3 3.2 2.9 6.6 2.5Z"/></svg>', '', 'dial-call')}${U.button('dial', '⌫', 'del', 'dial-del')}</div>`;
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
  define('calculator', () => ({ cur: '0', acc: null, op: null, fresh: true, expression: '' }), {
    render() {
      return `${U.header('Calculadora')}<div class="functional-calculator"><small class="calc-expression" aria-label="Operación">${esc(this.state.expression || (this.state.op ? this.state.acc+' '+this.state.op+(this.state.fresh?'':' '+this.state.cur) : ''))}</small><output>${esc(this.state.cur.replace('.', ','))}</output><div>${KEYS.map(k => U.button('key', k, k)).join('')}</div></div>`;
    },
    handle(a, k) {
      if (a !== 'key') return;
      const s = this.state;
      if(k!=='=')s.expression='';
      if (s.cur === 'Error' && k !== 'AC') Object.assign(s, { cur: '0', acc: null, op: null, fresh: true, expression: '' });
      if (/^\d$/.test(k)) { s.cur = s.fresh || s.cur === '0' ? k : (s.cur.length < 12 ? s.cur + k : s.cur); s.fresh = false; }
      else if (k === '.') { if (s.fresh) { s.cur = '0.'; s.fresh = false; } else if (!s.cur.includes('.')) s.cur += '.'; }
      else if (k === 'AC') Object.assign(s, { cur: '0', acc: null, op: null, fresh: true, expression: '' });
      else if (k === '⌫') s.cur = s.cur.length > 1 && s.cur !== '-0' ? s.cur.slice(0, -1) : '0';
      else if (k === '±') s.cur = s.cur === '0' ? '0' : (s.cur.startsWith('-') ? s.cur.slice(1) : '-' + s.cur);
      else if (k === '%') s.cur = fmt(Number(s.cur) / 100);
      else if (k === '=') { if (s.op) { s.expression=s.acc+' '+s.op+' '+s.cur+' =';s.cur = fmt(calc(s.acc, s.op, Number(s.cur))); s.acc = null; s.op = null; s.fresh = true; } }
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
      const settingIcon = k => `<img class="settings-reference-icon" src="../img/interfaz/ajustes/${k}.png" alt="" aria-hidden="true">`;
      const toggle = (k, label) => `<button type="button" class="settings-row" data-action="toggle" data-value="${k}" role="switch" aria-checked="${s.on[k]}"><span class="settings-label">${settingIcon(k)}${label}</span><i class="${s.on[k] ? 'on' : ''}"></i></button>`;
      return `${U.header('Ajustes')}${scroll(`${toggle('avion', 'Modo avión')}${toggle('wifi', 'Wi-Fi')}${toggle('bluetooth', 'Bluetooth')}${U.button('usage', `<span class="settings-label">${settingIcon('tiempo')}Tiempo en pantalla</span><em>›</em>`, '', 'settings-row')}`)}`;
    },
    handle(a, v) {
      const s = this.state;
      if (a === 'toggle') {
        if (!Object.prototype.hasOwnProperty.call(s.on, v)) return;
        if (v === 'avion') {
          s.on.avion = !s.on.avion;
          if (s.on.avion) {
            s.beforeFlight = { wifi: s.on.wifi, bluetooth: s.on.bluetooth };
            s.on.wifi = false; s.on.bluetooth = false;
          } else if (s.beforeFlight) {
            s.on.wifi = s.beforeFlight.wifi; s.on.bluetooth = s.beforeFlight.bluetooth;
            delete s.beforeFlight;
          }
        } else s.on[v] = !s.on[v];
      }
      else if (a === 'usage') s.view = 'usage';
      else if (a === 'back') s.view = 'main';
      else return;
      U.refresh();
    }
  });
})();
/* ============================================================
   CORRECCIONES ETAPA 12: Instagram y navegación de WhatsApp.
   Se conservan los datos y el resto de las aplicaciones.
   ============================================================ */
(function () {
 const U=Caught.ui,D=Caught.data,A=Caught.apps,esc=U.escape;
 const vector=(body)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+body+'</svg>';
 const icons={
 home:vector('<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/>'),
 search:vector('<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>'),
 messages:vector('<path d="m3 4 18-1-5 18-5-8-8-9Z"/><path d="m11 13 10-10"/>'),
 activity:vector('<path d="M20 4c-3-2-6 0-8 3-2-3-5-5-8-3-6 5 1 12 8 17 7-5 14-12 8-17Z"/>'),
 me:vector('<circle cx="12" cy="7" r="4"/><path d="M4 21v-3c0-7 16-7 16 0v3"/>'),
 create:vector('<path d="M12 4v16M4 12h16"/>'),
 menu:vector('<path d="M3 5h18M3 12h18M3 19h18"/>')
 };
 // Instagram: la tira conserva scroll horizontal, sin la barra visible del navegador.
 const ig=A.instagram,oldHandle=ig.handle,oldRender=ig.render,oldReset=ig.reset;
 ig.reset=function(){oldReset.call(this);this.state.post=null;this.state.liked=new Set();};
 ig.state.post=null;ig.state.liked=new Set();
 ig.home=function(){
  const strip=D.perfil_instagram.map(p=>'<button class="ig-story" type="button" data-action="profile" data-value="'+p.id_perfil+'" aria-label="Ver perfil de '+esc(p.usuario)+'"><span class="ig-story-ring"><img src="'+p.foto_perfil+'" alt=""></span><small>'+esc(p.usuario)+'</small></button>').join('');
  return '<div class="profile-strip" aria-label="Perfiles de Instagram" tabindex="0">'+strip+'</div>'+this.posts().map(p=>this.postCard(p)).join('');
 };
 ig.postCard=function(p){
  const profile=D.perfil_instagram.find(x=>x.id_perfil===p.id_perfil);
  return '<article class="real-post"><header><button class="post-user" data-action="profile" data-value="'+profile.id_perfil+'"><img class="avatar" src="'+profile.foto_perfil+'" alt="">'+esc(profile.usuario)+'</button><span aria-hidden="true">•••</span></header>'+(p.imagen?'<img class="post-photo" src="'+p.imagen+'" alt="'+esc(p.contenido)+'">':'')+'<div class="post-copy"><div class="ig-post-actions"><button data-action="ig-like" data-value="'+p.id_publicacion+'" aria-label="Me gusta" aria-pressed="'+this.state.liked.has(p.id_publicacion)+'">'+(this.state.liked.has(p.id_publicacion)?'♥':icons.activity)+'</button><button data-action="ig-comments" data-value="'+p.id_publicacion+'" aria-label="Ver comentarios">'+vector('<path d="M21 11a9 9 0 1 0-16 6l-2 4 5-1a9 9 0 0 0 13-9Z"/>')+'</button><button data-action="tab" data-value="messages" aria-label="Mensajes">'+icons.messages+'</button></div><small>'+ (D.actividad_instagram.filter(a=>a.id_publicacion===p.id_publicacion&&a.tipo==='me_gusta').length+(this.state.liked.has(p.id_publicacion)?1:0))+' me gusta</small><p><b>'+esc(profile.usuario)+'</b> '+esc(p.contenido)+'</p>'+D.actividad_instagram.filter(a=>a.id_publicacion===p.id_publicacion&&a.tipo==='comentario').map(a=>'<small>'+esc(a.descripcion)+'</small>').join('')+'<small class="ig-post-date">'+U.date(p.fecha_hora)+'</small></div></article>';
 };
 ig.profileView=function(id){
  const p=D.perfil_instagram.find(x=>x.id_perfil===Number(id)),person=U.person(p.id_personaje),posts=this.posts().filter(x=>x.id_perfil===p.id_perfil);
  return '<div class="ig-real-summary"><img class="avatar" src="'+p.foto_perfil+'" alt="'+esc(p.usuario)+'"><div><b>'+posts.length+'</b><small>Publicaciones</small></div><div><b>—</b><small>Seguidores</small></div><div><b>—</b><small>Seguidos</small></div></div><div class="ig-profile-bio"><b>'+esc(person.nombre)+'</b><p>@'+esc(p.usuario)+'</p></div><div class="ig-grid-heading" aria-label="Publicaciones">▦</div><div class="ig-grid">'+posts.map(post=>'<button data-action="ig-post" data-value="'+post.id_publicacion+'" aria-label="Ver publicación">'+(post.imagen?'<img src="'+post.imagen+'" alt="'+esc(post.contenido)+'">':'<span>'+esc(post.contenido)+'</span>')+'</button>').join('')+'</div>';
 };
 ig.render=function(){
  if(this.state.post!==null){
   const post=D.publicacion.find(p=>p.id_publicacion===this.state.post);
   return '<header class="app-header">'+U.button('ig-post-back',U.icon('volver'),'','icon-button')+'<h2>Publicación</h2></header><div class="app-scroll">'+this.postCard(post)+'</div>';
  }
  if(this.state.tab==='create')this.state.tab='home';
  let html=oldRender.call(this);
  if(this.state.tab==='home'&&this.state.chat===null&&this.state.profile===null)html=html.replace('</header>','<button class="ig-header-activity" data-action="tab" data-value="activity" aria-label="Actividad y Me gusta">'+icons.activity+'</button></header>');
  // Reemplaza la navegación textual por íconos con etiquetas accesibles.
  html=html.replace(/<nav class="app-tabs instagram-tabs">[\s\S]*?<\/nav>/, '<nav class="app-tabs instagram-tabs" aria-label="Navegación de Instagram">'+[['home','Inicio'],['messages','Mensajes'],['create','Crear publicación'],['search','Buscar'],['me','Perfil']].map(([key,label])=>'<button data-action="tab" data-value="'+key+'" aria-label="'+label+'" class="'+(this.state.tab===key?'active':'')+'">'+icons[key]+'</button>').join('')+'</nav>');
  return html;
 };
 ig.handle=function(a,v){
  if(a==='tab'&&v==='create'){U.toast('Crear publicación');return;}
  if(a==='ig-post'||a==='ig-comments'){this.state.post=Number(v);U.refresh();return;}
  if(a==='ig-post-back'){this.state.post=null;U.refresh();return;}
  if(a==='ig-like'){v=Number(v);this.state.liked.has(v)?this.state.liked.delete(v):this.state.liked.add(v);U.refresh();return;}
  oldHandle.call(this,a,v);
 };
 // WhatsApp: historial propio. Nunca consulta D.llamada ni abre la app phone.
 // Si se agregan registros de WhatsApp, van en Caught.data.llamada_whatsapp.
 const wa=A.whatsapp,chatRender=wa.render,chatHandle=wa.handle,waReset=wa.reset;
 wa.reset=function(){waReset.call(this);this.state.tab='chats';this.state.call=null;};
 wa.state.tab='chats';wa.state.call=null;
 wa.render=function(){
  const s=this.state,records=D.llamada_whatsapp||[];
  if(s.chat!==null)return chatRender.call(this);
  if(s.call!==null){
   const c=records.find(x=>x.id_llamada===s.call),person=U.person(c.id_personaje);
   return '<header class="app-header">'+U.button('wa-call-back',U.icon('volver'),'','icon-button')+'<h2>Llamada de WhatsApp</h2></header><div class="app-scroll profile-card">'+U.avatar(person)+'<h3>'+esc(person?.nombre||c.nombre)+'</h3><p>'+esc(c.tipo)+' · '+U.date(c.fecha_hora)+' · '+U.time(c.fecha_hora)+'</p><p>'+(c.duracion==null?'Sin duración':c.duracion+' segundos')+'</p></div>';
  }
  let body;
  if(s.tab==='chats')body=chatRender.call(this);
  else if(s.tab==='calls')body=U.header('Llamadas','WhatsApp')+'<div class="app-scroll">'+(records.map(c=>U.row('wa-call',c.id_llamada,U.person(c.id_personaje)?.nombre||c.nombre,c.tipo+' · '+U.date(c.fecha_hora)+' '+U.time(c.fecha_hora),U.avatar(U.person(c.id_personaje)))).join('')||'<div class="wa-empty-calls"><span>'+vector('<path d="m5 3 4 5-3 3c2 4 3 5 7 7l3-3 5 4c-1 5-4 4-8 2C7 18 2 10 3 5Z"/>')+'</span><h3>No hay llamadas registradas</h3><p>El historial de llamadas de WhatsApp está vacío.</p></div>')+'</div>';
  else body=U.header('Configuración','WhatsApp')+'<div class="app-scroll"><div class="profile-card">'+U.avatar(U.person(1))+'<h3>Martín</h3></div>'+['Cuenta','Privacidad','Chats','Notificaciones','Almacenamiento'].map(label=>U.row('wa-setting',label,label,'Consultar')).join('')+'</div>';
  return body+'<nav class="app-tabs wa-local-tabs" aria-label="Navegación de WhatsApp">'+[['chats','Chats',vector('<path d="M21 11a9 9 0 1 0-16 6l-2 4 5-1a9 9 0 0 0 13-9Z"/>')],['calls','Llamadas',vector('<path d="m5 3 4 5-3 3c2 4 3 5 7 7l3-3 5 4c-1 5-4 4-8 2C7 18 2 10 3 5Z"/>')],['settings','Configuración',vector('<path d="m9 3 1-1h4l1 3 3 1 3 3-1 3 1 3-3 3-3 1-1 3h-4l-1-3-3-1-3-3 1-3-1-3 3-3 3-1Z"/><circle cx="12" cy="12" r="3"/>')]].map(([key,label,icon])=>'<button data-action="wa-tab" data-value="'+key+'" class="'+(s.tab===key?'active':'')+'"><span class="wa-tab-icon">'+icon+'</span><small>'+label+'</small></button>').join('')+'</nav>';
 };
 wa.handle=function(a,v){
  if(a==='wa-tab'){this.state.tab=v;this.state.chat=null;this.state.call=null;U.refresh();return;}
  if(a==='wa-call'){this.state.call=Number(v);U.refresh();return;}
  if(a==='wa-call-back'){this.state.call=null;U.refresh();return;}
  if(a==='wa-setting'){U.toast('Configuración de la cuenta del expediente.');return;}
  chatHandle.call(this,a,v);
 };
})();

/* MAPA — imagen original de etapa 12, buscador y cuatro ubicaciones recientes.
   Las ubicaciones pertenecen al expediente; no se solicita ubicación real. */
(function(){
 const U=Caught.ui,D=Caught.data,A=Caught.apps,e=U.escape;
 const icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg>';
 const m=A.map;
 m.reset=function(){this.state={place:null,search:false,q:''};};m.reset();
 m.recents=function(){return D.ubicacion.slice(-4).filter(p=>(p.nombre+' '+p.direccion).toLowerCase().includes(this.state.q.toLowerCase())).map(p=>'<button class="map12-recent" data-action="map-place" data-value="'+p.id_ubicacion+'"><span aria-hidden="true">◷</span><div><b>'+e(p.nombre)+'</b><small>'+e(p.direccion)+'</small></div></button>').join('')||'<p>No hay coincidencias.</p>';};
 m.render=function(){
 const p=D.ubicacion.find(p=>p.id_ubicacion===this.state.place);
 const points=[[50,47],[26,30],[73,62],[35,77]];
 const markers=D.ubicacion.slice(-4).map((u,i)=>'<button class="map12-marker '+(u.id_ubicacion===this.state.place?'selected':'')+'" style="left:'+points[i][0]+'%;top:'+points[i][1]+'%" data-action="map-place" data-value="'+u.id_ubicacion+'" aria-label="Ver '+e(u.nombre)+'"><span aria-hidden="true">●</span><b>'+e(u.nombre)+'</b></button>').join('');
 if(this.state.search)return '<div class="map12-searchscreen"><div class="map12-searchbar">'+U.button('map-back','‹','','map12-back')+'<label>'+icon+'<input data-field="map-query" aria-label="Buscar ubicación" placeholder="Buscar" value="'+e(this.state.q)+'"></label></div><h3>Recientes</h3><div class="app-scroll map12-recents">'+this.recents()+'</div></div>';
 return '<div class="map12-scene"><div class="map12-searchbar">'+U.button('close','×','','map12-back')+'<button class="map12-search" data-action="map-search">'+icon+'<span>Buscar</span></button>'+U.avatar(U.person(1))+'</div>'+markers+(p?'<div class="map12-place"><b>'+e(p.nombre)+'</b><p>'+e(p.direccion)+'</p>'+U.button('map-search','Ver ubicaciones recientes','','text-button')+'</div>':'')+'<button class="map12-home" data-action="map-place" data-value="1" aria-label="Ver Casa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/></svg></button></div>';
 };
 m.handle=function(a,v){if(a==='map-search'){this.state.search=true;this.state.q='';}else if(a==='map-back')this.state.search=false;else if(a==='map-place'){this.state.place=Number(v);this.state.search=false;}else return;U.refresh();};
 m.input=function(el){if(el.dataset.field==='map-query'){this.state.q=el.value;document.querySelector('.map12-recents').innerHTML=this.recents();}};
})();

/* INSTAGRAM — campo de escritura y mensajes de prueba durante la partida.
   Los mensajes nuevos se guardan en la sesión, separados de las evidencias. */
(function(){
 const U=Caught.ui,A=Caught.apps,e=U.escape,ig=A.instagram;
 const render=ig.render,handle=ig.handle,reset=ig.reset;
 ig.localMessages={};ig.drafts={};
 ig.reset=function(){reset.call(this);this.localMessages={};this.drafts={};};
 ig.render=function(){let html=render.call(this);if(this.state.chat===null)return html;
 const id=this.state.chat,extra=(this.localMessages[id]||[]).map(m=>U.message(m,true)).join('');
 html=html.replace('</div></div>',extra+'</div></div>');
 return html+'<div class="ig-compose"><label><input data-field="ig-draft" aria-label="Escribir mensaje" placeholder="Mensaje…" maxlength="1000" value="'+e(this.drafts[id]||'')+'"></label><button type="button" data-action="ig-send" aria-label="Enviar mensaje">Enviar</button></div>';
 };
 const oldInput=ig.input;
 ig.input=function(el){if(el.dataset.field==='ig-draft')this.drafts[this.state.chat]=el.value;else if(oldInput)oldInput.call(this,el);};
 ig.handle=function(a,v){if(a!=='ig-send')return handle.call(this,a,v);const id=this.state.chat;if(id===null)return;const text=(this.drafts[id]||'').trim();if(!text)return;(this.localMessages[id]||=[]).push({contenido:text,fecha_hora:Caught.ui.nextChatTime('instagram',id,this.localMessages[id])});this.drafts[id]='';U.refresh();const box=document.querySelector('#app-view .app-scroll');box.scrollTop=box.scrollHeight;document.querySelector('[data-field="ig-draft"]').focus();};
 document.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&!ev.isComposing&&ev.target.matches('[data-field="ig-draft"]')){ev.preventDefault();ig.handle('ig-send');}});
 /* AJUSTES — gráfico semanal y barras de uso con tiempos reales de la sesión.
    No se inventa actividad histórica para los otros días de la semana. */
 const settings=A.settings,settingsRender=settings.render;
 settings.render=function(){if(this.state.view!=='usage')return settingsRender.call(this);
 const names={gallery:'Galería',phone:'Teléfono',whatsapp:'WhatsApp',...Object.fromEntries(Caught.main.appList)};
 const rows=Object.entries(names).map(([id,name])=>({id,name,seconds:Math.floor(Caught.game.usage(id))})).filter(x=>x.seconds>0).sort((a,b)=>b.seconds-a.seconds);
 const total=rows.reduce((n,x)=>n+x.seconds,0),day=(new Date().getDay()+6)%7;
 const time=n=>Math.floor(n/60)+':'+String(n%60).padStart(2,'0');
 const bars=['L','M','M','J','V','S','D'].map((label,i)=>'<div><span class="usage12-bar" style="height:'+(i===day&&total?Math.min(100,total/300*100):0)+'%" title="'+(i===day?time(total):'0:00')+'"></span><small>'+label+'</small></div>').join('');
 const list=rows.map(x=>'<div class="usage12-row"><span class="usage12-icon" aria-hidden="true">'+e(x.name[0])+'</span><div><b>'+e(x.name)+'</b><div class="usage12-track"><i style="width:'+(x.seconds/Math.max(total,1)*100)+'%"></i></div></div><small>'+time(x.seconds)+'</small></div>').join('')||'<p>Todavía no hay uso registrado.</p>';
 return '<header class="app-header">'+U.button('back','‹ Ajustes','','text-button')+'<h2>Tiempo en pantalla</h2></header><div class="app-scroll usage12"><section class="usage12-chart"><small>Promedio diario</small><strong>'+time(total)+'</strong><div class="usage12-bars" aria-label="Uso semanal en esta partida">'+bars+'</div></section><h3>Más usados</h3><section class="usage12-list">'+list+'</section></div>';
 };
})();

/* WHATSAPP — escritura y envío de prueba en la sesión, como Instagram.
   Conserva los mensajes originales y las referencias a las pistas. */
(function(){const U=Caught.ui,w=Caught.apps.whatsapp,r=w.render,h=w.handle,i=w.input,reset=w.reset;
 w.localMessages={};w.drafts={};
 w.reset=function(){reset.call(this);this.localMessages={};this.drafts={};};
 w.render=function(){let html=r.call(this);if(this.state.chat===null)return html;const id=this.state.chat;
 const extra=(this.localMessages[id]||[]).map(m=>U.message(m,true)).join('');
 html=html.replace('</div></div>',extra+'</div></div>').replace(/<div class="chat-input"[^>]*>[\s\S]*?<\/div>/,'');
 const svg=path=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';
 const mic=svg('<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11v2a7 7 0 0 0 14 0v-2M12 20v2M9 22h6"/>');
 const send=svg('<path d="m3 3 18 9-18 9 4-9-4-9ZM7 12h14"/>');
 const active=!!(this.drafts[id]||'').trim();
 return html+'<div class="wa-compose ig-compose wa-reference-compose"><button class="wa-tool" data-action="wa-attach" aria-label="Adjuntar">'+svg('<path d="M12 4v16M4 12h16"/>')+'</button><label><input data-field="wa-draft" aria-label="Escribir mensaje" placeholder="Mensaje…" maxlength="1000" value="'+U.escape(this.drafts[id]||'')+'"><button class="wa-tool wa-sticker" data-action="wa-sticker" aria-label="Stickers">'+svg('<path d="M19 14V8a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h4l7-7ZM12 21v-4a3 3 0 0 1 3-3h4"/>')+'</button></label><button class="wa-tool wa-camera" data-action="wa-camera" aria-label="Cámara">'+svg('<path d="M3 7h4l2-3h6l2 3h4v14H3Z"/><circle cx="12" cy="13" r="4"/>')+'</button><button class="wa-primary" data-action="'+(active?'wa-send':'wa-mic')+'" aria-label="'+(active?'Enviar mensaje':'Mensaje de voz')+'"><span class="wa-mic-icon"'+(active?' hidden':'')+'>'+mic+'</span><span class="wa-send-icon"'+(active?'':' hidden')+'>'+send+'</span></button></div>';

 };
 w.input=function(el){if(el.dataset.field==='wa-draft'){this.drafts[this.state.chat]=el.value;const active=!!el.value.trim(),button=el.closest('.wa-compose').querySelector('.wa-primary');button.dataset.action=active?'wa-send':'wa-mic';button.setAttribute('aria-label',active?'Enviar mensaje':'Mensaje de voz');button.querySelector('.wa-mic-icon').hidden=active;button.querySelector('.wa-send-icon').hidden=!active;}else if(i)i.call(this,el);};
 w.handle=function(a,v){if(['wa-attach','wa-sticker','wa-camera','wa-mic'].includes(a)){U.toast('Esta función no está disponible en la investigación.');return;}if(a!=='wa-send')return h.call(this,a,v);const id=this.state.chat;if(id===null)return;const text=(this.drafts[id]||'').trim();if(!text)return;(this.localMessages[id]||=[]).push({contenido:text,fecha_hora:Caught.ui.nextChatTime('whatsapp',id,this.localMessages[id])});this.drafts[id]='';U.refresh();const box=document.querySelector('#app-view .app-scroll');box.scrollTop=box.scrollHeight;document.querySelector('[data-field="wa-draft"]').focus();};
 document.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&!ev.isComposing&&ev.target.matches('[data-field="wa-draft"]')){ev.preventDefault();w.handle('wa-send');}});
})();

/* IDENTIDAD — cada perfil y contacto toma el retrato del personaje asociado. */
Caught.data.perfil_instagram.forEach(p=>{const who=Caught.ui.person(p.id_personaje);if(who)p.foto_perfil=who.imagen;});
Caught.data.contacto.forEach(c=>{const who=Caught.ui.person(c.id_personaje);if(who)c.foto=who.imagen;});

/* MENSAJES — fecha ficticia del caso: pausas variadas después del último mensaje.
   Se usan UTC y el formato del modelo para evitar cambios por zona horaria. */
Caught.ui.nextChatTime=function(app,id,extra=[]){
 const source=app==='whatsapp'?Caught.data.mensaje.filter(m=>m.id_chat===id):Caught.data.mensaje_instagram.filter(m=>m.id_chat_ig===id);
 const values=[...source,...extra].map(m=>m.fecha_hora).filter(Boolean).sort();
 const last=values.at(-1)||'2026-09-26 12:00';
 const date=new Date(last.replace(' ','T').slice(0,16)+':00Z');
 const pause=[2,5,3,8,4][(Number(id)+extra.length)%5];
 date.setUTCMinutes(date.getUTCMinutes()+pause);
 return date.toISOString().slice(0,16).replace('T',' ');
};
/* CORREO — cabecera centrada, remitentes, avatares y separadores de etapa 12.
   El menú abre el buscador y los mensajes mantienen su contenido original. */
(function(){const U=Caught.ui,D=Caught.data,a=Caught.apps.email,render=a.render,handle=a.handle;
 a.list=function(){const q=(this.state.q||'').toLowerCase();return D.email.slice().sort((x,y)=>y.fecha_hora.localeCompare(x.fecha_hora)).filter(m=>(m.remitente+' '+m.asunto+' '+m.contenido).toLowerCase().includes(q)).map(m=>'<button class="mail12-row" data-action="open" data-value="'+m.id_email+'"><span class="mail12-avatar" aria-hidden="true"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="#d5c9fa"/><path d="M0 43Q15 31 35 43T60 43V60H0Z" fill="#7660ac"/><path d="M0 50Q20 43 40 51T60 50V60H0Z" fill="#433073"/><path d="M12 19c0-6 6-7 10-5 3-7 14-5 15 2 8-1 10 8 3 9H15c-5 0-6-5-3-6" fill="white"/></svg></span><span class="mail12-copy"><b>'+U.escape(m.remitente.split('@')[0])+'</b><small>'+U.escape(m.asunto)+'</small></span><time>'+U.time(m.fecha_hora)+'</time></button>').join('')||'<p>Sin resultados.</p>';};
 a.render=function(){if(this.state.mail!==null)return render.call(this);return '<header class="mail12-header">'+U.button('close','×','','mail12-close')+'<h2>Correo</h2>'+U.button('mail-menu','☰','','mail12-menu')+'</header>'+(this.state.searchOpen?'<label class="app-search"><input data-search aria-label="Buscar correo" placeholder="Buscar correo" value="'+U.escape(this.state.q||'')+'"></label>':'')+'<div class="app-scroll" data-list>'+this.list()+'</div>';};
 a.handle=function(action,value){if(action==='mail-menu'){this.state.searchOpen=!this.state.searchOpen;this.state.q='';U.refresh();return;}return handle.call(this,action,value);};
 const reset=a.reset;a.reset=function(){reset.call(this);this.state.searchOpen=false;};
})();

/* ETAPA 12 — Calendario (28), Correo (29–31), Contactos (32–33)
   y Teléfono (34–35). Vistas basadas en el PDF, con datos de etapa 13. */
(function(){
 const U=Caught.ui,D=Caught.data,A=Caught.apps,e=U.escape;
 const phoneIcon='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 2.5 10 7.6 7.8 10c1.5 3 3.2 4.7 6.2 6.2l2.4-2.2 5.1 3.4c-.4 3.4-2.8 4-5.2 3.2C9.4 18.3 5.7 14.6 3.4 7.7 2.6 5.3 3.2 2.9 6.6 2.5Z"/></svg>';
 const header=title=>'<header class="mail12-header">'+U.button('close','×','','mail12-close')+'<h2>'+title+'</h2><span class="header-spacer"></span></header>';
 const mail=A.email,oldMailHandle=mail.handle;
 const sender=m=>{const domain=m.remitente.split('@')[1]||'';const key=m.remitente.toLowerCase();return key.includes('netflix')?'Netflix':key.includes('youtube')?'YouTube':domain.includes('google')?'Google':key.includes('paypal')?'PayPal':key.includes('carrefour')?'Carrefour':m.remitente.split('@')[0];};
 // Logos vectoriales locales: se ven completos y no dependen de internet.
 const mark=body=>'<svg viewBox="0 0 48 48" aria-hidden="true">'+body+'</svg>';
 const mailLogos={
 YouTube:mark('<rect x="3" y="10" width="42" height="28" rx="8" fill="#ff0000"/><path d="m20 17 12 7-12 7Z" fill="white"/>'),
 Carrefour:mark('<path d="M3 24 20 7v34Z" fill="#e32320"/><path d="M24 7c8 0 15 9 21 17-6 8-13 17-21 17V7Z" fill="#005aa9"/><path d="M31 16c-2-4-10-5-14 0-4 5-4 11 0 16 4 5 12 4 14 0l-4-3c-1 2-5 3-7 0-2-3-2-7 0-10 2-3 6-2 7 0Z" fill="white"/>'),
 PayPal:mark('<path d="m16 6-7 34h9l3-12h7c16 0 20-22 3-22Z" fill="#003087"/><path d="m22 14-6 30h8l3-11h6c13 0 17-19 2-19Z" fill="#009cde" fill-opacity=".92"/>'),
 Google:mark('<path d="M43 24c0-1.5-.2-3-.5-4.5H24v8h10.6c-.5 2.6-2 4.7-4.2 6.2l6.7 5.2C41.3 35.1 43 30 43 24Z" fill="#4285f4"/><path d="M24 44c5.5 0 10-1.8 13.1-5.1l-6.7-5.2c-1.7 1.1-3.9 1.8-6.4 1.8-5.2 0-9.6-3.5-11.2-8.2l-6.9 5.4C9.2 39.4 16 44 24 44Z" fill="#34a853"/><path d="M12.8 27.3a12 12 0 0 1 0-6.6l-6.9-5.4a20 20 0 0 0 0 17.4Z" fill="#fbbc05"/><path d="M24 12.5c3 0 5.6 1 7.7 3l5.9-5.9C34 6.1 29.5 4 24 4 16 4 9.2 8.6 5.9 15.3l6.9 5.4c1.6-4.7 6-8.2 11.2-8.2Z" fill="#ea4335"/>')
 };
 const avatar=m=>'<span class="mail12-avatar mail12-initial '+(mailLogos[sender(m)]?'mail-brand-avatar':sender(m)==='Netflix'?'netflix-initial':'')+'" aria-hidden="true">'+(mailLogos[sender(m)]||e(sender(m)[0].toUpperCase()))+'</span>';
 mail.list=function(){const q=(this.state.q||'').toLowerCase();const folder=this.state.folder||'Bandeja de entrada';if(folder!=='Bandeja de entrada'&&folder!=='Spam')return '<p class="empty-state">No hay correos en '+e(folder)+'.</p>';return D.email.slice().sort((a,b)=>b.fecha_hora.localeCompare(a.fecha_hora)).filter(m=>(m.remitente+' '+m.asunto+' '+m.contenido).toLowerCase().includes(q)).map(m=>'<button class="mail12-row" data-action="open" data-value="'+m.id_email+'">'+avatar(m)+'<span class="mail12-copy"><b>'+e(sender(m))+'</b><small>'+e(m.asunto)+'</small></span><time>'+U.time(m.fecha_hora)+'</time></button>').join('');};
 const folderSVG=body=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+body+'</svg>';
 const mailFolderIcons=[folderSVG('<path d="M4 4h16v16H4Z M4 14h5l2 3h2l2-3h5"/>'),folderSVG('<path d="m12 3 3 6 6 1-4 5 1 6-6-3-6 3 1-6-4-5 6-1Z"/>'),folderSVG('<path d="M4 6h11l5 6-5 6H4Z"/>'),folderSVG('<path d="m3 3 18 9-18 9 4-9Z M7 12h14"/>'),folderSVG('<path d="M5 3h10l4 4v14H5Z M15 3v5h4 M8 12h8 M8 16h6"/>'),folderSVG('<path d="m8 3-5 5v8l5 5h8l5-5V8l-5-5Z M12 7v6 M12 17h.01"/>'),folderSVG('<path d="M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7"/>')];
 mail.render=function(){const s=this.state;
 if(s.mail!==null){const m=D.email.find(x=>x.id_email===s.mail);return '<header class="mail-detail-tools">'+U.button('back','‹','','text-button')+'<span aria-hidden="true">✉ ⋮</span></header><div class="app-scroll mail-detail12"><h2>'+e(m.asunto)+'</h2><div class="mail-detail-sender">'+avatar(m)+'<div><b>'+e(sender(m))+'</b><small>'+e(m.remitente)+'</small></div><time>'+U.time(m.fecha_hora)+'</time></div><small>Para: martin@gmail.com</small><p>'+e(m.contenido)+'</p></div><div class="mail-reply12">'+U.button('mail-reply','↶ Responder','','')+U.button('mail-forward','↪ Reenviar','','')+'</div>';}
 return '<header class="mail12-header">'+U.button('close','×','','mail12-close')+'<h2>Correo</h2>'+U.button('mail-menu','☰','','mail12-menu')+'</header><div class="app-scroll" data-list>'+this.list()+'</div>'+(s.searchOpen?'<aside class="mail-drawer12"><div class="mail-account12">'+U.avatar(U.person(1))+'<span>Martín<small>martin@gmail.com</small></span>'+U.button('mail-menu','☰','','text-button')+'</div>'+['Bandeja de entrada','Destacados','Importante','Enviados','Borradores','Spam','Papelera'].map((label,i)=>'<button data-action="mail-folder" data-value="'+label+'"><span aria-hidden="true">'+mailFolderIcons[i]+'</span>'+label+'</button>').join('')+'</aside>':'');};
 mail.handle=function(a,v){if(a==='mail-folder'){this.state.folder=v;this.state.searchOpen=false;U.refresh();return;}if(a==='mail-reply'||a==='mail-forward'){U.toast('Correo simulado: '+(a==='mail-reply'?'Responder':'Reenviar'));return;}oldMailHandle.call(this,a,v);};
 const cal=A.calendar;
 cal.render=function(){const {y,m,sel}=this.state;const names=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];const key=d=>y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');const off=(new Date(y,m,1).getDay()+6)%7,total=new Date(y,m+1,0).getDate();let cells='<span></span>'.repeat(off);for(let d=1;d<=total;d++){const events=D.evento_calendario.filter(x=>x.fecha===key(d));cells+='<button class="cal12-day '+(sel===key(d)?'selected':'')+'" data-action="day" data-value="'+key(d)+'"><b>'+d+'</b>'+(sel===key(d)?events.map(x=>'<small>'+e(x.titulo)+'</small>').join(''):'')+'</button>';}
 const events=D.evento_calendario.filter(x=>x.fecha===sel);const details=events.map(x=>'<div class="cal12-event">'+e(x.titulo)+' · '+x.hora+U.evidence(x.id_pista)+'</div>').join('');
 return '<header class="cal12-header">'+U.button('close','×','','mail12-close')+'<div class="cal12-heading"><small>'+y+'</small><div>'+U.button('prev','‹','','text-button')+'<h2>'+names[m]+'</h2>'+U.button('next','›','','text-button')+'</div></div></header><div class="cal-week">'+['L','M','M','J','V','S','D'].map(x=>'<span>'+x+'</span>').join('')+'</div><div class="cal12-grid" style="--weeks:'+Math.ceil((off+total)/7)+'">'+cells+'</div><div class="cal12-bottom">'+details+'</div>';};
 const phone=A.phone;
 phone.list=function(){const s=this.state,contact=id=>D.contacto.find(x=>x.id_contacto===id);const row=(c,sub)=>'<button class="phone12-row" data-action="contact" data-value="'+c.id_contacto+'">'+this.avatarOf(c)+'<span><b>'+e(c.nombre)+'</b><small>'+e(c.numero)+'</small>'+(sub?'<small class="phone12-date">'+e(sub)+'</small>':'')+'</span><i aria-hidden="true">'+phoneIcon+'</i></button>';
 if(s.tab==='recents')return D.llamada.slice().sort((a,b)=>b.fecha_hora.localeCompare(a.fecha_hora)).map(l=>row(contact(l.id_contacto),U.date(l.fecha_hora)+' · '+U.time(l.fecha_hora)+' · '+l.tipo)).join('');
 let letter='';return '<div class="phone12-mycard">'+U.avatar(U.person(1))+'<span>Mi tarjeta</span></div>'+D.contacto.slice().sort((a,b)=>a.nombre.localeCompare(b.nombre,'es')).map(c=>{let head='';const initial=c.nombre[0];if(initial!==letter){letter=initial;head='<h3 class="phone12-letter">'+e(initial)+'</h3>';}return head+row(c,'');}).join('');};
 // Íconos limpios sin el rectángulo oscuro incorporado a los PNG.
 const contactActionIcon=name=>{
 const bodies={mensaje:'<path d="M6 7h12v9H11l-4 3v-3H6Z" fill="white"/><circle cx="9" cy="11" r="1" fill="#34b7f1"/><circle cx="12" cy="11" r="1" fill="#34b7f1"/><circle cx="15" cy="11" r="1" fill="#34b7f1"/>',llamar:'<g transform="translate(3 3) scale(.75)">'+phoneIcon.replace(/<svg[^>]*>|<\/svg>/g,'').replace('fill="currentColor"','fill="white"')+'</g>',video:'<rect x="5" y="7" width="10" height="10" rx="1" fill="white"/><path d="m15 10 5-3v10l-5-3Z" fill="white"/>',correo:'<rect x="5" y="7" width="14" height="10" rx="1" fill="none" stroke="white"/><path d="m5 7 7 6 7-6M5 17l5-5m9 5-5-5" fill="none" stroke="white"/>'};
 const colors={mensaje:'#34b7f1',llamar:'#7cdb48',video:'#ffc55a',correo:'#ff565b'};
 return '<svg class="contact-action-vector" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="'+colors[name]+'"/><g fill="white">'+bodies[name]+'</g></svg>';
 };
 phone.detail=function(id){const c=D.contacto.find(c=>c.id_contacto===Number(id));return '<div class="contact12-card"><header>'+U.button('back','‹','','text-button')+'</header><img src="'+c.foto+'" alt="'+e(c.nombre)+'"><h2>'+e(c.nombre)+'</h2><div class="contact12-actions">'+[['Mensaje','mensaje'],['Llamar','llamar'],['Video','video'],['Correo','correo']].map(([name,icon])=>U.button('unavailable',contactActionIcon(icon)+'<small>'+name+'</small>',name,'')).join('')+'</div><div class="contact12-number"><span>'+phoneIcon+'</span><div><small>Teléfono</small><b>'+e(c.numero)+'</b></div></div></div>';};
 // Pestañas con SVG: conservan nitidez en cualquier escala del celular.
 const tabVector=body=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+body+'</svg>';
 const phoneTabIcons={recents:tabVector('<path d="m6 3 4 5-3 3c2 3 3 4 6 6l3-3 5 4c-1 5-4 4-8 2C7 18 2 10 3 5Z"/>'),contacts:tabVector('<rect x="4" y="2" width="16" height="20" rx="3"/><circle cx="12" cy="8" r="3"/><path d="M7 18c0-6 10-6 10 0M2 7h3M2 12h3M2 17h3"/>'),keypad:tabVector('<g fill="currentColor" stroke="none"><circle cx="5" cy="4" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="19" cy="4" r="2"/><circle cx="5" cy="11" r="2"/><circle cx="12" cy="11" r="2"/><circle cx="19" cy="11" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="19" cy="18" r="2"/></g>')};
 const originalKeypad=phone.keypad;
 phone.keypad=function(){let html=originalKeypad.call(this);const letters={'2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ','0':'+'};return html.replace(/(<button[^>]*data-action="dial"[^>]*>)([0-9])(<\/button>)/g,(_,start,n,end)=>start+'<b>'+n+'</b><small>'+(letters[n]||'')+'</small>'+end);};
 phone.render=function(){const s=this.state;if(s.contact!==null)return this.detail(s.contact);const title={recents:'Llamadas',contacts:'Contactos',keypad:''}[s.tab];return (s.tab==='keypad'?'':header(title))+'<div class="app-scroll '+(s.tab==='keypad'?'phone12-keypad':'')+'">'+(s.tab==='keypad'?this.keypad():this.list())+'</div><nav class="app-tabs phone12-tabs">'+[['recents','Llamadas','◕'],['contacts','Contactos','●'],['keypad','Teclado','▦']].map(([id,label,icon])=>U.button('tab','<span class="phone-tab-vector" aria-hidden="true">'+phoneTabIcons[id]+'</span><small>'+label+'</small>',id,s.tab===id?'active':'')).join('')+'</nav>';};
})();