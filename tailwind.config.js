module.exports = {
  purge: ["./src/pages/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Roboto Mono", "monospace"],
    },
    colors: {
      grey: {
        50: "#fafafa",
        100: "#f4f4f5",
        200: "#e4e4e7",
        300: "#d4d4d8",
        400: "#a1a1aa",
        500: "#71717a",
        600: "#52525b",
        700: "#3f3f46",
        800: "#27272a",
        900: "#18181b",
      },
      white: "#FFFFFF",
      blue: "#0ca2cf",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
