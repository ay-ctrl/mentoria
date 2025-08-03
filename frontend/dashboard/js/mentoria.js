document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('button');
  const inputField = document.getElementById('input');
  const chatBox = document.getElementById('chatArea');

  async function sendToMentoria() {
    const userInput = inputField.value.trim();
    if (!userInput) return;

    // Kullanıcı mesajını ekle
    chatBox.innerHTML += `
    <div class="mb-4 flex justify-end">
      <div class="bg-gray-100 p-3 rounded-md max-w-md">
        <p class="text-sm font-semibold text-[#E84230]">Sen:</p>
        <p class="text-black text-sm mt-1">${userInput}</p>
      </div>
    </div>
  `;
    chatBox.scrollTop = chatBox.scrollHeight;
    inputField.value = '';

    sendButton.disabled = true;
    inputField.disabled = true;

    const typingId = 'typing-indicator';
    chatBox.innerHTML += `
    <div class="mb-4" id="${typingId}">
      <div class="bg-gray-100 p-3 rounded-md max-w-md">
        <p class="text-sm"><span class="font-semibold text-[#E84230]">Mentoriá:</span></p>
        <p class="typing-indicator"><span>.</span><span>.</span><span>.</span></p>
      </div>
    </div>
  `;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      // LocalStorage'dan token al
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Kullanıcı oturumu yok.');

      const response = await fetch('http://localhost:3000/mentoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Token'ı header'a ekle
        },
        body: JSON.stringify({
          message: userInput, // userId gönderme
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Sunucu hatası');
      }

      const data = await response.json();
      const reply = data.reply || "Mentoriá'dan yanıt alınamadı.";

      // Animasyon mesajını kaldır
      const typingElement = document.getElementById(typingId);
      if (typingElement) typingElement.remove();

      // Gelen cevabı göster
      chatBox.innerHTML += `
      <div class="mb-4">
        <div class="bg-gray-100 p-3 rounded-md max-w-md">
          <p class="text-sm"><span class="font-semibold text-[#E84230]">Mentoriá:</span></p>
          <p class="text-black text-sm mt-1">${reply}</p>
        </div>
      </div>
    `;
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
      console.error('Hata:', error);

      const typingElement = document.getElementById(typingId);
      if (typingElement) typingElement.remove();

      chatBox.innerHTML += `
      <div class="mb-4 text-red-500">Bir hata oluştu: ${error.message}</div>
    `;
    }

    sendButton.disabled = false;
    inputField.disabled = false;
    inputField.focus();
  }

  sendButton.addEventListener('click', () => {
    sendToMentoria();
  });

  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendToMentoria();
    }
  });
});
