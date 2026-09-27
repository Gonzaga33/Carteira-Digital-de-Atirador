const classeBase =
  'w-full rounded-xl border border-tinta-600 bg-tinta-800 px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-ouro-400 focus:ring-2 focus:ring-ouro-400/30'

export default function Campo({ rotulo, ajuda, erro, filho }) {
  return (
    <label className="block">
      {rotulo ? (
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
          {rotulo}
        </span>
      ) : null}
      {filho}
      {ajuda ? <span className="mt-1 block text-xs text-slate-500">{ajuda}</span> : null}
      {erro ? <span className="mt-1 block text-xs text-vermelho-400">{erro}</span> : null}
    </label>
  )
}

export function classeCampo(extra = '') {
  return `${classeBase} ${extra}`
}
