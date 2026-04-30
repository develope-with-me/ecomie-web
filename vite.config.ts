import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig((_mode) => {
    const env = loadEnv(_mode.mode, process.cwd(), '');
    const apiBaseUrl = env.VITE_API_BASE_URL || env.REACT_APP_API_BASE_URL || 'http://107.21.67.222';
    
    // Extract just the base URL without /api/v1 for proxy target
    const proxyTarget = apiBaseUrl.replace(/\/api\/v1$/, '') || 'http://107.21.67.222:8080';
    
    return {
        // Define environment variables for the client-side
        define: {
            __API_BASE_URL__: JSON.stringify(apiBaseUrl),
        },
        server: {
            host: "::",
            port: 3000,
            middlewareMode: false,
            proxy: {
                '/api': {
                    target: proxyTarget,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        preview: {
            host: "::",
            port: 8080,
            proxy: {
                '/api': {
                    target: proxyTarget,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        appType: 'spa',
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src/react-app"),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: undefined,
                },
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./src/react-app/setupTests.js'],
            css: true,
        },
    };
});