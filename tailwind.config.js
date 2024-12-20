/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      scrollbar: {
        DEFAULT: {
          "::-webkit-scrollbar": {
            width: "12px",
          },
          "::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
            border: "3px solid #f1f1f1",
          },
          "::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
}
