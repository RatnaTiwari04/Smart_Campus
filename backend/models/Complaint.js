const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['WiFi', 'Electricity', 'Plumbing', 'Furniture', 'Water Leakage', 'Other'],
    },
    location: {
      type: String,
      required: [true, 'Please provide the location'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate complaintId before saving
complaintSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Complaint').countDocuments();
    this.complaintId = `CMP-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
