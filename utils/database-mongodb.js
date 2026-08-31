import mongoose from 'mongoose';
import { config } from '../config.js';

// User Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  rank: { type: String, default: 'Newbie' },
  messages: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB
export const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      throw new Error('MONGO_URI not found in .env');
    }
    
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getUser = async (userId) => {
  try {
    let user = await User.findOne({ userId });
    
    if (!user) {
      user = new User({
        userId,
        level: 1,
        experience: 0,
        rank: 'Newbie',
        messages: 0,
      });
      await user.save();
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const addExperience = async (userId, amount = 10) => {
  try {
    const user = await getUser(userId);
    user.experience += amount;
    user.messages += 1;

    // Level up every 100 exp
    const requiredExp = user.level * 100;
    if (user.experience >= requiredExp) {
      user.level += 1;
      user.experience = 0;
      user.rank = getRankName(user.level);
    }

    user.updatedAt = new Date();
    await user.save();
    return user;
  } catch (error) {
    console.error('Error adding experience:', error);
    throw error;
  }
};

export const resetRank = async (userId) => {
  try {
    const user = await User.findOne({ userId });
    
    if (!user) {
      return null;
    }

    user.level = 1;
    user.experience = 0;
    user.rank = 'Newbie';
    user.messages = 0;
    user.updatedAt = new Date();
    
    await user.save();
    return user;
  } catch (error) {
    console.error('Error resetting rank:', error);
    throw error;
  }
};

export const getRankName = (level) => {
  const ranks = {
    1: 'Newbie',
    5: 'Apprentice',
    10: 'Member',
    15: 'Veteran',
    20: 'Legend',
    25: 'Master',
    30: 'Godlike',
  };

  for (let i = 30; i >= 1; i--) {
    if (level >= i && ranks[i]) {
      return ranks[i];
    }
  }
  return 'Newbie';
};

export const getAllUsers = async () => {
  try {
    const users = await User.find().sort({ level: -1, experience: -1 });
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export default {
  connectDB,
  getUser,
  addExperience,
  resetRank,
  getRankName,
  getAllUsers,
};
