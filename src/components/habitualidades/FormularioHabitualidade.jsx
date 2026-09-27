import { useState } from 'react'
import FolhaInferior from '../common/FolhaInferior.jsx'
import Campo, { classeCampo } from '../common/Campo.jsx'
import CampoArquivo from '../common/CampoArquivo.jsx'
import Botao from '../common/Botao.jsx'
import { hojeTexto } from '../../lib/data.js'
import { criarHabitualidade, atualizarHabitualidade } from '../../hooks/useHabitualidades.js'

const VAZIO = {
  data: '',
  armaId: '',
  armaNome: '',
  calibre: '',
  evento: '',
  clube: '',
  tiros: '',
  competicao: false,
  anexoUrl: '',
}

export default function FormularioHabitualidade({ equipamentos, registro, aberto, onFechar, onVerAmpliado }) {
  const [dados, setDados] = useState(VAZIO)
  const [chaveCarregada, setChaveCarregada] = useState('')
  const chaveAbertura = `${aberto}-${registro?.id ?? 'novo'}`

  if (aberto && chaveCarregada !== chaveAbertura) {
    setChaveCarregada(chaveAbertura)
    setDados(registro ? { ...VAZIO, ...registro } : { ...VAZIO, data: hojeTexto() })
  }

  function set(campo) {
    return (valor) => setDados((d) => ({ ...d, [campo]: valor }))
  }

  function aoEscolherArma(armaId) {
    const arma = equipamentos?.find((e) => e.id === armaId)
    setDados((d) => ({
      ...d,
      armaId,
      armaNome: arma ? `${arma.marcaModelo} (${arma.calibre})` : '',
      calibre: arma?.calibre ?? '',
    }))
  }

  async function aoSalvar(evento) {
    evento.preventDefault()
    if (!dados.data || !dados.evento.trim()) return
    const paraGravar = { ...dados, tiros: Number(dados.tiros) || 0 }
    if (registro) {
      await atualizarHabitualidade(registro.id, paraGravar)
    } else {
      await criarHabitualidade(paraGravar)
    }
    onFechar()
  }

  return (
    <FolhaInferior
      titulo={registro ? 'Editar habitualidade' : 'Nova habitualidade'}
      aberto={aberto}
      onFechar={onFechar}
    >
      <form onSubmit={aoSalvar} className="space-y-4">
        <Campo
          rotulo="Data"
          filho={
            <input
              type="date"
              className={classeCampo()}
              value={dados.data}
              onChange={(e) => set('data')(e.target.value)}
              required
            />
          }
        />

        <Campo
          rotulo="Arma utilizada"
          filho={
            <select
              className={classeCampo()}
              value={dados.armaId}
              onChange={(e) => aoEscolherArma(e.target.value)}
            >
              <option value="">Selecione…</option>
              {(equipamentos ?? []).map((e) => (
                <option key={e.id} value={e.id}>
                  {e.marcaModelo} ({e.calibre})
                </option>
              ))}
            </select>
          }
          ajuda="O calibre é preenchido sozinho a partir da arma escolhida."
        />

        <Campo
          rotulo="Evento"
          filho={
            <input
              className={classeCampo()}
              value={dados.evento}
              onChange={(e) => set('evento')(e.target.value)}
              placeholder="Treino de precisão, etapa de competição…"
              required
            />
          }
        />

        <Campo
          rotulo="Clube"
          filho={
            <input
              className={classeCampo()}
              value={dados.clube}
              onChange={(e) => set('clube')(e.target.value)}
              placeholder="Clube de Tiro"
            />
          }
        />

        <Campo
          rotulo="Quantidade de tiros"
          filho={
            <input
              type="number"
              min="0"
              className={classeCampo()}
              value={dados.tiros}
              onChange={(e) => set('tiros')(e.target.value)}
            />
          }
        />

        <label className="flex items-center gap-2.5 rounded-xl border border-tinta-600 bg-tinta-800 px-3.5 py-3">
          <input
            type="checkbox"
            checked={dados.competicao}
            onChange={(e) => set('competicao')(e.target.checked)}
            className="h-5 w-5 rounded border-tinta-500 bg-tinta-700 text-ouro-400 focus:ring-ouro-400"
          />
          <span className="text-sm text-slate-200">
            Este evento foi uma <strong>competição oficial</strong>
          </span>
        </label>

        <Campo
          rotulo="Comprovante (foto ou PDF)"
          filho={
            <CampoArquivo
              valor={dados.anexoUrl}
              aoMudar={set('anexoUrl')}
              onVerAmpliado={onVerAmpliado}
              rotuloVazio="Anexar comprovante"
            />
          }
        />

        <div className="flex justify-end gap-2 pt-2">
          <Botao type="button" variante="fantasma" onClick={onFechar}>
            Cancelar
          </Botao>
          <Botao type="submit" variante="primario">
            Salvar
          </Botao>
        </div>
      </form>
    </FolhaInferior>
  )
}
