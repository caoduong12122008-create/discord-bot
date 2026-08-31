# 🚀 Hướng Dẫn Host Bot Discord

## 📊 Loại Database

### 1️⃣ **JSON File (Hiện Tại - Chỉ Phát Triển)**
- ✅ Đơn giản, không cần setup
- ❌ Dữ liệu mất khi server restart
- ❌ Không tốt khi host trên server

### 2️⃣ **MongoDB (Khuyên Dùng - Cho Host)**
- ✅ Dữ liệu lưu trên cloud
- ✅ An toàn, không mất dữ liệu
- ✅ Tốc độ nhanh
- ✅ Free tier 512MB

---

## 🛠️ Setup MongoDB

### Bước 1: Tạo Tài Khoản MongoDB

1. Vào https://www.mongodb.com/cloud/atlas
2. Nhấp "Sign Up" (miễn phí)
3. Đăng ký tài khoản

### Bước 2: Tạo Cluster

1. Vào MongoDB Atlas Dashboard
2. Nhấp "Create Project" → Đặt tên "discord-bot"
3. Nhấp "Create Deployment" → Chọn "FREE" tier
4. Chọn Region gần bạn nhất (Tokyo hoặc Singapore)
5. Nhấp "Create Cluster" (chờ ~3 phút)

### Bước 3: Lấy Connection String

1. Vào "Clusters" → Nhấp "Connect"
2. Chọn "Drivers" → Node.js
3. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```

4. Thay `username`, `password`, `dbname` của bạn

### Bước 4: Thêm IP Address

1. Vào "Security" → "Network Access"
2. Nhấp "Add IP Address"
3. Chọn "Allow access from anywhere" (0.0.0.0/0)
4. Nhấp "Confirm"

### Bước 5: Cập Nhật .env

Mở file `.env` và thêm:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/discord-bot
DB_TYPE=mongodb
```

### Bước 6: Cài Mongoose

```bash
npm install
```

---

## 🌐 Deploy Bot

### **Tùy Chọn 1: Railway (Khuyên Dùng - Dễ + Free)**

#### Setup

1. Vào https://railway.app
2. Đăng nhập/Đăng ký
3. Nhấp "New Project"
4. Chọn "Deploy from GitHub"
5. Kết nối GitHub account
6. Chọn repository bot của bạn

#### Config

1. Trong Railway, nhấp "Environment"
2. Thêm variables:
   ```
   TOKEN = your_bot_token
   GUILD_ID = your_guild_id
   ADMIN_ROLE_ID = your_admin_role_id
   MONGO_URI = mongodb+srv://...
   DB_TYPE = mongodb
   QR_CODE_URL = your_qr_url
   ```

3. Tạo `Procfile` trong root project:
   ```
   worker: node index.js
   ```

4. Nhấp "Deploy"

✅ Bot sẽ chạy 24/7!

---

### **Tùy Chọn 2: Replit (Rất Dễ - Miễn Phí)**

#### Setup

1. Vào https://replit.com
2. Đăng nhập/Đăng ký
3. Nhấp "Create" → "Import from GitHub"
4. Paste URL GitHub repo: `https://github.com/your/repo`
5. Nhấp "Import"

#### Config

1. Mở file `.env`
2. Điền tất cả variables:
   ```
   TOKEN=...
   GUILD_ID=...
   ADMIN_ROLE_ID=...
   MONGO_URI=...
   DB_TYPE=mongodb
   ```

3. Nhấp nút "Run" (chạy script `npm start`)

✅ Bot chạy trong Replit!

---

### **Tùy Chọn 3: VPS (Chuyên Nghiệp)**

Nếu muốn host trên VPS (Linode, DigitalOcean, AWS):

#### Setup

1. SSH vào VPS
2. Cài Node.js:
   ```bash
   curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install nodejs
   ```

3. Clone repository:
   ```bash
   git clone https://github.com/your/repo.git
   cd BOTDC
   ```

4. Cài dependencies:
   ```bash
   npm install
   ```

5. Tạo `.env`:
   ```bash
   nano .env
   ```
   (Điền các thông tin)

6. Chạy bot:
   ```bash
   nohup npm start > bot.log &
   ```

7. Để bot chạy khi VPS restart (dùng PM2):
   ```bash
   sudo npm install -g pm2
   pm2 start index.js --name "discord-bot"
   pm2 startup
   pm2 save
   ```

---

## 🔄 Cách Sử Dụng MongoDB trong Code

### Bước 1: Cập nhật index.js

Thêm MongoDB connection vào `index.js`:

```javascript
import { connectDB } from './utils/database-mongodb.js';
import { config } from './config.js';

let db;

// Chọn database type
if (config.dbType === 'mongodb') {
  const mongoDb = await import('./utils/database-mongodb.js');
  await mongoDb.connectDB();
  db = mongoDb;
} else {
  db = await import('./utils/database.js');
}
```

### Bước 2: Cập nhật messageCreate event

```javascript
import { addExperience } from '../utils/database-mongodb.js'; // Sửa import này

export async function execute(message) {
  if (message.author.bot) return;

  // await để chờ async database
  await addExperience(message.author.id);
  
  // ... rest của code
}
```

---

## 🧪 Test Bot

Sau khi deploy, test lại:

1. Vào Discord server
2. Gõ `/rank` → Nên thấy rank
3. Chat một vài tin nhắn → EXP tăng
4. Gõ `/level` → Xem bảng xếp hạng

✅ Nếu hoạt động bình thường = Bot đã host thành công!

---

## 📊 Monitoring

### Kiểm tra Log

**Railway:**
- Vào dashboard → "Logs" tab

**Replit:**
- Nhấp "Shell" tab → Xem log

**VPS:**
```bash
tail -f bot.log
```

### Kiểm tra Bot Status

```bash
# VPS - Check bot process
ps aux | grep node

# Railway/Replit - Xem dashboard
```

---

## 🆘 Troubleshooting

### Bot không hoạt động
```
Error: Invalid token
→ Kiểm tra TOKEN trong environment variables
```

### MongoDB Error
```
Error: MONGO_URI not found
→ Kiểm tra MONGO_URI trong .env đúng chưa
```

### Bot Crash
```
→ Xem logs để biết lỗi gì
→ Check MongoDB connection có sẵn không
```

---

## 💡 Chọn Hình Thức Nào?

| Loại | Dễ | Miễn Phí | Tốc Độ | Khuyên |
|------|----|---------| ------|-------|
| **Railway** | ⭐⭐⭐ | Có (100 giờ/tháng) | Nhanh | ✅ BEST |
| **Replit** | ⭐⭐⭐⭐ | Có (2 giờ/tuần) | Trung | ✅ Dễ |
| **VPS** | ⭐⭐ | Tính phí | Rất nhanh | Chuyên |

---

## ✅ Checklist Deploy

- [ ] Tạo MongoDB Cluster
- [ ] Lấy Connection String
- [ ] Cài mongoose: `npm install`
- [ ] Cập nhật .env với MONGO_URI
- [ ] Chọn platform (Railway/Replit/VPS)
- [ ] Deploy project
- [ ] Thêm environment variables
- [ ] Test `/rank` command
- [ ] Bot chạy 24/7!

---

🎉 **Bot của bạn đã sẵn sàng host!**
