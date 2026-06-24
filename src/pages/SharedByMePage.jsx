import { FileText } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { sharedByMe } from '../data/mockData';

export default function SharedByMePage() {
  return (
    <DashboardLayout title="Shared By Me">
      <p className="text-white/50 mb-6">{sharedByMe.length} files you have shared with others</p>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">File Name</th>
                <th className="table-header">Shared With</th>
                <th className="table-header">Permission</th>
                <th className="table-header">Shared Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sharedByMe.map((file) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
