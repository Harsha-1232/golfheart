const express = require('express');
const Score = require('../models/Score');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all scores for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a score (with Rolling 5 logic)
router.post('/', auth, async (req, res) => {
  try {
    const { date, val } = req.body;
    
    // Check if score exists for date
    const existing = await Score.findOne({ userId: req.user.id, date });
    if (existing) return res.status(400).json({ message: 'Score already exists for this date' });

    // Count existing scores
    const count = await Score.countDocuments({ userId: req.user.id });
    
    if (count >= 5) {
      // Find the oldest score and delete it
      const oldest = await Score.findOne({ userId: req.user.id }).sort({ date: 1 });
      await Score.findByIdAndDelete(oldest._id);
    }

    const newScore = new Score({ userId: req.user.id, date, val });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit score
router.put('/:id', auth, async (req, res) => {
  try {
    const { val } = req.body;
    const score = await Score.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { val },
      { new: true }
    );
    if (!score) return res.status(404).json({ message: 'Score not found' });
    res.json(score);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete score
router.delete('/:id', auth, async (req, res) => {
  try {
    const score = await Score.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!score) return res.status(404).json({ message: 'Score not found' });
    res.json({ message: 'Score deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
