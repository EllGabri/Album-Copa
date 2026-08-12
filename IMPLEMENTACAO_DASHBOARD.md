# Copa Excelência - Implementação Dashboard
**Período:** Junho-Agosto 2026 | **Status:** Pronto para Implementar

Guia de fórmulas para as abas de resumo da planilha Google Sheets. Para dados de referência (colaboradores excluídos, pontuação, agências/times/grupos, técnicos), ver `CONFIGURACOES_DASHBOARD.md`.

⚠️ Regras gerais de sintaxe válidas em todas as fórmulas deste guia:
- **Funções sempre em inglês** (`COUNTIFS`, `SUMIFS`, `INDEX`, `MATCH`, `IF`, `IFS`, `INT`), nunca em português (`CONTARSES`, `SOMASES`, `SE`), mesmo com a planilha em PT-BR.
- **Separador de argumentos:** ponto e vírgula (`;`), padrão do Sheets em PT-BR.
- **Separador decimal:** vírgula (`,`), nunca ponto — `1.5` gera `#ERROR!`, use `1,5`.
- Filtrar período sempre pelo **texto** da coluna `ds_periodo` (ex.: `"06/2026"`), nunca por intervalo de datas em `dt_base`.

---

## 🗂️ Estrutura das Abas Store_* (Dados Brutos)

Todas em formato longo (uma linha por combinação de dimensão + indicador + período) — **não são tabelas de resumo/ranking**, então fórmulas de ranking não podem ser colocadas diretamente nelas.

**Store_Gerente:**
```
A: dt_base | B: ds_periodo | C: cd_cooperativa | D: nm_cooperativa | E: cd_agencia
F: nm_agencia | G: Gerente | H: Indicador | I: Meta | J: Realizado | K: Saldo
```

**Store_Agencia** (2.964 registros — mesma estrutura, sem a coluna Gerente):
```
A: dt_base | B: ds_periodo | C: cd_cooperativa | D: nm_cooperativa
E: cd_agencia | F: nm_agencia | G: Indicador | H: Meta | I: Realizado | J: Saldo
```

**Store_Cooperativa** (202 registros — agregado no nível de cooperativa):
```
A: dt_base | B: ds_periodo | C: cd_cooperativa | D: nm_cooperativa
E: Indicador | F: Meta | G: Realizado | H: Saldo
```

**Store_Carteira** (11.716 registros — o mais granular, quebra por carteira dentro de cada gerente):
```
A: dt_base | B: ds_periodo | C: cd_cooperativa | D: nm_cooperativa | E: cd_agencia
F: nm_agencia | G: Gerente | H: cd_carteira | I: nm_carteira | J: Indicador
K: Meta | L: Realizado | M: Saldo
```

---

## 📋 ABA: Resumo_Gerentes

### Cabeçalhos (Linha 1) — 13 colunas (A-M) + N (exclusão, ver Passo 6)
```
A: Gerente
B: Agencia_Codigo
C: Agencia_Nome
D: Ativo_Comercial
E: Seguro_Vida
F: Consorcio
G: Depositos_Totais
H: Credito_Comercial
I: Capital_Social
J: Gols_Junho
K: Gols_Julho
L: Gols_Agosto
M: Pontos_Finais_Jun_Ago
N: Pontos_Ranking (criar — ver Passo 6)
```

### Passo 1: Listar Gerentes Únicos
- Copiar gerentes únicos de `Store_Gerente!G:G`
- Preencher `A2` em diante
- Remover duplicatas (Dados → Remover duplicatas)

### Passo 2: Lookup Agência (B2:C2)
**B2:**
```
=IFERROR(INDEX(Store_Gerente!E:E; MATCH(A2; Store_Gerente!G:G; 0)); "")
```

**C2:**
```
=IFERROR(INDEX(Store_Gerente!F:F; MATCH(A2; Store_Gerente!G:G; 0)); "")
```

### Passo 3: Indicadores Agregados (D2:I2)

**D2 - Ativo Comercial (1 gol por unidade):**
```
=COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Ativo Comercial";Store_Gerente!B:B;"06/2026";Store_Gerente!J:J;">0")+COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Ativo Comercial";Store_Gerente!B:B;"07/2026";Store_Gerente!J:J;">0")+COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Ativo Comercial";Store_Gerente!B:B;"08/2026";Store_Gerente!J:J;">0")
```

**E2 - Seguro de Vida (2 gols por unidade):**
```
=(COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Seguro de Vida";Store_Gerente!B:B;"06/2026";Store_Gerente!J:J;">0")+COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Seguro de Vida";Store_Gerente!B:B;"07/2026";Store_Gerente!J:J;">0")+COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Seguro de Vida";Store_Gerente!B:B;"08/2026";Store_Gerente!J:J;">0"))*2
```

**F2 - Consórcio (4 gols por unidade):**
```
=(COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Consórcio";Store_Gerente!B:B;"06/2026";Store_Gerente!J:J;">0")+COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Consórcio";Store_Gerente!B:B;"07/2026";Store_Gerente!J:J;">0")+COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Consórcio";Store_Gerente!B:B;"08/2026";Store_Gerente!J:J;">0"))*4
```

**G2 - Depósitos Totais (4 gols por R$ 10.000):**
```
=INT((SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Depósitos Totais";Store_Gerente!B:B;"06/2026")+SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Depósitos Totais";Store_Gerente!B:B;"07/2026")+SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Depósitos Totais";Store_Gerente!B:B;"08/2026"))/10000)*4
```

**H2 - Crédito Comercial (4 gols por R$ 10.000):**
```
=INT((SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Crédito Comercial";Store_Gerente!B:B;"06/2026")+SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Crédito Comercial";Store_Gerente!B:B;"07/2026")+SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Crédito Comercial";Store_Gerente!B:B;"08/2026"))/10000)*4
```

**I2 - Capital Social (5 gols por R$ 10.000):**
```
=INT((SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Capital Social";Store_Gerente!B:B;"06/2026")+SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Capital Social";Store_Gerente!B:B;"07/2026")+SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Capital Social";Store_Gerente!B:B;"08/2026"))/10000)*5
```

### Passo 4: Gols Por Período (J2:L2)

**J2 - Gols_Junho:**
```
=COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Ativo Comercial";Store_Gerente!B:B;"06/2026";Store_Gerente!J:J;">0")+COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Seguro de Vida";Store_Gerente!B:B;"06/2026";Store_Gerente!J:J;">0")*2+COUNTIFS(Store_Gerente!G:G;A2;Store_Gerente!H:H;"Consórcio";Store_Gerente!B:B;"06/2026";Store_Gerente!J:J;">0")*4+INT(SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Depósitos Totais";Store_Gerente!B:B;"06/2026")/10000)*4+INT(SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Crédito Comercial";Store_Gerente!B:B;"06/2026")/10000)*4+INT(SUMIFS(Store_Gerente!J:J;Store_Gerente!G:G;A2;Store_Gerente!H:H;"Capital Social";Store_Gerente!B:B;"06/2026")/10000)*5
```

**K2 - Gols_Julho:** (trocar `"06/2026"` por `"07/2026"`)

**L2 - Gols_Agosto:** (trocar `"06/2026"` por `"08/2026"`)

### Passo 5: Pontos Finais (M2)

Junho + Julho com multiplicador 1,5x + Agosto, sem coluna auxiliar de multiplicador:
```
=J2+(K2*1,5)+L2
```

### Passo 6: Excluir Colaboradores do Ranking (N2)

Ver `CONFIGURACOES_DASHBOARD.md` seção 1 para a lista completa dos 15 colaboradores excluídos.

Cria-se a coluna `N` (não existe por padrão):
1. Em `N1`: cabeçalho `Pontos_Ranking`.
2. Em `N2`, e arrastar até a última linha:
```
=IF(COUNTIF(Configuracoes_Dashboard!A:A;A2)>0;"";M2)
```

Se o colaborador (`A2`) estiver na lista de excluídos, `N2` fica vazio; caso contrário, repete `M2`. **Use `N` (não `M`) a partir daqui** para montar rankings e para a agregação por agência no próximo passo — assim os excluídos não entram na soma da agência.

---

## 📈 ABA: Resumo_Agencias

### Cabeçalhos (Linha 1) — uma linha por colaborador, igual a Resumo_Gerentes
```
A: Colaborador | B: Agencia | C: Grupo | D: Pontos_Finais_Jun_Ago | E: Posicao_no_Grupo | F: Premiacao
```

A coluna `B` (Agência) repete o mesmo valor para todos os colaboradores da mesma agência — as fórmulas de ranking abaixo funcionam corretamente mesmo assim.

### Passo 1: Colaborador (A2)
Mesma lista de `Resumo_Gerentes!A:A`.

### Passo 2: Agência (B2)
```
=IFERROR(INDEX(Resumo_Gerentes!C:C;MATCH(A2;Resumo_Gerentes!A:A;0));"")
```

### Passo 3: Grupo (C2)
A divisão de grupos (1, 2 e 3) não existe como coluna em `Configuracoes_Dashboard` — vem do chaveamento do dashboard publicado (ver `CONFIGURACOES_DASHBOARD.md` seção 4) e é fixada direto na fórmula com `IFS`, comparando o nome completo da agência (mesmo valor de `Store_Gerente!F:F` / `Resumo_Gerentes!C:C`, com prefixo "Pac"):
```
=IFS(B2="Pac São Joaquim";1;B2="Pac Lages Ii";1;B2="Pac Porto União";1;B2="Pac Lages";1;B2="Pac Canoinhas";1;B2="Pac Major Vieira";2;B2="Pac Irineópolis";2;B2="Pac Otacilío Costa";2;B2="Pac Correia Pinto";2;B2="Pac Monte Castelo";3;B2="Pac Ponte Alta";3;B2="Pac Timbó Grande";3;B2="Pac Porto Uniao D. Sta Cruz Do Timbo";3;B2="Pac Bom Jardim Da Serra";3;B2="Pac Bela Vista Do Toldo";3;TRUE;"")
```

⚠️ Se algum nome de agência em `B:B` não bater exatamente com os valores da fórmula (acentos, "Pac" faltando, etc.), o `IFS` retorna `""` para essa linha — confira a grafia exata usando `=Store_Gerente!F2` como referência.

### Passo 4: Pontos Finais por Agência (D2)
Soma os pontos de todos os colaboradores daquela agência, já excluindo os 15 colaboradores da lista de exclusão (usa a coluna `N` de `Resumo_Gerentes`, criada no Passo 6, não `M`):
```
=SUMIF(Resumo_Gerentes!C:C;B2;Resumo_Gerentes!N:N)
```

### Passo 5: Posição no Grupo (E2)
Ranking dentro do mesmo grupo (compara apenas linhas com o mesmo `C`):
```
=COUNTIFS($C$2:$C$1000;C2;$D$2:$D$1000;">"&D2)+1
```

### Passo 6: Premiação (F2)
```
=IF(E2=1;"🥇 R$ 3.000";IF(E2=2;"🥈 R$ 750";IF(E2=3;"🥉 R$ 500";"")))
```

---

## ✅ Checklist Final

- [ ] Todos os gerentes listados em `Resumo_Gerentes!A:A`
- [ ] Lookup de agência funcionando (B2:C2)
- [ ] Indicadores agregados preenchidos (D2:I2)
- [ ] Gols por período calculados (J2:L2)
- [ ] Pontos finais somando corretamente (M2)
- [ ] Coluna `N` (Pontos_Ranking) criada em `Resumo_Gerentes`, excluindo os 15 colaboradores (Passo 6)
- [ ] Aba `Resumo_Agencias` criada (NÃO usar `Store_Agencia`, que é dado bruto)
- [ ] Coluna Grupo preenchida automaticamente via fórmula `IFS` (Resumo_Agencias!C2)
- [ ] Agregação por agência funcionando (Resumo_Agencias!D2, referenciando `Resumo_Gerentes!N:N`)
- [ ] Ranking calculado por grupo (Resumo_Agencias!E2)
- [ ] Premiação exibida corretamente (Resumo_Agencias!F2)
- [ ] Colaboradores excluídos não aparecem no ranking

---

## ℹ️ Sobre o Dashboard Público (src/webapp/)

O dashboard público (`src/webapp/Index.html` + `codigo.gs`) **não lê `Resumo_Gerentes`/`Resumo_Agencias`**: ele é um Web App do Apps Script que lê `Store_Gerente`, `Store_Agencia`, `Store_Carteira` e `Configuracoes_Dashboard` diretamente e recalcula gols/rankings/grupos em JavaScript a cada carregamento. As fórmulas deste guia são um cálculo manual paralelo, útil para conferência.

Alterações em `src/webapp/Index.html` neste repositório só valem para o dashboard real depois de coladas manualmente no editor do Apps Script vinculado à planilha (Extensões → Apps Script) — este repositório não está conectado a ele.

---

**Referência:** `CONFIGURACOES_DASHBOARD.md`
