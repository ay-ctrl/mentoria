async function loadActivities() {
  const container = document.getElementById('activities-container');
  const dailyPlanTasks = document.getElementById('daily-plan-tasks');
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('http://localhost:3000/activities/list', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const activities = await response.json();

    activities.forEach((activity) => {
      const card = document.createElement('div');
      card.className =
        'p-4 border rounded-md cursor-pointer bg-rose-100 hover:bg-rose-200 transition-shadow duration-300';

      const title = document.createElement('h3');
      title.className = 'font-semibold';
      title.textContent = activity.name || 'İsimsiz Aktivite';

      const description = document.createElement('p');
      description.className = 'text-sm text-rose-700';
      description.textContent = activity.description || 'Açıklama bulunamadı.';

      const details = document.createElement('p');
      details.className = 'text-xs text-rose-500 mt-1';
      details.textContent = `${activity.count || 1} defa, her ${
        activity.interval || '-'
      } boyunca, toplam ${activity.duration || '-'} sürecek`;

      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(details);

      // Tıklanınca sol panele ekle
      card.addEventListener('click', () => {
        const placeholder = dailyPlanTasks.querySelector('p.text-rose-400');
        if (placeholder) placeholder.remove();

        const newCard = card.cloneNode(true);
        newCard.classList.remove('cursor-pointer', 'hover:bg-rose-200');
        newCard.classList.add('cursor-default', 'bg-rose-50'); // <-- buraya margin-bottom ekledik
        dailyPlanTasks.appendChild(newCard);
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error('Aktiviteler alınamadı:', error);
    container.innerHTML = `<p class="text-sm text-red-500">Aktiviteler yüklenemedi.</p>`;
  }
}

loadActivities();

function initCustomTaskForm() {
  const form = document.getElementById('custom-task-form');
  const titleInput = document.getElementById('custom-task-title');
  const detailsInput = document.getElementById('custom-task-details');
  const planContainer = document.getElementById('daily-plan-tasks'); // Günlük planın container'ı

  if (!form || !titleInput || !detailsInput || !planContainer) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const details = detailsInput.value.trim();

    if (title === '') return;

    const card = document.createElement('div');
    card.className =
      'p-4 border rounded-md cursor-pointer bg-rose-100 hover:bg-rose-200 transition-shadow duration-300';

    const h3 = document.createElement('h3');
    h3.className = 'font-semibold';
    h3.textContent = title;

    const p = document.createElement('p');
    p.className = 'text-sm text-rose-700 mt-1';
    p.textContent = details || 'Detay verilmedi.';

    card.appendChild(h3);
    card.appendChild(p);

    planContainer.appendChild(card);

    // Temizle
    titleInput.value = '';
    detailsInput.value = '';
  });
}

initCustomTaskForm();
