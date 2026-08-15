import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { History, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserLoanHistoryPage = () => {
  const { user } = useAuth();
  const { loans: initialLoans = [] } = useLoaderData();
  const [loans] = useState(initialLoans);
  const [filteredLoans, setFilteredLoans] = useState(initialLoans);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const filtered = loans.filter((loan) =>
      loan.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      loan.principal?.toString().includes(search)
    );
    setFilteredLoans(filtered);
  }, [search, loans]);

  const stats = {
    totalLoaned: loans.reduce((sum, loan) => sum + Number(loan.principal || 0), 0),
    totalPaid: loans.reduce((sum, loan) => sum + Math.max(0, Number(loan.principal || 0) - Number(loan.balance || 0)), 0),
    totalOutstanding: loans.reduce((sum, loan) => sum + Number(loan.balance || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total loaned</p>
          <p className="mt-2 text-3xl font-semibold text-[#2f241d]">NGN {stats.totalLoaned.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total paid</p>
          <p className="mt-2 text-3xl font-semibold text-green-600">NGN {stats.totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total outstanding</p>
          <p className="mt-2 text-3xl font-semibold text-red-600">NGN {stats.totalOutstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#f7ebd2] p-3 text-[#8c4f16]">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#2f241d]">Loan history</h2>
              <p className="text-sm text-slate-500">View all your loans and repayments</p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-[#e7dccb] px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by loan amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none"
          />
        </div>

        <div className="space-y-3">
          {filteredLoans.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No loans found</p>
          ) : (
            filteredLoans.map((loan) => (
              <div key={loan._id} className="rounded-2xl border border-[#f2e8d8] p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-[#2f241d]">Loan #{loan._id?.slice(-6) || 'N/A'}</p>
                    <p className="text-sm text-slate-500">Principal: NGN {loan.principal?.toLocaleString() || 0}</p>
                  </div>
                  <span
                    className={`rounded-full px-4 py-1 text-xs font-semibold ${
                      loan.status === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : loan.status === 'Overdue'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {loan.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg bg-[#fef9f3] p-3">
                    <p className="text-xs text-slate-500">Interest rate</p>
                    <p className="mt-1 font-semibold text-[#2f241d]">{loan.interestRate}%</p>
                  </div>
                  <div className="rounded-lg bg-[#fef9f3] p-3">
                    <p className="text-xs text-slate-500">Total payable</p>
                    <p className="mt-1 font-semibold text-[#2f241d]">NGN {loan.totalPayable?.toLocaleString() || 0}</p>
                  </div>
                  <div className="rounded-lg bg-[#fef9f3] p-3">
                    <p className="text-xs text-slate-500">Balance</p>
                    <p className="mt-1 font-semibold text-[#2f241d]">NGN {loan.balance?.toLocaleString() || 0}</p>
                  </div>
                  <div className="rounded-lg bg-[#fef9f3] p-3">
                    <p className="text-xs text-slate-500">Due date</p>
                    <p className="mt-1 font-semibold text-[#2f241d]">{loan.dueDate}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <span>Issued: {loan.issueDate}</span>
                  <span>•</span>
                  <span>Term: {Math.ceil((new Date(loan.dueDate) - new Date(loan.issueDate)) / (1000 * 60 * 60 * 24 * 30))} months</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLoanHistoryPage;
