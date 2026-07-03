# Álbum de Figurinhas Copa Excelência — Plans.md

Criado em: 2026-07-02

Ver contrato de produto em [spec.md](spec.md). Precedência: `spec.md` > `Plans.md`.

---

## Phase 0: Diagnóstico e Fundação de Dados

| Task | Conteúdo | DoD | Depends | Status |
|------|------|-----|---------|--------|
| 0.1 | Auditar `Figurinhas Copa Excelencia/*.png` extraindo `numero` (ou par `numero1-numero2`) e `nome` do nome do arquivo; gerar relatório de gaps (números sem arquivo, 1 a ~162) | Relatório lista todo número sem figurinha correspondente e todo arquivo que não casa com o padrão `<n>- NOME` ou `<n1>-<n2>` `[tdd:skip:one-off-audit-script]` | - | cc:完了 |
| 0.2 | Escrever função `reconciliarFigurinhas()` em `codigo.gs`: varre a pasta do Drive de figurinhas, extrai número(s)+nome do nome do arquivo via regex, e grava/atualiza (idempotente, sem duplicar) as colunas `ID`, `Nome`, `Equipe`, `FileID` na aba `Figurinhas` | Rodar a função 2x seguidas não duplica linhas; toda figurinha da pasta aparece na aba com ID numérico correto `[tdd:required]` | 0.1 | cc:完了 |
| 0.3 | Adicionar item de menu "🧩 Reconciliar Figurinhas do Drive" no `onOpen()` chamando `reconciliarFigurinhas()` | Item aparece no menu da planilha e executa sem erro | 0.2 | cc:完了 |
| 0.4 | **(Redefinida após confirmação do usuário)** Adicionar constante `SLOTS_COMISSAO_TECNICA` (1-10) em `codigo.gs`, representando o pool GLOBAL de figurinhas colecionáveis por qualquer agência (soma-se ao pool próprio no sorteio do pacote — ver spec.md seção 6). `obterSlotsPorAgencia()` **não é alterada** para São Joaquim: confirmado que é 1 único login/PIN/pool (`"Pac São Joaquim"`, 11-28); a divisão em 2 arquivos de template é só de exibição (task 1.1/2.1) | Constante `SLOTS_COMISSAO_TECNICA` existe e é exportável/usável por outras funções; `obterSlotsPorAgencia()` permanece com a mesma chave única `"Pac São Joaquim"` (11-28) sem regressão `[tdd:required]` | 0.1 | cc:完了 |

---

## Phase 1: Slot Map Engine (coordenadas dos templates)

| Task | Conteúdo | DoD | Depends | Status |
|------|------|-----|---------|--------|
| 1.1 | Script offline (Python) que analisa cada PNG em `TEMPLATE - ALBUM/` (detecção dos retângulos brancos e círculos numerados via OCR/visão), e gera `slotMap.json` com `{ template: string, slots: [{numero, x, y, largura, altura}] }` para os 19 arquivos da pasta: 14 páginas `Pac *` de agência única, `Pac Sao Joaquim I.png`, `Pac Sao Joaquim Ii.png`, `Comissao Tecnica.png`, `Capa.png`, `Contra Capa.png`. Incluir também no artefato uma tabela `paginasPorAgencia` (agência de login → lista ordenada de nomes de template a exibir; 1 item para a maioria, `["Pac Sao Joaquim I", "Pac Sao Joaquim Ii"]` para São Joaquim) | `slotMap.json` gerado cobre 100% dos números visíveis nos templates (1-161, excluindo 162 que não existe); amostra de 5 slots checada manualmente bate com a posição visual no PNG; `paginasPorAgencia["Pac São Joaquim"]` tem exatamente 2 entradas cuja união de números é 11-28 | 0.1 | cc:完了 |
| 1.2 | Validar `slotMap.json` contra `obterSlotsPorAgencia()` + `SLOTS_COMISSAO_TECNICA` (codigo.gs, ajustada pela 0.4): todo número do pool de uma agência (próprio + Comissão Técnica) deve existir em algum template associado a ela via `paginasPorAgencia`; a união dos números das páginas de São Joaquim I+II deve bater exatamente com `obterSlotsPorAgencia("Pac São Joaquim")` | Script de validação roda sem reportar número órfão (presente em um lado, ausente no outro) `[tdd:required]` | 1.1, 0.4 | cc:完了 |
| 1.3 | Publicar `slotMap.json` como asset servido pelo WebApp (arquivo `.html` contendo `<script>const SLOT_MAP = {...}</script>` incluído via `HtmlService`, já que Apps Script não serve arquivos estáticos arbitrários) | `Album.html` consegue acessar `SLOT_MAP` no client sem chamada extra ao backend | 1.1 | cc:完了 |

---

## Phase 2: Motor visual do Álbum (fiel ao layout Canva)

| Task | Conteúdo | DoD | Depends | Status |
|------|------|-----|---------|--------|
| 2.1 | Reescrever `renderizarPaginaAtual()` em `Album.html` para usar o PNG do template como imagem de fundo de um contêiner com `aspect-ratio: 2000/1414`, removendo os cartões Tailwind genéricos de slot vazio. Suportar agência com múltiplas páginas de template em sequência via `paginasPorAgencia` (caso São Joaquim: 2 imagens, mesma agência/mesmo PIN) | Página do álbum exibe visualmente o template Canva original (cores, textos, marca) idêntico ao arquivo fonte; ao logar como São Joaquim, a navegação mostra as 2 páginas (I depois II) antes de passar para a próxima agência/Contra Capa; testado no navegador via preview | 1.3 | cc:完了 |
| 2.2 | Implementar overlay: para cada `numero` em `ESTADO.coladas`, posicionar `<img>` da figurinha (resolvida por número, não por nome) em `position: absolute` usando as coordenadas do `SLOT_MAP`, com `object-fit: cover` | Colar uma figurinha faz a imagem real aparecer pixel-alinhada ao retângulo do template; slot não colado não mostra nenhum overlay | 2.1 | cc:完了 |
| 2.3 | Trocar resolução de imagem de figurinha de fuzzy-match por nome para lookup direto por `numero` (chave `ID` da aba `Figurinhas`) em `obterFigurinhusDoAlbum` / `revelarCartas` / overlay do álbum. Reescrever `rasgarPacote()` para sortear do pool `obterSlotsPorAgencia(agencia) ∪ SLOTS_COMISSAO_TECNICA` (backend), não mais de `ESTADO.todasFigurinhas` derivado de Store_Gerente | Nenhuma chamada a `normalizarString` é usada para achar imagem de figurinha; busca é `figurinhasComImagem.find(f => f.id === numero)`; um pacote pode conter uma figurinha da Comissão Técnica (1-10) para qualquer agência | 0.2, 0.4, 2.2 | cc:完了 |
| 2.4 | Adicionar Capa e Contra Capa como primeira/última "página" navegável no fluxo de `mudarPagina`, e incluir a página `Comissao Tecnica` (slots 1-10) como página REGULAR e colecionável de toda agência logada (estado de colagem próprio daquela agência, alimentado pelo pool global — ver 2.3), exibida uma vez por sessão de agência (ex.: logo após a página própria da agência) | Ao chegar na última agência e avançar, mostra Contra Capa; ao voltar antes da primeira, mostra Capa; página da Comissão Técnica aparece exatamente uma vez por agência logada, com slots colados/vazios refletindo o `Coladas` daquela agência (não é uma página estática igual para todos) | 2.1 | cc:完了 |
| 2.5 | Testar no navegador (preview) o fluxo completo: login → navegar páginas (incl. Comissão Técnica e São Joaquim I/II) → abrir pacote → colar figurinha (própria e de Comissão Técnica) → conferir alinhamento visual em pelo menos 3 agências diferentes (incluindo São Joaquim e uma com slot panorâmico duplo) | Screenshots conferem alinhamento correto nas agências testadas, sem overlay deslocado `[tdd:skip:manual-visual-qa]` | 2.2, 2.3, 2.4 | cc:完了 |

---

## Phase 3: Abertura de Pacote — animação e identidade visual

| Task | Conteúdo | DoD | Depends | Status |
|------|------|-----|---------|--------|
| 3.1 | Restilizar `#modal-pacote` (embrulho fechado/aberto) usando paleta e elementos do Canva (laranja Cresol, faixa verde "COPA EXCELÊNCIA DE NEGÓCIOS", brasão), substituindo tema genérico dourado/estádio | Modal de abertura de pacote visualmente consistente com `Capa.png` (mesma paleta e brasão), validado por screenshot lado a lado | 2.1 | cc:完了 |
| 3.2 | Ajustar `revelarCartas()` para exibir a imagem final da figurinha (já pronta) sem sobrepor nome/número recriados em HTML, mantendo apenas o selo "REPETIDA" quando aplicável | Carta revelada mostra só a imagem PNG da figurinha + selo condicional de repetida, sem textos duplicados de nome/agência | 2.3, 3.1 | cc:完了 |
| 3.3 | Confirmar no navegador (preview) que a animação de rasgar/flip continua fluida com as novas imagens (12-13 cartas) sem travar | Abertura de um pacote de 13 figurinhas renderiza e anima sem erro no console `[tdd:skip:manual-visual-qa]` | 3.2 | cc:完了 |

---

## Phase 4: Distribuição semanal automática (sexta-feira até 28/08/2026)

| Task | Conteúdo | DoD | Depends | Status |
|------|------|-----|---------|--------|
| 4.1 | Criar função `configurarGatilhoSemanal()` que instala um trigger time-based (`onWeekDay(FRIDAY)`) chamando `distribuirPacotinhosPorAgencia(1)`, com guarda de data (`DATA_LIMITE = 2026-08-28`) que impede execução após essa data | Trigger instalado aparece em "Acionadores" do Apps Script; execução simulada após a data-limite não altera `Pacotinhos` `[tdd:required]` | 0.2 | cc:完了 |
| 4.2 | Adicionar item de menu "⏰ Ativar Liberação Semanal (Sexta-feira)" chamando `configurarGatilhoSemanal()`, e um item para remover o trigger (`removerGatilhoSemanal()`) | Menu ativa/remove o trigger sem duplicar acionadores ao rodar duas vezes | 4.1 | cc:完了 |
| 4.3 | Manter `distribuirUmPacote` / `distribuir5Pacotes` no menu como fallback manual, sem regressão | Botões manuais continuam funcionando após adicionar automação | 4.1 | cc:完了 |

---

## Phase 5: QA final e handoff

| Task | Conteúdo | DoD | Depends | Status |
|------|------|-----|---------|--------|
| 5.1 | Rodar `reconciliarFigurinhas()` uma vez no ambiente real e conferir contagem de figurinhas reconciliadas vs. total de arquivos na pasta do Drive | Contagem bate 1:1 (ou gaps documentados e reportados ao usuário) | 0.2, 1.1 | blocked |
| 5.2 | Checklist de aceite manual: login por PIN em pelo menos 3 agências (incl. São Joaquim), visual das páginas de agência (São Joaquim mostrando I e II em sequência) + Capa/Contracapa/Comissão Técnica (por agência), abertura de pacote com branding correto e chance de sair figurinha da Comissão Técnica, colagem de figurinha alinhada, e confirmação de que o trigger semanal está ativo | Checklist 100% marcado, sem item pendente `[tdd:skip:manual-acceptance]` | 2.5, 3.3, 4.2, 5.1 | blocked |

---

## Pendências bloqueadas (exigem ambiente real do Google Workspace)

As tasks 5.1 e 5.2 não podem ser executadas por mim: exigem a planilha real
"Copa Excelência", pastas reais do Drive e um deployment real do WebApp, que
não existem neste ambiente sandbox (só tenho os arquivos locais baixados).
Runbook para o usuário rodar isso:

1. Colar `codigo.gs`, `Album.html`, `Index.html` e `SlotMap.html` no editor
   do Apps Script vinculado à planilha real "Copa Excelência".
2. Fazer upload da pasta `Figurinhas Copa Excelencia/` e da pasta
   `TEMPLATE - ALBUM/` para pastas no Google Drive (podem ser 2 pastas
   separadas ou reaproveitar uma existente).
3. Preencher `FIGURINHAS_FOLDER_ID` e `TEMPLATES_FOLDER_ID` no topo do
   `codigo.gs` com os IDs reais dessas pastas do Drive.
4. Rodar pelo menu: **🧩 Reconciliar Figurinhas do Drive** e depois
   **🖼️ Reconciliar Templates do Drive**. Conferir a mensagem de resumo
   (criadas/atualizadas/não reconhecidos) — isso é a task 5.1.
5. Publicar um deployment de teste do WebApp (`doGet`) e rodar o checklist
   da task 5.2 manualmente (login por PIN, navegação de página, abertura de
   pacote, colagem de figurinha).
6. Rodar **⏰ Ativar Liberação Semanal (Sexta-feira)** pelo menu quando
   estiver pronto para começar a distribuição automática.

## ⚠️ Migração de dados: progresso salvo com o esquema antigo será perdido

O álbum antes desta mudança guardava `Inventario`/`Coladas` em `Store_Album`
como **strings de nome fuzzy** (ex.: `"pac porto uniao_elizandro
reisdorfer"`). A partir de agora esses campos guardam **números de slot**
(inteiros, 1-162). Se alguma agência já tiver progresso salvo com o esquema
antigo (visto pelo menos um caso real nos dados exportados da planilha), esse
progresso **não converte automaticamente** — não existe correspondência
estável entre "gerente X da agência Y" e o número fixo do slot no template.
Decisão recomendada: **zerar as colunas `Inventario` e `Coladas` de
`Store_Album`** antes de liberar o novo sistema (ninguém perde "pacotes"
comprados, só o conteúdo já colado/guardado precisa recomeçar do zero).
Avisar as agências afetadas antes de fazer isso.

## Notas de execução

- Este projeto não é um repositório git ainda; ao iniciar a implementação,
  considerar `git init` para rastrear as mudanças em `Album.html` / `codigo.gs`
  (perguntar ao usuário antes).
- `codigo.gs` tinha **três definições duplicadas** de `onOpen()` e duas de
  `validarLoginAlbum()`/`salvarProgressoAlbum()` (JS usa a última declarada) —
  já consolidado em uma única definição de cada durante a Fase 0.
- Testar sempre via Apps Script deployment de teste (`doGet`) antes de
  publicar nova versão do WebApp para as agências.
- `_test-harness.html` (agora em `apps-script/`) é um arquivo de teste local usado
  durante o desenvolvimento (mocka `google.script.run` com dados/imagens
  locais) — não faz parte do WebApp real e pode ser apagado ou mantido como
  ferramenta de QA futura.

---

## Fase 6: Correções pós-teste em produção (2026-07-03)

Encontradas pelo usuário ao rodar a task 5.1/5.2 no ambiente real.

| Task | Conteúdo | DoD | Status |
|------|------|-----|--------|
| 6.1 | Corrigir "Reconciliar Figurinhas do Drive" reportando 0 criadas/atualizadas com "arquivos não reconhecidos" batendo com nomes de TEMPLATE (`Capa.png`, `Comissao Tecnica.png`, `Pac *.png`) | Causa raiz não era bug de código: `FIGURINHAS_FOLDER_ID` estava apontando para a pasta de TEMPLATES em vez da pasta das figurinhas individuais — correção é o usuário trocar o ID pela pasta certa | cc:完了 (orientação dada ao usuário) |
| 6.2 | Corrigir página de template aparecendo em branco (fundo verde, sem imagem, sem mensagem de erro) após "Reconciliar Templates do Drive" ter rodado com sucesso | Causa raiz: arquivos do Drive não estavam compartilhados como "Qualquer pessoa com o link", então a URL `drive.google.com/uc?id=...` usada em `background-image`/`<img>` retornava a tela de permissão do Google em vez do PNG. Adicionada `garantirCompartilhamentoPublico()` em `codigo.gs`, chamada por `reconciliarFigurinhas()` e `reconciliarTemplates()` para cada arquivo processado `[tdd:required]` | cc:完了 |
| 6.3 | **(Mudança de escopo confirmada com o usuário)** Álbum deixa de ser "1 agência = 1 página própria" e passa a ser um álbum ÚNICO com as 15 agências + Comissão Técnica + Capa/Contracapa, igual para todos os logins (usuário: "Lages não vai preencher só a agência de Lages, vai preencher as outras 14 também") | `construirPaginasDoAlbum()` em `Album.html` lista todas as 15 agências (ordem alfabética das chaves de `paginasPorAgencia`) + Comissão Técnica, com a(s) página(s) da própria agência marcada (`propria: true`, rótulo "— SUA AGÊNCIA") e sendo a página inicial ao logar `[tdd:required]` | cc:完了 |
| 6.4 | Pool de sorteio do pacote passa a ser GLOBAL (todos os 161 números), não mais restrito à própria agência + Comissão Técnica — consequência direta da 6.3, confirmado com o usuário (opção "Pool global" nas 2 alternativas apresentadas) | `construirPoolGlobal()` substitui `construirPoolDaAgencia()` em `Album.html`, unindo os slots de todos os templates do `SLOT_MAP` `[tdd:required]` | cc:完了 |
| 6.5 | Reorganizar repositório: arquivos soltos na raiz movidos para `apps-script/` (fonte do WebApp: `.gs`+`.html`+`sheet.css`), `scripts/` (Python/PowerShell) e `docs/` (specs/relatórios); artefatos de sessão de outra ferramenta (`session.json`, `plans-state.json`, `*-notification.md` etc.) removidos do versionamento via `.gitignore` | Raiz do repo só tem `apps-script/`, `scripts/`, `docs/`, `slotMap.json` e configs de projeto (`.gitignore`); scripts Python voltam a resolver `../slotMap.json` e `../TEMPLATE - ALBUM/` corretamente (antes resolviam para fora do repo, pois assumiam viver em `scripts/`) | cc:完了 |

### Pendente pós Fase 6

- Rodar novamente **🧩 Reconciliar Figurinhas do Drive** com o `FIGURINHAS_FOLDER_ID` correto (task 6.1) e **🖼️ Reconciliar Templates do Drive** de novo (para aplicar o compartilhamento público retroativamente aos arquivos já reconciliados, task 6.2).
- Testar no navegador: login em pelo menos 2 agências diferentes e confirmar que a navegação mostra as 15 páginas de agência + Comissão Técnica + Capa/Contracapa, com a própria agência destacada, e que a imagem de fundo de cada template carrega.
- Colar o `codigo.gs` e os `.html` atualizados (agora em `apps-script/`) no editor do Apps Script, já que os arquivos-fonte se moveram de lugar no repositório (o conteúdo colado no Apps Script continua sendo o mesmo, só o caminho local mudou).
