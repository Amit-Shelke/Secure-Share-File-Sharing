import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import ShieldIllustration from '../components/illustrations/ShieldIllustration';
import Logo from '../components/Logo';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-main flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(108,99,255,0.15),transparent_60%)]" />
        <div className="relative z-10 text-center space-y-6 max-w-md">
          <ShieldIllustration />
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-white/50 leading-relaxed">
            Access your secure files stored on the blockchain with verified SHA-256 integrity checks.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <div className="glass-panel p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-7 h-7 text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500 text-sm mt-1">Sign in to your SecureShare account</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" placeholder="Enter your email" className="input-field pl-11" defaultValue="amit.shelke@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" placeholder="Enter your password" className="input-field pl-11" defaultValue="••••••••" />
                </div>
              </div>

              <div className="flex justify-end">
                <a href="#" className="text-sm text-accent font-medium hover:underline">
                  Forgot Password?
                </a>
              </div>

              <Link to="/dashboard" className="btn-primary w-full text-center block">
                Login
              </Link>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-accent font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
