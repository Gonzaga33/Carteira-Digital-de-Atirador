import { useRef, useState } from 'react'
import { Download, Upload, X, ShieldCheck, AlertTriangle } from 'lucide-react'
import Cartao from '../common/Cartao.jsx'
import Botao from '../common/Botao.jsx'
import ConfirmarAcao from '../common/ConfirmarAcao.jsx'
import Campo, { classeCampo } from '../common/Campo.jsx'
import GerenciarSeguranca from '../seguranca/GerenciarSeguranca.jsx'
import { exportarBackup, baixarBackupComoArquivo, lerArquivoDeBackup, restaurarBackup } from '../../lib/backup.js'
import { useUsuario, salvarUsuario } from '../../hooks/useUsuario.js'

export default function TelaAjustes({ aberto, onFechar }) {
  const usuario = useUsuario()
  const inputRef = useRef(null)
  const [backupPendente, setBackupPendente] = useState(null)
  const [mensagem, setMensagem] = useState(null) // { tipo: 'ok'|'erro', texto }
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [chaveCarregada, setChaveCarregada] = useState('')

  if (aberto && chaveCarregada !== 'carregado' && usuario) {
    setChaveCarregada('carregado')
    setNome(usuario.nome ?? '')
    setCpf(usuario.cpf ?? '')
  }

  if (!aberto) return null

  async function aoExportar() {
    const backup = await exportarBackup()
    baixarBackupComoArquivo(backup)
    setMensagem({ tipo: 'ok', texto: 'Backup baixado com sucesso.' })
  }

  async function aoEscolherArquivo(evento) {
    const arquivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!arquivo) return
    setMensagem(null)
    try {
      const json = await lerArquivoDeBackup(arquivo)
      setBackupPendente(json)
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: erro.message })
    }
  }

  async function aoConfirmarRestauracao() {
    await restaurarBackup(backupPendente)
    setBackupPendente(null)
    setMensagem({ tipo: 'ok', texto: 'Backup restaurado. Os dados anteriores foram substituídos.' })
  }

  async function aoSalvarPerfil(evento) {
    evento.preventDefault()
    await salvarUsuario({ nome, cpf })
    setMensagem({ tipo: 'ok', texto: 'Dados pessoais atualizados.' })
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-tinta-950">
      <div className="flex items-center justify-between border-b border-tinta-700 px-4 py-3 pt-safe">
        <h1 className="font-display text-lg font-bold uppercase tracking-wide text-slate-100">Ajustes</h1>
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="alvo-toque grid place-items-center rounded-full text-slate-400 hover:bg-tinta-800 hover:text-slate-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-safe">
        {mensagem ? (
          <div
            className={`rounded-xl border px-3.5 py-2.5 text-sm ${
              mensagem.tipo === 'ok'
                ? 'border-verde-500/40 bg-verde-500/10 text-verde-400'
                : 'border-vermelho-500/40 bg-vermelho-500/10 text-vermelho-400'
            }`}
          >
            {mensagem.texto}
          </div>
        ) : null}

        <Cartao className="space-y-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-slate-300">
            Dados pessoais
          </h2>
          <form onSubmit={aoSalvarPerfil} className="space-y-3">
            <Campo
              rotulo="Nome"
              filho={<input className={classeCampo()} value={nome} onChange={(e) => setNome(e.target.value)} />}
            />
            <Campo
              rotulo="CPF"
              filho={<input className={classeCampo()} value={cpf} onChange={(e) => setCpf(e.target.value)} />}
            />
            <Botao type="submit" variante="secundario" className="w-full">
              Salvar dados pessoais
            </Botao>
          </form>
        </Cartao>

        <GerenciarSeguranca />

        <Cartao className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-ouro-300" />
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-slate-300">
              Backup dos dados
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Tudo neste app fica só no seu aparelho. Faça backup de vez em quando e guarde o arquivo
            num lugar seguro (e-mail para você mesmo, nuvem pessoal) — trocar de celular sem um
            backup recente significa perder a carteira inteira.
          </p>
          <p className="text-xs text-amarelo-500">
            O arquivo de backup NÃO é criptografado — número de série, CRAF e SINARM ficam em
            texto puro nele. Apague-o de onde salvar assim que não precisar mais, e nunca o
            compartilhe.
          </p>
          <Botao onClick={aoExportar} className="w-full">
            <Download size={16} /> Exportar backup (.json)
          </Botao>
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={aoEscolherArquivo}
          />
          <Botao variante="secundario" className="w-full" onClick={() => inputRef.current?.click()}>
            <Upload size={16} /> Restaurar de um backup
          </Botao>
        </Cartao>

        <p className="text-center text-xs text-slate-600">Carteira Digital de Atirador · versão 1.0.0</p>
      </div>

      <ConfirmarAcao
        aberto={backupPendente !== null}
        titulo="Restaurar backup"
        mensagem={
          <span className="inline-flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amarelo-500" />
            Isso APAGA tudo o que está no aparelho agora e substitui pelos dados do arquivo escolhido
            (gerado em {backupPendente ? new Date(backupPendente.geradoEm).toLocaleString('pt-BR') : ''}). Não tem
            como desfazer.
          </span>
        }
        onCancelar={() => setBackupPendente(null)}
        onConfirmar={aoConfirmarRestauracao}
      />
    </div>
  )
}
