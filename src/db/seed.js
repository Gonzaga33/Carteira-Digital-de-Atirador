import { db, ID_USUARIO } from './db.js'
import { SISTEMA_REGISTRO } from '../lib/registro.js'

// Dados de exemplo — usados só na primeira abertura do app, para o
// usuário já ver a tela funcionando. Tudo pode ser editado/apagado depois.
// Nenhum dado real de pessoa nenhuma: nomes, números e URLs são de exemplo.

const USUARIO_SEED = {
  id: ID_USUARIO,
  nome: 'Atirador CAC',
  cpf: '000.000.000-00',
  crNumero: '1234567',
  crValidade: '2027-03-15',
  crImagemUrl: 'https://placehold.co/600x400/1e3a8a/ffffff?text=CR+Digital+Colorido',
  clubeNome: 'Clube de Tiro e Caça',
  clubeMatricula: 'AC-9842',
  clubeValidade: '2027-01-10',
  clubeImagemUrl: 'https://placehold.co/600x400/065f46/ffffff?text=Filiacao+ao+Clube',
  nivelAtual: 2,
}

const EQUIPAMENTOS_SEED = [
  {
    id: 'arma_1',
    ordem: 0,
    tipo: 'Pistola',
    marcaModelo: 'Taurus TS9',
    calibre: '9x19mm Luger',
    numeroSerie: 'ABD123456',
    sistemaRegistro: SISTEMA_REGISTRO.SIGMA_CRAF,
    numeroCraf: '2024/098124-1',
    sigma: '987654321',
    validadeCraf: '2027-04-10',
    urlCraf: 'https://placehold.co/600x400/1e293b/ffffff?text=CRAF+Colorido+TS9',
  },
  {
    id: 'arma_2',
    ordem: 1,
    tipo: 'Carabina / Rifle',
    marcaModelo: 'CBC Tactical .22',
    calibre: '.22 LR',
    numeroSerie: 'CBC789012',
    sistemaRegistro: SISTEMA_REGISTRO.SIGMA_CRAF,
    numeroCraf: '2023/041122-3',
    sigma: '654321987',
    validadeCraf: '2026-11-15',
    urlCraf: 'https://placehold.co/600x400/1e293b/ffffff?text=CRAF+Colorido+.22+LR',
  },
  {
    id: 'arma_3',
    ordem: 2,
    tipo: 'Revólver',
    marcaModelo: 'Taurus RT85 .38',
    calibre: '.38 Special',
    numeroSerie: 'RT85XYZ001',
    sistemaRegistro: SISTEMA_REGISTRO.SINARM,
    numeroSinarm: 'SINARM 2025/003317',
    protocoloSinarm: '08350.123456/2025-11',
    // Exemplo de agente de segurança pública: validade indeterminada no
    // SINARM — a data fica vazia de propósito, não é campo esquecido.
    validadeSinarm: '',
    validadeIndeterminada: true,
    urlSinarm: 'https://placehold.co/600x400/3f2d1e/ffffff?text=Registro+SINARM+RT85',
  },
]

const GUIAS_TRAFEGO_SEED = [
  {
    id: 'gt_1',
    equipamentoId: 'arma_1',
    numeroGt: 'GT-2026/04581',
    validadeGt: '2027-01-15',
    tipo: 'Treinamento e Competição',
    itinerario: 'Nacional / Domicílio - Estandes',
    limiteMunicao: 'Até 180 cartuchos',
    urlGt: 'https://placehold.co/600x400/334155/ffffff?text=Guia+de+Trafego+9mm',
  },
  {
    id: 'gt_2',
    equipamentoId: 'arma_2',
    numeroGt: 'GT-2025/11244',
    validadeGt: '2026-11-20',
    tipo: 'Treinamento e Competição',
    itinerario: 'Nacional',
    limiteMunicao: 'Até 1000 cartuchos',
    urlGt: 'https://placehold.co/600x400/334155/ffffff?text=Guia+de+Trafego+.22+LR',
  },
  {
    id: 'gt_3',
    equipamentoId: 'arma_3',
    numeroGt: 'GT-2026/07733',
    validadeGt: '2027-06-05',
    tipo: 'Uso pessoal',
    itinerario: 'Domicílio - Estande credenciado',
    limiteMunicao: 'Até 50 cartuchos',
    urlGt: 'https://placehold.co/600x400/334155/ffffff?text=Guia+de+Trafego+.38',
  },
]

const HABITUALIDADES_SEED = [
  {
    id: 'hab_1',
    data: '2026-02-10',
    armaId: 'arma_1',
    armaNome: 'Taurus TS9 (9mm)',
    calibre: '9x19mm',
    evento: 'Treino IPSC / Precisão',
    clube: 'Clube de Tiro',
    tiros: 100,
    competicao: false,
    anexoUrl: '',
  },
  {
    id: 'hab_2',
    data: '2026-03-18',
    armaId: 'arma_1',
    armaNome: 'Taurus TS9 (9mm)',
    calibre: '9x19mm',
    evento: 'Etapa de Competição Interna',
    clube: 'Clube de Tiro',
    tiros: 150,
    competicao: true,
    anexoUrl: '',
  },
  {
    id: 'hab_3',
    data: '2026-04-22',
    armaId: 'arma_2',
    armaNome: 'CBC Tactical (.22 LR)',
    calibre: '.22 LR',
    evento: 'Silhueta Metálica',
    clube: 'Clube de Tiro',
    tiros: 200,
    competicao: false,
    anexoUrl: '',
  },
]

const ANO_SEED = 2026

const COTAS_INSUMOS_SEED = [
  {
    id: `cota_9x19mm_${ANO_SEED}`,
    calibre: '9x19mm Luger',
    limiteAnual: 4000,
    ano: ANO_SEED,
  },
  {
    id: `cota_22lr_${ANO_SEED}`,
    calibre: '.22 LR',
    limiteAnual: 10000,
    ano: ANO_SEED,
  },
]

const COMPRAS_INSUMOS_SEED = [
  {
    id: 'compra_9x19mm_1',
    calibre: '9x19mm Luger',
    ano: ANO_SEED,
    data: `${ANO_SEED}-02-01`,
    quantidade: 1500,
    descricao: 'Compra inicial registrada',
  },
  {
    id: 'compra_22lr_1',
    calibre: '.22 LR',
    ano: ANO_SEED,
    data: `${ANO_SEED}-02-01`,
    quantidade: 3500,
    descricao: 'Compra inicial registrada',
  },
]

/**
 * Popula o banco só se ele estiver totalmente vazio — nunca sobrescreve
 * dado que o usuário já tenha criado ou editado.
 */
export async function semearBancoSeVazio() {
  const jaTemUsuario = await db.usuario.get(ID_USUARIO)
  if (jaTemUsuario) return false

  await db.transaction(
    'rw',
    db.usuario,
    db.equipamentos,
    db.guiasTrafego,
    db.habitualidades,
    db.cotasInsumos,
    db.comprasInsumos,
    async () => {
      await db.usuario.put(USUARIO_SEED)
      await db.equipamentos.bulkPut(EQUIPAMENTOS_SEED)
      await db.guiasTrafego.bulkPut(GUIAS_TRAFEGO_SEED)
      await db.habitualidades.bulkPut(HABITUALIDADES_SEED)
      await db.cotasInsumos.bulkPut(COTAS_INSUMOS_SEED)
      await db.comprasInsumos.bulkPut(COMPRAS_INSUMOS_SEED)
    },
  )
  return true
}
