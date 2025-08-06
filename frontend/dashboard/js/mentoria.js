document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('button');
  const inputField = document.getElementById('input');
  const chatBox = document.getElementById('chatArea');

  // 1. Sohbet geçmişini getirip ekle
  async function loadChatHistory() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Kullanıcı oturumu yok.');

      const res = await fetch('http://localhost:3000/mentoria/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Geçmiş alınamadı');
      }

      const messages = await res.json();

      messages.forEach((msg) => {
        const isUser = msg.role === 'user';
        const contentHtml = marked.parse(msg.content); // Markdown => HTML

        chatBox.innerHTML += `
        <div class="mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}">
          <div class="bg-gray-100 p-3 rounded-md max-w-md">
            <p class="text-sm font-semibold text-[#E84230]">${
              isUser ? 'Sen' : 'Mentoriá'
            }:</p>
            <div class="text-black text-sm mt-1">${contentHtml}</div>
          </div>
        </div>
      `;
      });

      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
      console.error('Geçmiş yüklenirken hata:', error);
      chatBox.innerHTML += `<div class="text-red-500 mb-4">Geçmiş sohbet yüklenemedi.</div>`;
    }
  }

  // 2. Mevcut sendToMentoria fonksiyonun aynen
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
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Kullanıcı oturumu yok.');

      const response = await fetch('http://localhost:3000/mentoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Sunucu hatası');
      }

      const data = await response.json();
      const reply = data.reply || "Mentoriá'dan yanıt alınamadı.";
      const htmlReply = marked.parse(reply);

      // Animasyon mesajını kaldır
      const typingElement = document.getElementById(typingId);
      if (typingElement) typingElement.remove();

      // Gelen cevabı göster
      chatBox.innerHTML += `
      <div class="mb-4 flex justify-start">
        <div class="bg-gray-100 p-3 rounded-md max-w-md">
          <p class="text-sm font-semibold text-[#E84230]">Mentoriá:</p>
          <div class="text-black text-sm mt-1">${htmlReply}</div>
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

  // 3. Sayfa yüklenince sohbet geçmişini yükle
  loadChatHistory();

  // Eventler
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
