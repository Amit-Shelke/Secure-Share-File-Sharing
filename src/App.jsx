import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import MyFilesPage from './pages/MyFilesPage';
import ShareFilePage from './pages/ShareFilePage';
import SharedWithMePage from './pages/SharedWithMePage';
import SharedByMePage from './pages/SharedByMePage';
import VerifyFilePage from './pages/VerifyFilePage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import AuditLogPage from './pages/AuditLogPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/my-files" element={<MyFilesPage />} />
          <Route path="/share" element={<ShareFilePage />} />
          <Route path="/shared-with-me" element={<SharedWithMePage />} />
          <Route path="/shared-by-me" element={<SharedByMePage />} />
          <Route path="/verify" element={<VerifyFilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/audit" element={<AuditLogPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
