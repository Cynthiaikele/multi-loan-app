import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user']).optional(),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await signup(values);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create account');
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-[#eadfca] bg-white p-6 shadow-xl shadow-[#e3d0a7]/30">
      <h2 className="text-2xl font-semibold text-[#2f241d]">Create account</h2>
      <p className="mt-2 text-sm text-slate-600">Start tracking loans, repayments, and borrower health in minutes.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Name</label>
          <input {...register('name')} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3 outline-none ring-0" placeholder="Alex Morgan" />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <input {...register('email')} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3 outline-none ring-0" placeholder="alex@example.com" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>
          <input type="password" {...register('password')} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3 outline-none ring-0" placeholder="••••••••" />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Role</label>
          <select {...register('role')} className="w-full rounded-2xl border border-[#e7dccb] px-4 py-3 outline-none ring-0">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button disabled={isSubmitting} className="w-full rounded-2xl bg-[#2f241d] px-4 py-3 font-semibold text-white transition hover:bg-[#1f1813] disabled:opacity-70">{isSubmitting ? 'Creating account...' : 'Create account'}</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">Already have an account? <Link className="font-semibold text-amber-700" to="/auth/login">Sign in</Link></p>
    </div>
  );
};

export default RegisterPage;
