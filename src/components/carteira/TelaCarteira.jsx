import { useState } from 'react'
import CartaoDocumento, { linhaData } from './CartaoDocumento.jsx'
import FormularioDocumentoUsuario from './FormularioDocumentoUsuario.jsx'
import ModalDocumento from '../common/ModalDocumento.jsx'
import { useUsuario } from '../../hooks/useUsuario.js'

export default function TelaCarteira() {
  const usuario = useUsuario()
  const [edicao, setEdicao] = useState(null) // 'cr' | 'clube' | 'cracha' | null
  const [visualizacao, setVisualizacao] = useState(null) // { titulo, subtitulo, url } | null

  if (!usuario) {
    return <p className="p-6 text-center text-slate-500">Carregando…</p>
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-slate-100">
          Carteira Digital
        </h1>
        <p className="text-sm text-slate-400">{usuario.nome}</p>
      </div>

      <CartaoDocumento
        titulo="Certificado de Registro (CR)"
        linhas={[{ rotulo: 'Número', valor: usuario.crNumero }, linhaData('Validade', usuario.crValidade)]}
        validade={usuario.crValidade}
        imagemUrl={usuario.crImagemUrl}
        onVer={() =>
          setVisualizacao({
            titulo: 'Certificado de Registro (CR)',
            subtitulo: `Nº ${usuario.crNumero || '—'}`,
            url: usuario.crImagemUrl,
          })
        }
        onEditar={() => setEdicao('cr')}
      />

      <CartaoDocumento
        titulo="Filiação ao Clube"
        linhas={[
          { rotulo: 'Clube', valor: usuario.clubeNome },
          { rotulo: 'Matrícula', valor: usuario.clubeMatricula },
          linhaData('Validade', usuario.clubeValidade),
        ]}
        validade={usuario.clubeValidade}
        imagemUrl={usuario.clubeImagemUrl}
        onVer={() =>
          setVisualizacao({
            titulo: 'Filiação ao Clube',
            subtitulo: usuario.clubeNome,
            url: usuario.clubeImagemUrl,
          })
        }
        onEditar={() => setEdicao('clube')}
      />

      <CartaoDocumento
        titulo="Crachá Funcional"
        linhas={[
          { rotulo: 'Matrícula', valor: usuario.crachaNumero },
          linhaData('Validade', usuario.crachaValidade),
        ]}
        validade={usuario.crachaValidade}
        imagemUrl={usuario.crachaImagemUrl}
        onVer={() =>
          setVisualizacao({
            titulo: 'Crachá Funcional',
            subtitulo: `Matrícula ${usuario.crachaNumero || '—'}`,
            url: usuario.crachaImagemUrl,
          })
        }
        onEditar={() => setEdicao('cracha')}
      />

      <FormularioDocumentoUsuario
        tipo={edicao ?? 'cr'}
        usuario={usuario}
        aberto={edicao !== null}
        onFechar={() => setEdicao(null)}
        onVerAmpliado={(url) => setVisualizacao({ titulo: 'Documento', url })}
      />

      <ModalDocumento
        titulo={visualizacao?.titulo ?? ''}
        subtitulo={visualizacao?.subtitulo}
        urlImagem={visualizacao?.url}
        aberto={visualizacao !== null}
        onFechar={() => setVisualizacao(null)}
      />
    </div>
  )
}
