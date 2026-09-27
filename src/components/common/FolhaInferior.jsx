import { useEffect } from 'react'
import { X } from 'lucide-react'

/** "Bottom sheet" — a moldura padrão de todo formulário do app. Fecha com
 * Esc ou X; NUNCA ao clicar fora, porque formulário com dado meio-digitado
 * some ao encostar sem querer é o tipo de armadilha que frustra no celular. */
export default function FolhaInferior({ titulo, aberto, onFechar, children }) {
  useEffect(() => {
    if (!aberto) return
    function aoTeclar(evento) {
      if (evento.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
    }
  }, [aberto, onFechar])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 sm:items-center sm:p-4">
      <div className="flex max-h-[92svh] w-full flex-col rounded-t-3xl border-t border-tinta-600 bg-tinta-900 sm:max-w-lg sm:rounded-3xl sm:border">
        <div className="flex shrink-0 items-center justify-between border-b border-tinta-700 px-5 py-4">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ouro-300">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onFechar}
            className="alvo-toque grid shrink-0 place-items-center rounded-full text-slate-400 hover:bg-tinta-800 hover:text-slate-100"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 pb-safe">{children}</div>
      </div>
    </div>
  )
}
