import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

// Publicado normalmente na raiz de um domínio próprio ("/"). O GitHub
// Pages de um repositório serve num subcaminho
// (https://<usuario>.github.io/<repo>/) — a variável BASE_PATH, definida
// só no workflow de deploy, desloca o caminho base dos arquivos E do
// manifest para esse caso. Rodar `npm run build`/`dev` sem a variável
// continua exatamente como sempre foi.
const base = process.env.BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        id: base,
        lang: 'pt-BR',
        // Nome/descrição/ícone do manifest são o que aparece no ícone da
        // tela inicial e no diálogo "instalar app" — discretos de
        // propósito, para não revelar posse de arma a quem olhar o
        // celular por cima do ombro. O nome de verdade só aparece dentro
        // do app já aberto (Cabecalho.jsx).
        name: 'Documentos',
        short_name: 'Documentos',
        description: 'Guarde e organize seus documentos pessoais, com backup local.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        // A carteira depende de dado do usuário (IndexedDB), não de rede —
        // o app shell é cacheado para funcionar 100% offline depois da 1ª visita.
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: { cacheName: 'imagens-cac' },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
})
