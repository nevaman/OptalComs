/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-black) / <alpha-value>)',
        surface: 'rgb(var(--color-white) / <alpha-value>)',
        orange: 'rgb(var(--color-orange) / <alpha-value>)',
        'neutral-dark': 'rgb(var(--color-neutral-dark) / <alpha-value>)',
        'neutral-mid': 'rgb(var(--color-neutral-mid) / <alpha-value>)',
        'neutral-light': 'rgb(var(--color-neutral-light) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.035em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '9xl': ['8rem', { lineHeight: '0.95', letterSpacing: '-0.045em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        'extra-tight': '-0.025em',
      },
      maxWidth: {
        'container': '1400px',
      },
      borderRadius: {
        'sm': '3px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      transitionDuration: {
        '180': '180ms',
        '220': '220ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out-circ': 'cubic-bezier(0.85, 0, 0.15, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'blur-in': 'blurIn 0.7s cubic-bezier(0.19, 1, 0.22, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
      boxShadow: {
        'glow': '0 0 60px -15px rgb(var(--color-orange) / 0.3)',
        'glow-sm': '0 0 30px -10px rgb(var(--color-orange) / 0.2)',
        'soft': '0 4px 30px -8px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 40px -12px rgba(0, 0, 0, 0.12)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(135deg, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)',
      },
    },
  },
  plugins: [],
};
