const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const securityLogSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
        index: true // Index for efficient time-based queries
    },
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        trim: true,
        index: true
    },
    level: {
        type: String,
        enum: ['info', 'warn', 'error', 'critical', 'debug'], // Example levels
        default: 'info',
        required: true,
        trim: true,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin', // Or 'User' if you have a general user model
        index: true,
        default: null // Allow system events without a specific user
    },
    details: {
        type: String,
        required: [true, 'Log details are required']
    },
    source: { // Optional: Source IP, service name, etc.
        type: String,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('SecurityLog', securityLogSchema);
