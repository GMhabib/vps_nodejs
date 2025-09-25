const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Semua rute di bawah ini memerlukan otentikasi (authMiddleware)
router.use(authMiddleware);

// Semua rute di bawah ini membutuhkan peran admin
router.use(roleMiddleware('admin'));

// Rute untuk mendapatkan semua pengguna
router.get('/', userController.getAllUsers);

// Rute untuk menghapus pengguna
router.delete('/delete/:userId', userController.deleteUser);

module.exports = router;
