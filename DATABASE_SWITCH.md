# 🔄 Cách Chuyển từ JSON sang MongoDB

## 🎯 Bước 1: Chuẩn Bị MongoDB

Làm theo file `DEPLOY.md`:
- Tạo MongoDB Cluster
- Lấy Connection String
- Cấu hình IP whitelist

---

## 📝 Bước 2: Cập Nhật .env

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/discord-bot
DB_TYPE=mongodb
```

---

## 🔧 Bước 3: Cài Mongoose

```bash
npm install
```

---

## 📂 Bước 4: Cập Nhật index.js

Hãy thêm logic để tự động chọn database:

```javascript
import { Client, GatewayIntentBits, Collection, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { config } from './config.js';
import { isAdmin, checkPermission } from './utils/permissions.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.events = new Collection();

// ⭐ Chọn database type
let db;
async function initDatabase() {
  if (config.dbType === 'mongodb') {
    console.log('📊 Sử dụng MongoDB...');
    const dbModule = await import('./utils/database-mongodb.js');
    await dbModule.connectDB();
    db = dbModule;
  } else {
    console.log('📄 Sử dụng JSON Database...');
    db = await import('./utils/database.js');
  }
}

// ...rest của code (loadCommands, loadEvents, etc.)

// Initialize bot
async function main() {
  try {
    console.log('🚀 Bot đang khởi động...');
    await initDatabase(); // ⭐ Kết nối database
    await loadEvents();
    await loadCommands();
    
    client.login(config.token);
    
    // Register slash commands after login
    client.once('ready', async () => {
      setTimeout(() => registerSlashCommands(), 2000);
    });
  } catch (error) {
    console.error('❌ Bot startup error:', error);
    process.exit(1);
  }
}

main();
```

---

## 🔄 Bước 5: Cập Nhật messageCreate Event

File: `events/messageCreate.js`

```javascript
import { addExperience } from '../utils/database-mongodb.js'; // ⭐ Thay đổi import
import qrCommand from '../commands/member/qr.js';

export const name = 'messageCreate';

export async function execute(message) {
  // Ignore bot messages
  if (message.author.bot) return;

  // ⭐ Await async operation
  try {
    await addExperience(message.author.id);
  } catch (error) {
    console.error('Error adding experience:', error);
  }

  // Check for QR code trigger
  if (message.content.includes('Dunozzqr')) {
    const qrResponse = await qrCommand.execute(message);
    if (qrResponse) {
      message.reply(qrResponse).catch(console.error);
    }
  }
}
```

---

## 🎫 Bước 6: Cập Nhật Interaction Handler

File: `index.js` - phần `interactionCreate`

```javascript
// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    // Handle buttons (ticket system)
    if (interaction.isButton()) {
      if (interaction.customId === 'create_ticket') {
        try {
          const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}-${Date.now()}`,
            type: 0,
          });

          const ticketEmbed = {
            color: 0x00ff00,
            title: '🎫 Ticket Mới',
            description: `Ticket được tạo bởi ${interaction.user}`,
            footer: { text: 'Admin sẽ hỗ trợ trong thời gian sớm nhất' },
          };

          await ticketChannel.send({ embeds: [ticketEmbed] });
          await interaction.reply({
            content: `✅ Ticket đã được tạo: ${ticketChannel}`,
            ephemeral: true,
          });
        } catch (error) {
          console.error('Error creating ticket:', error);
          await interaction.reply({
            content: '❌ Lỗi khi tạo ticket!',
            ephemeral: true,
          });
        }
      }
    }
    return;
  }

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  // Permission check
  if (command.requiredRole === 'admin') {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({
        content: '❌ Bạn không có quyền sử dụng lệnh này!',
        ephemeral: true,
      });
    }
  }

  try {
    // ⭐ Await async command
    const response = await command.execute(interaction);
    if (response) {
      await interaction.reply(response);
    }
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply({
      content: '❌ Có lỗi khi thực thi lệnh!',
      ephemeral: true,
    });
  }
});
```

---

## 🔄 Bước 7: Cập Nhật Tất Cả Commands

Đổi `import` trong các files command từ:

```javascript
// ❌ Old
import { getUser } from '../../utils/database.js';

// ✅ New
import { getUser } from '../../utils/database-mongodb.js';
```

### Các files cần sửa:
- `commands/member/rank.js`
- `commands/member/level.js`
- `commands/admin/reset-rank.js`

---

## ✅ Bước 8: Test MongoDB

```bash
npm install
npm start
```

Console nên hiện:
```
📊 Sử dụng MongoDB...
✅ Connected to MongoDB
✅ Bot đã sẵn sàng!
```

Nếu có lỗi:
```
❌ MongoDB connection error
→ Kiểm tra MONGO_URI trong .env
→ Kiểm tra MongoDB Cluster đã tạo chưa
```

---

## 🔀 Cách Chuyển Dữ Liệu (JSON → MongoDB)

Nếu bạn muốn migrate dữ liệu cũ:

1. Tạo file `migrate.js`:

```javascript
import fs from 'fs';
import mongoose from 'mongoose';
import { config } from './config.js';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  rank: { type: String, default: 'Newbie' },
  messages: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

async function migrate() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Đọc JSON file
    const jsonData = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

    // Chuyển vào MongoDB
    for (const [userId, userData] of Object.entries(jsonData)) {
      await User.findOneAndUpdate(
        { userId },
        { ...userData, userId },
        { upsert: true }
      );
    }

    console.log('✅ Dữ liệu đã migrate sang MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi migrate:', error);
    process.exit(1);
  }
}

migrate();
```

2. Chạy:
```bash
node migrate.js
```

---

## 🎯 Kết Quả

Sau khi làm xong:
- ✅ Bot chạy được với MongoDB
- ✅ Dữ liệu lưu trên cloud
- ✅ Sẵn sàng host 24/7
- ✅ Có thể deploy lên Railway, Replit, VPS

---

## 📊 So Sánh

| Tính Năng | JSON | MongoDB |
|-----------|------|---------|
| Phát triển | ✅ | ❌ |
| Host | ❌ | ✅ |
| Tốc độ | Chậm | Nhanh |
| Bảo mật | Kém | Tốt |
| Miễn phí | Có | Có |

💡 **Khuyên:** Dùng JSON khi phát triển, chuyển MongoDB khi host!
