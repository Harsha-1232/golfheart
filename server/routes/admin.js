const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Score = require('../models/Score');
const Draw = require('../models/Draw');
const Winner = require('../models/Winner');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Multer Config for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 1. Get all users (Admin only)
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Publish Draw & Calculate Winners (THE BRAIN)
router.post('/publish-draw', auth, admin, async (req, res) => {
  try {
    const { month, numbers, totalPool } = req.body;

    // Save the draw
    const draw = new Draw({ month, numbers, totalPool, isPublished: true });
    await draw.save();

    // Find all users and their scores
    const users = await User.find({ role: 'user' });
    const winners = [];

    for (let user of users) {
      const scores = await Score.find({ userId: user._id }).sort({ date: -1 }).limit(5);
      const userVals = scores.map(s => s.val);
      
      // Calculate matches
      const matches = numbers.filter(n => userVals.includes(n));
      const matchCount = matches.length;

      if (matchCount >= 3) {
        let tier = '';
        let amount = 0;

        if (matchCount === 5) {
          tier = 'Jackpot';
          amount = totalPool * 0.40; // Simplified logic (should split by winner count)
        } else if (matchCount === 4) {
          tier = 'Second Tier';
          amount = totalPool * 0.35 / 10; // Mocking a split among 10 winners
        } else {
          tier = 'Third Tier';
          amount = totalPool * 0.25 / 50; // Mocking a split among 50 winners
        }

        const winner = new Winner({
          userId: user._id,
          drawId: draw._id,
          matchCount,
          prizeTier: tier,
          amount,
          status: 'pending'
        });
        await winner.save();
        winners.push(winner);
      }
    }

    res.json({ message: `Draw published for ${month}. Found ${winners.length} winners.`, draw, winnersCount: winners.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Winner Verification Upload (Public for logged in users)
router.post('/verify-upload', auth, upload.single('proof'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    // Find the pending winner record for this user
    const winner = await Winner.findOne({ userId: req.user.id, status: 'pending' }).sort({ createdAt: -1 });
    if (!winner) return res.status(404).json({ message: 'No pending winning claim found for this user.' });

    winner.proofFile = req.file.path;
    winner.status = 'pending'; // Stays pending until admin approves
    await winner.save();

    res.json({ message: 'Proof of score uploaded successfully. Admin will review it shortly.', file: req.file.path });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Admin: Approve/Reject Winner
router.put('/winners/:id', auth, admin, async (req, res) => {
  try {
    const { status } = req.body; // 'verified', 'paid', or 'rejected'
    const winner = await Winner.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(winner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
