# Admin Schema (`server/models/admin.js`)

Represents an administrator user in the system.

## Fields

| Field          | Type   | Required | Unique | Indexed | `select` | Default | Description                                  |
|----------------|--------|----------|--------|---------|----------|---------|----------------------------------------------|
| `_id`          | ObjectId | System   | Yes    | Yes     | true     | N/A     | Unique identifier for the admin document.   |
| `firstName`    | String | Yes      | No     | Yes     | true     | N/A     | Admin's first name.                          |
| `lastName`     | String | Yes      | No     | Yes     | true     | N/A     | Admin's last name.                           |
| `DOB`          | Date   | Yes      | No     | No      | true     | N/A     | Admin's date of birth.                     |
| `phoneNumber`  | String | Yes      | Yes    | No      | true     | N/A     | Admin's phone number (must be unique).       |
| `email`        | String | Yes      | Yes    | Yes     | true     | N/A     | Admin's email address (must be unique).      |
| `password`     | String | Yes      | No     | No      | **false**| N/A     | Admin's hashed password (not selected by default). |
| `salary`       | Number | Yes      | No     | No      | true     | N/A     | Admin's salary.                            |
| `portfolio`    | String | Yes      | No     | Yes     | true     | N/A     | Admin's portfolio or area of responsibility. |
| `dateEmployed` | Date   | No       | No     | Yes     | true     | `Date.now` | Date the admin was employed.             |
| `createdAt`    | Date   | System   | No     | No      | true     | System  | Timestamp of document creation (from `timestamps: true`). |
| `updatedAt`    | Date   | System   | No     | No      | true     | System  | Timestamp of last document update (from `timestamps: true`). |

## Indexes

*   Single field index on `firstName`.
*   Single field index on `lastName`.
*   Single field index on `email` (and unique constraint).
*   Unique constraint index on `phoneNumber`.
*   Single field index on `portfolio`.
*   Single field index on `dateEmployed`.
*   *(Optional compound index on `{ lastName: 1, firstName: 1 }` is commented out in the model file).*

## Notes

*   The `password` field is configured with `select: false`, meaning it won't be returned in queries by default unless explicitly selected (e.g., using `.select('+password')`).
*   `timestamps: true` automatically adds and manages `createdAt` and `updatedAt` fields. 