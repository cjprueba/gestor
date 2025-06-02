import { type Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          primaryy: '#091E39',
        },
        primary: {
          50: '#BFEEFF',
          100: '#A1D2FF',
          200: '#83B6FF',
          300: '#649CFD',
          400: '#4282E0',
          500: '#0F69C4',
          600: '#0051A8',
          700: '#003B8D',
          800: '#002673',
          900: '#00135A',
        },
        accent: {
          50: '#FFECEF',
          100: '#FFCFD3',
          200: '#FA9E9B',
          300: '#F37874',
          400: '#FF4731',
          500: '#F63E32',
          600: '#E4332C',
          700: '#D72C25',
          800: '#C82018',
        },
        secondary: {
          50: '#EBFEFF',
          100: '#CFE1F3',
          200: '#B3C5D7',
          300: '#98AABB',
        },
        gray: {
          50: '#FFFFFF',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        success: {
          50: '#BCFFFF',
          100: '#9EFFFF',
          200: '#7FFFF5',
          300: '#60E5D9',
          400: '#3DC9BD',
          500: '#00ADA2',
          600: '#009288',
          700: '#00786F',
          800: '#005E56',
          900: '#00463F',
        },
        warning: {
          50: '#FFF79B',
          100: '#FFDA80',
          200: '#FFBD65',
          300: '#FFA14B',
          400: '#FF862F',
          500: '#f56b0f',
          600: '#d55000',
          700: '#b53500',
          800: '#790000',
        },
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        elevation1: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        elevation2: '0px 2px 4px rgba(0, 0, 0, 0.06)',
        elevation3: '0px 4px 6px rgba(0, 0, 0, 0.08)',
        elevation4: '0px 6px 12px rgba(0, 0, 0, 0.10)',
        elevation5: '0px 8px 16px rgba(0, 0, 0, 0.12)',
      },
      fontFamily: {
        //eslint-disable-next-line
        sans: ['Roboto', 'sans-serif'],
        slab: ['"Roboto Slab"', 'serif'],
      },
      fontSize: {
        // Encabezados
        'heading-xl': ['3rem', '3.25rem'], // 48px / 52px
        'heading-l': ['2.25rem', '3rem'], // 36px / 48px
        'heading-m': ['2rem', '2.45rem'], // 31px / 39px
        'heading-s': ['1.6rem', '2rem'], // 25px / 31px

        // Cuerpo
        'body-l': ['1.125rem', '2rem'], // 18px / 32px
        'body-m': ['1rem', '2rem'], // 16px / 32px
        'body-s': ['0.875rem', '2rem'], // 14px / 32px
        'body-xs': ['0.75rem', '1.5rem'], // 12px / 24px
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        bold: '700',
      },
    },
  },
  plugins: [],
}
export default config
