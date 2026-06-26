import { useState, useEffect } from 'react';
import { Activity, FileText, Loader, Clock } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/files/audit', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setLogs(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <DashboardLayout title="Audit Trail">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <p className="text-white/50">Immutable cryptographic log of all file activities.</p>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Action</th>
                <th className="table-header">File Name</th>
                <th className="table-header">Details</th>
                <th className="table-header">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-accent mx-auto" />
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit font-bold">
                      <Activity className="w-3 h-3" />
                      {log.action}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <span className="font-medium text-gray-900">{log.fileName}</span>
                    </div>
                  </td>
                  <td className="table-cell text-gray-600">{log.details}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No activity found. Start sharing files to see logs here.
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
