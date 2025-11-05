(function(){
  const supports = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  let recognition = null;
  let enabled = false;
  let started = false;
  let lastStartTs = 0;

  function initRecognition(){
    if(!supports) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = 'pl-PL';
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const res = event.results[event.results.length - 1];
      if(!res) return;
      const transcript = (res[0] && res[0].transcript || '').trim().toLowerCase();
      if(!transcript) return;
      try{
        if(transcript.includes('tablica')){
          window.location.href = '/board';
        } else if(transcript.includes('ustawienia')){
          window.location.href = '/settings';
        } else if(transcript.includes('terapeuta')){
          window.location.href = '/therapist';
        } else if(transcript.includes('powiedz')){
          if(window.speak){
            const text = (document.getElementById('sentenceText')?.innerText || '').trim();
            if(text) window.speak(text);
          }
        } else if(transcript.startsWith('szukaj ')){
          const q = transcript.replace('szukaj ','').trim();
          const si = document.getElementById('searchInput');
          if(si){ si.value = q; si.dispatchEvent(new Event('input')); }
        }
      }catch(e){  }
    };

    recognition.onerror = () => {
      started = false;
      if(enabled) setTimeout(start, 1200);
    };

    recognition.onend = () => {
      started = false;
      if(enabled) setTimeout(start, 300);
    };
  }

  async function fetchSettings(){
    try{
      const token = localStorage.getItem('aac_jwt');
      if(!token) return { voiceControlEnabled: false };
      const res = await fetch('/api/settings', { headers: { 'Authorization': 'Bearer ' + token }});
      if(!res.ok) return { voiceControlEnabled: false };
      return await res.json();
    }catch(e){ return { voiceControlEnabled: false }; }
  }

  function start(){
    if(!supports || !recognition || started || !enabled) return;
    try{
      const now = Date.now();
      if(now - lastStartTs < 300) return;
      lastStartTs = now;
      recognition.start();
      started = true;
    }catch(e){  }
  }

  function stop(){
    if(!supports || !recognition) return;
    try{ recognition.stop(); }catch(e){  }
    started = false;
  }

  async function init(){
    initRecognition();
    const s = await fetchSettings();
    enabled = !!s.voiceControlEnabled;
    if(enabled) start();
    window.AACVoice = {
      enable(){ enabled = true; start(); },
      disable(){ enabled = false; stop(); },
      isEnabled(){ return enabled; }
    };
  }

  document.addEventListener('settings-updated', (ev) => {
    try{
      const s = (ev && ev.detail) || {};
      const shouldEnable = !!s.voiceControlEnabled;
      if(shouldEnable !== enabled){
        enabled = shouldEnable;
        if(enabled) start(); else stop();
      }
    }catch(e){  }
  });

  document.addEventListener('visibilitychange', () => {
    if(document.hidden) stop(); else if(enabled) start();
  });

  document.addEventListener('DOMContentLoaded', init);
})();