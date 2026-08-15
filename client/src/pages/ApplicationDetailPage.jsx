import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLoaderData } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { application: initialApplication } = useLoaderData();
  const [application, setApplication] = useState(initialApplication);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setApplication(initialApplication);
  }, [initialApplication]);

  const handleApprove = async () => {
    if (user?.role !== 'admin') {
      toast.error('Only admins can approve applications');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.patch(`/applications/${id}`, { status: 'Approved' });
      if (data?.success) {
        toast.success('Application approved and loan created');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to approve application');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (user?.role !== 'admin') {
      toast.error('Only admins can reject applications');
      return;
    }
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.patch(`/applications/${id}`, { status: 'Rejected', rejectionReason });
      if (data?.success) {
        toast.success('Application rejected');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to reject application');
    } finally {
      setLoading(false);
    }
  };

  if (!application) return <div className="rounded-3xl border border-[#e8dccb] bg-white p-10 text-center">Loading application...</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#c97b28] font-semibold hover:text-[#a8621e]">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="rounded-3xl border border-[#e8dccb] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#2f241d]">Loan application</h2>
            <p className="text-sm text-slate-500">{application.user?.name} • {application.user?.email}</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${application.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : application.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {application.status}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#fef9f3] p-4">
            <p className="text-sm text-slate-500">Principal amount</p>
            <p className="mt-2 text-3xl font-semibold text-[#2f241d]">NGN {application.principal.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-[#fef9f3] p-4">
            <p className="text-sm text-slate-500">Interest rate</p>
            <p className="mt-2 text-3xl font-semibold text-[#2f241d]">{application.interestRate}%</p>
          </div>
          <div className="rounded-2xl bg-[#fef9f3] p-4">
            <p className="text-sm text-slate-500">Loan term</p>
            <p className="mt-2 text-3xl font-semibold text-[#2f241d]">{application.loanTerm} months</p>
          </div>
          <div className="rounded-2xl bg-[#fef9f3] p-4">
            <p className="text-sm text-slate-500">Total payable</p>
            <p className="mt-2 text-3xl font-semibold text-[#2f241d]">NGN {(application.principal + (application.principal * application.interestRate) / 100).toLocaleString()}</p>
          </div>
        </div>

        {application.purpose && (
          <div className="mt-4 rounded-2xl bg-[#fef9f3] p-4">
            <p className="text-sm text-slate-500">Purpose</p>
            <p className="mt-2 text-[#2f241d]">{application.purpose}</p>
          </div>
        )}

        {application.status === 'Pending' && user?.role === 'admin' && (
          <div className="mt-6 space-y-4 border-t border-[#f2e8d8] pt-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Rejection reason (if rejecting)</label>
              <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="min-h-24 w-full rounded-2xl border border-[#e7dccb] px-4 py-3" placeholder="Provide reason for rejection if applicable" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleApprove} disabled={loading} className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-70">
                <CheckCircle size={18} /> Approve
              </button>
              <button onClick={handleReject} disabled={loading} className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-70">
                <XCircle size={18} /> Reject
              </button>
            </div>
          </div>
        )}

        {application.rejectionReason && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-slate-500">Rejection reason</p>
            <p className="mt-2 text-[#2f241d]">{application.rejectionReason}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
