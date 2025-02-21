import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        chicago: ['Chicago', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        retro: {
          window: '#FFFFFF',
          border: '#000000',
          titlebar: '#000000',
          text: {
            DEFAULT: '#000000',
            title: '#FFFFFF',
            secondary: '#000000',
            disabled: '#666666',
          },
          background: '#9E9E9E',
          button: '#DDDDDD',
          'button-hover': '#EEEEEE',
          'button-active': '#CCCCCC',
          'border-light': '#FFFFFF',
          'border-dark': '#555555',
          'text-secondary': '#404040',
          selection: '#000080',
          toolbar: '#CCCCCC',
          'window-bg': '#E8E8E8',
        },
      },
    },
  },
  plugins: [],
};

export default config;
