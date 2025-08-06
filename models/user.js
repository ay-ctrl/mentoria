const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  about: { type: String, default: '' }, // İsteğe bağlı hakkımda alanı
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
