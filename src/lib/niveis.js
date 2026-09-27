// Metas de habitualidade por Nível de CAC, informadas no pedido:
// Nível 1: 8 habitualidades no ano.
// Nível 2: 12 habitualidades no ano, sendo ao menos 2 em competição.
// Nível 3: 20 habitualidades no ano, sendo ao menos 6 em competição.
// A CONTAGEM É POR ANO CALENDÁRIO (1º de janeiro a 31 de dezembro) — o
// mesmo período que a cota de insumos já usa ("comprado_ano"), para as
// duas telas falarem a mesma unidade de tempo.
export const METAS_NIVEL = {
  1: { habitualidades: 8, competicoes: 0, rotulo: 'Nível 1' },
  2: { habitualidades: 12, competicoes: 2, rotulo: 'Nível 2' },
  3: { habitualidades: 20, competicoes: 6, rotulo: 'Nível 3' },
}

export function habitualidadesDoAno(habitualidades, ano) {
  return habitualidades.filter((h) => h.data?.startsWith(String(ano)))
}

export function progressoDoNivel(habitualidades, ano, nivel) {
  const meta = METAS_NIVEL[nivel] ?? METAS_NIVEL[1]
  const doAno = habitualidadesDoAno(habitualidades, ano)
  const totalHabitualidades = doAno.length
  const totalCompeticoes = doAno.filter((h) => h.competicao).length

  const pctHabitualidades = meta.habitualidades
    ? Math.min(100, Math.round((totalHabitualidades / meta.habitualidades) * 100))
    : 100
  const pctCompeticoes = meta.competicoes
    ? Math.min(100, Math.round((totalCompeticoes / meta.competicoes) * 100))
    : 100

  const cumpriu =
    totalHabitualidades >= meta.habitualidades && totalCompeticoes >= meta.competicoes

  return {
    meta,
    totalHabitualidades,
    totalCompeticoes,
    pctHabitualidades,
    pctCompeticoes,
    cumpriu,
  }
}
