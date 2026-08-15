import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

const HistoryPage = () => {
  const { loans: initialLoans = [] } = useLoaderData();
  const [search, setSearch] = useState('');
  const loans = initialLoans;

  const filteredLoans = loans.filter((loan) => {
    const borrowerName = (loan.borrower?.fullName || loan.user?.name || '').toLowerCase();
    return borrowerName.includes(search.toLowerCase());
  });

  const stats = {
    totalLoaned: loans.reduce((sum, loan) => sum + Number(loan.principal || 0), 0),
    totalPaid: loans.reduce((sum, loan) => sum + Math.max(0, Number(loan.principal || 0) - Number(loan.balance || 0)), 0),
    totalOutstanding: loans.reduce((sum, loan) => sum + Number(loan.balance || 0), 0),
  };

  return (
    <div className="space-y-6 rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-[#e8dccb] bg-[#fdf8ee] p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total loaned</p>
          <p className="mt-2 text-3xl font-semibold text-[#2f241d]">NGN {stats.totalLoaned.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl border border-[#e8dccb] bg-[#fdf8ee] p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total paid</p>
          <p className="mt-2 text-3xl font-semibold text-green-600">NGN {stats.totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl border border-[#e8dccb] bg-[#fdf8ee] p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total outstanding</p>
          <p className="mt-2 text-3xl font-semibold text-red-600">NGN {stats.totalOutstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Full history</p>
            <h3 className="text-xl font-semibold text-[#2f241d]">Loan history</h3>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-2xl border border-[#e7dccb] px-4 py-3 sm:w-72"
            placeholder="Search borrower name"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">Borrower</th>
                <th className="pb-3">Principal</th>
                <th className="pb-3">Paid</th>
                <th className="pb-3">Balance</th>
                <th className="pb-3">Due date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => (
                <tr key={loan._id} className="border-t border-[#f2e8d8]">
                  <td className="py-3 font-medium text-[#2f241d]">{loan.borrower?.fullName || loan.user?.name || 'Unknown borrower'}</td>
                  <td className="py-3">NGN {loan.principal.toLocaleString()}</td>
                  <td className="py-3">NGN {(loan.principal - loan.balance).toLocaleString()}</td>
                  <td className="py-3">NGN {loan.balance.toLocaleString()}</td>
                  <td className="py-3">{loan.dueDate}</td>
                  <td className="py-3"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${loan.status === 'Paid' ? 'bg-green-100 text-green-700' : loan.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{loan.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
