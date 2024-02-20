import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#101010",
        secondary: "#FF2020",
        darky: { "50": "#f8fafc", "100": "#f1f5f9", "200": "#e2e8f0", "300": "#cbd5e1", "400": "#94a3b8", "500": "#64748b", "600": "#475569", "700": "#334155", "800": "#1e293b", "900": "#0f172a", "950": "#020617" }
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      backdropBlur: ['responsive']
    }
  },
  plugins: [],
} as Config;
