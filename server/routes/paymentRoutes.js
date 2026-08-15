const express = require('express');
const Payment = require('../models/Payment');
const Loan = require('../models/Loan');
const protect = require('../middleware/authMiddleware');
const { paymentSchema } = require('../validators/loanValidators');

const router = express.Router();

router.get('/', protect, async (_req, res) => {
  const payments = await Payment.find().populate({ path: 'loan', populate: { path: 'user' } }).sort({ paymentDate: -1 });
  res.json({ success: true, data: payments });
});

router.post('/', protect, async (req, res) => {
  const parsed = paymentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.issues.map((issue) => issue.message) });
  }

  const loan = await Loan.findById(parsed.data.loan);
  if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });

  const nextBalance = loan.balance - parsed.data.amount;
  const updatedBalance = nextBalance > 0 ? nextBalance : 0;
  const newStatus = updatedBalance === 0 ? 'Paid' : new Date(loan.dueDate) < new Date() ? 'Overdue' : loan.status;

  const payment = await Payment.create(parsed.data);
  await Loan.findByIdAndUpdate(parsed.data.loan, { balance: updatedBalance, status: newStatus });

  res.status(201).json({ success: true, data: payment });
});

module.exports = router;
