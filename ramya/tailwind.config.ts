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
        blush:      "#FF9D9D",   // coral rose  — accents, hearts, errors
        peach:      "#FFC5AA",   // soft peach  — hover states, warm accents
        lime:       "#4A3060",   // mid purple  — borders, dividers
        mint:       "#BBF1D2",   // mint green  — success, confirmed, delivered
        gold:       "#FBC02D",   // golden text — prices, icons, dividers
        cream:      "#FBC02D",   // golden text — labels, text (alias)
        royal:      "#1A0A2E",   // deep purple — primary bg, buttons
        "deep-navy":"#120720",   // darker purple — button hover
        sage:       "#BBF1D2",   // alias → mint (orders delivered)
        steel:      "#FFC5AA",   // alias → peach (orders shipped)
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
