document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Tokenu localStorage'dan alıyoruz
      },
    });

    const user = await response.json();

    if (user.avatar) {
      const profileImages = document.querySelectorAll('img[alt="profil"]');
      profileImages.forEach((img) => {
        img.src = `images/${user.avatar}`;
      });
    }
  } catch (error) {
    console.error('Profil resmi yüklenemedi:', error);
  }
});
