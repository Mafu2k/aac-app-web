// Web Speech API TTS utilities
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
  // Prefer Polish
  const pl = voices.find(v => (v.lang||'').toLowerCase().startsWith('pl'));
  return pl || voices.find(v => (v.lang||'').toLowerCase().startsWith('en')) || voices[0];
}

// Internal function - always speaks (for TTS button)
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

  // Apply TTS settings if available
  if(settings.ttsVolume !== undefined) u.volume = settings.ttsVolume / 100;
  if(settings.ttsRate !== undefined) u.rate = settings.ttsRate;
  if(settings.ttsPitch !== undefined) u.pitch = settings.ttsPitch;

  window.speechSynthesis.speak(u);
}

// Public function - speaks only if screen reader is enabled (for automatic reading)
function speak(text){
  // Check if screen reader is enabled - ONLY speak if explicitly enabled
  const settings = JSON.parse(localStorage.getItem('aac_accessibility') || '{}');
  if(!settings.screenReaderMode && !settings.screenReader){
    return; // Don't speak unless screen reader is explicitly enabled
  }

  speakAlways(text);
}

// For TTS button - always speaks
function speakTokens(tokens){
  const text = Array.isArray(tokens)? tokens.join(' ') : String(tokens||'');
  speakAlways(text);
}
