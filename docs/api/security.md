# Security API Documentation

This document provides details about the API endpoints for managing security logs.

**Base Path:** `/api/security`

**Authentication:** Required for all routes via a JWT Bearer token in the `Authorization` header (`protect` middleware applied). Note: Creating logs might sometimes be less restricted depending on the source (e.g., automated system logs).

**Note on Immutability:** Security logs are often considered immutable. While the API provides PUT, PATCH, and DELETE endpoints for consistency, their use might be restricted or disabled in a production environment. Consider archiving logs instead of deleting.

## Endpoints

### 1. Get All Security Logs

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a paginated list of all security logs.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `page` (optional, number, default: 1): Page number.
    *   `limit` (optional, number, default: 25, max: 200): Items per page (higher default/max for logs).
    *   `sort` (optional, string, default: 'timestamp'): Field to sort by (e.g., 'timestamp', 'level', 'eventType').
    *   `order` (optional, string, default: 'desc'): Sort order ('asc' or 'desc', default is newest first).
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "total": 1500,
      "page": 1,
      "limit": 25,
      "totalPages": 60,
      "count": 25,
      "data": [
        {
          "_id": "60d5f9f3f8d2f4a2c8a9b7f1",
          "timestamp": "2023-10-27T14:30:15.123Z",
          "eventType": "LOGIN_SUCCESS",
          "level": "info",
          "userId": "60d5f9f3f8d2f4a2c8a8b9e1", // Ref to Admin/User
          "details": "Admin user admin@example.com logged in successfully.",
          "source": "192.168.1.100", // Optional
          "createdAt": "2023-10-27T14:30:15.125Z",
          "updatedAt": "2023-10-27T14:30:15.125Z"
        },
        // ... more log entries
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during fetching.

### 2. Create New Security Log

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new security log entry.
*   **Authentication:** Required (potentially adjustable based on log source).
*   **Request Body:** (Content-Type: application/json)
    *   Requires `eventType` and `details`. `level` defaults to 'info'. `userId`, `timestamp`, `source` are optional.
    ```json
    {
      "eventType": "CONFIG_UPDATE_ATTEMPT",
      "level": "warn",
      "userId": "60d5f9f3f8d2f4a2c8a8b9e2",
      "details": "User attempted to update critical configuration file /etc/config.conf.",
      "source": "AppService Worker 3"
      // "timestamp": "2023-10-27T15:00:00.000Z" // Optional: Defaults to Date.now()
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a9b7f2",
        "timestamp": "2023-10-27T15:00:00.000Z",
        "eventType": "CONFIG_UPDATE_ATTEMPT",
        "level": "warn",
        "userId": "60d5f9f3f8d2f4a2c8a8b9e2",
        "details": "User attempted to update critical configuration file /etc/config.conf.",
        "source": "AppService Worker 3",
        "createdAt": "2023-10-27T15:00:00.100Z",
        "updatedAt": "2023-10-27T15:00:00.100Z"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (e.g., missing required fields, invalid `level` enum).
    *   `401 Unauthorized`: Missing or invalid token (if required).
    *   `500 Internal Server Error`: Server error during creation.

### 3. Get Security Log By ID

*   **Method:** `GET`
*   **Path:** `/:id`
*   **Description:** Retrieves a single security log entry by its MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the log entry.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
          "_id": "60d5f9f3f8d2f4a2c8a9b7f1",
          "timestamp": "2023-10-27T14:30:15.123Z",
          "eventType": "LOGIN_SUCCESS",
          // ... all log fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Log entry with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during fetching.

### 4. Update Security Log (Full Update)

*   **Method:** `PUT`
*   **Path:** `/:id`
*   **Description:** Replaces an existing security log entry. **Use with caution, logs are often immutable.**
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the log to update.
*   **Request Body:** (Content-Type: application/json)
    *   Requires all fields for the log entry.
    ```json
    {
      "timestamp": "2023-10-27T14:30:15.123Z", // Cannot usually change timestamp
      "eventType": "LOGIN_SUCCESS_REVIEWED", // Updated
      "level": "info",
      "userId": "60d5f9f3f8d2f4a2c8a8b9e1",
      "details": "Admin user admin@example.com logged in successfully. (Reviewed)", // Updated
      "source": "192.168.1.100"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { // The fully updated log object
        "_id": "60d5f9f3f8d2f4a2c8a9b7f1",
        "eventType": "LOGIN_SUCCESS_REVIEWED",
        "details": "Admin user admin@example.com logged in successfully. (Reviewed)",
        // ... all updated fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors, missing required fields).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Log entry with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 5. Partially Update Security Log

*   **Method:** `PATCH`
*   **Path:** `/:id`
*   **Description:** Updates specific fields of an existing log entry. **Use with caution, logs are often immutable.**
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the log to update.
*   **Request Body:** (Content-Type: application/json)
    *   An object containing only the fields to be updated.
    ```json
    {
      "level": "debug", // Change level for reviewed item
      "details": "Admin user admin@example.com logged in successfully. (Reviewed & marked debug)"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a9b7f1",
        "eventType": "LOGIN_SUCCESS_REVIEWED", // Unchanged
        "level": "debug", // Updated
        "details": "Admin user admin@example.com logged in successfully. (Reviewed & marked debug)", // Updated
        // ... other fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Log entry with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 6. Delete Security Log

*   **Method:** `DELETE`
*   **Path:** `/:id`
*   **Description:** Deletes a security log entry. **Use with extreme caution or disable; prefer archiving.**
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the log to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Security log deleted successfully",
      "data": {}
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Log entry with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during deletion.

### 7. Search Security Logs

*   **Method:** `GET`
*   **Path:** `/search`
*   **Description:** Searches for security logs based on criteria.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `eventType` (optional, string): Partial event type (case-insensitive).
    *   `level` (optional, string): Exact log level (e.g., 'error', 'warn').
    *   `userId` (optional, string): Exact MongoDB ObjectId of the user.
    *   `startDate` (optional, string Date): Minimum timestamp (e.g., YYYY-MM-DD or ISO string).
    *   `endDate` (optional, string Date): Maximum timestamp (e.g., YYYY-MM-DD or ISO string).
    *   `page`, `limit`, `sort`, `order` (as in `GET /`).
*   **Success Response (200 OK):** Similar structure to `GET /`, containing only logs matching the criteria.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during search.

### 8. Get Security Headers (Collection)

*   **Method:** `HEAD`
*   **Path:** `/`
*   **Description:** Retrieves headers for the security log collection.
*   **Authentication:** Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Total-Count`: Total number of logs.
        *   `X-Resource-Type`: 'SecurityLogs'.
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized`.
    *   `500 Internal Server Error`.

### 9. Get Security Options (Collection)

*   **Method:** `OPTIONS`
*   **Path:** `/`
*   **Description:** Retrieves allowed HTTP methods for the security log collection endpoint.
*   **Authentication:** Not Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, POST, HEAD, OPTIONS' (Adjust based on immutability decision, might remove POST).
    *   No response body.

### 10. Get Security Headers (Individual)

*   **Method:** `HEAD`
*   **Path:** `/:id`
*   **Description:** Retrieves headers for a specific security log.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the log.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Resource-Type`: 'SecurityLog'.
        *   `Last-Modified`: UTC string based on `timestamp` or `updatedAt`.
    *   No response body.
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`.
    *   `404 Not Found`.
    *   `500 Internal Server Error`.

### 11. Get Security Options (Individual)

*   **Method:** `OPTIONS`
*   **Path:** `/:id`
*   **Description:** Retrieves allowed HTTP methods for a specific security log endpoint.
*   **Authentication:** Not Required.
*   **Path Parameters:**
    *   `id` (string, required): Conceptually identifies the resource type.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS' (Adjust based on immutability decision, might remove PUT/PATCH/DELETE).
    *   No response body.

## Data Model (SecurityLog)

Based on `server/models/securityLog.js`:

```javascript
const securityLogSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    },
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        trim: true,
        index: true
    },
    level: {
        type: String,
        enum: ['info', 'warn', 'error', 'critical', 'debug'], // Example levels
        default: 'info',
        required: true,
        trim: true,
        index: true
    },
    userId: { // Reference to the user who triggered the event (if applicable)
        type: Schema.Types.ObjectId,
        ref: 'Admin', // Or your primary User model
        index: true,
        default: null // Allow system events
    },
    details: {
        type: String,
        required: [true, 'Log details are required']
    },
    source: { // Optional: Source IP, service name, etc.
        type: String,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});
```

**Notes:**

*   The `_id` field (MongoDB ObjectId) is automatically generated.
*   `timestamp`, `eventType`, `level`, `details` are required (`level` defaults to 'info', `timestamp` to `Date.now`).
*   `level` must be one of the values in the `enum` list.
*   `userId` links to the `Admin` model (or relevant user model) but can be null.
*   `source` provides optional context.
*   Timestamps (`createdAt`, `updatedAt`) are automatically managed. 