# Chemicals API Documentation

This document provides details about the API endpoints available for managing chemical compound resources.

**Base Path:** `/api/chemicals`

**Authentication:** All routes require authentication via a JWT Bearer token in the `Authorization` header, except for `OPTIONS` requests.

## Endpoints

### 1. Get All Chemical Compounds

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Retrieves a paginated list of all chemical compounds. Supports sorting and limiting results.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `page` (optional, number, default: 1): Page number for pagination.
    *   `limit` (optional, number, default: 10, max: 100): Number of items per page.
    *   `sort` (optional, string, default: 'name'): Field to sort by (e.g., 'name', 'molecularWeight').
    *   `order` (optional, string, default: 'asc'): Sort order ('asc' or 'desc').
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "count": 10,
      "data": [
        {
          "_id": "60d5f9f3f8d2f4a2c8a8c1a1",
          "name": "Ethanol",
          "molecularFormula": "C2H5OH",
          "molecularWeight": 46.07,
          "molecularDensity": 0.789,
          // ... other chemical fields
        },
        // ... more chemicals
      ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during fetching.

### 2. Create New Chemical Compound

*   **Method:** `POST`
*   **Path:** `/`
*   **Description:** Creates a new chemical compound record.
*   **Authentication:** Required.
*   **Request Body:** (Content-Type: application/json)
    *   Requires fields defined in the ChemicalCompound model (see Data Model section). Example fields based on controller: `name`, `molecularFormula`, `molecularWeight`, `molecularDensity`, `color`, etc.
    ```json
    {
      "name": "Acetone",
      "molecularFormula": "C3H6O",
      "molecularWeight": 58.08,
      "molecularDensity": 0.784,
      "boilingPoint": 56,
      "color": "Colorless",
      "toxicity": "Low"
      // ... other required/optional fields
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8c1a2",
        "name": "Acetone",
        "molecularFormula": "C3H6O",
        // ... other chemical fields including _id and timestamps
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (e.g., missing required fields, validation errors, name already exists).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during creation.

### 3. Get Chemical Compound By ID

*   **Method:** `GET`
*   **Path:** `/:id`
*   **Description:** Retrieves a single chemical compound by its unique MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the chemical.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8c1a1",
        "name": "Ethanol",
        // ... all chemical fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Chemical with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during fetching.

### 4. Update Chemical Compound (Full Update)

*   **Method:** `PUT`
*   **Path:** `/:id`
*   **Description:** Replaces an existing chemical compound record entirely with the provided data.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the chemical to update.
*   **Request Body:** (Content-Type: application/json)
    *   Requires all fields for the chemical for a full replacement.
    ```json
    {
      "name": "Ethanol (Anhydrous)", // Updated field
      "molecularFormula": "C2H5OH",
      "molecularWeight": 46.07,
      "molecularDensity": 0.789,
      "boilingPoint": 78.37,
      "meltingPoint": -114.1,
      "color": "Clear", // Updated field
      "toxicity": "Moderate", // Updated field
      "bioavailability": "High"
      // ... other fields
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8c1a1",
        "name": "Ethanol (Anhydrous)",
        // ... all updated chemical fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors, missing required fields).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Chemical with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 5. Partially Update Chemical Compound

*   **Method:** `PATCH`
*   **Path:** `/:id`
*   **Description:** Updates specific fields of an existing chemical compound record.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the chemical to update.
*   **Request Body:** (Content-Type: application/json)
    *   An object containing only the fields to be updated.
    ```json
    {
      "boilingPoint": 78.5,
      "toxicity": "Low-Moderate"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9f3f8d2f4a2c8a8c1a1",
        "name": "Ethanol (Anhydrous)", // Unchanged field
        "boilingPoint": 78.5, // Updated field
        "toxicity": "Low-Moderate", // Updated field
        // ... other chemical fields
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (validation errors).
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Chemical with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during update.

### 6. Delete Chemical Compound

*   **Method:** `DELETE`
*   **Path:** `/:id`
*   **Description:** Deletes a chemical compound record by its unique MongoDB ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the chemical to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Chemical compound deleted successfully",
      "data": {}
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`: Chemical with the specified ID does not exist.
    *   `500 Internal Server Error`: Server error during deletion.

### 7. Search Chemical Compounds

*   **Method:** `GET`
*   **Path:** `/search`
*   **Description:** Searches for chemical compounds based on various criteria (case-insensitive where applicable).
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `name` (optional, string): Partial or full name to search for.
    *   `molecularFormula` (optional, string): Exact or partial formula (regex used, case-sensitive match might be better).
    *   `color` (optional, string): Color to search for (case-insensitive).
    *   `toxicity` (optional, string): Toxicity level.
    *   `page` (optional, number, default: 1): Page number.
    *   `limit` (optional, number, default: 10, max: 100): Results per page.
    *   `sort` (optional, string, default: 'name'): Field to sort by.
    *   `order` (optional, string, default: 'asc'): Sort order.
*   **Success Response (200 OK):** Similar structure to `GET /`, containing only chemicals matching the criteria.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during search.

### 8. Get Chemical Headers (Collection)

*   **Method:** `HEAD`
*   **Path:** `/`
*   **Description:** Retrieves headers for the chemical collection (e.g., total count).
*   **Authentication:** Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Total-Count`: Total number of chemicals.
        *   `X-Resource-Type`: 'ChemicalCompounds'.
    *   No response body.
*   **Error Responses:**
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`.

### 9. Get Chemical Options (Collection)

*   **Method:** `OPTIONS`
*   **Path:** `/`
*   **Description:** Retrieves allowed HTTP methods for the chemical collection endpoint.
*   **Authentication:** Not Required.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, POST, HEAD, OPTIONS' (Based on controller/route).
    *   No response body.

### 10. Get Chemical Headers (Individual)

*   **Method:** `HEAD`
*   **Path:** `/:id`
*   **Description:** Retrieves headers for a specific chemical (e.g., last modified).
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (string, required): The MongoDB ObjectId of the chemical.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `X-Resource-Type`: 'ChemicalCompound'.
        *   `Last-Modified`: UTC string of the last update time (if timestamps enabled in model, which they are not explicitly in the provided snippet).
    *   No response body.
*   **Error Responses:**
    *   `400 Bad Request`: Invalid ID format.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `404 Not Found`.
    *   `500 Internal Server Error`.

### 11. Get Chemical Options (Individual)

*   **Method:** `OPTIONS`
*   **Path:** `/:id`
*   **Description:** Retrieves allowed HTTP methods for a specific chemical endpoint.
*   **Authentication:** Not Required.
*   **Path Parameters:**
    *   `id` (string, required): Conceptually identifies the resource type.
*   **Success Response (200 OK):**
    *   Headers include:
        *   `Allow`: 'GET, PUT, DELETE, PATCH, HEAD, OPTIONS'
    *   No response body.

## Data Model (ChemicalCompound)

Based on `server/models/chemicalCompound.js`:

```javascript
const ChemicalCompoundSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  molecularFormula: { 
    type: String, 
    required: true 
  },
  molecularWeight: { 
    type: Number, 
    required: true 
  },
  molecularDensity: { 
    type: Number, 
    required: true 
  },
  boilingPoint: { 
    type: Number 
  }, // Optional
  meltingPoint: { 
    type: Number 
  }, // Optional
  color: { 
    type: String 
  }, // Optional
  toxicity: { 
    type: String 
  }, // Optional
  bioavailability: { 
    type: String 
  }, // Optional
  // Note: Timestamps (createdAt, updatedAt) are NOT explicitly enabled in the schema snippet
});
```

**Notes:**

*   The `_id` field (MongoDB ObjectId) is automatically generated.
*   Fields like `name`, `molecularFormula`, `molecularWeight`, `molecularDensity` are required.
*   Other fields like `boilingPoint`, `meltingPoint`, `color`, `toxicity`, `bioavailability` are optional. 