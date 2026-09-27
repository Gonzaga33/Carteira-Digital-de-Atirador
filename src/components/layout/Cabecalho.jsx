import { Settings, Crosshair } from 'lucide-react'

export default function Cabecalho({ onAbrirAjustes }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-tinta-700 bg-tinta-950/95 px-4 py-3 pt-safe backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-ouro-400/15 text-ouro-300">
          <Crosshair size={18} />
        </div>
        <span className="font-display text-sm font-bold uppercase tracking-widest text-slate-200">
          Carteira Atirador
        </span>
      </div>
      <button
        type="button"
        onClick={onAbrirAjustes}
        aria-label="Ajustes e backup"
        className="alvo-toque grid place-items-center rounded-full text-slate-400 hover:bg-tinta-800 hover:text-slate-100"
      >
        <Settings size={20} />
      </button>
    </header>
  )
}
