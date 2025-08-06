document.addEventListener('DOMContentLoaded', () => {
  const openModalBtn = document.getElementById('openModalBtn');
  const planModal = document.getElementById('planModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const planForm = document.getElementById('planForm');

  // Modal açma
  openModalBtn.addEventListener('click', () => {
    planModal.classList.remove('hidden');
    planModal.classList.add('flex');
  });

  // Modal kapatma
  closeModalBtn.addEventListener('click', () => {
    planModal.classList.add('hidden');
    planModal.classList.remove('flex');
  });

  // Modal dışına tıklayınca kapatma
  planModal.addEventListener('click', (e) => {
    if (e.target === planModal) {
      planModal.classList.add('hidden');
      planModal.classList.remove('flex');
    }
  });

  // Form submit işlemi
  planForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const summary = document.getElementById('summaryInput').value.trim();
    const planType = document.getElementById('planType').value;

    if (!summary) {
      alert('Lütfen gün özetinizi giriniz.');
      return;
    }

    // Burada yapay zeka API çağrısı yapılacak (örnek placeholder)
    // Örnek: OpenAI çağrısı veya backend ile iletişim
    // const planResult = await callAI(summary, planType);

    // Şimdilik sahte plan
    const planResult = `Oluşturulan ${planType} plan: Gün özetinizden yola çıkarak ... (örnek çıktı)`;

    // Planı sayfadaki ilgili tab içerisine ekle
    // Örnek: Günlük tabı için
    const dailyTab = document.querySelector('#tab-content #daily');
    if (dailyTab) {
      dailyTab.innerHTML = `<h3 class="text-xl font-semibold text-[#E84230] mb-2">Yapay Zeka Planı</h3><p>${planResult}</p>`;
    }

    // Modalı kapat
    planModal.classList.add('hidden');
    planModal.classList.remove('flex');

    // Formu resetle
    planForm.reset();
  });
});
