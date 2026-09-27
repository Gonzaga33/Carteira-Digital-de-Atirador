export default function BarraProgresso({ percentual, cumpriu = false, rotulo }) {
  const pct = Math.max(0, Math.min(100, percentual))
  const cor = cumpriu ? 'bg-verde-500' : 'bg-ouro-400'

  return (
    <div>
      {rotulo ? (
        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
          <span>{rotulo}</span>
          <span className="font-semibold text-slate-200">{pct}%</span>
        </div>
      ) : null}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-tinta-700">
        <div
          className={`h-full rounded-full ${cor} transition-[width] duration-500`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
