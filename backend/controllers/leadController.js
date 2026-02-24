const { validationResult } = require('express-validator');
const Lead = require('../models/Lead');

// @desc    Get all leads (admin sees all, sales sees own)
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res, next) => {
    try {
        const { search, status } = req.query;

        // Build filter based on role
        let filter = {};
        if (req.user.role === 'sales') {
            filter.assignedTo = req.user._id;
        }
        if (status) {
            filter.status = status;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
            ];
        }

        const leads = await Lead.find(filter)
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json(leads);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id).populate(
            'assignedTo',
            'name email'
        );

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Sales user can only view their own lead
        if (
            req.user.role === 'sales' &&
            lead.assignedTo._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(lead);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { name, email, phone, company, status, source, notes } = req.body;

        // Check duplicate email
        const emailExists = await Lead.findOne({ email: email.toLowerCase() });
        if (emailExists) {
            return res.status(400).json({ message: 'A lead with this email already exists' });
        }

        // Check duplicate phone (only if phone is provided)
        if (phone && phone.trim()) {
            const phoneExists = await Lead.findOne({ phone: phone.trim() });
            if (phoneExists) {
                return res.status(400).json({ message: 'A lead with this phone number already exists' });
            }
        }

        const lead = await Lead.create({
            name,
            email,
            phone,
            company,
            status,
            source,
            notes,
            assignedTo: req.user._id,
        });

        res.status(201).json(lead);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Sales user can only update their own lead
        if (
            req.user.role === 'sales' &&
            lead.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { name, email, phone, company, status, source, notes } = req.body;

        // Check duplicate email (exclude current lead)
        if (email && email.toLowerCase() !== lead.email) {
            const emailExists = await Lead.findOne({ email: email.toLowerCase(), _id: { $ne: lead._id } });
            if (emailExists) {
                return res.status(400).json({ message: 'A lead with this email already exists' });
            }
        }

        // Check duplicate phone (exclude current lead, only if phone is provided)
        if (phone && phone.trim() && phone.trim() !== lead.phone) {
            const phoneExists = await Lead.findOne({ phone: phone.trim(), _id: { $ne: lead._id } });
            if (phoneExists) {
                return res.status(400).json({ message: 'A lead with this phone number already exists' });
            }
        }

        lead.name = name || lead.name;
        lead.email = email || lead.email;
        lead.phone = phone !== undefined ? phone : lead.phone;
        lead.company = company !== undefined ? company : lead.company;
        lead.status = status || lead.status;
        lead.source = source !== undefined ? source : lead.source;
        lead.notes = notes !== undefined ? notes : lead.notes;

        const updatedLead = await lead.save();
        res.json(updatedLead);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Sales user can only delete their own lead
        if (
            req.user.role === 'sales' &&
            lead.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await lead.deleteOne();
        res.json({ message: 'Lead removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getLeads, getLeadById, createLead, updateLead, deleteLead };
