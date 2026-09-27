import { useState } from 'react'
import { Plus } from 'lucide-react'
import CartaoHabitualidade from './CartaoHabitualidade.jsx'
import FormularioHabitualidade from './FormularioHabitualidade.jsx'
import ModalDocumento from '../common/ModalDocumento.jsx'
import ConfirmarAcao from '../common/ConfirmarAcao.jsx'
import Botao from '../common/Botao.jsx'
import { useHabitualidades, apagarHabitualidade } from '../../hooks/useHabitualidades.js'
import { useEquipamentos } from '../../hooks/useEquipamentos.js'

export default function TelaHabitualidades() {
  const habitualidades = useHabitualidades()
  const equipamentos = useEquipamentos()

  const [form, setForm] = useState(null) // { registro: null|obj } | null
  const [visualizacao, setVisualizacao] = useState(null)
  const [apagar, setApagar] = useState(null)

  if (!habitualidades || !equipamentos) {
    return <p className="p-6 text-center text-slate-500">Carregando…</p>
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-slate-100">
          Habitualidades
        </h1>
        <Botao onClick={() => setForm({ registro: null })}>
          <Plus size={16} /> Registrar
        </Botao>
      </div>

      {habitualidades.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-tinta-700 p-6 text-center text-sm text-slate-500">
          Nenhuma habitualidade registrada ainda.
        </p>
      ) : (
        <div className="space-y-2.5">
          {habitualidades.map((registro) => (
            <CartaoHabitualidade
              key={registro.id}
              registro={registro}
              onEditar={() => setForm({ registro })}
              onApagar={() => setApagar(registro)}
              onVerAnexo={(url) =>
                setVisualizacao({ titulo: `Comprovante — ${registro.evento}`, url })
              }
            />
          ))}
        </div>
      )}

      <FormularioHabitualidade
        equipamentos={equipamentos}
        registro={form?.registro ?? null}
        aberto={form !== null}
        onFechar={() => setForm(null)}
        onVerAmpliado={(url) => setVisualizacao({ titulo: 'Comprovante', url })}
      />

      <ModalDocumento
        titulo={visualizacao?.titulo ?? ''}
        urlImagem={visualizacao?.url}
        aberto={visualizacao !== null}
        onFechar={() => setVisualizacao(null)}
      />

      <ConfirmarAcao
        aberto={apagar !== null}
        titulo="Apagar habitualidade"
        mensagem={`Apagar o registro "${apagar?.evento}"? Esta ação não pode ser desfeita.`}
        onCancelar={() => setApagar(null)}
        onConfirmar={async () => {
          await apagarHabitualidade(apagar.id)
          setApagar(null)
        }}
      />
    </div>
  )
}
