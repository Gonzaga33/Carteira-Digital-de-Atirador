import { useEffect, useState } from 'react'
import { Lock, ShieldCheck, ShieldOff, AlertTriangle } from 'lucide-react'
import TecladoPin from './TecladoPin.jsx'
import { criarTrava, pularTrava, conferirPin } from '../../lib/seguranca.js'

const TENTATIVAS_ATE_ESPERAR = 5
const SEGUNDOS_DE_ESPERA = 30
const TAMANHO_MINIMO = 4

/**
 * Tela cheia exibida ANTES de qualquer conteúdo do app.
 * `modo`: "criar" (nunca configurou PIN) | "desbloquear" (PIN já existe).
 * De propósito, NÃO EXISTE botão de "esqueci o PIN" aqui — colocar um
 * bypass na própria tela de bloqueio anularia a proteção contra quem
 * pega o celular. Ver README para o caminho de recuperação (fora do app).
 */
export default function TelaTrava({ modo, onResolvido }) {
  const [etapa, setEtapa] = useState(modo === 'criar' ? 'definir' : 'desbloquear')
  const [pin, setPin] = useState('')
  const [primeiroPin, setPrimeiroPin] = useState('')
  const [erro, setErro] = useState('')
  const [processando, setProcessando] = useState(false)
  const [tentativas, setTentativas] = useState(0)
  const [bloqueadoAte, setBloqueadoAte] = useState(0)
  const [segundosRestantes, setSegundosRestantes] = useState(0)

  // `Date.now()` só é chamado dentro do intervalo (efeito), nunca durante
  // o render — `segundosRestantes` (estado) é a única fonte de verdade
  // para decidir se o teclado está travado, evitando resultado instável
  // entre re-renders.
  useEffect(() => {
    if (!bloqueadoAte) return
    const id = setInterval(() => {
      const restante = Math.max(0, Math.ceil((bloqueadoAte - Date.now()) / 1000))
      setSegundosRestantes(restante)
      if (restante === 0) {
        setBloqueadoAte(0)
        setTentativas(0)
      }
    }, 500)
    return () => clearInterval(id)
  }, [bloqueadoAte])

  const travadoPorTentativas = segundosRestantes > 0
  const podeContinuar = pin.length >= TAMANHO_MINIMO && !processando && !travadoPorTentativas

  async function aoContinuarDefinir() {
    setPrimeiroPin(pin)
    setPin('')
    setErro('')
    setEtapa('confirmar')
  }

  async function aoContinuarConfirmar() {
    if (pin !== primeiroPin) {
      setErro('Os PINs digitados são diferentes. Vamos tentar de novo.')
      setPin('')
      setPrimeiroPin('')
      setEtapa('definir')
      return
    }
    setProcessando(true)
    await criarTrava(pin)
    setProcessando(false)
    onResolvido()
  }

  async function aoPular() {
    setProcessando(true)
    await pularTrava()
    setProcessando(false)
    onResolvido()
  }

  async function aoTentarDesbloquear() {
    setProcessando(true)
    const ok = await conferirPin(pin)
    setProcessando(false)
    if (ok) {
      onResolvido()
      return
    }
    const novasTentativas = tentativas + 1
    setTentativas(novasTentativas)
    setPin('')
    if (novasTentativas >= TENTATIVAS_ATE_ESPERAR) {
      setBloqueadoAte(Date.now() + SEGUNDOS_DE_ESPERA * 1000)
      setSegundosRestantes(SEGUNDOS_DE_ESPERA)
      setErro(`Muitas tentativas erradas. Espere ${SEGUNDOS_DE_ESPERA} segundos.`)
    } else {
      setErro('PIN incorreto.')
    }
  }

  function aoTocarContinuar() {
    if (!podeContinuar) return
    if (etapa === 'definir') return aoContinuarDefinir()
    if (etapa === 'confirmar') return aoContinuarConfirmar()
    if (etapa === 'desbloquear') return aoTentarDesbloquear()
  }

  const textos = {
    definir: {
      icone: <ShieldCheck size={32} className="text-ouro-300" />,
      titulo: 'Criar PIN de acesso',
      subtitulo: `Escolha um PIN de ${TAMANHO_MINIMO} a 6 dígitos para abrir o app da próxima vez.`,
      rotuloBotao: 'Continuar',
    },
    confirmar: {
      icone: <ShieldCheck size={32} className="text-ouro-300" />,
      titulo: 'Confirme o PIN',
      subtitulo: 'Digite o mesmo PIN de novo, para garantir que não foi engano.',
      rotuloBotao: 'Ativar PIN',
    },
    desbloquear: {
      icone: <Lock size={32} className="text-ouro-300" />,
      titulo: 'Digite seu PIN',
      subtitulo: 'A carteira está travada.',
      rotuloBotao: 'Entrar',
    },
  }[etapa]

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-tinta-950 px-6 pb-safe pt-safe">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        {textos.icone}
        <h1 className="font-display text-xl font-bold uppercase tracking-wide text-slate-100">
          {textos.titulo}
        </h1>
        <p className="max-w-xs text-sm text-slate-400">{textos.subtitulo}</p>
      </div>

      <TecladoPin
        valor={pin}
        aoMudar={setPin}
        tamanhoMax={6}
        desabilitado={processando || travadoPorTentativas}
      />

      <div className="mt-4 min-h-10 text-center">
        {erro ? (
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-vermelho-400">
            <AlertTriangle size={15} />
            {travadoPorTentativas ? `Espere ${segundosRestantes}s para tentar de novo.` : erro}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={aoTocarContinuar}
        disabled={!podeContinuar}
        className="alvo-toque mt-2 w-full max-w-[260px] rounded-2xl bg-ouro-400 py-3 text-sm font-bold uppercase tracking-wide text-tinta-950 disabled:opacity-30"
      >
        {textos.rotuloBotao}
      </button>

      {etapa === 'definir' ? (
        <button
          type="button"
          onClick={aoPular}
          disabled={processando}
          className="alvo-toque mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300"
        >
          <ShieldOff size={14} /> Pular por enquanto — decidir depois em Ajustes
        </button>
      ) : null}

      {etapa === 'desbloquear' ? (
        <p className="mt-6 max-w-[260px] text-center text-xs text-slate-600">
          Sem opção de "esqueci o PIN" de propósito — quem pega seu celular não pode usar o mesmo
          botão para entrar. Esqueceu mesmo? O único jeito é limpar os dados deste app pelas
          configurações do celular/navegador.
        </p>
      ) : null}
    </div>
  )
}
