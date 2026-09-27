import { useLiveQuery } from 'dexie-react-hooks'
import { db, novoId } from '../db/db.js'

export function useCotasDoAno(ano) {
  return useLiveQuery(() => db.cotasInsumos.where('ano').equals(ano).toArray(), [ano])
}

export function useComprasDoAno(ano) {
  return useLiveQuery(() => db.comprasInsumos.where('ano').equals(ano).toArray(), [ano])
}

export function compradoNoAno(compras, calibre) {
  return (compras ?? [])
    .filter((c) => c.calibre === calibre)
    .reduce((soma, c) => soma + (Number(c.quantidade) || 0), 0)
}

export function comprasDoCalibre(compras, calibre) {
  return (compras ?? [])
    .filter((c) => c.calibre === calibre)
    .sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''))
}

export async function salvarCota({ id, calibre, limiteAnual, ano }) {
  if (id) {
    await db.cotasInsumos.update(id, { calibre, limiteAnual, ano })
  } else {
    await db.cotasInsumos.add({ id: novoId('cota'), calibre, limiteAnual, ano })
  }
}

export async function apagarCota(id) {
  await db.cotasInsumos.delete(id)
}

export async function lancarCompra({ calibre, ano, data, quantidade, descricao }) {
  await db.comprasInsumos.add({
    id: novoId('compra'),
    calibre,
    ano,
    data,
    quantidade: Number(quantidade) || 0,
    descricao,
  })
}

export async function apagarCompra(id) {
  await db.comprasInsumos.delete(id)
}
