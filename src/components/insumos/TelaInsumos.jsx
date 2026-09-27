import { useState } from 'react'
import { Plus } from 'lucide-react'
import CartaoCota from './CartaoCota.jsx'
import FormularioCota from './FormularioCota.jsx'
import FormularioCompra from './FormularioCompra.jsx'
import ConfirmarAcao from '../common/ConfirmarAcao.jsx'
import Botao from '../common/Botao.jsx'
import {
  useCotasDoAno,
  useComprasDoAno,
  compradoNoAno,
  comprasDoCalibre,
  apagarCota,
  apagarCompra,
} from '../../hooks/useInsumos.js'
import { anoAtual } from '../../lib/data.js'

export default function TelaInsumos() {
  const ano = anoAtual()
  const cotas = useCotasDoAno(ano)
  const compras = useComprasDoAno(ano)

  const [formCota, setFormCota] = useState(null) // { cota: null|obj } | null
  const [formCompra, setFormCompra] = useState(null) // { calibre } | null
  const [apagarCotaAlvo, setApagarCotaAlvo] = useState(null)
  const [apagarCompraAlvo, setApagarCompraAlvo] = useState(null)

  if (!cotas || !compras) {
    return <p className="p-6 text-center text-slate-500">Carregando…</p>
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-slate-100">
            Cotas de Insumos
          </h1>
          <p className="text-sm text-slate-400">Teto anual por calibre — {ano}</p>
        </div>
        <Botao onClick={() => setFormCota({ cota: null })}>
          <Plus size={16} /> Calibre
        </Botao>
      </div>

      {cotas.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-tinta-700 p-6 text-center text-sm text-slate-500">
          Nenhum calibre com cota cadastrada para {ano}.
        </p>
      ) : (
        cotas.map((cota) => (
          <CartaoCota
            key={cota.id}
            cota={cota}
            compradoAno={compradoNoAno(compras, cota.calibre)}
            compras={comprasDoCalibre(compras, cota.calibre)}
            onLancarCompra={() => setFormCompra({ calibre: cota.calibre })}
            onEditar={() => setFormCota({ cota })}
            onApagar={() => setApagarCotaAlvo(cota)}
            onApagarCompra={(c) => setApagarCompraAlvo(c)}
          />
        ))
      )}

      <FormularioCota
        cota={formCota?.cota ?? null}
        ano={ano}
        aberto={formCota !== null}
        onFechar={() => setFormCota(null)}
      />

      <FormularioCompra
        calibre={formCompra?.calibre}
        ano={ano}
        aberto={formCompra !== null}
        onFechar={() => setFormCompra(null)}
      />

      <ConfirmarAcao
        aberto={apagarCotaAlvo !== null}
        titulo="Apagar calibre"
        mensagem={`Apagar a cota de "${apagarCotaAlvo?.calibre}"? O histórico de compras já lançadas continua guardado, mas o teto some da tela.`}
        onCancelar={() => setApagarCotaAlvo(null)}
        onConfirmar={async () => {
          await apagarCota(apagarCotaAlvo.id)
          setApagarCotaAlvo(null)
        }}
      />

      <ConfirmarAcao
        aberto={apagarCompraAlvo !== null}
        titulo="Apagar compra"
        mensagem="Apagar este lançamento de compra? Esta ação não pode ser desfeita."
        onCancelar={() => setApagarCompraAlvo(null)}
        onConfirmar={async () => {
          await apagarCompra(apagarCompraAlvo.id)
          setApagarCompraAlvo(null)
        }}
      />
    </div>
  )
}
