const express = require('express');
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Semua rute di bawah ini memerlukan otentikasi (authMiddleware)
router.use(authMiddleware);

// Rute untuk membaca semua file
// Semua user (admin & user biasa) bisa mengaksesnya
router.get('/', fileController.readAllFiles);

// Rute untuk membuat file baru
// Hanya admin dan user yang bisa membuat file
router.post('/create', fileController.createFile);

// Rute untuk menghapus file
// HANYA ADMIN yang memiliki hak untuk menghapus file
router.delete('/delete/:filename', roleMiddleware('admin'), fileController.deleteFile);

module.exports = router;
