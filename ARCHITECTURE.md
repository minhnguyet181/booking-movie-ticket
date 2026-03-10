# Architecture - Controller-Service-Repository Pattern

## Cấu Trúc Backend

### Pattern: Controller → Service → Repository → Database

```
Routes (API Endpoints)
    ↓
Controllers (Request/Response handling)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access Layer)
    ↓
Database (MySQL)
```

## Layers

### 1. Routes Layer (`routes/`)
- Định nghĩa API endpoints
- Validation với express-validator
- Middleware (authentication, authorization)
- Gọi Controllers

**Example:**
```typescript
router.post('/movies', authenticate, requireAdmin, validate, MovieController.createMovie);
```

### 2. Controllers Layer (`controllers/`)
- Xử lý HTTP request/response
- Parse và validate input
- Gọi Services
- Trả về JSON response
- Error handling

**Example:**
```typescript
export class MovieController {
  static async createMovie(req: Request, res: Response, next: NextFunction) {
    try {
      const movie = await MovieService.createMovie(req.body);
      res.status(201).json({ message: 'Movie created successfully', movie });
    } catch (error: any) {
      next(error);
    }
  }
}
```

### 3. Services Layer (`services/`)
- Business logic
- Validation rules
- Data transformation
- Gọi Repositories
- Không biết về HTTP/Express

**Example:**
```typescript
export class MovieService {
  static async createMovie(movieData: MovieCreate): Promise<MoviePublic> {
    // Business logic: check duplicate
    const existingMovie = await MovieRepository.findByName(movieData.name);
    if (existingMovie) {
      throw new Error('Movie with this name already exists');
    }
    
    // Create via repository
    return await MovieRepository.create(movieData);
  }
}
```

### 4. Repositories Layer (`repositories/`)
- Data access layer
- Database queries (MySQL)
- CRUD operations
- Không có business logic

**Example:**
```typescript
export class MovieRepository {
  static async create(movieData: MovieCreate): Promise<MoviePublic> {
    const [result] = await pool.execute(
      `INSERT INTO movies (...) VALUES (...)`,
      [...]
    );
    // Return created movie
  }
}
```

## Authorization

### Role-Based Access Control (RBAC)

**Roles:**
- `user`: Regular user (default)
- `admin`: Administrator

**Middleware:**
- `authenticate`: Check JWT token (required for protected routes)
- `requireAdmin`: Check if user is admin (required for admin-only routes)

**Usage:**
```typescript
// Public route
router.get('/movies', MovieController.getAllMovies);

// Protected route (authenticated users)
router.get('/profile', authenticate, ProfileController.getProfile);

// Admin only route
router.post('/movies', authenticate, requireAdmin, MovieController.createMovie);
```

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique
- `email`: Unique
- `password`: Hashed with bcrypt
- `role`: ENUM('user', 'admin') - Default: 'user'
- `full_name`, `phone`: Optional
- `created_at`, `updated_at`: Timestamps

### Movies Table
- `id`: Primary key
- `name`: Movie name
- `country`: Country
- `year`: Release year
- `genre`: Genre
- `duration`: Duration in minutes
- `age_restriction`: Age rating
- `main_cast`: Main cast members
- `description`: Movie description
- `poster_url`: Poster image URL
- `image_url`: Additional image URL
- `created_at`, `updated_at`: Timestamps

## API Endpoints

### Public Endpoints
- `GET /api/movies` - Get all movies (with pagination)
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Protected Endpoints (Authenticated)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Admin Only Endpoints
- `POST /api/movies` - Create movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie

## Frontend Authorization

### AuthContext
- `isAuthenticated`: Check if user is logged in
- `isAdmin`: Check if user is admin
- `user`: Current user object with role

### Usage:
```typescript
const { isAuthenticated, isAdmin, user } = useAuth();

// Show admin menu only to admins
{isAuthenticated && user?.role === 'admin' && (
  <Link to="/manage-movies">MANAGE MOVIES</Link>
)}
```

## Benefits of This Architecture

1. **Separation of Concerns**: Mỗi layer có trách nhiệm riêng
2. **Testability**: Dễ test từng layer độc lập
3. **Maintainability**: Dễ maintain và extend
4. **Reusability**: Services và Repositories có thể reuse
5. **Scalability**: Dễ scale và refactor
