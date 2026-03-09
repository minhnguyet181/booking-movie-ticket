# Các Lệnh Cài Đặt Nhanh

## Server

```bash
cd server
yarn install
cp env.example .env
# Chỉnh sửa .env với thông tin database của bạn
yarn migrate
yarn dev
```

## App

```bash
cd app
yarn install
yarn dev
```

## Database Setup (PostgreSQL)

### Tạo Database
```bash
createdb booking_movie_ticket
```

### Hoặc sử dụng psql
```bash
psql -U postgres
CREATE DATABASE booking_movie_ticket;
\q
```

### Chạy Schema SQL trực tiếp
```bash
psql -U postgres -d booking_movie_ticket -f server/src/database/schema.sql
```

## Tạo JWT Secrets

```bash
# Tạo JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Tạo JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy kết quả vào file `.env` trong thư mục `server`.
