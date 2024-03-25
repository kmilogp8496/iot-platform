import type { Config } from 'tailwindcss'

export const PrimaryColor = {
  50: '#ebfdff',
  100: '#cef9ff',
  200: '#a3f2fe',
  300: '#63e6fd',
  400: '#1cd0f4',
  500: '#00b3da',
  600: '#038eb7',
  700: '#0b799d',
  800: '#125c78',
  900: '#144c65',
  950: '#063246',
}

export default <Partial<Config>>{
  theme: {
    fontFamily: {
      sans: ['DM Sans', 'Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        'jelly-bean': PrimaryColor,
      },
    },
  },
}
