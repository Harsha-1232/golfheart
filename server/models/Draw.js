const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: { type: String, required: true, unique: true }, // e.g. "2025-05"
  numbers: [{ type: Number }],
  totalPool: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Draw', drawSchema);
