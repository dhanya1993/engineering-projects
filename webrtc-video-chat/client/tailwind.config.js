/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        onyx: {
          950: "#0A0A0C",
          900: "#131317",
          800: "#1C1C22",
          700: "#2A2A33",
          600: "#404050",
          500: "#5C5C70",
          400: "#84849A",
          300: "#ADADC0",
          200: "#D2D2DF",
          100: "#ECECF2",
          50: "#F7F7FA"
        },
        wave: {
          600: "#2B6CB0",
          500: "#3B82C4",
          400: "#6BA3D6",
          100: "#DCEAF6"
        },
        cue: {
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
