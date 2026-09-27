import { useRef, useState } from 'react'
import { Paperclip, Eye, Trash2, Loader2 } from 'lucide-react'
import { arquivoParaDataUrl } from '../../lib/imagem.js'
import Botao from './Botao.jsx'

/** Envio de foto ou PDF, com prévia e remoção — usado por todo anexo do
 * app (documentos, CRAF, GT, comprovante de habitualidade). */
export default function CampoArquivo({ valor, aoMudar, onVerAmpliado, rotuloVazio = 'Nenhum arquivo enviado' }) {
  const inputRef = useRef(null)
  const [carregando, setCarregando] = useState(false)

  async function aoEscolherArquivo(evento) {
    const arquivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!arquivo) return
    setCarregando(true)
    try {
      const dataUrl = await arquivoParaDataUrl(arquivo)
      aoMudar(dataUrl)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        capture="environment"
        className="hidden"
        onChange={aoEscolherArquivo}
      />
      {valor ? (
        <>
          <button
            type="button"
            onClick={() => onVerAmpliado?.(valor)}
            className={classeCampoArquivo()}
          >
            <Eye size={16} />
            Ver arquivo
          </button>
          <Botao
            variante="fantasma"
            className="px-2.5"
            onClick={() => aoMudar('')}
            aria-label="Remover arquivo"
          >
            <Trash2 size={16} />
          </Botao>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={carregando}
          className={classeCampoArquivo()}
        >
          {carregando ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
          {carregando ? 'Enviando…' : rotuloVazio}
        </button>
      )}
    </div>
  )
}

function classeCampoArquivo() {
  return 'alvo-toque flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-tinta-600 bg-tinta-800 px-3 py-2.5 text-sm text-slate-300 hover:border-ouro-400/60'
}
