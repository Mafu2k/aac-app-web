// AAC Board page logic

let currentBoardId = null;
let sentenceTokens = [];
let userSettings = { darkMode:false, iconSize:96, fontSize:18, fontFamily:'system', gridSize:'3x3', colorScheme:'day' };
let currentSymbols = [];
let filterQuery = '';
let draggedSymbolId = null;
let recognizing = false;

function applySettingsToUI(){
  // Load accessibility settings from localStorage
  const accessibilitySettings = JSON.parse(localStorage.getItem('aac_accessibility') || '{}');

  // Merge accessibility settings with user settings
  Object.assign(userSettings, accessibilitySettings);

  // Dark mode
  applyDarkMode(!!userSettings.darkMode);

  // High contrast
  document.body.classList.toggle('high-contrast', !!userSettings.highContrast);

  // Reduced motion
  document.body.classList.toggle('reduce-motion', !!userSettings.reduceMotion);

  // Screen reader mode
  document.body.classList.toggle('screen-reader-mode', !!(userSettings.screenReader || userSettings.screenReaderMode));

  // Zoom
  if(userSettings.zoomLevel) {
    document.body.style.zoom = userSettings.zoomLevel / 100;
  }

  // Font size and icon size
  document.documentElement.style.setProperty('--btn-size', (userSettings.iconSize||96)+'px');
  document.documentElement.style.setProperty('--font-size', (userSettings.fontSize||18)+'px');
  document.documentElement.style.fontSize = (userSettings.fontSize||18)+'px';

  const map = {
    'system': 'system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif',
    'comic-sans': '"Comic Sans MS", "Comic Sans", cursive',
    'arial': 'Arial, Helvetica, sans-serif'
  };
  const fam = userSettings.fontFamily && map[userSettings.fontFamily] ? map[userSettings.fontFamily] : map['system'];
  document.documentElement.style.setProperty('--font-family', fam);

  const grid = document.getElementById('boardGrid');
  if(grid){
    const cols = (userSettings.gridSize||'3x3').split('x')[1] || '3';
    grid.style.gridTemplateColumns = `repeat(${parseInt(cols,10)||3}, minmax(0,1fr))`;
  }
}

function renderSentence(){
  const wrap = document.getElementById('sentenceText');
  wrap.innerHTML = '';
  sentenceTokens.forEach((t, idx) => {
    const chip = document.createElement('span');
    chip.className = 'sentence__token';
    chip.textContent = t;
    chip.title = 'Kliknij aby usunąć';
    chip.tabIndex = 0;
    chip.addEventListener('click', () => { sentenceTokens.splice(idx,1); renderSentence(); updateSuggestions(); });
    chip.addEventListener('keydown', (e) => { if(e.key==='Enter'||e.key===' '){ sentenceTokens.splice(idx,1); renderSentence(); updateSuggestions(); }});
    wrap.appendChild(chip);
  });
}

function addToSentence(text){
  if(!text) return;
  sentenceTokens.push(text);
  renderSentence();
  updateSuggestions();
}

async function updateSuggestions(){
  const list = await fetchSuggestionsFromAPI(sentenceTokens.join(' '), sentenceTokens);
  renderSuggestions(list, (s) => { addToSentence(s); });
}

function renderSymbolCell(sym){
  const btn = document.createElement('button');
  btn.className = 'symbol';
  btn.setAttribute('role','gridcell');
  btn.setAttribute('aria-label', sym.label);
  btn.dataset.dwell = 'true';
  btn.dataset.id = String(sym.id);
  btn.draggable = filterQuery === '';
  if(sym.color){ btn.style.background = sym.color; }
  const hasImg = !!sym.imageUrl;
  if(hasImg){
    const img = document.createElement('img');
    img.src = sym.imageUrl;
    img.alt = sym.label;
    img.className = 'symbol__img';
    btn.appendChild(img);
  } else if (sym.glyph) {
    const em = document.createElement('div');
    em.className = 'symbol__emoji';
    em.textContent = sym.glyph;
    btn.appendChild(em);
  }
  const label = document.createElement('div');
  label.className = 'symbol__label';
  label.textContent = sym.label;
  btn.appendChild(label);

  btn.addEventListener('click', () => {
    addToSentence(sym.ttsText || sym.label);
  });

  // Drag & drop
  btn.addEventListener('dragstart', (e) => {
    draggedSymbolId = sym.id;
    btn.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  btn.addEventListener('dragend', () => {
    btn.classList.remove('dragging');
    draggedSymbolId = null;
    Array.from(document.querySelectorAll('.symbol.drop-target')).forEach(el=>el.classList.remove('drop-target'));
  });
  btn.addEventListener('dragover', (e) => {
    if(draggedSymbolId!=null){ e.preventDefault(); btn.classList.add('drop-target'); }
  });
  btn.addEventListener('dragleave', () => { btn.classList.remove('drop-target'); });
  btn.addEventListener('drop', async (e) => {
    e.preventDefault();
    btn.classList.remove('drop-target');
    if(draggedSymbolId==null) return;
    if(draggedSymbolId === sym.id) return;
    // Reorder currentSymbols: move dragged before drop target
    const ids = currentSymbols.map(s=>s.id);
    const fromIdx = ids.indexOf(draggedSymbolId);
    const toIdx = ids.indexOf(sym.id);
    if(fromIdx>-1 && toIdx>-1){
      const [moved] = currentSymbols.splice(fromIdx,1);
      currentSymbols.splice(toIdx,0,moved);
      await renderGrid(currentSymbols);
      try{
        await apiPut(`/api/boards/${currentBoardId}/symbols/reorder`, currentSymbols.map(s=>s.id));
      }catch(err){ toast('Nie udało się zapisać kolejności'); }
    }
  });

  // delete button
  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'symbol__remove';
  del.setAttribute('aria-label','Usuń symbol');
  del.textContent = '×';
  del.addEventListener('click', async (ev) => {
    ev.stopPropagation();
    if(!confirm('Usunąć ten symbol?')) return;
    try{
      await apiDelete(`/api/boards/${currentBoardId}/symbols/${sym.id}`);
      await loadSymbols(currentBoardId);
    }catch(e){ toast('Nie udało się usunąć symbolu'); }
  });
  btn.style.position='relative';
  btn.appendChild(del);
  return btn;
}

async function renderGrid(symbols){
  const grid = document.getElementById('boardGrid');
  grid.innerHTML = '';
  symbols.forEach(sym => grid.appendChild(renderSymbolCell(sym)));
}

function filteredSymbols(){
  if(!filterQuery) return currentSymbols;
  const q = filterQuery.toLowerCase();
  return currentSymbols.filter(s => (s.label||'').toLowerCase().includes(q) || (s.glyph||'').toLowerCase().includes(q));
}

function applyFilterAndRender(){
  const list = filteredSymbols();
  renderGrid(list);
}

async function copyToClipboard(text){
  try{ await navigator.clipboard.writeText(text); toast('Skopiowano do schowka'); }
  catch(e){ toast('Skopiuj ręcznie: '+text); }
}

function shareSentence(){
  const text = sentenceTokens.join(' ');
  if(!text){ toast('Zdanie jest puste'); return; }
  if(navigator.share){ navigator.share({ text }).catch(()=>copyToClipboard(text)); }
  else { copyToClipboard(text); }
}

async function panic(){
  const msg = 'Potrzebuję pomocy!';
  speakAlways(msg);
  if(navigator.vibrate){ navigator.vibrate([200,100,200]); }
  sentenceTokens = [msg];
  renderSentence();
  apiPost('/api/history', { content: msg }).catch(()=>{});

  // Pobierz ustawienia SOS z localStorage
  const sosSettings = JSON.parse(localStorage.getItem('aac_sos') || '{}');
  const profileSettings = JSON.parse(localStorage.getItem('aac_profile') || '{}');

  // Sprawdź czy są skonfigurowane ustawienia SOS
  if (!sosSettings.sosType) {
    toast('⚠️ Najpierw skonfiguruj ustawienia SOS w Ustawieniach!');
    setTimeout(() => {
      window.location.href = '/settings?tab=sos';
    }, 2000);
    return;
  }

  // Spróbuj pobrać lokalizację
  let location = 'Lokalizacja niedostępna';
  if (navigator.geolocation) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      location = `Lat: ${pos.coords.latitude.toFixed(6)}, Lon: ${pos.coords.longitude.toFixed(6)}`;
      location += `\nGoogle Maps: https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
    } catch (e) {
      console.log('Nie można pobrać lokalizacji');
    }
  }

  // Przygotuj dane SOS
  const sosData = {
    sosType: sosSettings.sosType || 'emergency',
    sosEmail: sosSettings.sosEmail,
    sosPhone1: sosSettings.sosPhone1,
    sosPhone2: sosSettings.sosPhone2,
    userName: profileSettings.userName || 'Użytkownik AAC',
    message: 'PILNE! Użytkownik aplikacji AAC potrzebuje natychmiastowej pomocy!',
    location: location
  };

  // Wyświetl komunikat ładowania
  toast('📤 Wysyłanie SOS...');

  try {
    const response = await apiPost('/api/sos/trigger', sosData);

    if (response.success) {
      toast('✅ SOS wysłane: ' + response.message);
      speakAlways('SOS zostało wysłane');
    } else {
      toast('❌ Błąd: ' + response.message);
    }
  } catch (error) {
    console.error('Błąd wysyłania SOS:', error);
    toast('❌ Błąd wysyłania SOS. Sprawdź połączenie z internetem.');
  }

  // Jeśli tryb emergency, pokaż instrukcję
  if (sosSettings.sosType === 'emergency') {
    setTimeout(() => {
      if (confirm('Czy chcesz zadzwonić na numer alarmowy 112?')) {
        window.location.href = 'tel:112';
      }
    }, 1000);
  }

  // Spróbuj też udostępnić przez system
  if(navigator.share){
    try {
      await navigator.share({
        title: 'SOS - Potrzebuję pomocy!',
        text: `${sosData.userName} potrzebuje pomocy!\n\nLokalizacja:\n${location}`
      });
    } catch(e) {
      console.log('Share nie powiodło się');
    }
  }
}

function setupMic(){
  const btn = document.getElementById('micBtn');
  if(!btn) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ btn.disabled = true; btn.title = 'Brak wsparcia rozpoznawania mowy'; return; }
  const rec = new SR();
  rec.lang = 'pl-PL';
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    const text = e.results[0][0].transcript.trim();
    const searchEl = document.getElementById('searchInput');
    if(searchEl) searchEl.value = text;
    filterQuery = text;
    applyFilterAndRender();
    recognizing = false;
    btn.setAttribute('aria-pressed','false');
  };
  rec.onend = () => { recognizing = false; btn.setAttribute('aria-pressed','false'); };
  btn.addEventListener('click', () => {
    if(recognizing){ rec.stop(); recognizing = false; btn.setAttribute('aria-pressed','false'); return; }
    recognizing = true; btn.setAttribute('aria-pressed','true'); rec.start();
  });
}

async function loadSymbols(boardId){
  const symbols = await apiGet(`/api/boards/${boardId}/symbols`);
  currentSymbols = symbols;
  applyFilterAndRender();
}

async function loadBoards(){
  const boards = await apiGet('/api/boards');
  const select = document.getElementById('boardSelect');
  select.innerHTML = '';
  if(boards.length === 0){
    // utwórz domyślną
    const dto = { name:'Moja tablica', layout: userSettings.gridSize || '3x3', colorScheme: userSettings.colorScheme || 'day' };
    const created = await apiPost('/api/boards', dto);
    boards.push(created);
  }
  boards.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = b.name;
    select.appendChild(opt);
  });
  currentBoardId = boards[0].id;
  select.value = String(currentBoardId);
  await loadSymbols(currentBoardId);
}

async function addSymbolFlow(){
  // Open modal and set up handlers
  const modal = document.getElementById('symbolModal');
  if(!modal) return;
  modal.removeAttribute('hidden');
  const $ = (id) => document.getElementById(id);
  const symLabel = $('symLabel');
  const symTts = $('symTts');
  const symColor = $('symColor');
  const symEmoji = $('symEmoji');
  const symImageUrl = $('symImageUrl');
  const symFile = $('symFile');
  const cancelBtn = $('symCancel');
  const saveBtn = $('symSave');

  // Defaults
  symLabel.value = '';
  symTts.value = '';
  symColor.value = '#FFD93D';
  symEmoji.value = '';
  symImageUrl.value = '';
  symFile.value = '';

  // Emoji picker buttons
  const list = document.getElementById('emojiList');
  if(list && !list.dataset.bound){
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if(btn){ symEmoji.value = btn.textContent; }
    });
    list.dataset.bound = '1';
  }

  function close(){ modal.setAttribute('hidden', ''); }
  if(!cancelBtn.dataset.bound){
    cancelBtn.addEventListener('click', close);
    cancelBtn.dataset.bound = '1';
  }

  if(!saveBtn.dataset.bound){
    saveBtn.addEventListener('click', async () => {
      try{
        const label = symLabel.value.trim();
        if(!label){ toast('Podaj etykietę'); return; }
        const ttsText = (symTts.value.trim() || label);
        const color = symColor.value.trim() || '#FFD93D';
        const glyph = symEmoji.value.trim();
        let imageUrl = symImageUrl.value.trim();
        const file = symFile.files && symFile.files[0];
        if(file){
          if(!navigator.onLine){ toast('Brak internetu: nie można wgrać obrazka'); return; }
          const up = await apiUpload('/api/uploads', file);
          imageUrl = (up && up.url) ? up.url : imageUrl;
        }
        const dto = { label, ttsText, imageUrl: imageUrl || null, glyph: glyph || null, color };
        await apiPost(`/api/boards/${currentBoardId}/symbols`, dto);
        close();
        await loadSymbols(currentBoardId);
      }catch(e){ toast('Nie udało się zapisać symbolu'); }
    });
    saveBtn.dataset.bound = '1';
  }
}

async function renameBoardFlow(){
  const select = document.getElementById('boardSelect');
  const current = select.options[select.selectedIndex];
  const name = prompt('Nowa nazwa tablicy', current.textContent || 'Tablica');
  if(!name) return;
  await apiPut(`/api/boards/${currentBoardId}`, { name });
  await loadBoards();
}

async function deleteBoardFlow(){
  if(!confirm('Usunąć bieżącą tablicę?')) return;
  await apiDelete(`/api/boards/${currentBoardId}`);
  await loadBoards();
}

async function saveHistory(){
  const content = sentenceTokens.join(' ');
  if(!content){ toast('Zdanie jest puste'); return; }
  await apiPost('/api/history', { content });
  toast('Zapisano w historii');
  await loadHistory();
}

async function loadHistory(){
  try{
    const list = await apiGet('/api/history');
    const wrap = document.getElementById('historyList');
    wrap.innerHTML = '';
    list.forEach(item => {
      const div = document.createElement('div');
      div.className = 'history-item';

      const btn = document.createElement('button');
      btn.className = 'btn btn--secondary';
      btn.textContent = 'Powiedz';
      btn.style.marginRight = '.5rem';
      btn.addEventListener('click', () => speakAlways(item.content));

      const span = document.createElement('span');
      span.textContent = item.content;
      span.style.flex = '1';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn--danger';
      deleteBtn.textContent = '×';
      deleteBtn.style.marginLeft = '.5rem';
      deleteBtn.setAttribute('aria-label', 'Usuń z historii');
      deleteBtn.addEventListener('click', async () => {
        if(confirm('Usunąć ten wpis z historii?')){
          try{
            await apiDelete(`/api/history/${item.id}`);
            await loadHistory();
            toast('Usunięto z historii');
          }catch(e){
            toast('Nie udało się usunąć');
          }
        }
      });

      div.appendChild(btn);
      div.appendChild(span);
      div.appendChild(deleteBtn);
      wrap.appendChild(div);
    });
  }catch(e){ /* ignore */ }
}

document.addEventListener('DOMContentLoaded', async () => {
  getTokenOrRedirect();
  try{
    userSettings = await apiGet('/api/settings');
  }catch(e){ /* ignore */ }
  applySettingsToUI();

  await loadBoards();
  await loadHistory();
  renderSentence();
  updateSuggestions();

  // Board selection
  document.getElementById('boardSelect').addEventListener('change', async (e) => {
    currentBoardId = e.target.value;
    await loadSymbols(currentBoardId);
  });
  // Symbol flows
  document.getElementById('addSymbolBtn').addEventListener('click', addSymbolFlow);
  document.getElementById('newBoardBtn').addEventListener('click', async () => {
    const name = prompt('Nazwa tablicy', 'Nowa tablica');
    if(!name) return;
    const dto = { name, layout: userSettings.gridSize || '3x3', colorScheme: userSettings.colorScheme || 'day' };
    await apiPost('/api/boards', dto);
    await loadBoards();
    speakAlways('Utworzono tablicę');
  });
  document.getElementById('renameBoardBtn').addEventListener('click', renameBoardFlow);
  document.getElementById('deleteBoardBtn').addEventListener('click', deleteBoardFlow);

  // Sentence actions
  document.getElementById('speakBtn').addEventListener('click', () => speakTokens(sentenceTokens));
  document.getElementById('clearBtn').addEventListener('click', () => { sentenceTokens = []; renderSentence(); updateSuggestions(); });
  document.getElementById('saveHistoryBtn').addEventListener('click', saveHistory);
  const shareBtn = document.getElementById('shareBtn');
  if(shareBtn){ shareBtn.addEventListener('click', shareSentence); }

  // Search & mic
  const searchEl = document.getElementById('searchInput');
  if(searchEl){ searchEl.addEventListener('input', (e)=>{ filterQuery = (e.target.value||'').trim(); applyFilterAndRender(); }); }
  setupMic();

  // Panic
  const panicBtn = document.getElementById('panicBtn');
  if(panicBtn){ panicBtn.addEventListener('click', panic); }
});
