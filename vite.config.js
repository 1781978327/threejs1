import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    server: {
        port: 3000
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        chunkSizeWarningLimit: 1000,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    'three': ['three'],
                    'vendor': [
                        'ws'
                    ],
                    'game-core': [
                        './main.js',
                        './scene.js',
                        './character.js',
                        './camera.js',
                        './controls.js'
                    ],
                    'game-objects': [
                        './enemy.js',
                        './grenade.js',
                        './bullet.js',
                        './building.js',
                        './cube.js'
                    ]
                },
                format: 'es',
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    publicDir: 'public',
    assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.fbx', '**/*.obj', '**/*.mtl', '**/*.png', '**/*.jpg', '**/*.jpeg'],
    base: './',
    copyPublicDir: true,
    optimizeDeps: {
        include: ['three']
    }
}); 