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
        primary: {
          DEFAULT: "#154738",
          hover: "#134133",
          active: "#0f3228",
          bg: "#e8edeb",
          light: "#b6c6c1",
          border: "#62847a",
        },
        success: { DEFAULT: "#067f54", bg: "#edfdec", border: "#b2e2b1", text: "#045a3c" },
        error: { DEFAULT: "#f03c46", bg: "#feeced", border: "#f8a5aa", text: "#842127" },
        warning: { DEFAULT: "#e8bf1b", bg: "#fffbe9", border: "#ffdb4b", text: "#6b580d" },
        info: { DEFAULT: "#a3a0af", bg: "#f3f1fb", border: "#d0cde0", text: "#575257" },
        mx: {
          text: "#2D2926",
          "text-secondary": "#61636a",
          "text-tertiary": "#a0a2aa",
          "text-heading": "#393a3f",
          border: "#E9E9E9",
          "bg-container": "#ffffff",
          "bg-layout": "#F3F3F4",
          "bg-page": "#f9f9f9",
          "bg-card": "#fafafa",
          "bg-elevated": "#fdfdfd",
          sidebar: "#0f3228",
          "sidebar-hover": "#446c60",
          "sidebar-selected": "#446c60",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'Roboto Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
