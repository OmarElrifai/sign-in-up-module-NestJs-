# NestJS Application

A NestJS backend application with MongoDB integration, JWT authentication, and user management.

## Tech Stack

- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** NestJs Mongoose Annotations
- **Password Hashing:** bcrypt

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root application module
├── app.controller.ts       # Root controller
├── app.service.ts          # Root service
└── user-module/            # User feature module
    ├── user.module.ts      # User module definition
    ├── user.controller.ts  # User API endpoints
    ├── user.controller.spec.ts
    ├── dtos/              # Data Transfer Objects
    ├── services/          # Business logic
    ├── schemas/           # MongoDB schemas
    └── guard/             # Auth guards
```

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nest-app
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

## Running the Application

```bash
# Development (with watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod

# Development (debug mode)
npm run start:debug
```

The API runs on `http://localhost:3000` by default.

## API Endpoints

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /user/register | Register new user |
| POST | /user/login | User login |
| GET | /user/profile | Get user profile (protected) |
| PUT | /user/profile | Update user profile (protected) |
| DELETE | /user/profile | Delete user (protected) |

## Authentication

The application uses JWT Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Testing

```bash
# Unit tests
npm run test

# Unit tests (watch mode)
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Linting & Formatting

```bash
# Lint
npm run lint

# Format (Prettier)
npm run format
```

## CORS

CORS is enabled for frontend development at `http://localhost:5173`.

## License

UNLICENSED
