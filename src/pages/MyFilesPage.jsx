import { Link } from 'react-router-dom';
import { FileText, Share2, Download, Hash, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { myFiles } from '../data/mockData';

function truncateHash(hash) {
  return `${hash.slice(0, 12)}...${hash.slice(-8)}`;
}

export default function MyFilesPage() {
  return (
    <DashboardLayout title="My Files">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-white/50">{myFiles.length} files stored securely on blockchain</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/verify" className="btn-secondary text-sm w-fit inline-flex items-center gap-2 !py-2.5">
            <ShieldCheck className="w-4 h-4" />
            Verify Integrity
          </Link>
          <Link to="/upload" className="btn-primary text-sm w-fit">
            Upload New File
          </Link>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">File Name</th>
                <th className="table-header">Size</th>
                <th className="table-header">Upload Date</th>
                <th className="table-header">Hash (SHA-256)</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium text-gray-900 whitespace-nowrap">{file.name}</span>
                    </div>
                  </td>
                  <td className="table-cell whitespace-nowrap">{file.size}</td>
                  <td className="table-cell whitespace-nowrap">{file.uploadDate}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <code className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                        {truncateHash(file.hash)}
                      </code>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Link
                        to="/share"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </Link>
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
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
