// Abrir o seletor de arquivo/câmera nativo do celular ESCONDE a página por
// um instante (document.hidden vira true) — em qualquer navegador móvel, é
// assim que o sistema mostra a tela de escolher foto/arquivo por cima do
// app. Sem isto, o re-bloqueio por PIN (Inicializador.jsx) interpretava
// esse instante como "o usuário saiu do app" e travava a tela DE VOLTA no
// meio de qualquer envio de foto — CR, CRAF/SINARM, GT, comprovante de
// habitualidade e o próprio "Restaurar de um backup" ficavam impossíveis
// de terminar com o PIN ativo: a cada arquivo escolhido, a sessão perdia o
// que estava fazendo e caía na tela de PIN de novo.
//
// A marca dura só até o PRÓXIMO esconder-e-voltar (por isso "consumir" —
// lida uma vez, apaga sozinha) e expira sozinha depois de um tempo, para
// nunca ficar "sempre permitido" caso o evento de voltar nunca chegue.
let pickerAberto = false
let expiraEm = 0

export function marcarPickerAberto() {
  pickerAberto = true
  expiraEm = Date.now() + 120000
}

export function consumirPickerAberto() {
  const valia = pickerAberto && Date.now() < expiraEm
  pickerAberto = false
  return valia
}
