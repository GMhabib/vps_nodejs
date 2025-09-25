const fs = require('fs').promises;
const path = require('path');
const decompress = require('decompress');

const filesDir = path.join(__dirname, '..', 'files');

// Pastikan direktori 'files' ada
fs.mkdir(filesDir, { recursive: true }).catch(console.error);

// Helper function untuk memeriksa keberadaan file/folder
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// 1. Dapatkan daftar semua file
exports.getFiles = async (req, res) => {
    try {
        const files = await fs.readdir(filesDir);
        res.status(200).json(files);
    } catch (error) {
        res.status(500).send({ message: 'Gagal memuat daftar file.', error: error.message });
    }
};

// 2. Unggah file
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'Tidak ada file yang diunggah.' });
        }
        res.status(200).send({ message: `File '${req.file.filename}' berhasil diunggah.` });
    } catch (error) {
        res.status(500).send({ message: 'Gagal mengunggah file.', error: error.message });
    }
};

// 3. Unduh file
exports.downloadFile = async (req, res) => {
    const filePath = path.join(filesDir, req.params.filename);
    try {
        if (await fileExists(filePath)) {
            res.download(filePath, req.params.filename);
        } else {
            res.status(404).send({ message: 'File tidak ditemukan.' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Gagal mengunduh file.', error: error.message });
    }
};

// 4. Hapus file
exports.deleteFile = async (req, res) => {
    const filePath = path.join(filesDir, req.params.filename);
    try {
        if (await fileExists(filePath)) {
            const stats = await fs.stat(filePath);
            if (stats.isDirectory()) {
                await fs.rm(filePath, { recursive: true, force: true });
                res.status(200).send({ message: 'Folder berhasil dihapus.' });
            } else {
                await fs.unlink(filePath);
                res.status(200).send({ message: 'File berhasil dihapus.' });
            }
        } else {
            res.status(404).send({ message: 'File atau folder tidak ditemukan.' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Gagal menghapus item.', error: error.message });
    }
};

// 5. Buat file baru
exports.createFile = async (req, res) => {
    const { filename, content } = req.body;
    const filePath = path.join(filesDir, filename);
    try {
        if (!filename) {
            return res.status(400).send({ message: 'Nama file harus diisi.' });
        }
        await fs.writeFile(filePath, content || '');
        res.status(201).send({ message: `File '${filename}' berhasil dibuat.` });
    } catch (error) {
        res.status(500).send({ message: 'Gagal membuat file.', error: error.message });
    }
};

// 6. Buat folder baru
exports.createFolder = async (req, res) => {
    const { foldername } = req.body;
    const folderPath = path.join(filesDir, foldername);
    try {
        if (!foldername) {
            return res.status(400).send({ message: 'Nama folder harus diisi.' });
        }
        if (await fileExists(folderPath)) {
            return res.status(409).send({ message: 'Folder sudah ada.' });
        }
        await fs.mkdir(folderPath);
        res.status(201).send({ message: `Folder '${foldername}' berhasil dibuat.` });
    } catch (error) {
        res.status(500).send({ message: 'Gagal membuat folder.', error: error.message });
    }
};

// --- Fitur Baru ---

// 7. Baca konten file
exports.readFile = async (req, res) => {
    const filePath = path.join(filesDir, req.params.filename);
    try {
        if (await fileExists(filePath)) {
            const content = await fs.readFile(filePath, 'utf-8');
            res.status(200).send(content);
        } else {
            res.status(404).send({ message: 'File tidak ditemukan.' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Gagal membaca file.', error: error.message });
    }
};

// 8. Edit dan simpan file
exports.editFile = async (req, res) => {
    const filePath = path.join(filesDir, req.params.filename);
    const { content } = req.body;
    try {
        if (!content) {
            return res.status(400).send({ message: 'Konten tidak boleh kosong.' });
        }
        await fs.writeFile(filePath, content);
        res.status(200).send({ message: 'Perubahan berhasil disimpan.' });
    } catch (error) {
        res.status(500).send({ message: 'Gagal menyimpan file.', error: error.message });
    }
};

// 9. Ekstrak file ZIP
exports.extractFile = async (req, res) => {
    const filePath = path.join(filesDir, req.params.filename);
    try {
        if (!req.params.filename.endsWith('.zip')) {
            return res.status(400).send({ message: 'Hanya file ZIP yang dapat diekstrak.' });
        }
        if (!(await fileExists(filePath))) {
            return res.status(404).send({ message: 'File tidak ditemukan.' });
        }
        await decompress(filePath, filesDir);
        res.status(200).send({ message: 'File ZIP berhasil diekstrak.' });
    } catch (error) {
        res.status(500).send({ message: 'Gagal mengekstrak file.', error: error.message });
    }
};
