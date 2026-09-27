// Encolhe a foto no navegador ANTES de guardar no IndexedDB — celular
// tira foto de 4-8MB, e cada anexo (comprovante, CRAF, GT) multiplicado
// por dezenas de registros lotaria o armazenamento local rápido demais.
// PDF passa direto (não se redesenha PDF em canvas).
const LADO_MAXIMO = 1600
const QUALIDADE = 0.82

export async function arquivoParaDataUrl(arquivo) {
  if (!arquivo) return ''
  if (arquivo.type === 'application/pdf') {
    return lerComoDataUrl(arquivo)
  }
  if (!arquivo.type.startsWith('image/')) {
    return lerComoDataUrl(arquivo)
  }
  try {
    return await encolherImagem(arquivo)
  } catch {
    // Falhou o canvas (formato exótico, navegador antigo) — sobe o
    // original em vez de perder o anexo.
    return lerComoDataUrl(arquivo)
  }
}

function lerComoDataUrl(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onload = () => resolve(String(leitor.result || ''))
    leitor.onerror = () => reject(leitor.error)
    leitor.readAsDataURL(arquivo)
  })
}

async function encolherImagem(arquivo) {
  const original = await carregarImagem(arquivo)
  const maiorLado = Math.max(original.width, original.height)
  const fator = maiorLado > LADO_MAXIMO ? LADO_MAXIMO / maiorLado : 1

  const largura = Math.round(original.width * fator)
  const altura = Math.round(original.height * fator)

  const canvas = document.createElement('canvas')
  canvas.width = largura
  canvas.height = altura
  const ctx = canvas.getContext('2d')
  ctx.drawImage(original, 0, 0, largura, altura)

  const ehPng = arquivo.type === 'image/png'
  // PNG continua PNG (pode ter fundo transparente); o resto vira JPEG.
  return canvas.toDataURL(ehPng ? 'image/png' : 'image/jpeg', QUALIDADE)
}

function carregarImagem(arquivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (erro) => {
      URL.revokeObjectURL(url)
      reject(erro)
    }
    img.src = url
  })
}

export function ehPdf(dataUrl) {
  return typeof dataUrl === 'string' && dataUrl.startsWith('data:application/pdf')
}

export function ehImagem(dataUrl) {
  return typeof dataUrl === 'string' && dataUrl.startsWith('data:image')
}
