# 📋 Configurações Dashboard - Copa Excelência

## 1. COLABORADORES EXCLUÍDOS DO RANKING

Estes colaboradores **NÃO participam** do ranking final de pontuação:

| # | Nome |
|---|------|
| 1 | LUAN NUNES DA SILVA |
| 2 | KATRIELE DOS SANTOS |
| 3 | CRISTIANE APARECIDA KOBOKOSKI |
| 4 | GABRIEL NUNES |
| 5 | GABRIEL PESSOA ANTUNES |
| 6 | JAMES NALON JUNIOR |
| 7 | JEAN GILBERTO GRITTEN |
| 8 | EDSON DE ESPINDOLA |
| 9 | LUAN DE MELLO GONCALVES |
| 10 | MAIKON MORAES HENCKEMAIER |
| 11 | LUKAS BUSE |
| 12 | DENISIA A ASSUNCAO LUIZ WROBLEWSKI |
| 13 | PAULO MICHAHOUSKI MAIDEL |
| 14 | TAIS FERNANDA M DE SOUZA ALVES DA SILVA |
| 15 | VICTOR SILVEIRA PZIVITOVSKI |

---

## 2. INDICADORES STORE_GERENTE (PONTUAÇÃO/GOLS)

| Indicador | Pontuação | Tipo | Regra |
|-----------|-----------|------|-------|
| Ativo Comercial | 1 Gol | Un | A cada 1 unidade, conte 1 Gol |
| Seguro de Vida | 2 Gols | Un | A cada 1 unidade, conte 2 Gols |
| Consórcio | 4 Gols | Un | A cada 1 unidade, conte 4 Gols |
| Depósitos Totais | 4 Gols | R$ | A cada R$ 10.000, conte 4 Gols |
| Crédito Comercial | 4 Gols | R$ | A cada R$ 10.000, conte 4 Gols |
| Capital Social | 5 Gols | R$ | A cada R$ 10.000, conte 5 Gols |
| Inad 15 Redução | +2 Gols | % | A cada redução de porcentagem, conte 2 Gols |
| Inad 15 Aumento | -5 Gols | % | A cada aumento de porcentagem, conte -5 Gols |

---

## 3. INDICADORES ADICIONAIS (Futuros)

| Indicador | Pontuação | Tipo |
|-----------|-----------|------|
| Adquirência/Domicílio (Maquininha) | 3 Gols | Un |
| Cartão | 1 Gol | Un |
| Cheque Especial | 1 Gol | Un |
| Emissão de Boletos | 2 Gols | Un |
| Incremento de Capital Social | 2 Gols | Un |

---

## 4. ESTRUTURA DE AGÊNCIAS E TIMES

### Agências e Seus Times
| Agência | Nome do Time |
|---------|-------------|
| Ponte Alta | Morangueiros |
| Santa Cruz do Timbó | Artilheiros da Meta |
| Lages Ii | Craques da Coop |
| Timbó Grande | Golaço Tg |
| Porto União | Tropa do Xixo |
| Correia Pinto | Construindo Gigantes |
| Otacilio Costa | Furacão Laranja |
| Irineópolis | Pix na Rede FC |
| Canoinhas | Little Boat |
| Major Vieira | Sinergia |
| São Joaquim | Gigantes da Serra |
| Monte Castelo | Craques da cooperação |
| Bom Jardim | Real Cooperativo |
| Bela Vista | Esquadrão Excelência |
| Lages | Canarinhos da Serra |

---

## 5. ESTRUTURA TÉCNICA E CHAVEAMENTOS

### Técnicos por Agência
| Agência | Técnico | Chaveamento |
|---------|---------|-------------|
| Pac Canoinhas | Marcos Fedechen | Chaveamento Norte |
| Pac Porto União | Marcos Fedechen | Chaveamento Norte |
| Pac Irineópolis | Marcos Fedechen | Chaveamento Norte |
| Pac Major Vieira | Marcos Fedechen | Chaveamento Norte |
| Pac Bela Vista Do Toldo | Marcos Fedechen | Chaveamento Norte |
| Pac Timbó Grande | Marcos Fedechen | Chaveamento Norte |
| Pac Monte Castelo | Marcos Fedechen | Chaveamento Norte |
| Pac São Joaquim | Jean Paes | Chaveamento Serra |
| Pac Lages Ii | Jean Paes | Chaveamento Serra |
| Pac Lages | Jean Paes | Chaveamento Serra |
| Pac Correia Pinto | Jean Paes | Chaveamento Serra |
| Pac Bom Jardim Da Serra | Jean Paes | Chaveamento Serra |
| Pac Otacilício Costa | Jean Paes | Chaveamento Serra |
| Pac Porto Uniao D. Sta Cruz Do Timbo | Marcos Fedechen | Chaveamento Norte |
| Pac Ponte Alta | Jean Paes | Chaveamento Serra |

---

## 6. DOCUMENTAÇÃO EXTERNA

### Links Google Drive
- **Figurinhas**: 1LjzbgsMJyUB9ixAxpQ5hiDdfk41MvSCJ
- **Template**: 1XpBlh_FBL8SHdExGccH1djViff1bnLcY

---

## 7. PERÍODOS DE COMPETIÇÃO

| Período | Dados | Multiplicador |
|---------|-------|---|
| Junho 2026 (06/2026) | 967 registros | 1.0x |
| Julho 2026 (07/2026) | 1.007 registros | 1.5x (Mata-Mata) |
| Agosto 2026 (08/2026) | 1.152 registros | 1.0x |

---

## 8. FÓRMULAS DE CÁLCULO

### Gols por Período (Google Sheets)

**J2 - Gols_Junho (06/2026):**
```
=COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Ativo Comercial"; Store_Gerente!B:B; "06/2026"; Store_Gerente!J:J; ">0")
+ COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Seguro de Vida"; Store_Gerente!B:B; "06/2026"; Store_Gerente!J:J; ">0") * 2
+ COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Consórcio"; Store_Gerente!B:B; "06/2026"; Store_Gerente!J:J; ">0") * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Depósitos Totais"; Store_Gerente!B:B; "06/2026") / 10000) * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Crédito Comercial"; Store_Gerente!B:B; "06/2026") / 10000) * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Capital Social"; Store_Gerente!B:B; "06/2026") / 10000) * 5
```

**K2 - Gols_Julho (07/2026):** Trocar `"06/2026"` por `"07/2026"`

**L2 - Gols_Agosto (08/2026):** Trocar `"06/2026"` por `"08/2026"`

**M2 - Pontos Finais (Jun-Ago):** Não existe coluna separada de multiplicador — o 1.5x de Julho é aplicado direto na fórmula:
```
=J2 + (K2 * 1,5) + L2
```
⚠️ **Separador decimal:** a planilha está em PT-BR — use vírgula (`1,5`), nunca ponto (`1.5`), senão a fórmula retorna `#ERROR!`.

⚠️ **Confirmado via export real (10/08/2026):** a estrutura da aba Resumo_Gerentes tem apenas 13 colunas (A até M), sem coluna N. J, K e L retornam 0 para todos os gerentes atualmente (fórmulas ainda não aplicadas na planilha), e M contém valores incorretos vindos de uma fórmula antiga que não usa J/K/L — precisa ser substituída pela fórmula acima.

---

## 8.1 ESTRUTURA DAS ABAS STORE_* (DADOS BRUTOS)

Confirmado via export HTML (10/08/2026). Todas em formato longo (uma linha por combinação de dimensão + indicador + período):

**Store_Gerente:**
```
A: dt_base | B: ds_periodo | C: cd_cooperativa | D: nm_cooperativa | E: cd_agencia
F: nm_agencia | G: Gerente | H: Indicador | I: Meta | J: Realizado | K: Saldo
```

**Store_Agencia** (2.964 registros — mesma estrutura de Store_Gerente, sem a coluna Gerente):
```
A: dt_base | B: ds_periodo | C: cd_cooperativa | D: nm_cooperativa
E: cd_agencia | F: nm_agencia | G: Indicador | H: Meta | I: Realizado | J: Saldo
```

**Store_Cooperativa** (202 registros — agregado no nível de cooperativa):
```
A: dt_base | B: ds_periodo | C: cd_cooperativa | D: nm_cooperativa
E: Indicador | F: Meta | G: Realizado | H: Saldo
```

⚠️ **Importante:** essas três abas são dados brutos (várias linhas por agência/cooperativa), **não** tabelas de resumo. Não é possível colocar fórmulas de ranking diretamente nelas — é necessário criar abas de resumo dedicadas (ex.: `Resumo_Gerentes` já existe; `Resumo_Agencias` precisa ser criada seguindo o mesmo padrão — ver `IMPLEMENTACAO_DASHBOARD.md`).

---

## 9. REGRA DE EXCLUSÃO NO RANKING

**Fórmula para excluir colaboradores no Ranking:**
```
=SE(COUNTIF(Configuracoes_Dashboard!A:A; A2) > 0; ""; M2)
```

Esta fórmula verifica se o colaborador está na lista de exclusão e não inclui seus pontos no ranking.

---

**Última atualização:** 2026-08-10
**Status:** Completo - Pronto para implementação
