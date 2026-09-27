import { IdCard, Crosshair, ClipboardList, Trophy, PackageOpen } from 'lucide-react'

export const ABAS = [
  { id: 'carteira', rotulo: 'Carteira', Icone: IdCard },
  { id: 'equipamentos', rotulo: 'Armas', Icone: Crosshair },
  { id: 'habitualidades', rotulo: 'Registro', Icone: ClipboardList },
  { id: 'nivel', rotulo: 'Nível', Icone: Trophy },
  { id: 'insumos', rotulo: 'Insumos', Icone: PackageOpen },
]

export default function NavegacaoInferior({ abaAtiva, onMudarAba }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-tinta-700 bg-tinta-900/95 backdrop-blur pb-safe"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex max-w-lg">
        {ABAS.map(({ id, rotulo, Icone }) => {
          const ativa = abaAtiva === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onMudarAba(id)}
              className={`alvo-toque flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors ${
                ativa ? 'text-ouro-300' : 'text-slate-500'
              }`}
              aria-current={ativa ? 'page' : undefined}
            >
              <Icone size={20} strokeWidth={ativa ? 2.4 : 2} />
              {rotulo}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
