// Basic app utilities
const TOKEN_KEY = 'aac_jwt';
const QUEUE_KEY = 'aac_queue';

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function setToken(t){ localStorage.setItem(TOKEN_KEY, t); }
function clearToken(){ localStorage.removeItem(TOKEN_KEY); }
function loginUrlWithNext(){ const here = encodeURIComponent(window.location.pathname + window.location.search); return '/login?next=' + here; }
function getTokenOrRedirect(){ const t=getToken(); if(!t){ window.location.href=loginUrlWithNext(); throw new Error('No token'); } return t; }
function logout(){ clearToken(); window.location.href=loginUrlWithNext(); }

function toast(msg){ try{ console.log('[TOAST]', msg); }catch(e){} }

function applyDarkMode(enabled){ document.body.classList.toggle('dark', !!enabled); }

function showOfflineBanner(show){ const el = document.getElementById('offlineBanner'); if(el){ el.hidden = !show; } }

function readQueue(){ try{ return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); }catch(e){ return []; } }
function writeQueue(q){ localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); }
function enqueue(op){ const q = readQueue(); q.push(op); writeQueue(q); showOfflineBanner(true); }

async function replayQueue(){ if(!navigator.onLine) return; const q = readQueue(); if(q.length===0) return; const remaining=[]; for(const op of q){ try{ await apiFetch(op.method, op.url, op.body, true); }catch(e){ remaining.push(op); } } writeQueue(remaining); if(remaining.length===0) showOfflineBanner(false); }

window.addEventListener('online', replayQueue);
window.addEventListener('load', replayQueue);

async function apiFetch(method, url, body, isReplay){
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if(token) headers['Authorization'] = 'Bearer ' + token;
  try{
    const res = await fetch(url, { method, headers, body: body? JSON.stringify(body): undefined });
    if(res.status === 401){ if(!isReplay){ logout(); } throw new Error('Unauthorized'); }
    if(!res.ok){ const txt = await res.text(); throw new Error(txt || ('HTTP '+res.status)); }
    const ct = res.headers.get('Content-Type')||'';
    return ct.includes('application/json')? res.json(): res.text();
  }catch(e){
    if(!navigator.onLine && ['POST','PUT','PATCH','DELETE'].includes(method)){
      enqueue({ method, url, body });
      return { queued:true };
    }
    throw e;
  }
}

const apiGet = (url) => apiFetch('GET', url);
const apiPost = (url, body) => apiFetch('POST', url, body);
const apiPut = (url, body) => apiFetch('PUT', url, body);
const apiDelete = (url) => apiFetch('DELETE', url);

async function apiUpload(url, file){
  const token = getToken();
  const headers = {};
  if(token) headers['Authorization'] = 'Bearer ' + token;
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(url, { method: 'POST', headers, body: fd });
  if(!res.ok){ const txt = await res.text(); throw new Error(txt || 'Upload failed'); }
  return res.json();
}

// Load and apply global accessibility settings
window.loadGlobalAccessibilitySettings = function() {
  try {
    const settings = JSON.parse(localStorage.getItem('aac_accessibility') || '{}');

    // Dark mode
    if (settings.darkMode) {
      document.body.classList.add('dark');
    }

    // High contrast
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      document.body.classList.add('reduce-motion');
    }

    // Screen reader mode
    if (settings.screenReader || settings.screenReaderMode) {
      document.body.classList.add('screen-reader-mode');
    }

    // Zoom
    if (settings.zoomLevel && settings.zoomLevel !== 100) {
      document.body.style.zoom = settings.zoomLevel / 100;
    }

    // Font size
    if (settings.fontSize) {
      document.documentElement.style.setProperty('--font-size', settings.fontSize + 'px');
      document.documentElement.style.fontSize = settings.fontSize + 'px';
    }

    // Icon size
    if (settings.iconSize) {
      document.documentElement.style.setProperty('--btn-size', settings.iconSize + 'px');
    }
  } catch (e) {
    console.error('Błąd ładowania ustawień dostępności:', e);
  }
};

// Apply settings immediately (before DOMContentLoaded)
window.loadGlobalAccessibilitySettings();

// Common bindings for logout button on pages
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){ logoutBtn.addEventListener('click', logout); }
  showOfflineBanner(!navigator.onLine);

  // Reapply settings after DOM is loaded (in case some elements need it)
  window.loadGlobalAccessibilitySettings();
});
