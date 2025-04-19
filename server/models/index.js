// importing all models
const Admin = require("./admin");
const ChemicalCompound = require("./chemicalCompound");
const Suppliers = require("./Suppliers");
const RawMaterials = require("./materials");
const Employee = require("./employee");
const MachineryPart = require("./machines");
const Wholesale = require("./wholesaleOrder");
const Product = require("./products");
const Safety = require("./safetyEquipment");
const employees = require("./employee");
const machines = require("./machineryPart");
const wholesale = require("./wholesaleOrder");
const products = require("./products");
const safety = require("./safetyEquipment");

module.exports = {
  Admin,
  ChemicalCompound,
  Suppliers,
  RawMaterials,
  Employee,
  MachineryPart,
  Wholesale,
  Product,
  Safety,
};
