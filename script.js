const API_BASE = 'https://morally-nearby-penguin.ngrok-free.app';

document.getElementById('novelForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
        Swal.fire('Error', 'Title and content are required.', 'error');
        return;
    }

    const response = await fetch(`${API_BASE}/save-novel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });

    const result = await response.json();
    Swal.fire('Success', result.message, 'success');
    loadNovels();
});

async function loadNovels(path = '') {
    const baseUrl = 'https://api.github.com/repos/kioshappyio/Narasi/contents/';
    const url = `${baseUrl}${path}`;
    const response = await fetch(url);
    const data = await response.json();

    const novelList = document.getElementById('novelList');
    novelList.innerHTML = '';

    data.forEach(item => {
        if (item.type === 'dir') {
            // Jika item adalah folder, tampilkan sebagai kategori
            const folderDiv = document.createElement('div');
            folderDiv.classList.add('folder-item');
            folderDiv.textContent = item.name;

            folderDiv.addEventListener('click', () => {
                loadNovels(`${path}${item.name}/`); // Buka folder
            });

            novelList.appendChild(folderDiv);
        } else if (item.name.endsWith('.md')) {
            // Jika item adalah file markdown, tampilkan sebagai daftar
            const title = item.name.replace('.md', '').replace(/-/g, ' ');
            const link = document.createElement('a');
            link.href = "#";
            link.textContent = title;
            link.classList.add('novel-item');

            link.addEventListener('click', () => {
                loadNovelContent(`${path}${item.name}`); // Load isi file
            });

            const div = document.createElement('div');
            div.classList.add('novel-item');
            div.appendChild(link);
            novelList.appendChild(div);
        }
    });
}

async function loadNovelContent(filePath) {
    const url = `https://api.github.com/repos/kioshappyio/Narasi/contents/${filePath}`;
    const response = await fetch(url);
    const data = await response.json();
    const content = atob(data.content);
    const [title, ...body] = content.split('\n');

    Swal.fire({
        title: `<strong>${title.replace('# ', '')}</strong>`,
        html: `<div style="font-size: 0.9rem; line-height: 1.6; font-weight: normal;">${body.join('<br>')}</div>`,
        confirmButtonText: 'Close',
        width: '80%',
        heightAuto: true,
    });
}

// Mulai dengan root folder
loadNovels();
