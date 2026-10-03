// IBS – Isatis Business Solutions · Tailwind preset
// Usage: tailwind.config.js → presets: [require("./ibs/tailwind.preset.js")]
module.exports = {
  theme: {
    extend: {
      colors: {
        ibs: {
          yellow: "#F9C852",
          "on-yellow": "#171717",
          cream: "#FEF9ED",
          glow: "#613F0F",
          bg: "#171717",
          surface: "#232323",
          "surface-high": "#3A3A3A",
          muted: "#9A958C",
          positive: "#7FB77E",
          negative: "#D9725B",
          // light / paper
          paper: "#FFFFFF",
          "paper-surface": "#FBF7EE",
          "paper-line": "#E4DCC8",
          "paper-muted": "#6B665E",
          "gold-text": "#8A6A12",
        },
      },
      fontFamily: { ibs: ["Poppins", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"] },
      borderRadius: { card: "24px", button: "16px", input: "12px" },
      letterSpacing: { label: "0.15em" },
    },
  },
};
