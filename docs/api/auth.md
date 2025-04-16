# Auth API Documentation

This document provides details about the API endpoints available for authentication and user registration.

**Base Path:** `/api/auth`

**Authentication:** These routes are generally public, dealing with the process of obtaining authentication tokens or registering new users. Specific registration routes might be protected depending on application requirements (e.g., only existing admins can register new ones), but the provided code shows a public registration endpoint.

## Endpoints

### 1. Register New Admin

*   **Method:** `POST`
*   **Path:** `/register`
*   **Description:** Registers a new administrator user in the system.
*   **Authentication:** Public (as per the provided code).
*   **Request Body:** (Content-Type: application/json)
    *   Requires `firstName`, `lastName`, `email`, and `password`. Other fields from the Admin model are optional.
    ```json
    {
      "firstName": "System",
      "lastName": "Admin",
      "email": "admin@example.com",
      "password": "securePassword123",
      "DOB": "1985-06-15T00:00:00.000Z", // Optional
      "phoneNumber": "555-123-4567", // Optional
      "salary": 80000, // Optional
      "portfolio": ["Project A", "Project B"] // Optional
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Admin registered successfully.",
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8b9e1",
        "firstName": "System",
        "lastName": "Admin",
        "email": "admin@example.com",
        "DOB": "1985-06-15T00:00:00.000Z",
        "phoneNumber": "555-123-4567",
        "salary": 80000,
        "portfolio": ["Project A", "Project B"],
        "dateEmployed": "2023-10-27T10:30:00.000Z",
        "createdAt": "2023-10-27T10:30:00.000Z",
        "updatedAt": "2023-10-27T10:30:00.000Z"
        // Password field is intentionally omitted
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing required fields (`firstName`, `lastName`, `email`, `password`) or validation errors (e.g., invalid email format).
    *   `409 Conflict`: An admin with the provided email already exists.
    *   `500 Internal Server Error`: Server error during registration process (e.g., database error).

### 2. Login Admin

*   **Method:** `POST`
*   **Path:** `/login`
*   **Description:** Authenticates an admin user using their email and password, returning a JWT token upon successful authentication.
*   **Authentication:** Public.
*   **Request Body:** (Content-Type: application/json)
    *   Requires `email` and `password`.
    ```json
    {
      "email": "admin@example.com",
      "password": "securePassword123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Login successful.", // Message from loginAdmin, loginUser just returns token/user
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVmOWYzZjhkMmY0YTJjOGE4YjllMSIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MjkwNTAwMDAsImV4cCI6MTYyOTA1MzYwMH0.XXX...", // Actual JWT token
      "admin": { // Response structure from loginAdmin
          "_id": "60d5f9f3f8d2f4a2c8a8b9e1",
          "firstName": "System",
          "lastName": "Admin",
          "email": "admin@example.com",
          // ... other non-sensitive admin fields ...
          "createdAt": "2023-10-27T10:30:00.000Z",
          "updatedAt": "2023-10-27T10:30:00.000Z"
      },
      "user": { // Response structure from loginUser (if that controller was used)
           "id": "60d5f9f3f8d2f4a2c8a8b9e1",
           "email": "admin@example.com",
           "firstName": "System",
           "lastName": "Admin"
      }
    }
    ```
    *Note: The controller code has two login functions (`loginAdmin` and `loginUser`). The route uses `loginUser`. The success response above includes structures from both for illustration, but the actual response will depend on which controller function is effectively active (`loginUser` based on the route file).* 

*   **Error Responses:**
    *   `400 Bad Request`: Missing `email` or `password`.
    *   `401 Unauthorized`: Invalid credentials (email not found or password doesn't match).
    *   `500 Internal Server Error`: Server error during login process or token generation.

## Data Model (Admin)

Based on `server/models/admin.js` (and inferred fields from `authController.js`):

```javascript
const AdminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [50, 'First name can not be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [50, 'Last name can not be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6, // Example: Assuming a minimum length
    select: false // Password hash won't be returned by default in queries
  },
  DOB: {
    type: Date
  },
  phoneNumber: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters']
  },
  salary: {
      type: Number
  },
  portfolio: {
      type: [String] // Array of strings
  },
  dateEmployed: {
    type: Date,
    default: Date.now
  },
  // Timestamps are automatically added by Mongoose (createdAt, updatedAt)
}, { timestamps: true });
```

**Notes:**

*   The `password` field uses `select: false` in the schema, meaning it's not returned by default in database queries. It must be explicitly selected when needed (e.g., during login comparison).
*   The `_id` field (MongoDB ObjectId) is automatically generated.
*   Timestamps (`createdAt`, `updatedAt`) are automatically managed. 