import { useState } from 'react';
import { ShieldCheck, CheckCircle, FileText, Hash, Blocks } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { verifyFileData } from '../data/mockData';

export default function VerifyFilePage() {
  const [verified, setVerified] = useState(true);

  return (
    <DashboardLayout title="Verify File Integrity">
      <div className="max-w-3xl space-y-6">
        <p className="text-white/50">
          Verify file authenticity by comparing stored blockchain hash with recalculated SHA-256 hash.
        </p>

        <div className="glass-panel p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">File Name</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="input-field pl-11"
                defaultValue={verifyFileData.fileName}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Stored Hash (SHA-256)</label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                className="input-field pl-11 font-mono text-xs min-h-[80px] resize-none"
                defaultValue={verifyFileData.storedHash}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Recalculated Hash</label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                className="input-field pl-11 font-mono text-xs min-h-[80px] resize-none"
                defaultValue={verifyFileData.recalculatedHash}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <Blocks className="w-5 h-5 text-accent flex-shrink-0" />
            <div className="text-sm">
              <p className="text-gray-500">Blockchain Block ID</p>
              <p className="font-mono text-gray-900">{verifyFileData.blockId}</p>
            </div>
          </div>

          <button
            onClick={() => setVerified(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify
          </button>
        </div>

        {verified && (
          <div className="flex items-start gap-4 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl animate-[fadeIn_0.5s_ease-out]">
            <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-800">File is Authentic. No changes detected.</p>
              <p className="text-sm text-emerald-600 mt-1">
                The recalculated SHA-256 hash matches the stored blockchain record. File integrity verified at{' '}
                {new Date(verifyFileData.timestamp).toLocaleString()}.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
