import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Share2, FileText, User, Hash, Mail, Loader, XCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const permissions = ['Download', 'Full Access', 'View Only'];

export default function ShareFilePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefilledEmail = searchParams.get('email') || '';

  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState('');
  const [email, setEmail] = useState(prefilledEmail);
  const [permission, setPermission] = useState('Download');
  const [expiry, setExpiry] = useState('never');
  const [pin, setPin] = useState('');
  const [isOneTime, setIsOneTime] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/files/my-files', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFiles(data);
          if (data.length > 0) {
            setSelectedFileId(data[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const selectedFile = files.find(f => f.id.toString() === selectedFileId.toString());

  const handleShare = async (e) => {
    e.preventDefault();
    if (!selectedFileId || !email) return;

    setSharing(true);
    setMessage('');
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/files/share', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ fileId: selectedFileId, email, permission, expiry, pin, isOneTime })
      });
      
      if (res.ok) {
        setMessage('File shared successfully with security settings applied!');
        setTimeout(() => navigate('/shared-by-me'), 2000);
      } else {
        const err = await res.json();
        setMessage(`Error: ${err.message || 'Failed to share'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error sharing file.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <DashboardLayout title="Share File">
      <div className="max-w-4xl space-y-6">
        
        {loading ? (
           <div className="flex justify-center p-10"><Loader className="w-8 h-8 animate-spin text-accent" /></div>
        ) : files.length === 0 ? (
          <div className="glass-panel p-10 text-center text-gray-500">
            You don't have any files to share yet. Please upload a file first.
          </div>
        ) : (
          <form onSubmit={handleShare}>
            {/* File Info */}
            <div className="glass-panel p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Select File to Share
              </h2>
              <div className="mb-4">
                <select 
                  className="input-field"
                  value={selectedFileId}
                  onChange={(e) => setSelectedFileId(e.target.value)}
                  required
                >
                  {files.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.size})</option>
                  ))}
                </select>
              </div>

              {selectedFile && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">File Name</p>
                    <p className="font-semibold text-gray-900 text-sm">{selectedFile.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Hash className="w-3 h-3" /> File Hash
                    </p>
                    <code className="text-xs text-accent font-mono break-all">
                      {selectedFile.hash ? `${selectedFile.hash.slice(0, 24)}...` : 'N/A'}
                    </code>
                  </div>
                </div>
              )}
            </div>

            {/* Share Form */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings & Permissions</h2>
              
              {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {message}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Share With Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="recipient@email.com"
                      className="input-field pl-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Permission Level</label>
                  <select 
                    className="input-field" 
                    value={permission}
                    onChange={(e) => setPermission(e.target.value)}
                  >
                    {permissions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Auto-Expiry (Self-Destruct)</label>
                  <select 
                    className="input-field border-orange-200 focus:border-orange-500 focus:ring-orange-500" 
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  >
                    <option value="never">Never Expire</option>
                    <option value="1hour">Expire in 1 Hour</option>
                    <option value="24hours">Expire in 24 Hours</option>
                    <option value="7days">Expire in 7 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Security PIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="E.g., 4092"
                    maxLength="6"
                    className="input-field border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Recipient must enter this PIN to access the file.</p>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                <input
                  type="checkbox"
                  id="oneTime"
                  className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500"
                  checked={isOneTime}
                  onChange={(e) => setIsOneTime(e.target.checked)}
                />
                <label htmlFor="oneTime" className="text-sm font-medium text-red-900 cursor-pointer">
                  Burn After Reading (One-Time Download)
                  <span className="block text-xs text-red-600 font-normal">File access is permanently destroyed immediately after the first successful download.</span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={sharing}
                className="btn-primary inline-flex items-center gap-2"
              >
                {sharing ? <Loader className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                {sharing ? 'Sharing...' : 'Share File'}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
