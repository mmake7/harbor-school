import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#FFFFFF",
        surface: "#F4F7F5",
        primary: {
          DEFAULT: "#10B981",
          dark: "#047857",
          light: "#ECFDF5",
        },
        ink: "#0F172A",
        muted: {
          DEFAULT: "#64748B",
          light: "#94A3B8",
        },
        border: {
          DEFAULT: "#E2E8F0",
          strong: "#CBD5E1",
        },
        season: {
          q1: "#FF4757",
          q2: "#4F46E5",
          q3: "#F59E0B",
          q4: "#84CC16",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "Inter",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
