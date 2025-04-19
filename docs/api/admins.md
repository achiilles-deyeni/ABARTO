# Admins API Documentation

This document provides details about the API endpoints available for managing Admin user resources.

**Base Path:** `/api/admins`

**Authentication:** All routes under this path require authentication via a JWT Bearer token in the `Authorization` header (`protect` middleware is applied globally), except potentially `OPTIONS` requests which are typically handled before authentication.

## Endpoints

### 1. Get All Admins

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a paginated list of all admin users. Supports sorting and limiting results.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `page` (optional, number, default: 1): Page number for pagination.
    *   `limit` (optional, number, default: 10, max: 100): Number of admins per page.
    *   `sort` (optional, string, default: 'lastName'): Field to sort by (e.g., 'lastName', 'email').
    *   `order` (optional, string, default: 'asc'): Sort order ('asc' or 'desc').
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "total": 5, // Total number of admins in the database
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "count": 5, // Number of admins on the current page
      "data": [
        {
          "_id": "60d5f9f3f8d2f4a2c8a8b9e1",
          "firstName": "System",
          "lastName": "Admin",
          "email": "admin@example.com",
          // ... other admin fields (excluding password)
        },
        // ... more admins
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during fetching.

### 2. Create New Admin

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new admin user record. Note: This is distinct from the public registration endpoint `/api/auth/register`. This endpoint likely requires the caller to already be authenticated (and potentially authorized).
*   **Authentication:** Required.
*   **Request Body:** (Content-Type: application/json)
    *   Requires fields defined in the Admin model (e.g., `firstName`, `lastName`, `email`, `password`).
    ```json
    {
      "firstName": "Another",
      "lastName": "Administrator",
      "email": "another.admin@example.com",
      "password": "strongPassword456",
      "phoneNumber": "555-987-6543" // Optional
      // ... other fields
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8b9e2",
        "firstName": "Another",
        "lastName": "Administrator",
        "email": "another.admin@example.com",
        // ... other admin fields (excluding password), including _id and timestamps
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (e.g., missing required fields, validation errors, password too short).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `409 Conflict`: An admin with the provided email already exists (if email is unique).
    *   `500 Internal Server Error`: Server error during creation.

### 3. Get Admin By ID

*   **Method:** `GET`
*   **Path:** `/:id`
*   **Description:** Retrieves a single admin user by their unique MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the admin.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8b9e1",
        "firstName": "System",
        "lastName": "Admin",
        "email": "admin@example.com",
        // ... all admin fields (excluding password)
      }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Admin with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during fetching.

### 4. Update Admin (Full Update)

*   **Method:** `PUT`
*   **Path:** `/:id`
*   **Description:** Replaces an existing admin record entirely with the provided data. Fields not included might be removed or set to default based on the schema. **Caution:** Updating the password requires sending the new password; omitting it might cause issues depending on the service implementation.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the admin to update.
*   **Request Body:** (Content-Type: application/json)
    *   Requires all fields for the admin for a full replacement.
    ```json
    {
      "firstName": "SystemUpdated",
      "lastName": "Admin",
      "email": "admin.updated@example.com",
      // "password": "newSecurePassword789", // Optional: Include only if changing password
      "phoneNumber": "555-111-2222",
      "salary": 85000
      // ... other fields as required by the model for a full update
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8b9e1",
        "firstName": "SystemUpdated",
        "email": "admin.updated@example.com",
        // ... all updated admin fields (excluding password)
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Admin with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 5. Partially Update Admin

*   **Method:** `PATCH`
*   **Path:** `/:id`
*   **Description:** Updates specific fields of an existing admin record. Only the fields provided in the request body are modified. Allows changing the password by including the `password` field.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the admin to update.
*   **Request Body:** (Content-Type: application/json)
    *   An object containing only the fields to be updated.
    ```json
    {
      "lastName": "AdministratorPatched",
      "salary": 90000,
      "password": "evenNewerPassword123" // Optional: Include to change password
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8b9e1",
        "firstName": "SystemUpdated", // Unchanged field from previous state
        "lastName": "AdministratorPatched", // Updated field
        "salary": 90000, // Updated field
        // ... other admin fields (excluding password)
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors, e.g., invalid password format if provided).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Admin with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 6. Delete Admin

*   **Method:** `DELETE`
*   **Path:** `/:id`
*   **Description:** Deletes an admin record by their unique MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the admin to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {} // Empty object indicates successful deletion
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Admin with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during deletion.

### 7. Search Admins

*   **Method:** `GET`
*   **Path:** `/search`
*   **Description:** Searches for admins based on criteria like name, email, or portfolio content (case-insensitive). Supports pagination and sorting.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `firstName` (optional, string): Partial or full first name.
    *   `lastName` (optional, string): Partial or full last name.
    *   `email` (optional, string): Partial or full email address.
    *   `portfolio` (optional, string): Text to search within the portfolio array items.
    *   `page` (optional, number, default: 1): Page number.
    *   `limit` (optional, number, default: 10, max: 100): Results per page.
    *   `sort` (optional, string, default: 'lastName'): Field to sort by.
    *   `order` (optional, string, default: 'asc'): Sort order.
*   **Success Response (200 OK):** Similar structure to `GET /`, containing only admins matching the criteria.
    ```json
    {
      "success": true,
      "total": 1, // Total number matching the search
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "count": 1, // Count on the current page
      "data": [
        { /* Admin matching criteria */ }
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during search.

### 8. Get Admin Headers (Collection)

*   **Method:** `HEAD`
*   **Path:** `/`
*   **Description:** Retrieves headers for the admin collection (e.g., total count) without the data body.
*   **Authentication:** Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Total-Count`: Total number of admins.
        *   `X-Resource-Type`: 'Admins'.
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`.

### 9. Get Admin Options (Collection)

*   **Method:** `OPTIONS`
*   **Path:** `/`
*   **Description:** Retrieves allowed HTTP methods for the admin collection endpoint (`/api/admins`).
*   **Authentication:** May not be required (OPTIONS usually bypass auth checks).
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, POST, HEAD, OPTIONS, PATCH' (Based on controller code, PATCH is allowed on collection, though no route seems defined. Might be an error in controller or intended for future use).
    *   No response body.

### 10. Get Admin Headers (Individual)

*   **Method:** `HEAD`
*   **Path:** `/:id`
*   **Description:** Retrieves headers for a specific admin (e.g., last modified) without the data body.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the admin.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Resource-Type`: 'Admin'.
        *   `Last-Modified`: UTC string of the last update time.
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`.
    *   `500 Internal Server Error`.

### 11. Get Admin Options (Individual)

*   **Method:** `OPTIONS`
*   **Path:** `/:id`
*   **Description:** Retrieves allowed HTTP methods for a specific admin endpoint (`/api/admins/:id`).
*   **Authentication:** May not be required.
*   **Path Parameters:**
    *   `id` (string, required): Conceptually identifies the resource type.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS'
    *   No response body.

## Data Model (Admin)

(Refer to the Data Model section in `docs/api/auth.md` as it uses the same `Admin` model.) 