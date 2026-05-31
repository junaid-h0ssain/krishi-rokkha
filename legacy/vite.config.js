import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        welcome: resolve(__dirname, 'welcome.html'),
        app: resolve(__dirname, 'app.html'),
        smart_ai: resolve(__dirname, 'smart_ai.html'),
        // pest_scan_entry: resolve(__dirname, 'src/pest-scan-entry.js'),
        A4: resolve(__dirname, 'public/A4.html'),
        about: resolve(__dirname, 'public/about.html'),
        farmer_stories: resolve(__dirname, 'public/farmer_stories.html'),
        our_research: resolve(__dirname, 'public/our_research.html'),
        pest_scan: resolve(__dirname, 'public/pest-scan.html'),
        bangla_voice: resolve(__dirname, 'public/bangla-voice-interface.html'),
        local_risk_map: resolve(__dirname, 'public/local-risk-map.html'),
        team: resolve(__dirname, 'public/team.html'),
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
