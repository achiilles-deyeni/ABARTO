const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    reportName: {
        type: String,
        required: [true, 'Report name is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Report type is required'],
        enum: ['inventory', 'sales', 'safety', 'security', 'employee', 'custom'], // Example types
        trim: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },
    parameters: {
        type: Map,
        of: Schema.Types.Mixed // Allows storing various parameter types
    },
    filePath: {
        type: String, // Optional path to a stored report file
        trim: true
    },
    // Optional: Could store the actual report data if small, but often better to store files separately
    // data: Schema.Types.Mixed
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Report', reportSchema);
