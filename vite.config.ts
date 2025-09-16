import { defineConfig } from 'vite';
import { resolve } from 'path';

import { viteSingleFile } from 'vite-plugin-singlefile';
export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    target: 'es6',
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'ui.html'),
    }
  }
});
