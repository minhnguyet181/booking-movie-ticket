# Database Setup - FilmHub Booking System

## Tạo Database

### Cách 1: Sử dụng createdb (Linux/Mac)
```bash
createdb booking_movie_ticket
```

### Cách 2: Sử dụng psql
```bash
psql -U postgres
CREATE DATABASE booking_movie_ticket;
\q
```

## Chạy Schema SQL

### Cách 1: Sử dụng migration script (Khuyến nghị)
```bash
cd server
yarn migrate
```

### Cách 2: Chạy SQL trực tiếp
```bash
psql -U postgres -d booking_movie_ticket -f server/src/database/schema.sql
```

### Cách 3: Sử dụng init.sql
```bash
psql -U postgres -d booking_movie_ticket -f server/src/database/init.sql
```

## Cấu trúc Database

### Bảng `users`
- Lưu thông tin người dùng
- Fields: id, username, email, password, full_name, phone, created_at, updated_at

### Bảng `refresh_tokens`
- Lưu refresh tokens cho JWT authentication
- Fields: id, user_id, token, expires_at, created_at

### Bảng `password_reset_tokens`
- Lưu tokens để reset password
- Fields: id, user_id, token, expires_at, created_at

### Bảng `movies`
- Lưu thông tin phim
- Fields: id, name, country, year, genre, duration, age_restriction, main_cast, description, poster_url, created_at, updated_at

## Kiểm tra Database

```bash
# Kết nối vào database
psql -U postgres -d booking_movie_ticket

# Xem danh sách bảng
\dt

# Xem cấu trúc bảng
\d users
\d movies

# Thoát
\q
```

## Xóa và Tạo Lại Database (Nếu cần)

```bash
# Xóa database
dropdb booking_movie_ticket

# Tạo lại database
createdb booking_movie_ticket

# Chạy lại schema
psql -U postgres -d booking_movie_ticket -f server/src/database/schema.sql
```
