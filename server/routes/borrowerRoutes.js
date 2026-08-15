const express = require('express');
const Borrower = require('../models/Borrower');
const User = require('../models/User');
const Loan = require('../models/Loan');
const protect = require('../middleware/authMiddleware');
const { borrowerSchema } = require('../validators/loanValidators');

const router = express.Router();

const serializeUserBorrower = (user) => ({
  _id: user._id,
  fullName: user.name || '',
  phone: user.phone || '',
  email: user.email || '',
  address: user.address || '',
  userId: user._id,
});

const serializeBorrower = (borrower) => {
  const user = borrower.user || {};
  return {
    ...borrower.toObject ? borrower.toObject() : borrower,
    fullName: borrower.fullName || user.name || '',
    phone: borrower.phone || user.phone || '',
    email: borrower.email || user.email || '',
    address: borrower.address || user.address || '',
    userId: user._id || borrower.user || null,
  };
};

router.get('/eligible', protect, async (_req, res) => {
  const activeUserIds = await Loan.distinct('user', { status: { $in: ['Active', 'Overdue'] } });
  const users = await User.find({ _id: { $nin: activeUserIds }, role: 'user' }).select('name email phone address').sort({ createdAt: -1 });

  res.json({ success: true, data: users.map(serializeUserBorrower) });
});

router.get('/', protect, async (_req, res) => {
  const activeUserIds = await Loan.distinct('user', { status: { $in: ['Active', 'Overdue'] } });
  const users = await User.find({ _id: { $in: activeUserIds }, role: 'user' }).select('name email phone address').sort({ createdAt: -1 });

  res.json({ success: true, data: users.map(serializeUserBorrower) });
});

router.get('/:id', protect, async (req, res) => {
  const borrower = await Borrower.findById(req.params.id).populate('user', 'name email phone address');
  if (!borrower) return res.status(404).json({ success: false, message: 'Borrower not found' });
  res.json({ success: true, data: serializeBorrower(borrower) });
});

router.post('/', protect, async (req, res) => {
  const parsed = borrowerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.issues.map((issue) => issue.message) });
  }

  const userId = parsed.data.user || req.body.user;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User is required' });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const borrower = await Borrower.create({
    ...parsed.data,
    user: user._id,
    fullName: parsed.data.fullName || user.name,
    phone: parsed.data.phone || user.phone,
    email: parsed.data.email || user.email,
    address: parsed.data.address || user.address,
  });

  const populated = await Borrower.findById(borrower._id).populate('user', 'name email phone address');
  res.status(201).json({ success: true, data: serializeBorrower(populated) });
});

router.patch('/:id', protect, async (req, res) => {
  const parsed = borrowerSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.issues.map((issue) => issue.message) });
  }

  if (parsed.data.user) {
    const user = await User.findById(parsed.data.user);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  }

  const borrower = await Borrower.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).populate('user', 'name email phone address');
  if (!borrower) return res.status(404).json({ success: false, message: 'Borrower not found' });
  res.json({ success: true, data: serializeBorrower(borrower) });
});

router.delete('/:id', protect, async (req, res) => {
  const borrower = await Borrower.findByIdAndDelete(req.params.id);
  if (!borrower) return res.status(404).json({ success: false, message: 'Borrower not found' });
  res.json({ success: true, message: 'Borrower deleted' });
});

module.exports = router;
