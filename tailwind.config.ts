import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7D9D5B',
        secondary: '#A8DADC',
        background: '#FAF9F6',
        text: '#4A403A',
        surface: '#FFFFFF',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'soft': '1rem',
        'softer': '1.5rem',
      },
    },
  },
  plugins: [],
}
export default config

