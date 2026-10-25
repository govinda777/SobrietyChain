/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        serena: {
          dark: '#0B0F17',
          card: '#131926',
          border: '#1F293D',
          muted: '#8C9BB4',
        },
        milestone: {
          prata: '#94A3B8',      // 24 Horas
          carmim: '#F43F5E',     // 30 Dias
          ambar: '#F59E0B',      // 90 Dias
          esmeralda: '#10B981',  // 6 Meses
          safira: '#3B82F6',     // 1 Ano
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-sapphire': '0 0 25px -5px rgba(59, 130, 246, 0.25)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
      }
    },
  },
  plugins: [],
}
