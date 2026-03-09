# Movie Ticket Booking System - FilmHub

Full-stack movie ticket booking system with authentication features.

## Project Structure

```
booking-movie-ticket/
├── server/           # TypeScript/Express server
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── database/    # Database migrations and schema
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── index.ts     # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── app/              # React/TypeScript app
    ├── src/
    │   ├── components/  # React components
    │   ├── contexts/    # React contexts
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── types/       # TypeScript types
    │   └── App.tsx      # Main app
    ├── package.json
    └── vite.config.ts
```

## Quick Start

### Server Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
yarn install
```

3. Set up database:
```bash
# Create PostgreSQL database
createdb booking_movie_ticket

# Or using psql
psql -U postgres
CREATE DATABASE booking_movie_ticket;
\q
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secrets
```

5. Run database migration:
```bash
yarn migrate
```

6. Start development server:
```bash
yarn dev
```

Server will run on `http://localhost:5000`

### App Setup

1. Navigate to app directory:
```bash
cd app
```

2. Install dependencies:
```bash
yarn install
```

3. Start development server:
```bash
yarn dev
```

App will run on `http://localhost:3000`

## Features

### Authentication
- ✅ User Registration
- ✅ User Login/Logout
- ✅ Password Reset (Forgot Password)
- ✅ JWT Token Authentication
- ✅ Refresh Token Support
- ✅ Protected Routes

### Security
- ✅ Password hashing with bcrypt
- ✅ JWT for authentication
- ✅ Input validation
- ✅ Secure cookie handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Movies Management (Protected)
- `GET /api/movies` - Get all movies with pagination
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create new movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie

## Database Schema

The system uses PostgreSQL with the following main tables:
- `users` - User accounts
- `refresh_tokens` - JWT refresh tokens
- `password_reset_tokens` - Password reset tokens
- `movies` - Movie information

See `server/src/database/schema.sql` for full schema.

## Technologies

### Server
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- express-validator

### App
- React 18
- TypeScript
- Vite
- React Router
- Axios
- TanStack Query

## Development Notes

- Server uses TypeScript with strict mode
- App uses Vite for fast development
- Both projects use Yarn as package manager
- JWT tokens are stored in HTTP-only cookies for security
- Password reset tokens expire after 1 hour
- Refresh tokens expire after 30 days

## Features Implemented

### Content Management
- ✅ Movie CRUD operations
- ✅ Movie listing with pagination
- ✅ Search functionality
- ✅ Protected routes for management

## Next Steps

To extend the system, consider adding:
- Theater management
- Seat selection
- Booking functionality
- Payment integration
- Booking history
- User profile management
