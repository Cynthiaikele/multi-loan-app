const express = require('express');
const LoanApplication = require('../models/LoanApplication');
const Loan = require('../models/Loan');
const protect = require('../middleware/authMiddleware');
const { loanApplicationSchema, approveLoanApplicationSchema } = require('../validators/loanValidators');

const router = express.Router();

// Get all loan applications (admin only)
router.get('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only admins can view all applications' });
  }
  const applications = await LoanApplication.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, data: applications });
});

// Get user's own applications
router.get('/my', protect, async (req, res) => {
  const applications = await LoanApplication.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: applications });
});

// Create a new loan application
router.post('/', protect, async (req, res) => {
  const parsed = loanApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.issues.map((issue) => issue.message) });
  }

  const application = await LoanApplication.create({
    user: req.user._id,
    ...parsed.data,
    status: 'Pending',
  });

  res.status(201).json({ success: true, data: application });
});

// Get single application (admin or application owner)
router.get('/:id', protect, async (req, res) => {
  const application = await LoanApplication.findById(req.params.id).populate('user', 'name email');
  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

  if (req.user.role !== 'admin' && application.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  res.json({ success: true, data: application });
});

// Approve or reject application (admin only)
router.patch('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only admins can approve applications' });
  }

  const parsed = approveLoanApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.issues.map((issue) => issue.message) });
  }

  const application = await LoanApplication.findById(req.params.id).populate('user');
  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

  if (parsed.data.status === 'Approved') {
    const interestRate = 10; // Fixed interest rate
    const totalPayable = application.principal + (application.principal * interestRate) / 100;
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setMonth(dueDate.getMonth() + application.loanTerm);

    const loan = await Loan.create({
      user: application.user._id,
      principal: application.principal,
      interestRate,
      totalPayable,
      issueDate,
      dueDate,
      balance: totalPayable,
      status: 'Active',
    });

    application.status = 'Approved';
    application.approvedAt = new Date();
    await application.save();

    return res.json({ success: true, data: { application, loan }, message: 'Application approved and loan created' });
  }

  if (parsed.data.status === 'Rejected') {
    application.status = 'Rejected';
    application.rejectionReason = parsed.data.rejectionReason || '';
    await application.save();

    return res.json({ success: true, data: application, message: 'Application rejected' });
  }

  res.status(400).json({ success: false, message: 'Invalid status' });
});

module.exports = router;
