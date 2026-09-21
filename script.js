const screens = document.querySelectorAll('.screen');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const openedClues = new Set();
let activeClue = null;
const CASE_TIME_SECONDS = 180;
let remainingSeconds = CASE_TIME_SECONDS;
let timerId = null;

const clues = {
  ticket: {
    type: 'TICKET ENCONTRADO', title: 'Ticket de Bar Central',
    note: 'El ticket marca las 23:15 y corresponde a una mesa para dos. Parece contradecir la excusa de la oficina.',
    content: `<div class="clue-content receipt">BAR CENTRAL<br>VIERNES · 23:15<br>--------------------------<br>Mesa para dos&nbsp;&nbsp;&nbsp; $12.800<br>Dos bebidas&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $5.400<br>--------------------------<br>PAGO APROBADO<br><br><small>Un ticket aislado no explica con quién estuvo Martín ni por qué.</small></div>`
  },
  chat: {
    type: 'CHAT RECUPERADO', title: 'Conversación con Nico',
    note: 'A las 22:41, Martín y Nico acuerdan encontrarse en Bar Central y no revelar el plan todavía.',
    content: `<div class="clue-content chat-sample"><div class="bubble">Martín: ¿Podés llegar antes de las once?</div><div class="bubble right">Nico: Sí, llevo las opciones del viaje.</div><div class="bubble">Martín: Perfecto. No le digas nada todavía, quiero que sea sorpresa.</div><small>Viernes · 22:41 · Parte de la conversación fue eliminada</small></div>`
  },
  photo: {
    type: 'EVIDENCIA 03 · FOTOGRAFÍA', title: 'Foto de la galería',
    note: 'La imagen muestra a Lucía y Valentina esa tarde; confirma que Valentina no estaba con Martín en el bar.',
content: `<div class="clue-content photo-clue"><img src="./img/evidencia.jpeg" alt="Lucía y Valentina paseando por el parque"><p>La metadata indica <strong>Parque Central · 18:12</strong>. Valentina aparece con Lucía durante la tarde y no hay ninguna señal que la vincule con el encuentro de las 23:15.</p><small>La imagen descarta una teoría, pero no resuelve el caso por sí sola.</small></div>`
  }
};

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle('hidden', screen.id !== id));
}

function selectTab(panelId) {
  tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.panel === panelId));
  panels.forEach(panel => panel.classList.toggle('active', panel.id === panelId));
}

function updateClueStatus() {
  const count = openedClues.size;
  document.getElementById('clue-count').textContent = `${count}/3`;
  document.getElementById('solve-button').disabled = count < 3;
  document.getElementById('notes-empty').classList.toggle('hidden', count > 0);
}

function openClue(id) {
  activeClue = id;
  const clue = clues[id];
  document.getElementById('modal-type').textContent = clue.type;
  document.getElementById('modal-title').textContent = clue.title;
  document.getElementById('modal-content').innerHTML = clue.content;
  document.getElementById('save-clue-button').textContent = openedClues.has(id) ? 'Evidencia guardada ✓' : 'Guardar en notas';
  document.getElementById('clue-modal').classList.remove('hidden');
}

function saveClue() {
  if (!openedClues.has(activeClue)) {
    openedClues.add(activeClue);
    const clue = clues[activeClue];
    const item = document.createElement('li');
    item.innerHTML = `<strong>${clue.title}</strong>${clue.note}`;
    document.getElementById('notes-list').append(item);
    document.querySelector(`[data-clue="${activeClue}"]`).classList.add('viewed');
    updateClueStatus();
  }
  document.getElementById('clue-modal').classList.add('hidden');
}

function startTimer() {
  clearInterval(timerId);
  remainingSeconds = CASE_TIME_SECONDS;
  renderTimer();
  timerId = setInterval(() => {
    remainingSeconds--;
    renderTimer();
    if (remainingSeconds <= 0) {
      clearInterval(timerId);
      endCase(false, 'Se acabó el tiempo', 'No alcanzaste a revisar toda la información. En Caught! siempre podés volver a analizar las pistas y probar otra teoría.');
    }
  }, 1000);
}

function renderTimer() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = String(remainingSeconds % 60).padStart(2, '0');
  const timer = document.getElementById('timer');
  timer.textContent = `${minutes}:${seconds}`;
  timer.classList.toggle('urgent', remainingSeconds <= 60);
  document.getElementById('progress-bar').style.width = `${Math.max(0, remainingSeconds / CASE_TIME_SECONDS * 100)}%`;
}

function addDialogue(kind) {
  const options = document.getElementById('dialogue-options');
  const messages = {
    office: ['¿Por qué el ticket de Bar Central dice 23:15?', 'No seguía en la oficina. Te mentí porque no quería arruinar una sorpresa.'],
    nico: ['Nico, ¿por qué aparece un chat eliminado con Martín?', 'Nos vimos para elegir el viaje de aniversario. Él quería contártelo cuando estuviera listo.']
  };
  const [question, answer] = messages[kind];
  const log = document.getElementById('dialogue-log');
  const speaker = kind === 'nico' ? 'Nico' : 'Martín';
  log.insertAdjacentHTML('beforeend', `<div class="message message-self"><span>Vos</span><p>${question}</p><time>23:24</time></div><div class="message message-other"><span>${speaker}</span><p>${answer}</p><time>23:24</time></div>`);
  document.querySelector(`[data-dialogue="${kind}"]`).disabled = true;
  document.querySelector(`[data-dialogue="${kind}"]`).style.opacity = '.45';
  options.querySelectorAll('button:disabled').length === 2 && (document.getElementById('objective').textContent = 'Contrastá las respuestas con el ticket, el chat y la fotografía antes de decidir.');
}

function endCase(success, title, copy) {
  clearInterval(timerId);
  document.getElementById('result-symbol').textContent = success ? '✓' : '×';
  document.getElementById('result-symbol').classList.toggle('fail', !success);
  document.getElementById('result-kicker').textContent = success ? 'CASO RESUELTO' : 'TEORÍA INCOMPLETA';
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-copy').textContent = copy;
  document.getElementById('result-summary').innerHTML = success ? '<strong>La clave del caso:</strong><br>El ticket demuestra que Martín estuvo en el bar, pero el chat y la foto explican con quién: se reunió con Nico para planear un viaje sorpresa de aniversario.' : '<strong>Consejo de detective:</strong><br>El ticket parece sospechoso, pero una sola pista no alcanza. La conclusión correcta debe explicar también el chat y la fotografía.';
  showScreen('result-screen');
}

function resetGame() {
  openedClues.clear(); activeClue = null; clearInterval(timerId);
  document.querySelectorAll('.evidence-card').forEach(card => card.classList.remove('viewed'));
  document.getElementById('notes-list').innerHTML = '';
  document.getElementById('dialogue-log').innerHTML = '<div class="message message-other"><span>Martín</span><p>Perdón por cancelar. Seguía en la oficina cerrando el balance.</p><time>23:22</time></div>';
  document.querySelectorAll('[data-dialogue]').forEach(button => { button.disabled = false; button.style.opacity = '1'; });
  document.getElementById('objective').textContent = 'Martín dejó su celular desbloqueado. Tenés 30 segundos para revisar las pistas.';
  updateClueStatus();
  showScreen('start-screen');
}

document.getElementById('start-button').addEventListener('click', () => showScreen('briefing-screen'));
document.querySelector('.back-to-start').addEventListener('click', () => showScreen('start-screen'));
document.getElementById('characters-button').addEventListener('click', () => showScreen('characters-screen'));
document.querySelector('.back-to-briefing').addEventListener('click', () => showScreen('briefing-screen'));
document.getElementById('enter-case-button').addEventListener('click', () => { showScreen('game-screen'); startTimer(); });
tabs.forEach(tab => tab.addEventListener('click', () => selectTab(tab.dataset.panel)));
document.querySelectorAll('[data-clue]').forEach(card => card.addEventListener('click', () => openClue(card.dataset.clue)));
document.getElementById('close-modal').addEventListener('click', () => document.getElementById('clue-modal').classList.add('hidden'));
document.getElementById('save-clue-button').addEventListener('click', saveClue);
document.querySelectorAll('[data-dialogue]').forEach(button => button.addEventListener('click', () => addDialogue(button.dataset.dialogue)));
document.getElementById('solve-button').addEventListener('click', () => document.getElementById('conclusion-modal').classList.remove('hidden'));
document.getElementById('close-conclusion').addEventListener('click', () => document.getElementById('conclusion-modal').classList.add('hidden'));
document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => { document.getElementById('conclusion-modal').classList.add('hidden'); const correct = button.dataset.answer === 'surprise'; endCase(correct, correct ? 'El detalle hacía la diferencia.' : 'Esa teoría no explica todas las pistas.', correct ? 'Martín no estaba ocultando una infidelidad: junto a Nico organizaba un viaje sorpresa de aniversario.' : 'Revisá cómo se relacionan el ticket, el chat y la fotografía antes de acusar a Martín.'); }));
document.getElementById('restart-button').addEventListener('click', resetGame);
updateClueStatus();
