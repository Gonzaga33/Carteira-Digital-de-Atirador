import { situacaoDaValidade, textoDaValidade, CORES_SEMAFORO } from '../../lib/semaforo.js'

/** Selo colorido de validade — o semáforo usado em documento, CRAF/SINARM e
 * GT. `indeterminada` é para registro que a própria norma dispensa de
 * vencimento (ex.: agente de segurança pública no SINARM) — nunca soa como
 * alerta, ao contrário de "sem data" (que É um alerta: campo esquecido). */
export default function SeloValidade({ dataValidade, indeterminada = false, compacto = false }) {
  const situacao = situacaoDaValidade(dataValidade, indeterminada)
  const cores = CORES_SEMAFORO[situacao]
  const texto = textoDaValidade(dataValidade, indeterminada)

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cores.faixa} ${
        compacto ? 'shrink min-w-0 max-w-[9.5rem]' : 'max-w-full shrink-0'
      }`}
      title={texto}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${cores.ponto}`} aria-hidden="true" />
      <span className={compacto ? 'min-w-0 truncate' : ''}>{texto}</span>
    </span>
  )
}
