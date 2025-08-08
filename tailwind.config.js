/** @type {import('tailwindcss').Config} */
// 语义色别名工具函数
const withVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // 语义色彩系统 - 支持透明度修饰符
        brand: {
          primary: withVar('--brand-primary'),
          accent: withVar('--brand-accent'),
        },
        ink: withVar('--ink'),
        surface: withVar('--surface'),
        on: {
          primary: withVar('--on-primary'),
          accent: withVar('--on-accent'),
          ink: withVar('--on-ink'),
          surface: withVar('--on-surface'),
        },
        state: {
          info: withVar('--state-info'),
          success: withVar('--state-success'),
          warning: withVar('--state-warning'),
          error: withVar('--state-error'),
        },
        // 保留既有静态色名作为fallback（用于开发和测试）
        'purple-haze': {
          DEFAULT: '#543855',
          50: 'rgba(84, 56, 85, 0.1)',
          100: 'rgba(84, 56, 85, 0.2)',
          200: 'rgba(84, 56, 85, 0.3)',
          300: 'rgba(84, 56, 85, 0.4)',
          400: 'rgba(84, 56, 85, 0.5)',
          500: '#543855',
          600: 'rgba(58, 40, 58, 0.95)',
          700: 'rgba(41, 24, 41, 1)',
          800: 'rgba(30, 18, 30, 1)',
          900: 'rgba(20, 10, 20, 1)',
        },
        'burnt-sienna': {
          DEFAULT: '#e88d72',
          50: 'rgba(232, 141, 114, 0.1)',
          100: 'rgba(232, 141, 114, 0.2)',
          200: 'rgba(232, 141, 114, 0.3)',
          300: 'rgba(232, 141, 114, 0.4)',
          400: 'rgba(232, 141, 114, 0.5)',
          500: '#e88d72',
          600: '#e67b5c',
          700: '#e36946',
          800: '#e15730',
          900: '#de451a',
        },
        'salmon': {
          DEFAULT: '#ffa384',
          50: 'rgba(255, 163, 132, 0.1)',
          100: 'rgba(255, 163, 132, 0.2)',
          200: 'rgba(255, 163, 132, 0.3)',
          300: 'rgba(255, 163, 132, 0.4)',
          400: 'rgba(255, 163, 132, 0.5)',
          500: '#ffa384',
          600: '#ff9670',
          700: '#ff885c',
          800: '#ff7b48',
          900: '#ff6d34',
        },
        'coral': {
          DEFAULT: '#ff8882',
          50: 'rgba(255, 136, 130, 0.1)',
          100: 'rgba(255, 136, 130, 0.2)',
          200: 'rgba(255, 136, 130, 0.3)',
          300: 'rgba(255, 136, 130, 0.4)',
          400: 'rgba(255, 136, 130, 0.5)',
          500: '#ff8882',
          600: '#ff7a73',
          700: '#ff6c64',
          800: '#ff5e55',
          900: '#ff5046',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'primary-gradient': 'linear-gradient(135deg, #543855 0%, rgba(41, 24, 41, 1) 100%)',
        'accent-gradient': 'linear-gradient(135deg, #e88d72 0%, #ff8882 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #ffa384 0%, #e88d72 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 10px rgba(232, 141, 114, 0.07)' 
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(255, 163, 132, 0.08), 0 0 30px rgba(232, 141, 114, 0.07)' 
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 163, 132, 0.08)',
        'glow-lg': '0 0 25px rgba(255, 163, 132, 0.12)',
        'accent': '0 8px 25px rgba(232, 141, 114, 0.25)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 163, 132, 0.08)',
      },
      dropShadow: {
        'glow': '0 0 10px rgba(232, 141, 114, 0.7)',
        'glow-lg': '0 0 20px rgba(255, 163, 132, 0.8)',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      blur: {
        '4xl': '72px',
      }
    },
  },
  plugins: [],
} 