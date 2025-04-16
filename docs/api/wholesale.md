# Wholesale API Documentation

This document provides details about the API endpoints for managing wholesale orders.

**Base Path:** `/api/wholesale`

**Authentication:** Required for all routes via a JWT Bearer token in the `Authorization` header (`protect` middleware applied).

## Endpoints

### 1. Get All Wholesale Orders

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a paginated list of all wholesale orders. Supports populating product details.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `page` (optional, number, default: 1): Page number.
    *   `limit` (optional, number, default: 10, max: 100): Items per page.
    *   `sort` (optional, string, default: 'wholeSalerName'): Field to sort by.
    *   `order` (optional, string, default: 'asc'): Sort order ('asc' or 'desc').
    *   `populate` (optional, boolean, default: false): If true, populates the `wholeSalerProducts` array with details from the `Product` model.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "total": 35,
      "page": 1,
      "limit": 10,
      "totalPages": 4,
      "count": 10,
      "data": [
        {
          "_id": "60d5f9f3f8d2f4a2c8ab2111",
          "wholeSalerName": "Bulk Goods Inc.",
          "wholeSalerLocation": "Central Warehouse",
          "wholeSalerContact": "John Smith",
          "wholeSalerEmail": "john.smith@bulkgoods.com",
          "wholeSalerProducts": [
            "60d5f9f3f8d2f4a2c8a7b001", // Product ObjectId
            "60d5f9f3f8d2f4a2c8a7b005"  // Or populated product objects if populate=true
          ]
          // Timestamps may be present if enabled
        },
        // ... more orders
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during fetching.

### 2. Create New Wholesale Order

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new wholesale order record.
*   **Authentication:** Required.
*   **Request Body:** (Content-Type: application/json)
    *   Requires fields defined in the `wholesaleSchema`: `wholeSalerName`, `wholeSalerLocation`, `wholeSalerContact`, `wholeSalerEmail`. `wholeSalerProducts` is optional (can be added later).
    ```json
    {
      "wholeSalerName": "National Distributors",
      "wholeSalerLocation": "West Coast Hub",
      "wholeSalerContact": "Jane Doe",
      "wholeSalerEmail": "jane.d@nationaldist.com",
      "wholeSalerProducts": ["60d5f9f3f8d2f4a2c8a7b010"] // Optional initial product
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8ab2112",
        "wholeSalerName": "National Distributors",
        "wholeSalerLocation": "West Coast Hub",
        "wholeSalerContact": "Jane Doe",
        "wholeSalerEmail": "jane.d@nationaldist.com",
        "wholeSalerProducts": ["60d5f9f3f8d2f4a2c8a7b010"]
        // Timestamps may be present
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (e.g., missing required fields, validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `409 Conflict`: Order with the same `wholeSalerName` already exists (if unique constraint enforced).
    *   `500 Internal Server Error`: Server error during creation.

### 3. Get Wholesale Order By ID

*   **Method:** `GET`
*   **Path:** `/:id`
*   **Description:** Retrieves a single wholesale order by its MongoDB ID. Supports populating product details.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the order.
*   **Query Parameters:**
    *   `populate` (optional, boolean, default: false): If true, populates the `wholeSalerProducts` array.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
          "_id": "60d5f9f3f8d2f4a2c8ab2111",
          "wholeSalerName": "Bulk Goods Inc.",
          // ... other fields
          "wholeSalerProducts": [ /* Array of ObjectIds or populated Product objects */ ]
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Order with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during fetching.

### 4. Update Wholesale Order (Full Update)

*   **Method:** `PUT`
*   **Path:** `/:id`
*   **Description:** Replaces an existing wholesale order record entirely.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the order to update.
*   **Request Body:** (Content-Type: application/json)
    *   Requires all fields for the order.
    ```json
    {
      "wholeSalerName": "Bulk Goods International", // Updated
      "wholeSalerLocation": "Global Hub", // Updated
      "wholeSalerContact": "Johnathan Smith", // Updated
      "wholeSalerEmail": "jsmith@bulkgoods-intl.com", // Updated
      "wholeSalerProducts": [
            "60d5f9f3f8d2f4a2c8a7b001",
            "60d5f9f3f8d2f4a2c8a7b005",
            "60d5f9f3f8d2f4a2c8a7b020" // Added product
       ]
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { // The fully updated order object
        "_id": "60d5f9f3f8d2f4a2c8ab2111",
        "wholeSalerName": "Bulk Goods International",
        // ... all updated fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors, missing required fields).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Order with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 5. Partially Update Wholesale Order (Non-Product Fields)

*   **Method:** `PATCH`
*   **Path:** `/:id`
*   **Description:** Updates specific non-array fields of an existing order record (e.g., contact details, location). Use dedicated endpoints (`/:id/products`) for modifying the products list.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the order to update.
*   **Request Body:** (Content-Type: application/json)
    *   An object containing only the non-product fields to update.
    ```json
    {
      "wholeSalerContact": "Jonathan Smith (Manager)",
      "wholeSalerLocation": "Global Logistics Hub"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8ab2111",
        "wholeSalerName": "Bulk Goods International", // Unchanged
        "wholeSalerContact": "Jonathan Smith (Manager)", // Updated
        "wholeSalerLocation": "Global Logistics Hub", // Updated
        // ... other fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data, or if `wholeSalerProducts` is included (use dedicated endpoint).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Order with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 6. Add Product to Order

*   **Method:** `PATCH`
*   **Path:** `/:id/products`
*   **Description:** Adds a product (by ObjectId) to the `wholeSalerProducts` array of an order. Uses `$addToSet` to avoid duplicates.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the order.
*   **Request Body:** (Content-Type: application/json)
    *   Requires `productId`.
    ```json
    {
      "productId": "60d5f9f3f8d2f4a2c8a7b030"
    }
    ```
*   **Success Response (200 OK):** Returns the updated order.
    ```json
    {
      "success": true,
      "data": { /* Updated order object with the new product ID added */ }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing `productId`.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Order with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 7. Remove Product from Order

*   **Method:** `PATCH`
*   **Path:** `/:id/products/remove` (Note: Could also be implemented as DELETE `/:id/products/:productId`)
*   **Description:** Removes a product (by ObjectId) from the `wholeSalerProducts` array of an order. Uses `$pull`.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the order.
*   **Request Body:** (Content-Type: application/json)
    *   Requires `productId`.
    ```json
    {
      "productId": "60d5f9f3f8d2f4a2c8a7b005"
    }
    ```
*   **Success Response (200 OK):** Returns the updated order.
    ```json
    {
      "success": true,
      "data": { /* Updated order object with the product ID removed */ }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing `productId`.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Order with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 8. Delete Wholesale Order

*   **Method:** `DELETE`
*   **Path:** `/:id`
*   **Description:** Deletes a wholesale order record by its MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the order to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Order with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during deletion.

### 9. Search Wholesale Orders

*   **Method:** `GET`
*   **Path:** `/search`
*   **Description:** Searches for wholesale orders based on criteria. Supports populating product details.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `wholeSalerName` (optional, string): Partial name (case-insensitive).
    *   `wholeSalerLocation` (optional, string): Partial location (case-insensitive).
    *   `wholeSalerEmail` (optional, string): Partial email (case-insensitive).
    *   `productId` (optional, string): Find orders containing this specific product ObjectId.
    *   `populate` (optional, boolean, default: false): If true, populates the `wholeSalerProducts` array.
    *   `page`, `limit`, `sort`, `order` (as in `GET /`).
*   **Success Response (200 OK):** Similar structure to `GET /`, containing only orders matching the criteria.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during search.

### 10. Get Wholesale Headers (Collection)

*   **Method:** `HEAD`
*   **Path:** `/`
*   **Description:** Retrieves headers for the wholesale order collection.
*   **Authentication:** Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Total-Count`: Total number of orders.
        *   `X-Resource-Type`: 'WholesaleOrders'.
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized`.
    *   `500 Internal Server Error`.

### 11. Get Wholesale Options (Collection)

*   **Method:** `OPTIONS`
*   **Path:** `/`
*   **Description:** Retrieves allowed HTTP methods for the wholesale order collection endpoint.
*   **Authentication:** Not Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, POST, HEAD, OPTIONS, PATCH' (Based on controller).
    *   No response body.

### 12. Get Wholesale Headers (Individual)

*   **Method:** `HEAD`
*   **Path:** `/:id`
*   **Description:** Retrieves headers for a specific wholesale order.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the order.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Resource-Type`: 'WholesaleOrder'.
        *   `Last-Modified`: Not available (schema lacks timestamps).
    *   No response body.
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`.
    *   `404 Not Found`.
    *   `500 Internal Server Error`.

### 13. Get Wholesale Options (Individual)

*   **Method:** `OPTIONS`
*   **Path:** `/:id`
*   **Description:** Retrieves allowed HTTP methods for a specific wholesale order endpoint.
*   **Authentication:** Not Required.
*   **Path Parameters:**
    *   `id` (string, required): Conceptually identifies the resource type.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS'
    *   No response body.

## Data Model (WholesaleOrder)

Based on `server/models/wholesaleOrder.js` (exports model named `wholesale`):

```javascript
const wholesaleSchema = new mongoose.Schema({
  wholeSalerName: { 
    type: String, 
    required: true, 
    unique: true // Assumed unique based on potential 409 error
  },
  wholeSalerLocation: { 
    type: String, 
    required: true 
  },
  wholeSalerContact: { 
    type: String, 
    required: true 
  },
  wholeSalerEmail: { 
    type: String, 
    required: true 
  },
  wholeSalerProducts: [
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product" // References the Product model
    }
  ],
  // Note: Timestamps (createdAt, updatedAt) are NOT explicitly enabled in the schema snippet
});
```

**Notes:**

*   The `_id` field (MongoDB ObjectId) is automatically generated.
*   `wholeSalerName`, `wholeSalerLocation`, `wholeSalerContact`, `wholeSalerEmail` are required.
*   `wholeSalerProducts` is an array of ObjectIds referencing documents in the `Product` collection.
*   Timestamps are not enabled in the provided schema. 