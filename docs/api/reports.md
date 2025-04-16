# Reports API Documentation

This document provides details about the API endpoints for managing report configurations and potentially generating/retrieving reports.

**Base Path:** `/api/reports`

**Authentication:** Required for all routes via a JWT Bearer token in the `Authorization` header (`protect` middleware applied).

## Endpoints

### 1. Get All Reports

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a paginated list of report configurations or metadata.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `page` (optional, number, default: 1): Page number.
    *   `limit` (optional, number, default: 10, max: 100): Items per page.
    *   `sort` (optional, string, default: 'generatedAt'): Field to sort by (e.g., 'generatedAt', 'reportName', 'type').
    *   `order` (optional, string, default: 'desc'): Sort order ('asc' or 'desc').
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3,
      "count": 10,
      "data": [
        {
          "_id": "60d5f9f3f8d2f4a2c8a8f5e1",
          "reportName": "Monthly Inventory Summary",
          "type": "inventory",
          "generatedAt": "2023-10-01T08:00:00.000Z",
          "parameters": {
            "month": "September",
            "year": 2023
          },
          "filePath": "/reports/inventory/monthly_sept_2023.pdf", // Optional
          "createdAt": "2023-10-01T08:00:05.000Z",
          "updatedAt": "2023-10-01T08:00:05.000Z"
        },
        // ... more report metadata objects
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during fetching.

### 2. Create Report (or Trigger Generation)

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new report configuration record. Depending on the implementation, this might also trigger the generation of the actual report file.
*   **Authentication:** Required.
*   **Request Body:** (Content-Type: application/json)
    *   Requires `reportName` and `type`. `parameters` is optional.
    ```json
    {
      "reportName": "Q4 Sales Report",
      "type": "sales",
      "parameters": {
        "startDate": "2023-10-01",
        "endDate": "2023-12-31",
        "region": "North America"
      }
    }
    ```
*   **Success Response (201 Created):** Returns the created report metadata object.
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8f5e2",
        "reportName": "Q4 Sales Report",
        "type": "sales",
        "generatedAt": "2023-10-27T12:00:00.000Z", // Or generation time
        "parameters": {
           "startDate": "2023-10-01",
           "endDate": "2023-12-31",
           "region": "North America"
        },
        "filePath": null, // May be updated later by a generation process
        "createdAt": "2023-10-27T12:00:00.000Z",
        "updatedAt": "2023-10-27T12:00:00.000Z"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing required fields (`reportName`, `type`) or validation errors.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during creation/generation trigger.

### 3. Get Report By ID

*   **Method:** `GET`
*   **Path:** `/:id`
*   **Description:** Retrieves a specific report configuration/metadata by its MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the report.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
          "_id": "60d5f9f3f8d2f4a2c8a8f5e1",
          "reportName": "Monthly Inventory Summary",
          "type": "inventory",
          // ... other fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Report with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during fetching.

### 4. Update Report (Full Update)

*   **Method:** `PUT`
*   **Path:** `/:id`
*   **Description:** Replaces an existing report configuration entirely.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the report to update.
*   **Request Body:** (Content-Type: application/json)
    *   Requires all fields for the report configuration.
    ```json
    {
      "reportName": "Monthly Inventory Summary - Updated", // Updated
      "type": "inventory",
      "generatedAt": "2023-10-01T09:00:00.000Z", // Update generation time?
      "parameters": {
        "month": "September",
        "year": 2023,
        "includeZeroStock": true // Added parameter
      },
      "filePath": "/reports/inventory/monthly_sept_2023_v2.pdf" // Updated path
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { // The fully updated report object
        "_id": "60d5f9f3f8d2f4a2c8a8f5e1",
        "reportName": "Monthly Inventory Summary - Updated",
        // ... all updated fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors, missing required fields).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Report with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 5. Partially Update Report

*   **Method:** `PATCH`
*   **Path:** `/:id`
*   **Description:** Updates specific fields of an existing report configuration.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the report to update.
*   **Request Body:** (Content-Type: application/json)
    *   An object containing only the fields to be updated.
    ```json
    {
      "filePath": "/reports/final/inventory_sept_2023.pdf",
      "parameters.status": "finalized" // Example of updating a nested parameter
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8f5e1",
        "reportName": "Monthly Inventory Summary - Updated", // Unchanged
        "filePath": "/reports/final/inventory_sept_2023.pdf", // Updated
        "parameters": {
            "month": "September",
            "year": 2023,
            "includeZeroStock": true,
            "status": "finalized" // Updated nested field
         },
        // ... other fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Report with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 6. Delete Report

*   **Method:** `DELETE`
*   **Path:** `/:id`
*   **Description:** Deletes a report configuration/metadata record.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the report to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Report deleted successfully",
      "data": {}
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Report with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during deletion.

### 7. Search Reports

*   **Method:** `GET`
*   **Path:** `/search`
*   **Description:** Searches for report configurations based on criteria.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `reportName` (optional, string): Partial name (case-insensitive).
    *   `type` (optional, string): Report type (exact or partial, case-insensitive).
    *   `startDate` (optional, string Date): Minimum `generatedAt` date (e.g., YYYY-MM-DD).
    *   `endDate` (optional, string Date): Maximum `generatedAt` date (e.g., YYYY-MM-DD).
    *   Can potentially search by `parameters` sub-fields (implementation dependent).
    *   `page`, `limit`, `sort`, `order` (as in `GET /`).
*   **Success Response (200 OK):** Similar structure to `GET /`, containing only reports matching the criteria.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during search.

### 8. Get Product Price Statistics (Aggregation Example)

*   **Method:** `GET`
*   **Path:** `/stats/product-price`
*   **Description:** Retrieves aggregated statistics about product prices (average, min, max, count).
*   **Authentication:** Required.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "totalProducts": 150,
        "averagePrice": 45.75,
        "minPrice": 5.99,
        "maxPrice": 250.00
      }
    }
    // Or if no products:
    // {
    //   "success": true,
    //   "message": "No products found to calculate stats.",
    //   "data": {
    //     "totalProducts": 0,
    //     "averagePrice": 0,
    //     "minPrice": 0,
    //     "maxPrice": 0
    //   }
    // }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during aggregation.

### 9. Get Report Headers (Collection)

*   **Method:** `HEAD`
*   **Path:** `/`
*   **Description:** Retrieves headers for the report collection.
*   **Authentication:** Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Total-Count`: Total number of reports.
        *   `X-Resource-Type`: 'Reports'.
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized`.
    *   `500 Internal Server Error`.

### 10. Get Report Options (Collection)

*   **Method:** `OPTIONS`
*   **Path:** `/`
*   **Description:** Retrieves allowed HTTP methods for the report collection endpoint.
*   **Authentication:** Not Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, POST, HEAD, OPTIONS' (Based on controller).
    *   No response body.

### 11. Get Report Headers (Individual)

*   **Method:** `HEAD`
*   **Path:** `/:id`
*   **Description:** Retrieves headers for a specific report.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the report.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Resource-Type`: 'Report'.
        *   `Last-Modified`: UTC string of the last update time (`updatedAt`, `generatedAt`, or `createdAt`).
    *   No response body.
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`.
    *   `404 Not Found`.
    *   `500 Internal Server Error`.

### 12. Get Report Options (Individual)

*   **Method:** `OPTIONS`
*   **Path:** `/:id`
*   **Description:** Retrieves allowed HTTP methods for a specific report endpoint.
*   **Authentication:** Not Required.
*   **Path Parameters:**
    *   `id` (string, required): Conceptually identifies the resource type.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS'
    *   No response body.

## Data Model (Report)

Based on `server/models/report.js`:

```javascript
const reportSchema = new Schema({
    reportName: {
        type: String,
        required: [true, 'Report name is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Report type is required'],
        enum: ['inventory', 'sales', 'safety', 'security', 'employee', 'custom'], // Example types
        trim: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },
    parameters: { // Stores parameters used for generation
        type: Map,
        of: Schema.Types.Mixed // Allows storing various parameter types (key-value)
    },
    filePath: { // Optional path to a stored report file (e.g., PDF, CSV)
        type: String,
        trim: true
    },
    // Optional: Could store the actual report data if small,
    // data: Schema.Types.Mixed
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});
```

**Notes:**

*   The `_id` field (MongoDB ObjectId) is automatically generated.
*   `reportName` and `type` are required.
*   `type` has an enforced list of allowed values (enum).
*   `generatedAt` defaults to the time the record is created.
*   `parameters` uses a `Map` to store flexible key-value pairs used for the report generation.
*   `filePath` is an optional string to link to a generated file.
*   Timestamps (`createdAt`, `updatedAt`) are automatically managed. 