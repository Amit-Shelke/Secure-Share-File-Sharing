import { useState } from 'react';
import { ShieldCheck, CheckCircle, FileText, Hash, Blocks, UploadCloud, XCircle, Loader } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

// Helper to compute SHA-256 Hash of a file
async function computeHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function VerifyFilePage() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setVerificationResult(null);
      setHash('');
    }
  };

  const handleVerify = async () => {
    if (!file) return;
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const calculatedHash = await computeHash(file);
      setHash(calculatedHash);
      
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/files/verify/${calculatedHash}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      setVerificationResult(data);
    } catch (err) {
      console.error(err);
      alert('Error verifying file');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <DashboardLayout title="Verify File Integrity">
      <div className="max-w-3xl space-y-6">
        <p className="text-white/50">
          Verify file authenticity by comparing your local file's recalculated SHA-256 hash against the blockchain-stored hash.
        </p>

        <div className="glass-panel p-6 space-y-5">
          {!file ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl relative cursor-pointer hover:border-accent/50 transition-colors">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileChange} 
              />
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Click or drag a file here to verify</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Selected File</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="input-field pl-11 pr-10"
                    value={file.name}
                    readOnly
                  />
                  <button 
                    onClick={() => { setFile(null); setHash(''); setVerificationResult(null); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {hash && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Recalculated Hash (SHA-256)</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      className="input-field pl-11 font-mono text-xs min-h-[80px] resize-none"
                      value={hash}
                      readOnly
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="btn-primary inline-flex items-center gap-2"
              >
                {isVerifying ? <Loader className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {isVerifying ? 'Verifying on Blockchain...' : 'Verify File'}
              </button>
            </div>
          )}
        </div>

        {verificationResult && (
          verificationResult.authentic ? (
            <div className="flex items-start gap-4 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl animate-[fadeIn_0.5s_ease-out]">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-800">File is Authentic. Integrity Verified.</p>
                <p className="text-sm text-emerald-600 mt-1">
                  The recalculated SHA-256 hash matches the stored blockchain record for <b>{verificationResult.file.name}</b>. Original upload timestamp:{' '}
                  {new Date(verificationResult.file.uploadDate).toLocaleString()}.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl animate-[fadeIn_0.5s_ease-out]">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Verification Failed: Unauthentic File.</p>
                <p className="text-sm text-red-600 mt-1">
                  The calculated SHA-256 hash does not exist in the blockchain records. The file has either been tampered with, is corrupted, or was never uploaded securely.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
