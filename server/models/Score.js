const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  val: { type: Number, required: true, min: 1, max: 45 },
  createdAt: { type: Date, default: Date.now }
});

// Ensure a user can only have one score per date
scoreSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Score', scoreSchema);
