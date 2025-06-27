/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
  extend: {
    keyframes: {
      'orbit-ping': {
        '0%':   { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
        '100%': { transform: 'rotate(360deg) translateX(80px) rotate(-360deg)' },
      },
    },
    animation: {
      'orbit-ping': 'orbit-ping 6s linear infinite',
    },
  }
},
plugins: [
  require('tailwind-scrollbar'),
],

}
