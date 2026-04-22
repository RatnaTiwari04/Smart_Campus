const express = require('express');
const router = express.Router();
const { getTechnicians } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router.get('/technicians', protect, authorize('admin'), getTechnicians);

module.exports = router;
