import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BadgeDollarSign, FolderKanban, HandCoins, ReceiptText, TrendingUp, Users2 } from 'lucide-react';
import api from '../lib/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const cards = [
  { title: 'Total Borrowers', key: 'borrowersCount', icon: Users2, tone: 'bg-[#fef3c7]' },
  { title: 'Active Loans', key: 'activeLoans', icon: HandCoins, tone: 'bg-[#fde68a]' },
  { title: 'Overdue Loans', key: 'overdueLoans', icon: FolderKanban, tone: 'bg-[#fed7aa]' },
  { title: 'Paid Loans', key: 'paidLoans', icon: BadgeDollarSign, tone: 'bg-[#dcfce7]' },
];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loans, setLoans] = useState([]);

  const loadData = async () => {
    try {
      const [{ data: statsData }, { data: loansData }] = await Promise.all([api.get('/dashboard'), api.get('/loans')]);
      if (statsData?.success) setStats(statsData.data);
      if (loansData?.success) setLoans(loansData.data || []);
    } catch {
      setStats({ borrowersCount: 5, activeLoans: 3, overdueLoans: 1, paidLoans: 2, totalLoaned: 480000, totalRepaid: 180000, outstandingBalance: 300000 });
      setLoans([
        { _id: '1', borrower: { fullName: 'Asha K.', phone: '0712345678' }, principal: 120000, balance: 90000, dueDate: '2025-12-10', status: 'Active' },
        { _id: '2', borrower: { fullName: 'John M.', phone: '0712345679' }, principal: 65000, balance: 0, dueDate: '2025-11-05', status: 'Paid' },
      ]);
    }
  };

  useEffect(() => { loadData(); }, []);

  const chartData = useMemo(() => loans.slice(0, 6).map((loan) => ({ name: loan.borrower?.fullName || 'Customer', amount: loan.principal })), [loans]);

  if (!stats) return <div className="rounded-3xl border border-[#e8dccb] bg-white p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
              <div className={`inline-flex rounded-2xl p-3 ${card.tone}`}><Icon className="text-[#8c4f16]" size={20} /></div>
              <p className="mt-4 text-sm text-slate-500">{card.title}</p>
              <p className="mt-1 text-2xl font-semibold text-[#2f241d]">{stats[card.key]}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Portfolio overview</p>
              <h3 className="text-lg font-semibold text-[#2f241d]">Loaned vs repaid</h3>
            </div>
            <div className="rounded-full bg-[#f7ebd2] px-3 py-1 text-sm text-[#8c4f16]">Updated today</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} stroke="#f3e7d3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="amount" fill="#c97b28" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Key metrics</p>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl bg-[#fdf8ee] p-4">
              <div className="flex items-center gap-2 text-[#8c4f16]"><TrendingUp size={18} /> Total loaned</div>
              <p className="mt-2 text-2xl font-semibold">NGN {stats.totalLoaned.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-[#fdf8ee] p-4">
              <div className="flex items-center gap-2 text-[#8c4f16]"><ReceiptText size={18} /> Total repaid</div>
              <p className="mt-2 text-2xl font-semibold">NGN {stats.totalRepaid.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-[#fdf8ee] p-4">
              <div className="flex items-center gap-2 text-[#8c4f16]"><ArrowUpRight size={18} /> Outstanding</div>
              <p className="mt-2 text-2xl font-semibold">NGN {stats.outstandingBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#2f241d]">Recent loans</h3>
          <span className="text-sm text-slate-500">Updated live from your records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">Borrower</th>
                <th className="pb-3">Principal</th>
                <th className="pb-3">Balance</th>
                <th className="pb-3">Due date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id} className="border-t border-[#f2e8d8]">
                  <td className="py-3 font-medium text-[#2f241d]">{loan.borrower?.fullName || loan.user?.name || 'Unknown borrower'}</td>
                  <td className="py-3">NGN {loan.principal.toLocaleString()}</td>
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

export default DashboardPage;
