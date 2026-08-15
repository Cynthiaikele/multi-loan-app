import { User2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLoaderData } from 'react-router-dom';

const formatMoney = (value) => `NGN ${Number(value || 0).toLocaleString()}`;

const BorrowersPage = () => {
  const { borrowers: loadedBorrowers = [], loans: loadedLoans = [] } = useLoaderData();
  const borrowers = loadedBorrowers;
  const loans = loadedLoans;

  const borrowerMap = new Map(
    borrowers.map((borrower) => [String(borrower.userId || borrower._id), borrower])
  );

  const activeLoanCards = loans
    .filter((loan) => loan.status === 'Active')
    .map((loan) => {
      const userId = String(loan.user?._id || loan.user || '');
      const borrower = borrowerMap.get(userId) || {
        fullName: loan.user?.name || 'Unknown borrower',
        email: loan.user?.email || '',
        phone: loan.user?.phone || '',
        address: loan.user?.address || '',
      };

      return { ...loan, borrower };
    });

  const overdueLoanCards = loans
    .filter((loan) => loan.status === 'Overdue')
    .map((loan) => {
      const userId = String(loan.user?._id || loan.user || '');
      const borrower = borrowerMap.get(userId) || {
        fullName: loan.user?.name || 'Unknown borrower',
        email: loan.user?.email || '',
        phone: loan.user?.phone || '',
        address: loan.user?.address || '',
      };

      return { ...loan, borrower };
    });

  const renderLoanCard = (loan) => (
    <div key={loan._id} className="rounded-2xl border border-[#f2e8d8] bg-[#fffdf9] p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-[#2f241d]">{loan.borrower?.fullName || 'Unknown borrower'}</p>
          <p className="text-sm text-slate-500">{loan.borrower?.email || 'No email'}</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${loan.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {loan.status === 'Overdue' ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
          {loan.status}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[#fef9f3] p-3">
          <p className="text-xs text-slate-500">Phone</p>
          <p className="mt-1 font-medium text-[#2f241d]">{loan.borrower?.phone || 'Not provided'}</p>
        </div>
        <div className="rounded-xl bg-[#fef9f3] p-3">
          <p className="text-xs text-slate-500">Address</p>
          <p className="mt-1 font-medium text-[#2f241d]">{loan.borrower?.address || 'Not provided'}</p>
        </div>
        <div className="rounded-xl bg-[#fef9f3] p-3">
          <p className="text-xs text-slate-500">Principal</p>
          <p className="mt-1 font-medium text-[#2f241d]">{formatMoney(loan.principal)}</p>
        </div>
        <div className="rounded-xl bg-[#fef9f3] p-3">
          <p className="text-xs text-slate-500">Balance</p>
          <p className="mt-1 font-medium text-[#2f241d]">{formatMoney(loan.balance)}</p>
        </div>
        <div className="rounded-xl bg-[#fef9f3] p-3">
          <p className="text-xs text-slate-500">Interest rate</p>
          <p className="mt-1 font-medium text-[#2f241d]">{loan.interestRate}%</p>
        </div>
        <div className="rounded-xl bg-[#fef9f3] p-3">
          <p className="text-xs text-slate-500">Total payable</p>
          <p className="mt-1 font-medium text-[#2f241d]">{formatMoney(loan.totalPayable || loan.principal)}</p>
        </div>
        <div className="rounded-xl bg-[#fef9f3] p-3">
          <p className="text-xs text-slate-500">Issue date</p>
          <p className="mt-1 font-medium text-[#2f241d]">{loan.issueDate || 'N/A'}</p>
        </div>
        <div className="rounded-xl bg-[#fef9f3] p-3">
          <p className="text-xs text-slate-500">Due date</p>
          <p className="mt-1 font-medium text-[#2f241d]">{loan.dueDate || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Active and overdue borrowers</p>
            <h3 className="text-xl font-semibold text-[#2f241d]">Borrowers</h3>
          </div>
          <div className="rounded-2xl bg-[#f7ebd2] p-3 text-[#8c4f16]"><User2 size={20} /></div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-[#e8dccb] bg-[#f8fafc] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#2f241d]">
                <ShieldCheck size={18} className="text-green-600" />
                <h4 className="text-lg font-semibold">Active loans</h4>
              </div>
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">{activeLoanCards.length}</span>
            </div>
            <div className="space-y-4">
              {activeLoanCards.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No active loans</p>
              ) : activeLoanCards.map(renderLoanCard)}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8dccb] bg-[#fff7f7] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#2f241d]">
                <AlertTriangle size={18} className="text-red-600" />
                <h4 className="text-lg font-semibold">Overdue loans</h4>
              </div>
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">{overdueLoanCards.length}</span>
            </div>
            <div className="space-y-4">
              {overdueLoanCards.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No overdue loans</p>
              ) : overdueLoanCards.map(renderLoanCard)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowersPage;
