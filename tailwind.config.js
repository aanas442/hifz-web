/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#F5F3EE",
        primary: "#1B4332",
        primary2: "#2D6A4F",
        accent: "#C9A84C",
        error: "#8B1A1A",
        card: "#FDFAF4",
        border: "#E8E4DC",
      },
    },
  },
  plugins: [],
};
