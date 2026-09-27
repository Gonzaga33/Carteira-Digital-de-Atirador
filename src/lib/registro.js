// Uma arma pode estar registrada em UM de dois sistemas federais
// diferentes — nunca nos dois ao mesmo tempo para a mesma unidade:
//
// - SIGMA/CRAF (Exército): acervo do CAC — Colecionador, Atirador e
//   Caçador — cadastrado no Sistema de Gerência Militar de Armas.
// - SINARM (Polícia Federal): acervo de CIDADÃO — posse/porte pessoal,
//   fora do CAC, cadastrado no Sistema Nacional de Armas.
//
// Os dois pedem exatamente o mesmo tipo de dado (um nº de registro
// principal, um nº de protocolo secundário, validade e o documento em
// foto/PDF) — só o rótulo e o órgão emissor mudam. Um lugar só decide os
// campos e os rótulos de cada sistema, para o formulário e o cartão nunca
// discordarem entre si.
export const SISTEMA_REGISTRO = {
  SIGMA_CRAF: 'sigma_craf',
  SINARM: 'sinarm',
}

export const SISTEMAS_REGISTRO = [
  {
    valor: SISTEMA_REGISTRO.SIGMA_CRAF,
    rotulo: 'SIGMA/CRAF — Exército (acervo CAC)',
    rotuloCurto: 'CAC · SIGMA/CRAF',
    orgao: 'Exército Brasileiro',
    campoNumero: 'numeroCraf',
    campoProtocolo: 'sigma',
    campoValidade: 'validadeCraf',
    campoUrl: 'urlCraf',
    rotuloNumero: 'Nº do CRAF',
    rotuloProtocolo: 'SIGMA',
    rotuloValidade: 'Validade do CRAF',
    rotuloDocumento: 'Foto ou PDF do CRAF',
    rotuloUpload: 'Enviar CRAF',
  },
  {
    valor: SISTEMA_REGISTRO.SINARM,
    rotulo: 'SINARM — Polícia Federal (acervo de cidadão)',
    rotuloCurto: 'Cidadão · SINARM',
    orgao: 'Polícia Federal',
    campoNumero: 'numeroSinarm',
    campoProtocolo: 'protocoloSinarm',
    campoValidade: 'validadeSinarm',
    campoUrl: 'urlSinarm',
    rotuloNumero: 'Nº de Registro (SINARM)',
    rotuloProtocolo: 'Nº do protocolo',
    rotuloValidade: 'Validade do registro SINARM',
    rotuloDocumento: 'Foto ou PDF do registro SINARM',
    rotuloUpload: 'Enviar registro SINARM',
  },
]

/** Registro antigo (de antes deste campo existir) não tem
 * `sistemaRegistro` gravado — cai no SIGMA/CRAF, que é o único sistema
 * que o app suportava até aqui. */
export function sistemaDoEquipamento(equipamento) {
  const valor = equipamento?.sistemaRegistro ?? SISTEMA_REGISTRO.SIGMA_CRAF
  return SISTEMAS_REGISTRO.find((s) => s.valor === valor) ?? SISTEMAS_REGISTRO[0]
}
