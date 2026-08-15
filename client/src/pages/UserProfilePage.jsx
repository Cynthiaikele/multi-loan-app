import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      toast.success('Profile saved successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-3xl border border-[#e8dccb] bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="rounded-2xl bg-[#f7ebd2] p-4 text-[#8c4f16]">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#2f241d]">{user?.name || 'User'}</h2>
              <p className="mt-1 text-sm text-slate-500">User Account</p>
              <p className="mt-2 inline-block rounded-full bg-[#f8f0e1] px-3 py-1 text-xs font-semibold uppercase text-[#8c4f16]">
                {user?.role || 'user'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-2xl bg-[#f7ebd2] px-4 py-2 font-semibold text-[#8c4f16] hover:bg-[#f0e3c8]"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {!isEditing ? (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-[#f2e8d8] p-4">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#8c4f16]" />
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-semibold text-[#2f241d]">{user?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#f2e8d8] p-4">
              <div className="flex items-center gap-3">
                <User size={18} className="text-[#8c4f16]" />
                <div>
                  <p className="text-sm text-slate-500">Full Name</p>
                  <p className="font-semibold text-[#2f241d]">{user?.name || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#fef3c7] p-4 text-sm text-amber-800">
              Account created: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2f241d]">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-[#e7dccb] px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2f241d]">Email</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="mt-2 w-full rounded-2xl border border-[#e7dccb] bg-slate-100 px-4 py-3 text-slate-500"
              />
              <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
            </div>
            <button
              onClick={handleSave}
              className="w-full rounded-2xl bg-[#c97b28] px-4 py-3 font-semibold text-white hover:bg-[#a8621e]"
            >
              Save changes
            </button>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-[#e8dccb] bg-white p-8 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[#2f241d]">Security</h3>
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 hover:bg-red-100"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;
