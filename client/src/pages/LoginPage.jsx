import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to sign in');
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-[#eadfca] bg-white p-6 shadow-xl shadow-[#e3d0a7]/30">
      <h2 className="text-2xl font-semibold text-[#2f241d]">Sign in</h2>
      <p className="mt-2 text-sm text-slate-600">Access your loan dashboard and manage borrowers with ease.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
        <button disabled={isSubmitting} className="w-full rounded-2xl bg-[#c97b28] px-4 py-3 font-semibold text-white transition hover:bg-[#a8621e] disabled:opacity-70">{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">No account yet? <Link className="font-semibold text-amber-700" to="/auth/register">Create one</Link></p>
    </div>
  );
};

export default LoginPage;
