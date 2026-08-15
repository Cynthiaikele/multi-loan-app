const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  principal: { type: Number, required: true, min: 1 },
  loanTerm: { type: Number, required: true, min: 1 },
  purpose: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  rejectionReason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
