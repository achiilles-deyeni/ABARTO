# Employee Schema (`server/models/employee.js`)

Represents an employee in the system.

## Fields

| Field                 | Type     | Required | Unique | Indexed | Default    | Description                                             |
|-----------------------|----------|----------|--------|---------|------------|---------------------------------------------------------|
| `_id`                 | ObjectId | System   | Yes    | Yes     | N/A        | Unique identifier for the employee document.            |
| `firstName`           | String   | Yes      | No     | Yes     | N/A        | Employee's first name.                                  |
| `lastName`            | String   | Yes      | No     | Yes     | N/A        | Employee's last name.                                   |
| `DOB`                 | Date     | Yes      | No     | No      | N/A        | Employee's date of birth.                               |
| `phoneNumber`         | String   | Yes      | Yes    | No      | N/A        | Employee's phone number (must be unique).               |
| `email`               | String   | Yes      | Yes    | No      | N/A        | Employee's email address (must be unique).              |
| `salary`              | Number   | Yes      | No     | Yes     | N/A        | Employee's salary.                                      |
| `department`          | String   | Yes      | No     | Yes     | N/A        | Employee's department.                                  |
| `position`            | String   | Yes      | No     | Yes     | N/A        | Employee's job position/title.                          |
| `address`             | String   | Yes      | No     | No      | N/A        | Employee's home address.                                |
| `emergencyContact`    | Object   | No       | N/A    | N/A     | N/A        | Embedded object for emergency contact details.          |
| `emergencyContact.name` | String | No       | N/A    | N/A     | N/A        | Name of the emergency contact.                          |
| `emergencyContact.relationship` | String | No | N/A | N/A | N/A      | Relationship to the employee (e.g., Spouse, Parent). |
| `emergencyContact.phoneNumber` | String | No | N/A | N/A | N/A        | Phone number of the emergency contact.                  |
| `dateEmployed`        | Date     | No       | No     | Yes     | `Date.now` | Date the employee was employed.                         |
| `createdAt`           | Date     | System   | No     | No      | System     | Timestamp of document creation (from `timestamps: true`). |
| `updatedAt`           | Date     | System   | No     | No      | System     | Timestamp of last document update (from `timestamps: true`). |

## Indexes

*   Single field index on `firstName`.
*   Single field index on `lastName`.
*   Unique constraint index on `phoneNumber`.
*   Unique constraint index on `email`.
*   Single field index on `salary`.
*   Single field index on `department`.
*   Single field index on `position`.
*   Single field index on `dateEmployed`.
*   *(Optional compound indexes on `{ lastName: 1, firstName: 1 }` and `{ department: 1, position: 1 }` are commented out in the model file).*

## Notes

*   `timestamps: true` automatically adds and manages `createdAt` and `updatedAt` fields.
*   The `emergencyContact` field is an embedded document. 