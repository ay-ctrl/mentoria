document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Lütfen giriş yapınız.');
    return;
  }

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const aboutInput = document.getElementById('bio'); // textarea hakkımda alanı

  // Profil verisini çek
  async function loadProfile() {
    try {
      const res = await fetch('http://localhost:3000/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Profil bilgisi alınamadı');
      const user = await res.json();

      nameInput.value = user.name || '';
      emailInput.value = user.email || '';
      aboutInput.value = user.about || '';
    } catch (error) {
      console.error(error);
      alert('Profil bilgisi yüklenirken hata oluştu');
    }
  }

  // Form submit
  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          about: aboutInput.value,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Profil güncellenemedi');
      }

      alert('Profil başarıyla güncellendi!');
    } catch (error) {
      alert('Hata: ' + error.message);
    }
  });

  await loadProfile();
});
