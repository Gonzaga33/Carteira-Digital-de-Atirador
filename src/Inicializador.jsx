import { useCallback, useEffect, useState } from 'react'
import { Crosshair } from 'lucide-react'
import { semearBancoSeVazio } from './db/seed.js'
import { jaDecidiuSobreTrava, travaConfigurada } from './lib/seguranca.js'
import { consumirPickerAberto } from './lib/seletorDeArquivo.js'
import TelaTrava from './components/seguranca/TelaTrava.jsx'
import App from './App.jsx'

/** Popula o banco de exemplo (só na primeira abertura) e decide se mostra
 * a tela de bloqueio ANTES de desenhar qualquer conteúdo do app. */
export default function Inicializador() {
  const [pronto, setPronto] = useState(false)
  const [modoTrava, setModoTrava] = useState(null) // 'criar' | 'desbloquear' | null (sem trava)
  const [desbloqueado, setDesbloqueado] = useState(false)

  const conferirTrava = useCallback(async () => {
    const jaDecidiu = await jaDecidiuSobreTrava()
    const ativa = await travaConfigurada()
    if (!jaDecidiu) {
      setModoTrava('criar')
      setDesbloqueado(false)
    } else if (ativa) {
      setModoTrava('desbloquear')
      setDesbloqueado(false)
    } else {
      setModoTrava(null)
      setDesbloqueado(true)
    }
  }, [])

  useEffect(() => {
    semearBancoSeVazio()
      .then(conferirTrava)
      .finally(() => setPronto(true))
  }, [conferirTrava])

  // Re-trava sozinho ao esconder a aba/app (troca de app, tela apagada,
  // minimizar) — é exatamente o momento em que alguém pode pegar o
  // celular. Consulta o banco a cada troca de visibilidade (nunca confia
  // em estado antigo em memória) e só tranca se houver PIN de verdade.
  //
  // EXCEÇÃO: abrir o seletor de foto/arquivo nativo TAMBÉM esconde a
  // página (é assim que todo navegador de celular mostra essa tela por
  // cima do app) — sem `consumirPickerAberto()`, qualquer envio de foto
  // (CR, CRAF/SINARM, GT, comprovante, e o próprio "Restaurar backup")
  // re-travava a sessão no meio do caminho, sempre no pior momento:
  // assim que a pessoa escolhia o arquivo.
  useEffect(() => {
    if (!pronto) return
    function aoTrocarVisibilidade() {
      if (!document.hidden) return
      if (consumirPickerAberto()) return
      travaConfigurada().then((ativa) => {
        if (!ativa) return
        setModoTrava('desbloquear')
        setDesbloqueado(false)
      })
    }
    document.addEventListener('visibilitychange', aoTrocarVisibilidade)
    return () => document.removeEventListener('visibilitychange', aoTrocarVisibilidade)
  }, [pronto])

  if (!pronto) {
    return (
      <div className="grid min-h-svh place-items-center bg-tinta-950">
        <div className="flex flex-col items-center gap-3 text-ouro-300">
          <Crosshair size={36} className="animate-pulse" />
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Carregando…
          </p>
        </div>
      </div>
    )
  }

  if (!desbloqueado && modoTrava) {
    return (
      <TelaTrava
        modo={modoTrava}
        onResolvido={() => {
          setDesbloqueado(true)
        }}
      />
    )
  }

  return <App />
}
