/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import TanStackRouter from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import license from "rollup-plugin-license";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    license({
      sourcemap: true,
      thirdParty: {
        output: resolve(__dirname, 'dist', 'License.txt'),
        includePrivate: true,
        multipleVersions: true,
      },
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
