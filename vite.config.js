import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import solidRefresh from 'solid-refresh/babel'

export default defineConfig({
  plugins: [solid(
    {
      babel: {
        plugins: [
          [solidRefresh, { bundler: 'vite' }],
        ],
      },
    }
  )],
})
