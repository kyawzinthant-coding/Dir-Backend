
# E-Learning & Resource Sharing Platform Documentation

## Overview

This backend system powers an e-learning and resource sharing platform, offering users a secure environment to access and share educational resources. The platform provides core functionalities for user management, authentication, and content management (providers, series, and courses). There are two roles: **user** and **admin**. The system is built with a focus on security, modularity, and efficient data management.

## Technologies Used

- **Node.js & Express.js** – Core backend framework for handling HTTP requests and middleware.
- **TypeScript** – Ensures type safety and maintainability.
- **JWT** – For user authentication with support for refresh token rotation.
- **bcrypt** – Secure password hashing.
- **express-validator** – Request validation to ensure data integrity.
- **helmet & cors** – Security enhancements via HTTP headers and controlled resource sharing.
- **Multer & Sharp** – For file uploads and image processing.
- **dotenv** – Environment variable management.
- **Prisma ORM** – For database interactions using an object-relational mapping approach.
- **cloudinary** – For image storage and management.

## Project Structure

```
/Dir-Backend
│
├── package.json             # Project metadata and dependencies
├── tsconfig.json            # TypeScript configuration
├── .env.example             # Example environment variable file
├── config/
│   └── errorCode.ts         # Error code definitions
├── src/
│   ├── app.ts               # Express application setup with middleware integration
│   ├── index.ts             # Entry point to start the server
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── authRoutes.ts      # Endpoints for authentication (login, register, logout)
│   │   │   ├── providerRoutes.ts  # CRUD endpoints for resource providers
│   │   │   ├── seriesRoutes.ts    # CRUD endpoints for series management
│   │   │   ├── courseRoutes.ts    # CRUD endpoints for course management
│   │   │   └── userRoutes.ts      # Endpoints for user profile management and admin user controls
│   ├── controllers/         # Business logic for handling requests
│   ├── middlewares/         # Custom middleware functions (authentication, authorization, validation, rate limiting, file upload)
│   ├── models/              # Database models and schemas (using Prisma ORM)
│   └── utils/               # Helper functions and utilities (including pagination utilities)
└── uploads/                 # Directory to store uploaded files
```

## Implemented Features

### 1. Authentication & Authorization

- **User Registration & Login:**  
  Users can register and log in securely. Passwords are hashed with bcrypt, and upon successful authentication, a JWT access token and refresh token are issued and stored in browser cookies.
  
- **JWT & Refresh Token Rotation:**  
  - JWT access tokens are used to authorize API requests.
  - The refresh token rotation mechanism ensures that tokens are refreshed securely, minimizing risks of token misuse.
  
- **Role-Based Access:**  
  Only users with an admin role have access to certain routes (e.g., managing other users or critical data operations).

### 2. CRUD Operations

- **Provider CRUD:**  
  Create, read, update, and delete operations for educational resource providers. This module allows admins to manage provider information efficiently.

- **Series CRUD:**  
  Manage series data that groups related courses or content. Series operations include creating new series, editing existing ones, and removing outdated series.

- **Courses CRUD:**  
  Courses, representing individual learning modules or content blocks, can be created, read, updated, and deleted, ensuring content remains fresh and relevant.

### 3. User Profile Management

- **Profile Updates:**  
  Users can update their personal information and profile details through dedicated endpoints. This feature supports changes to basic user data as well as profile pictures (using Multer for file uploads and Sharp for image processing ).

### 4. Pagination & Data Retrieval

- **Pagination:**  
  For endpoints that return lists of providers, series, or courses, two pagination strategies are implemented:
  - **Offset-Based Pagination:**  
    Uses query parameters like `offset` and `limit` to fetch data subsets. This method is straightforward and works well for smaller datasets.
  - **Cursor-Based Pagination:**  
    Uses a unique identifier (cursor) to fetch the next set of results. This is especially efficient for large datasets and helps to maintain consistent performance even as data volume grows.

### 5. Middleware & Security

- **CORS & Security Headers:**  
  The application is configured with a whitelist to allow requests only from specified origins. Helmet adds security headers to responses, and CORS settings manage cross-origin requests.
  
- **Rate Limiting:**  
  Basic rate limiting is implemented to protect against excessive or abusive requests.

- **Error Handling:**  
  A centralized error-handling middleware captures errors, logs them, and sends consistent error responses to the client.

- **Input Validation:**  
  Uses express-validator to ensure incoming data is validated and sanitized, which helps maintain data integrity and prevent security vulnerabilities.

## Database & Architecture

- **Database Integration:**  
  The project uses **Prisma ORM** for database interactions. Prisma abstracts many low-level operations, ensuring secure and efficient data handling.
  
- **Data Models:**  
  The data models (located in the `models/` directory) represent entities such as users, providers, series, and courses. These models are used for CRUD operations and can be extended as the application evolves.
  
- **Pagination Implementation:**  
  Pagination logic is integrated into the data retrieval layers. Offset-based pagination handles simple page requests, while cursor-based pagination offers a more scalable solution for navigating large data sets.

## API Endpoints

### Authentication Routes

| Method | Endpoint            | Description                         |
| ------ | ------------------- | ----------------------------------- |
| POST   | `/auth/register`    | Registers a new user                |
| POST   | `/auth/login`       | Logs in an existing user            |
| POST   | `/auth/logout`      | Logs out a user and invalidates tokens |

### Provider Routes

| Method | Endpoint                    | Description                             |
| ------ | --------------------------- | --------------------------------------- |
| POST   | `/providers`              | Create a new provider (Admin only)      |
| GET    | `/providers`              | List all providers (supports pagination)|
| GET    | `/providers/:id`          | Get details of a specific provider      |
| PUT    | `/providers/:id`          | Update provider information (Admin only)|
| DELETE | `/providers/:id`          | Delete a provider (Admin only)          |

### Series Routes

| Method | Endpoint                  | Description                           |
| ------ | ------------------------- | ------------------------------------- |
| POST   | `/series`                 | Create a new series                   |
| GET    | `/series`                 | Retrieve list of series (supports pagination) |
| GET    | `/series/:id`             | Get specific series details           |
| PUT    | `/series/:id`             | Update series information             |
| DELETE | `/series/:id`             | Remove a series                       |

### Course Routes

| Method | Endpoint                | Description                           |
| ------ | ----------------------- | ------------------------------------- |
| POST   | `/courses`              | Create a new course                   |
| GET    | `/courses`              | Retrieve all courses (supports pagination)|
| GET    | `/courses/:id`          | Get course details                    |
| PUT    | `/courses/:id`          | Update course information             |
| DELETE | `/courses/:id`          | Delete a course (Admin only)          |

### User Profile Routes

| Method | Endpoint             | Description                            |
| ------ | -------------------- | -------------------------------------- |
| GET    | `/users/me`          | Get current user profile details       |
| PUT    | `/users/me`          | Update current user profile information|

### Admin Routes

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| GET    | `/admin/users`       | Retrieve list of all users (Admin only)|
| PUT    | `/admin/users/:id`   | Update user role or information       |
| DELETE | `/admin/users/:id`   | Remove a user (Admin only)            |

## Setup & Deployment

1. **Install Dependencies:**  
   Run the following command to install all necessary packages:
   ```bash
   pnpm install
   ```

2. **Environment Configuration:**  
   Create a `.env` file (or copy from `.env.example`) and set the required variables:
   ```env
   NODE_ENV=
    PORT=
    APP_DEBUT=

    ACCESS_TOKEN_SECRET=
    REFRESH_TOKEN_SECRET=

    IMAGE_SERVER_KEY=
    IMAGE_API_KEY =
    CLOUD_NAME = 

    DATABASE_URL =
   ```

3. **Build & Start the Server:**  
   Build the project and start the server:
   ```bash
   pnpm build
   pnpm start
   ```
   For development, you can use:
   ```bash
   pnpm run dev
   ```

## Conclusion

This backend system is designed for an e-learning and resource sharing platform, focusing on secure authentication, efficient content management, and scalable data retrieval through both offset and cursor pagination. The implemented CRUD operations for providers, series, and courses, along with robust authentication and profile management features, provide a solid foundation for the platform's growth and future enhancements.

