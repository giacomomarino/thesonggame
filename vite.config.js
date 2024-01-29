import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import vercel from "solid-start-vercel";

export default defineConfig({
  plugins: [
      solid({ adapter: vercel({ edge: true }) })
  ],
});