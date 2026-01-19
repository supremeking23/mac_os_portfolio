import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// for widnows path resolution only ? What about other OS? 
import { dirname, resolve } from 'path/win32'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '#components': resolve(dirname(fileURLToPath(import.meta.url)), "src/components"),
      '#constants': resolve(dirname(fileURLToPath(import.meta.url)), "src/constants"),
      '#store': resolve(dirname(fileURLToPath(import.meta.url)), "src/store"),
      '#hoc': resolve(dirname(fileURLToPath(import.meta.url)), "src/hoc"),
      '#windows': resolve(dirname(fileURLToPath(import.meta.url)), "src/windows"),
    },
  },
})
