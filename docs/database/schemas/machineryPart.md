# MachineryPart Schema (`server/models/machineryPart.js`)

Represents a specific part for machinery.

**Note:** The model name in `module.exports` is `"machines"` (plural), which seems inconsistent with the schema name `machineryPartsSchema` and the file name. Consider standardizing.

## Fields

| Field         | Type     | Required | Unique | Indexed | Default | Description                                           |
|---------------|----------|----------|--------|---------|---------|-------------------------------------------------------|
| `_id`         | ObjectId | System   | Yes    | Yes     | N/A     | Unique identifier for the document.                   |
| `name`        | String   | Yes      | Yes    | No      | N/A     | Name of the machinery part (must be unique).          |
| `type`        | String   | Yes      | No     | No      | N/A     | Type or category of the part.                         |
| `quantity`    | Number   | Yes      | No     | No      | N/A     | Quantity of this part in stock.                       |
| `price`       | Number   | Yes      | No     | No      | N/A     | Price per unit of the part.                           |
| `description` | String   | Yes      | No     | No      | N/A     | Description of the part.                              |
| `machine`     | ObjectId | Yes      | No     | No      | N/A     | Reference to the `Machines` model this part belongs to. |

## Indexes

*   Unique constraint index on `name`.

## Notes

*   The schema does **not** include `timestamps: true` by default.
*   The data types are defined as lowercase strings (`"string"`, `"number"`). The standard Mongoose way is to use capitalized constructors (`String`, `Number`).
*   The `machine` field references a model named `"Machines"`. Ensure a corresponding `Machine` model exists (e.g., `server/models/machine.js` exporting `mongoose.model("Machine", machineSchema)`).
*   Consider adding indexes to fields commonly used for searching or sorting (e.g., `type`, `machine`). 