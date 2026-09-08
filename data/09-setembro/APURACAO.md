# Apuração Final — Copa Excelência 2026

Período apurado: **junho, julho e agosto de 2026**. Base extraída em 06/09/2026 (`dt_base`).
Setembro em diante foi excluído; julho conta com o multiplicador 1,5x da fase "Mata-Mata".

## Classificação geral de agências

| # | Agência | Grupo | Gols |
|---:|---|:---:|---:|
| 1 | São Joaquim | 1 | 28.956 |
| 2 | Irineópolis | 2 | 13.820 |
| 3 | Otacílio Costa | 2 | 12.024 |
| 4 | Monte Castelo | 3 | 11.100 |
| 5 | Major Vieira | 2 | 10.585 |
| 6 | Canoinhas | 1 | 9.034 |
| 7 | Lages | 1 | 7.688 |
| 8 | Bom Jardim Da Serra | 3 | 7.006 |
| 9 | Lages II | 1 | 6.941 |
| 10 | Porto União | 1 | 6.070 |
| 11 | Bela Vista Do Toldo | 3 | 4.828 |
| 12 | Correia Pinto | 2 | 4.529 |
| 13 | Ponte Alta | 3 | 3.568 |
| 14 | Santa Cruz Do Timbo | 3 | 3.077 |
| 15 | Timbó Grande | 3 | 2.513 |

## Pódio por grupo

### Grupo 1

| # | Agência | Gols |
|---:|---|---:|
| 1 | São Joaquim | 28.956 |
| 2 | Canoinhas | 9.034 |
| 3 | Lages | 7.688 |
| 4 | Lages II | 6.941 |
| 5 | Porto União | 6.070 |

### Grupo 2

| # | Agência | Gols |
|---:|---|---:|
| 1 | Irineópolis | 13.820 |
| 2 | Otacílio Costa | 12.024 |
| 3 | Major Vieira | 10.585 |
| 4 | Correia Pinto | 4.529 |

### Grupo 3

| # | Agência | Gols |
|---:|---|---:|
| 1 | Monte Castelo | 11.100 |
| 2 | Bom Jardim Da Serra | 7.006 |
| 3 | Bela Vista Do Toldo | 4.828 |
| 4 | Ponte Alta | 3.568 |
| 5 | Santa Cruz Do Timbo | 3.077 |
| 6 | Timbó Grande | 2.513 |

## Artilheiros — geral (top 10)

| # | Colaborador | Agência | Gols |
|---:|---|---|---:|
| 1 | Patricia Aparecida Borges Da Silva | São Joaquim | 10.207 |
| 2 | Edinan Ederson Lohse | Irineópolis | 9.854 |
| 3 | Rawa Felipe Dos Reis | Monte Castelo | 8.278 |
| 4 | Dalviani Oliveira Carvalho | São Joaquim | 7.162 |
| 5 | Camila Guizoni | Bom Jardim Da Serra | 7.006 |
| 6 | Vitor De Carvalho Leite | Lages II | 6.941 |
| 7 | Danieli Chupel Veiga | Major Vieira | 4.866 |
| 8 | Andriele Leite | Canoinhas | 4.388 |
| 9 | Guilherme Zanatta De Souza | Otacílio Costa | 4.222 |
| 10 | Maura Aline Perizzolo | Porto União | 4.039 |

## Artilheiros por grupo (Chuteira de Ouro)

### Grupo 1

| # | Colaborador | Agência | Gols |
|---:|---|---|---:|
| 1 | Patricia Aparecida Borges Da Silva | São Joaquim | 10.207 |
| 2 | Dalviani Oliveira Carvalho | São Joaquim | 7.162 |
| 3 | Vitor De Carvalho Leite | Lages II | 6.941 |

### Grupo 2

| # | Colaborador | Agência | Gols |
|---:|---|---|---:|
| 1 | Edinan Ederson Lohse | Irineópolis | 9.854 |
| 2 | Danieli Chupel Veiga | Major Vieira | 4.866 |
| 3 | Guilherme Zanatta De Souza | Otacílio Costa | 4.222 |

### Grupo 3

| # | Colaborador | Agência | Gols |
|---:|---|---|---:|
| 1 | Rawa Felipe Dos Reis | Monte Castelo | 8.278 |
| 2 | Camila Guizoni | Bom Jardim Da Serra | 7.006 |
| 3 | Cleonice Vergutz | Santa Cruz Do Timbo | 3.077 |

---

## Ressalvas — pontos que dependem da sua decisão

Os números acima saem da lógica que o dashboard usa hoje. Três pontos ficaram em aberto
e podem mexer no resultado; nenhum foi alterado por conta própria.

### 1. `Outros_indicadores` não tem coluna de período

Essa aba entra no placar com **3.955 gols** (Adquirência ×3, Cartões ×1, Seguros ×4/×2),
mas traz apenas totais acumulados por colaborador — **não há mês/ano**. Como a base foi
atualizada até 06/09, esses totais **incluem setembro** e não há como separar.
É a única parte da apuração que a janela jun–ago não consegue limpar.

Para resolver de verdade, a aba precisaria de uma coluna de período.

### 2. Cartão parece contar duas vezes

- `Store_Gerente`, indicador **Cartão**: 1.418 gols no período
- `Outros_indicadores`, coluna **Cartões Emitidos**: 269 gols

**41 dos 41 colaboradores aparecem nas duas fontes.** São medidas diferentes do mesmo
produto (a do Store é variação líquida — chega a ser negativa; a de Outros é bruta de
cartões emitidos), e hoje as duas somam no mesmo placar.

### 3. Ativo Comercial: dashboard e planilha divergem

Para a Cleonice, por exemplo, a aba `Resumo_Gerentes` registra **3** gols de Ativo
Comercial; o dashboard calcula **103** (30+35+38, a quantidade realizada em cada mês).

A planilha conta *meses com movimento*; o dashboard soma a *quantidade*, que é o que a
regra escrita diz ("a cada 1 Ativo Comercial, conte 1 Gol"). Essa é a maior fonte de
diferença entre as duas apurações — nos demais indicadores os totais por colaborador
ficam próximos.
