/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      colors: {

        gold: {
          light: "#F4D068",
          DEFAULT: "#D4AF37",
          dark: "#AA820A",
        },

        dark: {
          bg: "#0B0B0B",
          card: "#161616",
          border: "#262626",
        },

      },

      animation: {
        grain: "grain 8s steps(10) infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "pulse-slow":
          "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      keyframes: {
        grain: {
          "0%,100%": {
            transform: "translate(0,0)",
          },
          "10%": {
            transform: "translate(-5%,-10%)",
          },
          "30%": {
            transform: "translate(-15%,5%)",
          },
          "50%": {
            transform: "translate(7%,9%)",
          },
          "70%": {
            transform: "translate(-3%,15%)",
          },
          "90%": {
            transform: "translate(12%,-5%)",
          },
        },

        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },

          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },

      boxShadow: {
        gold:
          "0 0 30px rgba(212,175,55,0.18)",

        card:
          "0 10px 40px rgba(0,0,0,0.35)",
      },

      borderRadius: {
        xl3: "24px",
        xl4: "32px",
      },
    },
  },

  plugins: [],
};

