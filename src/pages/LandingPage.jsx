import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Lock, Hash, Blocks } from 'lucide-react';
import Navbar from '../components/Navbar';
import BlockchainIllustration from '../components/illustrations/BlockchainIllustration';

const features = [
  {
    icon: Shield,
    title: 'Blockchain Security',
    desc: 'Every file is secured with immutable blockchain records ensuring tamper-proof storage.',
  },
  {
    icon: Hash,
    title: 'SHA-256 Hashing',
    desc: 'Cryptographic SHA-256 hashing verifies file integrity and detects unauthorized changes.',
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    desc: 'Files are encrypted before upload, ensuring only authorized users can access them.',
  },
  {
    icon: Blocks,
    title: 'Decentralized Storage',
    desc: 'Distributed ledger technology eliminates single points of failure in file storage.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent-light text-sm font-medium">
              <Blocks className="w-4 h-4" />
              Powered by Blockchain Technology
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Secure File Sharing Using{' '}
              <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Blockchain Technology
              </span>
            </h1>

            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              SecureShare enables secure, decentralized file sharing using blockchain technology
              and SHA-256 cryptographic hashing. Upload, share, and verify files with complete
              integrity assurance — ensuring your data remains authentic and tamper-proof.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="btn-secondary inline-flex items-center gap-2">
                Learn More
              </a>
            </div>

            <div className="flex items-center gap-8 pt-4">
              {[
                { value: '256-bit', label: 'Encryption' },
                { value: '100%', label: 'Integrity' },
                { value: 'Zero', label: 'Tampering' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <BlockchainIllustration />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Enterprise-grade security features designed for academic and professional file sharing needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="glass-card p-6 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                  <Icon className="w-6 h-6 text-accent-light" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">About SecureShare</h2>
          <p className="text-white/60 leading-relaxed">
            SecureShare is a Final Year Engineering Project that demonstrates the application of
            blockchain technology in secure file sharing systems. By leveraging SHA-256 hashing and
            distributed ledger principles, it provides a robust solution for academic and
            professional document management with verifiable integrity.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 pb-32">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-white/50 mb-8">Have questions about SecureShare? Get in touch with our team.</p>
          <div className="glass-card p-8 space-y-4">
            <p className="text-white/70">
              Email:{' '}
              <a href="mailto:secureshare@project.edu" className="text-accent-light hover:underline">
                secureshare@project.edu
              </a>
            </p>
            <p className="text-white/70">Department of Computer Engineering</p>
          </div>
        </div>
      </section>
    </div>
  );
}
