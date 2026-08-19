/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0A0E12",
          900: "#12171D",
          800: "#1B222B",
          700: "#28323D",
          600: "#3C4A59",
          500: "#576B7E",
          400: "#7C93A6",
          300: "#A9BCC9",
          200: "#D0DBE2",
          100: "#E9EFF3",
          50: "#F5F8FA"
        },
        signal: {
          600: "#1F7A5C",
          500: "#2A9873",
          400: "#5CBB9B",
          100: "#DCF0E7"
        },
        alarm: {
          600: "#B23A2E",
          500: "#D2483A",
          100: "#F8E1DE"
        },
        beacon: {
          600: "#A9781F",
          500: "#CB9A34",
          100: "#F5E9D0"
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
