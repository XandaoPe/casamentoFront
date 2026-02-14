// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf8f6",
          100: "#f2e6e2",
          200: "#e6d5cc",
          300: "#d9c4b6",
          400: "#cdb3a0",
          500: "#c1a28a",
          600: "#b59174",
          700: "#a9805e",
          800: "#9d6f48",
          900: "#915e32",
        },
        gold: "#d4af37",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        script: ["Great Vibes", "cursive"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "bounce-slow": "bounce 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
