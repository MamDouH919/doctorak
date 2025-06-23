// createAdminUser.ts

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Users from './models/Users';
import bcrypt from 'bcrypt';

const MONGO_URI = process.env.MONGO_URI;

const createAdminUser = async () => {
  try {
    await mongoose.connect(MONGO_URI || '');
    const existingAdmin = await Users.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
    } else {
      const hashedPassword = await bcrypt.hash("!!###MAMDOUH###!!", 10);

      const admin = new Users({
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        verified: true,
      });

      await admin.save();
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser();
