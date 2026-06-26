import { Link } from 'react-router-dom';
import { Upload, FileText, Share2, Download, HardDrive, MoreHorizontal, Loader } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const [statsRes, filesRes] = await Promise.all([
          fetch('/api/files/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/files/recent', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (filesRes.ok) setRecentFiles(await filesRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = stats ? [
    { label: 'Total Files', value: stats.totalFiles, icon: FileText, color: 'from-blue-500 to-blue-600' },
    { label: 'Files Shared', value: stats.filesShared, icon: Share2, color: 'from-purple-500 to-accent' },
    { label: 'Files Received', value: stats.filesReceived, icon: Download, color: 'from-emerald-500 to-emerald-600' },
  ] : [];

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-accent" />
        </div>
      </DashboardLayout>
    );
  }

  const handleDownload = async (url, filename) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Error downloading file:', err);
      window.open(url, '_blank');
    }
  };

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
                  <td className="table-cell">{new Date(file.uploadedDate).toLocaleDateString()}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDownload(file.url, file.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {recentFiles.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No recent files found. Upload one to get started!
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
