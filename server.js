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

app.use('/mentoria', require('./routes/mentoria'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/activities', require('./routes/tabs/activities'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
