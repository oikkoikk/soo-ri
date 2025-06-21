import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import removeConsole from 'vite-plugin-remove-console'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react(), svgr(), command === 'build' && removeConsole({ includes: ['log', 'warn', 'error'] })],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})
