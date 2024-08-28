import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://www.carqueryapi.com',
                changeOrigin: true,
                //pathRewrite: {'^/api': ''},
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});

