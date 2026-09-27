import { useState } from 'react'
import Cabecalho from './components/layout/Cabecalho.jsx'
import NavegacaoInferior from './components/layout/NavegacaoInferior.jsx'
import TelaAjustes from './components/layout/TelaAjustes.jsx'
import TelaCarteira from './components/carteira/TelaCarteira.jsx'
import TelaEquipamentos from './components/equipamentos/TelaEquipamentos.jsx'
import TelaHabitualidades from './components/habitualidades/TelaHabitualidades.jsx'
import TelaNivel from './components/niveis/TelaNivel.jsx'
import TelaInsumos from './components/insumos/TelaInsumos.jsx'

const TELAS = {
  carteira: TelaCarteira,
  equipamentos: TelaEquipamentos,
  habitualidades: TelaHabitualidades,
  nivel: TelaNivel,
  insumos: TelaInsumos,
}

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('carteira')
  const [ajustesAbertos, setAjustesAbertos] = useState(false)

  const Tela = TELAS[abaAtiva] ?? TelaCarteira

  return (
    <div className="flex min-h-svh flex-col">
      <Cabecalho onAbrirAjustes={() => setAjustesAbertos(true)} />

      <main className="flex-1 pb-24">
        <Tela />
      </main>

      <NavegacaoInferior abaAtiva={abaAtiva} onMudarAba={setAbaAtiva} />

      <TelaAjustes aberto={ajustesAbertos} onFechar={() => setAjustesAbertos(false)} />
    </div>
  )
}
