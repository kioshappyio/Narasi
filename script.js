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

async function loadNovels() {
    const url = 'https://api.github.com/repos/kioshappyio/Narasi/contents/';
    const response = await fetch(url);
    const data = await response.json();

    document.getElementById('novelList').innerHTML = '';
    data.forEach(file => {
        if (file.name.endsWith('.md')) {
            const title = file.name.replace('.md', '').replace(/-/g, ' ');
            const link = document.createElement('a');
            link.href = "#";
            link.textContent = title;
            link.classList.add('novel-item');
            link.addEventListener('click', function () {
                loadNovelContent(file.name);
            });
            const div = document.createElement('div');
            div.classList.add('novel-item');
            div.appendChild(link);
            document.getElementById('novelList').appendChild(div);
        }
    });
}

async function loadNovelContent(fileName) {
    const url = `https://api.github.com/repos/kioshappyio/Narasi/contents/${fileName}`;
    const response = await fetch(url);
    const data = await response.json();
    const content = atob(data.content);
    const [title, ...body] = content.split('\n');

    // Menampilkan isi novel dalam popup dengan judul yang jelas dan isi cerita terpisah
    Swal.fire({
        title: `<strong>${title.replace('# ', '')}</strong>`,
        html: `<div style="font-size: 0.9rem; line-height: 1.6; font-weight: normal;">${body.join('<br>')}</div>`,
        confirmButtonText: 'Close',
        width: '80%',
        heightAuto: true,
    });
}

loadNovels();
