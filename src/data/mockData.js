export const currentUser = {
  name: 'Amit Shelke',
  email: 'amit.shelke@email.com',
  avatar: 'AS',
};

export const dashboardStats = {
  totalFiles: 12,
  filesShared: 8,
  filesReceived: 5,
  totalStorage: '245 MB',
};

export const recentFiles = [
  { id: 1, name: 'Project_Report_Final.pdf', size: '2.4 MB', uploadedDate: '2025-06-20' },
  { id: 2, name: 'Blockchain_Architecture.docx', size: '1.8 MB', uploadedDate: '2025-06-19' },
  { id: 3, name: 'Smart_Contract_Code.sol', size: '45 KB', uploadedDate: '2025-06-18' },
  { id: 4, name: 'Network_Diagram.png', size: '890 KB', uploadedDate: '2025-06-17' },
  { id: 5, name: 'Research_Paper_v2.pdf', size: '3.2 MB', uploadedDate: '2025-06-15' },
];

export const myFiles = [
  {
    id: 1,
    name: 'Project_Report_Final.pdf',
    size: '2.4 MB',
    uploadDate: '2025-06-20',
    hash: 'a3f5b8c9d2e1f4a7b6c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
  },
  {
    id: 2,
    name: 'Blockchain_Architecture.docx',
    size: '1.8 MB',
    uploadDate: '2025-06-19',
    hash: 'b7c2d4e6f8a0b1c3d5e7f9a1b3c5d7e9f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0',
  },
  {
    id: 3,
    name: 'Smart_Contract_Code.sol',
    size: '45 KB',
    uploadDate: '2025-06-18',
    hash: 'c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3',
  },
  {
    id: 4,
    name: 'Network_Diagram.png',
    size: '890 KB',
    uploadDate: '2025-06-17',
    hash: 'd4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6',
  },
  {
    id: 5,
    name: 'Research_Paper_v2.pdf',
    size: '3.2 MB',
    uploadDate: '2025-06-15',
    hash: 'e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9',
  },
  {
    id: 6,
    name: 'Presentation_Slides.pptx',
    size: '5.1 MB',
    uploadDate: '2025-06-12',
    hash: 'f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0',
  },
];

export const shareFileData = {
  fileName: 'Project_Report_Final.pdf',
  owner: 'Amit Shelke',
  fileHash: 'a3f5b8c9d2e1f4a7b6c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
};

export const sharedUsers = [
  { id: 1, email: 'priya.sharma@email.com', permission: 'Download', sharedDate: '2025-06-19' },
  { id: 2, email: 'rahul.patel@email.com', permission: 'View Only', sharedDate: '2025-06-18' },
  { id: 3, email: 'sneha.desai@email.com', permission: 'Full Access', sharedDate: '2025-06-17' },
];

export const sharedWithMe = [
  {
    id: 1,
    fileName: 'Database_Schema.sql',
    sharedBy: 'Priya Sharma',
    permission: 'Download',
    sharedDate: '2025-06-20',
  },
  {
    id: 2,
    fileName: 'UI_Mockups.fig',
    sharedBy: 'Rahul Patel',
    permission: 'View Only',
    sharedDate: '2025-06-19',
  },
  {
    id: 3,
    fileName: 'Literature_Review.pdf',
    sharedBy: 'Sneha Desai',
    permission: 'Full Access',
    sharedDate: '2025-06-18',
  },
  {
    id: 4,
    fileName: 'Test_Results.xlsx',
    sharedBy: 'Vikram Singh',
    permission: 'Download',
    sharedDate: '2025-06-16',
  },
  {
    id: 5,
    fileName: 'API_Documentation.pdf',
    sharedBy: 'Ananya Reddy',
    permission: 'View Only',
    sharedDate: '2025-06-14',
  },
];

export const sharedByMe = [
  {
    id: 1,
    fileName: 'Project_Report_Final.pdf',
    sharedWith: 'priya.sharma@email.com',
    permission: 'Download',
    sharedDate: '2025-06-19',
  },
  {
    id: 2,
    fileName: 'Blockchain_Architecture.docx',
    sharedWith: 'rahul.patel@email.com',
    permission: 'View Only',
    sharedDate: '2025-06-18',
  },
  {
    id: 3,
    fileName: 'Smart_Contract_Code.sol',
    sharedWith: 'sneha.desai@email.com',
    permission: 'Full Access',
    sharedDate: '2025-06-17',
  },
];

export const verifyFileData = {
  fileName: 'Project_Report_Final.pdf',
  storedHash: 'a3f5b8c9d2e1f4a7b6c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
  recalculatedHash: 'a3f5b8c9d2e1f4a7b6c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
  blockId: '0x7f3a...b2c9',
  timestamp: '2025-06-20T14:32:00Z',
};

export const permissions = ['View Only', 'Download', 'Full Access'];
