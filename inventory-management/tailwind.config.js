/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,tsx,mdx}",
    "./components/**/*.{js,jsx,tsx,mdx}",
    "./app/**/*.{js,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customGreen : '#53b2a3',
        customGreenSecondary: '#53B2A3'
      },
    },
  },
  plugins: [],
};
