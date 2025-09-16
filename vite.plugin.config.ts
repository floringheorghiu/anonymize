import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const placeholderImage = readFileSync(resolve(__dirname, 'src/assets/product_placeholder_image.png'), 'base64');

export default defineConfig({
  define: {
    __placeholderImage__: JSON.stringify(placeholderImage),
  },
  build: {
    target: 'es6',
    lib: {
      entry: 'src/code.ts',
      formats: ['iife'],
      name: 'figmaPlugin',
      fileName: () => 'code.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        format: 'iife',
        extend: true,
      },
    },
  },
});
