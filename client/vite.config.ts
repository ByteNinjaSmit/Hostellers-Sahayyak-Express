import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // Ensure .jsx is in the list of extensions
  },
  optimizeDeps: {
    include: ["@tensorflow-models/face-landmarks-detection", "@tensorflow/tfjs"],
  },
  plugins: [
    react(),
  ],
});
