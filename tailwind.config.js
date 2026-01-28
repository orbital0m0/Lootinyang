/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New Design System Colors
        primary: {
          DEFAULT: '#3E94E4',
          light: '#5BA8ED',
          dark: '#2B7ACC',
          50: '#F0F6FF',
          100: '#E1EDFF',
          200: '#C3DBFF',
          500: '#3E94E4',
          600: '#2B7ACC',
        },
        highlight: {
          DEFAULT: '#FF4D91',
          light: '#FF6FA8',
          dark: '#E63B7A',
        },
        background: {
          light: '#F0F6FF',
          dark: '#0B121E',
        },
        // Cat Room Colors
        cat: {
          orange: '#ff8c42',
          'orange-light': '#ffb380',
          'orange-dark': '#e67a36',
          pink: '#ffc0cb',
          'pink-light': '#ffd0dc',
          'pink-dark': '#ffb0c0',
          purple: '#b19cd9',
        },
        // Accent Colors (for stats page)
        accent: {
          blue: '#E3F2FD',
          'blue-dark': '#90CAF9',
          pink: '#FCE4EC',
          'pink-dark': '#F06292',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Pretendard', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'Pretendard', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '1.5rem',
        xl: '2.25rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      boxShadow: {
        'ios': '0 4px 24px -1px rgba(0, 0, 0, 0.04)',
        'ios-lg': '0 8px 32px -1px rgba(0, 0, 0, 0.08)',
        'highlight': '0 4px 20px rgba(255, 77, 145, 0.2)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
