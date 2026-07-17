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
        kts: {
          orange: "#FF6B00",
          black: "#121212",
          gray: "#1E1E1E",
          lightGray: "#F5F5F7"
        },
      },
    },
  },
  plugins: [],
};
export default config;