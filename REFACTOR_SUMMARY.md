# Tóm Tắt Refactor - Controller-Service-Repository Pattern

## ✅ Đã Hoàn Thành

### 1. Refactor Architecture Pattern ✅

**Trước:**
- Routes → Services → Database (trực tiếp)

**Sau:**
- Routes → Controllers → Services → Repositories → Database

**Files đã tạo:**
- `server/src/controllers/auth.controller.ts` - Auth controller
- `server/src/controllers/movie.controller.ts` - Movie controller
- `server/src/repositories/user.repository.ts` - User repository
- `server/src/repositories/movie.repository.ts` - Movie repository
- `server/src/repositories/refreshToken.repository.ts` - Refresh token repository
- `server/src/repositories/passwordResetToken.repository.ts` - Password reset token repository

### 2. Role-Based Authorization ✅

**Database:**
- Thêm field `role` vào bảng `users` (ENUM: 'user', 'admin')
- Default role: 'user'

**Backend:**
- Tạo `admin.middleware.ts` với `requireAdmin` middleware
- Cập nhật routes để protect admin endpoints
- JWT token chứa user info (bao gồm role)

**Frontend:**
- Cập nhật `AuthContext` với `isAdmin` property
- Check admin role trong `MovieManagementPage`
- Ẩn "MANAGE MOVIES" link nếu không phải admin

### 3. Movies Table Schema ✅

**Đã cập nhật:**
- `poster_url`: TEXT (đã có)
- `image_url`: VARCHAR(500) (mới thêm)
- `poster_image`: LONGBLOB (để lưu binary image nếu cần)

**Fields đầy đủ:**
- name, country, year, genre, duration
- age_restriction, main_cast, description
- poster_url, image_url
- created_at, updated_at

### 4. Movie CRUD với Image Handling ✅

**Backend:**
- Repository hỗ trợ `image_url` field
- Service validate và xử lý image URLs
- Controller nhận và trả về image data

**Frontend:**
- Form có 2 fields: Poster URL và Image URL
- Preview images khi có URL
- Validation cho URL format

### 5. Admin-Only Movie Management ✅

**Protection:**
- `POST /api/movies` - Admin only
- `PUT /api/movies/:id` - Admin only
- `DELETE /api/movies/:id` - Admin only
- `GET /api/movies` - Public (mọi người xem được)
- `GET /api/movies/:id` - Public

**Frontend:**
- MovieManagementPage chỉ hiển thị cho admin
- Hiển thị message nếu user không phải admin

## Cấu Trúc Mới

```
server/src/
├── controllers/          # Request/Response handling
│   ├── auth.controller.ts
│   └── movie.controller.ts
├── services/             # Business logic
│   ├── auth.service.ts
│   └── movie.service.ts
├── repositories/          # Data access layer
│   ├── user.repository.ts
│   ├── movie.repository.ts
│   ├── refreshToken.repository.ts
│   └── passwordResetToken.repository.ts
├── routes/               # API endpoints
│   ├── auth.routes.ts
│   └── movie.routes.ts
├── middleware/           # Middleware
│   ├── auth.middleware.ts
│   └── admin.middleware.ts
└── models/              # TypeScript interfaces
    ├── User.ts
    └── Movie.ts
```

## API Endpoints Mới

### Public (Không cần auth)
- `GET /api/movies` - List movies
- `GET /api/movies/:id` - Get movie details

### Protected (Cần auth)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Admin Only (Cần auth + admin role)
- `POST /api/movies` - Create movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie

## Database Migration

Để cập nhật database với role và image_url:

```sql
-- Thêm role vào users table (nếu chưa có)
ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' NOT NULL;

-- Thêm image_url vào movies table (nếu chưa có)
ALTER TABLE movies ADD COLUMN image_url VARCHAR(500) AFTER poster_url;
ALTER TABLE movies ADD COLUMN poster_image LONGBLOB AFTER image_url;
```

Hoặc chạy lại migration:
```bash
cd server
yarn migrate
```

## Testing

### Tạo Admin User:
```sql
UPDATE users SET role = 'admin' WHERE username = 'your_username';
```

### Test Admin Access:
1. Login với admin account
2. Truy cập `/manage-movies` - Should work
3. Login với user account
4. Truy cập `/manage-movies` - Should show "Admin access required"

## Next Steps

Có thể mở rộng thêm:
- File upload cho images (thay vì chỉ URL)
- Movie categories/tags
- Movie ratings
- Showtimes và theaters
- Booking system
