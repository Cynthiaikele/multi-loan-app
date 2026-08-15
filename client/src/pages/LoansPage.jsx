import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const LoansPage = () => {
  const { applications: initialApplications = [], borrowers: initialBorrowers = [] } = useLoaderData();
  const [borrowers, setBorrowers] = useState(initialBorrowers);
  const [applications, setApplications] = useState(initialApplications);
  const [form, setForm] = useState({ userId: '', principal: '', issueDate: '', dueDate: '' });
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('Pending');
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [processingApplicationId, setProcessingApplicationId] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/loans', { ...form, principal: Number(form.principal) });
      toast.success('Loan created');
      setForm({ userId: '', principal: '', issueDate: '', dueDate: '' });
      const [{ data: appData }, { data: eligibleData }] = await Promise.all([
        api.get('/applications'),
        api.get('/borrowers/eligible'),
      ]);
      if (appData?.success) setApplications(appData.data || []);
      if (eligibleData?.success) setBorrowers(eligibleData.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create loan');
    }
  };

  const handleApproveApplication = async (appId) => {
    if (processingApplicationId) return;
    setProcessingApplicationId(appId);
    try {
      await api.patch(`/applications/${appId}`, { status: 'Approved' });
      toast.success('Application approved. Loan has been created.');
      const { data } = await api.get('/applications');
      if (data?.success) setApplications(data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to approve application');
    } finally {
      setProcessingApplicationId(null);
    }
  };

  const handleRejectApplication = async (appId) => {
    if (processingApplicationId) return;
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setProcessingApplicationId(appId);
    try {
      await api.patch(`/applications/${appId}`, { status: 'Rejected', rejectionReason });
      toast.success('Application rejected');
      setRejectingId(null);
      setRejectionReason('');
      const { data } = await api.get('/applications');
      if (data?.success) setApplications(data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to reject application');
    } finally {
      setProcessingApplicationId(null);
    }
  };

  const applicationGroups = {
    Pending: applications.filter((app) => app.status === 'Pending'),
    Approved: applications.filter((app) => app.status === 'Approved'),
    Rejected: applications.filter((app) => app.status === 'Rejected'),
  };

  const renderApplicationList = (status) => {
    const list = applicationGroups[status] || [];

    if (list.length === 0) {
      return <p className="py-8 text-center text-slate-500">No {status.toLowerCase()} applications</p>;
    }

    return list.map((app) => (
      <div key={app._id} className="rounded-2xl border border-[#f2e8d8] p-4">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-semibold text-[#2f241d]">{app.user?.name || 'Applicant'}</p>
            <p className="text-sm text-slate-500">{app.user?.email || 'No email'}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
            status === 'Approved' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}>{status}</span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-[#fef9f3] p-3">
            <p className="text-xs text-slate-500">Principal</p>
            <p className="mt-1 font-semibold text-[#2f241d]">NGN {Number(app.principal || 0).toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-[#fef9f3] p-3">
            <p className="text-xs text-slate-500">Interest rate</p>
            <p className="mt-1 font-semibold text-[#2f241d]">{app.interestRate}%</p>
          </div>
          <div className="rounded-lg bg-[#fef9f3] p-3">
            <p className="text-xs text-slate-500">Loan term</p>
            <p className="mt-1 font-semibold text-[#2f241d]">{app.loanTerm} months</p>
          </div>
          <div className="rounded-lg bg-[#fef9f3] p-3">
            <p className="text-xs text-slate-500">Total payable</p>
            <p className="mt-1 font-semibold text-[#2f241d]">NGN {((Number(app.principal || 0) * (1 + (Number(app.interestRate || 0) / 100)))).toLocaleString()}</p>
          </div>
        </div>

        {app.purpose && (
          <div className="mb-4 rounded-lg bg-[#fef9f3] p-3">
            <p className="text-xs text-slate-500">Purpose</p>
            <p className="mt-1 text-[#2f241d]">{app.purpose}</p>
          </div>
        )}

        {app.rejectionReason && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <p className="font-semibold">Rejection reason</p>
            <p className="mt-1">{app.rejectionReason}</p>
          </div>
        )}

        {status === 'Pending' && (
          rejectingId === app._id ? (
            <div className="space-y-3 rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleRejectApplication(app._id)}
                  disabled={!!processingApplicationId}
                  className="flex-1 rounded-lg bg-red-600 px-3 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Confirm rejection
                </button>
                <button
                  onClick={() => {
                    setRejectingId(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 rounded-lg border border-red-300 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => handleApproveApplication(app._id)}
                disabled={!!processingApplicationId}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <CheckCircle size={18} /> Approve
              </button>
              <button
                onClick={() => setRejectingId(app._id)}
                disabled={!!processingApplicationId}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <XCircle size={18} /> Reject
              </button>
            </div>
          )
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-[#f2e8d8]">
          {['Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`border-b-2 px-4 py-3 font-semibold transition ${
                activeTab === status
                  ? 'border-[#c97b28] text-[#c97b28]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {status === 'Pending' ? 'Pending applications' : status === 'Approved' ? 'Accepted applications' : 'Rejected applications'} ({applicationGroups[status].length})
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Create new loan</p>
                <h3 className="text-lg font-semibold text-[#2f241d]">Loan request</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLoanForm((prev) => !prev)}
                className="mt-2 rounded-2xl bg-[#f7ebd2] p-3 text-[#8c4f16] transition hover:bg-[#f2ddae]"
                aria-label={showLoanForm ? 'Hide loan request form' : 'Show loan request form'}
              >
                <Plus size={20} />
              </button>
            </div>

            {showLoanForm && (
              <form onSubmit={submit} className="space-y-4">
                <select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3">
                  <option value="">Select borrower</option>
                  {borrowers.map((borrower) => (
                    <option key={borrower._id} value={borrower.userId || borrower._id}>
                      {borrower.fullName}
                    </option>
                  ))}
                </select>
                <input value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3" placeholder="Principal" type="number" />
                <input value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3" type="date" />
                <input value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3" type="date" />
                <button className="w-full rounded-2xl bg-[#c97b28] px-4 py-3 font-semibold text-white hover:bg-[#a8621e]">Create loan</button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            {renderApplicationList(activeTab)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
