import { useEffect, useRef } from 'react'

/**
 * Faz o botão/gesto de VOLTAR do celular fechar esta tela em vez de sair do
 * app inteiro. Nenhuma tela cheia deste app (Ajustes, os formulários, o
 * visualizador de documento) usa rota própria — é só estado do React, então
 * não existe "página anterior" para o navegador voltar. Sem isto, o botão
 * voltar do Android FECHA o app (ou navega para fora dele); reabrir depois
 * é sempre um início frio, e por isso a pessoa cai de volta na tela de PIN
 * mesmo só querendo fechar aquela tela.
 *
 * Empilha uma entrada de histórico quando a tela ABRE; o botão voltar
 * (`popstate`) fecha a tela em vez de sair do app. Fechar por outro
 * caminho (X, Esc, cancelar) consome essa entrada sozinho ao desmontar,
 * para não empilhar histórico à toa.
 *
 * Com duas telas abertas ao mesmo tempo (ex.: uma confirmação por cima de
 * um formulário), um único toque no voltar fecha as duas — cada uma tem o
 * próprio ouvinte de `popstate`, e o evento chega às duas juntas. É um
 * comportamento imperfeito, mas raro na prática e sempre melhor que sair
 * do app inteiro, que é o defeito que isto substitui.
 */
export function useFecharComVoltar(aberto, onFechar) {
  const fechandoPeloHistorico = useRef(false)

  useEffect(() => {
    if (!aberto) return

    window.history.pushState({ telaAberta: true }, '')

    function aoVoltar() {
      fechandoPeloHistorico.current = true
      onFechar()
    }
    window.addEventListener('popstate', aoVoltar)

    return () => {
      window.removeEventListener('popstate', aoVoltar)
      if (!fechandoPeloHistorico.current && window.history.state?.telaAberta) {
        window.history.back()
      }
      fechandoPeloHistorico.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto])
}
