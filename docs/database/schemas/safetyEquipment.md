# SafetyEquipment Schema (`server/models/safetyEquipment.js`)

Represents an item of safety equipment.

**Note:** The model name in `module.exports` is `"safety"`.

## Fields

| Field                   | Type   | Required | Unique | Indexed | Default | Description                                      |
|-------------------------|--------|----------|--------|---------|---------|--------------------------------------------------|
| `_id`                   | ObjectId | System | Yes    | Yes     | N/A     | Unique identifier for the document.              |
| `EquipmentName`         | String | Yes      | Yes    | No      | N/A     | Name of the safety equipment (must be unique).   |
| `EquipmentType`         | String | Yes      | No     | No      | N/A     | Type of safety equipment (e.g., Gloves, Goggles). |
| `EquipmentCondition`    | String | Yes      | No     | No      | N/A     | Condition of the equipment (e.g., New, Used).    |
| `EquipmentLocation`     | String | Yes      | No     | No      | N/A     | Location where the equipment is stored.          |
| `EquipmentQuantity`     | Number | Yes      | No     | No      | N/A     | Quantity of this equipment item in stock.        |
| `EquipmentDateProvided` | Date   | Yes      | No     | No      | N/A     | Date the equipment was acquired/provided.        |

## Indexes

*   Unique constraint index on `EquipmentName`.

## Notes

*   The schema does **not** include `timestamps: true` by default.
*   Field names start with uppercase letters (e.g., `EquipmentName`). Consider using camelCase (`equipmentName`) for consistency.
*   Consider adding indexes to fields commonly used for searching or sorting (e.g., `EquipmentType`, `EquipmentLocation`, `EquipmentCondition`). 