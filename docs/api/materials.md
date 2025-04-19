# Materials API Documentation

This document provides details about the API endpoints available for managing raw material resources.

**Base Path:** `/api/materials`

**Authentication:** Required for all routes via a JWT Bearer token in the `Authorization` header (`protect` middleware applied).

## Endpoints

### 1. Get All Materials

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a paginated list of all raw materials. Supports sorting and limiting results.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `page` (optional, number, default: 1): Page number.
    *   `limit` (optional, number, default: 10, max: 100): Items per page.
    *   `sort` (optional, string, default: 'Name'): Field to sort by (e.g., 'Name', 'Quantity', 'price'). Note: Model uses capitalized field names.
    *   `order` (optional, string, default: 'asc'): Sort order ('asc' or 'desc').
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "total": 75,
      "page": 1,
      "limit": 10,
      "totalPages": 8,
      "count": 10,
      "data": [
        {
          "_id": "60d5f9f3f8d2f4a2c8a8e4d1",
          "Name": "Steel Coil",
          "Source": "Supplier Alpha",
          "Quantity": 5000,
          "dateProvided": "2023-05-10T00:00:00.000Z",
          "price": "2.50" // Note: Price is String in schema
          // Timestamps may be present if enabled
        },
        // ... more materials
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during fetching.

### 2. Create New Material

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new raw material record.
*   **Authentication:** Required.
*   **Request Body:** (Content-Type: application/json)
    *   Requires fields defined in the `rawMaterialsSchema`: `Name`, `Source`, `Quantity`, `dateProvided`, `price`.
    ```json
    {
      "Name": "Aluminum Sheet",
      "Source": "Supplier Beta",
      "Quantity": 250,
      "dateProvided": "2023-10-20T00:00:00.000Z",
      "price": "15.75"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8e4d2",
        "Name": "Aluminum Sheet",
        "Source": "Supplier Beta",
        "Quantity": 250,
        "dateProvided": "2023-10-20T00:00:00.000Z",
        "price": "15.75"
        // Timestamps may be present
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (e.g., missing required fields, validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `409 Conflict`: Material with the same `Name` already exists (if unique constraint is enforced).
    *   `500 Internal Server Error`: Server error during creation.

### 3. Get Material By ID

*   **Method:** `GET`
*   **Path:** `/:id`
*   **Description:** Retrieves a single raw material by its unique MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the material.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
          "_id": "60d5f9f3f8d2f4a2c8a8e4d1",
          "Name": "Steel Coil",
          "Source": "Supplier Alpha",
          "Quantity": 5000,
          "dateProvided": "2023-05-10T00:00:00.000Z",
          "price": "2.50"
          // Timestamps
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Material with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during fetching.

### 4. Update Material (Full Update)

*   **Method:** `PUT`
*   **Path:** `/:id`
*   **Description:** Replaces an existing raw material record entirely.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the material to update.
*   **Request Body:** (Content-Type: application/json)
    *   Requires all fields for the material for a full replacement (`Name`, `Source`, `Quantity`, `dateProvided`, `price`).
    ```json
    {
      "Name": "Steel Coil - Grade B", // Updated
      "Source": "Supplier Alpha",
      "Quantity": 4500, // Updated
      "dateProvided": "2023-06-01T00:00:00.000Z", // Updated
      "price": "2.45" // Updated
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8e4d1",
        "Name": "Steel Coil - Grade B",
        // ... all updated material fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors, missing required fields).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Material with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 5. Partially Update Material

*   **Method:** `PATCH`
*   **Path:** `/:id`
*   **Description:** Updates specific fields of an existing raw material record.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the material to update.
*   **Request Body:** (Content-Type: application/json)
    *   An object containing only the fields to be updated.
    ```json
    {
      "Quantity": 4800,
      "price": "2.48"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8e4d1",
        "Name": "Steel Coil - Grade B", // Unchanged field
        "Quantity": 4800, // Updated field
        "price": "2.48", // Updated field
        // ... other material fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Material with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 6. Delete Material

*   **Method:** `DELETE`
*   **Path:** `/:id`
*   **Description:** Deletes a raw material record by its unique MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the material to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Material deleted successfully",
      "data": {}
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Material with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during deletion.

### 7. Search Materials

*   **Method:** `GET`
*   **Path:** `/search`
*   **Description:** Searches for raw materials based on criteria.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `Name` (optional, string): Partial name (case-insensitive).
    *   `Source` (optional, string): Partial source name (case-insensitive).
    *   `minQuantity` (optional, number): Minimum quantity.
    *   `page`, `limit`, `sort`, `order` (as in `GET /`).
*   **Success Response (200 OK):** Similar structure to `GET /`, containing only materials matching the criteria.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during search.

### 8. Get Material Headers (Collection)

*   **Method:** `HEAD`
*   **Path:** `/`
*   **Description:** Retrieves headers for the raw materials collection.
*   **Authentication:** Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Total-Count`: Total number of materials.
        *   `X-Resource-Type`: 'Materials'.
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized`.
    *   `500 Internal Server Error`.

### 9. Get Material Options (Collection)

*   **Method:** `OPTIONS`
*   **Path:** `/`
*   **Description:** Retrieves allowed HTTP methods for the raw materials collection endpoint.
*   **Authentication:** Not Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, POST, HEAD, OPTIONS' (Based on controller).
    *   No response body.

### 10. Get Material Headers (Individual)

*   **Method:** `HEAD`
*   **Path:** `/:id`
*   **Description:** Retrieves headers for a specific raw material.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the material.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Resource-Type`: 'Material'.
        *   `Last-Modified`: Not available (schema lacks timestamps, relies on `dateProvided`).
    *   No response body.
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`.
    *   `404 Not Found`.
    *   `500 Internal Server Error`.

### 11. Get Material Options (Individual)

*   **Method:** `OPTIONS`
*   **Path:** `/:id`
*   **Description:** Retrieves allowed HTTP methods for a specific raw material endpoint.
*   **Authentication:** Not Required.
*   **Path Parameters:**
    *   `id` (string, required): Conceptually identifies the resource type.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS' (Based on controller/route).
    *   No response body.

## Data Model (RawMaterial)

Based on `server/models/rawMaterial.js` (exports model named `rawMaterials`):

```javascript
const rawMaterialsSchema = new mongoose.Schema({
  Name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  Source: { 
    type: String, 
    required: true 
  },
  Quantity: { 
    type: Number, 
    required: true 
  },
  dateProvided: { 
    type: Date, 
    required: true 
  },
  price: { 
    type: String, // Note: Price is a String!
    required: true 
  },
  // Note: Timestamps (createdAt, updatedAt) are NOT explicitly enabled in the schema snippet
});
```

**Notes:**

*   The `_id` field (MongoDB ObjectId) is automatically generated.
*   All fields (`Name`, `Source`, `Quantity`, `dateProvided`, `price`) are required.
*   Field names use PascalCase (`Name`, `Source`, etc.).
*   The `price` field is defined as a `String`, which might be unusual. Consider changing to `Number` if appropriate.
*   Timestamps are not enabled in the provided schema. 