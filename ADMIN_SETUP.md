# Admin Setup Guide

## Database Schema

Schema đã được cập nhật với đầy đủ các fields cần thiết:

### Users Table
- `role` ENUM('user', 'admin') DEFAULT 'user' NOT NULL
- Default role là 'user'

### Movies Table
Các fields đầy đủ:
- `name` VARCHAR(255) NOT NULL
- `country` VARCHAR(100) NOT NULL
- `year` INT NOT NULL (1900-2100)
- `genre` VARCHAR(100) NOT NULL
- `duration` INT NOT NULL (minutes)
- `age_restriction` VARCHAR(20) NOT NULL
- `main_cast` TEXT NOT NULL
- `description` TEXT NOT NULL
- `poster_url` TEXT (optional)
- `image_url` VARCHAR(500) (optional)
- `poster_image` LONGBLOB (optional, for binary storage)
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP

## Tạo Admin User

### Cách 1: Update user hiện có
```sql
UPDATE users SET role = 'admin' WHERE username = 'your_username';
```

### Cách 2: Tạo user mới với role admin
```sql
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@example.com', '$2b$10$hashed_password', 'admin');
```

**Lưu ý:** Password phải được hash bằng bcrypt. Tốt nhất là đăng ký user bình thường rồi update role.

## Login và Phân Quyền

### Backend
- JWT token chứa `userId` và `username`
- `requireAdmin` middleware check role từ database
- Admin routes được protect bởi `authenticate` + `requireAdmin`

### Frontend
- `AuthContext` có `isAdmin` property
- `MovieManagementPage` chỉ hiển thị cho admin
- Header ẩn "MANAGE MOVIES" nếu không phải admin

## Movie Management Features

### List Movies
- Hiển thị danh sách movies trong bảng
- Có nút "Add Movie" ở header
- Có nút Edit (✏️) và Delete (🗑️) cho mỗi movie
- Search và pagination

### Add Movie
- Click nút "+ Add Movie"
- Form với đầy đủ fields:
  - Movie Name
  - Country (dropdown)
  - Year (number)
  - Genre (dropdown)
  - Duration (minutes)
  - Age Restriction (dropdown)
  - Main Cast
  - Movie Description
  - Poster URL (optional)
  - Image URL (optional)
- Preview images khi có URL
- Submit button: "CREATE"

### Edit Movie
- Click nút Edit (✏️) trên movie
- Form tương tự Add Movie nhưng pre-filled với data hiện tại
- Submit button: "UPDATE"

### Delete Movie
- Click nút Delete (🗑️) trên movie
- Confirmation modal: "Are you sure you want to delete this movie's content?"
- Buttons: "DELETE" và "CANCEL"

## API Endpoints

### Public (Không cần auth)
- `GET /api/movies` - List movies
- `GET /api/movies/:id` - Get movie details

### Admin Only (Cần auth + admin role)
- `POST /api/movies` - Create movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie

## Testing

1. **Tạo admin user:**
   ```sql
   UPDATE users SET role = 'admin' WHERE username = 'testuser';
   ```

2. **Login với admin account:**
   - Login bình thường
   - Check `user.role === 'admin'` trong response

3. **Truy cập Movie Management:**
   - Navigate to `/manage-movies`
   - Should see list of movies
   - Should see "Add Movie" button
   - Should see Edit/Delete buttons

4. **Test CRUD:**
   - Create: Click "Add Movie", fill form, submit
   - Read: See movies in table
   - Update: Click Edit, modify, submit
   - Delete: Click Delete, confirm

5. **Test với user thường:**
   - Login với user role = 'user'
   - Navigate to `/manage-movies`
   - Should see "Admin access required" message
