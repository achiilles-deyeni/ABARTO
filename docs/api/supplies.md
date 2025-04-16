# Industrial Supplies API Documentation

**Warning:** There appears to be a mismatch between the `supply` route/controller naming and the controller's implementation, which currently interacts with the `Supplier` model instead of the expected `IndustrialSupply` model. This documentation assumes the API is *intended* to manage `IndustrialSupply` records based on the file/route naming and the `IndustrialSupply` model definition.

This document provides details about the API endpoints intended for managing industrial supply resources.

**Base Path:** `/api/supplies`

**Authentication:** Required for most routes via a JWT Bearer token (`protect` middleware applied in route file). Bulk create, search, and potentially GET routes might have different requirements depending on intended use.

## Endpoints

### 1. Get All Industrial Supplies

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a paginated list of all industrial supplies.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `page` (optional, number, default: 1): Page number.
    *   `limit` (optional, number, default: 10, max: 100): Items per page.
    *   `sort` (optional, string, default: 'name'): Field to sort by (e.g., 'name', 'category', 'lastRestocked').
    *   `order` (optional, string, default: 'asc'): Sort order ('asc' or 'desc').
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "total": 200,
      "page": 1,
      "limit": 10,
      "totalPages": 20,
      "count": 10,
      "data": [
        {
          "_id": "60d5f9f3f8d2f4a2c8aa1001",
          "name": "Industrial Solvent A",
          "supplier": "ChemSupply Co.",
          "description": "General purpose cleaning solvent.",
          "quantity": 150,
          "unit": "liter",
          "pricePerUnit": 12.50,
          "category": "Solvents",
          "lastRestocked": "2023-09-15T00:00:00.000Z",
          "createdAt": "2023-01-10T00:00:00.000Z",
          "updatedAt": "2023-09-15T00:00:00.000Z"
        },
        // ... more supplies
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during fetching.

### 2. Create New Industrial Supply

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new industrial supply record.
*   **Authentication:** Required.
*   **Request Body:** (Content-Type: application/json)
    *   Requires fields defined in the `IndustrialSupplySchema`: `name`, `supplier`, `quantity`, `unit`, `pricePerUnit`.
    ```json
    {
      "name": "Heavy Duty Lubricant",
      "supplier": "Mechanics World",
      "description": "High-pressure lubricant for machinery.",
      "quantity": 50,
      "unit": "can",
      "pricePerUnit": 8.75,
      "category": "Lubricants",
      "lastRestocked": "2023-10-20T00:00:00.000Z"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8aa1002",
        "name": "Heavy Duty Lubricant",
        "supplier": "Mechanics World",
        "quantity": 50,
        "unit": "can",
        "pricePerUnit": 8.75,
        "category": "Lubricants",
        "lastRestocked": "2023-10-20T00:00:00.000Z",
        "createdAt": "2023-10-27T16:00:00.000Z",
        "updatedAt": "2023-10-27T16:00:00.000Z"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (e.g., missing required fields, validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `409 Conflict`: Supply with the same `name` already exists (if unique constraint enforced).
    *   `500 Internal Server Error`: Server error during creation.

### 3. Bulk Create Industrial Supplies

*   **Method:** `POST`
*   **Path:** `/bulk`
*   **Description:** Creates multiple industrial supply records in a single request.
*   **Authentication:** Required.
*   **Request Body:** (Content-Type: application/json) An array of supply objects.
    ```json
    [
      {
        "name": "Cutting Fluid XF",
        "supplier": "Tooling Inc.",
        "quantity": 100,
        "unit": "liter",
        "pricePerUnit": 22.00,
        "category": "Fluids"
      },
      {
        "name": "Industrial Adhesive G5",
        "supplier": "ChemSupply Co.",
        "quantity": 200,
        "unit": "tube",
        "pricePerUnit": 5.50,
        "category": "Adhesives"
      }
    ]
    ```
*   **Success Response (201 Created):** (Based on typical bulk implementations)
    ```json
    {
      "success": true,
      "message": "Bulk supply creation processed.",
      "results": {
        "successful": 98, // Count of successfully created supplies
        "failed": 2, // Count of failures
        "errors": [
            { "index": 5, "error": "Validation failed: name is required", "data": { /* attempted data */ } },
            { "index": 42, "error": "Duplicate key error: name already exists", "data": { /* attempted data */ } }
        ] // Optional: Details on failures
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data format (not an array, empty array) or validation errors within the array.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during bulk creation.

### 4. Get Industrial Supply By ID

*   **Method:** `GET`
*   **Path:** `/:id`
*   **Description:** Retrieves a single industrial supply item by its MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the supply item.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
          "_id": "60d5f9f3f8d2f4a2c8aa1001",
          "name": "Industrial Solvent A",
          // ... all supply fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Supply item with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during fetching.

### 5. Update Industrial Supply (Full Update)

*   **Method:** `PUT`
*   **Path:** `/:id`
*   **Description:** Replaces an existing industrial supply record entirely.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the item to update.
*   **Request Body:** (Content-Type: application/json)
    *   Requires all fields for the supply item for a full replacement.
    ```json
    {
      "name": "Industrial Solvent A (New Formula)",
      "supplier": "ChemSupply Co.",
      "description": "Improved general purpose cleaning solvent.",
      "quantity": 120,
      "unit": "liter",
      "pricePerUnit": 13.00,
      "category": "Solvents",
      "lastRestocked": "2023-10-25T00:00:00.000Z"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { // The fully updated supply object
        "_id": "60d5f9f3f8d2f4a2c8aa1001",
        "name": "Industrial Solvent A (New Formula)",
        // ... all updated fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors, missing required fields).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Item with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 6. Partially Update Industrial Supply

*   **Method:** `PATCH`
*   **Path:** `/:id`
*   **Description:** Updates specific fields of an existing industrial supply record.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the item to update.
*   **Request Body:** (Content-Type: application/json)
    *   An object containing only the fields to be updated.
    ```json
    {
      "quantity": 115,
      "pricePerUnit": 13.25,
      "lastRestocked": "2023-10-27T00:00:00.000Z"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8aa1001",
        "name": "Industrial Solvent A (New Formula)", // Unchanged
        "quantity": 115, // Updated
        "pricePerUnit": 13.25, // Updated
        "lastRestocked": "2023-10-27T00:00:00.000Z", // Updated
        // ... other fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Item with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 7. Delete Industrial Supply

*   **Method:** `DELETE`
*   **Path:** `/:id`
*   **Description:** Deletes an industrial supply record by its MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the item to delete.
*   **Success Response (200 OK or 204 No Content):**
    ```json
    // Example for 200 OK
    {
      "success": true,
      "message": "Supply deleted successfully",
      "data": {}
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Item with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during deletion.

### 8. Search Industrial Supplies

*   **Method:** `GET`
*   **Path:** `/search`
*   **Description:** Searches for industrial supplies based on criteria.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `name` (optional, string): Partial name (case-insensitive).
    *   `supplier` (optional, string): Partial supplier name (case-insensitive).
    *   `category` (optional, string): Partial category name (case-insensitive).
    *   `minQuantity` (optional, number): Minimum quantity.
    *   `page`, `limit`, `sort`, `order` (as in `GET /`).
*   **Success Response (200 OK):** Similar structure to `GET /`, containing only supplies matching the criteria.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during search.

### 9. Get Supply Headers (Collection)

*   **Method:** `HEAD`
*   **Path:** `/`
*   **Description:** Retrieves headers for the industrial supply collection.
*   **Authentication:** Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Total-Count`: Total number of supplies.
        *   `X-Resource-Type`: 'IndustrialSupplies' (Assumed based on model).
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized`.
    *   `500 Internal Server Error`.

### 10. Get Supply Options (Collection)

*   **Method:** `OPTIONS`
*   **Path:** `/`
*   **Description:** Retrieves allowed HTTP methods for the supply collection endpoint.
*   **Authentication:** Not Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, POST, HEAD, OPTIONS' (Based on route file for `/`).
    *   No response body.

### 11. Get Supply Headers (Individual)

*   **Method:** `HEAD`
*   **Path:** `/:id`
*   **Description:** Retrieves headers for a specific industrial supply item.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the item.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Resource-Type`: 'IndustrialSupply'.
        *   `Last-Modified`: Based on `updatedAt` or `createdAt` timestamps.
    *   No response body.
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`.
    *   `404 Not Found`.
    *   `500 Internal Server Error`.

### 12. Get Supply Options (Individual)

*   **Method:** `OPTIONS`
*   **Path:** `/:id`
*   **Description:** Retrieves allowed HTTP methods for a specific supply endpoint.
*   **Authentication:** Not Required.
*   **Path Parameters:**
    *   `id` (string, required): Conceptually identifies the resource type.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS' (Based on route file for `/:id`).
    *   No response body.

## Data Model (IndustrialSupply)

Based on `server/models/industrialSupply.js`:

```javascript
const IndustrialSupplySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    index: true, 
    unique: true 
  },
  supplier: { // Name of the supplier
    type: String, 
    required: true, 
    index: true 
  },
  description: { 
    type: String 
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  unit: { // e.g., kg, liter, unit, box
    type: String, 
    required: true 
  }, 
  pricePerUnit: { 
    type: Number, 
    required: true 
  },
  category: { // e.g., Solvents, Lubricants, Adhesives
    type: String, 
    index: true 
  }, 
  lastRestocked: { 
    type: Date 
  },
}, {
  timestamps: true // Adds createdAt and updatedAt
});
```

**Notes:**

*   The `_id` field (MongoDB ObjectId) is automatically generated.
*   `name`, `supplier`, `quantity`, `unit`, `pricePerUnit` are required.
*   `quantity` defaults to 0.
*   `description`, `category`, `lastRestocked` are optional.
*   Timestamps (`createdAt`, `updatedAt`) are automatically managed. 