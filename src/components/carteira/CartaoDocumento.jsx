import { Pencil, IdCard } from 'lucide-react'
import Cartao from '../common/Cartao.jsx'
import SeloValidade from '../common/SeloValidade.jsx'
import { formatarData } from '../../lib/data.js'

export default function CartaoDocumento({
  titulo,
  linhas,
  validade,
  imagemUrl,
  onVer,
  onEditar,
}) {
  return (
    <Cartao className="overflow-hidden !p-0">
      <button
        type="button"
        onClick={onVer}
        className="block w-full text-left"
        aria-label={`Ver ${titulo} em tela cheia`}
      >
        <div className="relative aspect-[3/2] w-full bg-tinta-800">
          {imagemUrl ? (
            <img src={imagemUrl} alt={titulo} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-slate-600">
              <IdCard size={48} />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-2 pt-8">
            <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
              {titulo}
            </p>
          </div>
        </div>
      </button>

      <div className="space-y-2 p-4">
        {linhas.map((linha) => (
          <div key={linha.rotulo} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-slate-400">{linha.rotulo}</span>
            <span className="font-medium text-slate-100">{linha.valor || '—'}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-2 pt-1">
          <SeloValidade dataValidade={validade} compacto />
          <button
            type="button"
            onClick={onEditar}
            className="alvo-toque inline-flex items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-ouro-300 hover:bg-tinta-800"
          >
            <Pencil size={14} /> Editar
          </button>
        </div>
      </div>
    </Cartao>
  )
}

export function linhaData(rotulo, valorData) {
  return { rotulo, valor: formatarData(valorData) }
}
