/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk neon colors
        'neon-blue': '#00F5FF',
        'neon-pink': '#FF006E',
        'neon-purple': '#8B5CF6',
        'neon-green': '#00FF41',
        'cyber-dark': '#0A0E27',
        'cyber-darker': '#050714',
        'cyber-gray': '#1E293B',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'glow': {
          '0%, 100%': {
            'box-shadow': '0 0 5px #00F5FF, 0 0 10px #00F5FF',
          },
          '50%': {
            'box-shadow': '0 0 20px #00F5FF, 0 0 30px #00F5FF',
          },
        },
        'slide-up': {
          'from': {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          'to': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 245, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 110, 0.5)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'neon-green': '0 0 20px rgba(0, 255, 65, 0.5)',
      },
    },
  },
  plugins: [],
}
