import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        felt: '#0a1f14',
        'felt-light': '#0d2918',
        neon: '#00ff88',
        'neon-dim': '#00cc6a',
        gold: '#ffd700',
        'card-red': '#dc2626',
        'card-black': '#1a1a2e',
      },
    },
  },
  plugins: [],
};

export default config;
