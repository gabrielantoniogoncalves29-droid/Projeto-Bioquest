import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const BASE = '/Projeto-Bioquest/'

function fallbackParaPaginasEstaticas() {
  return {
    name: 'bioquest-fallback-spa',
    apply: 'build',
    writeBundle(opcoes) {
      const pasta = opcoes.dir
      const indice = pasta && path.join(pasta, 'index.html')

      if (indice && fs.existsSync(indice)) fs.copyFileSync(indice, path.join(pasta, '404.html'))
    }
  }
}

function exigirApiHttps(modo, raiz) {
  const url = loadEnv(modo, raiz, 'VITE_').VITE_API_URL ?? ''

  if (!/^https:\/\/[^/\s]+/.test(url)) {
    throw new Error(
      'VITE_API_URL deve ser o endereço HTTPS público da API (ex.: https://api.exemplo.com). ' +
      `Valor recebido: "${url}". Defina a variável de repositório VITE_API_URL no GitHub.`
    )
  }
}

export default defineConfig(({ command, mode }) => {
  if (command === 'build' && mode === 'production') exigirApiHttps(mode, process.cwd())

  return {
    base: BASE,

    plugins: [
      vue(),
      vueDevTools(),
      fallbackParaPaginasEstaticas(),
    ],

    server: {
      proxy: {
        '/api': 'http://localhost:3000',
        '/uploads': 'http://localhost:3000'
      }
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
