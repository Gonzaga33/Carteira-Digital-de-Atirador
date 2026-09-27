const VARIANTES = {
  primario: 'bg-ouro-400 text-tinta-950 hover:bg-ouro-300',
  secundario: 'border border-tinta-600 bg-tinta-800 text-slate-100 hover:bg-tinta-700',
  perigo: 'border border-vermelho-500/50 bg-vermelho-500/10 text-vermelho-400 hover:bg-vermelho-500/20',
  fantasma: 'text-slate-300 hover:bg-tinta-800',
}

export default function Botao({
  children,
  variante = 'primario',
  className = '',
  type = 'button',
  ...resto
}) {
  return (
    <button
      type={type}
      className={`alvo-toque inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTES[variante]} ${className}`}
      {...resto}
    >
      {children}
    </button>
  )
}
