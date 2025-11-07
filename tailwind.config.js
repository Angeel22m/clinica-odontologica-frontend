/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primario: "#2D3540",
        grisClaro: "#F2F2F2",
        celeste: "#7ED1F2",
        celeste2: "#04B2D9",
        verde: "#74BF04",
      },
      boxShadow: {
        card: "0 15px 35px -10px rgba(0,0,0,0.15)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
