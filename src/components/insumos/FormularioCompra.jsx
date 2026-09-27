import { useState } from 'react'
import FolhaInferior from '../common/FolhaInferior.jsx'
import Campo, { classeCampo } from '../common/Campo.jsx'
import Botao from '../common/Botao.jsx'
import { hojeTexto } from '../../lib/data.js'
import { lancarCompra } from '../../hooks/useInsumos.js'

export default function FormularioCompra({ calibre, ano, aberto, onFechar }) {
  const [data, setData] = useState(hojeTexto())
  const [quantidade, setQuantidade] = useState('')
  const [descricao, setDescricao] = useState('')

  async function aoSalvar(evento) {
    evento.preventDefault()
    if (!quantidade) return
    await lancarCompra({ calibre, ano, data, quantidade, descricao })
    setQuantidade('')
    setDescricao('')
    onFechar()
  }

  return (
    <FolhaInferior titulo={`Lançar compra — ${calibre}`} aberto={aberto} onFechar={onFechar}>
      <form onSubmit={aoSalvar} className="space-y-4">
        <Campo
          rotulo="Data da compra"
          filho={
            <input
              type="date"
              className={classeCampo()}
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          }
        />
        <Campo
          rotulo="Quantidade (cartuchos)"
          filho={
            <input
              type="number"
              min="1"
              className={classeCampo()}
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="500"
              required
            />
          }
        />
        <Campo
          rotulo="Observação"
          filho={
            <input
              className={classeCampo()}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Nota fiscal, loja…"
            />
          }
        />
        <div className="flex justify-end gap-2 pt-2">
          <Botao type="button" variante="fantasma" onClick={onFechar}>
            Cancelar
          </Botao>
          <Botao type="submit" variante="primario">
            Lançar compra
          </Botao>
        </div>
      </form>
    </FolhaInferior>
  )
}
