require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  try {
    await connectDB();
    
    const email = process.env.ADMIN_EMAIL || 'founder@velourdesserts.com';
    const existingAdmin = await User.findOne({ email });
    
    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash('Admin@123', 12);
    
    await User.create({
      name: 'Velour Admin',
      email,
      passwordHash,
      role: 'admin',
      emailVerified: true
    });
    
    console.log(`✅ Admin user created successfully. Email: ${email}, Password: Admin@123`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();
