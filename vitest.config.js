import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './tests/setup.js',
        include: ['tests/**/*.spec.js'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/cypress/**'
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'tests/',
                '**/*.config.js',
                '**/types.ts',
                'src/main.js'
            ],
            reportsDirectory: './coverage',
            all: true,
            lines: 70,
            functions: 70,
            branches: 70,
            statements: 70
        },
        deps: {
            inline: [
                /@fortawesome/,
                /vue-i18n/
            ]
        }
    }
})