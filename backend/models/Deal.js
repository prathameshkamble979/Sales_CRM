const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Deal title is required'],
            trim: true,
        },
        value: {
            type: Number,
            default: 0,
        },
        stage: {
            type: String,
            enum: ['Prospect', 'Negotiation', 'Won', 'Lost'],
            default: 'Prospect',
        },
        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lead',
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Deal', dealSchema);
