import { useLiveQuery } from 'dexie-react-hooks'
import { db, novoId } from '../db/db.js'

export function useEquipamentos() {
  return useLiveQuery(() => db.equipamentos.orderBy('ordem').toArray(), [])
}

export function useGuiasTrafego() {
  return useLiveQuery(() => db.guiasTrafego.toArray(), [])
}

export function guiasDoEquipamento(guias, equipamentoId) {
  return (guias ?? [])
    .filter((g) => g.equipamentoId === equipamentoId)
    .sort((a, b) => (a.validadeGt ?? '').localeCompare(b.validadeGt ?? ''))
}

export async function criarEquipamento(dados) {
  const total = await db.equipamentos.count()
  await db.equipamentos.add({ id: novoId('arma'), ordem: total, ...dados })
}

export async function atualizarEquipamento(id, dados) {
  await db.equipamentos.update(id, dados)
}

/** Apaga a arma e TODAS as guias de tráfego dela — uma GT órfã, sem arma
 * dona, não faz sentido nenhum na tela. */
export async function apagarEquipamento(id) {
  await db.transaction('rw', db.equipamentos, db.guiasTrafego, async () => {
    await db.guiasTrafego.where('equipamentoId').equals(id).delete()
    await db.equipamentos.delete(id)
  })
}

export async function criarGuiaTrafego(equipamentoId, dados) {
  await db.guiasTrafego.add({ id: novoId('gt'), equipamentoId, ...dados })
}

export async function atualizarGuiaTrafego(id, dados) {
  await db.guiasTrafego.update(id, dados)
}

export async function apagarGuiaTrafego(id) {
  await db.guiasTrafego.delete(id)
}
