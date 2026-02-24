const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Lead name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['New', 'Contacted', 'Qualified', 'Lost'],
            default: 'New',
        },
        source: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
