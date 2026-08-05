# 🚀 GUIA PASSO A PASSO - Implementar Dashboard Copa Excelência
**Estrutura de Dados:** Formato Normalizado (Long Format)

## ⚙️ Referência: Funções em Português

| Função | Português | Separador | Exemplo |
|--------|-----------|-----------|---------|
| COUNTIFS | CONTARSES | ; | =CONTARSES(range1; criteria1; range2; criteria2) |
| SUMIFS | SOMASES | ; | =SOMASES(sum_range; criteria_range1; criteria1) |
| SUMIF | SOMASE | ; | =SOMASE(range; criteria; sum_range) |
| IF | SE | ; | =SE(condition; valor_se_sim; valor_se_não) |
| AND | E | ; | =E(condição1; condição2) |
| OR | OU | ; | =OU(condição1; condição2) |
| INT | INT | ; | =INT(número) |
| DATE | DATA | ; | =DATA(2024; 6; 1) |
| TODAY | HOJE | - | =HOJE() |
| INDEX | ÍNDICE | ; | =ÍNDICE(range; row) |
| MATCH | PROCURA | ; | =PROCURA(value; range; 0) |
| IFERROR | IFERROR | ; | =IFERROR(formula; "") |

**⚠️ IMPORTANTE:** Google Sheets em Português usa **PONTO-E-VÍRGULA (;)** como separador, **NÃO VÍRGULA**.

---

## FASE 1: PREPARAÇÃO (10 minutos)

### Passo 1.1: Verificar Estrutura de Store_Gerente
```
Coluna A: dt_base (Data)
Coluna B: ds_periodo (Período)
Coluna C: cd_cooperativa
Coluna D: nm_cooperativa
Coluna E: cd_agencia
Coluna F: nm_agencia (Agência)
Coluna G: Gerente
Coluna H: Indicador (Ativo Comercial, Seguro de Vida, Consórcio, etc.)
Coluna I: Meta
Coluna J: Realizado (valor numérico)
Coluna K: Saldo

✓ Confirmado? Seguir para Fase 2
```

### Passo 1.2: Verificar Estrutura de Store_Agencia
```
Coluna A: dt_base
Coluna B: ds_periodo
Coluna C: cd_cooperativa
Coluna D: nm_cooperativa
Coluna E: cd_agencia
Coluna F: nm_agencia (Agência)
Coluna G: Indicador
Coluna H: Meta
Coluna I: Realizado
Coluna J: Saldo

✓ Confirmado? Prosseguir
```

---

## FASE 2: CRIAR ABA DE RESUMO POR GERENTE (45 minutos)

**Estratégia:** Usar COUNTIFS e SUMIFS para calcular pontos por gerente

### Passo 2.1: Criar Nova Aba "Resumo_Gerentes"
```
1. Ir para Google Sheets "Copa Excelência"
2. Clique no "+" (adicionar aba)
3. Nomear: "Resumo_Gerentes"
4. OK
```

### Passo 2.2: Criar Cabeçalhos (Linha 1)
```
Célula A1: Gerente
Célula B1: Agencia_Codigo
Célula C1: Agencia_Nome
Célula D1: Ativo_Comercial
Célula E1: Seguro_Vida
Célula F1: Consorcio
Célula G1: Depositos_Totais
Célula H1: Credito_Comercial
Célula I1: Capital_Social
Célula J1: Gols_Junho
Célula K1: Gols_Julho
Célula L1: Gols_Agosto
Célula M1: Gols_Julho_1_5x
Célula N1: Pontos_Finais_Jun_Ago
```

### Passo 2.3: Listar Gerentes Únicos (Coluna A)
```
MANUAL: Copiar lista única de gerentes de Store_Gerente coluna G
- Colar em Resumo_Gerentes coluna A (a partir de A2)
- Remover duplicatas (Dados → Remover duplicatas → Coluna A)
- Resultado: 1 gerente por linha
```

### Passo 2.4: Preencher Agência (Colunas B-C)
```
Célula B2 (primeiro gerente):
=IFERROR(ÍNDICE(Store_Gerente!E:E; PROCURA(A2; Store_Gerente!G:G; 0)); "")

Célula C2:
=IFERROR(ÍNDICE(Store_Gerente!F:F; PROCURA(A2; Store_Gerente!G:G; 0)); "")

Copiar B2:C2 para todas as linhas de gerentes
NOTA: Usar PONTO-E-VÍRGULA (;) entre argumentos
```

### Passo 2.5: Calcular Ativo Comercial (Coluna D)
```
Célula D2:
=CONTARSES(Store_Gerente!G:G; A2; 
           Store_Gerente!H:H; "Ativo Comercial";
           Store_Gerente!B:B; "06/2026";
           Store_Gerente!J:J; ">0")
+ 
CONTARSES(Store_Gerente!G:G; A2; 
          Store_Gerente!H:H; "Ativo Comercial";
          Store_Gerente!B:B; "07/2026";
          Store_Gerente!J:J; ">0")
+
CONTARSES(Store_Gerente!G:G; A2; 
          Store_Gerente!H:H; "Ativo Comercial";
          Store_Gerente!B:B; "08/2026";
          Store_Gerente!J:J; ">0")

Copiar para todas as linhas (D:D)
Resultado: 1 gol por unidade

NOTA: Filtra por período (coluna B) nos formatos "06/2026", "07/2026", "08/2026"
      Soma os três períodos (junho, julho, agosto)
```

### Passo 2.6: Calcular Seguro de Vida (Coluna E)
```
Célula E2:
=(CONTARSES(Store_Gerente!G:G; A2;
            Store_Gerente!H:H; "Seguro de Vida";
            Store_Gerente!B:B; "06/2026";
            Store_Gerente!J:J; ">0")
 + CONTARSES(Store_Gerente!G:G; A2;
             Store_Gerente!H:H; "Seguro de Vida";
             Store_Gerente!B:B; "07/2026";
             Store_Gerente!J:J; ">0")
 + CONTARSES(Store_Gerente!G:G; A2;
             Store_Gerente!H:H; "Seguro de Vida";
             Store_Gerente!B:B; "08/2026";
             Store_Gerente!J:J; ">0")) * 2

Copiar para todas as linhas (E:E)
Resultado: 2 gols por unidade
NOTA: Soma os três períodos (06, 07, 08/2026), depois multiplica por 2
```

### Passo 2.7: Calcular Consórcio (Coluna F)
```
Célula F2:
=(CONTARSES(Store_Gerente!G:G; A2;
            Store_Gerente!H:H; "Consórcio";
            Store_Gerente!B:B; "06/2026";
            Store_Gerente!J:J; ">0")
 + CONTARSES(Store_Gerente!G:G; A2;
             Store_Gerente!H:H; "Consórcio";
             Store_Gerente!B:B; "07/2026";
             Store_Gerente!J:J; ">0")
 + CONTARSES(Store_Gerente!G:G; A2;
             Store_Gerente!H:H; "Consórcio";
             Store_Gerente!B:B; "08/2026";
             Store_Gerente!J:J; ">0")) * 4

Copiar para todas as linhas (F:F)
Resultado: 4 gols por unidade
NOTA: Soma os três períodos, depois multiplica por 4
```

### Passo 2.8: Calcular Depósitos Totais (Coluna G)
```
Célula G2:
=INT((SOMASES(Store_Gerente!J:J;
              Store_Gerente!G:G; A2;
              Store_Gerente!H:H; "Depósitos Totais";
              Store_Gerente!B:B; "06/2026")
      + SOMASES(Store_Gerente!J:J;
                Store_Gerente!G:G; A2;
                Store_Gerente!H:H; "Depósitos Totais";
                Store_Gerente!B:B; "07/2026")
      + SOMASES(Store_Gerente!J:J;
                Store_Gerente!G:G; A2;
                Store_Gerente!H:H; "Depósitos Totais";
                Store_Gerente!B:B; "08/2026")) / 10000) * 4

Copiar para todas as linhas (G:G)
Resultado: 4 gols a cada R$ 10.000
NOTA: Soma Depósitos dos três períodos, divide por 10mil, multiplica por 4
```

### Passo 2.9: Calcular Crédito Comercial (Coluna H)
```
Célula H2:
=INT((SOMASES(Store_Gerente!J:J;
              Store_Gerente!G:G; A2;
              Store_Gerente!H:H; "Crédito Comercial";
              Store_Gerente!B:B; "06/2026")
      + SOMASES(Store_Gerente!J:J;
                Store_Gerente!G:G; A2;
                Store_Gerente!H:H; "Crédito Comercial";
                Store_Gerente!B:B; "07/2026")
      + SOMASES(Store_Gerente!J:J;
                Store_Gerente!G:G; A2;
                Store_Gerente!H:H; "Crédito Comercial";
                Store_Gerente!B:B; "08/2026")) / 10000) * 4

Copiar para todas as linhas (H:H)
Resultado: 4 gols a cada R$ 10.000
NOTA: Soma Crédito dos três períodos, divide por 10mil, multiplica por 4
```

### Passo 2.10: Calcular Capital Social (Coluna I)
```
Célula I2:
=INT((SOMASES(Store_Gerente!J:J;
              Store_Gerente!G:G; A2;
              Store_Gerente!H:H; "Capital Social";
              Store_Gerente!B:B; "06/2026")
      + SOMASES(Store_Gerente!J:J;
                Store_Gerente!G:G; A2;
                Store_Gerente!H:H; "Capital Social";
                Store_Gerente!B:B; "07/2026")
      + SOMASES(Store_Gerente!J:J;
                Store_Gerente!G:G; A2;
                Store_Gerente!H:H; "Capital Social";
                Store_Gerente!B:B; "08/2026")) / 10000) * 5

Copiar para todas as linhas (I:I)
Resultado: 5 gols a cada R$ 10.000
NOTA: Soma Capital Social dos três períodos, divide por 10mil, multiplica por 5
```

---

## FASE 3: AGRUPAR PONTOS POR MÊS (30 minutos)

### Passo 3.1: Calcular Gols de Junho (Coluna J)
```
Célula J2:
=COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Ativo Comercial"; Store_Gerente!B:B; "06/2026"; Store_Gerente!J:J; ">0")
+ COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Seguro de Vida"; Store_Gerente!B:B; "06/2026"; Store_Gerente!J:J; ">0") * 2
+ COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Consórcio"; Store_Gerente!B:B; "06/2026"; Store_Gerente!J:J; ">0") * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Depósitos Totais"; Store_Gerente!B:B; "06/2026") / 10000) * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Crédito Comercial"; Store_Gerente!B:B; "06/2026") / 10000) * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Capital Social"; Store_Gerente!B:B; "06/2026") / 10000) * 5

Copiar para J:J
Multiplicador Junho: 1.0x (não precisa multiplicar)
NOTA: Usar funções em INGLÊS (COUNTIFS, SUMIFS) com separadores PONTO-E-VÍRGULA
```

### Passo 3.2: Calcular Gols de Julho (Coluna K)
```
Célula K2:
=COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Ativo Comercial"; Store_Gerente!B:B; "07/2026"; Store_Gerente!J:J; ">0")
+ COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Seguro de Vida"; Store_Gerente!B:B; "07/2026"; Store_Gerente!J:J; ">0") * 2
+ COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Consórcio"; Store_Gerente!B:B; "07/2026"; Store_Gerente!J:J; ">0") * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Depósitos Totais"; Store_Gerente!B:B; "07/2026") / 10000) * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Crédito Comercial"; Store_Gerente!B:B; "07/2026") / 10000) * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Capital Social"; Store_Gerente!B:B; "07/2026") / 10000) * 5

Copiar para K:K
Multiplicador Julho: 1.5x (será multiplicado em coluna M)
NOTA: Usar funções em INGLÊS (COUNTIFS, SUMIFS) com separadores PONTO-E-VÍRGULA
```

### Passo 3.3: Calcular Gols de Agosto (Coluna L)
```
Célula L2:
=COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Ativo Comercial"; Store_Gerente!B:B; "08/2026"; Store_Gerente!J:J; ">0")
+ COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Seguro de Vida"; Store_Gerente!B:B; "08/2026"; Store_Gerente!J:J; ">0") * 2
+ COUNTIFS(Store_Gerente!G:G; A2; Store_Gerente!H:H; "Consórcio"; Store_Gerente!B:B; "08/2026"; Store_Gerente!J:J; ">0") * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Depósitos Totais"; Store_Gerente!B:B; "08/2026") / 10000) * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Crédito Comercial"; Store_Gerente!B:B; "08/2026") / 10000) * 4
+ INT(SUMIFS(Store_Gerente!J:J; Store_Gerente!G:G; A2; Store_Gerente!H:H; "Capital Social"; Store_Gerente!B:B; "08/2026") / 10000) * 5

Copiar para L:L
Multiplicador Agosto: 1.0x (não precisa multiplicar)
NOTA: Usar funções em INGLÊS (COUNTIFS, SUMIFS) com separadores PONTO-E-VÍRGULA
```

---

## FASE 4: TRATAR INADIMPLÊNCIA (20 minutos)

### Passo 4.1: Calcular Gols de Julho com Multiplicador 1.5x (Coluna M)
```
Célula M2:
=K2 * 1.5

Copiar para M:M
Explicação: Julho recebe multiplicador 1.5x (mata-mata)
```

### Passo 4.2: Calcular Inadimplência 15 (Coluna O)
```
⚠️ Indisponível nos Stores por enquanto
Por enquanto, deixar coluna vazia ou com 0

Célula O2:
=0

Futuro: Quando houver dados de Inad15_Base_Dezembro:
=IF(Inad15_Agosto < Inad15_Dezembro, 
    (Inad15_Dezembro - Inad15_Agosto) * 2,
    IF(Inad15_Agosto > Inad15_Dezembro,
       (Inad15_Agosto - Inad15_Dezembro) * -5,
       0))
```

### Passo 4.2: Calcular Multiplicador Julho (Coluna M)
```
Célula M2:
=K2 * 1,5

Copiar para M:M
Explicação: Julho recebe multiplicador 1.5x (mata-mata)
NOTA: Use VÍRGULA como separador decimal (padrão português)
```

### Passo 4.3: Calcular Total Final de Pontos (Coluna N)
```
Célula N2:
=J2 + M2 + L2 + O2

Explicação:
- J2 = Gols Junho (1.0x)
- M2 = Gols Julho (1.5x aplicado)
- L2 = Gols Agosto (1.0x)
- O2 = Gols Inadimplência (por enquanto = 0)

Copiar para N:N
```

---

## FASE 5: AGREGAÇÃO POR AGÊNCIA (25 minutos)

### Passo 5.1: Ir para Store_Agencia
```
1. Clicar na aba "Store_Agencia"
2. Localizar primeira coluna vazia após coluna J (Saldo)
   - Usar coluna L para adicionar cabeçalhos
```

### Passo 5.2: Criar Coluna de Pontos da Agência (Coluna L)
```
Célula L1: Pontos_Finais_Jun_Ago

Célula L2:
=SOMASE(Resumo_Gerentes!C:C; F2; Resumo_Gerentes!N:N)

Explicação:
- Procura na coluna F (nm_agencia) de Store_Agencia
- Localiza a agência em Resumo_Gerentes coluna C (Agencia_Nome)
- Soma os Pontos_Finais (coluna N) de todos os gerentes dessa agência
- NOTA: Usar PONTO-E-VÍRGULA (;) como separador

Copiar para L:L até última linha com agência
```

### Passo 5.3: VALIDAÇÃO CRÍTICA - Verificar Agregação
```
⚠️ VALIDAR IMEDIATAMENTE:

1. Ir para "Resumo_Gerentes"
2. Copiar todos os gerentes de UMA agência conhecida
3. Somar manualmente os Pontos_Finais (coluna N) desses gerentes
4. Anotar o valor total (ex: 150 pontos)

5. Ir para "Store_Agencia"
6. Procurar pela mesma agência
7. Verificar se coluna L mostra EXATAMENTE 150 pontos

✅ DEVE BATER EXATAMENTE
❌ Se não bater: revisar fórmula do SUMIF
```

---

## FASE 6: RANKING E GRUPOS (20 minutos)

### Passo 6.1: Verificar Coluna de Grupo (Coluna M)
```
1. Em Store_Agencia, verificar se coluna M já tem "Grupo"
2. Se não tiver, criar cabeçalho em M1: "Grupo"
3. Preencher manualmente cada agência com 1, 2 ou 3:

GRUPO 1: 1
   - São Joaquim
   - Canoinhas
   - Lages (ambas)
   - Porto União

GRUPO 2: 2
   - Correia Pinto
   - Otacílio Costa
   - Irineópolis
   - Major Vieira

GRUPO 3: 3
   - Bom Jardim da Serra
   - Timbó Grande
   - Monte Castelo
   - Ponte Alta
   - Bela Vista do Toldo
   - Santa Cruz do Timbó
```

### Passo 6.2: Criar Coluna de Ranking no Grupo (Coluna N)
```
Célula N1: Posicao_no_Grupo

Célula N2:
=CONTARSES(Store_Agencia!M:M; M2; Store_Agencia!L:L; ">"&L2) + 1

Explicação:
- Procura agências do MESMO grupo (coluna M)
- Conta quantas têm MAIS pontos (coluna L) que a atual
- Soma 1 para obter a posição (1º, 2º, 3º, etc)
- NOTA: Usar PONTO-E-VÍRGULA (;)

Copiar para N:N
```

### Passo 6.3: Criar Coluna de Premiação (Coluna O)
```
Célula O1: Premiacao

Célula O2:
=SE(N2=1;"🥇 1º - R$ 3.000";
    SE(N2=2;"🥈 2º - R$ 750";
       SE(N2=3;"🥉 3º - R$ 500"; "")))

Copiar para O:O
Resultado: Mostra premiação apenas para 1º, 2º e 3º lugar
NOTA: Usar PONTO-E-VÍRGULA (;) e não VÍRGULA (,)
```

---

## FASE 7: PLACAR OCULTO (10 minutos)

### Passo 7.1: Criar Coluna de Ranking Visível (Coluna P)
```
Célula P1: Ranking_Visivel

Célula P2:
=SE(HOJE() <= DATA(2026;8;15);
    N2;
    SE(HOJE() <= DATA(2026;8;31);
       "🔐 OCULTO";
       N2))

Copiar para P:P

Explicação:
- Até 15/08: mostra posição real (1º, 2º, 3º, etc)
- 16/08 a 31/08: mostra "🔐 OCULTO" (placar escondido)
- Após 31/08: mostra posição real novamente
- NOTA: Usar PONTO-E-VÍRGULA (;) em toda fórmula
```

### Passo 7.2: Usar Ranking_Visivel no Dashboard
```
⚠️ NO CÓDIGO DO APPS SCRIPT (codigo.gs):
   - Substituir referência de Posicao_no_Grupo
   - Usar coluna P (Ranking_Visivel) para exibir no dashboard

No HTML (Album.html):
   - Quando campo = "🔐 OCULTO": não exibir número
   - Exibir apenas o ícone de cadeado
```

---

## FASE 8: VALIDAÇÃO FINAL (30 minutos)

### Passo 8.1: Validar Aba Resumo_Gerentes
```
☐ Todos os gerentes aparecem (lista única)?
☐ Agência preenchida para cada gerente (lookup)?
☐ Ativo_Comercial > 0 para alguns gerentes?
☐ Seguro_Vida * 2 está correto?
☐ Consórcio * 4 está correto?
☐ Depósitos_Totais / 10000 * 4 está correto?
☐ Crédito_Comercial / 10000 * 4 está correto?
☐ Capital_Social / 10000 * 5 está correto?
☐ Gols_Junho > 0 para algumas linhas?
☐ Gols_Julho > 0 para algumas linhas?
☐ Gols_Julho_1_5x = Gols_Julho * 1.5?
☐ Pontos_Finais_Jun_Ago = Junho + Julho_1.5x + Agosto?
```

### Passo 8.2: Validar Store_Agencia (Agregação)
```
☐ Coluna L (Pontos_Finais_Jun_Ago) preenchida?
☐ Todas as agências têm valor > 0?
☐ Soma de gerentes bate exatamente com agência?
☐ Coluna M (Grupo) preenchida para todas?
☐ Coluna N (Posicao_no_Grupo) calculada corretamente?
☐ Coluna O (Premiacao) mostra 🥇 🥈 🥉?
☐ Coluna P (Ranking_Visivel) mostra 🔐 OCULTO ou número?
```

### Passo 8.3: Teste Manual - Agência de Teste
```
Escolher 1 agência com 2-3 gerentes:

1. Ir para "Resumo_Gerentes"
   - Localizar os gerentes dessa agência
   - Somar Pontos_Finais (coluna N)
   - Anotar resultado (ex: 500 pontos)

2. Ir para "Store_Agencia"
   - Localizar a mesma agência
   - Ver coluna L
   - Deve ser EXATAMENTE 500 pontos

❌ Se não bater: revisar fórmula SUMIF
```

### Passo 8.4: Teste Manual - Ranking
```
1. Ir para "Store_Agencia"
2. Procurar agência com MAIOR valor em coluna L
3. Verificar se coluna N mostra "1"
4. Procurar agência com SEGUNDO maior valor
5. Verificar se coluna N mostra "2"
6. Procurar agência com TERCEIRO maior valor
7. Verificar se coluna N mostra "3"

❌ Se ranking estiver errado: revisar fórmula COUNTIFS
```

### Passo 8.5: Teste de Placar Oculto
```
Data Atual: verificar em TODAY()

SE data HOJE está entre 16/08 e 31/08:
   - Coluna P deve mostrar "🔐 OCULTO"
   - ✓ Correto

SE data HOJE está fora dessa faixa:
   - Coluna P deve mostrar número (1, 2, 3, etc)
   - ✓ Correto
```

### Passo 8.6: Teste de Multiplicador 1.5x
```
1. Ir para "Resumo_Gerentes"
2. Selecionar 1 gerente com Gols_Julho > 0
3. Verificar: Gols_Julho_1_5x = Gols_Julho * 1.5?
4. Exemplo: Se Julho = 100, então Julho_1.5x deve ser 150
   ✓ Correto

5. Verificar Pontos_Finais = Junho + Julho_1.5x + Agosto
   Exemplo: 80 + 150 + 100 = 330
   ✓ Correto
```

---

## 🎯 RESUMO DE AÇÕES

| # | Fase | Tempo | Status |
|---|------|-------|--------|
| 1 | Preparação e verificação | 10 min | ⬜ |
| 2 | Criar aba Resumo_Gerentes + fórmulas | 45 min | ⬜ |
| 3 | Agrupar pontos por mês (Jun/Jul/Ago) | 30 min | ⬜ |
| 4 | Tratar inadimplência + total final | 20 min | ⬜ |
| 5 | Agregação por agência (Store_Agencia) | 25 min | ⬜ |
| 6 | Ranking e grupos (posição) | 20 min | ⬜ |
| 7 | Placar oculto (agosto 16-31) | 10 min | ⬜ |
| 8 | Validação final (testes manuais) | 30 min | ⬜ |
| **TOTAL** | | **190 min (3.2 horas)** | ⬜ |

---

## ⚠️ PONTOS CRÍTICOS

1. **Estrutura de Dados: FORMATO NORMALIZADO**
   - Cada linha = gerente + indicador (não é pivô)
   - Use COUNTIFS e SUMIFS com filtro de indicador

2. **Datas: Junho-Agosto APENAS**
   - Usar DATE(2024,6,1) a DATE(2024,8,31)
   - Nenhum outro mês deve ser incluído

3. **Multiplicador 1.5x em Julho**
   - Coluna M = Coluna K * 1.5
   - Sem isso, pontos finais ficarão errados

4. **Agregação: Gerente = Agência**
   - Soma de todos os gerentes de 1 agência = pontos da agência
   - DEVE bater EXATAMENTE (diferença = erro de fórmula)

5. **Ranking por Grupo**
   - COUNTIFS deve comparar MESMO grupo
   - Contar quantas agências têm MAIS pontos

6. **Placar Oculto: 16/08 a 31/08**
   - IF(TODAY() <= DATE(2024,8,31) AND TODAY() >= DATE(2024,8,16))
   - Mostrar "🔐 OCULTO" neste período

---

## 📋 CHECKLIST ANTES DE COMEÇAR

- [ ] Leu toda a Fase 1 e confirmou estrutura?
- [ ] Tem acesso completo ao Google Sheets?
- [ ] Backup da planilha feito?
- [ ] Pronto para 3.2 horas de implementação?

---

**Próximo Passo:** Iniciar Phase 1 (Preparação). Após completar cada fase, notifique para validação! ✅
