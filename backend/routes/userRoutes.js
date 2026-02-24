const express = require('express');
const { getAllUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// All user routes are admin-only
// GET /api/users
router.get('/', protect, authorizeRoles('admin'), getAllUsers);

// GET /api/users/:id
router.get('/:id', protect, authorizeRoles('admin'), getUserById);

module.exports = router;
