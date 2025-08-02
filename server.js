require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const API_KEY = process.env.gemini_key;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('frontend'));

app.post('/api/gemini', async (req, res) => {
  try {
    const userInput = req.body.prompt;
    //console.log("Gelen istek:", userInput);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userInput }] }]
      })
    });

    const data = await response.json();
    //console.log("Gemini yanıtı:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
