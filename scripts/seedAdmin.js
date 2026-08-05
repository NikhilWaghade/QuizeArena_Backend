const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables from the server/.env file
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Seeds the default Admin user in the database if it doesn't already exist.
 */
const seedAdmin = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('Error: MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Database connected successfully.');

    // Check if an Admin user already exists by email
    const adminEmail = 'admin@quizarena.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
    } else {
      console.log('No Admin user found. Creating one...');

      // Hash the password
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      // Create a new Admin user
      const superAdmin = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'Admin',
        isActive: true
      });

      await superAdmin.save();
      console.log('Super Admin user created successfully.');
    }
  } catch (error) {
    console.error(`Error in seeding admin: ${error.message}`);
  } finally {
    // Ensure database connection is closed after execution
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Database connection closed.');
    }
    process.exit(0);
  }
};

seedAdmin();
