// Personal Access Token Anda
const token = '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'; // Ganti dengan token Anda
const repoOwner = 'kioshappyio'; // Ganti dengan nama pengguna GitHub Anda
const repoName = 'Narasi'; // Ganti dengan nama repositori Anda

// Fungsi untuk mengambil novel dari repositori
async function getNovels() {
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/novels`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil data novel: " + response.statusText);
        }

        const data = await response.json();
        displayNovels(data);
    } catch (error) {
        console.error(error);
    }
}

// Fungsi untuk menampilkan daftar novel
function displayNovels(novels) {
    const novelsContainer = document.getElementById("novels-container");
    novelsContainer.innerHTML = ''; // Kosongkan kontainer

    if (novels.length === 0) {
        novelsContainer.innerHTML = `<p class="text-center text-muted">Belum ada novel yang di-upload.</p>`;
        return;
    }

    novels.forEach(novel => {
        const card = document.createElement("div");
        card.classList.add("col-md-4", "mb-4");
        card.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${novel.name.replace('.md', '')}</h5>
                    <p class="card-text">Klik untuk membaca...</p>
                    <a href="#" class="btn btn-primary" onclick="readNovel('${novel.path}')">Baca Selengkapnya</a>
                </div>
            </div>
        `;
        novelsContainer.appendChild(card);
    });
}

// Fungsi untuk membaca novel (fetch konten file)
async function readNovel(filePath) {
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil konten novel: " + response.statusText);
        }

        const data = await response.json();
        const content = atob(data.content);  // Meng-decode dari base64
        Swal.fire({
            title: 'Novel Lengkap',
            text: content,
            icon: 'info',
            confirmButtonText: 'Tutup'
        });
    } catch (error) {
        console.error(error);
    }
}

// Fungsi untuk meng-upload novel baru
async function uploadNovel(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (title.trim() === "" || content.trim() === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Judul dan Isi Novel wajib diisi!',
        });
        return;
    }

    const fileName = `${title.replace(/\s+/g, '_')}.md`;
    const fileContent = btoa(content); // Encode konten novel ke base64

    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/novels/${fileName}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `Upload novel ${title}`,
                content: fileContent
            })
        });

        if (!response.ok) {
            throw new Error("Gagal meng-upload novel: " + response.statusText);
        }

        Swal.fire({
            icon: 'success',
            title: 'Novel berhasil di-upload!',
            text: `Novel "${title}" telah berhasil di-upload.`,
        });

        // Reset form dan perbarui daftar novel
        document.getElementById("uploadForm").reset();
        getNovels();  // Memperbarui daftar novel
    } catch (error) {
        console.error(error);
    }
}

// Event listener untuk form upload
document.getElementById("uploadForm").addEventListener("submit", uploadNovel);

// Panggil getNovels untuk menampilkan daftar novel pertama kali
getNovels();
