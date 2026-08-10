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

### Cabeçalhos (Linha 1)
```
A: Gerente | B: Agencia_Codigo | C: Agencia_Nome | D-I: Indicadores | J-L: Gols_Por_Mês | M: Gols_Julho_1.5x | N: Pontos_Finais
```

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

### Passo 5: Multiplicadores e Total (M2:N2)

**M2 - Multiplicador Julho (1.5x):**
```
=K2*1.5
```

**N2 - Pontos_Finais:**
```
=J2+M2+L2
```

---

## 📈 ABA: Store_Agencia (Agregação)

**L1:** `Pontos_Finais_Jun_Ago`

**L2:**
```
=SUMIF(Resumo_Gerentes!C:C;F2;Resumo_Gerentes!N:N)
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

**Aplicar Regra de Exclusão em Coluna P (opcional):**
```
=IF(COUNTIF(Configuracoes_Dashboard!A:A;A2)>0;"";"exibir ranking")
```

---

## ✅ Checklist Final

- [ ] Todos os gerentes listados em Resumo_Gerentes!A:A
- [ ] Lookup de agência funcionando (B2:C2)
- [ ] Indicadores agregados preenchidos (D2:I2)
- [ ] Gols por período calculados (J2:L2) - **USAR COUNTIFS/SUMIFS EM INGLÊS**
- [ ] Multiplicador 1.5x aplicado (M2)
- [ ] Pontos finais somando corretamente (N2)
- [ ] Agregação por agência funcionando (Store_Agencia!L2)
- [ ] Ranking calculado por grupo (Store_Agencia!N2)
- [ ] Premiação exibida corretamente (Store_Agencia!O2)
- [ ] Colaboradores excluídos não aparecem no ranking

---

**Referência:** CONFIGURACOES_DASHBOARD.md | GUIA_PASSO_A_PASSO.md
