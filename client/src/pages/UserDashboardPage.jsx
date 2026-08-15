import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Plus, HandCoins, CheckCircle, History, User } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const UserDashboardPage = () => {
  const { loans: initialLoans = [], applications: initialApplications = [] } = useLoaderData();
  const [loans, setLoans] = useState(initialLoans);
  const [applications, setApplications] = useState(initialApplications);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [form, setForm] = useState({ principal: '', loanTerm: '12', purpose: '' });
  const [activeTab, setActiveTab] = useState('active');

  const handleApplyLoan = async (event) => {
    event.preventDefault();
    try {
      await api.post('/applications', {
        principal: Number(form.principal),
        loanTerm: Number(form.loanTerm),
        purpose: form.purpose,
      });
      toast.success('Loan application submitted successfully');
      setForm({ principal: '', loanTerm: '12', purpose: '' });
      setShowApplyForm(false);
      const { data } = await api.get('/applications/my');
      if (data?.success) setApplications(data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to submit application');
    }
  };

  const activeLoans = loans.filter((loan) => loan.status === 'Active');
  const pendingApplications = applications.filter((app) => app.status === 'Pending');
  const approvedApplications = applications.filter((app) => app.status === 'Approved');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active loans</p>
              <p className="mt-1 text-2xl font-semibold text-[#2f241d]">{activeLoans.length}</p>
            </div>
            <div className="rounded-2xl bg-[#fde68a] p-3 text-[#8c4f16]"><HandCoins size={20} /></div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending applications</p>
              <p className="mt-1 text-2xl font-semibold text-[#2f241d]">{pendingApplications.length}</p>
            </div>
            <div className="rounded-2xl bg-[#fed7aa] p-3 text-[#8c4f16]"><Plus size={20} /></div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Approved loans</p>
              <p className="mt-1 text-2xl font-semibold text-[#2f241d]">{approvedApplications.length}</p>
            </div>
            <div className="rounded-2xl bg-[#dcfce7] p-3 text-[#8c4f16]"><CheckCircle size={20} /></div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#2f241d]">Apply for loan</h3>
          <button onClick={() => setShowApplyForm(!showApplyForm)} className="rounded-full bg-[#c97b28] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a8621e]">
            {showApplyForm ? 'Cancel' : '+ New application'}
          </button>
        </div>

        {showApplyForm && (
          <form onSubmit={handleApplyLoan} className="space-y-4 rounded-2xl border border-[#f2e8d8] p-4 bg-[#fef9f3]">
            <input value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3" placeholder="Principal amount" type="number" required />
            <input value={form.loanTerm} onChange={(e) => setForm({ ...form, loanTerm: e.target.value })} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3" placeholder="Loan term (months)" type="number" required />
            <textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="min-h-20 w-full rounded-2xl border border-[#e7dccb] px-4 py-3" placeholder="Purpose of loan" />
            <div className="rounded-2xl bg-[#f0e3c8] border border-[#e7dccb] px-4 py-3 text-sm text-slate-700">
              <p className="font-semibold">Interest rate: 10% (Fixed)</p>
              <p className="text-xs text-slate-500 mt-1">Interest rates are set by the administrator</p>
            </div>
            <button type="submit" className="w-full rounded-2xl bg-[#c97b28] px-4 py-3 font-semibold text-white hover:bg-[#a8621e]">Submit application</button>
          </form>
        )}
      </div>

      <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <button onClick={() => setActiveTab('active')} className={`px-4 py-2 rounded-full font-semibold transition ${activeTab === 'active' ? 'bg-[#c97b28] text-white' : 'bg-[#f7ebd2] text-[#8c4f16]'}`}>
            Active loans ({activeLoans.length})
          </button>
          <button onClick={() => setActiveTab('applications')} className={`px-4 py-2 rounded-full font-semibold transition ${activeTab === 'applications' ? 'bg-[#c97b28] text-white' : 'bg-[#f7ebd2] text-[#8c4f16]'}`}>
            Applications
          </button>
          <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-full font-semibold transition ${activeTab === 'history' ? 'bg-[#c97b28] text-white' : 'bg-[#f7ebd2] text-[#8c4f16]'}`}>
            History
          </button>
        </div>

        {activeTab === 'active' && (
          <div className="space-y-3">
            {activeLoans.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No active loans yet</p>
            ) : (
              activeLoans.map((loan) => (
                <div key={loan._id} className="rounded-2xl border border-[#f2e8d8] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#2f241d]">Loan approved</p>
                      <p className="text-sm text-slate-500">Principal: NGN {loan.principal.toLocaleString()}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Active</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-lg bg-[#fef9f3] p-2">
                      <p className="text-slate-500">Balance</p>
                      <p className="font-semibold">NGN {loan.balance.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-[#fef9f3] p-2">
                      <p className="text-slate-500">Due date</p>
                      <p className="font-semibold">{loan.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No applications yet</p>
            ) : (
              applications.map((app) => (
                <div key={app._id} className="rounded-2xl border border-[#f2e8d8] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#2f241d]">NGN {app.principal.toLocaleString()}</p>
                      <p className="text-sm text-slate-500">{app.loanTerm} months at {app.interestRate}%</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {app.status}
                    </span>
                  </div>
                  {app.rejectionReason && <p className="mt-2 text-sm text-red-600">Reason: {app.rejectionReason}</p>}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {loans.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No loan history yet</p>
            ) : (
              loans.map((loan) => (
                <div key={loan._id} className="rounded-2xl border border-[#f2e8d8] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#2f241d]">NGN {loan.principal.toLocaleString()}</p>
                      <p className="text-sm text-slate-500">Issued: {loan.issueDate}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${loan.status === 'Paid' ? 'bg-green-100 text-green-700' : loan.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {loan.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
