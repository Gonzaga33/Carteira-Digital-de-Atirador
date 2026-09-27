import { CheckCircle2, Target, Trophy } from 'lucide-react'
import Cartao from '../common/Cartao.jsx'
import BarraProgresso from '../common/BarraProgresso.jsx'
import { useHabitualidades } from '../../hooks/useHabitualidades.js'
import { useUsuario, salvarUsuario } from '../../hooks/useUsuario.js'
import { METAS_NIVEL, progressoDoNivel } from '../../lib/niveis.js'
import { anoAtual } from '../../lib/data.js'

export default function TelaNivel() {
  const habitualidades = useHabitualidades()
  const usuario = useUsuario()
  const ano = anoAtual()

  if (!habitualidades || !usuario) {
    return <p className="p-6 text-center text-slate-500">Carregando…</p>
  }

  const nivelAtual = usuario.nivelAtual ?? 1
  const progresso = progressoDoNivel(habitualidades, ano, nivelAtual)

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-slate-100">
          Nível CAC
        </h1>
        <p className="text-sm text-slate-400">Metas de habitualidade — ano {ano}</p>
      </div>

      <Cartao className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-lg font-bold uppercase tracking-wide text-ouro-300">
            {progresso.meta.rotulo}
          </p>
          <select
            value={nivelAtual}
            onChange={(e) => salvarUsuario({ nivelAtual: Number(e.target.value) })}
            className="rounded-lg border border-tinta-600 bg-tinta-800 px-2.5 py-1.5 text-sm text-slate-100"
            aria-label="Nível a acompanhar"
          >
            {Object.entries(METAS_NIVEL).map(([n, meta]) => (
              <option key={n} value={n}>
                {meta.rotulo}
              </option>
            ))}
          </select>
        </div>

        <BarraProgresso
          rotulo={`Habitualidades — ${progresso.totalHabitualidades} de ${progresso.meta.habitualidades}`}
          percentual={progresso.pctHabitualidades}
          cumpriu={progresso.totalHabitualidades >= progresso.meta.habitualidades}
        />

        {progresso.meta.competicoes > 0 ? (
          <BarraProgresso
            rotulo={`Competições — ${progresso.totalCompeticoes} de ${progresso.meta.competicoes}`}
            percentual={progresso.pctCompeticoes}
            cumpriu={progresso.totalCompeticoes >= progresso.meta.competicoes}
          />
        ) : null}

        {progresso.cumpriu ? (
          <div className="flex items-center gap-2 rounded-xl border border-verde-500/40 bg-verde-500/10 px-3 py-2.5 text-sm font-semibold text-verde-400">
            <CheckCircle2 size={18} /> Meta do {progresso.meta.rotulo} cumprida em {ano}!
          </div>
        ) : null}
      </Cartao>

      <div>
        <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-slate-400">
          Todos os níveis
        </h2>
        <div className="space-y-2.5">
          {Object.entries(METAS_NIVEL).map(([n, meta]) => {
            const p = progressoDoNivel(habitualidades, ano, Number(n))
            return (
              <Cartao key={n} className="!p-3.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-slate-100">
                    <Target size={14} className="text-ouro-300" /> {meta.rotulo}
                  </span>
                  <span className="text-xs text-slate-400">
                    {p.totalHabitualidades}/{meta.habitualidades} hab
                    {meta.competicoes > 0 ? (
                      <>
                        {' '}
                        ·{' '}
                        <span className="inline-flex items-center gap-1">
                          <Trophy size={12} /> {p.totalCompeticoes}/{meta.competicoes}
                        </span>
                      </>
                    ) : null}
                  </span>
                </div>
                <div className="mt-2">
                  <BarraProgresso percentual={p.pctHabitualidades} cumpriu={p.cumpriu} />
                </div>
              </Cartao>
            )
          })}
        </div>
      </div>
    </div>
  )
}
