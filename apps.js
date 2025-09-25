const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const multer = require('multer');

// Import routes and middlewares
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');
const fileController = require('./controllers/fileController');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vps_clone')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Ensure the 'files' directory exists
const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

// Multer configuration for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, filesDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Core middleware
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Specific file upload route with multer and role middleware
app.post('/api/files/upload', authMiddleware, roleMiddleware('admin'), upload.single('uploadedFile'), fileController.uploadFile);

// All other file routes (excluding upload) are handled by fileRoutes.js
app.use('/api/files', authMiddleware, fileRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Spawning the ssh command for serveo.net
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
