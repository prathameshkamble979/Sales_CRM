const express = require('express');
const { body } = require('express-validator');
const {
    getActivitiesByLead,
    createActivity,
    deleteActivity,
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/activities/lead/:leadId
router.get('/lead/:leadId', protect, getActivitiesByLead);

// POST /api/activities
router.post(
    '/',
    protect,
    [
        body('type')
            .isIn(['Call', 'Meeting', 'Note', 'Follow-up'])
            .withMessage('Type must be Call, Meeting, Note, or Follow-up'),
        body('description').notEmpty().withMessage('Description is required'),
        body('leadId').notEmpty().withMessage('Lead ID is required'),
    ],
    createActivity
);

// DELETE /api/activities/:id
router.delete('/:id', protect, deleteActivity);

module.exports = router;
