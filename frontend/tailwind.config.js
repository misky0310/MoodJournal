/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF5",
        background: "#1E1E2F",   // dark background
        card: "#2C2C3A",         // card bg
        text: "#EDEDED",         // primary text
        accent: "#FFB454",       // optional accent
        muted: "#A0A0B0",        // secondary text
        border: "#3A3A4D",
      },
    },
  },
  plugins: [],
};
