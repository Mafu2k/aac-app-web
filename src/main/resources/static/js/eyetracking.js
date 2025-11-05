// Simple dwell-click simulation (placeholder for real eye-tracking integration)
// Apply data-dwell="true" on interactive elements to enable dwell selection
(function(){
  const DWELL_MS = 900;
  let dwellTimer = null;
  let currentTarget = null;

  function clear(){ if(dwellTimer){ clearTimeout(dwellTimer); dwellTimer=null; } if(currentTarget){ currentTarget.classList.remove('dwell'); currentTarget=null; } }

  document.addEventListener('mouseover', (e) => {
    let t = e.target;
    while(t && t !== document.body){
      if(t.matches && t.matches('[data-dwell="true"]')){
        currentTarget = t;
        t.classList.add('dwell');
        clearTimeout(dwellTimer);
        dwellTimer = setTimeout(() => { t.click(); }, DWELL_MS);
        return;
      }
      t = t.parentElement;
    }
  });
  document.addEventListener('mouseout', (e) => { if(e.target===currentTarget){ clear(); } });
  document.addEventListener('mousedown', clear);
  document.addEventListener('scroll', clear, true);
})();
