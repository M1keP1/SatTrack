/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        orbitPing: {
          "0%": {
            transform: "rotate(0deg) translateX(80px) rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg) translateX(80px) rotate(-360deg)",
          },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "orbit-ping": "orbitPing 6s linear infinite",
        "spin-slow": "spin 6s linear infinite",
        typing: "typing 3s steps(30, end)",
        blink: "blink 1.2s steps(1, start) infinite",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar",'tailwind-scrollbar-hide')],
};
