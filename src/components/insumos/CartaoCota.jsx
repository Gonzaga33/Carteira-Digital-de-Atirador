import { useState } from 'react'
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, PackageOpen } from 'lucide-react'
import Cartao from '../common/Cartao.jsx'
import BarraCota from './BarraCota.jsx'
import { formatarData } from '../../lib/data.js'

export default function CartaoCota({ cota, compradoAno, compras, onLancarCompra, onEditar, onApagar, onApagarCompra }) {
  const [expandido, setExpandido] = useState(false)
  const saldo = cota.limiteAnual - compradoAno

  return (
    <Cartao>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tinta-800 text-ouro-300">
            <PackageOpen size={20} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold uppercase tracking-wide text-slate-100">
              {cota.calibre}
            </p>
            <p className={`text-xs font-semibold ${saldo < 0 ? 'text-vermelho-400' : 'text-slate-400'}`}>
              Saldo: {saldo.toLocaleString('pt-BR')} cartuchos
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEditar}
            aria-label="Editar teto"
            className="alvo-toque grid place-items-center rounded-lg px-2 text-slate-300 hover:bg-tinta-800"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={onApagar}
            aria-label="Apagar calibre"
            className="alvo-toque grid place-items-center rounded-lg px-2 text-vermelho-400 hover:bg-vermelho-500/10"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <BarraCota compradoAno={compradoAno} limiteAnual={cota.limiteAnual} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-tinta-700 pt-3">
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          className="alvo-toque inline-flex items-center gap-1 rounded-lg px-2 text-xs font-semibold text-slate-400 hover:bg-tinta-800"
        >
          {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {compras.length} compra{compras.length === 1 ? '' : 's'} lançada{compras.length === 1 ? '' : 's'}
        </button>
        <button
          type="button"
          onClick={onLancarCompra}
          className="alvo-toque inline-flex items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-ouro-300 hover:bg-tinta-800"
        >
          <Plus size={14} /> Lançar compra
        </button>
      </div>

      {expandido ? (
        <ul className="mt-2 space-y-1.5">
          {compras.length === 0 ? (
            <li className="text-xs italic text-slate-500">Nenhuma compra lançada ainda.</li>
          ) : (
            compras.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-tinta-800/60 px-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-semibold text-slate-200">
                    {formatarData(c.data)} · {Number(c.quantidade).toLocaleString('pt-BR')}
                  </span>
                  {c.descricao ? <span className="ml-1 text-slate-500">— {c.descricao}</span> : null}
                </div>
                <button
                  type="button"
                  onClick={() => onApagarCompra(c)}
                  aria-label="Apagar compra"
                  className="alvo-toque grid shrink-0 place-items-center rounded-lg px-1.5 text-vermelho-400 hover:bg-vermelho-500/10"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </Cartao>
  )
}
