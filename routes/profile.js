const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticate = require('../middleware/auth'); // Token doğrulama middleware'i

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('name email about');
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Profil verisi alınamadı' });
  }
});

router.put('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, about } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (about !== undefined) user.about = about;

    await user.save();

    res.json({ message: 'Profil güncellendi', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Profil güncellenemedi' });
  }
});

module.exports = router;
