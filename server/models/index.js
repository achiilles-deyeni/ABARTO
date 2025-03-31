// importing all models
const Admin = require("./admin");
const ChemicalCompound = require("./chemicalCompound");
const Suppliers = require("./Suppliers");
const RawMaterials = require("./rawMaterial");
const Employee = require("./employee");
const MachineryPart = require("./machineryPart");
const Wholesale = require("./wholesaleOrder");
const Product = require("./products");
const Safety = require("./safetyEquipment");

module.exports = {
  Admin,
  ChemicalCompound,
  Suppliers,
  RawMaterials,
  Employee,
  MachineryPart,
  Wholesale,
  Product,
  Safety
};
