/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#333333", // Dark Gray
        secondary: "#4F4F4F", // Soft Black
        accent: "#777777", // Mid Gray
        background: "#F5F5F5", // Light Gray
        border: "#E0E0E0", // Soft Gray
        textPrimary: "#111111", // Almost Black
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "Roboto", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
      },
      boxShadow: {
        subtle: "0px 4px 6px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
