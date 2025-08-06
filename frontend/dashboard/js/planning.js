document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContent = document.getElementById('tab-content');

  // Tab adı -> js dosyası (varsa)
  const tabScriptFiles = {
    activities: './js/tabs/activities.js',
    goals: './js/tabs/goals.js',
    weekly: './js/tabs/weekly.js',
    monthly: './js/tabs/monthly.js',
    daily: './js/tabs/daily.js',
    // diğer tablar ve js dosyaları...
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', async () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach((t) => t.classList.remove('bg-[#E84230]', 'text-white'));
      tab.classList.add('bg-[#E84230]', 'text-white');

      tabContent.innerHTML = 'Yükleniyor...';

      try {
        // HTML içeriğini yükle
        const response = await fetch(`./components/tabs/${target}.html`);
        if (!response.ok) throw new Error('İçerik yüklenemedi');

        const html = await response.text();
        tabContent.innerHTML = html;

        // Önce önce varsa o tab için daha önce yüklenen script varsa kaldır (önlem)
        const oldScript = document.getElementById('dynamic-tab-script');
        if (oldScript) oldScript.remove();

        // Eğer tab için js dosyası varsa dinamik yükle
        if (tabScriptFiles[target]) {
          const script = document.createElement('script');
          script.src = tabScriptFiles[target];
          script.id = 'dynamic-tab-script';
          script.onload = () => {
            console.log(`${target}.js yüklendi ve çalıştı`);
            // Eğer JS dosyasında init fonksiyonu varsa, orada çağrılır
          };
          tabContent.appendChild(script); // ya body'ye de ekleyebilirsin
        }
      } catch (error) {
        tabContent.innerHTML = `<p class="text-red-600">İçerik yüklenirken hata oluştu: ${error.message}</p>`;
      }
    });
  });

  // İlk tabı aktif yap
  tabs[0].click();
});
