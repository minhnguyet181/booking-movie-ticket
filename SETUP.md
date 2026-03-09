# Hướng Dẫn Cài Đặt - FilmHub Booking System

## Yêu Cầu Hệ Thống
- Node.js (v18 hoặc cao hơn)
- Yarn package manager
- PostgreSQL (v12 hoặc cao hơn)

## Các Lệnh Cài Đặt

### 1. Cài Đặt Server

```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt dependencies
yarn install

# Tạo file .env từ template
cp env.example .env

# Chỉnh sửa file .env với thông tin database và JWT secrets của bạn
# Sử dụng editor để chỉnh sửa: nano .env hoặc vim .env
```

### 2. Cài Đặt Database

```bash
# Tạo database PostgreSQL
createdb booking_movie_ticket

# Hoặc sử dụng psql
psql -U postgres
CREATE DATABASE booking_movie_ticket;
\q

# Chạy migration để tạo các bảng
cd server
yarn migrate
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
yarn dev
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
DB_PORT=5432
DB_NAME=booking_movie_ticket
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

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
- Kiểm tra PostgreSQL đã chạy chưa: `sudo systemctl status postgresql`
- Kiểm tra thông tin trong file `.env`
- Kiểm tra user postgres có quyền tạo database

### Lỗi port đã được sử dụng
- Thay đổi PORT trong file `.env` (server)
- Hoặc thay đổi port trong `vite.config.ts` (app)

### Lỗi migration
- Đảm bảo database đã được tạo
- Kiểm tra quyền của user postgres
- Xóa và tạo lại database nếu cần: `dropdb booking_movie_ticket && createdb booking_movie_ticket`
