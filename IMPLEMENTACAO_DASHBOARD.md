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
=J2+(K2*1.5)+L2
```

🔴 **Ação necessária na planilha real:** apagar a fórmula atual de M2 (que está retornando valores incoerentes como -165.737,91 ou 11.195.142,78) e substituir pela fórmula acima.

---

## 📈 ABA: Store_Agencia (Agregação)

**L1:** `Pontos_Finais_Jun_Ago`

**L2:**
```
=SUMIF(Resumo_Gerentes!C:C;F2;Resumo_Gerentes!M:M)
```

**M1:** `Grupo` (preencher com 1, 2 ou 3 manualmente)

**N1:** `Posicao_no_Grupo`

**N2:**
```
=COUNTIFS(Store_Agencia!M:M;M2;Store_Agencia!L:L;">"&L2)+1
```

**O1:** `Premiacao`

**O2:**
```
=IF(N2=1;"🥇 R$ 3.000";IF(N2=2;"🥈 R$ 750";IF(N2=3;"🥉 R$ 500";"")))
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
- [ ] Fórmula quebrada de M2 (Pontos_Finais_Jun_Ago) substituída por `=J2+(K2*1.5)+L2`
- [ ] Pontos finais somando corretamente (M2)
- [ ] Agregação por agência funcionando (Store_Agencia!L2, referenciando Resumo_Gerentes!M:M)
- [ ] Ranking calculado por grupo (Store_Agencia!N2)
- [ ] Premiação exibida corretamente (Store_Agencia!O2)
- [ ] Colaboradores excluídos não aparecem no ranking

---

**Referência:** CONFIGURACOES_DASHBOARD.md
