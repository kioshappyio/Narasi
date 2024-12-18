const API_BASE = 'https://morally-nearby-penguin.ngrok-free.app';

// Breadcrumb Navigation
let currentPath = '';

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
    loadNovels(currentPath); // Reload current folder
});

async function loadNovels(path = '') {
    const baseUrl = 'https://api.github.com/repos/kioshappyio/Narasi/contents/';
    const url = `${baseUrl}${path}`;
    const response = await fetch(url);
    const data = await response.json();

    const novelList = document.getElementById('novelList');
    novelList.innerHTML = '';

    // Tambahkan breadcrumb
    updateBreadcrumb(path);

    data.forEach(item => {
        if (item.type === 'dir') {
            // Folder sebagai kategori
            const folderDiv = document.createElement('div');
            folderDiv.classList.add('folder-item');
            folderDiv.innerHTML = `<strong>[Folder]</strong> ${item.name}`;

            folderDiv.addEventListener('click', () => {
                currentPath = `${path}${item.name}/`;
                loadNovels(currentPath); // Masuk ke folder
            });

            novelList.appendChild(folderDiv);
        } else if (item.name.endsWith('.md')) {
            // File markdown
            const title = item.name.replace('.md', '').replace(/-/g, ' ');
            const link = document.createElement('a');
            link.href = "#";
            link.textContent = title;
            link.classList.add('novel-item');

            link.addEventListener('click', () => {
                loadNovelContent(`${path}${item.name}`); // Tampilkan isi file
            });

            const div = document.createElement('div');
            div.classList.add('novel-item');
            div.innerHTML = `<strong>[File]</strong> `;
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

function updateBreadcrumb(path) {
    const breadcrumbContainer = document.getElementById('breadcrumb');
    breadcrumbContainer.innerHTML = '';

    const segments = path.split('/').filter(Boolean);
    let cumulativePath = '';

    const homeLink = document.createElement('span');
    homeLink.textContent = 'Home';
    homeLink.classList.add('breadcrumb-item');
    homeLink.addEventListener('click', () => {
        currentPath = '';
        loadNovels();
    });

    breadcrumbContainer.appendChild(homeLink);

    segments.forEach((segment, index) => {
        cumulativePath += `${segment}/`;

        const separator = document.createTextNode(' > ');
        breadcrumbContainer.appendChild(separator);

        const breadcrumbItem = document.createElement('span');
        breadcrumbItem.textContent = segment;
        breadcrumbItem.classList.add('breadcrumb-item');

        breadcrumbItem.addEventListener('click', () => {
            currentPath = segments.slice(0, index + 1).join('/') + '/';
            loadNovels(currentPath);
        });

        breadcrumbContainer.appendChild(breadcrumbItem);
    });
}

// Mulai dengan root folder
loadNovels();
