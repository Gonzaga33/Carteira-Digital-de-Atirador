/** Barra de uso da cota anual — aqui o sentido é o INVERSO do progresso de
 * nível: chegar em 100% é o limite estourando, não uma meta cumprida. */
export default function BarraCota({ compradoAno, limiteAnual }) {
  const pctReal = limiteAnual > 0 ? (compradoAno / limiteAnual) * 100 : 0
  const pctBarra = Math.max(0, Math.min(100, pctReal))

  let cor = 'bg-ouro-400'
  if (pctReal >= 100) cor = 'bg-vermelho-500'
  else if (pctReal >= 80) cor = 'bg-amarelo-500'

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span>
          {compradoAno.toLocaleString('pt-BR')} de {limiteAnual.toLocaleString('pt-BR')}
        </span>
        <span className="font-semibold text-slate-200">{Math.round(pctReal)}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-tinta-700">
        <div
          className={`h-full rounded-full ${cor} transition-[width] duration-500`}
          style={{ width: `${pctBarra}%` }}
          role="progressbar"
          aria-valuenow={Math.round(pctReal)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
