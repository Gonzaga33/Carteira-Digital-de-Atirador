import { db } from '../db/db.js'

// Trava por PIN — protege contra acesso CASUAL (alguém pegando o celular
// destravado). NÃO é criptografia do banco: quem abrir o DevTools do
// navegador ainda consegue ler o IndexedDB direto, PIN nenhum impede isso.
// Essa limitação foi escolhida de propósito, em troca de nunca correr o
// risco de perder os dados por esquecer uma senha — ver README.
//
// O PIN em si NUNCA é gravado — só um hash (PBKDF2-SHA256, com salt
// próprio por instalação), via WebCrypto nativo do navegador, sem
// dependência nenhuma.

const ID_SEGURANCA = 'unica'
const ITERACOES_PBKDF2 = 150000

function paraHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function hexParaBytes(hex) {
  return Uint8Array.from(hex.match(/.{2}/g).map((h) => parseInt(h, 16)))
}

function gerarSalt() {
  return paraHex(crypto.getRandomValues(new Uint8Array(16)))
}

async function derivarHash(pin, saltHex) {
  const chaveBase = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: hexParaBytes(saltHex), iterations: ITERACOES_PBKDF2, hash: 'SHA-256' },
    chaveBase,
    256,
  )
  return paraHex(bits)
}

/** Alguma linha já foi gravada (PIN configurado OU o usuário já disse que
 * não quer) — usado para saber se mostra a pergunta inicial de novo. */
export async function jaDecidiuSobreTrava() {
  const linha = await db.seguranca.get(ID_SEGURANCA)
  return Boolean(linha)
}

export async function travaConfigurada() {
  const linha = await db.seguranca.get(ID_SEGURANCA)
  return Boolean(linha?.pinHash)
}

export async function criarTrava(pin) {
  const salt = gerarSalt()
  const pinHash = await derivarHash(pin, salt)
  await db.seguranca.put({ id: ID_SEGURANCA, pinHash, salt, atualizadoEm: new Date().toISOString() })
}

/** Usuário optou por não usar PIN agora — grava a decisão para não
 * perguntar de novo a cada abertura, mas sem travar nada. */
export async function pularTrava() {
  await db.seguranca.put({ id: ID_SEGURANCA, pinHash: null, salt: null, atualizadoEm: new Date().toISOString() })
}

export async function conferirPin(pin) {
  const linha = await db.seguranca.get(ID_SEGURANCA)
  if (!linha?.pinHash || !linha?.salt) return false
  const hashDigitado = await derivarHash(pin, linha.salt)
  return hashDigitado === linha.pinHash
}

export async function trocarPin(pinAtual, pinNovo) {
  const ok = await conferirPin(pinAtual)
  if (!ok) return false
  await criarTrava(pinNovo)
  return true
}

/** Remover é uma DECISÃO de não usar PIN — mesmo estado final de
 * `pularTrava` (linha com `pinHash: null`), nunca apagar a linha: apagar
 * faria o app voltar a perguntar "criar PIN?" na próxima abertura, como
 * se ninguém tivesse decidido nada ainda. */
export async function removerTrava(pinAtual) {
  const ok = await conferirPin(pinAtual)
  if (!ok) return false
  await pularTrava()
  return true
}
