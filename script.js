function fetchNovels() {
  fetch('https://morally-nearby-penguin.ngrok-free.app/novels')
    .then(response => {
      console.log('Response status:', response.status); // Tambahkan log status
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
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
      alert('Gagal memuat daftar novel.');
    });
}
