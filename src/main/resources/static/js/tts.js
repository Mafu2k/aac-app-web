let voices = [];
function loadVoices(){
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}
if('speechSynthesis' in window){
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

function pickVoice(){
  if(!voices || voices.length===0) return null;
  const pl = voices.find(v => (v.lang||'').toLowerCase().startsWith('pl'));
  return pl || voices.find(v => (v.lang||'').toLowerCase().startsWith('en')) || voices[0];
}

function speakAlways(text){
  if(!('speechSynthesis' in window)){
    toast('TTS nie jest wspierane w tej przeglądarce');
    return;
  }

  const settings = JSON.parse(localStorage.getItem('aac_accessibility') || '{}');
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if(v) u.voice = v;
  u.lang = (v && v.lang) || 'pl-PL';

  if(settings.ttsVolume !== undefined) u.volume = settings.ttsVolume / 100;
  if(settings.ttsRate !== undefined) u.rate = settings.ttsRate;
  if(settings.ttsPitch !== undefined) u.pitch = settings.ttsPitch;

  window.speechSynthesis.speak(u);
}

function speak(text){
  const settings = JSON.parse(localStorage.getItem('aac_accessibility') || '{}');
  if(!settings.screenReaderMode && !settings.screenReader){
    return;
  }

  speakAlways(text);
}

function speakTokens(tokens){
  const text = Array.isArray(tokens)? tokens.join(' ') : String(tokens||'');
  speakAlways(text);
}
