# 🚀 Quick Start Guide

## Step 1: Chuẩn Bị

### Tạo Bot trên Discord Developer Portal

1. Vào https://discord.com/developers/applications
2. Nhấp "New Application" đặt tên bot
3. Vào tab "Bot" → "Add Bot"
4. Copy token (sẽ dùng ở .env)
5. Bật các intents:
   - Message Content Intent ✅
   - Server Members Intent ✅
   - Guilds Intent ✅

### Mời Bot vào Server

1. Vào tab "OAuth2" → "URL Generator"
2. Select scopes: `bot`
3. Select permissions:
   - Administrator ✅
4. Copy link → Mở trên browser → Chọn server

---

## Step 2: Setup Dự Án

### 1. Mở Terminal/PowerShell

```bash
cd "C:\Users\caodu\OneDrive\Tài liệu\BOTDC"
```

### 2. Cài Đặt Dependencies

```bash
npm install
```

### 3. Tạo File .env

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

### 4. Điền Thông Tin

Mở file `.env` và điền:

```env
TOKEN=abc123...xyz (Bot token từ Developer Portal)
GUILD_ID=123456789 (Server ID - chuột phải server → Copy Server ID)
ADMIN_ROLE_ID=987654321 (Admin Role ID - chuột phải role → Copy Role ID)
TICKET_CATEGORY_ID=555666777 (Category ID - optional)
QR_CODE_URL=https://example.com/qr.png (Link ảnh QR của bạn)
```

---

## Step 3: Chạy Bot

### Lần Đầu

```bash
npm start
```

Console sẽ hiện:
```
✅ Bot đã sẵn sàng! Đăng nhập dưới tên YourBotName#0000
✅ Loaded command: rank (member)
✅ Loaded command: level (member)
...
✅ Registered 5 slash commands
```

✅ **Bot đã sẵn sàng sử dụng!**

### Phát Triển

Để auto-restart khi sửa code:

```bash
npm run dev
```

---

## Step 4: Kiểm Tra

### Trong Discord Server

1. Mở server của bạn
2. Gõ `/` (sẽ thấy danh sách commands)
3. Thử `/rank`

---

## 🔑 Lấy ID trên Discord

### Server ID (Guild ID)
```
Chuột phải Server → Copy Server ID
(Phải bật Developer Mode trước)
```

### Role ID
```
Chuột phải Role → Copy Role ID
```

### Channel ID
```
Chuột phải Channel → Copy Channel ID
```

### User ID
```
Chuột phải User → Copy User ID
```

**Bật Developer Mode:**
- User Settings → Advanced → Developer Mode (ON)

---

## ⚙️ Cấu Hình Thêm

### Thay Đổi Prefix

Sửa trong `config.js`:
```javascript
prefix: '!'  // Thành '?' hoặc prefix khác
```

### Thay Đổi Rank Names

Sửa trong `utils/database.js`:
```javascript
const ranks = {
  1: 'Newbie',
  5: 'Custom Rank',
  // ...
};
```

### Thay Đổi EXP Cần

Sửa trong `events/messageCreate.js`:
```javascript
addExperience(message.author.id, 20);  // Thay đổi 20 (mặc định 10)
```

---

## 🐛 Sửa Lỗi Phổ Thông

### Bot không xuất hiện trong server
- ❌ Bot chưa được mời → Dùng OAuth2 link để mời
- ❌ Bot bị offline → Chạy lại `npm start`

### Commands không hiện
- ❌ Reload Discord (F5)
- ❌ Bot chưa có quyền → Cho Bot quyền Administrator
- ❌ Guild ID sai → Kiểm tra lại .env

### Bot crash ngay lập tức
```
Error: Invalid token
→ Kiểm tra TOKEN trong .env
```

### Error "Missing Intents"
```
→ Kiểm tra Intents trong Discord Developer Portal
```

---

## 📁 Nơi Dữ Liệu Được Lưu

User data được lưu trong:
```
BOTDC/data/users.json
```

Format:
```json
{
  "user_id_123": {
    "id": "user_id_123",
    "level": 5,
    "experience": 45,
    "rank": "Apprentice",
    "messages": 150
  }
}
```

---

## ✅ Danh Sách Kiểm Tra

- [ ] Tạo bot trên Discord Developer Portal
- [ ] Copy Token
- [ ] Mời bot vào server
- [ ] Cài npm install
- [ ] Tạo file .env
- [ ] Điền TOKEN, GUILD_ID, ADMIN_ROLE_ID
- [ ] Chạy npm start
- [ ] Thử `/rank` trong server
- [ ] Setup ticket với `/ticketsetup`

---

## 🎉 Hoàn Thành!

Bây giờ bot của bạn đã sẵn sàng! Tận hưởng và thêm tính năng mới! 🚀

Câu hỏi? Xem file `README.md` hoặc `COMMANDS.md`
