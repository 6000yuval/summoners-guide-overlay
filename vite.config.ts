import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080, // Changed to match Lovable requirements
    open: false, // Don't auto-open browser (Electron will handle this)
    cors: true,
    hmr: {
      port: 8081,
    },
  },
  publicDir: 'public',
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Make environment variables available to the client
    'import.meta.env.VITE_ENABLE_MOCKS': JSON.stringify(process.env.ENABLE_MOCKS || 'true'),
    'import.meta.env.VITE_MOCK_GAME_STATE': JSON.stringify(process.env.MOCK_GAME_STATE || 'ChampSelect'),
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
}));
