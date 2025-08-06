const express = require('express');
const router = express.Router();
const Goal = require('../../models/goal');
const authenticate = require('../../middleware/auth');

// CREATE Goal
router.post('/create', authenticate, async (req, res) => {
  try {
    const { name, note } = req.body;
    if (!name) return res.status(400).json({ error: 'İsim gerekli' });

    const goal = new Goal({ user: req.user.id, name, note });
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hedef oluşturulamadı' });
  }
});

// LIST Goals
router.get('/list', authenticate, async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user.id,
      isArchived: false,
    }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Hedefler getirilemedi' });
  }
});

// DELETE Goal
router.delete('/delete/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await Goal.deleteOne({ _id: id, user: req.user.id });
    res.json({ message: 'Hedef silindi' });
  } catch (err) {
    res.status(500).json({ error: 'Hedef silinemedi' });
  }
});

// ARCHIVE Goal
router.post('/archive/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOne({ _id: id, user: req.user.id });
    if (!goal) return res.status(404).json({ error: 'Hedef bulunamadı' });

    goal.isArchived = true;
    await goal.save();
    res.json({ message: 'Hedef arşivlendi' });
  } catch (err) {
    res.status(500).json({ error: 'Arşivleme işlemi başarısız' });
  }
});

// LIST Archived Goals
router.get('/archived', authenticate, async (req, res) => {
  try {
    const archivedGoals = await Goal.find({
      user: req.user.id, // ya req.user._id, sen hangisini kullanıyorsan
      isArchived: true,
    }).sort({ createdAt: -1 });

    res.json(archivedGoals);
  } catch (err) {
    res.status(500).json({ error: 'Arşivlenen hedefler getirilemedi' });
  }
});

module.exports = router;
