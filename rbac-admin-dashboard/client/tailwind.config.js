/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B1210",
          900: "#101B18",
          800: "#182722",
          700: "#233830",
          600: "#33534A",
          500: "#4A7268",
          400: "#6E9A8F",
          300: "#9FC0B5",
          200: "#CFE1D9",
          100: "#E9F1EC",
          50: "#F5F9F7"
        },
        signal: {
          600: "#B4622B",
          500: "#D97B3F",
          400: "#E8A671",
          100: "#FBE8D8"
        },
        danger: {
          600: "#B3261E",
          500: "#DC3B32",
          100: "#FBE2E0"
        }
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"]
      }
    }
  },
  plugins: []
};
