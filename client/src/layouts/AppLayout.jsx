import { NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid, Users, HandCoins, ReceiptText, History, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const adminNavItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
  { label: 'Borrowers', to: '/borrowers', icon: Users },
  { label: 'Loans', to: '/loans', icon: HandCoins },
  { label: 'Payments', to: '/payments', icon: ReceiptText },
  { label: 'History', to: '/admin-history', icon: History },
];

const userNavItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'History', to: '/history', icon: History },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="hidden w-72 shrink-0 flex-col rounded-r-3xl bg-[#2f241d] p-6 text-white lg:flex">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Micro Loan</p>
            <h1 className="mt-2 text-2xl font-semibold">Tracker</h1>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 transition ${isActive ? 'bg-amber-500 text-[#2f241d]' : 'text-amber-50 hover:bg-[#483528]'}`}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-auto rounded-2xl bg-[#483528] p-4">
            <p className="text-sm text-amber-100">Signed in as</p>
            <p className="font-semibold">{user?.name || 'User'}</p>
            <p className="mt-1 text-xs uppercase text-amber-200">{user?.role || 'user'}</p>
            <button onClick={logout} className="mt-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm hover:bg-white/20">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex items-center justify-between rounded-3xl border border-[#e8dccb] bg-white/70 p-4 shadow-sm backdrop-blur">
            <div>
              <p className="text-sm text-[#7b5d3f]">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}</p>
              <h2 className="text-xl font-semibold">Welcome back, {user?.name?.split(' ')[0] || 'there'}.</h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full border border-[#e8dccb] p-2 lg:hidden">
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <div className="hidden rounded-full bg-[#f8f0e1] px-4 py-2 text-sm font-medium text-[#7b5d3f] sm:block uppercase">{user?.role || 'User'}</div>
            </div>
          </header>

          {mobileOpen && (
            <div className="mb-4 rounded-2xl bg-[#2f241d] p-4 text-white lg:hidden">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 transition ${isActive ? 'bg-amber-500 text-[#2f241d]' : 'text-amber-50 hover:bg-[#483528]'}`}>
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;

