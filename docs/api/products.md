# Products API Documentation

This document outlines the API endpoints available for managing product resources.

**Base Path:** `/api/products`

## Endpoints

### Get All Products

- **Method:** `GET`
- **Path:** `/`
- **Description:** Retrieves a paginated list of all products. Supports sorting and filtering via query parameters.
- **Authentication:** Required (Admin or Employee)
- **Query Parameters:**
  - `page` (optional): The page number to retrieve (default: 1).
  - `limit` (optional): The number of products per page (default: 10).
  - `sort` (optional): Field to sort by (default: `name`). Prepend `-` for descending order (e.g., `-price`).
  - `fields` (optional): Comma-separated list of fields to include in the response.
  - Other filter parameters (e.g., `name`, `category`, `minPrice`, `maxPrice`, `minRating`, `maxRating`) for searching.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15,
    "count": 10,
    "data": [
      {
        "_id": "60d5f8f7e7b1c2a8c8b8c8b8",
        "name": "Industrial Widget",
        "category": "Widgets",
        "price": 99.99,
        "quantity": 500,
        "description": "A high-quality industrial widget.",
        "manufacturer": "WidgetCorp",
        "sku": "WIDGET-IND-001",
        "rating": 4.5,
        "createdAt": "2023-01-15T10:00:00.000Z",
        "updatedAt": "2023-01-20T12:30:00.000Z"
      },
      // ... more products
    ]
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions.

### Get All Products (HEAD)

- **Method:** `HEAD`
- **Path:** `/`
- **Description:** Retrieves metadata about the product collection, specifically the total count.
- **Authentication:** Required (Admin or Employee)
- **Success Response (200 OK):**
  - Headers:
    - `X-Total-Count`: Total number of products.
    - `X-Resource-Type`: `Products`.
- **Error Responses:**
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions.

### Get Product Options

- **Method:** `OPTIONS`
- **Path:** `/`
- **Description:** Retrieves the allowed HTTP methods for the product collection endpoint.
- **Authentication:** Required (Admin or Employee)
- **Success Response (200 OK):**
  - Headers:
    - `Allow`: `GET, POST, HEAD, OPTIONS, PATCH`
- **Error Responses:**
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions.

### Search Products

- **Method:** `GET`
- **Path:** `/search`
- **Description:** Searches for products based on various criteria provided as query parameters. Supports pagination and sorting.
- **Authentication:** Required (Admin or Employee)
- **Query Parameters:**
  - `name` (optional): Search by product name (case-insensitive regex match).
  - `category` (optional): Search by category (case-insensitive regex match).
  - `minPrice` (optional): Minimum price filter.
  - `maxPrice` (optional): Maximum price filter.
  - `minRating` (optional): Minimum rating filter.
  - `maxRating` (optional): Maximum rating filter.
  - `page` (optional): The page number (default: 1).
  - `limit` (optional): Results per page (default: 10).
  - `sort` (optional): Field to sort by (default: `name`). Prepend `-` for descending.
- **Success Response (200 OK):** Similar structure to `GET /`, but `total` reflects matching products.
  ```json
  {
    "success": true,
    "total": 5, // Total matching products
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "count": 5, // Count in current page
    "data": [
      // ... matching products
    ]
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions.

### Create New Product

- **Method:** `POST`
- **Path:** `/`
- **Description:** Creates a new product.
- **Authentication:** Required (Admin or Employee)
- **Request Body:**
  ```json
  {
    "name": "Advanced Widget",
    "category": "Widgets",
    "price": 149.99,
    "quantity": 250,
    "description": "An advanced industrial widget with enhanced features.",
    "manufacturer": "WidgetCorp",
    "sku": "WIDGET-ADV-001",
    "rating": 4.8
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d5f8f7e7b1c2a8c8b8c8c0",
      "name": "Advanced Widget",
      // ... other fields ...
      "createdAt": "2023-01-21T14:00:00.000Z",
      "updatedAt": "2023-01-21T14:00:00.000Z"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Invalid request body (e.g., missing required fields, validation errors).
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions.

### Bulk Create Products

- **Method:** `POST`
- **Path:** `/bulk`
- **Description:** Creates multiple products in a single request. The request body must be an array of product objects. Supports optional unordered inserts.
- **Authentication:** Required (Admin)
- **Request Body:**
  ```json
  [
    {
      "name": "Bulk Widget A",
      "category": "Bulk Widgets",
      "price": 10.00,
      "quantity": 1000,
      "sku": "BULK-WIDGET-A"
    },
    {
      "name": "Bulk Widget B",
      "category": "Bulk Widgets",
      "price": 12.50,
      "quantity": 800,
      "sku": "BULK-WIDGET-B"
    }
  ]
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Successfully inserted 2 products.",
    "insertedCount": 2
    // "data": [ ... ] // Optionally included if service returns them
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Request body is not an array, is empty, or contains invalid product objects (validation errors).
    ```json
    {
      "success": false,
      "error": "Bulk operation failed due to validation errors.",
      "validationErrors": [
        {
          "index": 0, // Index in the input array
          "code": 121, // Example MongoDB error code
          "message": "Document failed validation" // Example error message
        }
        // ... other errors
      ]
    }
    ```
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions (Requires Admin).
  - `500 Internal Server Error`: Server error during bulk operation.

### Get Product By ID

- **Method:** `GET`
- **Path:** `/:id`
- **Description:** Retrieves a single product by its unique ID.
- **Authentication:** Required (Admin or Employee)
- **Parameters:**
  - `id` (URL parameter): The unique identifier of the product.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d5f8f7e7b1c2a8c8b8c8b8",
      "name": "Industrial Widget",
      // ... other fields ...
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions.
  - `404 Not Found`: Product with the specified ID does not exist.

### Get Product By ID (HEAD)

- **Method:** `HEAD`
- **Path:** `/:id`
- **Description:** Retrieves metadata for a single product, like `Last-Modified` timestamp.
- **Authentication:** Required (Admin or Employee)
- **Parameters:**
  - `id` (URL parameter): The unique identifier of the product.
- **Success Response (200 OK):**
  - Headers:
    - `X-Resource-Type`: `Product`.
    - `Last-Modified`: Timestamp of the last update (if available).
- **Error Responses:**
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions.
  - `404 Not Found`: Product with the specified ID does not exist.

### Get Single Product Options

- **Method:** `OPTIONS`
- **Path:** `/:id`
- **Description:** Retrieves the allowed HTTP methods for a single product endpoint.
- **Authentication:** Required (Admin or Employee)
- **Parameters:**
  - `id` (URL parameter): The unique identifier of the product.
- **Success Response (200 OK):**
  - Headers:
    - `Allow`: `GET, PUT, DELETE, PATCH, HEAD, OPTIONS`
- **Error Responses:**
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions.
  - `404 Not Found`: Product with the specified ID does not exist (or ID format is invalid).

### Update Product (Full Update)

- **Method:** `PUT`
- **Path:** `/:id`
- **Description:** Replaces an existing product entirely with the provided data.
- **Authentication:** Required (Admin)
- **Parameters:**
  - `id` (URL parameter): The unique identifier of the product to update.
- **Request Body:** The full product object with updated fields.
  ```json
  {
    "name": "Updated Industrial Widget",
    "category": "Widgets - Premium",
    "price": 109.99,
    "quantity": 450,
    "description": "An updated high-quality industrial widget.",
    "manufacturer": "WidgetCorp Intl.",
    "sku": "WIDGET-IND-001-REV2",
    "rating": 4.6
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d5f8f7e7b1c2a8c8b8c8b8",
      "name": "Updated Industrial Widget",
      // ... all fields (new and unchanged) ...
      "updatedAt": "2023-01-22T09:15:00.000Z"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Invalid request body or validation errors.
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions (Requires Admin).
  - `404 Not Found`: Product with the specified ID does not exist.

### Partially Update Product

- **Method:** `PATCH`
- **Path:** `/:id`
- **Description:** Partially updates an existing product with the provided fields. Only fields included in the request body will be updated.
- **Authentication:** Required (Admin)
- **Parameters:**
  - `id` (URL parameter): The unique identifier of the product to update.
- **Request Body:** An object containing only the fields to be updated.
  ```json
  {
    "price": 115.00,
    "quantity": 420
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d5f8f7e7b1c2a8c8b8c8b8",
      "name": "Updated Industrial Widget", // Unchanged from previous PUT/creation
      "category": "Widgets - Premium",     // Unchanged
      "price": 115.00,                   // Updated
      "quantity": 420,                   // Updated
      // ... other fields ...
      "updatedAt": "2023-01-22T11:00:00.000Z"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Invalid request body or validation errors.
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions (Requires Admin).
  - `404 Not Found`: Product with the specified ID does not exist.

### Delete Product

- **Method:** `DELETE`
- **Path:** `/:id`
- **Description:** Deletes a product by its unique ID.
- **Authentication:** Required (Admin)
- **Parameters:**
  - `id` (URL parameter): The unique identifier of the product to delete.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {} // Empty object indicates successful deletion
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Authentication token is missing or invalid.
  - `403 Forbidden`: User does not have the required permissions (Requires Admin).
  - `404 Not Found`: Product with the specified ID does not exist.

## Data Model (Product)

```typescript
interface Product {
  _id: string; // MongoDB ObjectId
  name: string; // Required
  category: string;
  price: number; // Required
  quantity: number; // Required, default: 0
  description?: string;
  manufacturer?: string;
  sku?: string; // Should be unique if used
  rating?: number; // e.g., 1-5
  imageUrl?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Authentication & Authorization

- Most read operations (`GET`, `HEAD`, `OPTIONS`, `search`) require at least `Employee` role.
- Write operations (`POST`, `PUT`, `PATCH`, `DELETE`, `bulk`) require `Admin` role.
- Authentication is handled via JWT Bearer tokens in the `Authorization` header. 