document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // sayfanın yeniden yüklenmesini engelle

    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Başarılı giriş
        localStorage.setItem('token', data.token); // varsa token kaydet
        alert('Giriş başarılı!');
        window.location.href = '../dashboard/dashboard.html';
      } else {
        alert(data.message || 'Giriş başarısız.');
      }
    } catch (err) {
      console.error('Hata:', err);
      alert('Sunucu hatası.');
    }
  });
});
