// insertSampleData.js - Run with: mongo < insertSampleData.js (after connecting to DB)
// Remember to connect to the correct database first: use yourDatabaseName

// --- Provided ObjectIDs ---
const adminId = ObjectId("67faddbd9eaa955b2310fe05");
const widgetId = ObjectId("67faddbd9eaa955b2310fe08");
const gearId = ObjectId("67faddbd9eaa955b2310fe09");
const supplierId = ObjectId("67faddbd9eaa955b2310fe0c");

// --- Clear existing data (Optional - Use with caution!) ---
// db.employees.deleteMany({});
// db.products.deleteMany({});
// db.rawmaterials.deleteMany({});
// db.suppliers.deleteMany({});
// db.wholesaleorders.deleteMany({});
// db.securitylogs.deleteMany({});
// db.reports.deleteMany({});
// db.safetyequipments.deleteMany({});
// db.machineryparts.deleteMany({});
// db.chemicalcompounds.deleteMany({});
// db.admins.deleteMany({});
// print("Existing data cleared (optional step).");


// --- Insert Sample Data (Assuming collections are empty or using provided IDs) ---

// Admins (Using provided ID)
// db.admins.insertOne({ _id: adminId, firstName: "Super", lastName: "Admin", email: "admin@abarto.com", DOB: new Date("1980-01-01"), phoneNumber: "123-456-7890", salary: 80000, portfolio: "System Administrator", dateEmployed: new Date("2020-01-01"), createdAt: new Date(), updatedAt: new Date() });
// print(`Used Admin ID: ${adminId}`); // Uncomment if inserting with specific ID

// Employees
db.employees.insertMany([
    { firstName: "John", lastName: "Doe", email: "john.doe@abarto.com", position: "Technician", department: "Maintenance", dateEmployed: new Date("2021-03-15"), salary: 55000, emergencyContact: { name: "Jane Doe", relationship: "Spouse", phoneNumber: "987-654-3210" }, createdAt: new Date(), updatedAt: new Date() },
    { firstName: "Alice", lastName: "Smith", email: "alice.smith@abarto.com", position: "Operator", department: "Production", dateEmployed: new Date("2022-07-01"), salary: 50000, emergencyContact: { name: "Bob Smith", relationship: "Father", phoneNumber: "111-222-3333" }, createdAt: new Date(), updatedAt: new Date() }
]);
print("Inserted Employees.");

// Products (Using provided IDs)
// db.products.insertOne({ _id: widgetId, name: "Heavy Duty Widget", price: 199.99, description: "A very durable widget.", category: "Widgets", quantity: 500, rating: 4.5, createdAt: new Date(), updatedAt: new Date() });
// db.products.insertOne({ _id: gearId, name: "Standard Gear", price: 49.50, description: "Standard issue gear.", category: "Gears", quantity: 1200, rating: 4.0, createdAt: new Date(), updatedAt: new Date() });
// print(`Used Product IDs: ${widgetId}, ${gearId}`); // Uncomment if inserting with specific IDs

// Raw Materials
db.rawmaterials.insertMany([
    { name: "Steel Coil", supplier: "Steel Inc.", quantity: 10, unit: "tonnes", unitCost: 800, lastOrdered: new Date("2023-10-01"), createdAt: new Date(), updatedAt: new Date() },
    { name: "Plastic Pellets", supplier: "PolyCorp", quantity: 500, unit: "kg", unitCost: 5, lastOrdered: new Date("2023-09-15"), createdAt: new Date(), updatedAt: new Date() }
]);
print("Inserted Raw Materials.");

// Suppliers (Using provided ID)
// db.suppliers.insertOne({ _id: supplierId, name: "Bolt Bonanza", contactPerson: "Barry Bolts", email: "barry@bolts.com", phone: "555-BOLT", address: "123 Screw St", createdAt: new Date(), updatedAt: new Date() });
// print(`Used Supplier ID: ${supplierId}`); // Uncomment if inserting with specific ID

// Supplies (Using Supplier ObjectId)
db.supplies.insertOne({ // Note: Collection name in script matches previous command 'suppliers'
    itemName: "M8 Hex Bolt", supplier: supplierId, quantity: 10000, unit: "pieces", lastOrdered: new Date("2023-11-01"), createdAt: new Date(), updatedAt: new Date()
});
print("Inserted Supplies.");

// Wholesale Orders (Using Product ObjectIds)
db.wholesaleorders.insertMany([
    { customerId: "CustomerABC", productId: widgetId, quantity: 50, totalPrice: 9500.00, orderDate: new Date("2023-10-20"), createdAt: new Date(), updatedAt: new Date() },
    { customerId: "CustomerXYZ", productId: gearId, quantity: 200, totalPrice: 9000.00, orderDate: new Date("2023-10-25"), createdAt: new Date(), updatedAt: new Date() }
]);
print("Inserted Wholesale Orders.");

// Security Logs (Using Admin ObjectId)
db.securitylogs.insertMany([
    { timestamp: new Date(), eventType: "Login Success", level: "info", userId: adminId, details: "Admin logged in successfully.", source: "192.168.1.100", createdAt: new Date(), updatedAt: new Date() },
    { timestamp: new Date(), eventType: "Configuration Change", level: "warn", userId: adminId, details: "System setting 'X' modified.", source: "System Cron", createdAt: new Date(), updatedAt: new Date() }
]);
print("Inserted Security Logs.");

// Reports
db.reports.insertOne({
    reportName: "Monthly Inventory Summary - Oct 2023", type: "inventory", generatedAt: new Date("2023-11-01"),
    parameters: { month: 10, year: 2023 }, filePath: "/reports/inventory_oct_2023.pdf", createdAt: new Date(), updatedAt: new Date()
});
print("Inserted Reports.");

// Safety Equipment
db.safetyequipments.insertMany([
    { equipmentName: "Fire Extinguisher A1", lastInspectionDate: new Date("2023-06-01"), nextInspectionDate: new Date("2024-06-01"), status: "ok", location: "Workshop Area 1", createdAt: new Date(), updatedAt: new Date() },
    { equipmentName: "Safety Harness B5", lastInspectionDate: new Date("2023-01-15"), nextInspectionDate: new Date("2024-01-15"), status: "ok", location: "High Bay Storage", createdAt: new Date(), updatedAt: new Date() }
]);
print("Inserted Safety Equipment.");

// Machinery Parts
db.machineryparts.insertMany([
    { name: "Main Drive Belt", type: "Belt", quantity: 5, price: 150.00, description: "Primary drive belt for Machine X", lastMaintenance: new Date("2023-09-01"), createdAt: new Date(), updatedAt: new Date() },
    { name: "Hydraulic Pump Filter", type: "Filter", quantity: 20, price: 75.50, description: "Filter for hydraulic system Y", lastMaintenance: new Date("2023-10-15"), createdAt: new Date(), updatedAt: new Date() }
]);
print("Inserted Machinery Parts.");

// Chemical Compounds
db.chemicalcompounds.insertMany([
    { compoundName: "Lubricant Oil Grade 5", formula: "N/A", quantity: 50, unit: "liters", storageLocation: "Chem Cabinet A", safetySheetUrl: "/sds/lube_oil_g5.pdf", createdAt: new Date(), updatedAt: new Date() },
    { compoundName: "Cleaning Solvent X", formula: "C6H12O", quantity: 20, unit: "liters", storageLocation: "Chem Cabinet B", safetySheetUrl: "/sds/solvent_x.pdf", createdAt: new Date(), updatedAt: new Date() }
]);
print("Inserted Chemical Compounds.");


print("\n--- Sample Data Insertion Complete ---");