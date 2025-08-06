(function initActivities() {
  const activityForm = document.getElementById('activity-form');
  const activityList = document.getElementById('activity-list');

  if (!activityForm || !activityList) {
    console.warn('Aktivite formu veya liste bulunamadı!');
    return;
  }

  // Öncelikle backend’den aktivite listesini çekelim
  let activities = [];

  const token = localStorage.getItem('token'); // Örnek, token'ı localStorage'dan alıyoruz
  if (!token) {
    console.warn('Kullanıcı giriş yapmamış!');
    return;
  }

  async function fetchActivities() {
    try {
      const res = await fetch('http://localhost:3000/activities/list', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      if (!res.ok) throw new Error('Aktiviteler yüklenemedi');
      activities = await res.json();
      renderActivities();
    } catch (err) {
      console.error(err);
      // fallback olarak localStorage'daki aktiviteleri yükle
      activities = JSON.parse(localStorage.getItem('activities')) || [];
      renderActivities();
    }
  }

  fetchActivities();

  activityForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('activity-name').value.trim();
    const count = document.getElementById('activity-frequency').value;
    const interval = document
      .getElementById('activity-time-range')
      .value.trim();
    const duration = document.getElementById('activity-duration').value.trim();
    const description = document
      .getElementById('activity-description')
      .value.trim();

    if (!name || !count) return;

    const newActivity = { name, count, interval, duration, description };

    try {
      // Backend'e POST ile yeni aktivite ekle
      const res = await fetch('http://localhost:3000/activities/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(newActivity),
      });

      if (!res.ok) throw new Error('Aktivite eklenemedi');

      const savedActivity = await res.json();

      // Backend'e eklenen aktiviteyi listeye ekle
      activities.push(savedActivity);

      // localStorage'ı da güncelle
      localStorage.setItem('activities', JSON.stringify(activities));

      renderActivities();
      activityForm.reset();
    } catch (err) {
      console.error(err);
      alert('Aktivite eklenirken hata oluştu.');
    }
  });

  function renderActivities() {
    activityList.innerHTML = '';

    activities.forEach((a, i) => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow p-4 border relative';

      card.innerHTML = `
        <h3 class="text-lg font-bold text-gray-800">${a.name}</h3>
        <p class="text-sm text-gray-700 mt-1">Haftada: ${a.count} kez</p>
        ${
          a.interval
            ? `<p class="text-sm text-gray-500">Zaman aralığı: ${a.interval}</p>`
            : ''
        }
        ${
          a.duration
            ? `<p class="text-sm text-gray-500">Her seferinde: ${a.duration}</p>`
            : ''
        }
        ${
          a.description
            ? `<p class="text-sm text-gray-500 italic mt-1">${a.description}</p>`
            : ''
        }
        <button onclick="deleteActivity('${
          a._id
        }')" class="absolute top-2 right-2 text-red-600 text-sm">✕</button>
      `;

      activityList.appendChild(card);
    });
  }

  // Silme işlemi backend'e DELETE isteği olarak gönderilecek
  window.deleteActivity = async function (id) {
    try {
      const res = await fetch(`http://localhost:3000/activities/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (!res.ok) throw new Error('Aktivite silinemedi');

      // Başarılı silme sonrası lokal listeden çıkar ve güncelle
      activities = activities.filter((a) => a._id !== id);
      localStorage.setItem('activities', JSON.stringify(activities));
      renderActivities();
    } catch (err) {
      console.error(err);
      alert('Aktivite silinirken hata oluştu.');
    }
  };
})();
