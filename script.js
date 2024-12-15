document.getElementById('uploadForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  // Kirim data novel ke backend
  fetch('http://localhost:3000/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content })
  })
  .then(response => response.json())
  .then(data => {
    alert('Novel berhasil diupload!');
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Gagal mengupload novel.');
  });
});

// Mengambil daftar novel untuk ditampilkan
fetch('http://localhost:3000/novels')
  .then(response => response.json())
  .then(data => {
    const novelList = document.getElementById('novelList');
    novelList.innerHTML = data.map(novel => `<div><h3>${novel.title}</h3><p>${novel.content}</p></div>`).join('');
  })
  .catch(error => console.error('Error:', error));
