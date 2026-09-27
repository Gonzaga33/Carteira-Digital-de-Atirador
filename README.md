# Carteira Digital de Atirador

PWA offline-first para o atirador — Colecionador, Atirador e Caçador (CAC)
ou cidadão com posse/porte pessoal: carteira de documentos (CR + filiação
ao clube), equipamentos registrados no **SIGMA/CRAF (Exército — acervo
CAC)** ou no **SINARM (Polícia Federal — acervo de cidadão)** com Guias de
Tráfego agrupadas, semáforo de validade, registro de habitualidades,
painel de metas de Nível e controle de cotas anuais de insumos.

## Stack

React 19 · Vite · Tailwind CSS v4 · Dexie.js (IndexedDB) · lucide-react ·
vite-plugin-pwa (service worker + manifest).

Tudo roda **100% no aparelho**: os dados ficam no IndexedDB do navegador,
nunca saem para servidor nenhum. Depois da primeira abertura (que instala o
service worker), o app funciona sem internet.

## Rodando localmente

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ com service worker e manifest
npm run preview   # serve o build de produção
npm run lint      # oxlint
```

## Estrutura

- `src/db/` — schema do Dexie (`db.js`) e os dados de exemplo da primeira
  abertura (`seed.js`).
- `src/lib/` — regras puras, sem React: datas (`data.js`), semáforo de
  validade (`semaforo.js`), metas de nível (`niveis.js`), encolhimento de
  imagem antes de guardar (`imagem.js`) e backup/restauração (`backup.js`).
- `src/hooks/` — acesso reativo ao banco via `dexie-react-hooks`, um
  arquivo por tabela/domínio.
- `src/components/` — uma pasta por tela (`carteira`, `equipamentos`,
  `habitualidades`, `niveis`, `insumos`, `layout`) mais `common/` com as
  peças reaproveitadas em todas (selo de validade, modal de documento,
  barra de progresso, formulário em folha inferior, confirmação de
  exclusão).

## Segurança e sigilo

Dado de arma é dado sensível — a proteção do app tem dois lados:

- **Nenhum servidor.** Tudo fica só no IndexedDB do aparelho. Zero chamada
  de rede para qualquer lugar (nem analytics) — conferido no código.
- **Trava por PIN** (`src/lib/seguranca.js` + `src/components/seguranca/`).
  Pede um PIN de 4 a 6 dígitos para abrir o app, e trava sozinho de novo
  sempre que o app sai de foco (troca de app, tela apagada). O hash do PIN
  usa PBKDF2-SHA256 (WebCrypto nativo, 150 mil iterações, salt próprio por
  instalação) — o PIN em si nunca é gravado.
  **De propósito, não existe "esqueci o PIN" dentro do app** — um botão
  desses na própria tela de bloqueio anularia a proteção contra quem pega o
  celular. **Isto é uma trava de TELA, não criptografia do banco**: quem
  abrir o DevTools do navegador ainda lê o IndexedDB direto. Essa troca foi
  deliberada, para nunca correr o risco de perder os dados por esquecer uma
  senha (não existe recuperação possível sem servidor). Esqueceu o PIN
  mesmo assim? O único caminho é limpar os dados deste site/app pelas
  configurações do navegador/celular — isso apaga só a carteira, nunca o
  resto do aparelho.
- **Ícone e nome discretos na tela inicial.** O que aparece no celular
  antes de abrir o app (ícone, nome instalado, título na troca de apps) é
  neutro — "Documentos", com um ícone de pasta — não revela posse de arma a
  quem olhar o celular de relance. O nome completo ("Carteira Atirador")
  só aparece DEPOIS de abrir (e desbloquear, se o PIN estiver ativo) — ver
  `index.html`, `vite.config.js` (manifest) e `Cabecalho.jsx`.

## Backup

Tudo fica só no aparelho — não existe conta nem servidor. Em **Ajustes**
(ícone de engrenagem no topo) dá para baixar um `.json` com tudo e
restaurar depois, inclusive em outro aparelho. **O arquivo de backup NÃO é
criptografado** — apague-o de onde salvar assim que não precisar mais, e
nunca o compartilhe.

## Sistema de registro da arma (SIGMA/CRAF ou SINARM)

Cada arma cadastrada declara em qual sistema federal ela está registrada
— nunca nos dois ao mesmo tempo:

- **SIGMA/CRAF (Exército)** — acervo do CAC (Colecionador, Atirador e
  Caçador). Campos: Nº do CRAF, SIGMA, validade e o documento.
- **SINARM (Polícia Federal)** — acervo de **cidadão**, posse ou porte
  pessoal fora do CAC. Campos espelhados: Nº de Registro (SINARM), Nº do
  protocolo, validade e o documento.

O formulário troca os rótulos sozinho conforme o sistema escolhido; o
cartão da arma mostra um selo (`CAC · SIGMA/CRAF` ou `Cidadão · SINARM`) e
o semáforo de validade lê sempre o campo do sistema certo. A Guia de
Tráfego continua sendo a mesma para os dois sistemas — ela vale para
qualquer arma registrada, independente de quem emitiu o registro.

### Validade indeterminada

Agente de segurança pública tem, por norma, validade **indeterminada** no
SINARM (acervo de cidadão) — sem data de vencimento nenhuma. O campo de
validade tem um checkbox "Validade indeterminada"; marcado, a data some do
formulário e o selo mostra "Validade indeterminada — sem vencimento", numa
cor própria (azul), nunca como alerta (vermelho/amarelo) nem como "sem
data cadastrada" (que continua significando campo esquecido, um alerta de
verdade). **O CR não tem essa opção** — validade do CR não muda por
profissão.

## Semáforo de validade

- 🟢 Verde: mais de 60 dias para vencer.
- 🟡 Amarelo: 1 a 60 dias.
- 🔴 Vermelho: vencido (inclusive no dia do vencimento).
- 🔵 Azul: validade indeterminada (marcada manualmente, quando a norma
  dispensa de vencimento — só disponível no registro da arma).

## Metas de Nível CAC

Contadas por ano-calendário, a partir das habitualidades registradas:

| Nível | Habitualidades | Competições |
|---|---|---|
| 1 | 8 | — |
| 2 | 12 | 2 |
| 3 | 20 | 6 |
