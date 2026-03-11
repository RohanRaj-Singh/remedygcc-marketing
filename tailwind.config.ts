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
        primary: "#0F412E",
        "text-gray": "#6D6D6D",
        "footer-text": "#D7DFD8",
        white: "#FFFFFF",
        // Future colors placeholders
        "accent-1": "#000000",
        "accent-2": "#000000",
        "accent-3": "#000000",
        "accent-4": "#000000",
        "accent-5": "#000000",
      },
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        "roca-one": ["Roca One", "sans-serif"],
      },
      fontSize: {
        "hero-heading": ["70px", { lineHeight: "1.1" }],
        "section-heading": ["60px", { lineHeight: "1.2" }],
        paragraph: ["30px", { lineHeight: "1.6" }],
        "nav-item": ["25px", { lineHeight: "1.4" }],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          xl: "1280px",
        },
      },
      borderRadius: {
        "btn-primary": "10px",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
};
export default config;
