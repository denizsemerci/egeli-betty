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
        // Ege Teması - Zeytin yeşili, adaçayı, krem, deniz mavisi
        primary: {
          DEFAULT: '#6B8E4F', // Zeytin yeşili
          light: '#8FB573',
          dark: '#556B3D',
        },
        secondary: {
          DEFAULT: '#9CAF88', // Adaçayı yeşili
          light: '#B8C9A8',
          dark: '#7A8F6A',
        },
        accent: {
          DEFAULT: '#4A90A4', // Deniz mavisi
          light: '#6BA8BC',
          dark: '#3A7284',
        },
        background: '#F8F6F2', // Krem/bej arka plan
        text: {
          DEFAULT: '#3D3B35',
          light: '#6B6963',
          muted: '#9B9993',
        },
        surface: '#FFFFFF',
        warm: {
          DEFAULT: '#E8DCC6', // Sıcak krem
          light: '#F2E9D9',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
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

