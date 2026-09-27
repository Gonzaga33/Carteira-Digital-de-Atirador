// Registra o service worker gerado pelo vite-plugin-pwa. `autoUpdate` já
// troca a versão sozinho no próximo carregamento — não precisa de aviso
// nenhum na tela para um app deste tamanho.
import { registerSW } from 'virtual:pwa-register'

export function registrarServiceWorker() {
  registerSW({ immediate: true })
}
