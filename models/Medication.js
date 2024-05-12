const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicationSchema = new Schema({
  name: String,
  dosage: String,
  pillCount: Number,
  startDate: Date,
  endDate: Date,
  intervalHours: Number,
  //sickness: String,
  status: { type: String, default: 'In Progress' }  // In Progress, Completed, Cancelled
});

module.exports = mongoose.model('Medication', medicationSchema);
