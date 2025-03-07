/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "var(--font-space-mono)",
          "var(--font-roboto-mono)",
          "monospace",
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#cccccc",
            a: {
              color: "#ffffff",
              "&:hover": {
                color: "#aaaaaa",
              },
            },
            h1: {
              color: "#ffffff",
            },
            h2: {
              color: "#ffffff",
            },
            h3: {
              color: "#ffffff",
            },
            h4: {
              color: "#ffffff",
            },
            blockquote: {
              color: "#aaaaaa",
              borderLeftColor: "#333333",
            },
            code: {
              color: "#ffffff",
              backgroundColor: "#333333",
            },
            pre: {
              backgroundColor: "#222222",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
