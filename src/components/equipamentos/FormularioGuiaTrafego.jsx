import { useState } from 'react'
import FolhaInferior from '../common/FolhaInferior.jsx'
import Campo, { classeCampo } from '../common/Campo.jsx'
import CampoArquivo from '../common/CampoArquivo.jsx'
import Botao from '../common/Botao.jsx'
import { criarGuiaTrafego, atualizarGuiaTrafego } from '../../hooks/useEquipamentos.js'

const VAZIO = {
  numeroGt: '',
  validadeGt: '',
  tipo: 'Treinamento e Competição',
  itinerario: '',
  limiteMunicao: '',
  urlGt: '',
}

export default function FormularioGuiaTrafego({ equipamento, guia, aberto, onFechar, onVerAmpliado }) {
  const [dados, setDados] = useState(VAZIO)
  const [chaveCarregada, setChaveCarregada] = useState('')
  const chaveAbertura = `${aberto}-${guia?.id ?? 'novo'}`

  if (aberto && chaveCarregada !== chaveAbertura) {
    setChaveCarregada(chaveAbertura)
    setDados(guia ? { ...VAZIO, ...guia } : VAZIO)
  }

  function set(campo) {
    return (valor) => setDados((d) => ({ ...d, [campo]: valor }))
  }

  async function aoSalvar(evento) {
    evento.preventDefault()
    if (!dados.numeroGt.trim()) return
    if (guia) {
      await atualizarGuiaTrafego(guia.id, dados)
    } else {
      await criarGuiaTrafego(equipamento.id, dados)
    }
    onFechar()
  }

  return (
    <FolhaInferior
      titulo={guia ? 'Editar guia de tráfego' : `Nova GT — ${equipamento?.marcaModelo ?? ''}`}
      aberto={aberto}
      onFechar={onFechar}
    >
      <form onSubmit={aoSalvar} className="space-y-4">
        <Campo
          rotulo="Número da GT"
          filho={
            <input
              className={classeCampo()}
              value={dados.numeroGt}
              onChange={(e) => set('numeroGt')(e.target.value)}
              placeholder="GT-2026/04581"
              required
            />
          }
        />
        <Campo
          rotulo="Validade"
          filho={
            <input
              type="date"
              className={classeCampo()}
              value={dados.validadeGt}
              onChange={(e) => set('validadeGt')(e.target.value)}
            />
          }
        />
        <Campo
          rotulo="Tipo"
          filho={
            <input
              className={classeCampo()}
              value={dados.tipo}
              onChange={(e) => set('tipo')(e.target.value)}
              placeholder="Treinamento e Competição"
            />
          }
        />
        <Campo
          rotulo="Itinerário"
          filho={
            <input
              className={classeCampo()}
              value={dados.itinerario}
              onChange={(e) => set('itinerario')(e.target.value)}
              placeholder="Nacional / Domicílio - Estandes"
            />
          }
        />
        <Campo
          rotulo="Limite de munição"
          filho={
            <input
              className={classeCampo()}
              value={dados.limiteMunicao}
              onChange={(e) => set('limiteMunicao')(e.target.value)}
              placeholder="Até 180 cartuchos"
            />
          }
        />
        <Campo
          rotulo="Foto ou PDF da GT"
          filho={
            <CampoArquivo
              valor={dados.urlGt}
              aoMudar={set('urlGt')}
              onVerAmpliado={onVerAmpliado}
              rotuloVazio="Enviar GT"
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
