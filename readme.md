# Authentication and Authorization System Documentation

## Features

### 1. Rate Limiting
- Prevents clients from making too many requests in a short period.
- Uses middleware to enforce limits and return an error when exceeded.

### 2. CORS Whitelisting
- Restricts access to the server to only authorized domains.
- Uses a whitelist to allow specific origins and blocks unauthorized ones.
- Supports credentials like cookies and authorization headers.

### 3. Authentication

#### Register
- **Validation**
  - Validates email and password format.
  - Checks if the username or email is already in use.
- **User Creation**
  - Hashes the password using bcrypt before storing.
  - Saves the user details in the database.
- **Token Generation**
  - Generates an access token and refresh token upon successful registration.
  - Stores the refresh token in the database.
- **Cookie Management**
  - Sets access and refresh tokens as HTTP-only cookies.
- **Response**
  - Returns a success message with the newly created user ID.

#### Login
- **Validation**
  - Validates email and password format.
  - Checks if the user exists using the provided email.
- **Password Verification**
  - Compares the provided password with the hashed password in the database.
- **Token Handling**
  - Generates a new access token and refresh token.
  - Updates the refresh token in the database.
- **Cookie Management**
  - Sets access and refresh tokens in the response cookies.
- **Response**
  - Returns a success message with the user ID.

#### Logout
- **Token Validation**
  - Extracts and verifies the refresh token from cookies.
  - Checks if the token belongs to an authenticated user.
- **Security Measures**
  - Invalidates the stored refresh token in the database.
- **Cookie Management**
  - Clears access and refresh tokens from cookies.
- **Response**
  - Returns a success message confirming logout.

### 4. Middleware

#### Authentication Middleware
- **Access Token Verification**
  - Checks if the access token is present in cookies.
  - If valid, extracts and attaches the user ID to the request.
  - If expired, attempts to refresh the token.
- **Refresh Token Handling**
  - Verifies the refresh token.
  - If valid, generates new access and refresh tokens.
  - Updates the stored refresh token in the database.
- **Error Handling**
  - Returns an authentication error if tokens are invalid or expired.

#### Authorization Middleware
- **Role-Based Access Control (RBAC)**
  - Checks if the user has the required roles to perform the action.
  - Returns a forbidden error if the user lacks permission.

### 5. Express Application Setup
- **Security Enhancements**
  - Uses `helmet` for security headers.
  - Enables CORS with a whitelist of allowed domains.
  - Uses `compression` for performance optimization.
- **Middleware Integration**
  - Parses incoming JSON requests.
  - Implements rate limiting.
  - Logs requests using `morgan`.
  - Manages cookies using `cookie-parser`.
- **Global Error Handling**
  - Catches and formats all errors in a structured response.
- **Health Check Route**
  - Provides a `/health` endpoint to check server status.

## 6. API Routes

### Base URL
```
localhost:8000/api/v1
```

### Authentication Routes
| Method | Endpoint       | Description             |
|--------|--------------|-------------------------|
| POST   | `/auth/register` | Registers a new user  |
| POST   | `/auth/login`    | Logs in a user        |
| POST   | `/auth/logout`   | Logs out a user       |

### Admin Routes  ( need auth middleware and authorise middleware to prcess)
| Method | Endpoint       | Description         |
|--------|--------------|---------------------|
| GET    | `/admin/users`     | Retrieves all users |




