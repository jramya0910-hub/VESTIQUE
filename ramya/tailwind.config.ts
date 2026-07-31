import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold:       "#FBC02D",   // warm gold    — prices, icons, dividers, hover
        ivory:      "#F5E6D0",   // champagne    — headings, body text
        maroon:     "#3B0A0A",   // deep maroon  — dark surfaces, cards
        "maroon-mid":"#5C1010",  // mid maroon   — borders, dividers
        "maroon-rich":"#8B1A1A", // rich maroon  — hover borders, accents
        blush:      "#C0392B",   // crimson      — hearts, error accents
        royal:      "#063B00",   // dark forest green — visible on dark bg
        "deep-navy":"#280606",   // darkest       — button hover, deepest bg
        cream:      "#F5E6D0",   // alias ivory  — used in existing classes
        sage:       "#A8D8A8",   // soft green   — delivered badge
        steel:      "#D4A574",   // warm tan     — shipped badge
        mint:       "#A8D8A8",   // alias sage
        peach:      "#D4A574",   // alias steel
        lime:       "#5C1010",   // alias maroon-mid — borders
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
