const express = require('express');
const { body } = require('express-validator');
const {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/leads  (supports ?search=&status=)
router.get('/', protect, getLeads);

// GET /api/leads/:id
router.get('/:id', protect, getLeadById);

// POST /api/leads
router.post(
    '/',
    protect,
    [
        body('name').notEmpty().withMessage('Lead name is required'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('phone').optional({ checkFalsy: true }).isMobilePhone().withMessage('Please enter a valid phone number'),
    ],
    createLead
);

// PUT /api/leads/:id
router.put(
    '/:id',
    protect,
    [
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Invalid email'),
        body('phone').optional({ checkFalsy: true }).isMobilePhone().withMessage('Please enter a valid phone number'),
    ],
    updateLead
);

// DELETE /api/leads/:id
router.delete('/:id', protect, deleteLead);

module.exports = router;
