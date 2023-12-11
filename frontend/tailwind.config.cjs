module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      'sans': ['poppins']
    },
    colors: {
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
      purple: {
        darkest: '#4F00A9',
        dark: '#7030BA',
        medium: '#9260CB',
        light: '#B48FDD',
        lightest: '#D5BDED'
      },
      grey: {
        darkest: '#544F54',
        dark: '#777277',
        medium: '#9A9599',
        light: '#BAB8BB',
        lightest: '#DCDCDC'
      },
      accent: {
        yellow: '#FFFBDD',
        purple: '#DFCEFF',
        pink: '#FEBBEE',
        green: '#C6F6CA',
        orange: '#FFD5BE'
      },
      positive: {
        light: '#D0F5DF',
        DEFAULT: '#0D803D',
        dark: '#09592A',
      },
      negative: {
        light: '#FFE5E5',
        DEFAULT: '#D9626B',
        dark: '#992424',
      },
      animation: {
        enter: 'enter 200ms ease-out',
        'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
        leave: 'leave 150ms ease-in forwards',
      },
      keyframes: {
        enter: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        leave: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0.9)', opacity: 0 },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
};
