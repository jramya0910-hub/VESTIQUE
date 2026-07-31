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
        lime:       "#EEF8CD",   // pale lime   — light backgrounds, borders
        mint:       "#BBF1D2",   // mint green  — success, confirmed, delivered
        gold:       "#C17F6E",   // muted terra — prices, dividers, icons
        cream:      "#FFF5EE",   // off-white   — card bg, surfaces
        royal:      "#3D2C2C",   // deep mocha  — primary text, headings
        "deep-navy":"#2A1F1F",   // darker mocha— button hover
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
