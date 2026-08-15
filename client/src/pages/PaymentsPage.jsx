import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const PaymentsPage = () => {
  const { loans: initialLoans = [], payments: initialPayments = [] } = useLoaderData();
  const [loans, setLoans] = useState(initialLoans);
  const [payments, setPayments] = useState(initialPayments);
  const [form, setForm] = useState({ loan: '', amount: '', paymentMethod: 'Cash', notes: '' });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/payments', { ...form, amount: Number(form.amount) });
      toast.success('Payment recorded');
      setForm({ loan: '', amount: '', paymentMethod: 'Cash', notes: '' });
      const { data } = await api.get('/payments');
      if (data?.success) setPayments(data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to record payment');
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Record repayment</p>
            <h3 className="text-xl font-semibold text-[#2f241d]">New payment</h3>
          </div>
          <div className="rounded-2xl bg-[#f7ebd2] p-3 text-[#8c4f16]"><Plus size={20} /></div>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <select value={form.loan} onChange={(e) => setForm({ ...form, loan: e.target.value })} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3">
            <option value="">Select loan</option>
            {loans.map((loan) => <option key={loan._id} value={loan._id}>{loan.borrower?.fullName || 'Loan'} • {loan.balance}</option>)}
          </select>
          <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3" placeholder="Amount" type="number" />
          <input value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3" placeholder="Payment method" />
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="min-h-24 w-full rounded-2xl border border-[#e7dccb] px-4 py-3" placeholder="Notes" />
          <button className="w-full rounded-2xl bg-[#c97b28] px-4 py-3 font-semibold text-white">Record payment</button>
        </form>
      </div>

      <div className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Recent activity</p>
            <h3 className="text-xl font-semibold text-[#2f241d]">Payment history</h3>
          </div>
          <span className="rounded-full bg-[#f7ebd2] px-3 py-1 text-sm text-[#8c4f16]">{payments.length} payments</span>
        </div>
        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment._id} className="rounded-2xl border border-[#f2e8d8] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#2f241d]">{payment.loan?.borrower?.fullName || 'Loan'}</p>
                  <p className="text-sm text-slate-500">{payment.paymentMethod}</p>
                </div>
                <p className="font-semibold text-[#2f241d]">NGN {payment.amount.toLocaleString()}</p>
              </div>
              <p className="mt-2 text-sm text-slate-500">{payment.notes || 'No notes'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
