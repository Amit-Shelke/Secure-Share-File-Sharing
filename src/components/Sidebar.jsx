import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Share2,
  Users,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import { currentUser } from '../data/mockData';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-files', label: 'My Files', icon: FolderOpen },
  { to: '/shared-with-me', label: 'Shared With Me', icon: Share2 },
  { to: '/shared-by-me', label: 'Shared By Me', icon: Users },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-white/10">
        <Logo light />
      </div>

      <div className="p-4 flex-1">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center text-white text-sm font-bold">
            {currentUser.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{currentUser.name}</p>
            <p className="text-white/50 text-xs truncate">{currentUser.email}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/20 text-accent-light border border-accent/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-navy-800 text-white border border-white/10"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-navy-900 border-r border-white/10 flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1 text-white/60 hover:text-white"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
