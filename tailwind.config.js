/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      "about-4": "1140px",
      "form": "920px",
      "footer-2": "560px",
      "footer-4": "1150px",
      "team": "820px",
      "review": "900px",
    },
    extend: {
      screens: {
        xs: "480px",
        sm: "640px",
        md: "720px",
        lg: "1024px",
      },
      colors: {
        brand: {
          DEFAULT: "#a80717",
          light: "#d63342",
          dark: "#7a0510",
          glow: "rgba(168, 7, 23, 0.55)",
        },
        ink: {
          950: "#0a0a0a",
          900: "#111111",
          800: "#171717",
          700: "#1c1c1c",
          600: "#262626",
        },
      },
      backgroundPosition: {
        "center-top": "center top",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #d63342 0%, #a80717 50%, #7a0510 100%)",
        "ink-fade":
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)",
        "noise":
          "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "noise": "3px 3px",
      },
      boxShadow: {
        "glow-sm": "0 0 12px rgba(168, 7, 23, 0.35)",
        "glow": "0 0 24px rgba(168, 7, 23, 0.45)",
        "glow-lg": "0 0 40px rgba(168, 7, 23, 0.55)",
        "card": "0 10px 30px -12px rgba(0,0,0,0.6)",
        "card-hover": "0 20px 50px -16px rgba(168, 7, 23, 0.4)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(168, 7, 23, 0.55)",
          },
          "50%": {
            boxShadow: "0 0 0 12px rgba(168, 7, 23, 0)",
          },
        },
        "ken-burns": {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "50%": { transform: "scale(1.08) translate(-1%, -1%)" },
          "100%": { transform: "scale(1) translate(0, 0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-out infinite",
        "ken-burns": "ken-burns 20s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "shimmer": "shimmer 2s linear infinite",
        "bounce-soft": "bounce-soft 1.6s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
