import { defineConfig } from 'vite';

export default defineConfig({
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
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'product_placeholder_image.png') {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      },
    },
    assetsInlineLimit: 0 // Don't inline assets as base64
  },
});
