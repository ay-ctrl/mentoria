document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('button');
  const inputField = document.getElementById('input');
  const chatBox = document.querySelector('.h-64');

  async function sendToGemini() {
    const input = document.getElementById('input');
    const chatBox = document.querySelector('.h-64');

    const userInput = input.value.trim();
    if (!userInput) return;

    // Kullanıcı mesajını anında göster
    chatBox.innerHTML += `
    <div class="mb-4">
      <div class="bg-gray-100 p-3 rounded-md">
        <p class="text-sm"><span class="font-semibold text-[#E84230]">Sen:</span></p>
        <p class="text-black text-sm mt-1">${userInput}</p>
      </div>
    </div>
  `;
    chatBox.scrollTop = chatBox.scrollHeight; // En aşağıya kaydır
    input.value = '';

    // Sunucuya isteği gönder ve yanıtı bekle
    try {
      const response = await fetch('http://localhost:3000/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      const data = await response.json();

      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Mentoriá'dan yanıt alınamadı.";

      // Gemini yanıtını göster
      chatBox.innerHTML += `
      <div class="mb-4">
        <div class="bg-gray-100 p-3 rounded-md">
          <p class="text-sm"><span class="font-semibold text-[#E84230]">Mentoriá:</span></p>
          <p class="text-black text-sm mt-1">${reply}</p>
        </div>
      </div>
    `;
      chatBox.scrollTop = chatBox.scrollHeight; // En aşağıya kaydır
    } catch (error) {
      console.error('Hata:', error);
    }
  }

  sendButton.addEventListener('click', () => {
    const userInput = inputField.value.trim();
    if (!userInput) return;

    sendToGemini(userInput);
    inputField.value = '';
  });

  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendButton.click();
    }
  });
});
