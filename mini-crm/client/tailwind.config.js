/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#0D1117",
          900: "#141B24",
          800: "#1D2733",
          700: "#2B3847",
          600: "#425264",
          500: "#5C7086",
          400: "#8398AC",
          300: "#AFBFD0",
          200: "#D3DEE8",
          100: "#EAF0F5",
          50: "#F6F9FB"
        },
        brass: {
          600: "#96712A",
          500: "#BC9142",
          400: "#D3AF6B",
          100: "#F3E7CE"
        },
        rose: {
          600: "#AF3B34",
          500: "#CC4B43",
          100: "#F8E0DE"
        },
        sage: {
          600: "#3F7256",
          500: "#4E8C69",
          100: "#E1EFE6"
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
