require('dotenv').config({ path: '../.env' }); // Load environment variables from root .env
const mongoose = require('mongoose');
const db = require('../config/db'); // Adjust path if needed

// Import all models (adjust paths and add all your models)
const Admin = require('../models/admin');
const ChemicalCompound = require('../models/chemicalCompound');
const Employee = require('../models/employee');
const IndustrialSupply = require('../models/industrialSupply');
const MachineryPart = require('../models/machineryPart');
const Product = require('../models/products'); // Assuming this is the correct name
const RawMaterial = require('../models/rawMaterial');
const SafetyEquipment = require('../models/safetyEquipment');
const WholesaleOrder = require('../models/wholesaleOrder');
// Add any other models here...

const models = [
    { name: 'Admin', model: Admin },
    { name: 'ChemicalCompound', model: ChemicalCompound },
    { name: 'Employee', model: Employee },
    { name: 'IndustrialSupply', model: IndustrialSupply },
    { name: 'MachineryPart', model: MachineryPart },
    { name: 'Product', model: Product },
    { name: 'RawMaterial', model: RawMaterial },
    { name: 'SafetyEquipment', model: SafetyEquipment },
    { name: 'WholesaleOrder', model: WholesaleOrder },
    // Add other models here
];

const createAllIndexes = async () => {
    console.log('Connecting to database...');
    // Assuming db() function establishes connection
    // await db();
    // OR if db.js just exports config, connect manually:
    try {
        if (mongoose.connection.readyState === 0) { // Check if not already connected
             await mongoose.connect(process.env.MONGODB_URI, {
                // useNewUrlParser: true, // Deprecated
                // useUnifiedTopology: true, // Deprecated
                // useCreateIndex: true, // Not supported
                // useFindAndModify: false // Not supported
            });
            console.log('MongoDB Connected successfully.');
        } else {
            console.log('Already connected to MongoDB.');
        }

        console.log('\nStarting index synchronization...');

        for (const item of models) {
            if (item.model && typeof item.model.syncIndexes === 'function') {
                console.log(`Syncing indexes for ${item.name}...`);
                try {
                    await item.model.syncIndexes();
                    console.log(` -> Indexes for ${item.name} synced successfully.`);
                } catch (err) {
                    console.error(` !! Error syncing indexes for ${item.name}:`, err.message);
                }
            } else {
                console.warn(` !! Model ${item.name} not found or doesn't have syncIndexes method.`);
            }
        }

        console.log('\nIndex synchronization process completed.');

    } catch (error) {
        console.error('Error connecting to database or creating indexes:', error);
        process.exit(1);
    } finally {
        // Close the database connection
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log('\nMongoDB connection closed.');
        }
    }
};

createAllIndexes();
