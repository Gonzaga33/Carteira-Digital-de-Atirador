// Datas são sempre texto "AAAA-MM-DD" e comparadas como TEXTO/número de
// dias inteiros — nunca `new Date()` com hora embutida. Fuso horário do
// aparelho não pode fazer "hoje" virar "ontem" ou "amanhã" por causa da
// hora local. Ver o mesmo cuidado documentado no projeto irmão
// (lib/agendamento/dia.ts): meio-dia UTC evita o problema de virar o dia.

export function hojeTexto() {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function anoAtual() {
  return new Date().getFullYear()
}

function paraDataSegura(textoAAAAMMDD) {
  // meio-dia evita qualquer troca de dia por fuso horário
  return new Date(`${textoAAAAMMDD}T12:00:00`)
}

/** Diferença em dias inteiros: data - hoje. Negativo = já venceu. */
export function diasAte(dataTexto) {
  if (!dataTexto) return null
  const hoje = paraDataSegura(hojeTexto())
  const alvo = paraDataSegura(dataTexto)
  const msPorDia = 1000 * 60 * 60 * 24
  return Math.round((alvo.getTime() - hoje.getTime()) / msPorDia)
}

export function formatarData(dataTexto) {
  if (!dataTexto) return '—'
  const [ano, mes, dia] = dataTexto.split('-')
  if (!ano || !mes || !dia) return dataTexto
  return `${dia}/${mes}/${ano}`
}

export function formatarDataHoje() {
  return formatarData(hojeTexto())
}
