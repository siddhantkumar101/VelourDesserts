require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User.model');
const connectDB = require('./src/config/db');

const resetAdmin = async () => {
  try {
    await connectDB();
    const email = 'founder@velourdesserts.com';
    const passwordHash = await bcrypt.hash('Admin@123', 12);
    
    let admin = await User.findOne({ email });
    if (admin) {
      admin.passwordHash = passwordHash;
      admin.role = 'admin';
      admin.emailVerified = true;
      await admin.save();
      console.log('✅ Admin password forcefully reset!');
    } else {
      await User.create({
        name: 'Velour Admin',
        email,
        passwordHash,
        role: 'admin',
        emailVerified: true
      });
      console.log('✅ Admin user forcefully created!');
    }
    
    // Check if there are any other admins and log them
    const allAdmins = await User.find({ role: 'admin' });
    console.log('Currently registered admins:', allAdmins.map(a => a.email));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
};

resetAdmin();
