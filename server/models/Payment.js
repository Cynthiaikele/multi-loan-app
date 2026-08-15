const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  loan: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  amount: { type: Number, required: true, min: 1 },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: 'Cash' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
