import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    const env = loadEnv(mode, process.cwd(), '');
    const apiBaseUrl = env.VITE_API_BASE_URL || env.REACT_APP_API_BASE_URL || 'http://107.21.67.222';
    
    // Extract just the base URL without /api/v1 for proxy target
    const proxyTarget = apiBaseUrl.replace(/\/api\/v1$/, '') || 'http://107.21.67.222:8080';
    
    console.log('🌐 API Configuration:', {
        mode,
        apiBaseUrl,
        proxyTarget,
        env: {
            VITE_API_BASE_URL: env.VITE_API_BASE_URL,
            REACT_APP_API_BASE_URL: env.REACT_APP_API_BASE_URL
        }
    });
    
    const plugins = [react()];
    
    if (mode === 'development') {
        try {
            const { componentTagger } = await import("lovable-tagger");
            plugins.push(componentTagger());
        } catch (error) {
            console.warn('Failed to load lovable-tagger:', error.message);
        }
    }
    
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
                    // rewrite: (path) => path, // Keep the path as is
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
                    // rewrite: (path) => path, // Keep the path as is
                },
            },
        },
        appType: 'spa',
        plugins,
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
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
            setupFiles: ['./src/setupTests.js'],
            css: true,
        },
    };
});
