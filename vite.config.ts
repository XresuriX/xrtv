import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM environments
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/',

  plugins: [
    react(),
  ],

  resolve: {
    alias: {
      // Critical for shadcn – must match tsconfig.json paths
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  build: {
    outDir: 'dist',
    sourcemap: false,  
    chunkSizeWarningLimit: 1000, 

    rollupOptions: {
      output: {
        manualChunks: {

          'babylon-vendor': ['@babylonjs/core', 'react-babylonjs'],
          
          'ui-vendor': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            '@radix-ui/react-slot',
            'lucide-react', 
          ],
        },
      },
    },
  },

  // If you load 3D models, tell Vite to treat them as assets
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
});