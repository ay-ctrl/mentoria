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
      if (user.avatar) {
        profileImg.src = `images/${user.avatar}`;
      } else {
        profileImg.src = 'images/image.png'; // varsayılan
      }
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
          avatar: window.avatarSelector.getSelectedAvatar(), // BURAYA EKLEDİK
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

function setupAvatarSelector() {
  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const avatarSelector = document.getElementById('avatarSelector');
  const profileImg = document.getElementById('profileImg');

  // Avatar dosyaları
  const avatars = [
    'avatar1.png',
    'avatar2.png',
    'avatar3.png',
    'avatar4.png',
    'image.png', // mevcut varsayılan
  ];

  let selectedAvatar = profileImg.src.split('/').pop() || 'image.png';

  // Avatar listesini oluştur
  function renderAvatars(selected) {
    avatarSelector.innerHTML = '';
    avatars.forEach((avatar) => {
      const img = document.createElement('img');
      img.src = `images/${avatar}`;
      img.alt = avatar;
      img.className = `w-16 h-16 rounded-full cursor-pointer border-4 ${
        avatar === selected ? 'border-[#E84230]' : 'border-transparent'
      }`;
      img.addEventListener('click', () => {
        selectedAvatar = avatar;
        profileImg.src = `images/${selectedAvatar}`; // seçilen avatarı profil resmine yansıt
        renderAvatars(selectedAvatar);
      });
      avatarSelector.appendChild(img);
    });
  }

  // Butona tıklayınca avatar seçici göster/gizle
  changeAvatarBtn.addEventListener('click', () => {
    if (
      avatarSelector.style.display === 'none' ||
      !avatarSelector.style.display
    ) {
      avatarSelector.style.display = 'flex';
      renderAvatars(selectedAvatar);
    } else {
      avatarSelector.style.display = 'none';
    }
  });

  // Seçilen avatarı dışarıya vermek için getter fonksiyon
  return {
    getSelectedAvatar: () => selectedAvatar,
  };
}

// Sayfa yüklendiğinde çağır ve sonucu sakla:
document.addEventListener('DOMContentLoaded', () => {
  window.avatarSelector = setupAvatarSelector();
});
