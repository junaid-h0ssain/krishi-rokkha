import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        welcome: resolve(__dirname, 'welcome.html'),
        app: resolve(__dirname, 'app.html'),
        about: resolve(__dirname, 'public/about.html'),
        farmer_stories: resolve(__dirname, 'public/farmer_stories.html'),
        our_research: resolve(__dirname, 'public/our_research.html'),
        pest_scan: resolve(__dirname, 'public/pest-scan.html'),
      },
    },
  },
  publicDir: 'public',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Proxy API requests to the backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
