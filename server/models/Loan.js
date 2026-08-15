const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  principal: { type: Number, required: true, min: 1 },
  interestRate: { type: Number, default: 10, min: 0 },
  totalPayable: { type: Number, required: true, min: 1 },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  balance: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Pending', 'Active', 'Paid', 'Overdue'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
