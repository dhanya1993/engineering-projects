/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        studio: {
          950: "#0E0D0C",
          900: "#171513",
          800: "#221F1B",
          700: "#332E27",
          600: "#4E463A",
          500: "#6E6353",
          400: "#948872",
          300: "#BCAF97",
          200: "#DED4C1",
          100: "#EFE9DC",
          50: "#F8F5EE"
        },
        tape: {
          600: "#B8842E",
          500: "#D9A13F",
          400: "#E8BE6E",
          100: "#F7E8CC"
        },
        rec: {
          600: "#B3332B",
          500: "#D8433A",
          100: "#F8DEDC"
        }
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"]
      }
    }
  },
  plugins: []
};
