// activities.js

// Bu dosya yüklendiğinde kendi init fonksiyonunu hemen çağırabilir veya otomatik çalıştırabilir
(function initActivities() {
  const activityForm = document.getElementById('activity-form');
  const activityList = document.getElementById('activity-list');

  if (!activityForm || !activityList) {
    console.warn('Aktivite formu veya liste bulunamadı!');
    return;
  }

  let activities = JSON.parse(localStorage.getItem('activities')) || [];
  renderActivities();

  activityForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('activity-name').value.trim();
    const time = document.getElementById('activity-time').value.trim();
    const count = document.getElementById('activity-count').value;
    const unit = document.getElementById('activity-unit').value;

    if (!name || !count) return;

    activities.push({ name, time, count, unit });
    localStorage.setItem('activities', JSON.stringify(activities));
    renderActivities();
    activityForm.reset();
  });

  function renderActivities() {
    activityList.innerHTML = '';

    activities.forEach((a, i) => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow p-4 border relative';

      card.innerHTML = `
        <h3 class="text-lg font-bold text-gray-800">${a.name}</h3>
        ${a.time ? `<p class="text-sm text-gray-500">Zaman: ${a.time}</p>` : ''}
        <p class="text-sm text-gray-700 mt-1">Haftalık: ${a.count} ${a.unit}</p>
        <button onclick="deleteActivity(${i})" class="absolute top-2 right-2 text-red-600 text-sm">✕</button>
      `;

      activityList.appendChild(card);
    });
  }

  window.deleteActivity = function (index) {
    activities.splice(index, 1);
    localStorage.setItem('activities', JSON.stringify(activities));
    renderActivities();
  };
})();
