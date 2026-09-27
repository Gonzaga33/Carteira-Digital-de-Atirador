import { useState } from 'react'
import { Plus } from 'lucide-react'
import CartaoEquipamento from './CartaoEquipamento.jsx'
import FormularioEquipamento from './FormularioEquipamento.jsx'
import FormularioGuiaTrafego from './FormularioGuiaTrafego.jsx'
import ModalDocumento from '../common/ModalDocumento.jsx'
import ConfirmarAcao from '../common/ConfirmarAcao.jsx'
import Botao from '../common/Botao.jsx'
import {
  useEquipamentos,
  useGuiasTrafego,
  guiasDoEquipamento,
  apagarEquipamento,
  apagarGuiaTrafego,
} from '../../hooks/useEquipamentos.js'
import { sistemaDoEquipamento } from '../../lib/registro.js'

export default function TelaEquipamentos() {
  const equipamentos = useEquipamentos()
  const guias = useGuiasTrafego()

  const [formArma, setFormArma] = useState(null) // { equipamento: null|obj } | null
  const [formGuia, setFormGuia] = useState(null) // { equipamento, guia: null|obj } | null
  const [visualizacao, setVisualizacao] = useState(null)
  const [apagarArma, setApagarArma] = useState(null)
  const [apagarGuia, setApagarGuia] = useState(null)

  if (!equipamentos || !guias) {
    return <p className="p-6 text-center text-slate-500">Carregando…</p>
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-slate-100">
          Equipamentos
        </h1>
        <Botao onClick={() => setFormArma({ equipamento: null })}>
          <Plus size={16} /> Nova arma
        </Botao>
      </div>

      {equipamentos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-tinta-700 p-6 text-center text-sm text-slate-500">
          Nenhuma arma cadastrada ainda.
        </p>
      ) : (
        equipamentos.map((equipamento) => (
          <CartaoEquipamento
            key={equipamento.id}
            equipamento={equipamento}
            guias={guiasDoEquipamento(guias, equipamento.id)}
            onVerCraf={() => {
              const sistema = sistemaDoEquipamento(equipamento)
              setVisualizacao({
                titulo: `${sistema.rotuloNumero} — ${equipamento.marcaModelo}`,
                subtitulo: equipamento[sistema.campoNumero],
                url: equipamento[sistema.campoUrl],
              })
            }}
            onEditar={() => setFormArma({ equipamento })}
            onApagar={() => setApagarArma(equipamento)}
            onNovaGuia={() => setFormGuia({ equipamento, guia: null })}
            onVerGuia={(guia) =>
              setVisualizacao({
                titulo: `Guia de Tráfego — ${equipamento.marcaModelo}`,
                subtitulo: guia.numeroGt,
                url: guia.urlGt,
              })
            }
            onEditarGuia={(guia) => setFormGuia({ equipamento, guia })}
            onApagarGuia={(guia) => setApagarGuia(guia)}
          />
        ))
      )}

      <FormularioEquipamento
        equipamento={formArma?.equipamento ?? null}
        aberto={formArma !== null}
        onFechar={() => setFormArma(null)}
        onVerAmpliado={(url) => setVisualizacao({ titulo: 'Documento', url })}
      />

      <FormularioGuiaTrafego
        equipamento={formGuia?.equipamento}
        guia={formGuia?.guia ?? null}
        aberto={formGuia !== null}
        onFechar={() => setFormGuia(null)}
        onVerAmpliado={(url) => setVisualizacao({ titulo: 'Documento', url })}
      />

      <ModalDocumento
        titulo={visualizacao?.titulo ?? ''}
        subtitulo={visualizacao?.subtitulo}
        urlImagem={visualizacao?.url}
        aberto={visualizacao !== null}
        onFechar={() => setVisualizacao(null)}
      />

      <ConfirmarAcao
        aberto={apagarArma !== null}
        titulo="Apagar arma"
        mensagem={`Isso também apaga TODAS as guias de tráfego de "${apagarArma?.marcaModelo}". Esta ação não pode ser desfeita.`}
        onCancelar={() => setApagarArma(null)}
        onConfirmar={async () => {
          await apagarEquipamento(apagarArma.id)
          setApagarArma(null)
        }}
      />

      <ConfirmarAcao
        aberto={apagarGuia !== null}
        titulo="Apagar guia de tráfego"
        mensagem={`Apagar a GT "${apagarGuia?.numeroGt}"? Esta ação não pode ser desfeita.`}
        onCancelar={() => setApagarGuia(null)}
        onConfirmar={async () => {
          await apagarGuiaTrafego(apagarGuia.id)
          setApagarGuia(null)
        }}
      />
    </div>
  )
}
