const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getAssignedComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
  getDashboardStats,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

// Stats - must come before /:id to avoid conflict
router.get('/stats', protect, getDashboardStats);

// Student routes
router.post('/', protect, authorize('student'), createComplaint);
router.get('/my', protect, authorize('student'), getMyComplaints);

// Technician routes
router.get('/assigned', protect, authorize('technician'), getAssignedComplaints);

// Admin routes
router.get('/', protect, authorize('admin'), getAllComplaints);
router.put('/:id/assign', protect, authorize('admin'), assignComplaint);

// Shared routes
router.get('/:id', protect, getComplaintById);
router.put('/:id/status', protect, authorize('technician', 'admin'), updateComplaintStatus);

module.exports = router;
