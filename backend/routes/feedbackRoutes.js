const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

router.post('/', protect, submitFeedback);
router.get('/:complaintId', protect, getFeedback);

module.exports = router;
