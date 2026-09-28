import { useState } from 'react'
import FolhaInferior from '../common/FolhaInferior.jsx'
import Campo, { classeCampo } from '../common/Campo.jsx'
import CampoArquivo from '../common/CampoArquivo.jsx'
import Botao from '../common/Botao.jsx'
import { salvarUsuario } from '../../hooks/useUsuario.js'

// Um lugar só decide o rótulo/campo de cada documento do usuário — CR,
// Filiação ao clube e Crachá funcional (prova de ser policial/agente de
// segurança pública, usada junto da dispensa de GT em Ajustes). Os três
// têm a MESMA forma (número + validade + foto), só o rótulo e a chave no
// banco mudam; por isso um formulário só, nunca três copiados.
const CONFIGURACOES = {
  cr: {
    titulo: 'Editar CR',
    rotuloNumero: 'Número do CR',
    placeholderNumero: '1234567',
    temNomeClube: false,
    campoNumero: 'crNumero',
    campoValidade: 'crValidade',
    campoImagemUrl: 'crImagemUrl',
  },
  clube: {
    titulo: 'Editar filiação ao clube',
    rotuloNumero: 'Matrícula no clube',
    placeholderNumero: 'AC-9842',
    temNomeClube: true,
    campoNumero: 'clubeMatricula',
    campoNomeClube: 'clubeNome',
    campoValidade: 'clubeValidade',
    campoImagemUrl: 'clubeImagemUrl',
  },
  cracha: {
    titulo: 'Editar crachá funcional',
    rotuloNumero: 'Matrícula funcional',
    placeholderNumero: 'PC-12345',
    temNomeClube: false,
    campoNumero: 'crachaNumero',
    campoValidade: 'crachaValidade',
    campoImagemUrl: 'crachaImagemUrl',
  },
}

export default function FormularioDocumentoUsuario({ tipo, usuario, aberto, onFechar, onVerAmpliado }) {
  const config = CONFIGURACOES[tipo] ?? CONFIGURACOES.cr

  const [numero, setNumero] = useState('')
  const [nomeClube, setNomeClube] = useState('')
  const [validade, setValidade] = useState('')
  const [imagemUrl, setImagemUrl] = useState('')

  // Reabre sempre com o valor atual gravado — nunca com o da edição anterior.
  const chaveAbertura = `${aberto}-${tipo}-${usuario?.id ?? ''}`
  const [chaveCarregada, setChaveCarregada] = useState('')
  if (aberto && chaveCarregada !== chaveAbertura && usuario) {
    setChaveCarregada(chaveAbertura)
    setNumero(usuario[config.campoNumero] ?? '')
    setValidade(usuario[config.campoValidade] ?? '')
    setImagemUrl(usuario[config.campoImagemUrl] ?? '')
    setNomeClube(config.temNomeClube ? (usuario[config.campoNomeClube] ?? '') : '')
  }

  async function aoSalvar(evento) {
    evento.preventDefault()
    const paraGravar = {
      [config.campoNumero]: numero,
      [config.campoValidade]: validade,
      [config.campoImagemUrl]: imagemUrl,
    }
    if (config.temNomeClube) paraGravar[config.campoNomeClube] = nomeClube
    await salvarUsuario(paraGravar)
    onFechar()
  }

  return (
    <FolhaInferior titulo={config.titulo} aberto={aberto} onFechar={onFechar}>
      <form onSubmit={aoSalvar} className="space-y-4">
        {config.temNomeClube ? (
          <Campo
            rotulo="Nome do clube"
            filho={
              <input
                className={classeCampo()}
                value={nomeClube}
                onChange={(e) => setNomeClube(e.target.value)}
                placeholder="Clube de Tiro e Caça"
              />
            }
          />
        ) : null}

        <Campo
          rotulo={config.rotuloNumero}
          filho={
            <input
              className={classeCampo()}
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder={config.placeholderNumero}
            />
          }
        />

        <Campo
          rotulo="Validade"
          filho={
            <input
              type="date"
              className={classeCampo()}
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
            />
          }
        />

        <Campo
          rotulo="Foto ou PDF do documento"
          filho={
            <CampoArquivo
              valor={imagemUrl}
              aoMudar={setImagemUrl}
              onVerAmpliado={onVerAmpliado}
              rotuloVazio="Enviar foto do documento"
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
