import type { Config } from "tailwindcss";
import marten from "./brand/tailwind.preset";

const config: Config = {
  presets: [marten],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./brand/**/*.{ts,tsx}",
  ],
};

export default config;
