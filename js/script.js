'use strict';
/* SCRIPT.JS — lógica general, navegación, temporizador y resolución.
   Los datos están en data.js y las aplicaciones en apps.js.
   Orden de carga: data.js, script.js, apps.js, todos con defer. */

/* ============================================================
   ÍCONOS
   Dibuja los logos vectoriales aprobados.
   ============================================================ */
const svg = body => `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">${body}</svg>`;
const brandIcons = {
calendar: svg('<g stroke="#30436a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="15" width="40" height="38" rx="4"/><path d="M12 26h40M22 10v10M42 10v10"/></g><g fill="#30436a"><rect x="20" y="32" width="5" height="5" rx="1"/><rect x="30" y="32" width="5" height="5" rx="1"/><rect x="40" y="32" width="5" height="5" rx="1"/><rect x="20" y="42" width="5" height="5" rx="1"/><rect x="30" y="42" width="5" height="5" rx="1"/><rect x="40" y="42" width="5" height="5" rx="1"/></g>'),

calculator: svg('<rect x="15" y="7" width="34" height="50" rx="7" fill="#242424" stroke="#fff" stroke-width="2"/><rect x="21" y="13" width="22" height="10" rx="2" fill="#dedede"/><g fill="#a5a5a5"><circle cx="24" cy="31" r="4"/><circle cx="34" cy="31" r="4"/><circle cx="24" cy="41" r="4"/><circle cx="34" cy="41" r="4"/><rect x="20" y="47" width="18" height="5" rx="2.5"/></g><rect x="41" y="27" width="5" height="25" rx="2.5" fill="#ff9f0a"/>'),
email: svg('<path d="M10 49V19l22 17 22-17v30" stroke="#fff" stroke-width="8" stroke-linejoin="round"/><path d="M10 19l22 17 22-17" stroke="#fff" stroke-width="8" stroke-linecap="round"/>'),
map: svg('<path d="M32 7c-12 0-21 9-21 21 0 15 21 31 21 31s21-16 21-31C53 16 44 7 32 7Z" fill="#fff"/><circle cx="32" cy="27" r="8" fill="#77629c"/>'),
instagram: svg('<rect x="11" y="11" width="42" height="42" rx="13" stroke="#fff" stroke-width="5"/><circle cx="32" cy="32" r="10" stroke="#fff" stroke-width="5"/><circle cx="45" cy="19" r="3" fill="#fff"/>'),
whatsapp: svg('<path d="M32 9a21 21 0 0 1 0 42c-4 0-8-1-11-3l-10 3 3-10A21 21 0 0 1 32 9Z" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/><path d="M25 20c-2-1-5 3-4 6 2 8 8 14 16 16 3 1 7-2 6-4l-6-3c-2-1-3 2-4 2-4-2-6-4-8-8-1-1 2-2 2-4l-2-5Z" fill="#fff"/>'),
gallery: svg('<rect x="11" y="13" width="42" height="38" rx="3" stroke="#fff" stroke-width="3"/><circle cx="22" cy="24" r="4" stroke="#fff" stroke-width="3"/><path d="M12 48l17-18 11 11 6-6 7 8" stroke="#fff" stroke-width="3"/>'),
phone: svg('<path d="M19 11l8 12-6 6c4 8 8 12 16 16l6-6 12 8c-1 9-7 10-13 8C24 49 15 40 9 22c-2-6 0-11 10-11Z" fill="#fff"/>')
};

/* ============================================================
   COMPONENTES DE INTERFAZ
   Funciones compartidas para mensajes, contactos, botones, fechas, avatares y escape de texto.
   ============================================================ */
'use strict';
Caught.ui = {
  $: selector => document.querySelector(selector),
  escape: value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])),
  date: value => value ? value.slice(0,10).split('-').reverse().join('/') : 'Sin fecha',
  time: value => value ? value.slice(11,16) : '',
  person: id => Caught.data.personajes.find(p => p.id_personaje === Number(id)),
  avatar: person => person ? `<img class="avatar" src="${person.imagen}" alt="${Caught.ui.escape(person.nombre)}">` : '',
  icon: (name, alt='') => `<img class="ui-icon" src="../img/interfaz/${name}.png" alt="${alt}">`,
  button: (action,label,value='',className='') => `<button type="button" class="${className}" data-action="${action}" data-value="${value}">${label}</button>`,
  header: (title,subtitle='') => `<header class="app-header">${Caught.ui.button('close',Caught.ui.icon('volver'),'','icon-button')}<div><h2>${Caught.ui.escape(title)}</h2>${subtitle ? `<small>${Caught.ui.escape(subtitle)}</small>` : ''}</div></header>`,
  row: (action,value,title,subtitle,avatar='') => Caught.ui.button(action,`${avatar}<span><b>${Caught.ui.escape(title)}</b><small>${Caught.ui.escape(subtitle)}</small></span><em>›</em>`,value,'content-row'),
  evidence: id => id ? `<span class="evidence-mark" data-evidence="${Number(id)}" aria-label="Evidencia del caso"></span>` : '',
  message: (m,sent) => `<article class="message ${sent ? 'sent' : 'received'} ${m.id_pista ? 'message-evidence' : ''}" ${m.id_pista ? `data-evidence="${Number(m.id_pista)}"` : ''}><p>${Caught.ui.escape(m.contenido)}</p><small>${Caught.ui.date(m.fecha_hora)} · ${Caught.ui.time(m.fecha_hora)}</small></article>`,
  toast(message) {
    const t=this.$('#toast');t.textContent=message;t.classList.add('show');
    clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>t.classList.remove('show'),2300);
  },
  // Descubre la evidencia cuando aparece visible, incluso al desplazarse por el chat.
  mount(html) {
    this.evidenceObserver?.disconnect();this.$('#app-view').innerHTML=html;
    this.evidenceObserver=new IntersectionObserver(entries=>{
      entries.filter(x=>x.isIntersecting).forEach(x=>{if(Caught.game.state?.phase==='investigation')Caught.game.openClue(x.target.dataset.evidence);});
    },{root:this.$('#app-view'),threshold:0.65});
    this.$('#app-view').querySelectorAll('[data-evidence]').forEach(el=>this.evidenceObserver.observe(el));
  },
  refresh() { Caught.ui.mount(Caught.apps[Caught.currentApp].render()); }
};

/* ============================================================
   ESTADO DE LA PARTIDA
   Controla los cinco minutos, las pistas encontradas, su libreta y la finalización de la investigación.
   ============================================================ */
'use strict';
Caught.game = {
  state: null, interval: null,
  reset() {
    clearInterval(this.interval);this.interval=null;clearTimeout(this.completionTimer);
    this.clearClueNotice();this.state={phase:'intro',caseId:1,remaining:300,deadline:null,activeClue:null,openedClues:new Set(),answers:[],usage:{},appStarted:null};
    Object.values(Caught.apps).forEach(app=>app.reset?.());
    if(Caught.dialogos){Caught.dialogos.selected=null;Caught.dialogos.index=0;Caught.dialogos.questions=[];}
    this.update();
  },
  start() {
    this.reset();this.state.phase='investigation';
    this.state.remaining=Caught.data.casos[0].tiempo_limite;
    this.state.deadline=performance.now()+this.state.remaining*1000;
    Caught.main.showScreen('game-screen');this.update();
    this.interval=setInterval(()=>this.tick(),250);
  },
  tick() {
    if(Caught.main.loadingGame)return;
    if(this.state.completing)return;
    if(this.state.phase!=='investigation') return;
    this.state.remaining=Math.max(0,Math.ceil((this.state.deadline-performance.now())/1000));
    this.update();if(this.state.remaining===0)this.finish(true);
  },
  update() {
    if(!this.state)return;
    const timer=Caught.ui.$('#timer');if(timer)timer.textContent=`${String(Math.floor(this.state.remaining/60)).padStart(2,'0')}:${String(this.state.remaining%60).padStart(2,'0')}`;
    const count=Caught.ui.$('#case-file-button b');if(count)count.textContent=`${this.state.openedClues.size}/${Caught.data.casos[0].total_pistas}`;
  },
  track(app) {
    const now=performance.now();
    if(this.state.appStarted) {
      const {id,at}=this.state.appStarted;
      this.state.usage[id]=(this.state.usage[id]||0)+(now-at)/1000;
    }
    this.state.appStarted=app?{id:app,at:now}:null;
  },
  usage(id) {return (this.state.usage[id]||0)+(this.state.appStarted?.id===id?(performance.now()-this.state.appStarted.at)/1000:0);},
  clueContent(id) {
    const U=Caught.ui,D=Caught.data;
    if(id===1) return D.mensaje_instagram.filter(m=>m.id_chat_ig===1).map(m=>U.message({...m,id_pista:null},m.id_perfil===1)).join('');
    if(id===2||id===3) return D.mensaje.filter(m=>m.id_chat===(id===2?4:5)).map(m=>U.message({...m,id_pista:null},m.id_personaje===1)).join('');
    if(id===4) return `<img class="clue-photo" src="../img/evidencias/bar.jpg" alt="Tres vasos en el bar"><img class="clue-photo" src="../img/evidencias/evidencia.jpg" alt="Personas reunidas"><p>La fotografía del bar tiene fecha del 26/09/2026 a las 23:20. La imagen complementaria no incluye fecha.</p>`;
    const e=D.evento_calendario[0];return `<h3>${e.titulo}</h3><p>${U.date(e.fecha)} · ${e.hora}</p>`;
  },
  openClue(id,review=false) {
    id=Number(id);if(this.state.phase!=='investigation'&&!review)return;
    const clue=Caught.data.pistas.find(c=>c.id_pista===id);if(!clue)return;
    // Durante la investigación se registra la pista sin abrir la lista ni interrumpir la app.
    const isNew=!this.state.openedClues.has(id);
    this.state.activeClue=id;this.state.openedClues.add(id);this.update();
    if(!review){
      if(isNew){
        this.notifyClue();
        // Cinco pistas: guarda el tiempo de hallazgo y muestra el último aviso
        // antes de pasar a la lista final y las preguntas de conclusión.
        if(Caught.data.pistas.every(p=>this.state.openedClues.has(p.id_pista))){
          this.tickBeforeFinish();clearInterval(this.interval);
          this.state.completing=true;
          this.completionTimer=setTimeout(()=>{
            if(this.state.phase!=='investigation'||!this.state.completing)return;
            this.finish(false);
          },3000);
        }
      }
      return;
    }
    this.openDialog(`<p class="eyebrow">PISTA ${id} · ${clue.tipo}</p><h2 id="clue-title">Pista encontrada</h2><p>${Caught.ui.escape(clue.descripcion)}</p><div class="clue-content">${this.clueContent(id)}</div>`);
  },
  // Aviso superior temporal. Una pista repetida no vuelve a anunciarse.
  notifyClue() {
    const notice=Caught.ui.$('#clue-notice');
    notice.innerHTML='<span class="clue-notice-title">¡Pista encontrada!</span><small class="clue-notice-count">'+this.state.openedClues.size+'/'+Caught.data.casos[0].total_pistas+'</small>';
    clearTimeout(this.noticeTimer);notice.classList.add('show');
    this.noticeTimer=setTimeout(()=>notice.classList.remove('show'),3000);
  },
  clearClueNotice() {
    clearTimeout(this.noticeTimer);Caught.ui.$('#clue-notice').classList.remove('show');
  },
  notebook() {
    if(this.state.phase==='investigation')return;
    const D=Caught.data,U=Caught.ui;
    this.openDialog(`<p class="eyebrow">EXPEDIENTE N.º 01</p><h2 id="clue-title">Pistas encontradas</h2><p>${this.state.openedClues.size} de ${D.pistas.length} evidencias</p><div class="notebook-list">${D.pistas.map(p=>this.state.openedClues.has(p.id_pista)?U.row('review-clue',p.id_pista,p.tipo,p.descripcion):`<div class="locked-clue"><b>Pista ${p.id_pista}</b><small>Pendiente de descubrir</small></div>`).join('')}</div>`);
  },
  openDialog(content) {
    const d=Caught.ui.$('#clue-dialog');d.innerHTML=`${Caught.ui.button('close-dialog','×','','dialog-close')}${content}`;if(!d.open)d.showModal();
  },
  finish(expired=false) {
    if(this.state.phase!=='investigation')return;
    clearTimeout(this.completionTimer);this.clearClueNotice();if(!this.state.completing)this.tickBeforeFinish();this.state.phase='questions';clearInterval(this.interval);this.track(null);
    Caught.ui.$('#clue-dialog').close();Caught.main.closeApp();
    const U=Caught.ui,icon=U.$('#timeout-icon');
    icon.textContent=expired?'✕':'✓';icon.className='status-icon '+(expired?'is-timeout':'is-done');
    U.$('#timeout-eyebrow').textContent=expired?'04 · Tiempo agotado':'04 · Investigación finalizada';
    U.$('#timeout-title').textContent=expired?'Se acabó el tiempo':'Investigación finalizada';
    U.$('#timeout-copy').textContent=`Encontraste ${this.state.openedClues.size} de ${Caught.data.casos[0].total_pistas} pistas.`;
    U.$('#questions-button').hidden=false;
    U.$('#timeout-screen .hint-pill').textContent='Es hora de que saques tu conclusión';
    if(expired)Caught.main.showScreen('timeout-screen');
    else {Caught.main.renderFound();Caught.main.showScreen('found-screen');}
  },
  tickBeforeFinish() {this.state.remaining=Math.max(0,Math.ceil((this.state.deadline-performance.now())/1000));this.update();}
};

/* ============================================================
   PREGUNTAS Y RESULTADOS
   Selecciona respuestas, avanza por seis preguntas y muestra la conclusión elegida.
   ============================================================ */
'use strict';
Caught.dialogos = {
  index:0, selected:null, questions:[],
  // Preguntas específicas solo para evidencias encontradas; conclusión siempre al final.
  availableQuestions() {return Caught.data.pregunta.filter(q=>q.es_definitiva||Caught.game.state.openedClues.has(q.id_pista)).sort((a,b)=>a.orden-b.orden);},
  start() {this.questions=this.availableQuestions();this.index=0;this.selected=null;Caught.game.state.answers=[];this.render();Caught.main.showScreen('resolution-screen');},
  // Texto del botón según la pantalla de la Etapa 12: "Siguiente" sin selección, "Confirmar" con selección.
  label() {Caught.ui.$('#confirm-button').innerHTML=this.selected===null?'Siguiente <span aria-hidden="true">→</span>':'Confirmar <span aria-hidden="true">✓</span>';},
  // Alterna entre las opciones y el cuadro "¡Atención!" (pantalla "Pregunta con mensaje de error").
  showError(show) {const U=Caught.ui;U.$('#form-error').hidden=!show;U.$('.answers').hidden=show;},
  render() {
    const D=Caught.data,U=Caught.ui,q=this.questions[this.index];this.selected=null;
    U.$('#resolution-screen .eyebrow').textContent=`06 · Preguntas · ${this.index+1}/${this.questions.length}`;
    U.$('#question-title').textContent=q.texto_pregunta;
    U.$('.answers').innerHTML=D.opcion.filter(o=>o.id_pregunta===q.id_pregunta).map(o=>`<button role="radio" aria-checked="false" data-answer="${o.id_opcion}"><span>${U.escape(o.texto)}</span><i class="radio-dot" aria-hidden="true"></i></button>`).join('');
    this.showError(false);this.label();
    U.$('#resolution-screen .back-button').hidden=false;
  },
  choose(id) {
    this.selected=Number(id);
    document.querySelectorAll('[data-answer]').forEach(b=>{const selected=Number(b.dataset.answer)===this.selected;b.classList.toggle('selected',selected);b.setAttribute('aria-checked',String(selected));});
    this.showError(false);this.label();
  },
  confirm() {
    if(this.selected===null){this.showError(true);return;}
    const option=Caught.data.opcion.find(o=>o.id_opcion===this.selected);
    Caught.game.state.answers[this.index]=option.id_opcion;
    if(option.consecuencia==='siguiente'){this.index++;this.render();return;}
    const c=Caught.data.conclusion.find(c=>c.id_conclusion===option.id_conclusion),st=Caught.game.state,U=Caught.ui;
    st.phase='result';
    st.correctConclusion=c.es_correcta;
    U.$('#restart-button').innerHTML=c.es_correcta?'Volver al inicio <span aria-hidden="true">↻</span>':'Reintentar <span aria-hidden="true">↻</span>';
    const used=Math.max(0,Caught.data.casos[0].tiempo_limite-st.remaining),mmss=`${String(Math.floor(used/60)).padStart(2,'0')}:${String(used%60).padStart(2,'0')}`;
    U.$('#result-conclusion').textContent=c.texto;
    U.$('#result-title').textContent=c.es_correcta?'¡Tu conclusión es correcta!':'Tu conclusión es incorrecta.';
    U.$('#result-explanation').textContent=c.texto_resultado;
    U.$('#result-progress').textContent=`Pistas encontradas: ${st.openedClues.size}/${Caught.data.casos[0].total_pistas} · Tiempo empleado: ${mmss}`;
    Caught.main.showScreen('result-screen');
  },
  // El aviso se cierra primero para poder elegir una opción en la misma pregunta.
  back() {if(!Caught.ui.$('#form-error').hidden){this.showError(false);return;}if(this.index>0){this.index--;this.render();const previous=Caught.game.state.answers[this.index];if(previous)this.choose(previous);}else Caught.main.showScreen('found-screen');}
};

/* ============================================================
   NAVEGACIÓN GENERAL
   Cambia pantallas, muestra los cuatro protagonistas y dirige clics y búsquedas a apps.js.
   ============================================================ */

'use strict';
Caught.main = {
 appList:[['email','Email'],['map','Mapa'],['calendar','Calendario'],['instagram','Instagram'],['notes','Notas'],['calculator','Calculadora'],['settings','Ajustes']],
 // Todas las etapas comparten la misma transición horizontal, sin desplazamiento vertical.
 waitForLoader(){
  return new Promise(resolve=>setTimeout(resolve,1500));
 },
 revealFound(){
  const rows=Array.from(document.querySelectorAll('#found-list .found-row'));
  const button=document.getElementById('found-next-button');
  button.disabled=rows.length>0;
  rows.forEach((row,index)=>{row.classList.add('found-loading');row.setAttribute('aria-busy','true');setTimeout(()=>{row.classList.remove('found-loading');row.removeAttribute('aria-busy');if(index===rows.length-1)button.disabled=false;},(index+1)*750);});
 },
 showScreen(id){
  const next=document.getElementById(id);if(!next)return;
  const previous=document.querySelector('.screen.active');if(previous===next)return;
  const serial=this.screenTransition=(this.screenTransition||0)+1;
  const loader=document.getElementById('screen-loader');
  const loaderTime=document.getElementById('loader-time');
  loaderTime.hidden=!['found-screen','timeout-screen'].includes(id);
  if(!loaderTime.hidden)document.getElementById('loader-timer').textContent=document.getElementById('timer').textContent;
  loader?.classList.add('is-loading');
  this.loadingGame=id==='game-screen';
  (this.screenAnimations||[]).forEach(a=>a.cancel());this.screenAnimations=[];
  document.querySelectorAll('.screen-leaving').forEach(s=>s.classList.remove('screen-leaving'));
  const screens=Array.from(document.querySelectorAll('.screen'));
  const direction=previous&&screens.indexOf(next)<screens.indexOf(previous)?-1:1;
  screens.forEach(s=>s.classList.toggle('active',s===next));
  document.body.classList.toggle('phone-open',id==='game-screen');
  window.scrollTo(0,0);next.scrollTop=0;
  const finish=()=>{
   if(this.screenTransition!==serial)return;
   loader?.classList.remove('is-loading');
   if(this.loadingGame&&Caught.game.state.phase==='investigation')Caught.game.state.deadline=performance.now()+Caught.game.state.remaining*1000;
   this.loadingGame=false;
   previous?.classList.remove('screen-leaving');
   document.body.classList.remove('screen-transitioning');
   this.screenAnimations=[];
   if(id!=='game-screen')this.closeApp();
   if(id==='found-screen')this.revealFound();
  };
  if(!previous||!next.animate||window.matchMedia('(prefers-reduced-motion: reduce)').matches){this.waitForLoader().then(finish);return;}
  previous.classList.add('screen-leaving');document.body.classList.add('screen-transitioning');
  const options={duration:420,easing:'cubic-bezier(.22,.61,.36,1)'};
  const outgoing=previous.animate([{transform:'translateX(0)'},{transform:`translateX(${-direction*100}%)`}],options);
  const incoming=next.animate([{transform:`translateX(${direction*100}%)`},{transform:'translateX(0)'}],options);
  this.screenAnimations=[outgoing,incoming];
  Promise.allSettled([...this.screenAnimations.map(a=>a.finished),this.waitForLoader()]).then(finish);
 },
 openApp(id){
  if(Caught.game.state.phase!=='investigation'||!Caught.apps[id])return;
  Caught.game.tick();if(Caught.game.state.phase!=='investigation')return;
  Caught.currentApp=id;Caught.game.track(id);
  const el=Caught.ui.$('#app-view');el.className='app-view open live-app '+id+'-live';
  Caught.ui.mount(Caught.apps[id].render());
 },
 closeApp(){if(Caught.game.state)Caught.game.track(null);Caught.currentApp=null;const el=Caught.ui.$('#app-view');el.className='app-view';el.innerHTML='';},
 renderCharacters(){
  const U=Caught.ui;
  U.$('.character-grid').innerHTML=Caught.data.personajes.filter(p=>[1,2,3,4].includes(p.id_personaje)).map(p=>`<article><img class="character-photo" src="${p.imagen}" alt="${U.escape(p.nombre)}"><p>${U.escape(p.rol)}</p><h3>${U.escape(p.nombre)}</h3><small>${U.escape(p.relacion_con_martin)}</small></article>`).join('');
 },
 // Pantalla "¿Qué encontraste?": ticket con los campos de Caught.data.ticket.
 renderTicket(){
  const U=Caught.ui,t=Caught.data.ticket,e=U.escape;
  U.$('#ticket').innerHTML=`<b>${e(t.restaurante)}</b><span>${e(t.ubicacion)}</span><hr><p><span>Fecha: ${e(t.fecha)}</span><span>Hora: ${e(t.hora)}</span></p><hr><p><span>Consumición</span><span>${e(t.consumicion)}</span></p><hr><p><b>TOTAL</b><b>${e(t.total)}</b></p><hr><p><span>Nota: ${e(t.nota)}</span></p>`;
 },
 // Pantalla "Pistas encontradas": lista de las pistas abiertas durante la investigación.
 // Reintentar vuelve al celular y empieza una investigación nueva desde cero.
 restartCase(){
  const solved=Caught.game.state.correctConclusion===true;
  Caught.ui.evidenceObserver?.disconnect();
  Caught.game.reset();this.loadingGame=false;
  Caught.ui.$('#clue-dialog').close();this.closeApp();
  Caught.ui.$('#found-list').innerHTML='';
  for(const id of ['result-conclusion','result-title','result-explanation','result-progress'])Caught.ui.$('#'+id).textContent='';
  Caught.ui.$('#resolution-screen .answers').innerHTML='';
  Caught.dialogos.showError(false);
  Caught.ui.$('#found-next-button').disabled=false;
  if(solved)this.showScreen('start-screen');else Caught.game.start();
 },
 renderFound(){
  const U=Caught.ui,D=Caught.data,found=D.pistas.filter(p=>Caught.game.state.openedClues.has(p.id_pista));
  U.$('#found-next-button').innerHTML=found.length?'Siguiente <span aria-hidden="true">→</span>':'Revisar de nuevo <span aria-hidden="true">↻</span>';
  const thumb=p=>p.id_pista===4?'<img src="../img/evidencias/bar.jpg" alt="">':(brandIcons[p.origen==='galeria'?'gallery':p.origen==='calendario'?'calendar':p.origen]||'');
  U.$('#found-list').innerHTML=found.map(p=>`<div class="found-row"><span class="found-thumb ${p.origen==='calendario'?'found-calendar':''}">${thumb(p)}</span><span class="found-text"><b>${U.escape(p.tipo)}</b><small>${U.escape(p.descripcion)}</small></span></div>`).join('')||'<p class="found-empty">No encontraste pistas.</p>';
 },
 init(){
  const U=Caught.ui,c=Caught.data.casos[0];
  U.$('#card-title').textContent=c.titulo;U.$('#card-intro').textContent=c.descripcion;
  U.$('#situation-title').textContent=c.titulo;
  U.$('#situation-context').textContent=c.descripcion+' Sospechás que Martín está ocultando algo. Revisá su teléfono para reconstruir lo que pasó.';
  U.$('#mission-text').textContent='• Tenés cinco minutos para investigar, descubrir cinco pistas y sacar tu conclusión.';
  this.renderTicket();
  U.$('#app-grid').innerHTML=this.appList.map(([id,name])=>`<button class="app-icon ${id}" data-app="${id}" aria-label="Abrir ${name}"><span aria-hidden="true">${brandIcons[id]||{notes:'✎',settings:'⚙'}[id]}</span><b>${name}</b></button>`).join('');
  document.querySelectorAll('.dock [data-app]').forEach(b=>b.innerHTML=brandIcons[b.dataset.app]);
  U.$('.weather-card b').textContent='Buenos Aires';U.$('.weather-card strong').textContent='18°';
  this.renderCharacters();Caught.game.reset();
  U.$('#start-button').onclick=()=>this.showScreen('case-card-screen');
  U.$('#expediente-button').onclick=()=>this.showScreen('briefing-screen');
  U.$('#characters-button').onclick=()=>this.showScreen('characters-screen');
  U.$('#characters-more-button').onclick=()=>this.showScreen('clue-screen');
  U.$('#start-investigation-button').onclick=()=>Caught.game.start();
  U.$('#conclusion-button').onclick=()=>Caught.game.finish();
  U.$('#case-file-button').onclick=()=>Caught.game.notebook();
  U.$('#questions-button').onclick=()=>{this.renderFound();this.showScreen('found-screen');};
  U.$('#found-next-button').onclick=()=>{if(Caught.game.state.openedClues.size===0)Caught.game.start();else Caught.dialogos.start();};
  U.$('#form-error').onclick=()=>Caught.dialogos.showError(false);
  U.$('#confirm-button').onclick=()=>Caught.dialogos.confirm();
  U.$('#restart-button').onclick=()=>this.restartCase();
  U.$('#resolution-screen .back-button').onclick=()=>Caught.dialogos.back();
  document.querySelectorAll('[data-screen]').forEach(b=>{if(!b.closest('#resolution-screen'))b.onclick=()=>this.showScreen(b.dataset.screen);});
  document.addEventListener('click',e=>{
   const app=e.target.closest('[data-app]');if(app){this.openApp(app.dataset.app);return;}
   const answer=e.target.closest('[data-answer]');if(answer){Caught.dialogos.choose(answer.dataset.answer);return;}
   const b=e.target.closest('[data-action]');if(!b)return;
   const a=b.dataset.action,v=b.dataset.value;
   if(a==='close')this.closeApp();
   else if(a==='close-dialog'){U.$('#clue-dialog').close();Caught.game.state.activeClue=null;}
   else if(a==='clue'){Caught.game.tick();Caught.game.openClue(v);}
   else if(a==='review-clue'){if(Caught.game.state.openedClues.has(Number(v)))Caught.game.openClue(v,true);}
   else Caught.apps[Caught.currentApp]?.handle(a,v);
  });
  U.$('#app-view').addEventListener('input',e=>Caught.apps[Caught.currentApp]?.input?.(e.target));
  U.$('#clue-dialog').addEventListener('click',e=>{if(e.target===U.$('#clue-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
  U.$('#clue-dialog').addEventListener('close',()=>{Caught.game.state.activeClue=null;});
  const clock=()=>{U.$('#clock').textContent=new Intl.DateTimeFormat('es-AR',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());};
  clock();setInterval(clock,30000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)Caught.game.tick();});
 }
};
document.addEventListener('DOMContentLoaded',()=>Caught.main.init());
/* La misma animación acompaña la primera carga del videojuego. */
window.addEventListener('load',()=>{if(!Caught.main.screenAnimations?.length)Caught.main.waitForLoader().then(()=>document.getElementById('screen-loader')?.classList.remove('is-loading'));});
