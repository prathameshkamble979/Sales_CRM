const { validationResult } = require('express-validator');
const Activity = require('../models/Activity');
const Lead = require('../models/Lead');

// @desc    Get all activities for a lead
// @route   GET /api/activities/lead/:leadId
// @access  Private
const getActivitiesByLead = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Sales user can only view activities for their own leads
        if (
            req.user.role === 'sales' &&
            lead.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const activities = await Activity.find({ lead: req.params.leadId })
            .populate('createdBy', 'name email')
            .sort({ date: -1 });

        res.json(activities);
    } catch (error) {
        next(error);
    }
};

// @desc    Log a new activity for a lead
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { type, description, leadId, date } = req.body;

        const lead = await Lead.findById(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Sales user can only log activities for their own leads
        if (
            req.user.role === 'sales' &&
            lead.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const activity = await Activity.create({
            type,
            description,
            lead: leadId,
            createdBy: req.user._id,
            date: date || Date.now(),
        });

        const populated = await activity.populate('createdBy', 'name email');
        res.status(201).json(populated);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res, next) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Sales user can only delete their own activities
        if (
            req.user.role === 'sales' &&
            activity.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await activity.deleteOne();
        res.json({ message: 'Activity removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getActivitiesByLead, createActivity, deleteActivity };
