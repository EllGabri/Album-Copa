# Relatório de Auditoria — Figurinhas Copa Excelência

Gerado automaticamente pela task 0.1 (Plans.md) via `scripts/audit-figurinhas.ps1`.

## Resumo

- Arquivos encontrados em `Figurinhas Copa Excelencia/`: **131**
- Arquivos parseados com sucesso: **131**
- Arquivos que não casaram com nenhum padrão conhecido: **0**
- Números de slot únicos cobertos por arquivo: **161**
- Números esperados (Comissão Técnica 1-10 + slots de agência): **162**
- Números esperados SEM arquivo correspondente: **1** (1 confirmado(s) como sem figurinha, 0 gap(s) real(is))
- Números com arquivo mas fora do mapeamento conhecido: **0**
- Números cobertos por mais de um arquivo (duplicados): **0**

## 1. Arquivos que não casam com o padrão `<n>- NOME` / `<n1>-<n2>`

Nenhum. Todos os arquivos casaram com um padrão reconhecido.

## 2. Números esperados sem figurinha correspondente

Nenhum gap real. Todos os números esperados têm arquivo, exceto os confirmados abaixo.

> Confirmado pelo usuário como sem figurinha (não é bug, não gerar essa figurinha):
> 162.

## 3. Números com arquivo mas fora do mapeamento conhecido

Nenhum. Todo arquivo encontrado corresponde a um número esperado (Comissão Técnica 1-10 ou slot de agência).

## 4. Números cobertos por mais de um arquivo (possível duplicidade)

Nenhum.

## 5. Pendência conhecida em `codigo.gs` (não bloqueia esta task)

`obterSlotsPorAgencia()` em `codigo.gs` ainda está desatualizado frente aos templates
reais confirmados nesta auditoria:

- Tem uma única chave `Pac São Joaquim` (11-28), mas o Canva divide em duas páginas:
  `Pac Sao Joaquim I` (11-19) e `Pac Sao Joaquim Ii` (20-28).
- Não tem nenhuma chave para `Comissao Tecnica` (01-10 - Técnicos 1-5, Aux. Técnicos 6-10).

Corrigido no mapeamento de referência deste script (task 0.1); a correção equivalente em
`codigo.gs` fica registrada como task 0.4 no Plans.md.

## 6. Todos os números por arquivo (referência completa)

| Arquivo | Tipo | Número(s) | Nome extraído |
|---|---|---|---|
| `1.png` | unico-sem-nome | 1 | - |
| `2.png` | unico-sem-nome | 2 | - |
| `3.png` | unico-sem-nome | 3 | - |
| `4.png` | unico-sem-nome | 4 | - |
| `5.png` | unico-sem-nome | 5 | - |
| `6.png` | unico-sem-nome | 6 | - |
| `7.png` | unico-sem-nome | 7 | - |
| `8.png` | unico-sem-nome | 8 | - |
| `9.png` | unico-sem-nome | 9 | - |
| `10.png` | unico-sem-nome | 10 | - |
| `Cópia de 11- ALINE DE LIMA.png` | unico-com-nome | 11 | ALINE DE LIMA |
| `Cópia de 12- ANDRIGO.png` | unico-com-nome | 12 | ANDRIGO |
| `Cópia de 13- PATRICIA.png` | unico-com-nome | 13 | PATRICIA |
| `Cópia de 14- MATHEUS.png` | unico-com-nome | 14 | MATHEUS |
| `Cópia de 15-  NATHALLY.png` | unico-com-nome | 15 | NATHALLY |
| `Cópia de 16- LETICIA FERREIRA.png` | unico-com-nome | 16 | LETICIA FERREIRA |
| `Cópia de 17- JORGE DO AMARAL.png` | unico-com-nome | 17 | JORGE DO AMARAL |
| `Cópia de 18- FABIANA PEREIRA.png` | unico-com-nome | 18 | FABIANA PEREIRA |
| `Cópia de 19- DALVIANI.png` | unico-com-nome | 19 | DALVIANI |
| `Cópia de 20- DENISIA.png` | unico-com-nome | 20 | DENISIA |
| `Cópia de 21- CARLOS FILIPE.png` | unico-com-nome | 21 | CARLOS FILIPE |
| `Cópia de 22- THIAGO PEREIRA.png` | unico-com-nome | 22 | THIAGO PEREIRA |
| `Cópia de 23-SUELLEN VITORIA.png` | unico-com-nome | 23 | SUELLEN VITORIA |
| `Cópia de 24- SAMARA BORGES.png` | unico-com-nome | 24 | SAMARA BORGES |
| `Cópia de 25_26.png` | par | 25, 26 | - |
| `Cópia de 27_28.png` | par | 27, 28 | - |
| `Cópia de 29- ANDRIELE.png` | unico-com-nome | 29 | ANDRIELE |
| `Cópia de 30- JULIANA NUNES.png` | unico-com-nome | 30 | JULIANA NUNES |
| `Cópia de 31- EVELIN PRISCILA.png` | unico-com-nome | 31 | EVELIN PRISCILA |
| `Cópia de 32- LUIS GUSTAVO DE SOUZA.png` | unico-com-nome | 32 | LUIS GUSTAVO DE SOUZA |
| `Cópia de 33- VICTOR PZIVITOVSKI.png` | unico-com-nome | 33 | VICTOR PZIVITOVSKI |
| `Cópia de 34- RAISSA.png` | unico-com-nome | 34 | RAISSA |
| `Cópia de 35_36.png` | par | 35, 36 | - |
| `Cópia de 37_38.png` | par | 37, 38 | - |
| `39- MARIA SILVANA.png` | unico-com-nome | 39 | MARIA SILVANA |
| `40- FERNANDA FERNANDES.png` | unico-com-nome | 40 | FERNANDA FERNANDES |
| `Cópia de 41- CRISTIANE.png` | unico-com-nome | 41 | CRISTIANE |
| `Cópia de 42-DAYANE.png` | unico-com-nome | 42 | DAYANE |
| `Cópia de 43- JOICE.png` | unico-com-nome | 43 | JOICE |
| `Cópia de 44- GRAZIELA.png` | unico-com-nome | 44 | GRAZIELA |
| `Cópia de 45- HENRIQUE ZABOT.png` | unico-com-nome | 45 | HENRIQUE ZABOT |
| `Cópia de 46- VITOR LEITE.png` | unico-com-nome | 46 | VITOR LEITE |
| `Cópia de 47_48.png` | par | 47, 48 | - |
| `Cópia de 49_50.png` | par | 49, 50 | - |
| `Cópia de 51- ANDREZA.png` | unico-com-nome | 51 | ANDREZA |
| `Cópia de 52- CHRIS.png` | unico-com-nome | 52 | CHRIS |
| `Cópia de 53- DAIANE.png` | unico-com-nome | 53 | DAIANE |
| `Cópia de 54- GABRIEL NUNES.png` | unico-com-nome | 54 | GABRIEL NUNES |
| `Cópia de 55- LUIZ GUSTAVO.png` | unico-com-nome | 55 | LUIZ GUSTAVO |
| `Cópia de 56- LUANA ANTUNES.png` | unico-com-nome | 56 | LUANA ANTUNES |
| `Cópia de 57- NICOLAS AMARANTE.png` | unico-com-nome | 57 | NICOLAS AMARANTE |
| `Cópia de 58_59.png` | par | 58, 59 | - |
| `Cópia de 60_61.png` | par | 60, 61 | - |
| `Cópia de 62- EDINA DOS SANTOS.png` | unico-com-nome | 62 | EDINA DOS SANTOS |
| `Cópia de 63- ELIZANDRO.png` | unico-com-nome | 63 | ELIZANDRO |
| `Cópia de 64 FERNANDO RABELO.png` | unico-com-nome | 64 | FERNANDO RABELO |
| `Cópia de 65- HEMERSON.png` | unico-com-nome | 65 | HEMERSON |
| `Cópia de 66-MAURA.png` | unico-com-nome | 66 | MAURA |
| `Cópia de 67- NEDIVAN.png` | unico-com-nome | 67 | NEDIVAN |
| `Cópia de 68-69.png` | par | 68, 69 | - |
| `Cópia de 70-71.png` | par | 70, 71 | - |
| `Cópia de 72- ALESSANDRA COSTA.png` | unico-com-nome | 72 | ALESSANDRA COSTA |
| `Cópia de 73- BEATRIZ FRONZA.png` | unico-com-nome | 73 | BEATRIZ FRONZA |
| `Cópia de 74- BRUNA DIAS.png` | unico-com-nome | 74 | BRUNA DIAS |
| `Cópia de 75- BRUNA CRUZ.png` | unico-com-nome | 75 | BRUNA CRUZ |
| `Cópia de 76- EDSON ESPINDOLA.png` | unico-com-nome | 76 | EDSON ESPINDOLA |
| `Cópia de 77- GILMARA COSTA.png` | unico-com-nome | 77 | GILMARA COSTA |
| `Cópia de 78- GUILHERME ZANATTA.png` | unico-com-nome | 78 | GUILHERME ZANATTA |
| `Cópia de 79-80.png` | par | 79, 80 | - |
| `Cópia de 81-82.png` | par | 81, 82 | - |
| `Cópia de 83- ALINE CLAUDINO.png` | unico-com-nome | 83 | ALINE CLAUDINO |
| `Cópia de 84- DIEINE.png` | unico-com-nome | 84 | DIEINE |
| `Cópia de 85-KATRIELE.png` | unico-com-nome | 85 | KATRIELE |
| `Cópia de 86- KEMILY.png` | unico-com-nome | 86 | KEMILY |
| `Cópia de 87- VIVIANE.png` | unico-com-nome | 87 | VIVIANE |
| `Cópia de 88-89.png` | par | 88, 89 | - |
| `Cópia de 90-91.png` | par | 90, 91 | - |
| `Cópia de 92- CHAIANE.png` | unico-com-nome | 92 | CHAIANE |
| `Cópia de 93- DIENIQUELI.png` | unico-com-nome | 93 | DIENIQUELI |
| `Cópia de 94- EDINAN.png` | unico-com-nome | 94 | EDINAN |
| `Cópia de 95- ELAINE MOISSA.png` | unico-com-nome | 95 | ELAINE MOISSA |
| `Cópia de 96- LETICIA HALABURA.png` | unico-com-nome | 96 | LETICIA HALABURA |
| `Cópia de 97- MARIA SALETE.png` | unico-com-nome | 97 | MARIA SALETE |
| `Cópia de 98- LUKAS.png` | unico-com-nome | 98 | LUKAS |
| `Cópia de 99-100.png` | par | 99, 100 | - |
| `Cópia de 101-102.png` | par | 101, 102 | - |
| `Cópia de 103- TAIS FERNANDA.png` | unico-com-nome | 103 | TAIS FERNANDA |
| `Cópia de 104- ALANA SOFIA.png` | unico-com-nome | 104 | ALANA SOFIA |
| `Cópia de 105- CARLA ANDRESSA.png` | unico-com-nome | 105 | CARLA ANDRESSA |
| `Cópia de 106- DANIELI CHUPEL.png` | unico-com-nome | 106 | DANIELI CHUPEL |
| `Cópia de 107- ZANDRIELI.png` | unico-com-nome | 107 | ZANDRIELI |
| `Cópia de 108- LUCIMARA AP.png` | unico-com-nome | 108 | LUCIMARA AP |
| `Cópia de 109- LEONARDO MARON.png` | unico-com-nome | 109 | LEONARDO MARON |
| `Cópia de 110-111.png` | par | 110, 111 | - |
| `Cópia de 112-113.png` | par | 112, 113 | - |
| `Cópia de 114- LUAN.png` | unico-com-nome | 114 | LUAN |
| `Cópia de 115- CAMILA GUIZONI.png` | unico-com-nome | 115 | CAMILA GUIZONI |
| `Cópia de 116-ALINE MARTENDAL.png` | unico-com-nome | 116 | ALINE MARTENDAL |
| `Cópia de 117-118.png` | par | 117, 118 | - |
| `Cópia de 119-120.png` | par | 119, 120 | - |
| `Cópia de 121- MAIC SANDRO.png` | unico-com-nome | 121 | MAIC SANDRO |
| `Cópia de 122- PAULO MAIDEL.png` | unico-com-nome | 122 | PAULO MAIDEL |
| `Cópia de 123- NATHALIA MASSANEIRO.png` | unico-com-nome | 123 | NATHALIA MASSANEIRO |
| `Cópia de 124- MAYARA.png` | unico-com-nome | 124 | MAYARA |
| `Cópia de 125-126.png` | par | 125, 126 | - |
| `Cópia de 127-128.png` | par | 127, 128 | - |
| `Cópia de 129-130.png` | par | 129, 130 | - |
| `Cópia de 131-132.png` | par | 131, 132 | - |
| `Cópia de 133- LUAN DE MELLO.png` | unico-com-nome | 133 | LUAN DE MELLO |
| `Cópia de 134- MILENA FERNANDES.png` | unico-com-nome | 134 | MILENA FERNANDES |
| `Cópia de 135- RAWÃ.png` | unico-com-nome | 135 | RAWÃ |
| `Cópia de 136- TIAGO HUMOCHINSKI.png` | unico-com-nome | 136 | TIAGO HUMOCHINSKI |
| `Cópia de 137- VITORIA AMANDA.png` | unico-com-nome | 137 | VITORIA AMANDA |
| `Cópia de 138- MAIKON MORAES.png` | unico-com-nome | 138 | MAIKON MORAES |
| `Cópia de 139- MARCIA REGINA.png` | unico-com-nome | 139 | MARCIA REGINA |
| `Cópia de 140- JESSICA CRISTINA.png` | unico-com-nome | 140 | JESSICA CRISTINA |
| `Cópia de 141- CRISTIANE  CORREA.png` | unico-com-nome | 141 | CRISTIANE  CORREA |
| `Cópia de 142-143.png` | par | 142, 143 | - |
| `Cópia de 144-145.png` | par | 144, 145 | - |
| `Cópia de 146-147.png` | par | 146, 147 | - |
| `Cópia de 148-149.png` | par | 148, 149 | - |
| `Cópia de 150- JEAN GILBERTO.png` | unico-com-nome | 150 | JEAN GILBERTO |
| `Cópia de 151- SUELLEN DO PRADO.png` | unico-com-nome | 151 | SUELLEN DO PRADO |
| `Cópia de 152- WILLIAN RODRIGO.png` | unico-com-nome | 152 | WILLIAN RODRIGO |
| `Cópia de 153- THAMIRIS.png` | unico-com-nome | 153 | THAMIRIS |
| `Cópia de 154- GUILHERME DRANKA.png` | unico-com-nome | 154 | GUILHERME DRANKA |
| `Cópia de 155-156.png` | par | 155, 156 | - |
| `Cópia de 157-158.png` | par | 157, 158 | - |
| `Cópia de 159- JAMES NALON.png` | unico-com-nome | 159 | JAMES NALON |
| `Cópia de 160- CARLA EDUARDA.png` | unico-com-nome | 160 | CARLA EDUARDA |
| `Cópia de 161- CLEONICE.png` | unico-com-nome | 161 | CLEONICE |

