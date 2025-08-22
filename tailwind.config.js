module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}', // Add app folder inside src
    './src/pages/**/*.{js,ts,jsx,tsx}',    // Add pages folder inside src
    './src/components/**/*.{js,ts,jsx,tsx}', // Add components folder inside src
    './src/utils/**/*.{js,ts,jsx,tsx}', // Optionally add utils if you are using Tailwind classes there
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
