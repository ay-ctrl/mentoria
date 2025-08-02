document.addEventListener("DOMContentLoaded", () => {
  // Include işlemini yap
  document.querySelectorAll('[data-include]').forEach(async (el) => {
    const file = el.getAttribute("data-include");
    const res = await fetch(file);
    const html = await res.text();
    el.innerHTML = html;

    // Include tamamlandıktan sonra dropdown eventlerini kur
    initProfileDropdown();
  });
});

function initProfileDropdown() {
  // Eventleri kurmadan önce eski eventleri kaldırmak için
  const profileBtn = document.getElementById("profileBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (!profileBtn || !dropdownMenu) {
    console.warn("Dropdown elementleri bulunamadı.");
    return;
  }

  // Aynı eventlerin tekrar eklenmesini önlemek için önce kaldır
  profileBtn.replaceWith(profileBtn.cloneNode(true));
  const newProfileBtn = document.getElementById("profileBtn");

  // Menüyi aç/kapat
  newProfileBtn.addEventListener("click", (event) => {
    dropdownMenu.classList.toggle("hidden");
    event.stopPropagation();
  });

  // Sayfanın herhangi bir yerine tıklanırsa menüyü kapat
  document.addEventListener("click", () => {
    dropdownMenu.classList.add("hidden");
  });
}



