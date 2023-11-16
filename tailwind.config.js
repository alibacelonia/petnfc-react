/** @type {import('tailwindcss').Config} */
module.exports = {
  // prefix: 'tw-',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pet-cover': "url('/public/assets/cover.png')",
        'pet-bg': "url('/public/assets/bg.png')",
      },
      backgroundSize: {
        '50%': '50%',
        '16': '40rem',
      }
    },
  },
  plugins: [],
}