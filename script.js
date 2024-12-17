const API_BASE = 'https://morally-nearby-penguin.ngrok-free.app';

// Event listener untuk form pengisian chapter
document.getElementById('novelForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = document.getElementById('category').value;
    const chapter = document.getElementById('chapter').value;
    const content = document.getElementById('content').value;

    if (!category || !chapter || !content) {
        Swal.fire('Error', 'Category, chapter, and content are required.', 'error');
        return;
    }

    // Kirim permintaan ke backend
    const response = await fetch(`${API_BASE}/save-chapter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, chapter, content }),
    });

    const result = await response.json();

    if (response.ok) {
        Swal.fire('Success', result.message, 'success');
        loadCategories();
    } else {
        Swal.fire('Error', result.message || 'Failed to save the chapter.', 'error');
    }
});

// Fungsi untuk memuat kategori dan chapter
async function loadCategories() {
    const response = await fetch(`${API_BASE}/categories`);
    const data = await response.json();
    console.log(data); // Debugging untuk memeriksa data yang diterima

    const novelList = document.getElementById('novelList');
    novelList.innerHTML = ''; // Kosongkan daftar

    data.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category-item');
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.name.replace(/-/g, ' ');
        categoryDiv.appendChild(categoryTitle);

        category.chapters.forEach(chapter => {
            const chapterLink = document.createElement('a');
            chapterLink.href = "#";
            chapterLink.textContent = chapter.name.replace(/-/g, ' ');
            chapterLink.classList.add('chapter-item');
            chapterLink.addEventListener('click', () => loadChapterContent(category.name, chapter.name));
            const chapterDiv = document.createElement('div');
            chapterDiv.appendChild(chapterLink);
            categoryDiv.appendChild(chapterDiv);
        });

        novelList.appendChild(categoryDiv);
    });
}

// Fungsi untuk memuat isi chapter
async function loadChapterContent(category, chapter) {
    // Debugging: Tampilkan URL yang akan digunakan
    const url = `https://raw.githubusercontent.com/kioshappyio/Narasi/main/${category}/${chapter}.md`;
    console.log('Loading chapter from URL:', url); // Debugging

    const response = await fetch(url);
    
    if (!response.ok) {
        Swal.fire('Error', 'Chapter not found.', 'error');
        return;
    }

    const content = await response.text();
    const [title, ...body] = content.split('\n');

    // Tampilkan isi chapter dalam popup
    Swal.fire({
        title: `<strong>${title.replace('# ', '')}</strong>`,
        html: `<div style="font-size: 0.9rem; line-height: 1.6; font-weight: normal;">${body.join('<br>')}</div>`,
        confirmButtonText: 'Close',
        width: '80%',
        heightAuto: true,
    });
}

// Panggil fungsi untuk memuat kategori dan chapter saat halaman dimuat
loadCategories();
