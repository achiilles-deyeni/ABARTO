# ABARTO - Chemical Factory Inventory Management System

ABARTO is a comprehensive backend system designed to manage various aspects of a chemical factory's operations, including inventory, employee data, security logs, and reporting.

## Features

*   **Inventory Management:** CRUD operations and searching for:
    *   Products (`/api/products`)
    *   Raw Materials (`/api/materials`)
    *   Chemical Compounds (`/api/chemicals`)
    *   Industrial Supplies (`/api/supplies`)
    *   Safety Equipment (`/api/safety`)
    *   Machinery Parts (`/api/machinery`)
*   **Order Management:** CRUD operations for Wholesale Orders (`/api/wholesale`), including linking products.
*   **Employee Management:** Complete CRUD and search functionality for employee records (`/api/employees`).
*   **Admin Management:** Separate CRUD and search for administrator users (`/api/admins`).
*   **Authentication & Authorization:** JWT-based authentication (`/api/auth`) with middleware protection on most routes.
*   **Security Logging:** API for managing security-related logs (`/api/security`).
*   **Reporting:** API for managing report metadata and generating statistics (e.g., product price stats) (`/api/reports`).
*   **Global Search:** Search across multiple collections (`/api/search`).
*   **Standard API Practices:** Support for standard HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS), pagination, sorting, and error handling.

## Project Structure

```
ABARTO/
├── server/                     # Backend Application (Node.js/Express)
│   ├── config/                 # Configuration files (DB, Env)
│   ├── models/                 # Mongoose schemas
│   ├── controllers/            # Route handlers (business logic)
│   ├── routes/                 # API route definitions
│   │   ├── api/                # Main API endpoints
│   │   └── index.js            # Route aggregator
│   ├── middleware/             # Custom middleware (Auth, Error, Validation, etc.)
│   ├── utils/                  # Utility functions
│   ├── services/               # Business logic services (optional layer)
│   ├── scripts/                # Utility scripts (Seeding, Indexing)
│   └── server.js               # Main server entry point
│
├── client/                     # Frontend Application (React/Vite)
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/                       # Documentation
│   ├── api/                    # Generated API documentation (Markdown)
│   ├── database/               # Database schema documentation
│   └── security/               # Security documentation
│
├── .env                        # Server environment variables (Create this in server/)
├── .gitignore
├── package.json                # Root package file (Server dependencies & scripts)
└── README.md                   # This file
```

## Technologies Used

**Backend (Server):**
*   Node.js
*   Express.js
*   MongoDB (Database)
*   Mongoose (ODM)
*   JWT (JSON Web Tokens) for Authentication
*   bcryptjs (Password Hashing)
*   dotenv (Environment Variables)
*   cors (Cross-Origin Resource Sharing)
*   morgan (HTTP Request Logging)
*   express-rate-limit (Rate Limiting)

**Frontend (Client):**
*   React
*   Vite (Build Tool / Dev Server)
*   ESLint (Linting)

**Database:**
*   MongoDB

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   MongoDB (Running locally or connection string for a hosted instance)
*   Git

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/achiilles-deyeni/ABARTO.git
    cd ABARTO
    ```

2.  **Install Server Dependencies:**
    (Dependencies are managed in the root `package.json`)
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Configure Server Environment Variables:**
    *   Navigate to the `server` directory: `cd server`
    *   Create a `.env` file in this (`server/`) directory.
    *   Add the following required variables, replacing placeholder values:
        ```dotenv
        NODE_ENV=development
        PORT=5000 # Or any port you prefer
        MONGO_URI=your_mongodb_connection_string # IMPORTANT: Replace with your actual MongoDB URI
        JWT_SECRET=your_very_secure_jwt_secret # IMPORTANT: Replace with a strong, random secret
        JWT_EXPIRE=1h # Or desired token expiration (e.g., 30d)
        ```
    *   Return to the root project directory: `cd ..`

4.  **Install Client Dependencies:**
    *   Navigate to the `client` directory: `cd client`
    *   Install dependencies:
        ```bash
        npm install
        # or
        # yarn install
        ```
    *   Return to the root directory: `cd ..`

## Running the Application

1.  **Start MongoDB:** Ensure your MongoDB server is running (if using a local instance).

2.  **Start the Backend Server:**
    *   From the **root** project directory (`ABARTO/`):
    *   For development (with automatic restarts using nodemon):
        ```bash
        npm run dev
        ```
    *   For production:
        ```bash
        npm start
        ```
    *   The server should start, typically on the port specified in your `server/.env` file (e.g., 5000).

3.  **Start the Frontend Client:**
    *   Open a **new terminal**.
    *   Navigate to the `client` directory: `cd client`
    *   Run the development server:
        ```bash
        npm run dev
        ```
    *   Vite will start the client, usually on `http://localhost:5173` (check terminal output for the exact address).
    *   Open the provided URL in your web browser.

## API Documentation

Detailed documentation for all API endpoints can be found in the `/docs/api/` directory. Each file corresponds to a specific resource (e.g., `products.md`, `employee.md`).

## Database

*   This project uses MongoDB as its primary database.
*   Mongoose is used as the Object Data Mapper (ODM) for interacting with MongoDB.
*   Database schemas are defined in the `/server/models/` directory.
*   Refer to `/docs/database/` for more detailed schema information (if available).

### Database Indexing

*   Proper database indexes are crucial for performance, especially for search and frequently queried fields.
*   A script is provided to create recommended indexes based on the models.
*   To run the index creation script (from the root directory):
    ```bash
    npm run sync-indexes
    ```
    *Note: Ensure your MongoDB server is running and the `MONGO_URI` in `server/.env` is correct before running.* 

## Scripts

*   `npm run dev`: Starts the backend server using `nodemon` for development.
*   `npm start`: Starts the backend server using `node`.
*   `npm run sync-indexes`: Creates database indexes defined in `server/scripts/createIndexes.js`.
*   `npm run lint` (in `client` directory): Lints the client-side code.
*   `npm run build` (in `client` directory): Creates a production build of the client.
*   **(Optional)** Database seeding scripts might be available in `server/scripts/` (e.g., `seed.js`). Check the scripts directory and potentially add an `npm run seed` script to `package.json` if needed.

## Testing

*   API endpoints can be tested using tools like Postman or Insomnia.
*   Import Postman collections if provided in the documentation or project files.
*   (Optional) Add information about unit or integration tests if they are implemented.

## Contributing

Contributions are welcome! Please follow standard fork/pull request workflows. Ensure code follows existing style patterns and includes tests where appropriate.

## License

ISC (Based on root `package.json`) 