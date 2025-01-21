/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Fira Sans Condensed"', "sans-serif"],
      },
      colors: {
        brightColor: "#de7e80",
        customColor: "#de7e80",
      },
    },
  },
  plugins: [],
};
