import { useState, useRef } from 'react';
import { CloudUpload, File, X, Loader } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setMessage('');
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setMessage('');

    try {
      // Compute SHA-256 Hash on the client side
      const buffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('hash', fileHash);

      const res = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        setMessage('File uploaded and secured with blockchain hash successfully!');
        setSelectedFile(null);
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.message || 'Upload failed'}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Upload File">
      <div className="max-w-3xl mx-auto">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`glass-panel p-12 text-center border-2 border-dashed transition-all duration-300 cursor-pointer ${
            dragActive ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-gray-200 hover:border-accent/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
          />
          <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CloudUpload className="w-10 h-10 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag & Drop your file here</h3>
          <p className="text-gray-500 text-sm mb-6">or browse to select a file from your device</p>
          <button className="btn-outline text-sm pointer-events-none">Browse File</button>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-xl text-center ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        {selectedFile && (
          <div className="glass-panel p-6 mt-6 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <File className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">File Name</p>
                <p className="font-semibold text-gray-900 truncate">{selectedFile.name}</p>
              </div>
              <button 
                onClick={() => setSelectedFile(null)}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">File Name</p>
                <p className="font-medium text-gray-900 mt-1 truncate">{selectedFile.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">File Size</p>
                <p className="font-medium text-gray-900 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            <button 
              onClick={handleUpload}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <CloudUpload className="w-4 h-4" />
              )}
              {loading ? 'Uploading...' : 'Upload File to Cloudinary'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
