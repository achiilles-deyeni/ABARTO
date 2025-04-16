# Employee API Documentation

**Base Path:** `/api/employees`

This document provides details about the API endpoints available for managing employee resources.

**Authentication:** All routes require authentication via a valid JWT Bearer token passed in the `Authorization` header.

---

## Endpoints

### 1. Get All Employees

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves a paginated list of all employees.
- **Access:** Authenticated users.
- **Query Parameters:**
  - `page` (number, optional, default: 1): The page number for pagination.
  - `limit` (number, optional, default: 10, max: 100): The number of employees per page.
  - `sort` (string, optional, default: 'lastName'): The field to sort by (e.g., 'firstName', 'lastName', 'hireDate').
  - `order` (string, optional, default: 'asc'): The sort order ('asc' or 'desc').
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "total": 150, // Total number of employees matching criteria
    "page": 1,
    "limit": 10,
    "totalPages": 15,
    "count": 10, // Number of employees in this response
    "data": [
      {
        "_id": "60d...",
        "employeeId": "EMP1001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "123-456-7890",
        "hireDate": "2023-01-15T00:00:00.000Z",
        "department": "Manufacturing",
        "position": "Technician",
        "salary": 55000,
        "createdAt": "...",
        "updatedAt": "..."
      },
      // ... more employee objects
    ]
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If the token is missing or invalid.
  - `500 Internal Server Error`: If there's a server-side issue.

### 2. Create New Employee

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new employee record.
- **Access:** Authenticated users.
- **Request Body:** (Requires fields defined in the `Employee` schema)
  ```json
  {
    "employeeId": "EMP1002",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "987-654-3210",
    "hireDate": "2023-03-01",
    "department": "Quality Control",
    "position": "Inspector",
    "salary": 60000
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "60e...",
      "employeeId": "EMP1002",
      "firstName": "Jane",
      // ... other fields
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: If the request body is invalid or missing required fields.
  - `401 Unauthorized`: If the token is missing or invalid.
  - `500 Internal Server Error`: If there's a server-side issue.

### 3. Get Employee Information (HEAD)

- **Method:** `HEAD`
- **Path:** `/`
- **Description:** Retrieves headers about the employee collection, including the total count. No response body.
- **Access:** Authenticated users.
- **Success Response (200 OK):**
  - Headers:
    - `X-Total-Count`: Total number of employees.
    - `X-Resource-Type`: 'Employees'.
- **Error Responses:**
  - `401 Unauthorized`: If the token is missing or invalid.
  - `500 Internal Server Error`: If there's a server-side issue.

### 4. Get Employee Options

- **Method:** `OPTIONS`
- **Path:** `/`
- **Description:** Retrieves the allowed HTTP methods for the `/api/employees` path.
- **Access:** Public (Typically no authentication needed for OPTIONS).
- **Success Response (200 OK):**
  - Headers:
    - `Allow`: `GET, POST, HEAD, OPTIONS`
- **Error Responses:** (Usually none for OPTIONS, but depends on server config)

### 5. Search Employees

- **Method:** `GET`
- **Path:** `/search`
- **Description:** Searches for employees based on specified criteria. Uses case-insensitive regex matching.
- **Access:** Authenticated users.
- **Query Parameters:**
  - `firstName` (string, optional): Filter by first name (partial match).
  - `lastName` (string, optional): Filter by last name (partial match).
  - `department` (string, optional): Filter by department (partial match).
  - `position` (string, optional): Filter by position (partial match).
  - `page` (number, optional, default: 1): The page number for pagination.
  - `limit` (number, optional, default: 10, max: 100): The number of results per page.
  - `sort` (string, optional, default: 'lastName'): Field to sort by.
  - `order` (string, optional, default: 'asc'): Sort order ('asc' or 'desc').
- **Success Response (200 OK):** (Similar structure to `GET /`)
  ```json
  {
    "success": true,
    "total": 5, // Total matching employees
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "count": 5, // Count in this response
    "data": [
      // ... employee objects matching search criteria
    ]
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If the token is missing or invalid.
  - `500 Internal Server Error`: If there's a server-side issue during the search.

### 6. Bulk Create Employees

- **Method:** `POST`
- **Path:** `/bulk`
- **Description:** Creates multiple employee records in a single request.
- **Access:** Authenticated users.
- **Request Body:** An array of employee objects.
  ```json
  [
    { "employeeId": "EMP1003", "firstName": "Peter", ... },
    { "employeeId": "EMP1004", "firstName": "Alice", ... }
  ]
  ```
- **Success Response (201 Created):** (Response format depends on controller implementation - might return created objects, count, etc.)
  ```json
  {
    "success": true,
    "message": "Bulk creation successful.",
    "data": { // Example: Could contain summary or IDs
      "insertedCount": 2
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: If the request body format is incorrect or contains invalid employee data.
  - `401 Unauthorized`: If the token is missing or invalid.
  - `500 Internal Server Error`: If there's a server-side issue during bulk insertion.

### 7. Get Single Employee by ID

- **Method:** `GET`
- **Path:** `/:id`
- **Description:** Retrieves a specific employee by their unique MongoDB ObjectId.
- **Access:** Authenticated users.
- **Path Parameters:**
  - `id` (string, required): The MongoDB ObjectId of the employee.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d...",
      "employeeId": "EMP1001",
      // ... other employee fields
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If the token is missing or invalid.
  - `404 Not Found`: If no employee with the given ID exists.
  - `500 Internal Server Error`: If there's a server-side issue.

### 8. Update Employee (Full Update)

- **Method:** `PUT`
- **Path:** `/:id`
- **Description:** Replaces an existing employee record entirely with the provided data.
- **Access:** Authenticated users.
- **Path Parameters:**
  - `id` (string, required): The MongoDB ObjectId of the employee to update.
- **Request Body:** (Requires all fields defined in the `Employee` schema for a valid replacement)
  ```json
  {
    "employeeId": "EMP1001",
    "firstName": "Johnathan", // Updated
    "lastName": "Doe",
    "email": "johnathan.doe@example.com", // Updated
    "phoneNumber": "123-456-7890",
    "hireDate": "2023-01-15",
    "department": "Research & Development", // Updated
    "position": "Senior Technician", // Updated
    "salary": 62000 // Updated
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d...",
      "employeeId": "EMP1001",
      "firstName": "Johnathan",
      // ... other updated fields
      "updatedAt": "..." // Shows the update time
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: If the request body is invalid or missing required fields for replacement.
  - `401 Unauthorized`: If the token is missing or invalid.
  - `404 Not Found`: If no employee with the given ID exists.
  - `500 Internal Server Error`: If there's a server-side issue.

### 9. Delete Employee

- **Method:** `DELETE`
- **Path:** `/:id`
- **Description:** Deletes an employee record by their ID.
- **Access:** Authenticated users.
- **Path Parameters:**
  - `id` (string, required): The MongoDB ObjectId of the employee to delete.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {} // Empty object indicates successful deletion
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If the token is missing or invalid.
  - `404 Not Found`: If no employee with the given ID exists.
  - `500 Internal Server Error`: If there's a server-side issue.

### 10. Partially Update Employee

- **Method:** `PATCH`
- **Path:** `/:id`
- **Description:** Updates specific fields of an existing employee record. Only provided fields are modified.
- **Access:** Authenticated users.
- **Path Parameters:**
  - `id` (string, required): The MongoDB ObjectId of the employee to update.
- **Request Body:** (Object containing only the fields to update)
  ```json
  {
    "email": "john.doe.updated@example.com",
    "salary": 58000
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d...",
      // ... unchanged fields
      "email": "john.doe.updated@example.com",
      "salary": 58000,
      // ... other fields
      "updatedAt": "..." // Shows the update time
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: If the request body contains invalid data for the fields being updated.
  - `401 Unauthorized`: If the token is missing or invalid.
  - `404 Not Found`: If no employee with the given ID exists.
  - `500 Internal Server Error`: If there's a server-side issue.

### 11. Get Single Employee Information (HEAD)

- **Method:** `HEAD`
- **Path:** `/:id`
- **Description:** Retrieves headers for a specific employee. No response body.
- **Access:** Authenticated users.
- **Path Parameters:**
  - `id` (string, required): The MongoDB ObjectId of the employee.
- **Success Response (200 OK):**
  - Headers: (May include `Content-Length`, `Last-Modified`, `ETag`, etc., depending on controller implementation)
- **Error Responses:**
  - `401 Unauthorized`: If the token is missing or invalid.
  - `404 Not Found`: If no employee with the given ID exists.
  - `500 Internal Server Error`: If there's a server-side issue.

### 12. Get Single Employee Options

- **Method:** `OPTIONS`
- **Path:** `/:id`
- **Description:** Retrieves the allowed HTTP methods for a specific employee resource path (`/api/employees/:id`).
- **Access:** Public (Typically no authentication needed for OPTIONS).
- **Path Parameters:**
  - `id` (string, required): The MongoDB ObjectId of the employee (used to form the path).
- **Success Response (200 OK):**
  - Headers:
    - `Allow`: `GET, PUT, DELETE, PATCH, HEAD, OPTIONS`
- **Error Responses:** (Usually none for OPTIONS, but depends on server config) 