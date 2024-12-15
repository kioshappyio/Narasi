// URL backend
const backendUrl = 'https://morally-nearby-penguin.ngrok-free.app';

// Mengambil elemen
const uploadForm = document.getElementById('uploadForm');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const novelList = document.getElementById('novelList');

// Fungsi upload novel
uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value;
  const content = contentInput.value;

  fetch(`${backendUrl}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Novel berhasil diupload!');
      titleInput.value = '';
      contentInput.value = '';
      fetchNovels(); // Perbarui daftar novel
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Gagal mengupload novel.');
    });
});

// Fungsi untuk mendapatkan daftar novel
function fetchNovels() {
  fetch(`${backendUrl}/novels`)
    .then((response) => response.json())
    .then((novels) => {
      novelList.innerHTML = '';
      novels.forEach((novel) => {
        const novelItem = document.createElement('div');
        novelItem.classList.add('novel-item');
        novelItem.innerHTML = `
          <h3>${novel.title}</h3>
          <p>${novel.content.substring(0, 100)}...</p>
        `;
        novelList.appendChild(novelItem);
      });
    })
    .catch((error) => console.error('Error fetching novels:', error));
}

// Panggil fetchNovels saat halaman dimuat
fetchNovels();
