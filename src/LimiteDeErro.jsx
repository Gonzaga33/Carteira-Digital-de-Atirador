import { Component } from 'react'
import { AlertOctagon } from 'lucide-react'

export default class LimiteDeErro extends Component {
  state = { erro: null }

  static getDerivedStateFromError(erro) {
    return { erro }
  }

  componentDidCatch(erro, info) {
    console.error('Erro não tratado na Carteira Digital de Atirador:', erro, info)
  }

  render() {
    if (!this.state.erro) return this.props.children
    return (
      <div className="grid min-h-svh place-items-center bg-tinta-950 p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <AlertOctagon size={40} className="text-vermelho-400" />
          <h1 className="font-display text-lg font-bold uppercase tracking-wide text-slate-100">
            Algo não carregou
          </h1>
          <p className="max-w-xs text-sm text-slate-400">
            Seus dados continuam salvos no aparelho. Tente fechar e abrir o app de novo.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="alvo-toque mt-2 rounded-xl bg-ouro-400 px-4 py-2.5 text-sm font-semibold text-tinta-950"
          >
            Recarregar
          </button>
        </div>
      </div>
    )
  }
}
