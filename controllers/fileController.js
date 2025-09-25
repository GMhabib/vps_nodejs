const fs = require('fs').promises;
const path = require('path');

const baseDir = path.join(__dirname, '..', 'files');

exports.createFile = async (req, res) => {
  const { filename, content } = req.body;
  if (!filename) {
    return res.status(400).send({ message: 'Filename is required!' });
  }
  const filePath = path.join(baseDir, filename);
  try {
    await fs.writeFile(filePath, content || '');
    res.status(201).send({ message: 'File created successfully!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.readAllFiles = async (req, res) => {
  try {
    const files = await fs.readdir(baseDir);
    res.send(files);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  // Hanya admin yang bisa menghapus
  if (req.user.role !== 'admin') {
    return res.status(403).send({ message: 'Access denied. Only admin can delete files.' });
  }
  const { filename } = req.params;
  const filePath = path.join(baseDir, filename);
  try {
    await fs.unlink(filePath);
    res.send({ message: 'File deleted successfully!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
