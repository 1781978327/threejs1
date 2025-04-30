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
                drop_console: false,
                drop_debugger: true
            }
        },
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules/three')) {
                        return 'three';
                    }
                    if (id.includes('node_modules/ws')) {
                        return 'vendor';
                    }
                    // 将所有游戏相关模块打包在一起
                    if (id.includes('.js')) {
                        return 'game';
                    }
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
        include: ['three'],
        exclude: ['enemy.js', 'building.js', 'bullet.js', 'grenade.js', 'cube.js']
    },
    preview: {
        port: 4173,
        strictPort: true,
        host: true
    }
}); 