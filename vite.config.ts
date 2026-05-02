import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "~": "/src",
    }
  },
server: {
  proxy:{
    "api/":{
      target: "http://localhost:5500",
      changeOrigin: true,
      secure: false,
    },
  },
}});
