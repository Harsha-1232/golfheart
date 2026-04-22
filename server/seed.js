const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminEmail = 'admin@golfheart.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists.');
    } else {
      const adminUser = new User({
        name: 'System Admin',
        email: adminEmail,
        password: 'admin123', // This will be hashed by the User model pre-save hook
        role: 'admin',
        plan: 'yearly'
      });
      await adminUser.save();
      console.log('✅ Admin user created: admin@golfheart.com / admin123');
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedAdmin();
