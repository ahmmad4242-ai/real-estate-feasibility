/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",   // أزرق
        secondary: "#10b981", // أخضر
        accent: "#f59e0b",    // برتقالي
        danger: "#ef4444"     // أحمر
      },
      fontFamily: {
        sans: ["Tajawal", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
}
