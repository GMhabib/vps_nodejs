const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes'); // Import rute pengguna

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vps_clone')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Buat direktori 'files' jika belum ada
const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

// Middleware
app.use(express.json());

// Melayani file statis dari direktori 'public'
app.use(express.static('public'));

// Rute dasar untuk mengarahkan pengguna ke index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes); // Gunakan rute pengguna

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Menjalankan perintah ssh serveo.net
  const serveo = spawn('ssh', ['-R', 'habibgm:80:localhost:3000', 'serveo.net']);

  serveo.stdout.on('data', (data) => {
    console.log(`Serveo.net: ${data}`);
  });

  serveo.stderr.on('data', (data) => {
    console.error(`Serveo.net error: ${data}`);
  });

  serveo.on('close', (code) => {
    console.log(`Serveo.net process exited with code ${code}`);
  });
});
