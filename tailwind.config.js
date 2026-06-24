/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0e27',
          800: '#0f1535',
          700: '#151b45',
          600: '#1a2255',
        },
        accent: {
          DEFAULT: '#6C63FF',
          light: '#8B85FF',
          dark: '#5548E8',
        },
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #0a0e27 0%, #151b45 50%, #1a1040 100%)',
        'gradient-purple': 'linear-gradient(135deg, #6C63FF 0%, #5548E8 100%)',
        'gradient-hero': 'linear-gradient(160deg, #0a0e27 0%, #151b45 40%, #2d1b69 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
        card: '0 4px 24px rgba(108, 99, 255, 0.15)',
        glow: '0 0 40px rgba(108, 99, 255, 0.3)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
