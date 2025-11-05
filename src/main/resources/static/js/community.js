document.addEventListener('DOMContentLoaded', async () => {
  getTokenOrRedirect();

  async function loadPublic(){
    const cont = document.getElementById('publicBoards');
    cont.innerHTML = '';
    try {
      const list = await apiGet('/api/community/boards');
      if(list.length === 0){
        cont.innerHTML = '<p>Brak publicznych tablic.</p>';
      }
      list.forEach(b => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<div class="card__title">${escapeHtml(b.name)}</div>
                          <div class="card__meta">Autor: ${escapeHtml(b.ownerDisplayName || '')}</div>
                          <div class="card__actions">
                            <button class="btn" data-id="${b.id}">Skopiuj do moich</button>
                          </div>`;
        card.querySelector('button').addEventListener('click', async () => {
          try{
            await apiPost(`/api/community/clone/${b.id}`, {});
            toast('Tablica została skopiowana.');
            await loadMine();
          }catch(e){ toast('Błąd kopiowania tablicy'); }
        });
        cont.appendChild(card);
      });
    } catch(e){
      cont.innerHTML = '<p>Błąd ładowania tablic społeczności.</p>';
    }
  }

  async function loadMine(){
    const cont = document.getElementById('myBoards');
    cont.innerHTML = '';
    try{
      const list = await apiGet('/api/boards');
      if(list.length === 0){
        cont.innerHTML = '<p>Nie masz jeszcze tablic.</p>';
      }
      list.forEach(b => {
        const btnPub = document.createElement('button');
        btnPub.className = 'btn btn--secondary';
        btnPub.textContent = b.publicVisible ? 'Cofnij publikację' : 'Opublikuj';
        btnPub.addEventListener('click', async ()=>{
          try{
            if(b.publicVisible){
              await apiPost(`/api/community/unpublish/${b.id}`, {});
              b.publicVisible = false;
            } else {
              await apiPost(`/api/community/publish/${b.id}`, {});
              b.publicVisible = true;
            }
            btnPub.textContent = b.publicVisible ? 'Cofnij publikację' : 'Opublikuj';
            toast('Zapisano.');
            await loadPublic();
          }catch(e){ toast('Błąd publikacji tablicy'); }
        });
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<div class="card__title">${escapeHtml(b.name)}</div>
                          <div class="card__meta">Układ: ${escapeHtml(b.layout || '')}</div>`;
        const actions = document.createElement('div');
        actions.className = 'card__actions';
        actions.appendChild(btnPub);
        card.appendChild(actions);
        cont.appendChild(card);
      });
    }catch(e){
      cont.innerHTML = '<p>Błąd ładowania twoich tablic.</p>';
    }
  }

  await loadPublic();
  await loadMine();
});
