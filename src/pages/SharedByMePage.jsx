import { useState, useEffect } from 'react';
import { FileText, Loader, Hash, XCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function SharedByMePage() {
  const [sharedByMe, setSharedByMe] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('/api/files/shared-by-me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSharedByMe(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleRevoke = async (id) => {
    if (!confirm('Are you sure you want to revoke access?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/files/share/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchFiles(); // Refresh the list
      } else {
        alert('Failed to revoke access');
      }
    } catch (err) {
      console.error(err);
      alert('Error revoking access');
    }
  };

  return (
    <DashboardLayout title="Shared By Me">
      <p className="text-white/50 mb-6">{loading ? 'Loading...' : `${sharedByMe.length} files you have shared with others`}</p>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">File Name</th>
                <th className="table-header">Shared With</th>
                <th className="table-header">Blockchain Logic</th>
                <th className="table-header">Permission</th>
                <th className="table-header">Shared Date</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-accent mx-auto" />
                  </td>
                </tr>
              ) : sharedByMe.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium text-gray-900">{file.fileName}</span>
                    </div>
                  </td>
                  <td className="table-cell">{file.sharedWith}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit">
                      <Hash className="w-3 h-3 text-accent" />
                      Encrypted Key Transferred
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      file.permission === 'Full Access'
                        ? 'bg-purple-100 text-purple-700'
                        : file.permission === 'Download'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {file.permission}
                    </span>
                  </td>
                  <td className="table-cell">{new Date(file.sharedDate).toLocaleDateString()}</td>
                  <td className="table-cell">
                    <button 
                      onClick={() => handleRevoke(file.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && sharedByMe.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    You haven't shared any files yet.
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
