
  let currentPage = 1;
  const itemsPerPage = 3;

  function saveEntry() {
    const title = document.getElementById('entry-title').value.trim();
    const content = document.getElementById('entry-content').value.trim();
    const date = new Date().toLocaleDateString();

    if (!title || !content) return alert("Lütfen tüm alanları doldurun.");

    const entry = { title, content, date };
    let diary = JSON.parse(localStorage.getItem("mentoria-diary")) || [];

    diary.unshift(entry);
    localStorage.setItem("mentoria-diary", JSON.stringify(diary));

    document.getElementById('entry-title').value = '';
    document.getElementById('entry-content').value = '';
    currentPage = 1;
    loadEntries();
  }

  function loadEntries() {
    const diary = JSON.parse(localStorage.getItem("mentoria-diary")) || [];
    const historyArea = document.getElementById("history-area");
    const pageIndicator = document.getElementById("page-indicator");
    historyArea.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const paginated = diary.slice(start, start + itemsPerPage);

    paginated.forEach(entry => {
      const noteHTML = `
        <div class="border border-gray-200 p-4 rounded bg-gray-50">
          <p class="text-sm text-gray-500">${entry.date}</p>
          <p class="font-semibold">${entry.title}</p>
          <p class="text-sm mt-1">${entry.content}</p>
        </div>`;
      historyArea.innerHTML += noteHTML;
    });

    pageIndicator.textContent = `Sayfa ${currentPage} / ${Math.ceil(diary.length / itemsPerPage)}`;
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      loadEntries();
    }
  }

  function nextPage() {
    const diary = JSON.parse(localStorage.getItem("mentoria-diary")) || [];
    if (currentPage * itemsPerPage < diary.length) {
      currentPage++;
      loadEntries();
    }
  }

  window.onload = loadEntries;
