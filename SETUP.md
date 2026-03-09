# Hướng Dẫn Cài Đặt - FilmHub Booking System

## Yêu Cầu Hệ Thống
- Node.js (v18 hoặc cao hơn)
- Yarn/NPM package manager
- MySQL (qua XAMPP hoặc standalone)

## Các Lệnh Cài Đặt

### 1. Cài Đặt Server

```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp env.example .env

# Chỉnh sỚ file .env với thông tin database và JWT secrets của bạn
# Sử dụng editor để chỉnh sỚ: notepad .env hoặc code .env (VS Code)
```

### 2. Cài Đặt Database

#### Option A: Sử dụng XAMPP (Windows/Mac/Linux)
```bash
# 1. Mở XAMPP Control Panel, start MySQL
# 2. Mở phpMyAdmin (http://localhost/phpmyadmin)
# 3. Tạo database: booking_movie_ticket
# 4. Chạy migration
cd server
npm run migrate
```

#### Option B: Sử dụng MySQL Command Line
```bash
# Bật MySQL service trước
# Windows: net start MySQL80 (hoặc MySQL57, tùy version)
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql

# Tạo database
mysql -u root -p
CREATE DATABASE booking_movie_ticket;
exit

# Chạy migration để tạo các bảng
cd server
npm run migrate
```

### 3. Cài Đặt App

```bash
# Di chuyển vào thư mục app
cd app

# Cài đặt dependencies
yarn install
```

## Chạy Ứng Dụng

### Chạy Server (Terminal 1)
```bash
cd server
npm run dev
```
Server sẽ chạy tại: http://localhost:5000

### Chạy App (Terminal 2)
```bash
cd app
yarn dev
```
App sẽ chạy tại: http://localhost:3000

## Cấu Hình Database

Sau khi tạo database, bạn cần cập nhật file `.env` trong thư mục `server`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=booking_movie_ticket
DB_USER=root
DB_PASSWORD=
```

**Lưu ý:**
- `DB_PORT`: 3306 là port mặc định MySQL
- `DB_USER`: root là user mặc định XAMPP
- `DB_PASSWORD`: Để trống nếu XAMPP mặc định, hoặc nhập mật khẩu nếu đã set

## Cấu Hình JWT Secrets

Trong file `.env`, tạo các JWT secrets mạnh:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production-min-32-chars
```

**Lưu ý:** Để tạo secret mạnh, bạn có thể sử dụng:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Kiểm Tra Kết Nối

1. Server health check: http://localhost:5000/api/health
2. App: http://localhost:3000

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra MySQL đã chạy chưa (XAMPP hoặc `mysql --version`)
- Kiểm tra thông tin DB_HOST, DB_PORT, DB_USER, DB_PASSWORD trong file `.env`
- Kiểm tra database `booking_movie_ticket` đã được tạo chưa
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Lỗi port 3306 đã được sử dụng
- MySQL đang chạy 2 instance, hoặc port đã được dùng
- Thay đổi DB_PORT trong file `.env` (ví dụ: 3307)
- Hoặc tắt MySQL instance kia

### Lỗi migration
- Đảm bảo MySQL đã chạy
- Đảm bảo database `booking_movie_ticket` đã được tạo
- Xem lỗi chi tiết: `npm run migrate` (sẽ print error message)
- Xóa và tạo lại database nếu cần:
```bash
mysql -u root -p
DROP DATABASE booking_movie_ticket;
CREATE DATABASE booking_movie_ticket;
exit
```
