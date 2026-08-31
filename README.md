# Discord Bot - Quản Lý Server

Bot Discord được xây dựng bằng JavaScript với kiến trúc modular, dễ mở rộng.

## 🎯 Tính Năng

### 📊 Hệ Thống Level & Rank
- **Member Commands:**
  - `/rank` - Xem level và rank của bạn
  - `/level` - Xem bảng xếp hạng top 10

- **Admin Commands:**
  - `/resetrank @user` - Reset rank của user

### 🎫 Hệ Thống Ticket
- **Admin Commands:**
  - `/ticketsetup` - Setup ticket system
  - `/closeticket` - Đóng ticket (sử dụng trong ticket channel)

### 📱 Lệnh Khác
- Khi chat chứa "Dunozzqr" bot sẽ gửi hình QR code
- Bot tự động tăng exp cho mỗi tin nhắn

### 📊 Hệ Thống Rank (Levels)
```
Level 1-4:   Newbie
Level 5-9:   Apprentice
Level 10-14: Member
Level 15-19: Veteran
Level 20-24: Legend
Level 25-29: Master
Level 30+:   Godlike
```

## 🔧 Cài Đặt

### 1. Clone/Download Project
```bash
cd BOTDC
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Cấu Hình Bot

**Tạo file `.env`** từ `.env.example`:
```bash
cp .env.example .env
```

**Điền các thông tin sau vào `.env`:**

```env
# Bot Token (Lấy từ Discord Developer Portal)
TOKEN=your_bot_token_here

# Server ID (Chuột phải server -> Copy Server ID)
GUILD_ID=your_guild_id_here

# Admin Role ID (Chuột phải role -> Copy Role ID)
ADMIN_ROLE_ID=your_admin_role_id_here

# Ticket Category ID (Chuột phải category -> Copy Channel ID)
TICKET_CATEGORY_ID=your_ticket_category_id_here

# QR Code Image URL (Link ảnh QR của bạn)
QR_CODE_URL=https://example.com/qr.png
```

### 4. Chạy Bot

```bash
# Chế độ sản xuất
npm start

# Chế độ phát triển (tự restart khi sửa code)
npm run dev
```

## 📁 Cấu Trúc Thư Mục

```
BOTDC/
├── index.js                    # Main bot file
├── config.js                   # Configuration
├── package.json               # Dependencies
├── .env.example               # Environment template
├── .env                       # Environment (tạo từ .example)
├── commands/                  # Slash commands
│   ├── member/               # Member-only commands
│   │   ├── rank.js          # View rank command
│   │   ├── level.js         # View leaderboard
│   │   └── qr.js            # QR code command
│   └── admin/                # Admin-only commands
│       ├── reset-rank.js     # Reset rank command
│       ├── ticket-setup.js   # Setup ticket system
│       └── ticket-close.js   # Close ticket
├── events/                    # Discord events
│   ├── messageCreate.js      # Message handler
│   └── ready.js              # Bot ready event
├── utils/                     # Utility functions
│   ├── database.js           # User data management
│   └── permissions.js        # Permission checks
└── data/                      # Data storage
    └── users.json            # User levels & ranks
```

## 🚀 Thêm Lệnh Mới

### Thêm Member Command
1. Tạo file mới trong `commands/member/` ví dụ: `hello.js`

```javascript
import { EmbedBuilder } from 'discord.js';

export const name = 'hello';
export const description = 'Chào bạn';
export const requiredRole = 'member';

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Hello!')
    .setDescription(`Xin chào ${interaction.user.username}!`);

  return embed;
}
```

### Thêm Admin Command
1. Tạo file mới trong `commands/admin/` ví dụ: `kick.js`

```javascript
import { EmbedBuilder } from 'discord.js';

export const name = 'kick';
export const description = 'Kick user khỏi server';
export const requiredRole = 'admin';

export async function execute(interaction) {
  const targetUser = interaction.options.getUser('user');
  // Logic xử lý...
}
```

## 🔐 Hệ Thống Quyền

- **Member Commands:** Mọi người có thể dùng
- **Admin Commands:** Chỉ người có Admin Role hoặc Role được cấu hình có thể dùng

## 📊 Database

User data được lưu trong `data/users.json`:

```json
{
  "user_id": {
    "id": "user_id",
    "level": 5,
    "experience": 45,
    "rank": "Apprentice",
    "messages": 150
  }
}
```

## 🐛 Troubleshooting

### Bot không hoạt động
- Kiểm tra token trong `.env` có đúng không
- Kiểm tra bot có quyền Administrator không
- Kiểm tra intents được bật trong Discord Developer Portal

### Lệnh không xuất hiện
- Reload server (F5 hoặc disconnect/reconnect)
- Kiểm tra bot đã được deploy commands thành công chưa

### QR Code không hiển thị
- Kiểm tra URL trong `.env` có hợp lệ không
- URL phải là link ảnh trực tiếp (http://)

## 📝 Ghi Chú

- Bot tự động gưi exp cho mỗi tin nhắn
- Cần 100 exp để lên một level (tính theo `level * 100`)
- Dữ liệu user được lưu locally trong `data/users.json`
- Để persistent database, nên sử dụng MongoDB hoặc database khác

## 🔄 Mở Rộng Bot

Bot được thiết kế để dễ mở rộng:
1. Thêm command mới vào `commands/` folder
2. Thêm event handler mới vào `events/` folder
3. Thêm utility function mới vào `utils/` folder
4. Bot sẽ tự động load tất cả files

## 📞 Hỗ Trợ

- Để thêm tính năng mới, thêm file vào folder tương ứng
- Để fix lỗi, check console log khi chạy bot

---

**Happy Coding! 🎉**
