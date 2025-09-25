const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).send({ message: 'No token provided!' });
  }
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'YOUR_SECRET_KEY');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Invalid token!' });
  }
};
