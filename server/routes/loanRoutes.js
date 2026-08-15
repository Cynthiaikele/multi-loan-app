const express = require('express');
const Loan = require('../models/Loan');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');
const { loanSchema } = require('../validators/loanValidators');

const router = express.Router();

const serializeLoan = (loan) => {
  const user = loan.user || {};
  return {
    ...(loan.toObject ? loan.toObject() : loan),
    user,
    borrower: user,
  };
};

router.get('/', protect, async (req, res) => {
  if (req.user.role === 'admin') {
    const loans = await Loan.find().populate('user', 'name email phone address').sort({ createdAt: -1 });
    return res.json({ success: true, data: loans.map(serializeLoan) });
  }
  // Users see only their own loans
  const loans = await Loan.find({ user: req.user._id }).populate('user', 'name email phone address').sort({ createdAt: -1 });
  res.json({ success: true, data: loans.map(serializeLoan) });
});

router.get('/:id', protect, async (req, res) => {
  const loan = await Loan.findById(req.params.id).populate('user', 'name email phone address');
  if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
  
  if (req.user.role !== 'admin' && loan.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to view this loan' });
  }
  
  res.json({ success: true, data: serializeLoan(loan) });
});

router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only admins can create loans directly' });
  }

  const parsed = loanSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.issues.map((issue) => issue.message) });
  }

  // For admin-created loans, they need to specify a user ID
  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const principal = parsed.data.principal;
  const interestRate = 10; // Fixed interest rate
  const totalPayable = principal + (principal * interestRate) / 100;

  const loan = await Loan.create({
    user: user._id,
    principal,
    interestRate,
    totalPayable,
    issueDate: parsed.data.issueDate,
    dueDate: parsed.data.dueDate,
    balance: totalPayable,
    status: 'Active',
  });

  const populatedLoan = await Loan.findById(loan._id).populate('user', 'name email phone address');
  res.status(201).json({ success: true, data: serializeLoan(populatedLoan) });
});

router.patch('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only admins can update loans' });
  }

  const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
  res.json({ success: true, data: loan });
});

router.delete('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only admins can delete loans' });
  }

  const loan = await Loan.findByIdAndDelete(req.params.id);
  if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
  res.json({ success: true, message: 'Loan deleted' });
});

module.exports = router;

