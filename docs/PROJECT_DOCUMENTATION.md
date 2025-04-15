# Project Documentation: MongoDB Inventory Management System

## 1. Introduction

This document provides an overview and technical details for the Inventory Management System built using Node.js, Express, and MongoDB. The system aims to provide robust functionalities for managing various company resources like products, employees, admins, chemicals, machinery, materials, reports, safety equipment, security logs, suppliers, and wholesale orders. It supports CRUD operations, advanced querying, sorting, pagination, aggregation, bulk operations, and secure access via JWT authentication.

## 2. Setup Instructions

1.  **Prerequisites:**
    *   Node.js (v14 or later recommended)
    *   npm (usually comes with Node.js)
    *   MongoDB Server (local instance or connection details for MongoDB Atlas)

2.  **Clone Repository:**
    ```bash
    git clone <your-repository-url>
    cd MONGODB\ PROJECT/ABARTO
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```
    This will install Express, Mongoose, jsonwebtoken, bcrypt, cookie-parser, and other necessary packages listed in `package.json`.

4.  **Environment Variables:**
    Create a `.env` file in the `ABARTO/server` directory with the following variables:

    ```dotenv
    # MongoDB Connection String (replace with your local or Atlas URI)
    MONGO_URI=mongodb://localhost:27017/inventory_management

    # Server Port (optional, defaults to 3000)
    PORT=3000

    # JWT Configuration (IMPORTANT: Use strong, unique secrets!)
    JWT_SECRET=YOUR_REALLY_STRONG_SECRET_KEY_HERE
    JWT_EXPIRE=1h # (e.g., 1h, 7d)
    ```
    *   **`MONGO_URI`**: Your MongoDB connection string. For Atlas, get this from your cluster's connection details. Ensure your IP address is whitelisted in Atlas Network Access settings if applicable.
    *   **`JWT_SECRET`**: A long, random, and secret string used to sign the JSON Web Tokens. **Do not commit the actual secret to version control.**
    *   **`JWT_EXPIRE`**: How long a login token should be valid for (e.g., `1h` for one hour, `7d` for seven days).

5.  **Run the Server:**
    Navigate to the server directory and start the application:
    ```bash
    cd server
    node server.js
    ```
    The server should start, typically on port 3000 (or the port specified in `.env`), and connect to the MongoDB database.

## 3. Database Design

The application uses Mongoose to model data and interact with MongoDB. Models are defined in the `ABARTO/server/models/` directory.

**Collections/Models:**

*   **`Admin` (`admin.js`):** Stores administrator user data, including credentials (hashed password) and profile information. Used for authentication and authorization.
*   **`Product` (`products.js`):** Represents products in the inventory (name, price, description, category, quantity, rating).
*   **`Employee` (`employee.js`):** Stores employee information (name, DOB, contact, salary, department, position, etc.).
*   **`ChemicalCompound` (`chemicalCompound.js`):** Tracks chemical inventory (name, formula, quantity, storage, safety info).
*   **`MachineryPart` (`machineryPart.js`):** Tracks machinery parts (name, type, quantity, price).
*   **`RawMaterial` (`rawMaterial.js`):** Represents raw materials (name, supplier, quantity, cost).
*   **`Report` (`report.js`):** Stores metadata about generated reports (name, type, generation date, parameters).
*   **`SafetyEquipment` (`safetyEquipment.js`):** Tracks safety gear (name, inspection dates, status, location).
*   **`SecurityLog` (`securityLog.js`):** Records system or security-related events (timestamp, type, level, user, details).
*   **`Supplier` (`Suppliers.js`):** Information about suppliers (name, contact person, email, phone).
*   **`WholesaleOrder` (`wholesaleOrder.js`):** Records bulk orders (customer, product, quantity, price, date).

**Document Structure:**

Each model file defines a Mongoose `Schema` specifying the fields, data types (`String`, `Number`, `Date`, `ObjectId`, etc.), validation rules (`required`, `unique`, `enum`), and default values.

**Indexing:**

Indexes are defined within the schemas (`index: true`) for frequently queried or sorted fields to improve performance. Key indexed fields include:
*   Product: `name`, `category`, `price`, `quantity`, `rating`
*   Employee: `firstName`, `lastName`, `department`, `position`, `email`, `phoneNumber`, `dateEmployed`
*   Admin: `firstName`, `lastName`, `email`, `phoneNumber`, `dateEmployed`
*   SecurityLog: `timestamp`, `eventType`, `level`, `userId`
Timestamps (`createdAt`, `updatedAt`) are automatically added and indexed where applicable.

## 4. API Endpoints

The API is organized by resource under the `/api/` prefix. Routes are defined in `ABARTO/server/routes/api/`. Controllers handling the logic are in `ABARTO/server/controllers/`.

**Authentication:**

*   **`POST /api/auth/register`**: Creates a new Admin user. Requires `firstName`, `lastName`, `email`, `password` in the body.
*   **`POST /api/auth/login`**: Authenticates an Admin user. Requires `email` and `password` in the body. Returns a JWT `token`.

**Common Resource Structure (e.g., Products - `/api/products`)**

*(Note: Most endpoints below require Authentication - see Section 5)*

*   **`GET /`**: Get a list of resources. Supports pagination, sorting, and limiting:
    *   `?page=<number>` (Default: 1)
    *   `?limit=<number>` (Default: 10, Max: 100/200 depending on resource)
    *   `?sort=<field_name>` (e.g., `name`, `price`, `createdAt`)
    *   `?order=<asc|desc>` (Default: `asc` or `desc` depending on resource)
*   **`POST /`**: Create a new resource. Requires resource data in the JSON body.
*   **`GET /search`**: Search for resources based on query parameters (e.g., `?name=Widget&category=X,Y&minPrice=10`). Specific parameters vary by resource. Supports pagination/sorting/limiting.
*   **`POST /bulk`**: Create multiple resources at once. Requires an array of resource objects in the JSON body. (Implemented for Products, Employees).
*   **`GET /:id`**: Get a single resource by its MongoDB ObjectId.
*   **`PUT /:id`**: Replace an existing resource entirely. Requires the full resource data in the JSON body.
*   **`PATCH /:id`**: Partially update an existing resource. Requires only the fields to be changed in the JSON body.
*   **`DELETE /:id`**: Delete a resource by its MongoDB ObjectId.
*   **`HEAD /` & `HEAD /:id`**: Get resource metadata (e.g., total count, last modified) in headers without the body.
*   **`OPTIONS /` & `OPTIONS /:id`**: Get allowed HTTP methods for the endpoint.

**Specific Resource Endpoints:**

*   `/api/admins`
*   `/api/products`
*   `/api/employees`
*   `/api/chemicals`
*   `/api/machinery`
*   `/api/materials`
*   `/api/reports` (Includes `/stats/product-price` for aggregation example)
*   `/api/safety`
*   `/api/security`
*   `/api/supplies` (Manages Suppliers)
*   `/api/wholesale`

Refer to the specific route files in `routes/api/` for exact controller mappings.

**Response Format:**

*   **Success (List):** `200 OK` - JSON body includes `{ success: true, total, page, limit, totalPages, count, data: [...] }`.
*   **Success (Single/Update/Create):** `200 OK` or `201 Created` - JSON body includes `{ success: true, data: {...} }`.
*   **Success (Delete):** `200 OK` - JSON body includes `{ success: true, message: "...", data: {} }`.
*   **Client Error:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict` - JSON body includes `{ success: false, error: "...", message: "..." }`.
*   **Server Error:** `500 Internal Server Error` - JSON body includes `{ success: false, error: "..." }`.

## 5. Authentication & Authorization

*   **Authentication:** Handled via JWT. Use the `POST /api/auth/login` endpoint to get a token.
*   **Authorization:** Most routes (except `/api/auth/login`, `/api/auth/register`, and `OPTIONS` requests) are protected using the `protect` middleware (`middleware/authMiddleware.js`).
*   **Making Protected Requests:** Include the obtained JWT in the `Authorization` header of your requests:
    ```
    Authorization: Bearer <your_jwt_token>
    ```
    Requests without a valid token to protected routes will receive a `401 Unauthorized` error.

## 6. Key Features Implemented

*   **CRUD Operations:** Full or partial implementation across most resources.
*   **Advanced Querying:** Search endpoints with filtering capabilities (e.g., regex, ranges, `$in` for product categories).
*   **Sorting & Pagination:** Implemented on `getAll` and `search` endpoints for all major resources.
*   **Aggregation:** Example implemented for product price statistics (`GET /api/reports/stats/product-price`).
*   **Bulk Writing:** Example implemented for Products and Employees (`POST /api/products/bulk`, `POST /api/employees/bulk`).
*   **Indexing:** Added to optimize common queries on key models.
*   **Authentication:** JWT-based login for Admins.
*   **Authorization:** Middleware protecting most routes, requiring admin login.

## 7. Usage Example (Conceptual Postman Flow)

1.  **Register Admin:** `POST /api/auth/register` with admin details (incl. password).
2.  **Login Admin:** `POST /api/auth/login` with email and password. Copy the `token` from the response.
3.  **Access Protected Route:** `GET /api/products`. Add an `Authorization` header with the value `Bearer <copied_token>`. You should receive the list of products.
4.  **Attempt Unauthenticated Access:** `DELETE /api/products/<some_product_id>` *without* the `Authorization` header. You should receive a `401 Unauthorized` error.
5.  **Authenticated Deletion:** `DELETE /api/products/<some_product_id>` *with* the correct `Authorization` header. The product should be deleted successfully.
