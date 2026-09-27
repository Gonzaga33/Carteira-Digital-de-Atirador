import { useLiveQuery } from 'dexie-react-hooks'
import { db, ID_USUARIO } from '../db/db.js'

export function useUsuario() {
  return useLiveQuery(() => db.usuario.get(ID_USUARIO), [])
}

export async function salvarUsuario(campos) {
  await db.usuario.update(ID_USUARIO, campos)
}
