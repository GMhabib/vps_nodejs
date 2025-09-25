const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).send({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: 'User not found!' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials!' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
