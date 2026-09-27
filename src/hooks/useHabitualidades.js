import { useLiveQuery } from 'dexie-react-hooks'
import { db, novoId } from '../db/db.js'

export function useHabitualidades() {
  return useLiveQuery(
    () => db.habitualidades.orderBy('data').reverse().toArray(),
    [],
  )
}

export async function criarHabitualidade(dados) {
  await db.habitualidades.add({ id: novoId('hab'), ...dados })
}

export async function atualizarHabitualidade(id, dados) {
  await db.habitualidades.update(id, dados)
}

export async function apagarHabitualidade(id) {
  await db.habitualidades.delete(id)
}
