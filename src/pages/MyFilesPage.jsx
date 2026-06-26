import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Hash, ShieldCheck, Loader, Upload } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

function truncateHash(hash) {
  if (!hash) return '';
  return `${hash.slice(0, 12)}...${hash.slice(-8)}`;
}

export default function MyFilesPage() {
  const [myFiles, setMyFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/files/my-files', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setMyFiles(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

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
    <DashboardLayout title="My Files">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <p className="text-white/50">{loading ? 'Loading...' : `You have ${myFiles.length} secure files stored`}</p>
        <Link to="/upload" className="btn-primary inline-flex items-center gap-2 w-fit">
          <Upload className="w-4 h-4" />
          Upload New File
        </Link>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">File Name</th>
                <th className="table-header">Size</th>
                <th className="table-header">Security Status</th>
                <th className="table-header">Upload Date</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-accent mx-auto" />
                  </td>
                </tr>
              ) : myFiles.map((file) => (
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
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
                      <ShieldCheck className="w-3 h-3" />
                      Secured on Blockchain
                    </div>
                  </td>
                  <td className="table-cell">{new Date(file.uploadDate).toLocaleDateString()}</td>
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
              {!loading && myFiles.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    You haven't uploaded any files yet.
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
