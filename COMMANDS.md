# 📋 Bot Commands Guide

## 👥 Member Commands (Mọi thành viên có thể dùng)

### `/rank`
Xem level, rank, kinh nghiệm và số tin nhắn của bạn

**Cách dùng:**
```
/rank
```

**Output:**
- Level: Cấp độ hiện tại của bạn
- Rank: Hạng của bạn (Newbie, Apprentice, Member, etc.)
- Experience: EXP hiện tại / EXP cần để lên level
- Messages: Tổng số tin nhắn đã gửi

---

### `/level`
Xem bảng xếp hạng level top 10

**Cách dùng:**
```
/level
```

**Output:** Danh sách 10 người có level cao nhất

---

### Trigger: "Dunozzqr"
Khi bạn viết tin nhắn chứa từ "Dunozzqr", bot sẽ gửi hình QR code

**Cách dùng:**
```
Dunozzqr
```

hoặc

```
Tôi cần Dunozzqr
```

**Output:** Hình QR code

---

## 🔒 Admin Commands (Chỉ Admin hoặc có role Admin)

### `/resetrank @user`
Reset rank và level của một user về mức 1

**Cách dùng:**
```
/resetrank @username
```

**Tham số:**
- `@user` (Bắt buộc) - User cần reset rank

**Output:** Xác nhận reset với thông tin mới

---

### `/ticketsetup`
Setup hệ thống ticket trong channel hiện tại

**Cách dùng:**
```
/ticketsetup
```

**Tác dụng:**
- Gửi message với nút "Tạo Ticket"
- Thành viên nhấp nút để tạo ticket riêng

**Lưu ý:**
- Nên chạy trong channel dành riêng cho ticket (ví dụ: #support)
- Chỉ chạy 1 lần

---

### `/closeticket`
Đóng ticket hiện tại

**Cách dùng:**
- Gõ lệnh này trong channel ticket
```
/closeticket
```

**Tác dụng:**
- Gửi thông báo ticket đã đóng
- Xóa channel sau 3 giây

---

## 🤖 Auto Features (Tự động)

### Level & Experience System
- **Tự động cộng EXP:** Mỗi tin nhắn +10 EXP
- **Tự động lên level:** Khi EXP đủ (level * 100), lên level tiếp
- **Rank tự động cập nhật:** Theo level hiện tại

### Rank Progression
```
Level 1-4:   Newbie        🟩
Level 5-9:   Apprentice    🟨
Level 10-14: Member        🟧
Level 15-19: Veteran       🟥
Level 20-24: Legend        💜
Level 25-29: Master        💙
Level 30+:   Godlike       💛
```

---

## 📌 Mẹo Sử Dụng

1. **Tăng Level Nhanh:** Chat nhiều để tích lũy EXP
2. **Xem Bảng Xếp:** Dùng `/level` để kiểm tra vị trí của bạn
3. **Ticket:** Dùng khi cần hỗ trợ từ admin
4. **QR Code:** Đề cập đến "Dunozzqr" bất cứ khi nào cần

---

## ⚠️ Quy Tắc

- ✅ Chat thoải mái để tăng level
- ❌ Spam ticket hoặc lệnh sẽ bị timeout
- ❌ Không được sửa thông tin user bằng tay
- ✅ Admin có quyền reset rank nếu có lỗi

---

## 🔧 Lệnh Prefix (Nếu có)

Hiện tại bot chỉ hỗ trợ **Slash Commands** (`/`)

Không sử dụng prefix (`!`) trừ khi được thông báo

---

## 📞 Cần Giúp?

Tạo ticket qua nút "Tạo Ticket" trong channel hỗ trợ!

**Happy Gaming! 🎮**
