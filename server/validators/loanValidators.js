const { z } = require('zod');

const borrowerSchema = z.object({
  user: z.string().min(1, 'User is required').optional(),
  fullName: z.string().min(2, 'Full name is required').optional(),
  phone: z.string().min(7, 'Phone number is required').optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

const loanSchema = z.object({
  principal: z.coerce.number().positive('Principal must be positive'),
  interestRate: z.coerce.number().min(0, 'Interest rate cannot be negative').optional().default(10),
  issueDate: z.string().min(1),
  dueDate: z.string().min(1),
});

const paymentSchema = z.object({
  loan: z.string().min(1, 'Loan is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  paymentDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

const loanApplicationSchema = z.object({
  principal: z.coerce.number().positive('Principal must be positive'),
  loanTerm: z.coerce.number().positive('Loan term must be positive'),
  purpose: z.string().optional(),
});

const approveLoanApplicationSchema = z.object({
  status: z.enum(['Approved', 'Rejected']),
  rejectionReason: z.string().optional(),
});

module.exports = { borrowerSchema, loanSchema, paymentSchema, loanApplicationSchema, approveLoanApplicationSchema };
