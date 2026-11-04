/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#07070a',
        surface: '#0f0e15',
        'surface-hover': '#161520',
        card: '#12111b',
        'card-border': 'rgba(255, 255, 255, 0.08)',
        wizard: {
          dark: '#070709',
          void: '#0b0a12',
          purple: '#9333ea',
          'purple-glow': '#a855f7',
          'purple-deep': '#4c1d95',
          'brand-purple': '#360e5b',
          'brand-purple-dark': '#260940',
          'brand-purple-light': '#48137a',
          lime: '#10b981',
          'lime-glow': '#34d399',
          chrome: '#e2e8f0',
          muted: '#8e8b9e',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        mega: '0.35em',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.3))' },
          '100%': { filter: 'drop-shadow(0 0 25px rgba(168, 85, 247, 0.7))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at 50% -20%, rgba(120, 40, 200, 0.25), rgba(7, 7, 10, 0) 70%)',
        'card-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'purple-radial': 'radial-gradient(circle at center, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};

