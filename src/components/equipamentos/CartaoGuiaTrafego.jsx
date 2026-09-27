import { Eye, Pencil, Trash2, Route } from 'lucide-react'
import SeloValidade from '../common/SeloValidade.jsx'
import { formatarData } from '../../lib/data.js'

export default function CartaoGuiaTrafego({ guia, onVer, onEditar, onApagar }) {
  return (
    <div className="rounded-xl border border-tinta-700 bg-tinta-800/60 p-3">
      <div className="flex items-start gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <Route size={16} className="mt-0.5 shrink-0 text-ouro-300" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">
              {guia.numeroGt || 'GT sem número'}
            </p>
            <p className="truncate text-xs text-slate-400">{guia.tipo || '—'}</p>
          </div>
        </div>
        <SeloValidade dataValidade={guia.validadeGt} compacto />
      </div>

      <dl className="mt-2 space-y-1 text-xs text-slate-400">
        {guia.itinerario ? (
          <div className="flex gap-1.5">
            <dt className="shrink-0 font-semibold text-slate-500">Itinerário:</dt>
            <dd className="truncate">{guia.itinerario}</dd>
          </div>
        ) : null}
        {guia.limiteMunicao ? (
          <div className="flex gap-1.5">
            <dt className="shrink-0 font-semibold text-slate-500">Limite:</dt>
            <dd className="truncate">{guia.limiteMunicao}</dd>
          </div>
        ) : null}
        <div className="flex gap-1.5">
          <dt className="shrink-0 font-semibold text-slate-500">Validade:</dt>
          <dd>{formatarData(guia.validadeGt)}</dd>
        </div>
      </dl>

      <div className="mt-2 flex justify-end gap-1">
        <BotaoIcone rotulo="Ver GT" onClick={onVer}>
          <Eye size={15} />
        </BotaoIcone>
        <BotaoIcone rotulo="Editar GT" onClick={onEditar}>
          <Pencil size={15} />
        </BotaoIcone>
        <BotaoIcone rotulo="Apagar GT" onClick={onApagar} perigo>
          <Trash2 size={15} />
        </BotaoIcone>
      </div>
    </div>
  )
}

function BotaoIcone({ children, rotulo, onClick, perigo = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      title={rotulo}
      className={`alvo-toque grid place-items-center rounded-lg px-2 ${
        perigo ? 'text-vermelho-400 hover:bg-vermelho-500/10' : 'text-slate-300 hover:bg-tinta-700'
      }`}
    >
      {children}
    </button>
  )
}

export { BotaoIcone }
