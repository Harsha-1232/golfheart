const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection & Auto-Seed
const startDB = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
  console.log('✅ Connected to In-Memory MongoDB');

  // Seed Admin
  const adminEmail = 'admin@golfheart.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const adminUser = new User({
      name: 'System Admin',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
      plan: 'yearly'
    });
    await adminUser.save();
    console.log('✅ Admin user auto-seeded: admin@golfheart.com / admin123');
  }
};

startDB().catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('GolfHeart API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/scores', require('./routes/scores'));
app.use('/api/admin', require('./routes/admin'));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
