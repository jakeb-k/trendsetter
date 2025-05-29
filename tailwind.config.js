/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00',
        secondary: '#121212',
        tertiary: "#1E1E24"
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        satoshi_italic: ['Satoshi-Italic', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}