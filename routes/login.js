const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // Giriş başarılı, token oluştur (isteğe bağlı)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: '1d',
      }
    );

    res.json({ message: 'Giriş başarılı', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
