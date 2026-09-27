import { diasAte } from './data.js'

// Regra do semáforo, num lugar só — usada por documento, CRAF, SINARM e GT.
// Verde: mais de 60 dias para vencer.
// Amarelo: entre 1 e 60 dias (inclusive) — já é hora de agir.
// Vermelho: vencido (0 dias ou menos) — inclusive vence HOJE.
// Indeterminada: registro sem vencimento por regra própria (ex.: agente de
// segurança pública tem validade indeterminada no SINARM) — DIFERENTE de
// "sem data": aqui a ausência de data é intencional, não esquecimento, e
// nunca deve soar como alerta.
export const SEMAFORO = {
  VERDE: 'verde',
  AMARELO: 'amarelo',
  VERMELHO: 'vermelho',
  SEM_DATA: 'sem_data',
  INDETERMINADA: 'indeterminada',
}

export function situacaoDaValidade(dataValidade, indeterminada = false) {
  if (indeterminada) return SEMAFORO.INDETERMINADA
  const dias = diasAte(dataValidade)
  if (dias === null || Number.isNaN(dias)) return SEMAFORO.SEM_DATA
  if (dias <= 0) return SEMAFORO.VERMELHO
  if (dias <= 60) return SEMAFORO.AMARELO
  return SEMAFORO.VERDE
}

const TEXTO_POR_SITUACAO = {
  [SEMAFORO.VERDE]: (dias) => `Válido — vence em ${dias} dias`,
  [SEMAFORO.AMARELO]: (dias) =>
    dias === 0 ? 'Vence hoje' : `Atenção — vence em ${dias} dia${dias === 1 ? '' : 's'}`,
  [SEMAFORO.VERMELHO]: (dias) => {
    const vencidoHa = Math.abs(dias)
    if (vencidoHa === 0) return 'Vence hoje'
    return `Vencido há ${vencidoHa} dia${vencidoHa === 1 ? '' : 's'}`
  },
  [SEMAFORO.SEM_DATA]: () => 'Sem data de validade cadastrada',
  [SEMAFORO.INDETERMINADA]: () => 'Validade indeterminada — sem vencimento',
}

export function textoDaValidade(dataValidade, indeterminada = false) {
  const situacao = situacaoDaValidade(dataValidade, indeterminada)
  const dias = diasAte(dataValidade)
  return TEXTO_POR_SITUACAO[situacao](dias ?? 0)
}

export const CORES_SEMAFORO = {
  [SEMAFORO.VERDE]: {
    ponto: 'bg-verde-500',
    texto: 'text-verde-400',
    faixa: 'bg-verde-500/10 border-verde-500/40 text-verde-400',
  },
  [SEMAFORO.AMARELO]: {
    ponto: 'bg-amarelo-500',
    texto: 'text-amarelo-400',
    faixa: 'bg-amarelo-500/10 border-amarelo-500/40 text-amarelo-400',
  },
  [SEMAFORO.VERMELHO]: {
    ponto: 'bg-vermelho-500',
    texto: 'text-vermelho-400',
    faixa: 'bg-vermelho-500/10 border-vermelho-500/40 text-vermelho-400',
  },
  [SEMAFORO.SEM_DATA]: {
    ponto: 'bg-tinta-500',
    texto: 'text-slate-400',
    faixa: 'bg-tinta-700/60 border-tinta-600 text-slate-400',
  },
  [SEMAFORO.INDETERMINADA]: {
    ponto: 'bg-azul-400',
    texto: 'text-azul-300',
    faixa: 'bg-azul-500/10 border-azul-400/40 text-azul-300',
  },
}
