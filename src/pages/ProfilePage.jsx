import { useContext } from 'react';
import { User, Mail, Shield } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <DashboardLayout title="Profile">
        <div className="p-8 text-center text-gray-500">Loading profile...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-2xl">
        <div className="glass-panel p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-purple flex items-center justify-center text-white text-2xl font-bold shadow-glow">
              {user.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                <Shield className="w-3 h-3" />
                Verified User
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" className="input-field pl-11" defaultValue={user.name} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" className="input-field pl-11" defaultValue={user.email} disabled />
              </div>
            </div>
            <button className="btn-primary mt-4">Save Changes</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
