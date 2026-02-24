const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['Call', 'Meeting', 'Note', 'Follow-up'],
            required: [true, 'Activity type is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lead',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
