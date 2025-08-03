const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const authMiddleware = require('../middleware/auth'); // JWT doğrulama middleware

const API_KEY = process.env.GEMINI_KEY;

// authMiddleware ile kullanıcı doğrulaması yapıyoruz
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Token'dan gelen userId
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mesaj boş olamaz' });
    }

    // Kullanıcıya ait son 10 mesajı al (en eski önce olacak şekilde)
    const history = await Message.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const messages = history.reverse().map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Yeni kullanıcı mesajını da ekle
    messages.push({ role: 'user', content: message });

    // Kullanıcı mesajını kaydet
    await Message.create({ userId, role: 'user', content: message });
    console.log("Kullanıcı mesajı MongoDB'ye kaydedildi.");

    // Gemini API çağrısı
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: 'Sen bir mentor gibi davranıyorsun, motive eden ve destek veren cevaplar ver ama bir insan gibi kısa konuş, gereksiz uzun cevaplar verme.',
                },
              ],
            },
            ...messages.map((m) => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }],
            })),
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const mentorReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Mentoriá şu an yanıt veremiyor.';

    // Mentör cevabını kaydet
    await Message.create({ userId, role: 'model', content: mentorReply });

    res.json({ reply: mentorReply });
  } catch (error) {
    console.error('Sunucu hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
