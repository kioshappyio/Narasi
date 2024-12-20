const API_BASE = 'https://morally-nearby-penguin.ngrok-free.app'; // Ganti dengan URL server Anda

// Menghandle Form Submit untuk upload novel
document.getElementById('novelForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = document.getElementById('category').value.trim();
    const chapter = document.getElementById('chapter').value.trim();
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!category || !chapter || !title || !content) {
        Swal.fire('Error', 'Category, chapter, title, and content are required.', 'error');
        return;
    }

    // Struktur folder: [Kategori]/[Chapter]
    const folderPath = `${category.toLowerCase().replace(/\s+/g, '-')}/${chapter}`;
    const fileName = `${title.replace(/\s+/g, '-').toLowerCase()}.md`;

    // Menyimpan novel ke GitHub dengan struktur folder
    const response = await fetch(`${API_BASE}/save-novel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, chapter, title, content }) // Sesuaikan data yang dikirim
    });

    const result = await response.json();
    if (response.ok) {
        Swal.fire('Success', result.message, 'success');
        loadNovels();  // Memuat ulang daftar novel setelah upload berhasil
    } else {
        Swal.fire('Error', result.message || 'Failed to save the novel.', 'error');
    }
});

// Load Folder dan File Novel
async function loadNovels(path = '', breadcrumbPath = 'Home') {
    const baseUrl = 'https://api.github.com/repos/kioshappyio/Narasi/contents/';
    const url = `${baseUrl}${path}`;
    const response = await fetch(url);
    const data = await response.json();

    const novelList = document.getElementById('novelList');
    const breadcrumb = document.getElementById('breadcrumb');
    novelList.innerHTML = '';

    if (!data || data.length === 0) {
        novelList.innerHTML = 'No novels found.';
        return;
    }

    // Memperbarui breadcrumb
    const breadcrumbItems = breadcrumbPath.split('/').filter(item => item);
    breadcrumb.innerHTML = '<a href="/">Home</a>';
    breadcrumbItems.forEach((item, index) => {
        const currentPath = breadcrumbItems.slice(0, index + 1).join('/');
        breadcrumb.innerHTML += ` > <a href="javascript:void(0);" onclick="loadNovels('${currentPath}/', '${currentPath}')">${item}</a>`;
    });

    // Memuat novel atau folder
    data.forEach(item => {
        if (item.type === 'dir') {
            // Folder: tampilkan sebagai kategori
            const folderDiv = document.createElement('div');
            folderDiv.classList.add('folder-item');
            folderDiv.textContent = item.name;

            // Ketika folder diklik, load isi folder
            folderDiv.addEventListener('click', () => {
                loadNovels(`${path}${item.name}/`, `${breadcrumbPath}/${item.name}`);
            });

            novelList.appendChild(folderDiv);
        } else if (item.name.endsWith('.md')) {
            // File markdown: tampilkan sebagai chapter
            const title = item.name.replace('.md', '').replace(/-/g, ' ');
            const link = document.createElement('a');
            link.href = "#";
            link.textContent = title;
            link.classList.add('novel-item');

            // Ketika file diklik, load konten novel
            link.addEventListener('click', () => {
                loadNovelContent(`${path}${item.name}`);
            });

            const div = document.createElement('div');
            div.classList.add('novel-item');
            div.appendChild(link);
            novelList.appendChild(div);
        }
    });
}

// Menampilkan konten novel ketika diklik
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

// Memulai dengan folder root
window.onload = () => {
    loadNovels('', 'Home');
};
