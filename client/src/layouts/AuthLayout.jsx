import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff7e8,_#f8f5ef_55%,_#f2eadf)] p-4 sm:p-6 lg:p-8">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center rounded-[2rem] border border-[#e8dccb] bg-white/70 p-6 shadow-2xl shadow-[#d8c6a0]/30 backdrop-blur lg:flex-row lg:gap-10 lg:p-10">
      <div className="max-w-md text-center lg:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-600">Micro Loan Tracker</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#2f241d] sm:text-5xl">Grow trust with every repayment.</h1>
        <p className="mt-4 text-lg text-slate-600">A polished workspace for small lenders, cooperatives, and SACCOs to run loans with clarity and confidence.</p>
      </div>
      <div className="mt-8 w-full max-w-md lg:mt-0">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
