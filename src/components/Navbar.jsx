import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Navbar() {
  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo light />

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            Login
          </Link>
          <Link to="/register" className="btn-primary text-sm !px-5 !py-2.5">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
