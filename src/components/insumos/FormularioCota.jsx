import { useState } from 'react'
import FolhaInferior from '../common/FolhaInferior.jsx'
import Campo, { classeCampo } from '../common/Campo.jsx'
import Botao from '../common/Botao.jsx'
import { salvarCota } from '../../hooks/useInsumos.js'

export default function FormularioCota({ cota, ano, aberto, onFechar }) {
  const [calibre, setCalibre] = useState('')
  const [limiteAnual, setLimiteAnual] = useState('')
  const [chaveCarregada, setChaveCarregada] = useState('')
  const chaveAbertura = `${aberto}-${cota?.id ?? 'novo'}`

  if (aberto && chaveCarregada !== chaveAbertura) {
    setChaveCarregada(chaveAbertura)
    setCalibre(cota?.calibre ?? '')
    setLimiteAnual(cota?.limiteAnual ?? '')
  }

  async function aoSalvar(evento) {
    evento.preventDefault()
    if (!calibre.trim() || !limiteAnual) return
    await salvarCota({ id: cota?.id, calibre: calibre.trim(), limiteAnual: Number(limiteAnual), ano })
    onFechar()
  }

  return (
    <FolhaInferior titulo={cota ? 'Editar teto do calibre' : 'Novo calibre'} aberto={aberto} onFechar={onFechar}>
      <form onSubmit={aoSalvar} className="space-y-4">
        <Campo
          rotulo="Calibre"
          filho={
            <input
              className={classeCampo()}
              value={calibre}
              onChange={(e) => setCalibre(e.target.value)}
              placeholder="9x19mm Luger"
              disabled={Boolean(cota)}
              required
            />
          }
          ajuda={cota ? 'O calibre não muda depois de criado — apague e crie de novo se precisar renomear.' : undefined}
        />
        <Campo
          rotulo={`Teto anual (${ano})`}
          filho={
            <input
              type="number"
              min="0"
              className={classeCampo()}
              value={limiteAnual}
              onChange={(e) => setLimiteAnual(e.target.value)}
              placeholder="4000"
              required
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
