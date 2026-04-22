const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  drawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
  matchCount: { type: Number, required: true },
  prizeTier: { type: String, enum: ['Jackpot', 'Second Tier', 'Third Tier'] },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'verified', 'paid', 'rejected'], default: 'pending' },
  proofFile: { type: String }, // Path to uploaded screenshot
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Winner', winnerSchema);
