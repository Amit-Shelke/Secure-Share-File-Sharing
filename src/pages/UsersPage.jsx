import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Loader, Share2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setUsers(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <DashboardLayout title="Users Directory">
      <p className="text-white/50 mb-6">{loading ? 'Loading...' : `Discover and share files with ${users.length} other registered users`}</p>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">User</th>
                <th className="table-header">Email Address</th>
                <th className="table-header">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-accent mx-auto" />
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-purple flex items-center justify-center text-white font-bold text-sm">
                        {u.avatar || u.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-gray-500">{u.email}</td>
                  <td className="table-cell">
                    <Link
                      to={`/share?email=${encodeURIComponent(u.email)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Share File
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-500">
                    No other users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
