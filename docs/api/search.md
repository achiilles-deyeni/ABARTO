# Global Search API Documentation

This document provides details about the global search API endpoint.

**Base Path:** `/api/search`

**Authentication:** Required for all routes via a JWT Bearer token in the `Authorization` header (`protect` middleware applied).

## Endpoints

### 1. Global Search

*   **Method:** `GET`
*   **Path:** `/`
*   **Description:** Performs a case-insensitive search across multiple collections based on a query string. Returns results grouped by type.
*   **Authentication:** Required.
*   **Query Parameters:**
    *   `q` (string, **required**): The search term to look for.
    *   `page` (optional, number, default: 1): Page number for pagination (applies independently to each result type).
    *   `limit` (optional, number, default: 10): Maximum number of results *per type* to return on the page.
*   **Searched Collections and Fields:**
    *   **Products:** `name`, `description`, `category`, `sku`
    *   **Employees:** `firstName`, `lastName`, `email`, `department`, `position`
    *   **Industrial Supplies:** `name`, `supplier`, `description`, `category`
    *   **Raw Materials:** `Name`, `Source` (Note: PascalCase)
    *   **Chemicals:** `name`, `molecularFormula`, `color`, `toxicity`
    *   **Machinery Parts:** `name`, `type`, `description`
    *   **Wholesale Orders:** `wholeSalerName`, `wholeSalerLocation`, `wholeSalerContact`, `wholeSalerEmail`
    *   **Safety Equipment:** `EquipmentName`, `EquipmentType`, `EquipmentCondition`, `EquipmentLocation` (Note: PascalCase)
    *   **Admins:** `firstName`, `lastName`, `email` (password is excluded)
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "query": "bearing", // The search term used
      "pagination": {
        "page": 1,
        "limit": 10
        // Note: Total counts/pages across all results are not provided in this basic implementation.
      },
      "data": [
        {
          "type": "Machinery Parts",
          "results": [
            {
              "_id": "60d5f9f3f8d2f4a2c8a8d2b2",
              "name": "Bearing Housing Y",
              "type": "Bearing Assembly",
              "quantity": 15,
              "price": 85.50,
              "description": "Housing for main shaft bearing, Model Y grinder.",
              "machine": "60d5f9f3f8d2f4a2c8a8e3c2"
            },
            // ... other matching machinery parts (up to limit)
          ]
        },
        {
          "type": "Industrial Supplies",
          "results": [
            {
                "_id": "60d5f9f3f8d2f4a2c8aa1005",
                "name": "High-Temp Bearing Grease",
                "supplier": "LubriCorp",
                "description": "Synthetic grease for high-temperature bearings.",
                "quantity": 75,
                "unit": "tube",
                "pricePerUnit": 15.20,
                "category": "Lubricants",
                "lastRestocked": "2023-08-01T00:00:00.000Z",
                "createdAt": "2023-02-15T00:00:00.000Z",
                "updatedAt": "2023-08-01T00:00:00.000Z"
            }
            // ... other matching supplies (up to limit)
          ]
        }
        // ... other types with results
      ]
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing required query parameter `q`.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `500 Internal Server Error`: Server error during search execution.

## Notes

*   The search uses case-insensitive regular expressions (`$regex`, `$options: 'i'`) for broad matching.
*   Pagination (`limit`, `skip`) is applied *within each collection's* search query. The `limit` query parameter controls the maximum results returned *per type*.
*   Calculating a global `totalCount` and `totalPages` across all collections would require additional database queries (counting matches in each collection) and is not included in this implementation for performance reasons. 