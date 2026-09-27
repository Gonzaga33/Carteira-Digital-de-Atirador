import { useState } from 'react'
import FolhaInferior from '../common/FolhaInferior.jsx'
import Campo, { classeCampo } from '../common/Campo.jsx'
import CampoArquivo from '../common/CampoArquivo.jsx'
import Botao from '../common/Botao.jsx'
import { salvarUsuario } from '../../hooks/useUsuario.js'

/**
 * Formulário genérico para os dois documentos do usuário (CR e Filiação
 * ao clube) — os campos mudam conforme `tipo`, a gravação é a mesma.
 */
export default function FormularioDocumentoUsuario({ tipo, usuario, aberto, onFechar, onVerAmpliado }) {
  const ehCr = tipo === 'cr'

  const [numero, setNumero] = useState('')
  const [nomeClube, setNomeClube] = useState('')
  const [validade, setValidade] = useState('')
  const [imagemUrl, setImagemUrl] = useState('')

  // Reabre sempre com o valor atual gravado — nunca com o da edição anterior.
  const chaveAbertura = `${aberto}-${usuario?.id ?? ''}`
  const [chaveCarregada, setChaveCarregada] = useState('')
  if (aberto && chaveCarregada !== chaveAbertura && usuario) {
    setChaveCarregada(chaveAbertura)
    if (ehCr) {
      setNumero(usuario.crNumero ?? '')
      setValidade(usuario.crValidade ?? '')
      setImagemUrl(usuario.crImagemUrl ?? '')
    } else {
      setNumero(usuario.clubeMatricula ?? '')
      setNomeClube(usuario.clubeNome ?? '')
      setValidade(usuario.clubeValidade ?? '')
      setImagemUrl(usuario.clubeImagemUrl ?? '')
    }
  }

  async function aoSalvar(evento) {
    evento.preventDefault()
    if (ehCr) {
      await salvarUsuario({ crNumero: numero, crValidade: validade, crImagemUrl: imagemUrl })
    } else {
      await salvarUsuario({
        clubeNome: nomeClube,
        clubeMatricula: numero,
        clubeValidade: validade,
        clubeImagemUrl: imagemUrl,
      })
    }
    onFechar()
  }

  return (
    <FolhaInferior
      titulo={ehCr ? 'Editar CR' : 'Editar filiação ao clube'}
      aberto={aberto}
      onFechar={onFechar}
    >
      <form onSubmit={aoSalvar} className="space-y-4">
        {!ehCr ? (
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
          rotulo={ehCr ? 'Número do CR' : 'Matrícula no clube'}
          filho={
            <input
              className={classeCampo()}
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder={ehCr ? '1234567' : 'AC-9842'}
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
