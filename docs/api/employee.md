# Employees API Documentation

This document provides details about the API endpoints available for managing employee resources.

**Base Path:** `/api/employees`

**Authentication:** All routes require authentication via a JWT Bearer token in the `Authorization` header, except for `OPTIONS` requests.

## Endpoints

### 1. Get All Employees

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a paginated list of all employees. Supports sorting and limiting results.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `page` (optional, number, default: 1): Page number for pagination.
    *   `limit` (optional, number, default: 10, max: 100): Number of employees per page.
    *   `sort` (optional, string, default: 'lastName'): Field to sort by (e.g., 'lastName', 'firstName', 'dateEmployed').
    *   `order` (optional, string, default: 'asc'): Sort order ('asc' or 'desc').
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "total": 150, // Total number of employees in the database
      "page": 1,
      "limit": 10,
      "totalPages": 15,
      "count": 10, // Number of employees on the current page
      "data": [
        {
          "_id": "60d5f9f3f8d2f4a2c8a8b8c8",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com",
          "phone": "123-456-7890",
          "department": "Manufacturing",
          "position": "Machine Operator",
          "dateEmployed": "2021-01-15T00:00:00.000Z",
          // ... other employee fields
        },
        // ... more employees
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during fetching.

### 2. Create New Employee

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new employee record.
*   **Authentication:** Required.
*   **Request Body:** (Content-Type: application/json)
    *   Requires fields defined in the Employee model (see Data Model section).
    ```json
    {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phone": "987-654-3210",
      "department": "Quality Control",
      "position": "Inspector",
      "dateEmployed": "2022-03-10T00:00:00.000Z",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      },
      "emergencyContact": {
        "name": "Robert Smith",
        "relationship": "Spouse",
        "phone": "555-123-4567"
      }
      // ... other required fields
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8b8d0",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com",
        // ... other employee fields including _id and timestamps
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (e.g., missing required fields, validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during creation.

### 3. Bulk Create Employees

*   **Method:** `POST`
*   **Path:** `/bulk`
*   **Description:** Creates multiple employee records in a single request.
*   **Authentication:** Required.
*   **Request Body:** (Content-Type: application/json) An array of employee objects.
    ```json
    [
      {
        "firstName": "Alice",
        "lastName": "Brown",
        "email": "alice.brown@example.com",
        "department": "Logistics",
        "position": "Coordinator",
        "dateEmployed": "2023-05-20T00:00:00.000Z",
        // ... other required fields
      },
      {
        "firstName": "Bob",
        "lastName": "Green",
        "email": "bob.green@example.com",
        "department": "Maintenance",
        "position": "Technician",
        "dateEmployed": "2023-06-01T00:00:00.000Z",
        // ... other required fields
      }
    ]
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Bulk employee creation successful",
      "results": {
        "successful": [ // Array of successfully created employees
          { /* employee data */ }
        ],
        "failed": [ // Array of objects detailing failures
          { "data": { /* attempted data */ }, "error": "Validation error message" }
        ]
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data format or validation errors within the array.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during bulk creation.

### 4. Get Employee By ID

*   **Method:** `GET`
*   **Path:** `/:id`
*   **Description:** Retrieves a single employee by their unique MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the employee.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8b8c8",
        "firstName": "John",
        "lastName": "Doe",
        // ... all employee fields
      }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Employee with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during fetching.

### 5. Update Employee (Full Update)

*   **Method:** `PUT`
*   **Path:** `/:id`
*   **Description:** Replaces an existing employee record entirely with the provided data. Fields not included in the request body might be removed or set to default, depending on the model schema.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the employee to update.
*   **Request Body:** (Content-Type: application/json)
    *   Requires all fields for the employee, as this performs a full replacement.
    ```json
    {
      "firstName": "Johnathan", // Updated field
      "lastName": "Doe",
      "email": "john.doe.updated@example.com", // Updated field
      "phone": "123-555-7890",
      "department": "Production", // Updated field
      "position": "Senior Operator", // Updated field
      "dateEmployed": "2021-01-15T00:00:00.000Z",
      "address": {
        "street": "456 Oak Ave", // Updated nested field
        "city": "New City",
        "state": "NY",
        "zipCode": "54321"
      },
      "emergencyContact": {
        "name": "Mary Doe",
        "relationship": "Spouse",
        "phone": "555-987-6543"
      }
      // ... other fields as required by the model
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8b8c8",
        "firstName": "Johnathan",
        "email": "john.doe.updated@example.com",
        // ... all updated employee fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Employee with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 6. Partially Update Employee

*   **Method:** `PATCH`
*   **Path:** `/:id`
*   **Description:** Updates specific fields of an existing employee record. Only the fields provided in the request body are modified.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the employee to update.
*   **Request Body:** (Content-Type: application/json)
    *   An object containing only the fields to be updated.
    ```json
    {
      "position": "Lead Machine Operator",
      "phone": "123-777-8888",
      "emergencyContact": {
        "phone": "555-111-2222" // Update only the phone within the nested object
      }
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8b8c8",
        "firstName": "Johnathan", // Unchanged field
        "position": "Lead Machine Operator", // Updated field
        "phone": "123-777-8888", // Updated field
        "emergencyContact": {
            "name": "Mary Doe", // Unchanged sub-field
            "relationship": "Spouse", // Unchanged sub-field
            "phone": "555-111-2222" // Updated sub-field
        },
        // ... other employee fields, showing updated values
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Employee with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 7. Delete Employee

*   **Method:** `DELETE`
*   **Path:** `/:id`
*   **Description:** Deletes an employee record by their unique MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the employee to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {} // Empty object indicates successful deletion
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Employee with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during deletion.

### 8. Search Employees

*   **Method:** `GET`
*   **Path:** `/search`
*   **Description:** Searches for employees based on various criteria (case-insensitive). Supports pagination and sorting.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `firstName` (optional, string): Partial or full first name to search for.
    *   `lastName` (optional, string): Partial or full last name to search for.
    *   `department` (optional, string): Partial or full department name.
    *   `position` (optional, string): Partial or full position title.
    *   `page` (optional, number, default: 1): Page number for pagination.
    *   `limit` (optional, number, default: 10, max: 100): Number of results per page.
    *   `sort` (optional, string, default: 'lastName'): Field to sort results by.
    *   `order` (optional, string, default: 'asc'): Sort order ('asc' or 'desc').
*   **Success Response (200 OK):** Similar structure to `GET /`, containing only employees matching the search criteria.
    ```json
    {
      "success": true,
      "total": 5, // Total number matching the search
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "count": 5, // Count on the current page
      "data": [
        { /* Employee matching criteria */ },
        // ... other matching employees
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during search.

### 9. Get Employee Headers (Collection)

*   **Method:** `HEAD`
*   **Path:** `/`
*   **Description:** Retrieves headers for the employee collection, primarily the total count, without returning the actual data. Useful for checking the size of the collection.
*   **Authentication:** Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Total-Count`: Total number of employees.
        *   `X-Resource-Type`: 'Employees'.
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error. (Responds with 500 status, no body)

### 10. Get Employee Options (Collection)

*   **Method:** `OPTIONS`
*   **Path:** `/`
*   **Description:** Retrieves the allowed HTTP methods for the employee collection endpoint (`/api/employees`).
*   **Authentication:** Not Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, POST, HEAD, OPTIONS'
    *   No response body.

### 11. Get Employee Headers (Individual)

*   **Method:** `HEAD`
*   **Path:** `/:id`
*   **Description:** Retrieves headers for a specific employee, such as last modified time, without returning the employee data.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the employee.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Resource-Type`: 'Employee'.
        *   `X-Last-Modified`: Timestamp of the last update or employment date.
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Employee not found. (Responds with 404 status, no body)
    *   `500 Internal Server Error`: Server error. (Responds with 500 status, no body)

### 12. Get Employee Options (Individual)

*   **Method:** `OPTIONS`
*   **Path:** `/:id`
*   **Description:** Retrieves the allowed HTTP methods for a specific employee endpoint (`/api/employees/:id`).
*   **Authentication:** Not Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the employee (Note: the endpoint exists conceptually even if the ID doesn't match a specific employee).
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS'
    *   No response body.

## Data Model (Employee)

Based on `server/models/employee.js`:

```javascript
const EmployeeSchema = new mongoose.Schema({
  employeeId: { // Optional: If you use a custom ID format besides _id
    type: String,
    unique: true,
    sparse: true // Allows null values if not provided, but enforces uniqueness if present
  },
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
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
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  department: {
    type: String,
    required: [true, 'Please add a department'],
    trim: true,
    maxlength: [50, 'Department name cannot be more than 50 characters']
  },
  position: {
    type: String,
    required: [true, 'Please add a position'],
    trim: true,
    maxlength: [50, 'Position title cannot be more than 50 characters']
  },
  dateEmployed: {
    type: Date,
    default: Date.now
  },
  address: { // Embedded document for address
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  emergencyContact: { // Embedded document for emergency contact
    name: String,
    relationship: String,
    phone: String
  },
  // Add other relevant fields like salary, employment status (full-time/part-time), etc.
  // Timestamps are automatically added by Mongoose (createdAt, updatedAt)
}, { timestamps: true });
```

**Notes:**

*   The `_id` field (MongoDB ObjectId) is automatically generated and serves as the primary unique identifier unless a custom `employeeId` is implemented and required.
*   Timestamps (`createdAt`, `updatedAt`) are automatically managed by Mongoose.
*   Nested objects (`address`, `emergencyContact`) have their own structure.
*   Validation rules (required, maxlength, match) are enforced. 

module.exports = router; 