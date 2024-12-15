// Mengambil elemen-elemen yang dibutuhkan
const uploadForm = document.getElementById('uploadForm');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');

// URL backend Ngrok
const backendUrl = 'https://morally-nearby-penguin.ngrok-free.app/upload';

// Menangani pengiriman form
uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value;
  const content = contentInput.value;

  // Mengirim data novel ke backend
  fetch(backendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content })
  })
  .then(response => response.json())
  .then(data => {
    alert('Novel berhasil diupload!');
    titleInput.value = '';
    contentInput.value = '';
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Gagal mengupload novel.');
  });
});

// Mengambil daftar novel (opsional)
function fetchNovels() {
  fetch('https://morally-nearby-penguin.ngrok-free.app/novels')
    .then(response => response.json())
    .then(novels => {
      const novelList = document.getElementById('novelList');
      novelList.innerHTML = ''; // Kosongkan daftar sebelumnya

      novels.forEach(novel => {
        const novelItem = document.createElement('div');
        novelItem.classList.add('novel-item');
        novelItem.innerHTML = `
          <h3>${novel.title}</h3>
          <p>${novel.content.substring(0, 100)}...</p>
        `;
        novelList.appendChild(novelItem);
      });
    })
    .catch(error => {
      console.error('Error fetching novels:', error);
    });
}

// Panggil fungsi untuk mengambil daftar novel saat halaman dimuat
window.onload = fetchNovels;
