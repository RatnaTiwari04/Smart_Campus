const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

// @desc    Submit feedback for a complaint
// @route   POST /api/feedback
// @access  Private (Student)
const submitFeedback = async (req, res) => {
  try {
    const { complaintId, rating, comment } = req.body;

    if (!complaintId || !rating) {
      return res.status(400).json({ message: 'Complaint ID and rating are required' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ message: 'Feedback can only be given for resolved complaints' });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({
      complaint: complaintId,
      submittedBy: req.user._id,
    });

    if (existingFeedback) {
      return res.status(400).json({ message: 'You have already submitted feedback for this complaint' });
    }

    const feedback = await Feedback.create({
      complaint: complaintId,
      rating,
      comment,
      submittedBy: req.user._id,
    });

    await feedback.populate('submittedBy', 'name email');
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get feedback for a complaint
// @route   GET /api/feedback/:complaintId
// @access  Private
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ complaint: req.params.complaintId })
      .populate('submittedBy', 'name email')
      .populate('complaint', 'complaintId title');

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all technicians
// @route   GET /api/users/technicians
// @access  Private (Admin)
const getTechnicians = async (req, res) => {
  try {
    const User = require('../models/User');
    const technicians = await User.find({ role: 'technician' }).select('-password');
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitFeedback, getFeedback, getTechnicians };
