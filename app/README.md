# App - Movie Ticket Booking System

## Setup Instructions

### 1. Install Dependencies
```bash
yarn install
```

### 2. Environment Configuration (Optional)
Create a `.env` file in the root directory if you need to change the API URL:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Development Server
```bash
yarn dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production
```bash
yarn build
```

## Features

- **Authentication**
  - Login/Logout
  - User Registration
  - Forgot Password
  - Reset Password
  - Protected Routes

- **Content Management**
  - Movie CRUD operations
  - Movie listing with pagination
  - Search functionality
  - Edit/Delete with confirmation dialogs

- **UI Components**
  - Responsive Header with Navigation
  - Modal Dialogs
  - User Dropdown Menu
  - Error/Success Messages
  - Data tables with actions

## Technologies Used
- React 18
- TypeScript
- React Router
- Axios
- TanStack Query (React Query)
- Vite

## Project Structure
```
src/
  ├── components/     # Reusable components
  ├── contexts/       # React contexts (Auth)
  ├── pages/          # Page components
  ├── services/       # API services
  ├── types/          # TypeScript types
  └── App.tsx         # Main app component
```
