import { useState } from 'react';
import { CloudUpload, File, X } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    name: 'Project_Report_Final.pdf',
    size: '2.4 MB',
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  return (
    <DashboardLayout title="Upload File">
      <div className="max-w-3xl mx-auto">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrag}
          className={`glass-panel p-12 text-center border-2 border-dashed transition-all duration-300 ${
            dragActive ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-gray-200 hover:border-accent/50'
          }`}
        >
          <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CloudUpload className="w-10 h-10 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag & Drop your file here</h3>
          <p className="text-gray-500 text-sm mb-6">or browse to select a file from your device</p>
          <button className="btn-outline text-sm">Browse File</button>
        </div>

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
              <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">File Name</p>
                <p className="font-medium text-gray-900 mt-1">{selectedFile.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">File Size</p>
                <p className="font-medium text-gray-900 mt-1">{selectedFile.size}</p>
              </div>
            </div>

            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <CloudUpload className="w-4 h-4" />
              Upload
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
