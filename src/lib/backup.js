import { db } from '../db/db.js'

const VERSAO_BACKUP = 1

/** Junta as seis tabelas num único objeto — o arquivo .json que o usuário
 * pode guardar fora do aparelho (e-mail, nuvem própria) e restaurar depois. */
export async function exportarBackup() {
  const [usuario, equipamentos, guiasTrafego, habitualidades, cotasInsumos, comprasInsumos] =
    await Promise.all([
      db.usuario.toArray(),
      db.equipamentos.toArray(),
      db.guiasTrafego.toArray(),
      db.habitualidades.toArray(),
      db.cotasInsumos.toArray(),
      db.comprasInsumos.toArray(),
    ])

  return {
    app: 'carteira-cac',
    versaoBackup: VERSAO_BACKUP,
    geradoEm: new Date().toISOString(),
    dados: { usuario, equipamentos, guiasTrafego, habitualidades, cotasInsumos, comprasInsumos },
  }
}

export function baixarBackupComoArquivo(backup) {
  const texto = JSON.stringify(backup, null, 2)
  const blob = new Blob([texto], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const dataDeHoje = new Date().toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `carteira-cac-backup-${dataDeHoje}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function tabelaValida(valor) {
  return Array.isArray(valor)
}

/** Lê o arquivo escolhido e valida a forma básica ANTES de tocar no banco —
 * um JSON de outro app ou corrompido não pode apagar o que já existe. */
export async function lerArquivoDeBackup(arquivo) {
  const texto = await arquivo.text()
  let json
  try {
    json = JSON.parse(texto)
  } catch {
    throw new Error('Arquivo não é um JSON válido.')
  }
  if (json?.app !== 'carteira-cac' || !json?.dados) {
    throw new Error('Este arquivo não é um backup da Carteira Digital de Atirador.')
  }
  const { equipamentos, guiasTrafego, habitualidades, cotasInsumos, comprasInsumos } = json.dados
  if (
    !tabelaValida(equipamentos) ||
    !tabelaValida(guiasTrafego) ||
    !tabelaValida(habitualidades) ||
    !tabelaValida(cotasInsumos) ||
    !tabelaValida(comprasInsumos)
  ) {
    throw new Error('Backup incompleto ou de versão incompatível.')
  }
  return json
}

/** Restaura substituindo TUDO — pedido explícito do usuário, avisado antes
 * na tela (é uma ação destrutiva sobre o que está no aparelho agora). */
export async function restaurarBackup(json) {
  const { usuario, equipamentos, guiasTrafego, habitualidades, cotasInsumos, comprasInsumos } =
    json.dados

  await db.transaction(
    'rw',
    db.usuario,
    db.equipamentos,
    db.guiasTrafego,
    db.habitualidades,
    db.cotasInsumos,
    db.comprasInsumos,
    async () => {
      await Promise.all([
        db.usuario.clear(),
        db.equipamentos.clear(),
        db.guiasTrafego.clear(),
        db.habitualidades.clear(),
        db.cotasInsumos.clear(),
        db.comprasInsumos.clear(),
      ])
      await Promise.all([
        usuario?.length ? db.usuario.bulkPut(usuario) : Promise.resolve(),
        db.equipamentos.bulkPut(equipamentos),
        db.guiasTrafego.bulkPut(guiasTrafego),
        db.habitualidades.bulkPut(habitualidades),
        db.cotasInsumos.bulkPut(cotasInsumos),
        db.comprasInsumos.bulkPut(comprasInsumos),
      ])
    },
  )
}
