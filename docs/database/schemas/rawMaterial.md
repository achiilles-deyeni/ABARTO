# RawMaterial Schema (`server/models/rawMaterial.js`)

Represents a raw material used in production.

**Note:** The model name in `module.exports` is `"rawMaterials"` (plural), while the schema is `rawMaterialsSchema`.

## Fields

| Field          | Type   | Required | Unique | Indexed | Default | Description                                |
|----------------|--------|----------|--------|---------|---------|--------------------------------------------|
| `_id`          | ObjectId | System | Yes    | Yes     | N/A     | Unique identifier for the document.        |
| `Name`         | String | Yes      | Yes    | No      | N/A     | Name of the raw material (must be unique). |
| `Source`       | String | Yes      | No     | No      | N/A     | Source/supplier of the raw material.     |
| `Quantity`     | Number | Yes      | No     | No      | N/A     | Quantity of the material in stock.         |
| `dateProvided` | Date   | Yes      | No     | No      | N/A     | Date the material was received/provided.   |
| `price`        | String | Yes      | No     | No      | N/A     | Price of the material (stored as String).  |

## Indexes

*   Unique constraint index on `Name`.

## Notes

*   The schema does **not** include `timestamps: true` by default.
*   The `price` field is stored as a String. Consider changing to Number if feasible for easier querying and calculations.
*   Field names (`Name`, `Source`, `Quantity`) start with uppercase letters, which is unconventional for JavaScript/MongoDB schemas (usually camelCase like `name`, `source`, `quantity`). 