import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Logo({ className = '', showText = true, light = false }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-purple flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
          <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
      </div>
      {showText && (
        <div>
          <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-gray-900'}`}>
            Secure<span className="text-accent">Share</span>
          </span>
          {light && (
            <p className="text-[10px] text-white/50 -mt-0.5 tracking-wide uppercase">
              Blockchain File System
            </p>
          )}
        </div>
      )}
    </Link>
  );
}
