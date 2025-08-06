(function initGoals() {
  const goalForm = document.getElementById('goal-form');
  const goalList = document.getElementById('goal-list');

  if (!goalForm || !goalList) {
    console.warn('Hedef formu veya liste bulunamadı!');
    return;
  }

  // Bu tabdayken sayfa scroll'unu kapat
  document.body.style.overflow = 'hidden';

  let goals = [];
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('Kullanıcı giriş yapmamış!');
    return;
  }

  async function fetchGoals() {
    try {
      const res = await fetch('http://localhost:3000/goals/list', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      if (!res.ok) throw new Error('Hedefler yüklenemedi');
      goals = await res.json();
      renderGoals();
    } catch (err) {
      console.error(err);
      goals = JSON.parse(localStorage.getItem('goals')) || [];
      renderGoals();
    }
  }

  fetchGoals();

  goalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('goal-name').value.trim();
    const note = document.getElementById('goal-note').value.trim();
    if (!name) return;

    const newGoal = { name, note };

    try {
      const res = await fetch('http://localhost:3000/goals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(newGoal),
      });

      if (!res.ok) throw new Error('Hedef eklenemedi');
      const savedGoal = await res.json();

      goals.push(savedGoal);
      localStorage.setItem('goals', JSON.stringify(goals));

      renderGoals();
      goalForm.reset();
    } catch (err) {
      console.error(err);
      alert('Hedef eklenirken hata oluştu.');
    }
  });

  function renderGoals() {
    goalList.innerHTML = '';

    goals.forEach((g) => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow p-4 border relative';

      card.innerHTML = `
        <h3 class="text-lg font-bold text-gray-800">${g.name}</h3>
        ${
          g.note
            ? `<p class="text-sm text-gray-600 mt-1 italic">${g.note}</p>`
            : ''
        }
        <div class="flex justify-end gap-2 mt-4">
          <button onclick="archiveGoal('${
            g._id
          }')" class="text-green-600 text-sm border border-green-600 px-3 py-1 rounded hover:bg-green-50">
            Tamamlandı
          </button>
          <button onclick="deleteGoal('${
            g._id
          }')" class="text-red-600 text-sm border border-red-600 px-3 py-1 rounded hover:bg-red-50">
            Sil
          </button>
        </div>
      `;

      goalList.appendChild(card);
    });
  }

  window.deleteGoal = async function (id) {
    try {
      const res = await fetch(`http://localhost:3000/goals/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (!res.ok) throw new Error('Hedef silinemedi');

      goals = goals.filter((g) => g._id !== id);
      localStorage.setItem('goals', JSON.stringify(goals));
      renderGoals();
    } catch (err) {
      console.error(err);
      alert('Hedef silinirken hata oluştu.');
    }
  };

  window.archiveGoal = async function (id) {
    try {
      const res = await fetch(`http://localhost:3000/goals/archive/${id}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (!res.ok) throw new Error('Hedef arşivlenemedi');

      goals = goals.filter((g) => g._id !== id);
      localStorage.setItem('goals', JSON.stringify(goals));
      renderGoals();
    } catch (err) {
      console.error(err);
      alert('Hedef arşivlenirken hata oluştu.');
    }
  };
})();
