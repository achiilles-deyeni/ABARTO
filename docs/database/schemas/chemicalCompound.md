# ChemicalCompound Schema (`server/models/chemicalCompound.js`)

Represents a chemical compound.

**Note:** The model name in `module.exports` is `"chemicals"`.

## Fields

| Field              | Type   | Required | Unique | Indexed | Default | Description                                  |
|--------------------|--------|----------|--------|---------|---------|----------------------------------------------|
| `_id`              | ObjectId | System | Yes    | Yes     | N/A     | Unique identifier for the document.          |
| `name`             | String | Yes      | Yes    | No      | N/A     | Name of the chemical compound (must be unique). |
| `molecularFormula` | String | Yes      | No     | No      | N/A     | Chemical formula (e.g., H2O).                |
| `molecularWeight`  | Number | Yes      | No     | No      | N/A     | Molecular weight (e.g., g/mol).              |
| `molecularDensity` | Number | Yes      | No     | No      | N/A     | Density (e.g., g/cm³).                      |
| `boilingPoint`     | Number | No       | No     | No      | N/A     | Boiling point (e.g., in °C).                 |
| `meltingPoint`     | Number | No       | No     | No      | N/A     | Melting point (e.g., in °C).                 |
| `color`            | String | No       | No     | No      | N/A     | Color of the compound.                       |
| `toxicity`         | String | No       | No     | No      | N/A     | Information about toxicity level/effects.    |
| `bioavailability`  | String | No       | No     | No      | N/A     | Information about bioavailability.           |

## Indexes

*   Unique constraint index on `name`.

## Notes

*   The schema does **not** include `timestamps: true` by default.
*   Consider adding indexes to fields commonly used for searching or sorting (e.g., `molecularFormula`, `toxicity`). 