const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  name: String,
  count: Number,
  interval: String,
  duration: String,
  description: String,
});

module.exports = mongoose.model('Activity', activitySchema);
