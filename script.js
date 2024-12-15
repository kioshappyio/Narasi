const repoOwner = 'kioshappyio'; // Ganti dengan nama pengguna GitHub Anda
const repoName = 'Narasi'; // Ganti dengan nama repositori Anda

// Fungsi untuk mengambil novel dari repositori
async function getNovels() {
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/novels`, {
            method: 'GET',
            headers: {
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

// Panggil getNovels untuk menampilkan daftar novel pertama kali
getNovels();
