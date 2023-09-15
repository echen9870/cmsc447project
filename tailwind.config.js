/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        prismDarkPurple:'#222136',
        prismDark:'#1a192b',
        prismPurple:'#2a2c48',
        prismLightPurple:'#2a2c48',
        prismGroupInput:'#36375c',
      }
    },
  },
  plugins: [],
}

