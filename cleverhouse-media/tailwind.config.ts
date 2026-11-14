import type { Config } from "tailwindcss";

/**
 * CleverHouse Media design tokens.
 * Palette is sampled from the official logo:
 *   espresso wordmark  ≈ rgb(40,16,8)
 *   copper mark        ≈ rgb(152,96,56) → rgb(184,128,88)
 * Complementary system: deep ink surfaces, warm bone/paper neutrals,
 * and a sparing "verdigris" accent — the natural patina of copper.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#120B07",
          950: "#0B0705",
          900: "#120B07",
          850: "#1A110C",
          800: "#221610",
          700: "#2E1E16",
          600: "#3F2B20",
        },
        espresso: "#2A140A",
        copper: {
          100: "#F6E6D6",
          200: "#EDCDAE",
          300: "#E2B48A",
          400: "#CF9A6A",
          500: "#B88058",
          600: "#985E38",
          700: "#6E4127",
          800: "#4A2B19",
        },
        bone: {
          DEFAULT: "#F4EDE4",
          50: "#FBF8F3",
          100: "#F4EDE4",
          200: "#E8DDD0",
          300: "#D6C7B5",
          400: "#B4A390",
          500: "#8C7B69",
        },
        verdigris: {
          300: "#9BD8CB",
          400: "#6CC2B1",
          500: "#3F9C8B",
          700: "#1F5A50",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Fluid editorial scale
        "mega": ["clamp(3.4rem, 11.5vw, 13rem)", { lineHeight: "0.86", letterSpacing: "-0.045em" }],
        "giant": ["clamp(3rem, 8.4vw, 9.5rem)", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
        "huge": ["clamp(2.6rem, 6vw, 6.4rem)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "big": ["clamp(2.1rem, 4.2vw, 4.4rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "large": ["clamp(1.6rem, 2.6vw, 2.6rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "lead": ["clamp(1.08rem, 1.3vw, 1.32rem)", { lineHeight: "1.6" }],
        "micro": ["0.7rem", { lineHeight: "1.2", letterSpacing: "0.18em" }],
      },
      opacity: {
        3: "0.03",
        6: "0.06",
        7: "0.07",
        8: "0.08",
        12: "0.12",
        14: "0.14",
        16: "0.16",
        18: "0.18",
        22: "0.22",
      },
      maxWidth: {
        prose: "62ch",
        shell: "1680px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "scroll-dot": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "translateY(320%)", opacity: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        shimmer: { "0%": { backgroundPosition: "200% 50%" }, "100%": { backgroundPosition: "-200% 50%" } },
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-fast": "marquee 22s linear infinite",
        "scroll-dot": "scroll-dot 2.2s cubic-bezier(0.76,0,0.24,1) infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite",
        shimmer: "shimmer 6s linear infinite",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};

export default config;
