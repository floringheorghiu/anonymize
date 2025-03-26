import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'es6',
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        ui: resolve(__dirname, 'src/ui.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
