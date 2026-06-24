import { Link } from 'react-router-dom';
import { Upload, FileText, Share2, Download, HardDrive, MoreHorizontal } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { dashboardStats, recentFiles } from '../data/mockData';

const statCards = [
  { label: 'Total Files', value: dashboardStats.totalFiles, icon: FileText, color: 'from-blue-500 to-blue-600' },
  { label: 'Files Shared', value: dashboardStats.filesShared, icon: Share2, color: 'from-purple-500 to-accent' },
  { label: 'Files Received', value: dashboardStats.filesReceived, icon: Download, color: 'from-emerald-500 to-emerald-600' },
  { label: 'Total Storage', value: dashboardStats.totalStorage, icon: HardDrive, color: 'from-orange-500 to-orange-600' },
];

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <p className="text-white/50">Welcome back! Here&apos;s an overview of your secure files.</p>
        <Link to="/upload" className="btn-primary inline-flex items-center gap-2 w-fit">
          <Upload className="w-4 h-4" />
          Upload File
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Files Table */}
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Files</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">File Name</th>
                <th className="table-header">Size</th>
                <th className="table-header">Uploaded Date</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium text-gray-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">{file.size}</td>
                  <td className="table-cell">{file.uploadedDate}</td>
                  <td className="table-cell">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
