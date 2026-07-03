# Álbum de Figurinhas Virtual — Copa Excelência Cresol — spec.md

Criado em: 2026-07-02

## 1. Visão geral do produto

Álbum de figurinhas virtual, acessado como Google Apps Script WebApp (`doGet` →
`Index.html` / `Album.html`), com Google Sheets como banco de dados e Google
Drive como repositório de imagens (figurinhas e templates de página).

Cada agência (cooperativa) tem:
- Um álbum próprio, com progresso isolado (`Store_Album`: Agencia, PIN,
  Pacotinhos, Inventario, Coladas).
- Acesso protegido por PIN numérico.
- Uma página dupla (spread) no álbum, correspondente a um arquivo de template
  `TEMPLATE - ALBUM/Pac <Agência>.png`.

## 2. Problema central (por que este spec existe)

O motor atual (`Album.html` + `codigo.gs`) desenha os slots do álbum com
cartões genéricos em Tailwind (cores verde/dourado, estilo "estádio"), **sem
nenhuma relação com o layout produzido pelo marketing no Canva**
(`TEMPLATE - ALBUM/*.png`). As figurinhas em si já são imagens finais prontas
(`Figurinhas Copa Excelencia/*.png`, com foto, nome, número e identidade
visual Cresol/Copa Excelência já aplicados pelo Canva) — o motor não deveria
redesenhar o cartão, apenas exibir a imagem pronta na posição certa.

Causa raiz identificada: o motor casa figurinha↔slot por **nome normalizado do
gerente** (fuzzy string match), o que é frágil. Tanto o template quanto o
arquivo da figurinha já trazem o **número do slot** (ex.: template mostra
círculo "104"; arquivo chama-se `104- ALANA SOFIA.png`). Esse número é a chave
de casamento correta e determinística.

## 3. Fonte de verdade visual: os templates Canva

- `TEMPLATE - ALBUM/Capa.png` e `Contra Capa.png`: capa/contracapa do álbum.
- `TEMPLATE - ALBUM/Pac <Agência>.png`: uma imagem por agência, contendo a
  página dupla (esquerda = identidade da agência/equipe; direita = grade de
  retângulos numerados, um por slot de figurinha). Todas com 2000×1414px.
- `TEMPLATE - ALBUM/Comissao Tecnica.png`: página especial, presente em TODOS
  os álbuns (uma por agência logada, com estado de colagem próprio), com
  slots numerados 01–10 (Técnicos 1–5, Aux. Técnicos 6–10). Ver seção 6 para
  o pool de sorteio.
- São Joaquim é grande e foi dividida pelo marketing em **duas páginas de
  template para exibição**: `Pac Sao Joaquim I.png` (slots 11–19) e
  `Pac Sao Joaquim Ii.png` (slots 20–28). Continua sendo **uma única
  agência/login/PIN/pool de pacotes** (11-28) — a divisão é só visual
  (2 imagens mostradas em sequência dentro da mesma sessão de agência), CONFIRMADO
  com o usuário. Não criar uma segunda linha em `Store_Album` para isso.
- Cada retângulo numerado no template é a posição exata onde a figurinha
  daquele número deve ser exibida quando colada. Em alguns pontos do
  template, dois retângulos vizinhos ficam colados sem espaçamento (sem
  relação com o conteúdo — é só densidade de layout do Canva); isso NÃO
  significa que os dois números compartilham uma imagem panorâmica.
  **A fonte de verdade de "estes dois números compartilham uma única
  imagem" é o PADRÃO DE NOME DO ARQUIVO da figurinha** (`<n1>-<n2>.png` /
  `<n1>_<n2>.png`, ex.: `35_36.png`, `101-102.png` — geralmente fachada de
  agência/estádio), não a geometria do template. Confirmado por contra-
  -exemplo real: no template, os slots 149 e 150 aparecem com retângulos
  colados (geometricamente parecem um par), mas os arquivos de figurinha
  são `150- JEAN GILBERTO.png` (individual) e `148-149.png` (par com o
  148, não com o 150) — pessoas diferentes, sem nenhuma relação entre 149
  e 150. O motor deve decidir se usa a técnica de recorte
  compartilhado (crop-sprite) **checando se os dois números apontam para
  o mesmo FileID na aba Figurinhas**, nunca pela adjacência geométrica no
  template.
- O motor **não redesenha** este layout — ele usa o PNG do template como
  fundo/base e sobrepõe a imagem da figurinha (já pronta) exatamente sobre o
  retângulo do número correspondente, quando aquele slot está colado. Slots
  não colados permanecem mostrando o retângulo vazio/numerado do próprio
  template (sem overlay).
- O slot **162 não existe** (confirmado — não haverá figurinha para esse
  número; não tratar como bug nem tentar gerar/buscar essa imagem).

## 4. Modelo de dados (Google Sheets)

### Aba `Figurinhas` (catálogo mestre de figurinhas)
Colunas: `ID` | `Nome` | `Equipe` | `FileID` | `Info`

Estado atual: `ID`/`Nome`/`Equipe` vêm vazios; só `FileID` (Drive) e `Info`
(nome da pessoa) estão preenchidos — quebra a leitura do motor.

Decisão de produto: os arquivos no Drive já seguem o padrão de nome
`<numero>- NOME DA PESSOA.png` (ou `<n1>-<n2>.png` para panorâmicas). O
`ID` de cada figurinha **é o número do slot** (inteiro). Uma rotina de
reconciliação (Apps Script) deve varrer a pasta do Drive, extrair
número + nome do nome do arquivo, e popular `ID`/`Nome`/`Equipe`/`FileID`
automaticamente na aba `Figurinhas`, usando `Info`/nome do arquivo como
fallback quando `Nome` já não teria sido preenchido manualmente. Rodar sob
demanda (menu) e de forma idempotente (pode rodar de novo sem duplicar).

### Aba `Store_Album` (estado por agência) — mantém como está
Colunas: `Agencia` | `PIN` | `Pacotinhos` | `Inventario` (JSON array de IDs de
slot) | `Coladas` (JSON array de IDs de slot).

### Mapa de slots por agência (novo artefato: `slotMap.json` ou aba de config)
Para cada template (`Pac <Agência>.png`, `Pac Sao Joaquim I.png`,
`Pac Sao Joaquim Ii.png`, `Comissao Tecnica.png`, `Capa`, `Contra Capa`), uma
lista de `{ numero, x, y, largura, altura, spread }` (coordenadas em % ou px
relativos às dimensões 2000×1414 do template), derivada automaticamente por
análise de imagem (detecção dos retângulos/círculos brancos numerados). Esse
mapa é gerado uma vez (script offline) e versionado como JSON estático
servido pelo WebApp — não recalculado em runtime.

O mapeamento agência → lista de números de slot (pool de PACOTES, não de
exibição) já existe em `codigo.gs:obterSlotsPorAgencia()` e **está correto
como está** — CONFIRMADO: São Joaquim continua com uma única chave
`"Pac São Joaquim"` (11–28), sem split. Este mapa não deve incluir uma chave
para a Comissão Técnica (ela não pertence a nenhuma agência); o pool da
Comissão Técnica é uma constante separada (`SLOTS_COMISSAO_TECNICA`, 1-10)
somada ao pool da agência apenas no momento do sorteio do pacote (ver seção
6). Separadamente, para fins de EXIBIÇÃO (não de pool), é preciso uma
associação agência → lista de arquivos de template a exibir em sequência
(1 arquivo para a maioria, 2 para São Joaquim) — cruzar com o slotMap para
coordenadas).

## 5. Motor do álbum (frontend)

- Cada AGÊNCIA (login/PIN) corresponde a uma ou mais PÁGINAS DE TEMPLATE.
  Regra geral: 1 agência → 1 arquivo de template (nome do arquivo == chave
  da agência). Exceção confirmada: **"Pac São Joaquim" é 1 único
  login/PIN/pool de pacotes (slots 11-28), mas exibido em SEQUÊNCIA através
  de 2 arquivos de template** (`Pac Sao Joaquim I.png` = 11-19,
  `Pac Sao Joaquim Ii.png` = 20-28). Isso é só uma questão de
  layout/paginação, não duas contas.
- Além da(s) página(s) da própria agência, **toda agência logada também
  tem uma página "Comissão Técnica"** (`Comissao Tecnica.png`, slots 1-10),
  com estado de colagem próprio daquela agência (ver seção 6).
- Cada página do álbum é renderizada com o PNG do template como imagem de
  fundo (posicionado em um contêiner com aspect-ratio 2000:1414), sem
  recriar bordas/números/textos via CSS.
- Para cada slot colado, um `<img>` da figurinha correspondente (arquivo já
  pronto do Drive) é posicionado em absoluto sobre as coordenadas daquele
  número, com `object-fit: cover` ajustado ao retângulo do template.
- Slots não colados: nenhum overlay — o próprio template já exibe o
  retângulo vazio numerado.
- Capa e Contra Capa entram como primeira/última "página" da navegação.
- Resolução de imagem da figurinha passa a ser por **número do slot**
  (chave determinística), não mais por fuzzy match de nome.

## 6. Abertura de pacote (mecânica e visual)

- Pacotes contêm 12 a 13 figurinhas — manter essa faixa.
- Sorteio restrito à UNIÃO de dois pools: o pool de números de slot da
  própria agência (`obterSlotsPorAgencia`, ex.: 29-41 para Pac Canoinhas) e
  o **pool global "Comissão Técnica"** (slots 1-10, constante
  `SLOTS_COMISSAO_TECNICA`), que é o mesmo para todas as agências — qualquer
  agência pode tirar uma figurinha da Comissão Técnica de um pacote seu.
  Inclui repetidas (dentro de cada pool).
- `obterSlotsPorAgencia()` **não muda** para "Pac São Joaquim" (já está
  correto: uma única chave, 11-28) — a Comissão Técnica **não** é uma chave
  desse mapa (não é "dona" de nenhuma agência); ela é somada como pool
  adicional no momento do sorteio.
- Estado de colagem (`Coladas`) de cada agência inclui tanto os números da
  sua própria página quanto os da Comissão Técnica que ela já colou — cada
  agência coleciona a Comissão Técnica de forma independente (não é um
  progresso compartilhado entre agências, só o *pool de sorteio* é
  compartilhado).
- Visual da animação de abertura (embrulho fechado, texto, cores) deve usar
  a identidade visual dos templates Canva (laranja Cresol, faixa verde,
  brasão "COPA EXCELÊNCIA DE NEGÓCIOS"), substituindo o tema
  genérico verde/dourado "estádio" atual.
- Cartas reveladas mostram a imagem real e final da figurinha (a arte já
  inclui nome/número/foto) — sem recriar esses elementos em HTML.

## 7. Distribuição semanal automática

- Pacotes são liberados toda sexta-feira, 1 por agência, começando na
  primeira sexta a partir do lançamento e terminando na última sexta-feira de
  agosto de 2026 (2026-08-28).
- Implementado via *installable trigger* time-driven do Apps Script
  (`ScriptApp.newTrigger(...).timeBased().onWeekDay(ScriptApp.WeekDay.FRIDAY)`),
  chamando `distribuirPacotinhosPorAgencia(1)`.
- O trigger deve verificar a data atual e não incrementar pacotes após
  2026-08-28 (guarda de data configurável em uma constante).
- Mantém o menu manual (`distribuirUmPacote`, `distribuir5Pacotes`) como
  fallback/teste, sem removê-lo.

## 8. Fora de escopo deste spec

- Redesenho do dashboard Qlik/`Index.html` fora do fluxo do álbum.
- Qualquer mudança na fonte dos dados de desempenho (Store_Gerente,
  Store_Carteira, Store_Cooperativa) além do necessário para casar
  agência↔slots.
