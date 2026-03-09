# Server - Movie Ticket Booking System

## Setup Instructions

### 1. Install Dependencies
```bash
yarn install
```

### 2. Database Setup

#### Option A: Using PostgreSQL (Recommended)
```bash
# Create database
createdb booking_movie_ticket

# Or using psql
psql -U postgres
CREATE DATABASE booking_movie_ticket;
\q
```

#### Option B: Run migration script
```bash
# Make sure your .env file is configured
yarn migrate
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Update the following in `.env`:
- Database credentials
- JWT secrets (use strong random strings)
- Email configuration (for password reset)

### 4. Run the Server

Development mode:
```bash
yarn dev
```

Production mode:
```bash
yarn build
yarn start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (requires authentication)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Movies Management (Protected)
- `GET /api/movies` - Get all movies with pagination
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create new movie (requires authentication)
- `PUT /api/movies/:id` - Update movie (requires authentication)
- `DELETE /api/movies/:id` - Delete movie (requires authentication)

### Health Check
- `GET /api/health` - Server health check

## Technologies Used
- Express.js
- TypeScript
- PostgreSQL
- JWT (JSON Web Tokens)
- bcrypt (password hashing)
- express-validator (input validation)
