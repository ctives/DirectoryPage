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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Primary brand colors (Sage Green)
        primary: {
          50: '#F0F5F3',
          100: '#D9E8E3',
          200: '#B8D9D0',
          300: '#98CBBC',
          400: '#78BCA9',
          500: '#5AAE97',
          600: '#479E86',
          700: '#3D8E74',
          800: '#2F6B5C',
          900: '#1F4739',
        },
        // Accent colors (Coral/Warm tones)
        accent: {
          50: '#FDF5F3',
          100: '#FDE8E3',
          200: '#FBCFC5',
          300: '#F9B7A7',
          400: '#F49E89',
          500: '#E07856',
          600: '#D46744',
          700: '#C85633',
          800: '#B04528',
          900: '#98341D',
        },
        // Neutral grays
        neutral: {
          50: '#F9FAFA',
          100: '#F5F5F5',
          200: '#E8E8E8',
          300: '#CCCCCC',
          400: '#999999',
          500: '#6B6B6B',
          600: '#555555',
          700: '#3D3F47',
          800: '#2D2E33',
          900: '#1A1B1E',
        },
      },
    },
  },
  plugins: [],
};
export default config;
