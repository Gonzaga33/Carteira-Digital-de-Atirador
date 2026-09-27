import { useState } from 'react'
import FolhaInferior from '../common/FolhaInferior.jsx'
import Campo, { classeCampo } from '../common/Campo.jsx'
import CampoArquivo from '../common/CampoArquivo.jsx'
import Botao from '../common/Botao.jsx'
import { criarEquipamento, atualizarEquipamento } from '../../hooks/useEquipamentos.js'
import { SISTEMA_REGISTRO, SISTEMAS_REGISTRO, sistemaDoEquipamento } from '../../lib/registro.js'

const TIPOS = ['Pistola', 'Revólver', 'Carabina / Rifle', 'Espingarda', 'Outro']

const VAZIO = {
  tipo: 'Pistola',
  marcaModelo: '',
  calibre: '',
  numeroSerie: '',
  sistemaRegistro: SISTEMA_REGISTRO.SIGMA_CRAF,
  numeroCraf: '',
  sigma: '',
  validadeCraf: '',
  urlCraf: '',
  numeroSinarm: '',
  protocoloSinarm: '',
  validadeSinarm: '',
  urlSinarm: '',
  validadeIndeterminada: false,
}

export default function FormularioEquipamento({ equipamento, aberto, onFechar, onVerAmpliado }) {
  const [dados, setDados] = useState(VAZIO)
  const [chaveCarregada, setChaveCarregada] = useState('')
  const chaveAbertura = `${aberto}-${equipamento?.id ?? 'novo'}`

  if (aberto && chaveCarregada !== chaveAbertura) {
    setChaveCarregada(chaveAbertura)
    setDados(
      equipamento
        ? { ...VAZIO, ...equipamento, sistemaRegistro: sistemaDoEquipamento(equipamento).valor }
        : VAZIO,
    )
  }

  function set(campo) {
    return (valor) => setDados((d) => ({ ...d, [campo]: valor }))
  }

  const sistema = SISTEMAS_REGISTRO.find((s) => s.valor === dados.sistemaRegistro) ?? SISTEMAS_REGISTRO[0]

  async function aoSalvar(evento) {
    evento.preventDefault()
    if (!dados.marcaModelo.trim() || !dados.calibre.trim()) return
    if (equipamento) {
      await atualizarEquipamento(equipamento.id, dados)
    } else {
      await criarEquipamento(dados)
    }
    onFechar()
  }

  return (
    <FolhaInferior
      titulo={equipamento ? 'Editar arma' : 'Nova arma'}
      aberto={aberto}
      onFechar={onFechar}
    >
      <form onSubmit={aoSalvar} className="space-y-4">
        <Campo
          rotulo="Tipo"
          filho={
            <select className={classeCampo()} value={dados.tipo} onChange={(e) => set('tipo')(e.target.value)}>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          }
        />
        <Campo
          rotulo="Marca / modelo"
          filho={
            <input
              className={classeCampo()}
              value={dados.marcaModelo}
              onChange={(e) => set('marcaModelo')(e.target.value)}
              placeholder="Taurus TS9"
              required
            />
          }
        />
        <Campo
          rotulo="Calibre"
          filho={
            <input
              className={classeCampo()}
              value={dados.calibre}
              onChange={(e) => set('calibre')(e.target.value)}
              placeholder="9x19mm Luger"
              required
            />
          }
        />
        <Campo
          rotulo="Número de série"
          filho={
            <input
              className={classeCampo()}
              value={dados.numeroSerie}
              onChange={(e) => set('numeroSerie')(e.target.value)}
            />
          }
        />

        <Campo
          rotulo="Sistema de registro"
          filho={
            <select
              className={classeCampo()}
              value={dados.sistemaRegistro}
              onChange={(e) => set('sistemaRegistro')(e.target.value)}
            >
              {SISTEMAS_REGISTRO.map((s) => (
                <option key={s.valor} value={s.valor}>
                  {s.rotulo}
                </option>
              ))}
            </select>
          }
          ajuda="Acervo do CAC (colecionador/atirador/caçador) é registrado no SIGMA/CRAF pelo Exército; posse ou porte pessoal, fora do CAC, é registrado no SINARM pela Polícia Federal."
        />

        {/* Os quatro campos abaixo trocam de nome conforme o sistema
            escolhido, mas são sempre os MESMOS quatro dados — nunca dois
            formulários diferentes. */}
        <div className="grid grid-cols-2 gap-3">
          <Campo
            rotulo={sistema.rotuloNumero}
            filho={
              <input
                className={classeCampo()}
                value={dados[sistema.campoNumero] ?? ''}
                onChange={(e) => set(sistema.campoNumero)(e.target.value)}
              />
            }
          />
          <Campo
            rotulo={sistema.rotuloProtocolo}
            filho={
              <input
                className={classeCampo()}
                value={dados[sistema.campoProtocolo] ?? ''}
                onChange={(e) => set(sistema.campoProtocolo)(e.target.value)}
              />
            }
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 rounded-xl border border-tinta-600 bg-tinta-800 px-3.5 py-3">
            <input
              type="checkbox"
              checked={dados.validadeIndeterminada}
              onChange={(e) => {
                const marcado = e.target.checked
                setDados((d) => ({
                  ...d,
                  validadeIndeterminada: marcado,
                  // Marcando indeterminada, a data antiga deixa de valer —
                  // limpa para não sobrar um vencimento fantasma gravado.
                  ...(marcado ? { [sistema.campoValidade]: '' } : {}),
                }))
              }}
              className="h-5 w-5 rounded border-tinta-500 bg-tinta-700 text-azul-400 focus:ring-azul-400"
            />
            <span className="text-sm text-slate-200">
              <strong>Validade indeterminada</strong> — sem vencimento (ex.: agente de segurança
              pública no SINARM)
            </span>
          </label>

          {!dados.validadeIndeterminada ? (
            <Campo
              rotulo={sistema.rotuloValidade}
              filho={
                <input
                  type="date"
                  className={classeCampo()}
                  value={dados[sistema.campoValidade] ?? ''}
                  onChange={(e) => set(sistema.campoValidade)(e.target.value)}
                />
              }
            />
          ) : null}
        </div>
        <Campo
          rotulo={sistema.rotuloDocumento}
          filho={
            <CampoArquivo
              valor={dados[sistema.campoUrl] ?? ''}
              aoMudar={set(sistema.campoUrl)}
              onVerAmpliado={onVerAmpliado}
              rotuloVazio={sistema.rotuloUpload}
            />
          }
        />

        <div className="flex justify-end gap-2 pt-2">
          <Botao type="button" variante="fantasma" onClick={onFechar}>
            Cancelar
          </Botao>
          <Botao type="submit" variante="primario">
            Salvar
          </Botao>
        </div>
      </form>
    </FolhaInferior>
  )
}
