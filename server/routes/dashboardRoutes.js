const express = require('express');
const Borrower = require('../models/Borrower');
const Loan = require('../models/Loan');
const LoanApplication = require('../models/LoanApplication');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (_req, res) => {
  const borrowersCount = await Borrower.countDocuments();
  const activeLoans = await Loan.countDocuments({ status: 'Active' });
  const overdueLoans = await Loan.countDocuments({ status: 'Overdue' });
  const paidLoans = await Loan.countDocuments({ status: 'Paid' });
  const pendingApplications = await LoanApplication.countDocuments({ status: 'Pending' });
  const totalLoaned = await Loan.aggregate([{ $group: { _id: null, total: { $sum: '$principal' } } }]);
  const totalRepaid = await Loan.aggregate([{ $group: { _id: null, total: { $sum: { $subtract: ['$principal', '$balance'] } } } }]);
  const outstandingBalance = await Loan.aggregate([{ $group: { _id: null, total: { $sum: '$balance' } } }]);

  res.json({
    success: true,
    data: {
      borrowersCount,
      activeLoans,
      overdueLoans,
      paidLoans,
      pendingApplications,
      totalLoaned: totalLoaned[0]?.total || 0,
      totalRepaid: totalRepaid[0]?.total || 0,
      outstandingBalance: outstandingBalance[0]?.total || 0,
    },
  });
});

module.exports = router;
