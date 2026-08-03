# 🚀 GUIA PASSO A PASSO - Implementar Dashboard Copa Excelência

## FASE 1: PREPARAÇÃO (15 minutos)

### Passo 1.1: Abrir Google Sheets da Copa
```
1. Abrir: https://docs.google.com/spreadsheets/
2. Procurar por: "Copa Excelência" ou "Planilha Copa"
3. Abrir a planilha
4. Verificar abas disponíveis (você deve ver):
   ✓ Store_Agencia
   ✓ Store_Gerente
   ✓ Store_Carteira
   ✓ Configurações_Dashboard (ou similar)
```

### Passo 1.2: Verificar Estrutura de Store_Gerente
```
Clicar na aba "Store_Gerente"
Verificar se tem as colunas:
✓ Data
✓ Gerente
✓ Agência
✓ Ativo Comercial
✓ Seguro de Vida
✓ Consórcio
✓ Depósitos Totais
✓ Crédito Comercial
✓ Capital Social
✓ Inad 15 (atual)

Se faltarem colunas: PARAR e avisar
```

### Passo 1.3: Verificar Estrutura de Store_Agencia
```
Clicar na aba "Store_Agencia"
Verificar se tem:
✓ Agência (nome)
✓ Grupo (1, 2 ou 3)
✓ [NOVA] Coluna para Pontos (será criada)
```

---

## FASE 2: CRIAR COLUNA DE PONTOS PARA GERENTES (30 minutos)

### Passo 2.1: Ir para Store_Gerente
```
1. Clicar na aba "Store_Gerente"
2. Descer até encontrar a primeira coluna vazia
   Exemplo: se as colunas vão até K, usar L
3. Na primeira linha vazia, adicionar cabeçalho:
   Escrever: "Pontos_Jun_Ago_Fase1"
   Pressionar Enter
```

### Passo 2.2: Adicionar Coluna de Fase
```
1. Próxima coluna vazia (ex: M), adicionar:
   "Fase" como cabeçalho
   
2. Fórmula para a 2ª linha:
   =IF(MONTH(A2)=6,1,IF(MONTH(A2)=7,2,IF(MONTH(A2)=8,3,"")))
   
   Explicação: Retorna fase (1=Jun, 2=Jul, 3=Ago)
```

### Passo 2.3: Adicionar Coluna de Multiplicador
```
1. Próxima coluna vazia (ex: N), adicionar:
   "Multiplicador" como cabeçalho
   
2. Fórmula:
   =IF(M2=2,1.5,1)
   
   Explicação: Julho (fase 2) = 1.5x, outros = 1.0x
```

### Passo 2.4: Adicionar Coluna de Gols Calculados
```
1. Próxima coluna vazia (ex: O), adicionar:
   "Gols_Jun_Ago" como cabeçalho
   
2. Fórmula complexa (copiar exatamente):
   =IF(AND(MONTH(A2)>=6,MONTH(A2)<=8),
     INT(IF(B2<>"",
       (IF(C2>0,1,0) +
        IF(D2>0,2,0) +
        IF(E2>0,4,0) +
        INT(F2/10000)*4 +
        INT(G2/10000)*4 +
        INT(H2/10000)*5),
       0)) * N2,
     0)
```

### Passo 2.5: Copiar Fórmula para Todas as Linhas
```
1. Clicar na célula com a fórmula (ex: O2)
2. Copiar (Ctrl+C)
3. Selecionar a coluna O inteira (de O2 até a última linha)
4. Colar (Ctrl+V)
5. Aguardar o cálculo
```

---

## FASE 3: TRATAR INADIMPLÊNCIA (20 minutos)

### Passo 3.1: Criar Coluna de Inad 15 Base (Dezembro)
```
1. Próxima coluna vazia (ex: P), adicionar:
   "Inad15_Base_Dec" como cabeçalho
   
2. Fórmula (simular base de dezembro = valor atual):
   =IF(MONTH(A2)=8, H2, "")
```

### Passo 3.2: Criar Coluna de Inad 15 Atual
```
1. Próxima coluna vazia (ex: Q), adicionar:
   "Inad15_Atual" como cabeçalho
   
2. Fórmula:
   =IF(MONTH(A2)=8, I2, "")
```

### Passo 3.3: Calcular Gols de Inadimplência
```
1. Próxima coluna vazia (ex: R), adicionar:
   "Gols_Inadimplencia" como cabeçalho
   
2. Fórmula:
   =IF(AND(MONTH(A2)>=6,MONTH(A2)<=8),
     IF(Q2<P2, (P2-Q2)*2, IF(Q2>P2, (Q2-P2)*-5, 0)),
     0)
```

### Passo 3.4: TOTAL FINAL (com Inadimplência)
```
1. Próxima coluna vazia (ex: S), adicionar:
   "Pontos_Finais_Jun_Ago" como cabeçalho
   
2. Fórmula:
   =O2 + R2
```

### Passo 3.5: Copiar Todas as Fórmulas
```
1. Selecionar coluna P até S (P2:S2)
2. Copiar (Ctrl+C)
3. Selecionar P até última linha (P:S)
4. Colar (Ctrl+V)
5. Aguardar cálculo
```

---

## FASE 4: AGREGAÇÃO POR AGÊNCIA (25 minutos)

### Passo 4.1: Preparar Store_Agencia
```
1. Ir à aba "Store_Agencia"
2. Inserir coluna nova para "Pontos_Jun_Ago"
   Exemplo: depois da última coluna usada
```

### Passo 4.2: Criar Fórmula de Soma por Agência
```
1. Na linha 2 da coluna de Pontos, inserir:
   =SUMIF(Store_Gerente!B:B, A2, Store_Gerente!S:S)
   
   Resultado: SOMA de todos os gerentes da agência
```

### Passo 4.3: Copiar Fórmula para Todas Agências
```
1. Copiar a fórmula
2. Colar em todas as linhas de agências
3. Verificar se os valores aparecem
```

### Passo 4.4: VALIDAÇÃO CRÍTICA
```
⚠️ VERIFICAR AGORA:

1. Abrir Store_Gerente
2. Ver um gerente qualquer (ex: linha 2)
3. Anotar a agência dele (coluna B)
4. Anotar os pontos finais (coluna S)

5. Ir para Store_Agencia
6. Procurar pela agência desse gerente
7. Os pontos devem ser >= ao gerente

8. Se a agência tem só UM gerente:
   Os pontos devem ser EXATAMENTE IGUAIS
   
Se não forem iguais:
❌ PARAR e avisar qual é o problema
```

---

## FASE 5: RANKING E GRUPOS (20 minutos)

### Passo 5.1: Inserir Coluna de Grupo
```
1. Em Store_Agencia, verificar se já tem coluna "Grupo"
2. Se não tiver, criar e preencher:
   
   GRUPO 1:
   - São Joaquim
   - Canoinhas
   - Lages (ambas)
   - Porto União
   
   GRUPO 2:
   - Correia Pinto
   - Otacílio Costa
   - Irineópolis
   - Major Vieira
   
   GRUPO 3:
   - Bom Jardim da Serra
   - Timbó Grande
   - Monte Castelo
   - Ponte Alta
   - Bela Vista do Toldo
   - Santa Cruz do Timbó
```

### Passo 5.2: Ranking Dentro do Grupo
```
1. Inserir coluna "Posição_no_Grupo"
2. Fórmula:
   =COUNTIFS(Store_Agencia!D:D, D2, Store_Agencia!S:S, ">"&S2) + 1
   
   Explicação: Conta quantas agências do mesmo grupo têm pontos maiores + 1
```

### Passo 5.3: Identificar 1º, 2º, 3º Lugar
```
1. Próxima coluna: "Premiação"
2. Fórmula:
   =IF(Posicao_Grupo=1,"🥇 1º - R$ 3.000",
       IF(Posicao_Grupo=2,"🥈 2º - R$ 750",
          IF(Posicao_Grupo=3,"🥉 3º - R$ 500", "")))
```

---

## FASE 6: PLACAR OCULTO (10 minutos)

### Passo 6.1: Criar Coluna de Status
```
1. Inserir coluna "Ranking_Visivel"
2. Fórmula:
   =IF(TODAY()<=DATE(2024,8,15),
       POSICAO_NO_GRUPO,
       IF(TODAY()<=DATE(2024,8,31),
          "🔐 OCULTO",
          POSICAO_NO_GRUPO))
```

### Passo 6.2: Atualizar Visualização do Dashboard
```
1. No seu dashboard visual (se tiver um):
   - Usar coluna "Ranking_Visivel" em vez de "Posicao_no_Grupo"
   - Quando aparecer "OCULTO", não mostrar número
```

---

## FASE 7: VALIDAÇÃO FINAL (30 minutos)

### Passo 7.1: Checklist de Validação
```
☐ Todos os gerentes têm pontos calculados?
☐ Todas as agências têm soma de gerentes?
☐ Gerente = Agência quando agência tem 1 gerente?
☐ Multiplicador 1.5x está aplicado em Julho?
☐ Inadimplência está calculando corretamente?
☐ Ranking por grupo está correto?
☐ 1º, 2º, 3º lugar identificados?
☐ Placar oculto ativo em 16-31 agosto?
```

### Passo 7.2: Teste de Uma Agência
```
Escolher UMA agência conhecida:

1. Ver quantos gerentes tem em Store_Gerente
2. Somar pontos finais desses gerentes
3. Ir em Store_Agencia e conferir se bate
4. Se não bater, voltar ao Passo 2 e revisar fórmulas
```

### Passo 7.3: Teste de Ranking
```
1. Ir em Store_Agencia
2. Procurar agência com mais pontos
3. Verificar se está em 1º lugar
4. Procurar 2ª e 3ª maiores
5. Verificar se ranking está correto
```

---

## 🎯 RESUMO DE AÇÕES

| # | Ação | Tempo | Status |
|---|------|-------|--------|
| 1 | Preparar e verificar estrutura | 15 min | ⬜ |
| 2 | Criar colunas de pontos (gerente) | 30 min | ⬜ |
| 3 | Tratar inadimplência | 20 min | ⬜ |
| 4 | Agregar para agências | 25 min | ⬜ |
| 5 | Ranking e grupos | 20 min | ⬜ |
| 6 | Placar oculto | 10 min | ⬜ |
| 7 | Validação final | 30 min | ⬜ |
| **TOTAL** | | **150 min (2.5 horas)** | ⬜ |

---

## ⚠️ PONTOS DE ATENÇÃO

1. **Multiplicador 1.5x é CRÍTICO em Julho**
   - Se esquecer, resultado final fica errado
   
2. **Gerente = Agência deve bater EXATAMENTE**
   - Se não bater, há erro na fórmula
   
3. **Período é JUNHO A AGOSTO apenas**
   - Qualquer outro mês deve ser excluído
   
4. **Placar oculto começa em 16/08**
   - Antes disso mostra ranking
   - Depois de 31/08 volta a mostrar

---

**Próximo:** Após completar tudo, avise para validação final! ✅
