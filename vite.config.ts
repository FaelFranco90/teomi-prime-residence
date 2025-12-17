import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Configurar headers de cache para imagens estáticas
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Otimização de assets
  build: {
    // Configurar compressão de imagens estáticas
    rollupOptions: {
      output: {
        // Manter estrutura de assets
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(-1);
          if (/png|jpe?g|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2|ttf|otf|eot/.test(extType)) {
            extType = 'fonts';
          } else if (extType === 'css') {
            extType = 'css';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      },
    },
    // Otimizar chunks
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
      },
    },
  },
  // Otimização de imagens inline
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
}));

