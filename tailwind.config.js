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
      backgroundPosition: {
        "center-top": "center top",
      },
    },
  },
  plugins: [],
}
