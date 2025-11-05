(function() {
  'use strict';

  const state = {
    fontSize: 18,
    iconSize: 96,
    highContrast: false,
    reducedMotion: false,
    darkMode: false,
    voiceEnabled: false,
    screenReader: false,
    screenReaderMode: false,
    ttsVolume: 100,
    ttsRate: 1.0,
    ttsPitch: 1.0,
    zoomLevel: 100,
    voiceControl: false,
    eyeTracking: false
  };

  function initAccessibilityPanel() {
    createPanel();
    loadSettings();
    attachEventListeners();
    announceToScreenReader('Panel dostępności załadowany');

    window.addEventListener('storage', function(e) {
      if (e.key === 'aac_accessibility') {
        loadSettings();
      }
    });
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.className = 'accessibility-panel';
    panel.setAttribute('role', 'toolbar');
    panel.setAttribute('aria-label', 'Panel dostępności');

    panel.innerHTML = `
      <button class="a11y-toggle" aria-label="Otwórz panel dostępności" aria-expanded="false">
        <span class="a11y-icon">♿</span>
      </button>
      <div class="a11y-controls" hidden>
        <h3 class="a11y-title">Dostępność</h3>

        <div class="a11y-control-group">
          <label class="a11y-label">Rozmiar tekstu</label>
          <div class="a11y-button-group" role="group" aria-label="Rozmiar czcionki">
            <button class="a11y-btn" data-action="font-decrease" aria-label="Zmniejsz czcionkę">A-</button>
            <button class="a11y-btn" data-action="font-reset" aria-label="Resetuj czcionkę">A</button>
            <button class="a11y-btn" data-action="font-increase" aria-label="Powiększ czcionkę">A+</button>
          </div>
        </div>

        <div class="a11y-control-group">
          <label class="a11y-label">
            <input type="checkbox" id="a11y-darkMode" class="a11y-checkbox" aria-label="Włącz tryb ciemny">
            Tryb ciemny
          </label>
        </div>

        <div class="a11y-control-group">
          <label class="a11y-label">
            <input type="checkbox" id="a11y-highContrast" class="a11y-checkbox" aria-label="Włącz wysoki kontrast">
            Wysoki kontrast
          </label>
        </div>

        <div class="a11y-control-group">
          <label class="a11y-label">
            <input type="checkbox" id="a11y-reducedMotion" class="a11y-checkbox" aria-label="Wyłącz animacje">
            Bez animacji
          </label>
        </div>

        <div class="a11y-control-group">
          <label class="a11y-label">
            <input type="checkbox" id="a11y-voiceControl" class="a11y-checkbox" aria-label="Włącz sterowanie głosem">
            Sterowanie głosem
          </label>
          <button class="a11y-btn a11y-btn--help" data-action="show-voice-help" aria-label="Pokaż komendy głosowe" title="Pokaż dostępne komendy głosowe">
            ❓
          </button>
        </div>

        <div class="a11y-control-group">
          <label class="a11y-label">
            <input type="checkbox" id="a11y-screenReader" class="a11y-checkbox" aria-label="Tryb czytnika ekranu">
            Czytnik ekranu
          </label>
        </div>

        <button class="a11y-btn a11y-btn--reset" data-action="reset-all" aria-label="Resetuj wszystkie ustawienia">
          Resetuj wszystko
        </button>
      </div>
    `;

    document.body.appendChild(panel);
    createVoiceCommandsHelp();
  }

  function createVoiceCommandsHelp() {
    const helpPanel = document.createElement('div');
    helpPanel.id = 'voice-commands-help';
    helpPanel.className = 'voice-help-panel';
    helpPanel.hidden = true;
    helpPanel.setAttribute('role', 'dialog');
    helpPanel.setAttribute('aria-label', 'Komendy głosowe');

    helpPanel.innerHTML = `
      <div class="voice-help-content">
        <div class="voice-help-header">
          <h3>🎤 Komendy głosowe</h3>
          <button class="voice-help-close" aria-label="Zamknij">✕</button>
        </div>
        <div class="voice-help-body">
          <div class="voice-help-section">
            <h4>📏 Rozmiar tekstu:</h4>
            <ul>
              <li><strong>"powiększ"</strong> - zwiększ czcionkę</li>
              <li><strong>"pomniejsz"</strong> - zmniejsz czcionkę</li>
              <li><strong>"większa czcionka"</strong> - zwiększ czcionkę</li>
              <li><strong>"mniejsza czcionka"</strong> - zmniejsz czcionkę</li>
            </ul>
          </div>

          <div class="voice-help-section">
            <h4>🎨 Wygląd:</h4>
            <ul>
              <li><strong>"kontrast"</strong> - przełącz wysoki kontrast</li>
            </ul>
          </div>

          <div class="voice-help-section">
            <h4>🧭 Nawigacja:</h4>
            <ul>
              <li><strong>"strona główna"</strong> - wróć do menu głównego</li>
              <li><strong>"tablica"</strong> - otwórz tablicę komunikacyjną</li>
              <li><strong>"ustawienia"</strong> - otwórz ustawienia</li>
              <li><strong>"nauka"</strong> - otwórz moduł nauki</li>
              <li><strong>"profil"</strong> - otwórz profil użytkownika</li>
            </ul>
          </div>

          <div class="voice-help-section">
            <h4>💡 Wskazówki:</h4>
            <ul>
              <li>Mów wyraźnie i spokojnie</li>
              <li>Używaj krótkich komend</li>
              <li>Możesz używać zamienników (np. "start" zamiast "strona główna")</li>
              <li>Aplikacja automatycznie ponawia nasłuchiwanie</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(helpPanel);
  }

  function loadSettings() {
    const saved = localStorage.getItem('aac_accessibility');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        Object.assign(state, settings);
        applyAllSettings();
      } catch (e) {
        console.error('Błąd wczytywania ustawień:', e);
      }
    }
  }

  function saveSettings() {
    localStorage.setItem('aac_accessibility', JSON.stringify(state));

    if (typeof window.loadGlobalAccessibilitySettings === 'function') {
      window.loadGlobalAccessibilitySettings();
    }

    window.dispatchEvent(new CustomEvent('accessibility-settings-changed', { detail: state }));
  }

  function applyAllSettings() {
    applyFontSize();
    applyHighContrast();
    applyReducedMotion();
    applyDarkMode();
    applyZoom();
    updateCheckboxes();

    if (state.screenReader || state.screenReaderMode) {
      document.body.classList.add('screen-reader-mode');
      enableScreenReaderInteractions();
    }

    if (state.voiceEnabled || state.voiceControl) {
      startVoiceRecognition();
    }
  }

  function applyFontSize() {
    const rootFontSize = state.fontSize + 'px';
    document.documentElement.style.setProperty('--font-size', rootFontSize);
    document.documentElement.style.fontSize = rootFontSize;
    announceToScreenReader(`Rozmiar czcionki: ${state.fontSize} pikseli`);
  }

  function changeFontSize(delta) {
    state.fontSize = Math.max(14, Math.min(32, state.fontSize + delta));
    applyFontSize();
    saveSettings();
  }

  function applyHighContrast() {
    document.body.classList.toggle('high-contrast', state.highContrast);
    if (state.highContrast) {
      announceToScreenReader('Wysoki kontrast włączony');
    }
  }

  function applyReducedMotion() {
    document.body.classList.toggle('reduce-motion', state.reducedMotion);
    if (state.reducedMotion) {
      announceToScreenReader('Animacje wyłączone');
    }
  }

  function applyDarkMode() {
    document.body.classList.toggle('dark', state.darkMode);
  }

  function applyZoom() {
    if (state.zoomLevel) {
      document.body.style.zoom = state.zoomLevel / 100;
    }
  }

  function toggleVoiceControl() {
    state.voiceEnabled = !state.voiceEnabled;
    if (state.voiceEnabled) {
      startVoiceRecognition();
      announceToScreenReader('Sterowanie głosem włączone');
    } else {
      stopVoiceRecognition();
      announceToScreenReader('Sterowanie głosem wyłączone');
    }
    saveSettings();
  }

  function toggleScreenReaderMode() {
    state.screenReader = !state.screenReader;
    state.screenReaderMode = state.screenReader;
    document.body.classList.toggle('screen-reader-mode', state.screenReader);

    if (state.screenReader) {
      announceToScreenReader('Tryb czytnika ekranu włączony. Wszystkie elementy mają opisy dla czytników ekranu.');
      speakText('Tryb czytnika ekranu włączony. Najedź myszą lub kliknij na elementy, aby je przeczytać.');
      enableScreenReaderInteractions();
    } else {
      window.speechSynthesis.cancel();
      disableScreenReaderInteractions();
    }
    saveSettings();
  }

  function speakText(text) {
    if (!state.screenReader && !state.screenReaderMode) {
      return;
    }

    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech nie jest dostępny w tej przeglądarce');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = state.ttsRate || 1.0;
    utterance.pitch = state.ttsPitch || 1.0;
    utterance.volume = (state.ttsVolume || 100) / 100;

    utterance.onerror = function(event) {
      console.error('Speech synthesis error:', event);
    };

    window.speechSynthesis.speak(utterance);
  }

  function enableScreenReaderInteractions() {
    document.querySelectorAll('button, a, input, select, textarea, .symbol, .dashboard-tile').forEach(el => {
      el.addEventListener('mouseenter', readElement);
      el.addEventListener('focus', readElement);
    });

    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
      el.addEventListener('mouseenter', function() {
        speakText('Nagłówek: ' + this.textContent.trim());
      });
    });

    document.querySelectorAll('label').forEach(el => {
      el.addEventListener('mouseenter', function() {
        speakText(this.textContent.trim());
      });
    });
  }

  function disableScreenReaderInteractions() {
    window.speechSynthesis.cancel();
    document.querySelectorAll('button, a, input, select, textarea, .symbol, .dashboard-tile, h1, h2, h3, h4, h5, h6, label').forEach(el => {
      el.removeEventListener('mouseenter', readElement);
      el.removeEventListener('focus', readElement);
    });
  }

  function readElement() {
    if (!state.screenReader) return;

    if (this.hasAttribute('data-no-speak')) {
      return;
    }

    if (this.classList.contains('control-button') ||
        this.closest('.sentence-controls') ||
        this.innerHTML.includes('🔊') ||
        this.innerHTML.includes('🗑️') ||
        this.innerHTML.includes('💾') ||
        this.innerHTML.includes('📤')) {
      return;
    }

    let textToRead = '';

    if (this.hasAttribute('aria-label')) {
      textToRead = this.getAttribute('aria-label');
    }
    else if (this.hasAttribute('title')) {
      textToRead = this.getAttribute('title');
    }
    else if (this.tagName === 'A' || this.tagName === 'BUTTON') {
      textToRead = (this.tagName === 'A' ? 'Link: ' : 'Przycisk: ') + this.textContent.trim();
    }
    else if (this.tagName === 'INPUT' && this.placeholder) {
      textToRead = 'Pole: ' + this.placeholder;
    }
    else if (this.tagName === 'INPUT' || this.tagName === 'TEXTAREA' || this.tagName === 'SELECT') {
      const label = document.querySelector(`label[for="${this.id}"]`);
      if (label) {
        textToRead = 'Pole: ' + label.textContent.trim();
      } else {
        textToRead = 'Pole formularza';
      }
    }
    else if (this.classList.contains('dashboard-tile')) {
      const title = this.querySelector('.dashboard-tile__title');
      const desc = this.querySelector('.dashboard-tile__desc');
      if (title) {
        textToRead = title.textContent.trim();
        if (desc) textToRead += '. ' + desc.textContent.trim();
      }
    }
    else if (this.classList.contains('symbol')) {
      const label = this.querySelector('.symbol__label');
      if (label) {
        textToRead = 'Symbol: ' + label.textContent.trim();
      }
    }
    else {
      textToRead = this.textContent.trim();
    }

    if (textToRead) {
      speakText(textToRead);
    }
  }

  function updateCheckboxes() {
    const darkModeCb = document.getElementById('a11y-darkMode');
    const highContrastCb = document.getElementById('a11y-highContrast');
    const reducedMotionCb = document.getElementById('a11y-reducedMotion');
    const voiceControlCb = document.getElementById('a11y-voiceControl');
    const screenReaderCb = document.getElementById('a11y-screenReader');

    if (darkModeCb) darkModeCb.checked = state.darkMode;
    if (highContrastCb) highContrastCb.checked = state.highContrast;
    if (reducedMotionCb) reducedMotionCb.checked = state.reducedMotion;
    if (voiceControlCb) voiceControlCb.checked = state.voiceEnabled;
    if (screenReaderCb) screenReaderCb.checked = state.screenReader;
  }

  function resetAll() {
    state.fontSize = 18;
    state.darkMode = false;
    state.highContrast = false;
    state.reducedMotion = false;
    state.voiceEnabled = false;
    state.screenReader = false;

    applyAllSettings();
    saveSettings();
    announceToScreenReader('Wszystkie ustawienia dostępności zostały zresetowane');
  }

  function attachEventListeners() {
    const toggle = document.querySelector('.a11y-toggle');
    const controls = document.querySelector('.a11y-controls');

    if (toggle && controls) {
      toggle.addEventListener('click', function() {
        const isHidden = controls.hidden;
        controls.hidden = !isHidden;
        toggle.setAttribute('aria-expanded', String(isHidden));
        if (isHidden) {
          announceToScreenReader('Panel dostępności otwarty');
        }
      });
    }

    document.querySelectorAll('[data-action^="font-"]').forEach(btn => {
      btn.addEventListener('click', function() {
        const action = this.dataset.action;
        if (action === 'font-increase') changeFontSize(2);
        else if (action === 'font-decrease') changeFontSize(-2);
        else if (action === 'font-reset') {
          state.fontSize = 18;
          applyFontSize();
          saveSettings();
        }
      });
    });

    const darkModeCb = document.getElementById('a11y-darkMode');
    const highContrastCb = document.getElementById('a11y-highContrast');
    const reducedMotionCb = document.getElementById('a11y-reducedMotion');
    const voiceControlCb = document.getElementById('a11y-voiceControl');
    const screenReaderCb = document.getElementById('a11y-screenReader');

    if (darkModeCb) {
      darkModeCb.addEventListener('change', function() {
        state.darkMode = this.checked;
        applyDarkMode();
        saveSettings();
      });
    }

    if (highContrastCb) {
      highContrastCb.addEventListener('change', function() {
        state.highContrast = this.checked;
        applyHighContrast();
        saveSettings();
      });
    }

    if (reducedMotionCb) {
      reducedMotionCb.addEventListener('change', function() {
        state.reducedMotion = this.checked;
        applyReducedMotion();
        saveSettings();
      });
    }

    if (voiceControlCb) {
      voiceControlCb.addEventListener('change', toggleVoiceControl);
    }

    if (screenReaderCb) {
      screenReaderCb.addEventListener('change', toggleScreenReaderMode);
    }

    const resetBtn = document.querySelector('[data-action="reset-all"]');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetAll);
    }

    const voiceHelpBtn = document.querySelector('[data-action="show-voice-help"]');
    const voiceHelpPanel = document.getElementById('voice-commands-help');
    const voiceHelpClose = document.querySelector('.voice-help-close');

    if (voiceHelpBtn && voiceHelpPanel) {
      voiceHelpBtn.addEventListener('click', function() {
        voiceHelpPanel.hidden = false;
        announceToScreenReader('Panel z komendami głosowymi otwarty');
      });
    }

    if (voiceHelpClose && voiceHelpPanel) {
      voiceHelpClose.addEventListener('click', function() {
        voiceHelpPanel.hidden = true;
        announceToScreenReader('Panel z komendami głosowymi zamknięty');
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && voiceHelpPanel && !voiceHelpPanel.hidden) {
        voiceHelpPanel.hidden = true;
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        toggle?.click();
      }
      if (e.altKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        changeFontSize(2);
      }
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        changeFontSize(-2);
      }
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        state.highContrast = !state.highContrast;
        applyHighContrast();
        saveSettings();
        updateCheckboxes();
      }
    });
  }

  function announceToScreenReader(message) {
    let announcer = document.getElementById('sr-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
  }

  let recognition = null;
  let voiceIndicator = null;

  function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      announceToScreenReader('Sterowanie głosem nie jest dostępne w tej przeglądarce');
      alert('Sterowanie głosem nie jest dostępne w tej przeglądarce. Proszę używać przeglądarki Chrome lub Edge.');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'pl-PL';
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      if (!voiceIndicator) {
        voiceIndicator = document.createElement('div');
        voiceIndicator.id = 'voice-indicator';
        voiceIndicator.style.cssText = 'position:fixed;top:80px;right:20px;background:rgba(0,168,150,.9);color:#fff;padding:12px 20px;border-radius:24px;font-weight:600;z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,.3);display:none;animation:pulse 1.5s infinite;';
        voiceIndicator.innerHTML = '🎤 Słucham...';
        document.body.appendChild(voiceIndicator);

        const style = document.createElement('style');
        style.textContent = '@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }';
        document.head.appendChild(style);
      }

      recognition.onstart = function() {
        console.log('Voice recognition started');
        if (voiceIndicator) voiceIndicator.style.display = 'block';
        announceToScreenReader('Sterowanie głosem aktywne. Słucham poleceń.');
      };

      recognition.onend = function() {
        console.log('Voice recognition ended');
        if (voiceIndicator) voiceIndicator.style.display = 'none';
        if (state.voiceEnabled) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error('Błąd ponownego uruchomienia rozpoznawania:', e);
            }
          }, 500);
        }
      };

      recognition.onerror = function(event) {
        console.error('Voice recognition error:', event.error);
        if (voiceIndicator) voiceIndicator.style.display = 'none';

        switch(event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            announceToScreenReader('Brak dostępu do mikrofonu. Proszę zezwolić na dostęp do mikrofonu w ustawieniach przeglądarki.');
            alert('Brak dostępu do mikrofonu. Proszę zezwolić na dostęp do mikrofonu w ustawieniach przeglądarki.');
            state.voiceEnabled = false;
            updateCheckboxes();
            break;
          case 'no-speech':
            announceToScreenReader('Nie wykryto mowy. Proszę mówić głośniej.');
            break;
          case 'aborted':
            break;
          default:
            announceToScreenReader('Błąd rozpoznawania mowy: ' + event.error);
        }
      };

      recognition.onresult = function(event) {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();
        console.log('Voice command:', command);

        if (voiceIndicator) {
          voiceIndicator.innerHTML = '🎤 "' + command + '"';
          setTimeout(() => {
            if (voiceIndicator) voiceIndicator.innerHTML = '🎤 Słucham...';
          }, 2000);
        }

        handleVoiceCommand(command);
      };

      recognition.start();
    } catch (error) {
      console.error('Błąd inicjalizacji rozpoznawania głosu:', error);
      announceToScreenReader('Błąd uruchamiania sterowania głosem: ' + error.message);
      state.voiceEnabled = false;
      updateCheckboxes();
    }
  }

  function stopVoiceRecognition() {
    if (recognition) {
      try {
        recognition.stop();
        recognition = null;
      } catch (e) {
        console.error('Błąd zatrzymywania rozpoznawania:', e);
      }
    }
    if (voiceIndicator) {
      voiceIndicator.style.display = 'none';
    }
  }

  function handleVoiceCommand(command) {
    if (command.includes('powiększ') || command.includes('większa czcionka') || command.includes('większy tekst')) {
      changeFontSize(2);
      announceToScreenReader('Powiększono czcionkę');
    }
    else if (command.includes('pomniejsz') || command.includes('mniejsza czcionka') || command.includes('mniejszy tekst')) {
      changeFontSize(-2);
      announceToScreenReader('Pomniejszono czcionkę');
    }
    else if (command.includes('kontrast')) {
      state.highContrast = !state.highContrast;
      applyHighContrast();
      saveSettings();
      updateCheckboxes();
      announceToScreenReader(state.highContrast ? 'Włączono wysoki kontrast' : 'Wyłączono wysoki kontrast');
    }
    else if (command.includes('strona główna') || command.includes('ekran główny') || command.includes('start')) {
      announceToScreenReader('Przechodzę do strony głównej');
      window.location.href = '/';
    }
    else if (command.includes('tablica') || command.includes('tablice')) {
      announceToScreenReader('Przechodzę do tablicy');
      window.location.href = '/board';
    }
    else if (command.includes('ustawienia') || command.includes('opcje')) {
      announceToScreenReader('Przechodzę do ustawień');
      window.location.href = '/settings';
    }
    else if (command.includes('nauka') || command.includes('edukacja') || command.includes('ćwiczenia')) {
      announceToScreenReader('Przechodzę do modułu nauki');
      window.location.href = '/education';
    }
    else if (command.includes('profil') || command.includes('konto')) {
      announceToScreenReader('Przechodzę do profilu użytkownika');
      window.location.href = '/settings?tab=profile';
    }
    else if (command.includes('pomoc')) {
      announceToScreenReader('Przechodzę do pomocy');
      window.location.href = '/help';
    }
    else {
      announceToScreenReader('Nie rozpoznano polecenia: ' + command);
      console.log('Nierozpoznane polecenie:', command);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibilityPanel);
  } else {
    initAccessibilityPanel();
  }

  window.AccessibilityPanel = {
    increaseFontSize: () => changeFontSize(2),
    decreaseFontSize: () => changeFontSize(-2),
    toggleHighContrast: () => {
      state.highContrast = !state.highContrast;
      applyHighContrast();
      saveSettings();
    }
  };
})();
