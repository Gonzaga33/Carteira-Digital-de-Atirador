import { useEffect } from 'react'
import { X, FileWarning } from 'lucide-react'
import { ehPdf } from '../../lib/imagem.js'

/** Visualização em tela cheia de um documento (CR, CRAF, GT). Fecha com
 * Esc, clique fora, ou o X — os três caminhos de sempre. */
export default function ModalDocumento({ titulo, subtitulo, urlImagem, aberto, onFechar }) {
  useEffect(() => {
    if (!aberto) return
    function aoTeclar(evento) {
      if (evento.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aberto, onFechar])

  if (!aberto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={onFechar}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 pt-safe">
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold uppercase tracking-wide text-ouro-300">
            {titulo}
          </p>
          {subtitulo ? <p className="truncate text-xs text-slate-400">{subtitulo}</p> : null}
        </div>
        <button
          type="button"
          onClick={onFechar}
          className="alvo-toque grid shrink-0 place-items-center rounded-full border border-tinta-600 bg-tinta-800 text-slate-200"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>
      </div>

      <div
        className="flex flex-1 items-center justify-center overflow-auto p-4 pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {!urlImagem ? (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <FileWarning size={40} />
            <p>Nenhum documento anexado ainda.</p>
          </div>
        ) : ehPdf(urlImagem) ? (
          <iframe
            src={urlImagem}
            title={titulo}
            className="h-full w-full rounded-lg bg-white"
          />
        ) : (
          <img
            src={urlImagem}
            alt={titulo}
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />
        )}
      </div>
    </div>
  )
}
