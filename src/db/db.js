import Dexie from 'dexie'

// Banco local (IndexedDB) — tudo fica no aparelho, nada sai para servidor
// nenhum. offline-first de verdade: o app funciona sem rede desde a
// primeira abertura depois de instalado.
export const db = new Dexie('carteira-cac')

db.version(1).stores({
  // Linha única (id fixo "usuario") com CR + filiação ao clube.
  usuario: 'id',
  // Armas do acervo. `ordem` permite reordenar na tela.
  equipamentos: 'id, ordem',
  // Guias de Tráfego — cada uma pertence a UM equipamento (equipamentoId).
  // Ficam sempre agrupadas visualmente logo abaixo da arma dona.
  guiasTrafego: 'id, equipamentoId, validadeGt',
  // Registro de habitualidade (treino/competição). `armaNome` e `calibre`
  // são gravados na hora do registro (não só o id) — se a arma for
  // apagada depois, o histórico continua legível e correto.
  habitualidades: 'id, data, armaId, calibre',
  // Uma linha por calibre, por ano — o teto anual declarado pelo usuário.
  cotasInsumos: 'id, calibre, ano',
  // Cada compra de munição/insumo lançada, ligada pelo texto do calibre
  // (não por id) — o mesmo padrão do resto do app: dado que precisa
  // sobreviver mesmo que a cota seja reconfigurada depois.
  comprasInsumos: 'id, calibre, ano, data',
})

// v2: trava por PIN. Só ACRESCENTA uma tabela nova — nenhuma tabela
// anterior muda, então o upgrade é automático, sem apagar nada de quem
// já usa o app.
db.version(2).stores({
  usuario: 'id',
  equipamentos: 'id, ordem',
  guiasTrafego: 'id, equipamentoId, validadeGt',
  habitualidades: 'id, data, armaId, calibre',
  cotasInsumos: 'id, calibre, ano',
  comprasInsumos: 'id, calibre, ano, data',
  // Linha única com o hash do PIN (nunca o PIN em texto puro) — ver
  // lib/seguranca.js. Ausência de linha = "nunca configurado ainda".
  seguranca: 'id',
})

export const ID_USUARIO = 'usuario-unico'

export function novoId(prefixo) {
  const aleatorio =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return prefixo ? `${prefixo}_${aleatorio}` : aleatorio
}
