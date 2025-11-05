document.addEventListener('DOMContentLoaded', async () => {
  getTokenOrRedirect();

  async function loadLeaderboard(){
    try {
      const data = await apiGet('/api/competition/leaderboard');
      const ol = document.getElementById('leaderboard');
      ol.innerHTML = '';
      data.forEach((u, idx) => {
        const li = document.createElement('li');
        li.textContent = `${idx+1}. ${u.displayName || u.username} — ${u.xp} XP (poziom ${u.level})`;
        ol.appendChild(li);
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function submitPoints(points){
    try {
      const res = await apiPost('/api/competition/submit', { points });
      document.getElementById('submitStatus').textContent = `Dodano XP. Twój wynik: ${res.xp} XP, poziom ${res.level}.`;
      speak && speak('Gratulacje! Zdobyto punkty doświadczenia.');
      await loadLeaderboard();
    } catch(e){
      document.getElementById('submitStatus').textContent = 'Błąd dodawania punktów.';
    }
  }

  document.querySelectorAll('.cards .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pts = parseInt(btn.getAttribute('data-points'), 10) || 0;
      submitPoints(pts);
    });
  });

  document.getElementById('customSubmit').addEventListener('click', () => {
    const pts = parseInt(document.getElementById('customPoints').value || '0', 10);
    if(pts > 0) submitPoints(pts);
  });

  await loadLeaderboard();
});
