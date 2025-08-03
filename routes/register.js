const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'E-posta zaten kayıtlı.' });

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Kayıt başarılı' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
