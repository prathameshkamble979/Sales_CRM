const express = require('express');
const { body } = require('express-validator');
const {
    getDealsByLead,
    createDeal,
    updateDeal,
    deleteDeal,
} = require('../controllers/dealController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/deals/lead/:leadId  (supports ?stage=)
router.get('/lead/:leadId', protect, getDealsByLead);

// POST /api/deals
router.post(
    '/',
    protect,
    [
        body('title').notEmpty().withMessage('Deal title is required'),
        body('leadId').notEmpty().withMessage('Lead ID is required'),
        body('stage')
            .optional()
            .isIn(['Prospect', 'Negotiation', 'Won', 'Lost'])
            .withMessage('Invalid deal stage'),
    ],
    createDeal
);

// PUT /api/deals/:id
router.put('/:id', protect, updateDeal);

// DELETE /api/deals/:id
router.delete('/:id', protect, deleteDeal);

module.exports = router;
