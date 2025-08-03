require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Message = require('./models/message');

const app = express();
const PORT = 3000;

const API_KEY = process.env.GEMINI_KEY; // .env dosyasından API anahtarını al
const MONGODB_URI = process.env.MONGODB_URI; // MongoDB bağlantı URI'si

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('frontend'));

// MongoDB bağlantısı
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Yeni endpoint: /api/mentoria ile mesaj ve bağlam yönetimi
app.post('/api/mentoria', async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: 'Eksik parametre' });
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

    // Gemini API çağrısı, role ve bağlamla birlikte
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
              role: m.role,
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

    // Gemini yanıtını al
    const mentorReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Mentoriá şu an yanıt veremiyor.';

    // Mentör cevabını kaydet
    await Message.create({ userId, role: 'mentor', content: mentorReply });

    res.json({ reply: mentorReply });
  } catch (error) {
    console.error('Sunucu hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
