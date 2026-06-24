import { Share2, FileText, User, Hash, Mail } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { shareFileData, sharedUsers, permissions } from '../data/mockData';

export default function ShareFilePage() {
  return (
    <DashboardLayout title="Share File">
      <div className="max-w-4xl space-y-6">
        {/* File Info */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            File Information
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">File Name</p>
              <p className="font-semibold text-gray-900 text-sm">{shareFileData.fileName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <User className="w-3 h-3" /> Owner
              </p>
              <p className="font-semibold text-gray-900 text-sm">{shareFileData.owner}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl sm:col-span-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3" /> File Hash
              </p>
              <code className="text-xs text-accent font-mono break-all">{shareFileData.fileHash.slice(0, 24)}...</code>
            </div>
          </div>
        </div>

        {/* Share Form */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Share With</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Share With Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="recipient@email.com"
                  className="input-field pl-11"
                  defaultValue="colleague@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Permission</label>
              <select className="input-field" defaultValue="Download">
                {permissions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn-primary inline-flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share File
          </button>
        </div>

        {/* Shared Users Table */}
        <div className="glass-panel overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Shared Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Email</th>
                  <th className="table-header">Permission</th>
                  <th className="table-header">Shared Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sharedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="table-cell font-medium text-gray-900">{user.email}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.permission === 'Full Access'
                          ? 'bg-purple-100 text-purple-700'
                          : user.permission === 'Download'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.permission}
                      </span>
                    </td>
                    <td className="table-cell">{user.sharedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
