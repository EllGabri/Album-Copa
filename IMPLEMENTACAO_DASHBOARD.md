# Copa Excelência - Implementação Dashboard
**Período:** Junho-Agosto 2026 | **Status:** Pronto para Implementar

---

## 📊 Dados Validados

| Período | Registros | Status |
|---------|-----------|--------|
| 06/2026 | 967 | ✅ Confirmado |
| 07/2026 | 1.007 | ✅ Confirmado |
| 08/2026 | 1.152 | ✅ Confirmado |

---

## 🔧 Estrutura Store_Gerente
```
Coluna A: dt_base (data)
Coluna B: ds_periodo (período - "06/2026", "07/2026", "08/2026")
Coluna G: Gerente
Coluna H: Indicador (Ativo Comercial, Seguro de Vida, etc)
Coluna J: Realizado (valor numérico)
```

---

## 📋 ABA: Resumo_Gerentes

### Cabeçalhos (Linha 1) — Estrutura Real Confirmada (13 colunas)
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
M: Pontos_Finais_Jun_Ago  ← resultado final (NÃO existe coluna N)
```

⚠️ **Não existe coluna separada para o multiplicador de 1.5x.** O multiplicador é aplicado diretamente dentro da fórmula de M (Pontos_Finais_Jun_Ago).

### ⚠️ Estado Atual (confirmado via export HTML de 10/08/2026)
- **J, K e L retornam 0 para TODOS os gerentes** — as fórmulas dos Passos 3 e 4 abaixo ainda não foram aplicadas na planilha real, ou foram sobrescritas.
- **M (Pontos_Finais_Jun_Ago) contém valores enormes e sem relação com J/K/L** (ex.: -165.737,91 / 11.195.142,78 / 61.549.611,06) — isso prova que a fórmula atual de M **não deriva de J+K*1.5+L**, e sim de algum outro cálculo incorreto (provavelmente multiplicação/soma de colunas inteiras sem filtro por linha, tipo SUMPRODUCT mal configurado). Essa fórmula precisa ser **substituída por completo** pela fórmula correta abaixo.

### Passo 1: Listar Gerentes Únicos
- Copiar gerentes únicos de Store_Gerente!G:G
- Preencher A2 em diante
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

**K2 - Gols_Julho:** (trocar "06/2026" por "07/2026")

**L2 - Gols_Agosto:** (trocar "06/2026" por "08/2026")

### Passo 5: Pontos Finais (M2)

**M2 - Pontos_Finais_Jun_Ago** (Junho + Julho com multiplicador 1.5x + Agosto, tudo em uma única fórmula, sem coluna auxiliar):
```
=J2+(K2*1,5)+L2
```

🔴 **IMPORTANTE — separador decimal:** a planilha está em PT-BR, então o separador decimal é **vírgula**, não ponto. `1.5` gera `#ERROR!` (erro de análise de fórmula). Use sempre `1,5`.

🔴 **Ação necessária na planilha real:** apagar a fórmula atual de M2 (que estava retornando valores incoerentes como -165.737,91 ou 11.195.142,78, ou o erro de sintaxe `1.5`) e substituir pela fórmula acima.

---

## 🗂️ Estrutura das Abas Store_* (Dados Brutos)

Todas as abas `Store_*` são tabelas de dados brutos em formato longo (uma linha por combinação de dimensão + indicador + período) — **não são tabelas de resumo/ranking**. Confirmado via export HTML de 10/08/2026:

**Store_Gerente** (966+ registros/período):
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

⚠️ **Por isso a fórmula em `Store_Agencia!L2` retornou 0**: essa aba é dado bruto (2.964 linhas, várias por agência — uma por indicador/período), não uma tabela com uma linha por agência. Uma fórmula de ranking colocada ali não teria como agregar corretamente. É necessário criar uma aba de **resumo** dedicada, análoga à `Resumo_Gerentes`, com um nome como `Resumo_Agencias`.

---

## 📈 ABA: Resumo_Agencias

### Cabeçalhos (Linha 1) — Estrutura Real (uma linha por colaborador, igual a Resumo_Gerentes)
```
A: Colaborador | B: Agencia | C: Grupo | D: Pontos_Finais_Jun_Ago | E: Posicao_no_Grupo | F: Premiacao
```

⚠️ Diferente do que uma versão anterior deste guia sugeria, esta aba **não** precisa ter uma linha por agência — funciona igual à `Resumo_Gerentes`, com uma linha por colaborador, e a coluna `B` (Agência) repete o mesmo valor para todos os colaboradores da mesma agência. Isso é o formato que já está em uso na planilha; as fórmulas de ranking abaixo funcionam corretamente mesmo com linhas repetidas por agência.

### Passo 1: Colaborador (A2)
Mesma lista de `Resumo_Gerentes!A:A` (copiar ou usar `=Resumo_Gerentes!A2`).

### Passo 2: Agência (B2)
```
=IFERROR(INDEX(Resumo_Gerentes!C:C;MATCH(A2;Resumo_Gerentes!A:A;0));"")
```

### Passo 3: Grupo (C2)
A divisão de grupos (1, 2 e 3) vem do chaveamento do dashboard e não existe como coluna pronta em `Configuracoes_Dashboard` — por isso é fixada diretamente na fórmula com `IFS`, usando o nome completo da agência (mesmo valor de `Store_Gerente!F:F` / `Resumo_Gerentes!C:C`, com prefixo "Pac"):
```
=IFS(B2="Pac São Joaquim";1;B2="Pac Lages Ii";1;B2="Pac Porto União";1;B2="Pac Lages";1;B2="Pac Canoinhas";1;B2="Pac Major Vieira";2;B2="Pac Irineópolis";2;B2="Pac Otacilío Costa";2;B2="Pac Correia Pinto";2;B2="Pac Monte Castelo";3;B2="Pac Ponte Alta";3;B2="Pac Timbó Grande";3;B2="Pac Porto Uniao D. Sta Cruz Do Timbo";3;B2="Pac Bom Jardim Da Serra";3;B2="Pac Bela Vista Do Toldo";3;TRUE;"")
```

**Mapa Grupo × Agência (referência):**

| Grupo | Times / Agências |
|-------|-------------------|
| 1 — Cabeças de Chave | Gigantes da Serra (São Joaquim), Craques da Coop (Lages Ii), Tropa do Xixo (Porto União), Canarinhos da Serra (Lages), Little Boat (Canoinhas) |
| 2 — Intermediárias | Sinergia (Major Vieira), Pix na Rede FC (Irineópolis), Furacão Laranja (Otacílio Costa), Construindo Gigantes (Correia Pinto) |
| 3 — Desafiantes | Craques da Cooperação (Monte Castelo), Morangueiros (Ponte Alta), Golaço Tg (Timbó Grande), Artilheiros da Meta (Santa Cruz do Timbó / Pac Porto Uniao D. Sta Cruz Do Timbo), Real Cooperativo (Bom Jardim), Esquadrão Excelência (Bela Vista) |

⚠️ Se algum nome de agência em `B:B` não bater exatamente com os valores acima (acentos, "Pac" faltando, etc.), o `IFS` retorna `""` para essa linha — nesse caso confira a grafia exata usando `=Store_Gerente!F2` como referência.

### Passo 4: Pontos Finais por Agência (D2)
Soma todos os pontos de todos os colaboradores daquela agência (repete o mesmo valor em cada linha da agência):
```
=SUMIF(Resumo_Gerentes!C:C;B2;Resumo_Gerentes!M:M)
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

## 🚫 Colaboradores Excluídos do Ranking

Ver arquivo `CONFIGURACOES_DASHBOARD.md` para lista completa de 15 colaboradores.

**Aplicar Regra de Exclusão em Coluna N (opcional, Resumo_Gerentes):**
```
=IF(COUNTIF(Configuracoes_Dashboard!A:A;A2)>0;"";"exibir ranking")
```

---

## ✅ Checklist Final

- [ ] Todos os gerentes listados em Resumo_Gerentes!A:A
- [ ] Lookup de agência funcionando (B2:C2)
- [ ] Indicadores agregados preenchidos (D2:I2)
- [ ] Gols por período calculados (J2:L2) - **USAR COUNTIFS/SUMIFS EM INGLÊS** — atualmente retornando 0 para todos, aplicar fórmulas do Passo 4
- [ ] Fórmula de M2 (Pontos_Finais_Jun_Ago) corrigida para `=J2+(K2*1,5)+L2` **(vírgula, não ponto)**
- [ ] Pontos finais somando corretamente (M2)
- [ ] Aba `Resumo_Agencias` criada (NÃO usar `Store_Agencia`, que é dado bruto)
- [ ] Coluna Grupo preenchida automaticamente via fórmula IFS (Resumo_Agencias!C2) — não mais manual
- [ ] Agregação por agência funcionando (Resumo_Agencias!D2, referenciando Resumo_Gerentes!M:M)
- [ ] Ranking calculado por grupo (Resumo_Agencias!E2)
- [ ] Premiação exibida corretamente (Resumo_Agencias!F2)
- [ ] Colaboradores excluídos não aparecem no ranking

---

**Referência:** CONFIGURACOES_DASHBOARD.md
