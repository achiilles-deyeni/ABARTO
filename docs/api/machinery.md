# Machinery API Documentation

This document provides details about the API endpoints available for managing machinery part resources.

**Base Path:** `/api/machinery`

**Authentication:** Assumed required for all routes based on controller implementation patterns (using `asyncHandler` which often pairs with `protect` middleware implicitly or explicitly at a higher level). The route file itself doesn't explicitly apply `protect` middleware.

## Endpoints

### 1. Get All Machinery Parts

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a paginated list of all machinery parts. Supports sorting, limiting, and populating the associated machine details.
*   **Authentication:** Required (assumed).
*   **Query Parameters:**
    *   `page` (optional, number, default: 1): Page number.
    *   `limit` (optional, number, default: 10, max: 100): Items per page.
    *   `sort` (optional, string, default: 'name'): Field to sort by (e.g., 'name', 'price').
    *   `order` (optional, string, default: 'asc'): Sort order ('asc' or 'desc').
    *   `populate` (optional, boolean, default: false): If true, populates the `machine` field with details from the referenced `Machines` model.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "total": 120,
      "page": 1,
      "limit": 10,
      "totalPages": 12,
      "count": 10,
      "data": [
        {
          "_id": "60d5f9f3f8d2f4a2c8a8d2b1",
          "name": "Gear Set Alpha",
          "type": "Transmission",
          "quantity": 5,
          "price": 250.75,
          "description": "Replacement gear set for Model X conveyor belt.",
          "machine": "60d5f9f3f8d2f4a2c8a8e3c1" // ObjectId or populated object if populate=true
          // Timestamps may be present if enabled in schema
        },
        // ... more parts
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized` (if auth is enforced).
    *   `500 Internal Server Error`: Server error during fetching.

### 2. Create New Machinery Part

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new machinery part record.
*   **Authentication:** Required (assumed).
*   **Request Body:** (Content-Type: application/json)
    *   Requires fields defined in the `machineryPartsSchema`: `name`, `type`, `quantity`, `price`, `description`, `machine` (ObjectId).
    ```json
    {
      "name": "Bearing Housing Y",
      "type": "Bearing Assembly",
      "quantity": 15,
      "price": 85.50,
      "description": "Housing for main shaft bearing, Model Y grinder.",
      "machine": "60d5f9f3f8d2f4a2c8a8e3c2"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8d2b2",
        "name": "Bearing Housing Y",
        "type": "Bearing Assembly",
        "quantity": 15,
        "price": 85.50,
        "description": "Housing for main shaft bearing, Model Y grinder.",
        "machine": "60d5f9f3f8d2f4a2c8a8e3c2"
        // Timestamps may be present
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (e.g., missing required fields, validation errors, name already exists).
    *   `401 Unauthorized` (if auth is enforced).
    *   `500 Internal Server Error`: Server error during creation.

### 3. Get Machinery Part By ID

*   **Method:** `GET`
*   **Path:** `/:id`
*   **Description:** Retrieves a single machinery part by its unique MongoDB ID. Can populate machine details.
*   **Authentication:** Required (assumed).
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the part.
*   **Query Parameters:**
    *   `populate` (optional, boolean, default: false): If true, populates the `machine` field.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
         "_id": "60d5f9f3f8d2f4a2c8a8d2b1",
         "name": "Gear Set Alpha",
         "type": "Transmission",
         "quantity": 5,
         "price": 250.75,
         "description": "Replacement gear set for Model X conveyor belt.",
         "machine": "60d5f9f3f8d2f4a2c8a8e3c1" // or populated object
         // Timestamps
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized` (if auth is enforced).
    *   `404 Not Found`: Part with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during fetching.

### 4. Update Machinery Part (Full Update)

*   **Method:** `PUT`
*   **Path:** `/:id`
*   **Description:** Replaces an existing machinery part record entirely.
*   **Authentication:** Required (assumed).
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the part to update.
*   **Request Body:** (Content-Type: application/json)
    *   Requires all fields for the part for a full replacement.
    ```json
    {
      "name": "Gear Set Alpha V2", // Updated
      "type": "Transmission",
      "quantity": 8, // Updated
      "price": 260.00, // Updated
      "description": "Upgraded gear set for Model X conveyor belt.", // Updated
      "machine": "60d5f9f3f8d2f4a2c8a8e3c1"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8d2b1",
        "name": "Gear Set Alpha V2",
        // ... all updated part fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors, missing required fields).
    *   `401 Unauthorized` (if auth is enforced).
    *   `404 Not Found`: Part with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 5. Partially Update Machinery Part

*   **Method:** `PATCH`
*   **Path:** `/:id`
*   **Description:** Updates specific fields of an existing machinery part record.
*   **Authentication:** Required (assumed).
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the part to update.
*   **Request Body:** (Content-Type: application/json)
    *   An object containing only the fields to be updated.
    ```json
    {
      "quantity": 12,
      "price": 265.50
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8d2b1",
        "name": "Gear Set Alpha V2", // Unchanged field
        "quantity": 12, // Updated field
        "price": 265.50, // Updated field
        // ... other part fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors).
    *   `401 Unauthorized` (if auth is enforced).
    *   `404 Not Found`: Part with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 6. Delete Machinery Part

*   **Method:** `DELETE`
*   **Path:** `/:id`
*   **Description:** Deletes a machinery part record by its unique MongoDB ID.
*   **Authentication:** Required (assumed).
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the part to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized` (if auth is enforced).
    *   `404 Not Found`: Part with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during deletion.

### 7. Search Machinery Parts

*   **Method:** `GET`
*   **Path:** `/search`
*   **Description:** Searches for machinery parts based on criteria. Supports population.
*   **Authentication:** Required (assumed).
*   **Query Parameters:**
    *   `name` (optional, string): Partial name (case-insensitive).
    *   `type` (optional, string): Partial type (case-insensitive).
    *   `machineId` (optional, string): Exact MongoDB ObjectId of the associated machine.
    *   `populate` (optional, boolean, default: false): If true, populates the `machine` field.
    *   `page`, `limit`, `sort`, `order` (as in `GET /`).
*   **Success Response (200 OK):** Similar structure to `GET /`, containing only parts matching the criteria.
*   **Error Responses:**
    *   `401 Unauthorized` (if auth is enforced).
    *   `500 Internal Server Error`: Server error during search.

### 8. Get Machinery Headers (Collection)

*   **Method:** `HEAD`
*   **Path:** `/`
*   **Description:** Retrieves headers for the machinery parts collection (e.g., total count).
*   **Authentication:** Required (assumed).
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Total-Count`: Total number of parts.
        *   `X-Resource-Type`: 'MachineryParts'.
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized` (if auth is enforced).
    *   `500 Internal Server Error`.

### 9. Get Machinery Options (Collection)

*   **Method:** `OPTIONS`
*   **Path:** `/`
*   **Description:** Retrieves allowed HTTP methods for the machinery parts collection endpoint.
*   **Authentication:** Not Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, POST, HEAD, OPTIONS, PATCH' (Based on controller).
    *   No response body.

### 10. Get Machinery Headers (Individual)

*   **Method:** `HEAD`
*   **Path:** `/:id`
*   **Description:** Retrieves headers for a specific machinery part.
*   **Authentication:** Required (assumed).
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the part.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Resource-Type`: 'MachineryPart'.
        *   `Last-Modified`: Not available (schema lacks timestamps).
    *   No response body.
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized` (if auth is enforced).
    *   `404 Not Found`.
    *   `500 Internal Server Error`.

### 11. Get Machinery Options (Individual)

*   **Method:** `OPTIONS`
*   **Path:** `/:id`
*   **Description:** Retrieves allowed HTTP methods for a specific machinery part endpoint.
*   **Authentication:** Not Required.
*   **Path Parameters:**
    *   `id` (string, required): Conceptually identifies the resource type.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS'
    *   No response body.

## Data Model (MachineryPart)

Based on `server/models/machineryPart.js` (exports model named `machines`):

```javascript
const machineryPartsSchema = new mongoose.Schema({
  name: { 
    type: "string", // Should be String
    required: true, 
    unique: true 
  },
  type: { 
    type: "string", // Should be String
    required: true 
  },
  quantity: { 
    type: "number", // Should be Number
    required: true 
  },
  price: { 
    type: "number", // Should be Number
    required: true 
  },
  description: { 
    type: "string", // Should be String
    required: true 
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Machines", // Assumes a 'Machines' model exists
    required: true,
  },
  // Note: Timestamps (createdAt, updatedAt) are NOT explicitly enabled in the schema snippet
});
```

**Notes:**

*   The `_id` field (MongoDB ObjectId) is automatically generated.
*   All fields (`name`, `type`, `quantity`, `price`, `description`, `machine`) are required.
*   The `machine` field stores an ObjectId referencing a document in the `Machines` collection (assumed).
*   The schema uses string literals for types (e.g., "string", "number") which should ideally be Mongoose types (`String`, `Number`).
*   Timestamps are not enabled in the provided schema. 