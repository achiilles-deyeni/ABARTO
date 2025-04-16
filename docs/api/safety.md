# Safety API Documentation

This document provides details about the API endpoints for managing safety equipment records.

**Base Path:** `/api/safety`

**Authentication:** Required for all routes via a JWT Bearer token in the `Authorization` header (`protect` middleware applied).

## Endpoints

### 1. Get All Safety Items

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a paginated list of all safety equipment items.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `page` (optional, number, default: 1): Page number.
    *   `limit` (optional, number, default: 10, max: 100): Items per page.
    *   `sort` (optional, string, default: 'EquipmentName'): Field to sort by (e.g., 'EquipmentName', 'EquipmentType'). Note: Model uses PascalCase field names.
    *   `order` (optional, string, default: 'asc'): Sort order ('asc' or 'desc').
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "total": 40,
      "page": 1,
      "limit": 10,
      "totalPages": 4,
      "count": 10,
      "data": [
        {
          "_id": "60d5f9f3f8d2f4a2c8a9a6f1",
          "EquipmentName": "Fire Extinguisher A-10",
          "EquipmentType": "ABC Dry Chemical",
          "EquipmentCondition": "Good",
          "EquipmentLocation": "Workshop Area 1",
          "EquipmentQuantity": 1,
          "EquipmentDateProvided": "2023-01-15T00:00:00.000Z"
          // Timestamps may be present if enabled
        },
        // ... more safety items
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during fetching.

### 2. Create New Safety Item

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new safety equipment record.
*   **Authentication:** Required.
*   **Request Body:** (Content-Type: application/json)
    *   Requires fields defined in the `safetySchema`: `EquipmentName`, `EquipmentType`, `EquipmentCondition`, `EquipmentLocation`, `EquipmentQuantity`, `EquipmentDateProvided`.
    ```json
    {
      "EquipmentName": "Safety Goggles - Model SG-5",
      "EquipmentType": "Eye Protection",
      "EquipmentCondition": "New",
      "EquipmentLocation": "Storage Cabinet B",
      "EquipmentQuantity": 50,
      "EquipmentDateProvided": "2023-10-25T00:00:00.000Z"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a9a6f2",
        "EquipmentName": "Safety Goggles - Model SG-5",
        "EquipmentType": "Eye Protection",
        "EquipmentCondition": "New",
        "EquipmentLocation": "Storage Cabinet B",
        "EquipmentQuantity": 50,
        "EquipmentDateProvided": "2023-10-25T00:00:00.000Z"
        // Timestamps may be present
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (e.g., missing required fields, validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `409 Conflict`: Item with the same `EquipmentName` already exists (if unique constraint enforced).
    *   `500 Internal Server Error`: Server error during creation.

### 3. Get Safety Item By ID

*   **Method:** `GET`
*   **Path:** `/:id`
*   **Description:** Retrieves a single safety equipment item by its MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the safety item.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
          "_id": "60d5f9f3f8d2f4a2c8a9a6f1",
          "EquipmentName": "Fire Extinguisher A-10",
          // ... all fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Item with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during fetching.

### 4. Update Safety Item (Full Update)

*   **Method:** `PUT`
*   **Path:** `/:id`
*   **Description:** Replaces an existing safety equipment record entirely.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the item to update.
*   **Request Body:** (Content-Type: application/json)
    *   Requires all fields for the safety item.
    ```json
    {
      "EquipmentName": "Fire Extinguisher A-10 (Serviced)",
      "EquipmentType": "ABC Dry Chemical",
      "EquipmentCondition": "Serviced", // Updated
      "EquipmentLocation": "Workshop Area 1 - Mount A", // Updated
      "EquipmentQuantity": 1,
      "EquipmentDateProvided": "2023-07-01T00:00:00.000Z" // Updated inspection/service date
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { // The fully updated item object
        "_id": "60d5f9f3f8d2f4a2c8a9a6f1",
        "EquipmentName": "Fire Extinguisher A-10 (Serviced)",
        "EquipmentCondition": "Serviced",
        // ... all updated fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors, missing required fields).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Item with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 5. Partially Update Safety Item

*   **Method:** `PATCH`
*   **Path:** `/:id`
*   **Description:** Updates specific fields of an existing safety equipment record.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the item to update.
*   **Request Body:** (Content-Type: application/json)
    *   An object containing only the fields to be updated.
    ```json
    {
      "EquipmentCondition": "Needs Inspection",
      "EquipmentLocation": "Quarantine Area"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a9a6f1",
        "EquipmentName": "Fire Extinguisher A-10 (Serviced)", // Unchanged
        "EquipmentCondition": "Needs Inspection", // Updated
        "EquipmentLocation": "Quarantine Area", // Updated
        // ... other fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Item with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 6. Delete Safety Item

*   **Method:** `DELETE`
*   **Path:** `/:id`
*   **Description:** Deletes a safety equipment record by its MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the item to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Safety equipment deleted successfully",
      "data": {}
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Item with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during deletion.

### 7. Search Safety Items

*   **Method:** `GET`
*   **Path:** `/search`
*   **Description:** Searches for safety equipment based on criteria.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `EquipmentName` (optional, string): Partial name (case-insensitive).
    *   `EquipmentType` (optional, string): Partial type (case-insensitive).
    *   `EquipmentCondition` (optional, string): Exact condition.
    *   `EquipmentLocation` (optional, string): Partial location (case-insensitive).
    *   `inspectionDueBefore` (optional, string Date): Find items needing inspection before this date (based on controller logic, uses `nextInspectionDate` which is not in model snippet).
    *   `page`, `limit`, `sort`, `order` (as in `GET /`).
*   **Success Response (200 OK):** Similar structure to `GET /`, containing only items matching the criteria.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during search.

### 8. Get Safety Headers (Collection)

*   **Method:** `HEAD`
*   **Path:** `/`
*   **Description:** Retrieves headers for the safety equipment collection.
*   **Authentication:** Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Total-Count`: Total number of safety items.
        *   `X-Resource-Type`: 'SafetyEquipment'.
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized`.
    *   `500 Internal Server Error`.

### 9. Get Safety Options (Collection)

*   **Method:** `OPTIONS`
*   **Path:** `/`
*   **Description:** Retrieves allowed HTTP methods for the safety equipment collection endpoint.
*   **Authentication:** Not Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, POST, HEAD, OPTIONS' (Based on controller).
    *   No response body.

### 10. Get Safety Headers (Individual)

*   **Method:** `HEAD`
*   **Path:** `/:id`
*   **Description:** Retrieves headers for a specific safety equipment item.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the item.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Resource-Type`: 'SafetyEquipment'.
        *   `Last-Modified`: Based on `EquipmentDateProvided` or potentially timestamps if added.
    *   No response body.
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`.
    *   `404 Not Found`.
    *   `500 Internal Server Error`.

### 11. Get Safety Options (Individual)

*   **Method:** `OPTIONS`
*   **Path:** `/:id`
*   **Description:** Retrieves allowed HTTP methods for a specific safety equipment endpoint.
*   **Authentication:** Not Required.
*   **Path Parameters:**
    *   `id` (string, required): Conceptually identifies the resource type.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS'
    *   No response body.

## Data Model (SafetyEquipment)

Based on `server/models/safetyEquipment.js` (exports model named `safety`):

```javascript
const safetySchema = new mongoose.Schema({
  EquipmentName: { 
    type: String, 
    required: true, 
    unique: true 
  },
  EquipmentType: { 
    type: String, 
    required: true 
  },
  EquipmentCondition: { 
    type: String, 
    required: true 
  },
  EquipmentLocation: { 
    type: String, 
    required: true 
  },
  EquipmentQuantity: { 
    type: Number, 
    required: true 
  },
  EquipmentDateProvided: { // Or maybe LastInspectionDate?
    type: Date, 
    required: true 
  },
  // Note: Timestamps (createdAt, updatedAt) are NOT explicitly enabled in the schema snippet
  // Note: Controller search logic uses 'nextInspectionDate' which is not in this model snippet.
});
```

**Notes:**

*   The `_id` field (MongoDB ObjectId) is automatically generated.
*   All fields (`EquipmentName`, `EquipmentType`, etc.) are required.
*   Field names use PascalCase.
*   There's a potential mismatch between the model provided (lacks `nextInspectionDate`) and the controller's search logic (uses `nextInspectionDate` and `inspectionDueBefore` query param). The documentation reflects the controller logic where possible.
*   Timestamps are not enabled in the provided schema. 