import { AlertTriangle } from 'lucide-react'
import Botao from './Botao.jsx'
import { useFecharComVoltar } from '../../lib/fecharComVoltar.js'

/** Confirmação simples antes de qualquer ação sem volta — apagar é o caso
 * mais comum, mas restaurar um backup também é (substitui tudo que está no
 * aparelho). `rotuloConfirmar` default "Apagar" cobre os cinco usos de
 * exclusão sem precisar passar nada; só Restaurar backup (TelaAjustes)
 * troca — deixar "Apagar" ali confundia (e travava) quem via o botão de
 * apagar numa tela que só queria trazer dados de volta. */
export default function ConfirmarAcao({
  aberto,
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
  rotuloConfirmar = 'Apagar',
}) {
  useFecharComVoltar(aberto, onCancelar)

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-tinta-600 bg-tinta-900 p-5 shadow-2xl">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-vermelho-500/15 text-vermelho-400">
            <AlertTriangle size={20} />
          </div>
          <h2 className="font-display text-base font-semibold uppercase tracking-wide text-slate-100">
            {titulo}
          </h2>
        </div>
        <p className="mb-5 text-sm text-slate-300">{mensagem}</p>
        <div className="flex justify-end gap-2">
          <Botao variante="fantasma" onClick={onCancelar}>
            Cancelar
          </Botao>
          <Botao variante="perigo" onClick={onConfirmar}>
            {rotuloConfirmar}
          </Botao>
        </div>
      </div>
    </div>
  )
}
