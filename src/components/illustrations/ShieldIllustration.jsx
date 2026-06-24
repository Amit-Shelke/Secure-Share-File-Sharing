export default function ShieldIllustration({ className = '' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-accent/30 rounded-full blur-3xl animate-pulseGlow" />
      <svg viewBox="0 0 400 450" className="w-full max-w-sm animate-float" fill="none">
        {/* Background hex grid */}
        {[...Array(6)].map((_, row) =>
          [...Array(5)].map((_, col) => (
            <polygon
              key={`${row}-${col}`}
              points="30,0 60,17 60,52 30,69 0,52 0,17"
              transform={`translate(${col * 65 + (row % 2) * 32}, ${row * 58 + 50})`}
              stroke="#6C63FF"
              strokeWidth="0.5"
              fill="none"
              opacity="0.15"
            />
          ))
        )}

        {/* Large shield */}
        <g transform="translate(100, 60)">
          <ellipse cx="100" cy="320" rx="80" ry="15" fill="#6C63FF" opacity="0.2" />
          <path
            d="M100 20 L180 60 L180 180 C180 250 100 310 100 310 C100 310 20 250 20 180 L20 60 Z"
            fill="url(#shieldMain)"
            stroke="#8B85FF"
            strokeWidth="2.5"
          />
          <path
            d="M100 20 L180 60 L180 180 C180 250 100 310 100 310 C100 310 20 250 20 180 L20 60 Z"
            fill="url(#shieldShine)"
            opacity="0.3"
          />
          {/* Lock icon on shield */}
          <rect x="75" y="140" width="50" height="45" rx="6" fill="#0a0e27" stroke="#8B85FF" strokeWidth="2" />
          <path
            d="M85 140 L85 120 C85 105 115 105 115 120 L115 140"
            stroke="#8B85FF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="100" cy="160" r="5" fill="#6C63FF" />
          <line x1="100" y1="165" x2="100" y2="175" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" />

          {/* Checkmark badge */}
          <circle cx="160" cy="70" r="22" fill="#22c55e" stroke="white" strokeWidth="2" />
          <path d="M150 70 L157 77 L172 62" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        {/* Floating security icons */}
        <g opacity="0.7">
          <circle cx="60" cy="120" r="20" fill="#1a2255" stroke="#6C63FF" strokeWidth="1.5" />
          <text x="60" y="125" textAnchor="middle" fill="#8B85FF" fontSize="14">🔐</text>

          <circle cx="340" cy="200" r="18" fill="#1a2255" stroke="#6C63FF" strokeWidth="1.5" />
          <text x="340" y="205" textAnchor="middle" fill="#8B85FF" fontSize="12">⛓</text>

          <circle cx="50" cy="350" r="16" fill="#1a2255" stroke="#6C63FF" strokeWidth="1.5" />
          <text x="50" y="355" textAnchor="middle" fill="#8B85FF" fontSize="11">#</text>
        </g>

        <defs>
          <linearGradient id="shieldMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="50%" stopColor="#5548E8" />
            <stop offset="100%" stopColor="#2d1b69" />
          </linearGradient>
          <linearGradient id="shieldShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
