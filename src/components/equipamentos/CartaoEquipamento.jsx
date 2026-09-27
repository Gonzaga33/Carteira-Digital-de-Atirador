import { Eye, Pencil, Trash2, Crosshair, Plus } from 'lucide-react'
import Cartao from '../common/Cartao.jsx'
import SeloValidade from '../common/SeloValidade.jsx'
import CartaoGuiaTrafego, { BotaoIcone } from './CartaoGuiaTrafego.jsx'
import { sistemaDoEquipamento } from '../../lib/registro.js'

export default function CartaoEquipamento({
  equipamento,
  guias,
  dispensadoDeGt = false,
  onVerCraf,
  onEditar,
  onApagar,
  onNovaGuia,
  onVerGuia,
  onEditarGuia,
  onApagarGuia,
}) {
  const sistema = sistemaDoEquipamento(equipamento)

  return (
    <Cartao>
      <div className="flex items-start gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tinta-800 text-ouro-300">
            <Crosshair size={22} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold uppercase tracking-wide text-slate-100">
              {equipamento.marcaModelo}
            </p>
            <p className="truncate text-xs text-slate-400">
              {equipamento.tipo} · {equipamento.calibre}
            </p>
          </div>
        </div>
        <SeloValidade
          dataValidade={equipamento[sistema.campoValidade]}
          indeterminada={equipamento.validadeIndeterminada}
          compacto
        />
      </div>

      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-ouro-400/30 bg-ouro-400/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ouro-300">
        {sistema.rotuloCurto}
      </span>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-400">
        <Dado rotulo="Nº de série" valor={equipamento.numeroSerie} />
        <Dado rotulo={sistema.rotuloNumero} valor={equipamento[sistema.campoNumero]} />
        <Dado rotulo={sistema.rotuloProtocolo} valor={equipamento[sistema.campoProtocolo]} />
      </dl>

      <div className="mt-3 flex flex-wrap justify-end gap-1 border-t border-tinta-700 pt-3">
        <BotaoIcone rotulo={`Ver ${sistema.rotuloNumero}`} onClick={onVerCraf}>
          <Eye size={15} />
        </BotaoIcone>
        <BotaoIcone rotulo="Editar arma" onClick={onEditar}>
          <Pencil size={15} />
        </BotaoIcone>
        <BotaoIcone rotulo="Apagar arma" onClick={onApagar} perigo>
          <Trash2 size={15} />
        </BotaoIcone>
      </div>

      {/* GTs SEMPRE agrupadas logo abaixo do equipamento dono — nunca numa
          lista solta em outro lugar da tela. A Guia de Tráfego vale para
          qualquer sistema de registro, SIGMA/CRAF ou SINARM: por isso ela
          não muda com o sistema escolhido acima. `dispensadoDeGt` é status
          da PESSOA (policial/agente de segurança pública), não da arma —
          por isso vem de `usuario`, não de um campo do equipamento — e só
          troca a mensagem de vazio; se já existe GT registrada (situação
          excepcional), ela continua aparecendo normalmente. */}
      <div className="mt-3 space-y-2">
        {guias.length === 0 && dispensadoDeGt ? (
          <p className="text-xs italic text-slate-500">
            Guia de Tráfego dispensada — agente de segurança pública.
          </p>
        ) : guias.length === 0 ? (
          <p className="text-xs italic text-slate-500">Nenhuma guia de tráfego cadastrada.</p>
        ) : (
          guias.map((guia) => (
            <CartaoGuiaTrafego
              key={guia.id}
              guia={guia}
              onVer={() => onVerGuia(guia)}
              onEditar={() => onEditarGuia(guia)}
              onApagar={() => onApagarGuia(guia)}
            />
          ))
        )}
        <button
          type="button"
          onClick={onNovaGuia}
          className="alvo-toque flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-tinta-600 py-2 text-xs font-semibold text-ouro-300 hover:border-ouro-400/60"
        >
          <Plus size={14} /> Nova guia de tráfego para esta arma
        </button>
      </div>
    </Cartao>
  )
}

function Dado({ rotulo, valor }) {
  return (
    <div className="min-w-0">
      <dt className="text-slate-500">{rotulo}</dt>
      <dd className="truncate font-medium text-slate-200">{valor || '—'}</dd>
    </div>
  )
}
