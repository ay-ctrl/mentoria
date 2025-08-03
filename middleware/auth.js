const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token bulunamadı' });

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Geçersiz token' });
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;
