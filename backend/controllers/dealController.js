const { validationResult } = require('express-validator');
const Deal = require('../models/Deal');
const Lead = require('../models/Lead');

// @desc    Get deals for a lead (optionally filter by stage)
// @route   GET /api/deals/lead/:leadId
// @access  Private
const getDealsByLead = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Sales user can only view deals for their own leads
        if (
            req.user.role === 'sales' &&
            lead.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { stage } = req.query;
        let filter = { lead: req.params.leadId };
        if (stage) filter.stage = stage;

        const deals = await Deal.find(filter)
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json(deals);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a deal for a lead
// @route   POST /api/deals
// @access  Private
const createDeal = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { title, value, stage, leadId, notes } = req.body;

        const lead = await Lead.findById(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Sales user can only create deals for their own leads
        if (
            req.user.role === 'sales' &&
            lead.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const deal = await Deal.create({
            title,
            value,
            stage,
            lead: leadId,
            assignedTo: req.user._id,
            notes,
        });

        res.status(201).json(deal);
    } catch (error) {
        next(error);
    }
};

// @desc    Update deal (stage or other fields)
// @route   PUT /api/deals/:id
// @access  Private
const updateDeal = async (req, res, next) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ message: 'Deal not found' });
        }

        // Sales user can only update their own deals
        if (
            req.user.role === 'sales' &&
            deal.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { title, value, stage, notes } = req.body;
        deal.title = title || deal.title;
        deal.value = value !== undefined ? value : deal.value;
        deal.stage = stage || deal.stage;
        deal.notes = notes !== undefined ? notes : deal.notes;

        const updatedDeal = await deal.save();
        res.json(updatedDeal);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a deal
// @route   DELETE /api/deals/:id
// @access  Private
const deleteDeal = async (req, res, next) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ message: 'Deal not found' });
        }

        // Sales user can only delete their own deals
        if (
            req.user.role === 'sales' &&
            deal.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await deal.deleteOne();
        res.json({ message: 'Deal removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDealsByLead, createDeal, updateDeal, deleteDeal };
