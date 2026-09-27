import { useEffect, useState } from 'react'
import { Lock, LockOpen, KeyRound } from 'lucide-react'
import Cartao from '../common/Cartao.jsx'
import Botao from '../common/Botao.jsx'
import FolhaInferior from '../common/FolhaInferior.jsx'
import TecladoPin from './TecladoPin.jsx'
import { travaConfigurada, criarTrava, conferirPin, trocarPin, removerTrava } from '../../lib/seguranca.js'

const TAMANHO_MINIMO = 4

/** Bloco "Segurança" da tela de Ajustes: ativar/trocar/remover o PIN.
 * Não precisa avisar ninguém quando o PIN muda — o re-bloqueio automático
 * (ver Inicializador.jsx) já confere o banco direto a cada troca de aba,
 * nunca confia em estado antigo guardado em memória. Um aviso "trava
 * mudou" cedo demais aqui já causou a sessão se re-travar sozinha logo
 * depois do usuário confirmar o próprio PIN — bug real, corrigido
 * removendo esse aviso em vez de tentar consertar o timing dele. */
export default function GerenciarSeguranca() {
  const [ativa, setAtiva] = useState(null) // null = ainda não sabe
  const [fluxo, setFluxo] = useState(null) // 'ativar' | 'trocar' | 'remover' | null

  async function recarregarStatus() {
    setAtiva(await travaConfigurada())
  }

  useEffect(() => {
    recarregarStatus()
  }, [])

  async function aoResolverFluxo() {
    setFluxo(null)
    await recarregarStatus()
  }

  return (
    <Cartao className="space-y-3">
      <div className="flex items-center gap-2">
        {ativa ? <Lock size={18} className="text-ouro-300" /> : <LockOpen size={18} className="text-slate-400" />}
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-slate-300">Segurança</h2>
      </div>

      {ativa ? (
        <>
          <p className="text-xs text-slate-400">
            PIN ativo — o app pede o PIN ao abrir e sempre que você volta a ele depois de sair.
          </p>
          <div className="flex gap-2">
            <Botao variante="secundario" className="flex-1" onClick={() => setFluxo('trocar')}>
              Trocar PIN
            </Botao>
            <Botao variante="perigo" className="flex-1" onClick={() => setFluxo('remover')}>
              Remover trava
            </Botao>
          </div>
        </>
      ) : (
        <>
          <p className="text-xs text-slate-400">
            Sem PIN — qualquer pessoa que abrir este app no seu celular vê os dados direto, sem
            nenhuma trava.
          </p>
          <Botao className="w-full" onClick={() => setFluxo('ativar')}>
            <KeyRound size={16} /> Ativar trava por PIN
          </Botao>
        </>
      )}

      <FluxoPin fluxo={fluxo} onFechar={() => setFluxo(null)} onResolvido={aoResolverFluxo} />
    </Cartao>
  )
}

function FluxoPin({ fluxo, onFechar, onResolvido }) {
  const [etapa, setEtapa] = useState('inicio')
  const [pin, setPin] = useState('')
  const [pinAtual, setPinAtual] = useState('')
  const [primeiroPinNovo, setPrimeiroPinNovo] = useState('')
  const [erro, setErro] = useState('')
  const [processando, setProcessando] = useState(false)

  // Compara com o ÚLTIMO `fluxo` visto (inclusive `null`, de quando fechou) —
  // não só com o último flow ABERTO. Comparar só contra o último ABERTO
  // deixava dígitos e etapa de uma tentativa anterior visíveis ao reabrir o
  // MESMO fluxo (ex.: fechar "Trocar PIN" no meio e clicar em "Trocar PIN"
  // de novo): fechar não zera nada, e o fluxo novo "parece" igual ao antigo.
  const [ultimoFluxoVisto, setUltimoFluxoVisto] = useState(null)
  if (fluxo !== ultimoFluxoVisto) {
    setUltimoFluxoVisto(fluxo)
    if (fluxo) {
      setPin('')
      setPinAtual('')
      setPrimeiroPinNovo('')
      setErro('')
      setEtapa(fluxo === 'ativar' ? 'novo-definir' : fluxo === 'trocar' ? 'atual' : 'atual-remover')
    }
  }

  if (!fluxo) return null

  const podeContinuar = pin.length >= TAMANHO_MINIMO && !processando

  async function tratarErroSenhaErrada() {
    setErro('PIN atual incorreto.')
    setPin('')
  }

  async function aoContinuar() {
    setErro('')

    if (etapa === 'novo-definir') {
      setPrimeiroPinNovo(pin)
      setPin('')
      setEtapa('novo-confirmar')
      return
    }

    if (etapa === 'novo-confirmar') {
      if (pin !== primeiroPinNovo) {
        setErro('Os PINs digitados são diferentes. Vamos tentar de novo.')
        setPin('')
        setPrimeiroPinNovo('')
        setEtapa('novo-definir')
        return
      }
      setProcessando(true)
      await criarTrava(pin)
      setProcessando(false)
      onResolvido()
      return
    }

    if (etapa === 'atual') {
      setProcessando(true)
      const ok = await conferirPin(pin)
      setProcessando(false)
      if (!ok) return tratarErroSenhaErrada()
      setPinAtual(pin)
      setPin('')
      setEtapa('novo-definir-troca')
      return
    }

    if (etapa === 'novo-definir-troca') {
      setPrimeiroPinNovo(pin)
      setPin('')
      setEtapa('novo-confirmar-troca')
      return
    }

    if (etapa === 'novo-confirmar-troca') {
      if (pin !== primeiroPinNovo) {
        setErro('Os PINs digitados são diferentes. Vamos tentar de novo.')
        setPin('')
        setPrimeiroPinNovo('')
        setEtapa('novo-definir-troca')
        return
      }
      setProcessando(true)
      const ok = await trocarPin(pinAtual, pin)
      setProcessando(false)
      if (!ok) return tratarErroSenhaErrada()
      onResolvido()
      return
    }

    if (etapa === 'atual-remover') {
      setProcessando(true)
      const ok = await removerTrava(pin)
      setProcessando(false)
      if (!ok) return tratarErroSenhaErrada()
      onResolvido()
    }
  }

  const titulos = {
    'novo-definir': 'Criar PIN',
    'novo-confirmar': 'Confirme o PIN',
    atual: 'Digite o PIN atual',
    'novo-definir-troca': 'Novo PIN',
    'novo-confirmar-troca': 'Confirme o novo PIN',
    'atual-remover': 'Digite o PIN para remover a trava',
  }

  return (
    <FolhaInferior titulo={titulos[etapa]} aberto={Boolean(fluxo)} onFechar={onFechar}>
      <div className="flex flex-col items-center py-2">
        <TecladoPin valor={pin} aoMudar={setPin} tamanhoMax={6} desabilitado={processando} />
        {erro ? <p className="mt-3 text-sm font-medium text-vermelho-400">{erro}</p> : null}
        <Botao
          className="mt-5 w-full max-w-[260px]"
          onClick={aoContinuar}
          disabled={!podeContinuar}
        >
          Continuar
        </Botao>
      </div>
    </FolhaInferior>
  )
}
