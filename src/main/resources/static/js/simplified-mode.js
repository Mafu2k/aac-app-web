(function() {
  'use strict';

  let simplifiedMode = false;

  function detectUserNeedsSimplifiedMode() {
    const userType = localStorage.getItem('aac_user_type');
    if (userType === 'CHILD' || userType === 'AUTISM') {
      enableSimplifiedMode();
    }
  }

  function enableSimplifiedMode() {
    simplifiedMode = true;
    document.body.classList.add('simplified-mode');
    localStorage.setItem('aac_simplified_mode', 'true');

    simplifyNavigation();
    enlargeElements();
    addVisualFeedback();
    enablePredictableLayout();
    reduceDistractions();

    announceChange('Tryb uproszczony włączony');
  }

  function disableSimplifiedMode() {
    simplifiedMode = false;
    document.body.classList.remove('simplified-mode');
    localStorage.removeItem('aac_simplified_mode');
    announceChange('Tryb uproszczony wyłączony');
  }

  function simplifyNavigation() {
    const nav = document.querySelector('.nav');
    if (nav) {
      const links = nav.querySelectorAll('.nav__link');
      links.forEach((link, index) => {
        if (index > 2) {
          link.style.display = 'none';
        }
      });
    }
  }

  function enlargeElements() {
    document.documentElement.style.setProperty('--btn-size', '120px');
    document.documentElement.style.setProperty('--font-size', '22px');
  }

  function addVisualFeedback() {
    document.addEventListener('click', function(e) {
      if (simplifiedMode && e.target.matches('button, a, .symbol')) {
        const target = e.target;
        target.style.transform = 'scale(1.1)';
        setTimeout(() => {
          target.style.transform = '';
        }, 200);

        playClickSound();
      }
    });
  }

  function enablePredictableLayout() {
    const boardGrid = document.getElementById('boardGrid');
    if (boardGrid) {
      boardGrid.style.order = 'initial';
    }

    document.documentElement.style.setProperty('--grid-columns', '3');
  }

  function reduceDistractions() {
    document.body.classList.add('reduce-decorations');

    document.querySelectorAll('video, audio').forEach(media => {
      media.autoplay = false;
      media.pause();
    });

    document.querySelectorAll('[class*="blink"], [class*="flash"]').forEach(el => {
      el.style.animation = 'none';
    });
  }

  function playClickSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log('Audio feedback niedostępny');
    }
  }

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

  function enableAutismSupport() {
    document.body.classList.add('autism-mode');

    addVisualBoundaries();

    disableSurprises();

    enforceConsistency();

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
    document.querySelectorAll('[autoplay], [data-autostart]').forEach(el => {
      el.removeAttribute('autoplay');
      el.removeAttribute('data-autostart');
    });

    document.querySelectorAll('.modal[data-auto-show]').forEach(modal => {
      modal.removeAttribute('data-auto-show');
    });
  }

  function enforceConsistency() {
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

  function enableChildMode() {
    document.body.classList.add('child-mode');

    makeElementsChildFriendly();

    addRewardSystem();

    simplifyLanguage();

    addFunElements();
  }

  function makeElementsChildFriendly() {
    document.documentElement.style.setProperty('--btn-size', '140px');
    document.documentElement.style.setProperty('--font-size', '24px');

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
  }

  function simplifyLanguage() {
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

  window.toggleSimplifiedMode = function() {
    if (simplifiedMode) {
      disableSimplifiedMode();
    } else {
      enableSimplifiedMode();
    }
  };

  window.enableAutismMode = enableAutismSupport;
  window.enableChildMode = enableChildMode;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectUserNeedsSimplifiedMode);
  } else {
    detectUserNeedsSimplifiedMode();
  }
})();
