const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Rute untuk pendaftaran user baru
router.post('/register', authController.register);

// Rute untuk login user yang sudah terdaftar
router.post('/login', authController.login);

module.exports = router;
