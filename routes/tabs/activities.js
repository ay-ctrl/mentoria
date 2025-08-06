// routes//tabs//activities.js içinde

const express = require('express');
const router = express.Router();
const Activity = require('../../models/activity'); // Mongoose modeli
const authenticateToken = require('../../middleware/auth'); // JWT doğrulama middleware'i

// Kullanıcının tüm aktivitelerini getir
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const activities = await Activity.find({ userId });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Yeni aktivite oluştur
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const newActivity = new Activity({ ...req.body, userId });
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(400).json({ message: 'Geçersiz veri' });
  }
});

// Aktiviteyi sil
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const activityId = req.params.id;

    const deletedActivity = await Activity.findOneAndDelete({
      _id: activityId,
      userId,
    });

    if (!deletedActivity) {
      return res
        .status(404)
        .json({ message: 'Aktivite bulunamadı veya yetkiniz yok' });
    }

    res.json({ message: 'Aktivite başarıyla silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
