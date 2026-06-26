import { useState, useEffect } from 'react';
import { FileText, Download, Loader, Lock, X } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function SharedWithMePage() {
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [loading, setLoading] = useState(true);

  // Security Modal State
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [activeFileId, setActiveFileId] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewFileUrl, setViewFileUrl] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/files/shared-with-me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setSharedWithMe(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleDownloadBlob = async (url, filename) => {
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

  const handleDownloadClick = (file) => {
    if (file.requiresPin) {
      setActiveFileId(file.id);
      setPinInput('');
      setPinError('');
      setPinModalOpen(true);
    } else {
      fetchDownloadUrl(file.id, '');
    }
  };

  const fetchDownloadUrl = async (fileId, pin) => {
    setDownloading(true);
    setPinError('');
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`/api/files/download-shared/${fileId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin })
      });
      if (res.ok) {
        const data = await res.json();
        setPinModalOpen(false);
        
        if (data.permission === 'View Only') {
          // Open secure viewer modal instead of allowing download
          setViewFileUrl(data.url);
          setViewModalOpen(true);
        } else {
          handleDownloadBlob(data.url, data.fileName);
        }
        
        // Refresh the file list to remove "Burn After Reading" files instantly
        const updatedRes = await fetch('/api/files/shared-with-me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (updatedRes.ok) setSharedWithMe(await updatedRes.json());

      } else {
        const err = await res.json();
        if (pinModalOpen) setPinError(err.message || 'Invalid Security PIN');
        else alert(err.message || 'Error accessing file');
      }
    } catch (error) {
      if (pinModalOpen) setPinError('Network error');
      else alert('Network error');
    } finally {
      setDownloading(false);
    }
  };

  const submitPin = () => {
    if (!pinInput) return setPinError('PIN is required');
    fetchDownloadUrl(activeFileId, pinInput);
  };

  return (
    <DashboardLayout title="Shared With Me">
      <p className="text-white/50 mb-6">{loading ? 'Loading...' : `${sharedWithMe.length} files shared with you by other users`}</p>

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
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-accent mx-auto" />
                  </td>
                </tr>
              ) : sharedWithMe.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-gray-900 ${file.isExpired ? 'line-through text-gray-400' : ''}`}>{file.fileName}</span>
                          {file.isOneTime && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Burn After Reading</span>
                          )}
                        </div>
                        {file.expiresAt && !file.isExpired && (
                          <span className="text-[10px] text-orange-500 font-bold">Expires: {new Date(file.expiresAt).toLocaleString()}</span>
                        )}
                      </div>
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
                  <td className="table-cell">{new Date(file.sharedDate).toLocaleDateString()}</td>
                  <td className="table-cell">
                    {file.isExpired ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold">
                        Expired
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDownloadClick(file)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        {file.requiresPin ? <Lock className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                        {file.requiresPin ? 'Unlock' : (file.permission === 'View Only' ? 'View Securely' : 'Download')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && sharedWithMe.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No files have been shared with you yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PIN Verification Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent" /> Security Check
              </h3>
              <button onClick={() => setPinModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                This file is protected by a secure PIN. Please enter the PIN provided by the sender to unlock it.
              </p>
              {pinError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg">
                  {pinError}
                </div>
              )}
              <input
                type="text"
                maxLength="6"
                placeholder="Enter PIN"
                className="input-field mb-4 text-center tracking-widest text-lg font-mono"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitPin()}
                autoFocus
              />
              <button
                onClick={submitPin}
                disabled={downloading}
                className="btn-primary w-full flex justify-center items-center gap-2"
              >
                {downloading ? <Loader className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {downloading ? 'Verifying...' : 'Unlock & Download'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secure Image Viewer Modal */}
      {viewModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          onContextMenu={(e) => e.preventDefault()} // Disable right click entirely
        >
          <div className="absolute top-4 right-4 z-50 flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
            <span className="text-white/50 text-[10px] sm:text-xs px-2 py-1 bg-white/10 rounded-full border border-white/20 text-right max-w-[200px] sm:max-w-none">
              Secure View • Right-Click Disabled
            </span>
            <button 
              onClick={() => setViewModalOpen(false)} 
              className="text-white hover:text-red-400 bg-white/10 p-2 rounded-full transition-colors border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative pointer-events-none select-none max-w-5xl w-full h-full flex items-center justify-center pt-16 sm:pt-0">
            {/* The actual image with watermark */}
            <img 
              src={viewFileUrl} 
              alt="Secure Document"
              className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl shadow-black/50" 
              draggable="false"
            />
            {/* Invisible overlay blocking interactions like dragging or inspecting */}
            <div className="absolute inset-0 z-10 bg-transparent" aria-hidden="true"></div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
