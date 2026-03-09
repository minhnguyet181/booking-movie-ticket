# SQL Commands - FilmHub Booking System

## Tạo Database

```sql
CREATE DATABASE booking_movie_ticket;
```

## Chạy toàn bộ Schema

Copy và chạy toàn bộ nội dung từ file `server/src/database/schema.sql` hoặc sử dụng:

```bash
psql -U postgres -d booking_movie_ticket -f server/src/database/schema.sql
```

## Hoặc chạy từng bước:

### 1. Tạo bảng users
```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Tạo bảng refresh_tokens
```sql
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Tạo bảng password_reset_tokens
```sql
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Tạo bảng movies
```sql
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
    genre VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    age_restriction VARCHAR(20) NOT NULL,
    main_cast TEXT NOT NULL,
    description TEXT NOT NULL,
    poster_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Tạo indexes
```sql
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_movies_name ON movies(name);
CREATE INDEX IF NOT EXISTS idx_movies_year ON movies(year);
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);
```

## Kiểm tra Database

```sql
-- Xem tất cả bảng
\dt

-- Xem cấu trúc bảng users
\d users

-- Xem cấu trúc bảng movies
\d movies

-- Đếm số lượng records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM movies;
```

## Xóa tất cả dữ liệu (Reset)

```sql
-- Xóa dữ liệu nhưng giữ cấu trúc bảng
TRUNCATE TABLE movies CASCADE;
TRUNCATE TABLE password_reset_tokens CASCADE;
TRUNCATE TABLE refresh_tokens CASCADE;
TRUNCATE TABLE users CASCADE;
```

## Xóa toàn bộ bảng (Drop Tables)

```sql
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```
