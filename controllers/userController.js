// controllers/userController.js
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username role'); // Pastikan 'username' dan 'role' dieja dengan benar
        res.status(200).send(users);
    } catch (error) {
        // Log error di server agar Anda bisa melihatnya
        console.error('Error in getAllUsers:', error);
        res.status(500).send({ message: 'Terjadi kesalahan server.', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.status(200).send({ message: 'Pengguna berhasil dihapus.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
