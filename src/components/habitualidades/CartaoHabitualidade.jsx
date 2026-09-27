import { Pencil, Trash2, Paperclip, Trophy, Target } from 'lucide-react'
import Cartao from '../common/Cartao.jsx'
import { formatarData } from '../../lib/data.js'

export default function CartaoHabitualidade({ registro, onEditar, onApagar, onVerAnexo }) {
  return (
    <Cartao className="!p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-100">{registro.evento}</p>
          <p className="text-xs text-slate-400">
            {formatarData(registro.data)} · {registro.armaNome || 'Arma não informada'}
          </p>
        </div>
        {registro.competicao ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-ouro-400/40 bg-ouro-400/10 px-2 py-0.5 text-[11px] font-semibold text-ouro-300">
            <Trophy size={12} /> Competição
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Target size={13} /> {registro.tiros} tiros
        </span>
        {registro.clube ? <span>{registro.clube}</span> : null}
        {registro.calibre ? <span>{registro.calibre}</span> : null}
      </div>

      <div className="mt-2.5 flex justify-end gap-1 border-t border-tinta-700 pt-2.5">
        {registro.anexoUrl ? (
          <button
            type="button"
            onClick={() => onVerAnexo(registro.anexoUrl)}
            className="alvo-toque inline-flex items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-ouro-300 hover:bg-tinta-800"
          >
            <Paperclip size={14} /> Comprovante
          </button>
        ) : null}
        <div className="flex-1" />
        <button
          type="button"
          onClick={onEditar}
          aria-label="Editar habitualidade"
          className="alvo-toque grid place-items-center rounded-lg px-2 text-slate-300 hover:bg-tinta-800"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={onApagar}
          aria-label="Apagar habitualidade"
          className="alvo-toque grid place-items-center rounded-lg px-2 text-vermelho-400 hover:bg-vermelho-500/10"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </Cartao>
  )
}
