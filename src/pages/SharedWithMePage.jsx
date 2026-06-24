import { FileText, Download } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { sharedWithMe } from '../data/mockData';

export default function SharedWithMePage() {
  return (
    <DashboardLayout title="Shared With Me">
      <p className="text-white/50 mb-6">{sharedWithMe.length} files shared with you by other users</p>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">File Name</th>
                <th className="table-header">Shared By</th>
                <th className="table-header">Permission</th>
                <th className="table-header">Shared Date</th>
                <th className="table-header">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sharedWithMe.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium text-gray-900">{file.fileName}</span>
                    </div>
                  </td>
                  <td className="table-cell">{file.sharedBy}</td>
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
                  <td className="table-cell">{file.sharedDate}</td>
                  <td className="table-cell">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      Download
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
