const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      createdBy: req.user._id,
    });

    await complaint.populate('createdBy', 'name email role');
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my complaints (student)
// @route   GET /api/complaints/my
// @access  Private (Student)
const getMyComplaints = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;

    const query = { createdBy: req.user._id };
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      complaints,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints (Admin)
// @route   GET /api/complaints
// @access  Private (Admin)
const getAllComplaints = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('createdBy', 'name email rollNumber')
      .populate('assignedTo', 'name email employeeId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      complaints,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaints assigned to technician
// @route   GET /api/complaints/assigned
// @access  Private (Technician)
const getAssignedComplaints = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = { assignedTo: req.user._id };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      complaints,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('createdBy', 'name email rollNumber')
      .populate('assignedTo', 'name email employeeId');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign complaint to technician
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
const assignComplaint = async (req, res) => {
  try {
    const { technicianId } = req.body;

    const technician = await User.findById(technicianId);
    if (!technician || technician.role !== 'technician') {
      return res.status(400).json({ message: 'Invalid technician ID' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: technicianId, status: 'Assigned' },
      { new: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Technician/Admin)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Assigned', 'In Progress', 'Resolved'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/complaints/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    let matchQuery = {};
    if (req.user.role === 'student') {
      matchQuery.createdBy = req.user._id;
    } else if (req.user.role === 'technician') {
      matchQuery.assignedTo = req.user._id;
    }

    const total = await Complaint.countDocuments(matchQuery);
    const pending = await Complaint.countDocuments({ ...matchQuery, status: 'Pending' });
    const assigned = await Complaint.countDocuments({ ...matchQuery, status: 'Assigned' });
    const inProgress = await Complaint.countDocuments({ ...matchQuery, status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ ...matchQuery, status: 'Resolved' });

    // Average resolution time (in days) for resolved complaints
    const resolvedComplaints = await Complaint.find({
      ...matchQuery,
      status: 'Resolved',
    }).select('createdAt updatedAt');

    let avgResolutionTime = 0;
    if (resolvedComplaints.length > 0) {
      const totalTime = resolvedComplaints.reduce((acc, c) => {
        return acc + (new Date(c.updatedAt) - new Date(c.createdAt));
      }, 0);
      avgResolutionTime = (totalTime / resolvedComplaints.length / (1000 * 60 * 60 * 24)).toFixed(1);
    }

    res.json({ total, pending, assigned, inProgress, resolved, avgResolutionTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getAssignedComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
  getDashboardStats,
};
