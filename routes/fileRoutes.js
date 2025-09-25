const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Middleware untuk melindungi semua rute file
router.use(authMiddleware);

// Rute untuk mendapatkan daftar semua file
router.get('/', fileController.getFiles);

// Rute untuk membuat file baru
router.post('/create', fileController.createFile);

// Rute untuk mengunduh file
router.get('/download/:filename', fileController.downloadFile);

// --- Rute Baru untuk Fitur Edit & Ekstrak ---

// Rute untuk membaca konten file
router.get('/read/:filename', fileController.readFile);

// Rute untuk mengedit dan menyimpan perubahan file
router.post('/edit/:filename', fileController.editFile);

// Rute untuk mengekstrak file ZIP
router.post('/extract/:filename', fileController.extractFile);

// --- Rute yang Memerlukan Peran 'admin' ---

// Gunakan middleware role 'admin' hanya untuk rute di bawahnya
router.use(roleMiddleware('admin'));

// Rute untuk mengunggah file
router.post('/upload', fileController.uploadFile);

// Rute untuk membuat folder
router.post('/create-folder', fileController.createFolder);

// Rute untuk menghapus file atau folder
router.delete('/delete/:filename', fileController.deleteFile);


module.exports = router;
