// Simplified Mode - Tryb uproszczony dla dzieci i osób z autyzmem
(function() {
  'use strict';

  let simplifiedMode = false;

  // Wykrywanie czy użytkownik potrzebuje trybu uproszczonego
  function detectUserNeedsSimplifiedMode() {
    // Sprawdź localStorage
    const userType = localStorage.getItem('aac_user_type');
    if (userType === 'CHILD' || userType === 'AUTISM') {
      enableSimplifiedMode();
    }
  }

  // Włączenie trybu uproszczonego
  function enableSimplifiedMode() {
    simplifiedMode = true;
    document.body.classList.add('simplified-mode');
    localStorage.setItem('aac_simplified_mode', 'true');

    // Uproszczenia interfejsu
    simplifyNavigation();
    enlargeElements();
    addVisualFeedback();
    enablePredictableLayout();
    reduceDistractions();

    announceChange('Tryb uproszczony włączony');
  }

  // Wyłączenie trybu uproszczonego
  function disableSimplifiedMode() {
    simplifiedMode = false;
    document.body.classList.remove('simplified-mode');
    localStorage.removeItem('aac_simplified_mode');
    announceChange('Tryb uproszczony wyłączony');
  }

  // Uproszczenie nawigacji
  function simplifyNavigation() {
    const nav = document.querySelector('.nav');
    if (nav) {
      // Ukryj mniej ważne elementy
      const links = nav.querySelectorAll('.nav__link');
      links.forEach((link, index) => {
        if (index > 2) { // Zostaw tylko 3 główne linki
          link.style.display = 'none';
        }
      });
    }
  }

  // Powiększenie elementów
  function enlargeElements() {
    document.documentElement.style.setProperty('--btn-size', '120px');
    document.documentElement.style.setProperty('--font-size', '22px');
  }

  // Dodanie wizualnego feedbacku
  function addVisualFeedback() {
    // Dodaj wyraźniejszy feedback przy kliknięciu
    document.addEventListener('click', function(e) {
      if (simplifiedMode && e.target.matches('button, a, .symbol')) {
        const target = e.target;
        target.style.transform = 'scale(1.1)';
        setTimeout(() => {
          target.style.transform = '';
        }, 200);

        // Odtwórz dźwięk kliknięcia (opcjonalnie)
        playClickSound();
      }
    });
  }

  // Przewidywalny układ
  function enablePredictableLayout() {
    // Wyłącz sortowanie i losowe elementy
    const boardGrid = document.getElementById('boardGrid');
    if (boardGrid) {
      boardGrid.style.order = 'initial';
    }

    // Ustaw stałą liczbę kolumn
    document.documentElement.style.setProperty('--grid-columns', '3');
  }

  // Redukcja rozpraszaczy
  function reduceDistractions() {
    // Ukryj elementy dekoracyjne
    document.body.classList.add('reduce-decorations');

    // Wyłącz autoplay dla wszystkich mediów
    document.querySelectorAll('video, audio').forEach(media => {
      media.autoplay = false;
      media.pause();
    });

    // Usuń migające elementy
    document.querySelectorAll('[class*="blink"], [class*="flash"]').forEach(el => {
      el.style.animation = 'none';
    });
  }

  // Dźwięk kliknięcia
  function playClickSound() {
    // Prosty dźwięk beep przy pomocy Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Częstotliwość w Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log('Audio feedback niedostępny');
    }
  }

  // Komunikaty dla czytników ekranu
  function announceChange(message) {
    let announcer = document.getElementById('sr-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
  }

  // Specjalne wsparcie dla osób z autyzmem
  function enableAutismSupport() {
    document.body.classList.add('autism-mode');

    // 1. Wyraźne granice i separatory
    addVisualBoundaries();

    // 2. Przewidywalność - brak niespodzianek
    disableSurprises();

    // 3. Konsystentne kolory i układy
    enforceConsistency();

    // 4. Timer dla zadań czasowych
    addVisualTimer();
  }

  function addVisualBoundaries() {
    const style = document.createElement('style');
    style.textContent = `
      .autism-mode * {
        outline: 2px solid rgba(0,0,0,0.1);
        outline-offset: 2px;
      }
      .autism-mode .panel,
      .autism-mode .card,
      .autism-mode .symbol {
        border: 4px solid #4A90E2 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function disableSurprises() {
    // Wyłącz animacje automatyczne
    document.querySelectorAll('[autoplay], [data-autostart]').forEach(el => {
      el.removeAttribute('autoplay');
      el.removeAttribute('data-autostart');
    });

    // Wyłącz pop-upy i modals automatyczne
    document.querySelectorAll('.modal[data-auto-show]').forEach(modal => {
      modal.removeAttribute('data-auto-show');
    });
  }

  function enforceConsistency() {
    // Wymuszaj ten sam rozmiar i odstępy dla wszystkich przycisków
    const style = document.createElement('style');
    style.textContent = `
      .autism-mode button,
      .autism-mode .btn {
        min-width: 120px !important;
        min-height: 120px !important;
        margin: 10px !important;
      }
      .autism-mode .symbol {
        width: 120px !important;
        height: 120px !important;
      }
    `;
    document.head.appendChild(style);
  }

  function addVisualTimer() {
    // Dodaj wizualny timer dla zadań z limitem czasu
    const timerBar = document.createElement('div');
    timerBar.className = 'visual-timer';
    timerBar.setAttribute('role', 'timer');
    timerBar.setAttribute('aria-label', 'Timer zadania');
    timerBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 8px;
      background: linear-gradient(to right, #4CAF50 0%, #FFC107 50%, #F44336 100%);
      z-index: 9999;
      display: none;
    `;
    document.body.appendChild(timerBar);

    window.showTimer = function(duration) {
      timerBar.style.display = 'block';
      timerBar.style.transition = `width ${duration}ms linear`;
      timerBar.style.width = '0%';
      setTimeout(() => {
        timerBar.style.display = 'none';
        timerBar.style.width = '100%';
      }, duration);
    };
  }

  // Specjalne wsparcie dla dzieci
  function enableChildMode() {
    document.body.classList.add('child-mode');

    // 1. Większe, kolorowe elementy
    makeElementsChildFriendly();

    // 2. Dodaj nagrody i zachęty
    addRewardSystem();

    // 3. Uproszczone komunikaty
    simplifyLanguage();

    // 4. Dodaj dźwięki i animacje
    addFunElements();
  }

  function makeElementsChildFriendly() {
    document.documentElement.style.setProperty('--btn-size', '140px');
    document.documentElement.style.setProperty('--font-size', '24px');

    // Zaokrąglone rogi
    const style = document.createElement('style');
    style.textContent = `
      .child-mode * {
        border-radius: 20px !important;
      }
      .child-mode .symbol {
        border-width: 5px !important;
      }
    `;
    document.head.appendChild(style);
  }

  function addRewardSystem() {
    // System gwiazdek za używanie aplikacji
    let stars = parseInt(localStorage.getItem('aac_child_stars') || '0');

    window.addEventListener('click', function(e) {
      if (e.target.matches('.symbol, .btn')) {
        stars++;
        localStorage.setItem('aac_child_stars', stars.toString());
        showStarAnimation(e.clientX, e.clientY);

        if (stars % 10 === 0) {
          showCelebration();
        }
      }
    });
  }

  function showStarAnimation(x, y) {
    const star = document.createElement('div');
    star.textContent = '⭐';
    star.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: 2rem;
      pointer-events: none;
      z-index: 10000;
      animation: starFloat 1s ease-out forwards;
    `;
    document.body.appendChild(star);

    setTimeout(() => star.remove(), 1000);
  }

  function showCelebration() {
    announceChange('Brawo! Zdobyłeś kolejne 10 gwiazdek! 🎉');
    // Dodaj confetti lub inną animację
  }

  function simplifyLanguage() {
    // Zamień skomplikowane słowa na prostsze
    const replacements = {
      'Personalizacja': 'Ustawienia',
      'Syntezator': 'Czytanie',
      'Dostępność': 'Pomoc'
    };

    document.querySelectorAll('h1, h2, h3, button, a, label').forEach(el => {
      let text = el.textContent;
      Object.keys(replacements).forEach(key => {
        text = text.replace(new RegExp(key, 'gi'), replacements[key]);
      });
      if (text !== el.textContent) {
        el.textContent = text;
      }
    });
  }

  function addFunElements() {
    // Dodaj style dla animacji
    const style = document.createElement('style');
    style.textContent = `
      @keyframes starFloat {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(-100px) scale(1.5);
          opacity: 0;
        }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .child-mode .symbol:hover {
        animation: bounce 0.5s ease infinite;
      }
    `;
    document.head.appendChild(style);
  }

  // Toggle funkcja dla panelu dostępności
  window.toggleSimplifiedMode = function() {
    if (simplifiedMode) {
      disableSimplifiedMode();
    } else {
      enableSimplifiedMode();
    }
  };

  window.enableAutismMode = enableAutismSupport;
  window.enableChildMode = enableChildMode;

  // Auto-detekcja przy starcie
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectUserNeedsSimplifiedMode);
  } else {
    detectUserNeedsSimplifiedMode();
  }
})();
