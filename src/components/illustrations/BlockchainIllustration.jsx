export default function BlockchainIllustration({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulseGlow" />
      <svg viewBox="0 0 500 500" className="w-full max-w-lg mx-auto animate-float" fill="none">
        {/* Outer ring */}
        <circle cx="250" cy="250" r="200" stroke="url(#grad1)" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.4" />
        <circle cx="250" cy="250" r="170" stroke="#6C63FF" strokeWidth="1" opacity="0.2" />

        {/* Blockchain blocks */}
        {[
          { x: 100, y: 180, label: 'Block #142' },
          { x: 200, y: 120, label: 'Block #143' },
          { x: 300, y: 180, label: 'Block #144' },
          { x: 350, y: 280, label: 'Block #145' },
          { x: 250, y: 340, label: 'Block #146' },
          { x: 150, y: 300, label: 'Block #147' },
        ].map((block, i) => (
          <g key={i}>
            <rect
              x={block.x}
              y={block.y}
              width="80"
              height="60"
              rx="8"
              fill="url(#blockGrad)"
              stroke="#8B85FF"
              strokeWidth="1.5"
              opacity="0.9"
            />
            <text x={block.x + 40} y={block.y + 28} textAnchor="middle" fill="white" fontSize="9" fontWeight="600">
              {block.label}
            </text>
            <text x={block.x + 40} y={block.y + 44} textAnchor="middle" fill="#8B85FF" fontSize="7" fontFamily="monospace">
              SHA-256
            </text>
            {i < 5 && (
              <line
                x1={block.x + 80}
                y1={block.y + 30}
                x2={[
                  { x: 200, y: 120 },
                  { x: 300, y: 180 },
                  { x: 350, y: 280 },
                  { x: 250, y: 340 },
                  { x: 150, y: 300 },
                ][i]?.x || block.x + 100}
                y2={[
                  { x: 200, y: 120 },
                  { x: 300, y: 180 },
                  { x: 350, y: 280 },
                  { x: 250, y: 340 },
                  { x: 150, y: 300 },
                ][i]?.y + 30 || block.y + 30}
                stroke="#6C63FF"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.6"
              />
            )}
          </g>
        ))}

        {/* Center shield */}
        <g transform="translate(210, 210)">
          <circle cx="40" cy="40" r="45" fill="url(#shieldGrad)" opacity="0.3" />
          <path
            d="M40 10 L70 25 L70 55 C70 75 40 90 40 90 C40 90 10 75 10 55 L10 25 Z"
            fill="url(#shieldGrad)"
            stroke="#8B85FF"
            strokeWidth="2"
          />
          <path
            d="M30 50 L37 57 L52 40"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Floating particles */}
        {[
          { cx: 80, cy: 100, r: 4 },
          { cx: 420, cy: 150, r: 3 },
          { cx: 400, cy: 400, r: 5 },
          { cx: 90, cy: 420, r: 3 },
          { cx: 450, cy: 300, r: 4 },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#6C63FF" opacity="0.6">
            <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + i}s`} repeatCount="indefinite" />
          </circle>
        ))}

        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="100%" stopColor="#5548E8" />
          </linearGradient>
          <linearGradient id="blockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2255" />
            <stop offset="100%" stopColor="#2d1b69" />
          </linearGradient>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="100%" stopColor="#5548E8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
