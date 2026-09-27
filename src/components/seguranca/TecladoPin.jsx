import { Delete } from 'lucide-react'

const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'apagar']

/** Teclado numérico + pontos indicando o PIN digitado (nunca mostra o
 * número na tela — só quantos dígitos já foram tocados). */
export default function TecladoPin({ valor, aoMudar, tamanhoMax = 6, desabilitado = false }) {
  function tocar(tecla) {
    if (desabilitado) return
    if (tecla === '') return
    if (tecla === 'apagar') {
      aoMudar(valor.slice(0, -1))
      return
    }
    if (valor.length >= tamanhoMax) return
    aoMudar(valor + tecla)
  }

  return (
    <div>
      <div className="mb-8 flex min-h-4 justify-center gap-3" aria-hidden="true">
        {Array.from({ length: Math.max(valor.length, 4) }).map((_, i) => (
          <span
            key={i}
            className={`h-3.5 w-3.5 rounded-full border-2 transition-colors ${
              i < valor.length ? 'border-ouro-400 bg-ouro-400' : 'border-tinta-600 bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-[260px] grid-cols-3 gap-3">
        {TECLAS.map((tecla, i) => {
          if (tecla === '') return <div key={i} aria-hidden="true" />
          if (tecla === 'apagar') {
            return (
              <button
                key={i}
                type="button"
                onClick={() => tocar('apagar')}
                disabled={desabilitado || valor.length === 0}
                aria-label="Apagar dígito"
                className="alvo-toque grid h-14 place-items-center rounded-2xl text-slate-400 disabled:opacity-30"
              >
                <Delete size={22} />
              </button>
            )
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => tocar(tecla)}
              disabled={desabilitado}
              className="alvo-toque h-14 rounded-2xl border border-tinta-600 bg-tinta-800 text-xl font-semibold text-slate-100 active:bg-tinta-700 disabled:opacity-30"
            >
              {tecla}
            </button>
          )
        })}
      </div>
    </div>
  )
}
