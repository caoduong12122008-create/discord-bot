import dotenv from 'dotenv';

dotenv.config();

export const config = {
  token: process.env.TOKEN,
  guildId: process.env.GUILD_ID,
  adminRoleId: process.env.ADMIN_ROLE_ID,
  sellerRoleId: process.env.SELLER_ROLE_ID,
  ticketCategoryId: process.env.TICKET_CATEGORY_ID,
  qrCodeUrl: process.env.QR_CODE_URL,
  mongoUri: process.env.MONGO_URI,
  dbType: process.env.DB_TYPE || 'json',
  prefix: '!',
};

export default config;
