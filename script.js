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

    const response = await fetch(`${API_BASE}/save-novel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, chapter, title, content }),
    });

    const result = await response.json();
    if (response.ok) {
        Swal.fire('Success', result.message, 'success');
        loadNovels(); // Reload daftar novel
    } else {
        Swal.fire('Error', result.message || 'Failed to save the novel.', 'error');
    }
});

// Fungsi utama untuk memuat folder atau file
async function loadNovels(path = '', breadcrumbPath = 'Home') {
    try {
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

        // Update breadcrumb
        const breadcrumbItems = breadcrumbPath.split('/').filter(Boolean);
        breadcrumb.innerHTML = '';
        breadcrumbItems.forEach((item, index) => {
            const currentPath = breadcrumbItems.slice(0, index + 1).join('/');
            const link = document.createElement('a');
            link.href = 'javascript:void(0);';
            link.textContent = item;
            link.addEventListener('click', () => {
                loadNovels(`${currentPath}/`, currentPath);
            });
            breadcrumb.appendChild(link);

            if (index < breadcrumbItems.length - 1) {
                breadcrumb.innerHTML += ' > ';
            }
        });

        // Menampilkan folder dan file
        data.forEach((item) => {
            if (item.type === 'dir') {
                const folderDiv = document.createElement('div');
                folderDiv.classList.add('folder-item');
                folderDiv.textContent = item.name;
                folderDiv.addEventListener('click', () => {
                    loadNovels(`${path}${item.name}/`, `${breadcrumbPath}/${item.name}`);
                });
                novelList.appendChild(folderDiv);
            } else if (item.name.endsWith('.md')) {
                const title = item.name.replace('.md', '').replace(/-/g, ' ');
                const link = document.createElement('a');
                link.href = 'javascript:void(0);';
                link.textContent = title;
                link.classList.add('novel-item');
                link.addEventListener('click', () => {
                    loadNovelContent(`${path}${item.name}`);
                });

                const div = document.createElement('div');
                div.classList.add('novel-item');
                div.appendChild(link);
                novelList.appendChild(div);
            }
        });
    } catch (error) {
        console.error('Error loading novels:', error);
    }
}

// Fungsi untuk memuat konten novel
async function loadNovelContent(filePath) {
    try {
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
    } catch (error) {
        console.error('Error loading novel content:', error);
    }
}

// Inisialisasi
window.onload = () => {
    loadNovels('', 'Home');
};
