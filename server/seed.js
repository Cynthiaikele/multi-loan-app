const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Loan = require('./models/Loan');
const Payment = require('./models/Payment');
const LoanApplication = require('./models/LoanApplication');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/micro-loan-tracker');

  await Promise.all([
    User.deleteMany(),
    Loan.deleteMany(),
    Payment.deleteMany(),
    LoanApplication.deleteMany(),
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@microloan.dev',
    password: await bcrypt.hash('password123', 10),
    role: 'admin',
  });

  const testUser = await User.create({
    name: 'John Doe',
    email: 'user@microloan.dev',
    password: await bcrypt.hash('password123', 10),
    phone: '0712345678',
    address: 'Nairobi',
    role: 'user',
  });

  // Create additional users as borrowers
  const borrowers = await User.insertMany([
    {
      name: 'Asha Wanjiku',
      email: 'asha@example.com',
      password: await bcrypt.hash('password123', 10),
      phone: '0712345678',
      address: 'Nairobi',
      role: 'user',
    },
    {
      name: 'Brian Otieno',
      email: 'brian@example.com',
      password: await bcrypt.hash('password123', 10),
      phone: '0723456789',
      address: 'Kisumu',
      role: 'user',
    },
    {
      name: 'Cynthia Njeri',
      email: 'cynthia@example.com',
      password: await bcrypt.hash('password123', 10),
      phone: '0734567890',
      address: 'Mombasa',
      role: 'user',
    },
  ]);

  const loanOne = await Loan.create({
    user: borrowers[0]._id,
    principal: 120000,
    interestRate: 10,
    totalPayable: 132000,
    issueDate: '2025-01-10',
    dueDate: '2025-10-12',
    balance: 90000,
    status: 'Active',
  });
  const loanTwo = await Loan.create({
    user: borrowers[1]._id,
    principal: 80000,
    interestRate: 10,
    totalPayable: 88000,
    issueDate: '2025-02-01',
    dueDate: '2025-08-20',
    balance: 0,
    status: 'Paid',
  });
  const loanThree = await Loan.create({
    user: borrowers[2]._id,
    principal: 150000,
    interestRate: 10,
    totalPayable: 165000,
    issueDate: '2025-03-15',
    dueDate: '2025-09-30',
    balance: 150000,
    status: 'Overdue',
  });

  await Payment.insertMany([
    {
      loan: loanOne._id,
      amount: 30000,
      paymentDate: '2025-06-01',
      paymentMethod: 'Cash',
      notes: 'Partial repayment',
    },
    {
      loan: loanTwo._id,
      amount: 80000,
      paymentDate: '2025-06-10',
      paymentMethod: 'M-Pesa',
      notes: 'Full repayment',
    },
  ]);

  // Create sample loan applications - mix of statuses
  await LoanApplication.insertMany([
    {
      user: testUser._id,
      principal: 50000,
      loanTerm: 12,
      purpose: 'Business expansion',
      status: 'Pending',
    },
    {
      user: testUser._id,
      principal: 75000,
      loanTerm: 24,
      purpose: 'Equipment purchase',
      status: 'Approved',
      approvedAt: new Date(),
    },
    {
      user: testUser._id,
      principal: 40000,
      loanTerm: 6,
      purpose: 'Working capital',
      status: 'Rejected',
      rejectionReason: 'Insufficient credit score',
    },
  ]);

  console.log('Seed data created:', {
    admin: admin.email,
    testUser: testUser.email,
    borrowers: borrowers.length,
    loans: 3,
    applications: 3,
  });
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});


