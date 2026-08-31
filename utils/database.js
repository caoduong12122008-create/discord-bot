import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load users data
let usersData = {};
if (fs.existsSync(usersFile)) {
  try {
    usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch {
    usersData = {};
  }
}

const saveData = () => {
  fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2), 'utf8');
};

export const getUser = (userId) => {
  if (!usersData[userId]) {
    usersData[userId] = {
      id: userId,
      level: 1,
      experience: 0,
      rank: 'Newbie',
      messages: 0,
    };
    saveData();
  }
  return usersData[userId];
};

export const addExperience = (userId, amount = 10) => {
  const user = getUser(userId);
  user.experience += amount;
  user.messages += 1;

  // Level up every 100 exp
  const requiredExp = user.level * 100;
  if (user.experience >= requiredExp) {
    user.level += 1;
    user.experience = 0;
    user.rank = getRankName(user.level);
  }

  saveData();
  return user;
};

export const resetRank = (userId) => {
  const user = getUser(userId);
  user.level = 1;
  user.experience = 0;
  user.rank = 'Newbie';
  user.messages = 0;
  saveData();
  return user;
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

export const getAllUsers = () => {
  return Object.values(usersData).sort((a, b) => b.level - a.level);
};

export default {
  getUser,
  addExperience,
  resetRank,
  getRankName,
  getAllUsers,
};
