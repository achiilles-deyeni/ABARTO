# Product Schema (`server/models/products.js`)

Represents a product in the inventory.

## Fields

| Field         | Type   | Required | Unique | Indexed | Default | Description                                             |
|---------------|--------|----------|--------|---------|---------|---------------------------------------------------------|
| `_id`         | ObjectId | System | Yes    | Yes     | N/A     | Unique identifier for the product document.             |
| `name`        | String | Yes      | No     | Yes     | N/A     | Name of the product.                                    |
| `price`       | Number | Yes      | No     | Yes     | N/A     | Price of the product.                                   |
| `description` | String | Yes      | No     | No      | N/A     | Description of the product.                             |
| `category`    | String | Yes      | No     | Yes     | N/A     | Category the product belongs to.                        |
| `quantity`    | Number | Yes      | No     | Yes     | N/A     | Quantity of the product in stock.                       |
| `rating`      | Number | Yes      | No     | Yes     | N/A     | Rating of the product (e.g., out of 5).                 |
| `createdAt`   | Date   | System | No     | No      | System  | Timestamp of document creation (from `timestamps: true`). |
| `updatedAt`   | Date   | System | No     | No      | System  | Timestamp of last document update (from `timestamps: true`). |

## Indexes

*   Single field index on `name`.
*   Single field index on `price`.
*   Single field index on `category`.
*   Single field index on `quantity`.
*   Single field index on `rating`.
*   *(Optional compound index on `{ category: 1, price: -1 }` is commented out in the model file).*
*   *(Optional text index on `description` is commented out in the model file).*

## Notes

*   `timestamps: true` automatically adds and manages `createdAt` and `updatedAt` fields. 