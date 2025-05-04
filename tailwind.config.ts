/* eslint-disable import/no-anonymous-default-export */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "overlay-show": "overlay-show 0.3s ease-out",
        "content-show": "content-show 0.3s ease-out",
      },
      keyframes: {
        "overlay-show": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "content-show": {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
